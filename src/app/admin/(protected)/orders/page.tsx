'use client';

import { useEffect, useState } from 'react';
import { Search, CheckCircle2, Clock } from 'lucide-react';

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  buyer_name: string;
  creator_id: string;
}

interface Creator {
  id: string;
  brand_name: string;
  store_link: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        setOrders(d.recentOrders || []);
        setCreators(d.creators || []);
        setLoading(false);
      });
  }, []);

  const getCreatorName = (id: string) => creators.find(c => c.id === id)?.brand_name || 'Unknown';

  const filtered = orders.filter(o => {
    const matchSearch = (o.buyer_name || '').toLowerCase().includes(search.toLowerCase()) ||
      getCreatorName(o.creator_id).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalFiltered = filtered.reduce((s, o) => s + Number(o.amount), 0);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(200,241,53,0.2)', borderTopColor: '#c8f135', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 6px' }}>All Orders</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>Every transaction across your platform</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Showing', value: filtered.length, color: '#fff' },
          { label: 'Total', value: `₹${totalFiltered.toLocaleString('en-IN')}`, color: '#c8f135' },
          { label: 'Paid', value: filtered.filter(o => o.status === 'paid').length, color: '#22c55e' },
          { label: 'Pending', value: filtered.filter(o => o.status === 'pending').length, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 18px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{s.label}</p>
            <p style={{ color: s.color, fontWeight: 900, fontSize: '1.1rem', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input
            type="text"
            placeholder="Search buyer or seller..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 16px 10px 38px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', color: '#fff', fontSize: '0.85rem',
              outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'paid', 'pending'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: statusFilter === s ? '#c8f135' : 'rgba(255,255,255,0.05)',
                border: '1px solid ' + (statusFilter === s ? '#c8f135' : 'rgba(255,255,255,0.1)'),
                color: statusFilter === s ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
              }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 120px 100px', gap: '16px', padding: '14px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['Buyer', 'Seller', 'Amount', 'Date', 'Status'].map(h => (
            <span key={h} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px', fontSize: '0.9rem' }}>No orders found.</p>}

        {filtered.map(order => (
          <div key={order.id}
            style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 120px 100px', gap: '16px', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{order.buyer_name || 'Anonymous'}</span>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>{getCreatorName(order.creator_id)}</span>
            <span style={{ color: '#c8f135', fontWeight: 800, fontSize: '0.88rem' }}>₹{Number(order.amount).toLocaleString('en-IN')}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
              color: order.status === 'paid' ? '#22c55e' : '#f59e0b',
              background: order.status === 'paid' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
              padding: '4px 10px', borderRadius: '100px', width: 'fit-content',
            }}>
              {order.status === 'paid' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
