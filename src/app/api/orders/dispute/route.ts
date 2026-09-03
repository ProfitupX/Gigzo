import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { order_id, reason, description, buyer_phone } = await request.json();

    if (!order_id || !reason) {
      return NextResponse.json({ error: 'Order ID and reason are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch order
    const { data: order, error: fetchErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Check 48-hour buyer protection window
    const orderCreatedAt = new Date(order.created_at).getTime();
    const now = Date.now();
    const elapsedHours = (now - orderCreatedAt) / (1000 * 60 * 60);

    if (elapsedHours > 48) {
      return NextResponse.json({ 
        error: 'The 48-hour buyer protection window has expired for this order. Please contact store support directly.' 
      }, { status: 400 });
    }

    // 3. Update order dispute status in Supabase
    // Note: status is set to 'disputed' to instantly freeze escrow payout
    const { error: updateErr } = await supabase
      .from('orders')
      .update({
        status: 'disputed',
        utr_ref: order.utr_ref ? `${order.utr_ref} [DISPUTE: ${reason}]` : `[DISPUTE: ${reason}]`
      })
      .eq('id', order_id);

    if (updateErr) {
      console.error('Dispute update error:', updateErr);
      return NextResponse.json({ error: 'Failed to record dispute' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Dispute submitted successfully. Escrow payout has been frozen for admin review.',
      order_id,
      reason,
      status: 'disputed'
    });
  } catch (error: any) {
    console.error('Dispute Route Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
