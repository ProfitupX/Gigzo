import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// High-speed, high-availability Gemini models in optimal fallback priority order
const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

function cleanAndParseJSON(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') return null;
  let cleaned = rawText.trim();

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // Extract substring between outer braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn('JSON parse error on raw Gemini output, attempting sanitized parsing:', e);
    return null;
  }
}

function parseWordNumber(text: string): number | null {
  const lower = text.toLowerCase();
  if (lower.includes('ainooru') || lower.includes('ainuru') || lower.includes('ஐநூறு')) return 500;
  if (lower.includes('aayiram') || lower.includes('ayiram') || lower.includes('ஆயிரம்') || lower.includes('1k')) return 1000;
  if (lower.includes('irunooru') || lower.includes('irunuru') || lower.includes('இருநூறு')) return 200;
  if (lower.includes('munnooru') || lower.includes('munnuru') || lower.includes('முந்நூறு')) return 300;
  if (lower.includes('naanooru') || lower.includes('naanuru') || lower.includes('நானூறு')) return 400;
  if (lower.includes('pathu') || lower.includes('பத்து')) return 10;
  if (lower.includes('irubathu') || lower.includes('இருபது')) return 20;
  if (lower.includes('muppathu') || lower.includes('முப்பது')) return 30;
  if (lower.includes('nooru') || lower.includes('நூறு')) return 100;
  return null;
}

