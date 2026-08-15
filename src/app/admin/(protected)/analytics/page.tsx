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
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>{d.value}</span>
          <div style={{ width: '100%', height: `${Math.max((d.value / max) * 100, 4)}px`, backgroundColor: color, borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease', minHeight: 4, boxShadow: '0 -2px 4px rgba(0,0,0,0.05)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', whiteSpace: 'nowrap', fontWeight: 600 }}>{d.label}</span>
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
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', margin: '0 0 6px' }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>Platform growth and revenue trends</p>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Sellers chart */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 4px' }}>New Sellers / Week</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>Last 8 weeks</p>
          </div>
          <BarChart data={sellersByWeek} color="#0a0a0a" />
        </div>

        {/* Revenue chart */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 4px' }}>Revenue / Week (₹)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>Paid orders only</p>
          </div>
          <BarChart data={revenueByWeek} color="#4f46e5" />
        </div>
      </div>

      {/* Top Sellers Leaderboard */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>🏆 Seller Leaderboard</h2>
        </div>
        {topSellers.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.9rem', fontWeight: 500 }}>No sellers yet.</p>}
        {topSellers.map((seller, i) => {
          const maxRevenue = topSellers[0]?.revenue || 1;
          const pct = Math.max((seller.revenue / maxRevenue) * 100, 2);
          const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
          return (
            <div key={seller.id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{medals[i]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem' }}>{seller.brand_name}</span>
                  <span style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '0.9rem' }}>₹{seller.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-2)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: i === 0 ? '#0a0a0a' : i === 1 ? '#4f46e5' : '#ec4899', borderRadius: '100px', transition: 'width 0.8s ease' }} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: '6px 0 0', fontWeight: 600 }}>{seller.orderCount} orders</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Total Platform Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, desc: 'All sellers combined', color: '#0a0a0a' },
          { label: 'Platform Commission (~5%)', value: `₹${Math.round(stats.totalRevenue * 0.05).toLocaleString('en-IN')}`, desc: 'Your earnings', color: '#4f46e5' },
          { label: 'Order Success Rate', value: `${stats.totalOrders > 0 ? Math.round((stats.paidOrderCount / stats.totalOrders) * 100) : 0}%`, desc: `${stats.paidOrderCount} of ${stats.totalOrders} paid`, color: '#16a34a' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 6px' }}>{s.value}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
