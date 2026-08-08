'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Eye, 
  BarChart2, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

type Order = { amount: number; status: string; created_at: string; buyer_name: string; };
type Product = { id: string; title: string; stock: number; };

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: o }, { data: p }] = await Promise.all([
        supabase.from('orders').select('amount, status, created_at, buyer_name').eq('creator_id', user.id).order('created_at', { ascending: false }),
        supabase.from('products').select('id, title, stock').eq('creator_id', user.id),
      ]);

      setOrders((o as Order[]) || []);
      setProducts((p as Product[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (Number(o.amount) || 0), 0);
  const paid = orders.filter(o => o.status === 'paid');
  const conversionRate = orders.length > 0 ? Math.round((paid.length / orders.length) * 100) : 0;

  // Retention
  const buyerMap: Record<string, number> = {};
  orders.forEach(o => { if (o.buyer_name) buyerMap[o.buyer_name] = (buyerMap[o.buyer_name] || 0) + 1; });
  const totalBuyers = Object.keys(buyerMap).length;
  const returningBuyers = Object.values(buyerMap).filter(c => c > 1).length;
  const retentionRate = totalBuyers > 0 ? Math.round((returningBuyers / totalBuyers) * 100) : 0;

  // Revenue by month (last 6)
  const monthlyMap: Record<string, number> = {};
  orders.forEach(o => {
    const month = new Date(o.created_at).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    monthlyMap[month] = (monthlyMap[month] || 0) + Number(o.amount);
  });
  const months = Object.entries(monthlyMap).slice(-6);
  const maxMonth = Math.max(...months.map(([, v]) => v), 1);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '4px' }}>Analytics & Insights</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Real-time metrics about your sales revenue, conversion, and repeat customer retention.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Loading analytics report...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: `${orders.length} total orders`, icon: IndianRupee, bg: '#e0f2fe', color: '#0284c7' },
              { label: 'Paid Conversion', value: `${paid.length} orders`, sub: `${conversionRate}% conversion rate`, icon: ShoppingBag, bg: '#dcfce7', color: '#16a34a' },
              { label: 'Customer Retention', value: `${retentionRate}%`, sub: `${returningBuyers} returning buyers`, icon: Users, bg: '#ede9fe', color: '#7c3aed' },
              { label: 'Product Funnel (est.)', value: `${(orders.length * 8).toLocaleString()}`, sub: 'Estimated storefront views', icon: Eye, bg: '#fef3c7', color: '#d97706' },
            ].map((s, i) => {
              const IconComp = s.icon;
              return (
                <div key={i} className="card" style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem' }}>{s.label}</span>
                    <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComp size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Revenue Chart (bar) */}
          <div className="card" style={{ padding: '28px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>
                  <BarChart2 size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Monthly Revenue Overview</h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Historical revenue trends over the past months</p>
                </div>
              </div>
            </div>

            {months.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--surface-2)', borderRadius: '18px', color: 'var(--text-muted)' }}>
                No revenue data recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '180px', padding: '20px 10px 0' }}>
                {months.map(([month, val]) => (
                  <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800 }}>₹{Math.round(val / 1000)}k</span>
                    <div style={{
                      width: '100%',
                      maxWidth: '48px',
                      height: `${Math.max(8, (val / maxMonth) * 120)}px`,
                      backgroundColor: '#0a0a0a',
                      borderRadius: '10px 10px 0 0',
                      transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{month}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
