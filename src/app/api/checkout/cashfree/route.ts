import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { product_id, buyer_name, buyer_email, buyer_phone, shipping_address, selectedVariant } = await request.json();

    if (!product_id || !buyer_name || !buyer_email || !buyer_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let basePrice = Number(product.price) || 0;
    let itemPrice = basePrice;

    if (selectedVariant) {
      const priceMatch = String(selectedVariant).match(/₹\s*(\d+)/);
      if (priceMatch) {
        itemPrice = Number(priceMatch[1]);
      } else {
        const cleanName = String(selectedVariant).replace(/\s*\(.*?\)/, '').trim();
        const { parseProductVariants } = await import('@/lib/variantUtils');
        const parsedVariants = parseProductVariants(product.variants, basePrice);
        const matched = parsedVariants.find(v => v.name.toLowerCase() === cleanName.toLowerCase());
        if (matched && matched.price !== undefined) {
          itemPrice = matched.price;
        }
      }
    }

    const shippingFee = product.is_physical ? (Number(product.shipping_fee) || 0) : 0;
    const totalPrice = itemPrice + shippingFee;

    // 2. Create Order in Supabase as PENDING
    const orderUuid = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from('orders')
      .insert({
        id: orderUuid,
        creator_id: product.creator_id,
        product_id: product.id,
        amount: totalPrice,
        status: 'pending',
        buyer_name,
        buyer_email,
        buyer_phone,
        shipping_address: shipping_address || null,
        payment_method: 'cashfree_pg',
        selected_variant: selectedVariant || null,
      });

    if (insertError) {
      console.error('Order Insert Error:', insertError);
      return NextResponse.json({ 
        error: 'Failed to create order record',
        details: { message: insertError.message, code: insertError.code, hint: insertError.hint }
      }, { status: 500 });
    }

    // 3. Initialize Cashfree Order
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const isProd = process.env.CASHFREE_ENV === 'PROD';
    
    if (!appId || !secretKey) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const baseUrl = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://profitupx.com';

    // Clean phone number (extract 10 digits)
    const rawPhoneDigits = buyer_phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhoneDigits.length >= 10 ? rawPhoneDigits.slice(-10) : '9999999999';
    const cleanCustomerId = `CUST_${rawPhoneDigits.slice(-10) || 'GUEST'}`;

    const payload = {
      order_id: orderUuid,
      order_amount: totalPrice,
      order_currency: 'INR',
      customer_details: {
        customer_id: cleanCustomerId,
        customer_phone: cleanPhone,
        customer_email: buyer_email,
        customer_name: buyer_name
      },
      order_meta: {
        return_url: `${siteUrl}/${product.creator_id}/product/${product_id}?success=true&order_id=${orderUuid}`,
        notify_url: `${siteUrl}/api/webhooks/cashfree`
      }
    };

    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const cashfreeData = await response.json();

    if (!response.ok) {
      console.error('Cashfree Create Order Error:', cashfreeData);
      return NextResponse.json({ error: 'Failed to initialize payment gateway', details: cashfreeData }, { status: 500 });
    }

    // Return the payment_session_id to the frontend
    return NextResponse.json({ 
      payment_session_id: cashfreeData.payment_session_id,
      order_id: cashfreeData.order_id
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
