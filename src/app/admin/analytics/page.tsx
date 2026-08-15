'use client';

import { useEffect, useState } from 'react';

interface Stats {
  sellerCount: number;
  totalRevenue: number;
  totalOrders: number;
  paidOrderCount: number;
  newSellersThisWeek: number;
  creators: Array<{ id: string; brand_name: string; revenue: number; orderCount: number; created_at: string }>;
  recentOrders: Array<{ amount: number; status: string; created_at: string }>;
}

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px' }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 700 }}>{d.value}</span>
          <div style={{ width: '100%', height: `${Math.max((d.value / max) * 100, 4)}px`, background: `${color}`, borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease', minHeight: 4 }} />
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(200,241,53,0.2)', borderTopColor: '#c8f135', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!stats) return null;

  // Sellers joined per week (last 8 weeks)
  const sellersByWeek = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(Date.now() - (6 - i) * 7 * 24 * 60 * 60 * 1000);
    const count = stats.creators.filter(c => {
      const d = new Date(c.created_at);
      return d >= weekStart && d < weekEnd;
    }).length;
    return { label: `W${i + 1}`, value: count };
  });

  // Revenue per week (last 8 weeks)
  const revenueByWeek = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(Date.now() - (6 - i) * 7 * 24 * 60 * 60 * 1000);
    const total = stats.recentOrders
      .filter(o => o.status === 'paid' && new Date(o.created_at) >= weekStart && new Date(o.created_at) < weekEnd)
      .reduce((s, o) => s + Number(o.amount), 0);
    return { label: `W${i + 1}`, value: Math.round(total) };
  });

  const topSellers = [...stats.creators].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 6px' }}>Analytics</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>Platform growth and revenue trends</p>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Sellers chart */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: '0 0 4px' }}>New Sellers / Week</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', margin: 0 }}>Last 8 weeks</p>
          </div>
          <BarChart data={sellersByWeek} color="#c8f135" />
        </div>

        {/* Revenue chart */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: '0 0 4px' }}>Revenue / Week (₹)</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', margin: 0 }}>Paid orders only</p>
          </div>
          <BarChart data={revenueByWeek} color="#6366f1" />
        </div>
      </div>

      {/* Top Sellers Leaderboard */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0 }}>🏆 Seller Leaderboard</h2>
        </div>
        {topSellers.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px', fontSize: '0.9rem' }}>No sellers yet.</p>}
        {topSellers.map((seller, i) => {
          const maxRevenue = topSellers[0]?.revenue || 1;
          const pct = Math.max((seller.revenue / maxRevenue) * 100, 2);
          const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
          return (
            <div key={seller.id} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{medals[i]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{seller.brand_name}</span>
                  <span style={{ color: '#c8f135', fontWeight: 800, fontSize: '0.88rem' }}>₹{seller.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? '#c8f135' : i === 1 ? '#6366f1' : '#ec4899', borderRadius: '100px', transition: 'width 0.8s ease' }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', margin: '4px 0 0' }}>{seller.orderCount} orders</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Platform Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, desc: 'All sellers combined', color: '#c8f135' },
          { label: 'Platform Commission (~4%)', value: `₹${Math.round(stats.totalRevenue * 0.04).toLocaleString('en-IN')}`, desc: 'Your earnings', color: '#6366f1' },
          { label: 'Order Success Rate', value: `${stats.totalOrders > 0 ? Math.round((stats.paidOrderCount / stats.totalOrders) * 100) : 0}%`, desc: `${stats.paidOrderCount} of ${stats.totalOrders} paid`, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 4px' }}>{s.value}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
