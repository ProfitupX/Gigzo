import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { parseProductVariants } from '@/lib/variantUtils';

export async function POST(request: Request) {
  try {
    const { 
      product_id, 
      buyer_name, 
      buyer_email, 
      buyer_phone, 
      shipping_address, 
      selectedVariant,
      utr_ref 
    } = await request.json();

    if (!product_id || !buyer_name || !buyer_email || !buyer_phone) {
      return NextResponse.json({ error: 'Missing required buyer fields' }, { status: 400 });
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

    // 2. Resolve price based on selected variant
    const basePrice = Number(product.price) || 0;
    let itemPrice = basePrice;

    if (selectedVariant) {
      const priceMatch = String(selectedVariant).match(/₹\s*(\d+)/);
      if (priceMatch) {
        itemPrice = Number(priceMatch[1]);
      } else {
        const cleanName = String(selectedVariant).replace(/\s*\(.*?\)/, '').trim();
        const parsedVariants = parseProductVariants(product.variants, basePrice);
        const matched = parsedVariants.find(v => v.name.toLowerCase() === cleanName.toLowerCase());
        if (matched && matched.price !== undefined) {
          itemPrice = matched.price;
        }
      }
    }

    const shippingFee = product.is_physical ? (Number(product.shipping_fee) || 0) : 0;
    const totalPrice = itemPrice + shippingFee;

    // 3. Insert order into Supabase
    const orderUuid = crypto.randomUUID();

    const { data: order, error: insertError } = await supabase
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
        payment_method: 'direct_upi',
        selected_variant: selectedVariant || null,
        utr_ref: utr_ref || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Direct Order Insert Error:', insertError);
      return NextResponse.json({ 
        error: 'Failed to create order record', 
        details: insertError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      order_id: orderUuid, 
      total_price: totalPrice,
      order 
    });

  } catch (err: any) {
    console.error('Direct checkout route error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
