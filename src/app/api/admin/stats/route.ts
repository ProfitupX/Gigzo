import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_SECRET = 'px-admin-authenticated-2025';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  if (!cookie.includes(`px_admin_session=${ADMIN_SECRET}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  const [
    { data: creators, count: sellerCount },
    { data: orders },
    { data: products, count: productCount },
  ] = await Promise.all([
    supabase.from('creators').select('id, brand_name, store_link, avatar_url, created_at', { count: 'exact' }).order('created_at', { ascending: false }),
    supabase.from('orders').select('id, amount, status, created_at, buyer_name, creator_id').order('created_at', { ascending: false }),
    supabase.from('products').select('id, title, price, creator_id, created_at', { count: 'exact' }),
  ]);

  const totalRevenue = orders?.reduce((sum, o) => sum + (Number(o.amount) || 0), 0) || 0;
  const paidOrders = orders?.filter(o => o.status === 'paid') || [];
  const pendingOrders = orders?.filter(o => o.status === 'pending') || [];

  // Revenue by creator
  const revenueByCreator: Record<string, number> = {};
  orders?.forEach(o => {
    if (o.status === 'paid') {
      revenueByCreator[o.creator_id] = (revenueByCreator[o.creator_id] || 0) + Number(o.amount);
    }
  });

  // This week sellers
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const newSellersThisWeek = creators?.filter(c => c.created_at > oneWeekAgo).length || 0;

  return NextResponse.json({
    sellerCount,
    productCount,
    totalRevenue,
    totalOrders: orders?.length || 0,
    paidOrderCount: paidOrders.length,
    pendingOrderCount: pendingOrders.length,
    newSellersThisWeek,
    creators: creators?.map(c => ({
      ...c,
      revenue: revenueByCreator[c.id] || 0,
      orderCount: orders?.filter(o => o.creator_id === c.id).length || 0,
    })) || [],
    recentOrders: orders?.slice(0, 50) || [],
    products: products?.slice(0, 50) || [],
  });
}
