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
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', margin: '0 0 6px' }}>All Orders</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>Every transaction across your platform</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Showing', value: filtered.length, color: '#0a0a0a' },
          { label: 'Total', value: `₹${totalFiltered.toLocaleString('en-IN')}`, color: '#4f46e5' },
          { label: 'Paid', value: filtered.filter(o => o.status === 'paid').length, color: '#16a34a' },
          { label: 'Pending', value: filtered.filter(o => o.status === 'pending').length, color: '#d97706' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 18px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{s.label}</p>
            <p style={{ color: s.color, fontWeight: 900, fontSize: '1.1rem', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search buyer or seller..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 40px',
              backgroundColor: '#ffffff', border: '1px solid var(--border)',
              borderRadius: '12px', color: '#0a0a0a', fontSize: '0.9rem',
              outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#c8f135'; e.target.style.boxShadow = '0 0 0 3px rgba(200,241,53,0.2)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'paid', 'pending'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                backgroundColor: statusFilter === s ? '#0a0a0a' : '#ffffff',
                border: '1px solid ' + (statusFilter === s ? '#0a0a0a' : 'var(--border)'),
                color: statusFilter === s ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: statusFilter === s ? '0 4px 12px rgba(10,10,10,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                transition: 'all 0.2s',
              }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1.5fr) minmax(150px, 1.5fr) 100px 120px 100px', gap: '16px', padding: '16px 24px', backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          {['Buyer', 'Seller', 'Amount', 'Date', 'Status'].map(h => (
            <span key={h} style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.9rem', fontWeight: 500 }}>No orders found.</p>}

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '700px' }}>
            {filtered.map(order => (
              <div key={order.id}
                style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1.5fr) minmax(130px, 1.5fr) 100px 100px 180px', gap: '16px', padding: '16px 24px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem' }}>{order.buyer_name || 'Anonymous'}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{getCreatorName(order.creator_id)}</span>
                <span style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '0.9rem' }}>₹{Number(order.amount).toLocaleString('en-IN')}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: order.status === 'paid' ? '#16a34a' : '#d97706',
                    backgroundColor: order.status === 'paid' ? '#dcfce7' : '#fef3c7',
                    padding: '4px 10px', borderRadius: '100px', width: 'fit-content',
                  }}>
                    {order.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {order.status}
                  </span>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={async () => {
                        if (!confirm('Mark order as PAID and deliver product?')) return;
                        const res = await fetch('/api/admin/action', {
                          method: 'POST', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'approve_order', id: order.id })
                        });
                        if (res.ok) {
                          setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'paid' } : o));
                        } else {
                          alert('Failed to approve order');
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#0a0a0a', color: '#c8f135',
                        border: 'none', borderRadius: '100px',
                        fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                      }}
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
