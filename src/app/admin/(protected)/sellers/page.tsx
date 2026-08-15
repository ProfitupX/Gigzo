'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';

interface Seller {
  id: string;
  brand_name: string;
  store_link: string;
  avatar_url: string;
  created_at: string;
  revenue: number;
  orderCount: number;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setSellers(d.creators || []); setLoading(false); });
  }, []);

  const filtered = sellers.filter(s =>
    s.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.store_link?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(200,241,53,0.2)', borderTopColor: '#c8f135', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 6px' }}>Sellers</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>{sellers.length} registered sellers on ProfitupX</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        <input
          type="text"
          placeholder="Search seller name or store link..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '11px 16px 11px 40px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', color: '#fff', fontSize: '0.88rem',
            outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 80px', gap: '16px', padding: '14px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['Seller', 'Store Link', 'Orders', 'Revenue', 'Joined', 'Action'].map(h => (
            <span key={h} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px', fontSize: '0.9rem' }}>No sellers found.</p>
        )}

        {filtered.map(seller => (
          <div key={seller.id}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 80px', gap: '16px', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #374151, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c8f135', fontWeight: 900, fontSize: '0.9rem', flexShrink: 0, overflow: 'hidden' }}>
                {seller.avatar_url ? <img src={seller.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : seller.brand_name?.[0]?.toUpperCase()}
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seller.brand_name}</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontFamily: 'monospace' }}>/{seller.store_link || seller.id.slice(0, 8)}</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{seller.orderCount}</span>
            <span style={{ color: seller.revenue > 0 ? '#c8f135' : 'rgba(255,255,255,0.35)', fontWeight: 800, fontSize: '0.88rem' }}>₹{seller.revenue.toLocaleString('en-IN')}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{new Date(seller.created_at).toLocaleDateString('en-IN')}</span>
            <a
              href={`/${seller.store_link || seller.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#6366f1', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none', background: 'rgba(99,102,241,0.1)', padding: '5px 10px', borderRadius: '8px' }}
            >
              <ExternalLink size={12} /> View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
