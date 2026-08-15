'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Search, Trash2 } from 'lucide-react';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStats = () => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setSellers(d.creators || []); setLoading(false); });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async (id: string, brand: string) => {
    if (!window.confirm(`⚠️ WARNING: Are you sure you want to permanently delete seller "${brand}" and all their products? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_seller', id }),
      });
      if (res.ok) {
        setSellers(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Failed to delete seller.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
    setDeletingId(null);
  };

  const filtered = sellers.filter(s =>
    s.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.store_link?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', margin: '0 0 6px' }}>Sellers</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>{sellers.length} registered sellers on ProfitupX</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search seller name or store link..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px 12px 42px',
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

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) minmax(120px, 1.5fr) 80px 100px 100px 120px', gap: '16px', padding: '16px 24px', backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          {['Seller', 'Store Link', 'Orders', 'Revenue', 'Joined', 'Actions'].map(h => (
            <span key={h} style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.9rem', fontWeight: 500 }}>No sellers found.</p>
        )}

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '750px' }}>
            {filtered.map(seller => (
              <div key={seller.id}
                style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) minmax(120px, 1.5fr) 80px 100px 100px 120px', gap: '16px', padding: '16px 24px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: 900, fontSize: '0.9rem', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    {seller.avatar_url ? <img src={seller.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : seller.brand_name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seller.brand_name}</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontFamily: 'monospace' }}>/{seller.store_link || seller.id.slice(0, 8)}</span>
                <span style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem' }}>{seller.orderCount}</span>
                <span style={{ color: seller.revenue > 0 ? '#16a34a' : 'var(--text-secondary)', fontWeight: 800, fontSize: '0.9rem' }}>₹{seller.revenue.toLocaleString('en-IN')}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>{new Date(seller.created_at).toLocaleDateString('en-IN')}</span>
                
                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={`/${seller.store_link || seller.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', color: '#4f46e5', backgroundColor: '#e0e7ff', borderRadius: '8px', transition: 'all 0.2s' }}
                    title="View Store"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(seller.id, seller.brand_name)}
                    disabled={deletingId === seller.id}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', color: '#dc2626', backgroundColor: '#fee2e2', border: 'none', borderRadius: '8px', cursor: deletingId === seller.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: deletingId === seller.id ? 0.5 : 1 }}
                    title="Delete Seller"
                  >
                    {deletingId === seller.id ? (
                      <div style={{ width: 14, height: 14, border: '2px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
