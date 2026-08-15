'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, ShoppingCart, Package, IndianRupee, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

interface AdminStats {
  sellerCount: number;
  productCount: number;
  totalRevenue: number;
  totalOrders: number;
  paidOrderCount: number;
  pendingOrderCount: number;
  newSellersThisWeek: number;
  creators: Array<{ id: string; brand_name: string; store_link: string; avatar_url: string; created_at: string; revenue: number; orderCount: number }>;
  recentOrders: Array<{ id: string; amount: number; status: string; created_at: string; buyer_name: string; creator_id: string }>;
}

function StatCard({ label, value, sub, icon, accent, trend }: { label: string; value: string; sub?: string; icon: React.ReactNode; accent: string; trend?: string }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--border)',
      borderRadius: '20px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`, transform: 'translate(20px, -20px)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: `${accent}15`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
          {icon}
        </div>
        {trend && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', backgroundColor: '#d1fae5', padding: '4px 10px', borderRadius: '100px' }}>{trend}</span>}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{label}</p>
      <p style={{ color: '#0a0a0a', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px' }}>{value}</p>
      {sub && <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>{sub}</p>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Loading platform data...</p>
    </div>
  );

  if (!stats) return <div style={{ color: '#ef4444', textAlign: 'center', marginTop: 60, padding: 20, backgroundColor: '#fee2e2', borderRadius: 12 }}>Failed to load stats. Check connection.</div>;

  const commissionRate = 0.04;
  const platformCommission = stats.totalRevenue * commissionRate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', margin: 0 }}>Platform Overview</h1>
          <span style={{ backgroundColor: '#ecfccb', border: '1px solid #bef264', color: '#4d7c0f', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '100px' }}>Live</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>Full picture of your ProfitupX platform — sellers, revenue, orders.</p>
      </div>

      {/* Main Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard label="Total Sellers" value={String(stats.sellerCount || 0)} sub={`+${stats.newSellersThisWeek} this week`} icon={<Users size={20} />} accent="#0a0a0a" trend={`+${stats.newSellersThisWeek} 📈`} />
        <StatCard label="Total Revenue" value={`₹${Number(stats.totalRevenue || 0).toLocaleString('en-IN')}`} sub="All sellers combined" icon={<IndianRupee size={20} />} accent="#6366f1" />
        <StatCard label="Platform Earnings" value={`₹${Math.round(platformCommission).toLocaleString('en-IN')}`} sub="~4% commission" icon={<TrendingUp size={20} />} accent="#f59e0b" />
        <StatCard label="Total Orders" value={String(stats.totalOrders || 0)} sub={`${stats.paidOrderCount} paid · ${stats.pendingOrderCount} pending`} icon={<ShoppingCart size={20} />} accent="#ec4899" />
        <StatCard label="Total Products" value={String(stats.productCount || 0)} sub="Across all stores" icon={<Package size={20} />} accent="#22c55e" />
        <StatCard label="Avg Order Value" value={`₹${stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('en-IN') : 0}`} sub="Per order average" icon={<ArrowUpRight size={20} />} accent="#06b6d4" />
      </div>

      {/* Order status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={24} color="#16a34a" /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Paid Orders</p>
            <p style={{ color: '#16a34a', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>{stats.paidOrderCount}</p>
          </div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={24} color="#d97706" /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Pending Orders</p>
            <p style={{ color: '#d97706', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>{stats.pendingOrderCount}</p>
          </div>
        </div>
      </div>

      {/* Top Sellers + Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>

        {/* Top Sellers */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>🏆 Top Sellers</h2>
            <Link href="/admin/sellers" style={{ color: '#0a0a0a', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowUpRight size={14} /></Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {(stats.creators || [])
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 6)
              .map((seller, i) => (
                <div key={seller.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <span style={{ width: 22, color: i < 3 ? '#0a0a0a' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>#{i + 1}</span>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    {seller.avatar_url ? <img src={seller.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : seller.brand_name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seller.brand_name}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: '2px 0 0', fontWeight: 500 }}>{seller.orderCount} orders</p>
                  </div>
                  <span style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, backgroundColor: 'var(--surface-2)', padding: '4px 10px', borderRadius: '8px' }}>₹{seller.revenue.toLocaleString('en-IN')}</span>
                </div>
              ))}
            {stats.creators?.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px', fontSize: '0.9rem' }}>No sellers yet.</p>}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>🛒 Recent Orders</h2>
            <Link href="/admin/orders" style={{ color: '#0a0a0a', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowUpRight size={14} /></Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {(stats.recentOrders || []).slice(0, 6).map(order => (
              <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <div style={{
                  width: 36, height: 36, borderRadius: '12px',
                  backgroundColor: order.status === 'paid' ? '#dcfce7' : '#fef3c7',
                  border: `1px solid ${order.status === 'paid' ? '#bbf7d0' : '#fde68a'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {order.status === 'paid' ? <CheckCircle2 size={18} color="#16a34a" /> : <Clock size={18} color="#d97706" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.buyer_name || 'Anonymous'}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: '2px 0 0', fontWeight: 500 }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>₹{Number(order.amount).toLocaleString('en-IN')}</p>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: order.status === 'paid' ? '#16a34a' : '#d97706',
                  }}>{order.status}</span>
                </div>
              </div>
            ))}
            {stats.recentOrders?.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px', fontSize: '0.9rem' }}>No orders yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
