'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, ShoppingCart, Package, IndianRupee, ArrowUpRight, Clock, CheckCircle2, XCircle, UserPlus } from 'lucide-react';

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
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`, transform: 'translate(20px, -20px)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
          {icon}
        </div>
        {trend && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: '100px' }}>{trend}</span>}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{label}</p>
      <p style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px' }}>{value}</p>
      {sub && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 500 }}>{sub}</p>}
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
      <div style={{ width: 40, height: 40, border: '3px solid rgba(200,241,53,0.2)', borderTopColor: '#c8f135', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading platform data...</p>
    </div>
  );

  if (!stats) return <div style={{ color: '#ef4444', textAlign: 'center', marginTop: 60 }}>Failed to load stats. Check Supabase credentials.</div>;

  const commissionRate = 0.04;
  const platformCommission = stats.totalRevenue * commissionRate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: 0 }}>Platform Overview</h1>
          <span style={{ background: 'rgba(200,241,53,0.15)', border: '1px solid rgba(200,241,53,0.3)', color: '#c8f135', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '100px' }}>Live</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>Full picture of your ProfitupX platform — sellers, revenue, orders.</p>
      </div>

      {/* Main Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard label="Total Sellers" value={String(stats.sellerCount || 0)} sub={`+${stats.newSellersThisWeek} this week`} icon={<Users size={20} />} accent="#c8f135" trend={`+${stats.newSellersThisWeek} 📈`} />
        <StatCard label="Total Revenue" value={`₹${Number(stats.totalRevenue || 0).toLocaleString('en-IN')}`} sub="All sellers combined" icon={<IndianRupee size={20} />} accent="#6366f1" />
        <StatCard label="Platform Earnings" value={`₹${Math.round(platformCommission).toLocaleString('en-IN')}`} sub="~4% commission" icon={<TrendingUp size={20} />} accent="#f59e0b" />
        <StatCard label="Total Orders" value={String(stats.totalOrders || 0)} sub={`${stats.paidOrderCount} paid · ${stats.pendingOrderCount} pending`} icon={<ShoppingCart size={20} />} accent="#ec4899" />
        <StatCard label="Total Products" value={String(stats.productCount || 0)} sub="Across all stores" icon={<Package size={20} />} accent="#22c55e" />
        <StatCard label="Avg Order Value" value={`₹${stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('en-IN') : 0}`} sub="Per order average" icon={<ArrowUpRight size={20} />} accent="#06b6d4" />
      </div>

      {/* Order status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={20} color="#22c55e" /></div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Paid Orders</p>
            <p style={{ color: '#22c55e', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>{stats.paidOrderCount}</p>
          </div>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={20} color="#f59e0b" /></div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Pending Orders</p>
            <p style={{ color: '#f59e0b', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>{stats.pendingOrderCount}</p>
          </div>
        </div>
      </div>

      {/* Top Sellers + Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Top Sellers */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0 }}>🏆 Top Sellers</h2>
            <Link href="/admin/sellers" style={{ color: '#c8f135', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowUpRight size={13} /></Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {(stats.creators || [])
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 6)
              .map((seller, i) => (
                <div key={seller.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ width: 22, color: i < 3 ? '#c8f135' : 'rgba(255,255,255,0.3)', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>#{i + 1}</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #374151, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c8f135', fontWeight: 900, fontSize: '0.85rem', flexShrink: 0, overflow: 'hidden' }}>
                    {seller.avatar_url ? <img src={seller.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : seller.brand_name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seller.brand_name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', margin: 0 }}>{seller.orderCount} orders</p>
                  </div>
                  <span style={{ color: '#c8f135', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>₹{seller.revenue.toLocaleString('en-IN')}</span>
                </div>
              ))}
            {stats.creators?.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '24px', fontSize: '0.85rem' }}>No sellers yet.</p>}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0 }}>🛒 Recent Orders</h2>
            <Link href="/admin/orders" style={{ color: '#c8f135', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowUpRight size={13} /></Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {(stats.recentOrders || []).slice(0, 6).map(order => (
              <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: order.status === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {order.status === 'paid' ? <CheckCircle2 size={15} color="#22c55e" /> : <Clock size={15} color="#f59e0b" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.83rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.buyer_name || 'Anonymous'}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', margin: 0 }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem', margin: 0 }}>₹{Number(order.amount).toLocaleString('en-IN')}</p>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: order.status === 'paid' ? '#22c55e' : '#f59e0b',
                  }}>{order.status}</span>
                </div>
              </div>
            ))}
            {stats.recentOrders?.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '24px', fontSize: '0.85rem' }}>No orders yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
