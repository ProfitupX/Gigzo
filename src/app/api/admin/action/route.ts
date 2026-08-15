import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_SECRET = 'px-admin-authenticated-2025';

export async function POST(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  if (!cookie.includes(`px_admin_session=${ADMIN_SECRET}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const body = await request.json();
  const { action, id } = body;

  if (!action || !id) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    if (action === 'delete_seller') {
      // Delete products first (if cascade isn't set up)
      await supabase.from('products').delete().eq('creator_id', id);
      // Delete creator
      const { error } = await supabase.from('creators').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_product') {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'record_payout') {
      const { amount, utr } = body;
      if (!amount) return NextResponse.json({ error: 'Missing amount' }, { status: 400 });
      
      const { error } = await supabase.from('payouts').insert({
        creator_id: id,
        amount: amount,
        utr: utr || null,
      });
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'approve_order') {
      const { error } = await supabase.from('orders').update({ status: 'paid' }).eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin Action Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
