import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateMilestoneSchedule } from '@/lib/escrowLedger';

export async function POST(request: Request) {
  try {
    const { action, order_id, wip_image_url, wip_notes, rejection_reason, phase, utr } = await request.json();

    if (!order_id || !action) {
      return NextResponse.json({ error: 'Order ID and action are required' }, { status: 400 });
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

    const schedule = calculateMilestoneSchedule(order.amount);

    // 2. ACTION: Submit WIP (Seller uploads WIP photo)
    if (action === 'submit_wip') {
      if (!wip_image_url) {
        return NextResponse.json({ error: 'WIP image URL is required' }, { status: 400 });
      }

      const updatedUtr = order.utr_ref 
        ? `${order.utr_ref} [WIP_PROOF: ${wip_image_url}]` 
        : `[WIP_PROOF: ${wip_image_url}]`;

      const { error: updateErr } = await supabase
        .from('orders')
        .update({
          status: 'wip_submitted',
          utr_ref: updatedUtr
        })
        .eq('id', order_id);

      if (updateErr) throw updateErr;

      return NextResponse.json({
        success: true,
        message: 'Work-In-Progress (WIP) proof submitted. Buyer notified for Phase 2 (40%) approval.',
        status: 'wip_submitted',
        wip_image_url,
        wip_notes: wip_notes || ''
      });
    }

    // 3. ACTION: Approve WIP (Buyer approves WIP and pays Phase 2 40%)
    if (action === 'approve_wip') {
      const { error: updateErr } = await supabase
        .from('orders')
        .update({
          status: 'wip_approved',
          utr_ref: order.utr_ref ? `${order.utr_ref} [WIP_APPROVED]` : '[WIP_APPROVED]'
        })
        .eq('id', order_id);

      if (updateErr) throw updateErr;

      return NextResponse.json({
        success: true,
        message: 'WIP proof approved! Phase 2 (40%) unlocked.',
        status: 'wip_approved',
        phase2Amount: schedule.phase2Wip
      });
    }

    // 4. ACTION: Reject WIP (Buyer rejects WIP -> Order cancelled, seller retains 30% advance)
    if (action === 'reject_wip') {
      const { error: updateErr } = await supabase
        .from('orders')
        .update({
          status: 'wip_rejected',
          utr_ref: order.utr_ref 
            ? `${order.utr_ref} [WIP_REJECTED: ${rejection_reason || 'Buyer rejected'}]` 
            : `[WIP_REJECTED: ${rejection_reason || 'Buyer rejected'}]`
        })
        .eq('id', order_id);

      if (updateErr) throw updateErr;

      return NextResponse.json({
        success: true,
        message: 'Order cancelled at WIP stage. Seller retains 30% advance for materials. Buyer will not be charged further.',
        status: 'wip_rejected'
      });
    }

    // 5. ACTION: Confirm Phase Payment
    if (action === 'confirm_phase') {
      let nextStatus = order.status;
      if (phase === 2) nextStatus = 'phase2_paid';
      if (phase === 3) nextStatus = 'completed';

      const { error: updateErr } = await supabase
        .from('orders')
        .update({
          status: nextStatus,
          utr_ref: utr ? `${order.utr_ref || ''} [PHASE_${phase}_UTR: ${utr}]` : order.utr_ref
        })
        .eq('id', order_id);

      if (updateErr) throw updateErr;

      return NextResponse.json({
        success: true,
        status: nextStatus,
        schedule
      });
    }

    return NextResponse.json({ error: 'Invalid milestone action' }, { status: 400 });
  } catch (error: any) {
    console.error('Milestone API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
