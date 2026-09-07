import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Fallback models in priority order
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];

async function callGemini(contents: any[], systemInstruction?: string) {
  let lastError: any = null;
  
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload: any = {
        contents,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return JSON.parse(data.candidates[0].content.parts[0].text);
      } else {
        lastError = data.error || data;
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  throw new Error(lastError?.message || 'Failed to call Gemini API');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      message, 
      language = 'tanglish', 
      creator_id, 
      conversation_history = [],
      execute_action = false 
    } = body;

    if (!message && !body.action_trigger) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch seller profile, products, orders to ground AI with real store data
    let creatorProfile: any = null;
    let productsList: any[] = [];
    let ordersList: any[] = [];
    let categoriesList: any[] = [];

    if (creator_id) {
      const [creatorRes, productsRes, ordersRes, catsRes] = await Promise.all([
        supabase.from('creators').select('*').eq('id', creator_id).single(),
        supabase.from('products').select('*').eq('creator_id', creator_id).order('created_at', { ascending: false }),
        supabase.from('orders').select('*').eq('creator_id', creator_id).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').eq('creator_id', creator_id),
      ]);

      creatorProfile = creatorRes.data;
      productsList = productsRes.data || [];
      ordersList = ordersRes.data || [];
      categoriesList = catsRes.data || [];
    }

    const paidOrders = ordersList.filter(o => o.status === 'paid');
    const totalSales = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const pendingOrders = ordersList.filter(o => o.status === 'pending');

    // 2. Build Store Context for Gemini
    const storeContext = {
      brand_name: creatorProfile?.brand_name || 'My Store',
      bio: creatorProfile?.bio || '',
      upi_id: creatorProfile?.upi_id || 'Not set',
      store_link: creatorProfile?.store_link || creator_id,
      is_verified: creatorProfile?.is_verified || false,
      product_count: productsList.length,
      products: productsList.slice(0, 30).map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        stock: p.stock,
        category: p.category,
        is_physical: p.is_physical
      })),
      total_sales: totalSales,
      orders_count: ordersList.length,
      paid_orders_count: paidOrders.length,
      pending_orders_count: pendingOrders.length,
    };

    // 3. High-Precision System Prompt for ProfitupX AI Copilot
    const systemPrompt = `
You are the hyper-intelligent 24/7 AI Store Manager for ProfitupX.
You understand spoken & written Tamil, Tanglish (Tamil written in English script), Indian English, and Hindi with 100% precision.

Current Store Data:
${JSON.stringify(storeContext, null, 2)}

User Selected Language Preference: ${language}

Extraction Guidelines (VERY IMPORTANT):
1. NUMBER & CURRENCY PARSING (Supports Tamil Script, Tanglish & English):
   - "ainooru" / "500 rooba" / "500 rs" / "ரூ 500" / "500 ரூபாய்" / "ஐநூறு" -> price: 500
   - "aayiram" / "1000 rooba" / "1k" / "1000 ரூபாய்" / "ஆயிரம்" -> price: 1000
   - "irunooru" / "200 ரூபாய்" / "இருநூறு" -> price: 200
   - "munnooru" / "300 ரூபாய்" / "முந்நூறு" -> price: 300
   - "pathu" / "10 stock" / "10 piece" / "10 ஸ்டாக்" / "10 பீஸ்" / "பத்து" -> stock: 10
   - "irubathu" / "20 piece" / "20 ஸ்டாக்" / "இருபது" -> stock: 20

2. CLEAN PRODUCT TITLE EXTRACTION:
   - Strip colloquial filler words from product title (whether in English, Tanglish, or Tamil script):
     "Enkita Red Kurti irukku 500 rooba" -> title: "Red Kurti", price: 500
     "என்கிட்ட ரெட் குர்த்தி 500 ரூபாய் இருக்கு 10 ஸ்டாக்" -> title: "Red Kurti", price: 500, stock: 10
     "Pudhu silk saree add pannu 1200 rs" -> title: "Silk Saree", price: 1200
     "பட்டு புடவை 999 ரூபாய்க்கு சேரு" -> title: "Silk Saree", price: 999
     "Black shoe stock 15 mathu" -> target_product_title: "Black shoe", updates: { stock: 15 }
     "விலை 399 மாத்து" -> updates: { price: 399 }

3. AUTOMATIC HIGH-CONVERTING PRODUCT DESCRIPTION GENERATION:
   - NEVER ask the seller to provide a description!
   - Whenever creating a product, YOU must automatically write an attractive, high-converting, realistic 2-3 sentence description tailored to the product (e.g. for "Gulab Jamun": "Soft, juicy, and sweet Gulab Jamuns soaked in fragrant cardamom sugar syrup. Made fresh with pure ingredients for all your sweet celebrations!" or for "Silk Saree": "Exquisite handwoven Silk Saree with rich zari border and elegant pallu. Perfect for festive occasions and weddings!").

4. STRUCTURED PRODUCT VARIATIONS (WEIGHTS, SIZES, COLORS):
   - If the user mentions sizes/weights/prices (e.g. "250g 120 rooba, 500g 450 rooba" or "S 399, M 499, L 599" or "S, M, L"):
     Extract as clean structured array: [{"name": "250g", "price": 120}, {"name": "500g", "price": 450}]
   - If variants have no separate prices (e.g. "Red, Blue, Green" or "S, M, L"):
     Extract as: [{"name": "S", "price": 499}, {"name": "M", "price": 499}, {"name": "L", "price": 499}]

5. COMPREHENSIVE PRODUCT CREATION STEP-BY-STEP (WHEN SELLER WANTS TO ADD A PRODUCT):
   - If the user says "Pudhu product add pannu" or "Add a product" without giving title/price:
     - Set action: "ASK_MISSING_INFO"
     - audio_text: "Kandippa! Unga product name enna, price & variations (e.g. 250g ₹120) evlo sollunga, naane ready panren!"
     - reply_text: "✨ **Pudhu Product Add Panna Indha Details Sollunga:**\n\n1️⃣ **Product Name** (பொருளின் பெயர் - e.g. Organic Honey, Cotton T-Shirt)\n2️⃣ **Price & Variations** (விலை & எடைகள் - e.g. 250g: ₹120, 500g: ₹450)\n3️⃣ **Physical or Digital** (பார்சல் அனுப்பக்கூடியதா அல்லது Online Course / PDF-aa?)\n4️⃣ **Stock Count** (எத்தனை ஸ்டாக் உள்ளது? - e.g. 15 stock)\n\n*(Product description-ai naanே கவர்ச்சிகரமாக தானாக எழுதிவிடுவேன்!)* 🚀"
   - If the user provides the title and price (e.g., "Organic Honey 250g 120, 500g 450, 20 stock"):
     - Automatically deduce category (e.g. "Food & Grocery" or "Fashion"), set is_physical: true, stock: 20, variants: [{"name":"250g","price":120},{"name":"500g","price":450}].
     - Automatically write a high-converting description.
     - Set action: "CREATE_PRODUCT".

6. ACTIONS:
   - CREATE_PRODUCT: when user wants to add or describes a new item.
   - UPDATE_PRODUCT: when user wants to change price, stock, title, or description of existing items.
   - DELETE_PRODUCT: when user wants to remove or delete an item.
   - UPDATE_STORE_PROFILE: when user provides brand/store name, bio, or UPI ID (e.g. "@paytm", "@okaxis", "@oksbi", "@ptsbi").
   - STORE_ANALYTICS_REPORT: when user asks about sales, earnings, orders, or performance.
   - ASK_MISSING_INFO: when required details (like product price/title) are needed.

7. CONCISE AUDIO TEXT FOR PROFITUPX VOICE TTS:
   - Keep 'audio_text' very short (1 concise sentence in natural spoken Tanglish or Tamil), friendly and punchy.
   - 'reply_text' can contain full markdown details, bullet points, and emojis for display.

STRICT JSON OUTPUT FORMAT ONLY:
{
  "reply_text": "Detailed readable response with emojis and formatting",
  "audio_text": "Short 1-sentence spoken version in natural Tamil/Tanglish for voice playback",
  "action": "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT" | "UPDATE_STORE_PROFILE" | "STORE_ANALYTICS_REPORT" | "ASK_MISSING_INFO" | "GENERAL_ASSISTANCE",
  "data": {
    "title": "...",
    "price": 0,
    "description": "...",
    "category": "...",
    "stock": 10,
    "is_physical": true,
    "shipping_fee": 0,
    "shipping_days": "3-5 Days",
    "variants": [{"name": "250g", "price": 120}, {"name": "500g", "price": 450}],
    "missing_fields": [],
    "target_product_id": "...",
    "target_product_title": "...",
    "updates": {},
    "brand_name": "...",
    "bio": "...",
    "upi_id": "...",
    "store_link": "..."
  }
}
`;

    // 4. Construct message contents
    const contents: any[] = [];
    
    // Add past history if provided
    if (Array.isArray(conversation_history)) {
      conversation_history.slice(-6).forEach((h: any) => {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.text }]
          });
        }
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message || 'Hello! What can you do for my store?' }]
    });

    const aiResult = await callGemini(contents, systemPrompt);

    // 5. If execute_action is requested and data is present, execute in Supabase
    let executionResult: any = null;

    if (creator_id && aiResult.action) {
      if (aiResult.action === 'CREATE_PRODUCT' && aiResult.data?.title && aiResult.data?.price > 0 && (!aiResult.data.missing_fields || aiResult.data.missing_fields.length === 0)) {
        const { data: newProd, error: createErr } = await supabase.from('products').insert({
          creator_id,
          title: aiResult.data.title,
          price: Number(aiResult.data.price),
          description: aiResult.data.description || `${aiResult.data.title} available now on my store.`,
          category: aiResult.data.category || 'General',
          is_physical: aiResult.data.is_physical ?? true,
          stock: Number(aiResult.data.stock) || 10,
          shipping_fee: Number(aiResult.data.shipping_fee) || 0,
          shipping_days: aiResult.data.shipping_days || '3-5 Days',
          variants: aiResult.data.variants || null
        }).select().single();

        if (!createErr) {
          executionResult = { type: 'PRODUCT_CREATED', product: newProd };
        }
      }

      if (aiResult.action === 'UPDATE_PRODUCT' && (aiResult.data?.target_product_id || aiResult.data?.target_product_title)) {
        let prodId = aiResult.data.target_product_id;
        if (!prodId && aiResult.data.target_product_title) {
          const match = productsList.find(p => 
            p.title.toLowerCase().includes(aiResult.data.target_product_title.toLowerCase())
          );
          if (match) prodId = match.id;
        }

        if (prodId && aiResult.data.updates && Object.keys(aiResult.data.updates).length > 0) {
          const { data: updatedProd, error: updateErr } = await supabase
            .from('products')
            .update(aiResult.data.updates)
            .eq('id', prodId)
            .eq('creator_id', creator_id)
            .select().single();

          if (!updateErr) {
            executionResult = { type: 'PRODUCT_UPDATED', product: updatedProd };
          }
        }
      }

      if (aiResult.action === 'DELETE_PRODUCT' && (aiResult.data?.target_product_id || aiResult.data?.target_product_title)) {
        let prodId = aiResult.data.target_product_id;
        if (!prodId && aiResult.data.target_product_title) {
          const match = productsList.find(p => 
            p.title.toLowerCase().includes(aiResult.data.target_product_title.toLowerCase())
          );
          if (match) prodId = match.id;
        }

        if (prodId) {
          const { error: delErr } = await supabase
            .from('products')
            .delete()
            .eq('id', prodId)
            .eq('creator_id', creator_id);

          if (!delErr) {
            executionResult = { type: 'PRODUCT_DELETED', productId: prodId };
          }
        }
      }

      if (aiResult.action === 'UPDATE_STORE_PROFILE' && aiResult.data) {
        const updateFields: any = {};
        if (aiResult.data.brand_name) updateFields.brand_name = aiResult.data.brand_name;
        if (aiResult.data.bio) updateFields.bio = aiResult.data.bio;
        if (aiResult.data.upi_id) updateFields.upi_id = aiResult.data.upi_id;
        if (aiResult.data.store_link) {
          updateFields.store_link = aiResult.data.store_link.toLowerCase().replace(/[^a-z0-9-]/g, '');
        }

        if (Object.keys(updateFields).length > 0) {
          const { data: updatedProfile, error: profErr } = await supabase
            .from('creators')
            .update(updateFields)
            .eq('id', creator_id)
            .select().single();

          if (!profErr) {
            executionResult = { type: 'PROFILE_UPDATED', profile: updatedProfile };
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      ai: aiResult,
      execution: executionResult,
      store_context: storeContext
    });

  } catch (error: any) {
    console.error('AI Assistant Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal AI assistant error',
      reply_text: 'Mannikanum, oru siru thavaru nadanthuvittathu. Meendum oru murai sollunga!',
      audio_text: 'Sorry, could not process that. Please try again.'
    }, { status: 500 });
  }
}