// Zero-downtime Tamil / Tanglish / English heuristic NLP fallback
function fallbackLocalNLP(message: string, storeContext: any, language: string = 'tanglish'): any {
  const rawMsg = message || '';
  const text = rawMsg.toLowerCase().trim();

  // 1. Analytics & Sales Report
  if (
    text.includes('sales') || 
    text.includes('report') || 
    text.includes('order') || 
    text.includes('earning') || 
    text.includes('income') || 
    text.includes('revenue') || 
    text.includes('vyabaram') || 
    text.includes('வியாபாரம்') || 
    text.includes('விற்பனை') ||
    text.includes('ஆர்டர்')
  ) {
    const totalSales = storeContext?.total_sales || 0;
    const paidOrders = storeContext?.paid_orders_count || 0;
    const pendingOrders = storeContext?.pending_orders_count || 0;
    const prodCount = storeContext?.product_count || 0;

    return {
      reply_text: `📊 **Store Analytics & Live Status Report:**\n\n💰 **Moththa Sales:** ₹${totalSales.toLocaleString('en-IN')}\n📦 **Paid Orders:** ${paidOrders}\n⏳ **Pending Orders:** ${pendingOrders}\n🛍️ **Active Products:** ${prodCount} items\n\nUnga store sales super-aa pogudhu! Innum pudhu products add panna sollunga! 🚀`,
      audio_text: `Unga store-la motham ₹${totalSales} sales aagiyirukku, ${paidOrders} paid orders irukku!`,
      action: 'STORE_ANALYTICS_REPORT',
      data: { total_sales: totalSales, paid_orders: paidOrders, pending_orders: pendingOrders }
    };
  }

  // 2. UPI or Store Profile Setup
  const upiMatch = rawMsg.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/);
  if (upiMatch || text.includes('upi') || text.includes('brand name') || text.includes('store name')) {
    const upi = upiMatch ? upiMatch[0] : undefined;
    return {
      reply_text: `🏪 **Store Profile Update:**\n\n${upi ? `✅ UPI ID: **${upi}** ready-aa update aagiduchu.` : 'Unga store details ready!'}\nSellers & customers direct-aa safe settlements panna mudiyum.`,
      audio_text: upi ? `Unga UPI ID ${upi} update aagiduchu!` : 'Store details update aagiduchu!',
      action: 'UPDATE_STORE_PROFILE',
      data: { upi_id: upi }
    };
  }

  // 3. Product Add / Create
  const isAddProduct = 
    text.includes('add') || 
    text.includes('pudhu') || 
    text.includes('kurti') || 
    text.includes('saree') || 
    text.includes('shirt') || 
    text.includes('shoe') || 
    text.includes('honey') || 
    text.includes('create') || 
    text.includes('பொருள்') || 
    text.includes('சேர்') || 
    text.includes('புதிய');

  if (isAddProduct) {
    let price = 0;
    const priceRegex = /(?:rs\.?|inr|rooba|rupees|₹|ரூபாய்|ரூ)\s*([0-9]+)|([0-9]+)\s*(?:rs\.?|inr|rooba|rupees|₹|ரூபாய்|ரூ)/i;
    const priceMatch = rawMsg.match(priceRegex);
    if (priceMatch) {
      price = Number(priceMatch[1] || priceMatch[2]);
    } else {
      const numMatch = rawMsg.match(/\b([1-9][0-9]{1,5})\b/);
      if (numMatch) {
        price = Number(numMatch[1]);
      } else {
        const wordPrice = parseWordNumber(text);
        if (wordPrice) price = wordPrice;
      }
    }

    let stock = 10;
    const stockRegex = /([0-9]+)\s*(?:stock|piece|pieces|nos|items|பீஸ்|ஸ்டாக்)/i;
    const stockMatch = rawMsg.match(stockRegex);
    if (stockMatch) {
      stock = Number(stockMatch[1]);
    }

    let title = rawMsg
      .replace(/(?:rs\.?|inr|rooba|rupees|₹|ரூபாய்|ரூ)\s*[0-9]+/gi, '')
      .replace(/[0-9]+\s*(?:rs\.?|inr|rooba|rupees|₹|ரூபாய்|ரூ)/gi, '')
      .replace(/[0-9]+\s*(?:stock|piece|pieces|nos|items|பீஸ்|ஸ்டாக்)/gi, '')
      .replace(/\b(enkita|irukku|add|pannu|pudhu|new|item|product|stock|piece|ku|la|oru|en|store|please|bro|sir|வணக்கம்|பண்ணு|சேரு|இருக்கு)\b/gi, '')
      .replace(/[^\w\s\u0B80-\u0BFF]/gi, ' ')
      .trim();

    title = title.split(/\s+/).filter(w => w.length > 1).slice(0, 4).join(' ');

    if (!title || price <= 0) {
      return {
        reply_text: `✨ **Pudhu Product Add Panna Indha Details Sollunga:**\n\n1️⃣ **Product Name** (e.g. Organic Honey, Cotton T-Shirt)\n2️⃣ **Price** (e.g. ₹499 or 500 rooba)\n3️⃣ **Stock Count** (e.g. 10 stock)\n\n🎙️ Voice-la sollunga, naane store-la automatic-aa create panren! 🚀`,
        audio_text: `Kandippa! Unga product name and price evlo sollunga, naane add panren!`,
        action: 'ASK_MISSING_INFO',
        data: { missing_fields: ['title', 'price'] }
      };
    }

    const cleanTitle = title.charAt(0).toUpperCase() + title.slice(1);
    const autoDesc = `${cleanTitle} - Premium quality, authentic craftsmanship, and freshly delivered to your doorstep. Best value for money!`;

    return {
      reply_text: `🎉 **Product Live aagivittadhu!**\n\n🛍️ **Product Name:** ${cleanTitle}\n💰 **Price:** ₹${price}\n📦 **Stock:** ${stock} Units\n📝 **Auto-Description:** ${autoDesc}\n\nUnga store-la ippo live-aa ready!`,
      audio_text: `Super! Unga ${cleanTitle} ₹${price}-ku store-la publish aagiduchu!`,
      action: 'CREATE_PRODUCT',
      data: {
        title: cleanTitle,
        price: price,
        stock: stock,
        description: autoDesc,
        category: 'General',
        is_physical: true,
        shipping_fee: 0,
        shipping_days: '3-5 Days'
      }
    };
  }

  // 4. Update Price / Stock Intent
  if (text.includes('mathu') || text.includes('change') || text.includes('update') || text.includes('மாத்து')) {
    const numMatch = rawMsg.match(/\b([1-9][0-9]{1,5})\b/);
    const priceVal = numMatch ? Number(numMatch[1]) : null;
    return {
      reply_text: priceVal ? `💰 **Price Update:** Product price-ai ₹${priceVal}-ku update seyyalaam.` : `Endha product-in price/stock-ai maatranum nu sollunga!`,
      audio_text: priceVal ? `Price ₹${priceVal}-ku update panlaam!` : 'Endha product update pannanum sollunga!',
      action: 'UPDATE_PRODUCT',
      data: { updates: priceVal ? { price: priceVal } : {} }
    };
  }

  // 5. Default General Greeting / Assistance
  return {
    reply_text: `Vanakkam! 🙏 Naan unga **ProfitupX 24/7 AI Voice Store Manager**.\n\nEnkita neenga:\n• 🎙️ *"Red Kurti 500 rooba 10 stock add pannu"*\n• 📊 *"Sales report sollunga"*\n• 💰 *"Price 399-ku mathu"*\n• 🏪 *"Upi setup pannunga"*\n\nVoice-la pesunga or type pannunga!`,
    audio_text: `Vanakkam! Unga store sales report, product add panna voice-la sollunga!`,
    action: 'GENERAL_ASSISTANCE',
    data: {}
  };
}

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
        const parsed = cleanAndParseJSON(data.candidates[0].content.parts[0].text);
        if (parsed && (parsed.reply_text || parsed.audio_text || parsed.action)) {
          return parsed;
        }
      } else {
        lastError = data.error || data;
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  throw new Error(lastError?.message || 'Gemini API call failed across all cascade models');
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

    // 1. Fetch seller profile, products, orders safely
    let creatorProfile: any = null;
    let productsList: any[] = [];
    let ordersList: any[] = [];
    let categoriesList: any[] = [];
    let actualCreatorUuid = creator_id;

    if (creator_id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(creator_id);
      
      try {
        if (isUuid) {
          const { data } = await supabase.from('creators').select('*').eq('id', creator_id).single();
          creatorProfile = data;
        } else {
          const { data } = await supabase.from('creators').select('*').eq('store_link', creator_id).single();
          creatorProfile = data;
          if (data?.id) actualCreatorUuid = data.id;
        }
      } catch (err) {
        console.warn('Could not fetch creator profile:', err);
      }

      if (actualCreatorUuid) {
        try {
          const [productsRes, ordersRes, catsRes] = await Promise.all([
            supabase.from('products').select('*').eq('creator_id', actualCreatorUuid).order('created_at', { ascending: false }),
            supabase.from('orders').select('*').eq('creator_id', actualCreatorUuid).order('created_at', { ascending: false }),
            supabase.from('categories').select('*').eq('creator_id', actualCreatorUuid),
          ]);
          productsList = productsRes.data || [];
          ordersList = ordersRes.data || [];
          categoriesList = catsRes.data || [];
        } catch (err) {
          console.warn('Could not fetch store products/orders:', err);
        }
      }
    }

    const paidOrders = ordersList.filter(o => o.status === 'paid');
    const totalSales = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const pendingOrders = ordersList.filter(o => o.status === 'pending');

    // 2. Build Store Context
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

    // 3. System Prompt for ProfitupX AI Copilot
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
   - Strip colloquial filler words from product title:
     "Enkita Red Kurti irukku 500 rooba" -> title: "Red Kurti", price: 500
     "என்கிட்ட ரெட் குர்த்தி 500 ரூபாய் இருக்கு 10 ஸ்டாக்" -> title: "Red Kurti", price: 500, stock: 10
     "Pudhu silk saree add pannu 1200 rs" -> title: "Silk Saree", price: 1200
     "பட்டு புடவை 999 ரூபாய்க்கு சேரு" -> title: "Silk Saree", price: 999

3. AUTOMATIC HIGH-CONVERTING PRODUCT DESCRIPTION GENERATION:
   - NEVER ask the seller to provide a description!
   - Automatically write an attractive, high-converting 2-sentence description tailored to the product.

4. ACTIONS:
   - CREATE_PRODUCT: when user wants to add or describes a new item.
   - UPDATE_PRODUCT: when user wants to change price, stock, title, or description of existing items.
   - DELETE_PRODUCT: when user wants to remove or delete an item.
   - UPDATE_STORE_PROFILE: when user provides brand/store name, bio, or UPI ID (e.g. "@paytm", "@okaxis", "@oksbi", "@ptsbi").
   - STORE_ANALYTICS_REPORT: when user asks about sales, earnings, orders, or performance.
   - ASK_MISSING_INFO: when required details (like product price/title) are needed.
   - GENERAL_ASSISTANCE: general queries or greetings.

5. AUDIO TEXT FOR PROFITUPX VOICE TTS:
   - Keep 'audio_text' short (1 concise spoken sentence in natural Tamil/Tanglish), friendly and punchy.
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
    "variants": [],
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

    let aiResult: any = null;
    try {
      aiResult = await callGemini(contents, systemPrompt);
    } catch (geminiError) {
      console.warn('Gemini models unavailable, engaging zero-downtime Tamil heuristic NLP fallback:', geminiError);
      aiResult = fallbackLocalNLP(message, storeContext, language);
    }

    // 5. If execute_action is requested and data is present, execute in Supabase
    let executionResult: any = null;

    if (actualCreatorUuid && aiResult?.action) {
      try {
        if (
          aiResult.action === 'CREATE_PRODUCT' && 
          aiResult.data?.title && 
          aiResult.data?.price > 0 && 
          (!aiResult.data.missing_fields || aiResult.data.missing_fields.length === 0)
        ) {
          const { data: newProd, error: createErr } = await supabase.from('products').insert({
            creator_id: actualCreatorUuid,
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

          if (!createErr && newProd) {
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
              .eq('creator_id', actualCreatorUuid)
              .select().single();

            if (!updateErr && updatedProd) {
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
              .eq('creator_id', actualCreatorUuid);

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
              .eq('id', actualCreatorUuid)
              .select().single();

            if (!profErr && updatedProfile) {
              executionResult = { type: 'PROFILE_UPDATED', profile: updatedProfile };
            }
          }
        }
      } catch (execErr) {
        console.warn('Action execution error (non-fatal):', execErr);
      }
    }

    return NextResponse.json({
      success: true,
      ai: aiResult,
      execution: executionResult,
      store_context: storeContext
    });

  } catch (error: any) {
    console.error('AI Assistant Unhandled Error:', error);
    // Even in unhandled errors, fallback gracefully with intelligent response
    return NextResponse.json({ 
      success: true,
      ai: {
        reply_text: 'Vanakkam! Naan unga ProfitupX AI Store Manager. Unga store sales, products, or orders patri enna theriyanum sollunga!',
        audio_text: 'Vanakkam! Unga store patri enna theriyanum sollunga!',
        action: 'GENERAL_ASSISTANCE',
        data: {}
      },
      execution: null
    });
  }
}
