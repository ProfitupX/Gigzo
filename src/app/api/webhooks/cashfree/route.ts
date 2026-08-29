import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing signature headers' }, { status: 400 });
    }

    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!secretKey) throw new Error('CASHFREE_SECRET_KEY missing');

    // Verify Signature
    const signedData = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(signedData)
      .digest('base64');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);
    
    if (data.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderId = data.data.order.order_id;
      const paymentMethod = data.data.payment.payment_group || 'cashfree';
      const supabase = await createClient();

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          payment_method: `cashfree_${paymentMethod}`,
        })
        .eq('id', orderId);

      if (error) {
        console.error('Failed to update order status via webhook:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, message: 'Unhandled webhook type' });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
