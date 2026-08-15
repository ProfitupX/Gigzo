'use client';

import { useEffect, useState } from 'react';
import { Search, Package, ExternalLink, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  creator_id: string;
  created_at: string;
}

interface Creator {
  id: string;
  brand_name: string;
  store_link: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStats = () => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        setProducts(d.products || []);
        setCreators(d.creators || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getCreatorName = (id: string) => creators.find(c => c.id === id)?.brand_name || 'Unknown';
  const getStoreLink = (id: string) => creators.find(c => c.id === id)?.store_link || id;

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`⚠️ WARNING: Are you sure you want to delete the product "${title}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_product', id }),
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete product.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
    setDeletingId(null);
  };

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    getCreatorName(p.creator_id).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', margin: '0 0 6px' }}>All Products</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>{products.length} products across all seller stores</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 420 }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search product or seller name..."
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) minmax(120px, 1.5fr) 100px 100px 100px', gap: '16px', padding: '16px 24px', backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          {['Product', 'Seller', 'Price', 'Added', 'Actions'].map(h => (
            <span key={h} style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.9rem', fontWeight: 500 }}>No products found.</p>}

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '700px' }}>
            {filtered.map(product => (
              <div key={product.id}
                style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) minmax(120px, 1.5fr) 100px 100px 100px', gap: '16px', padding: '16px 24px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={18} color="#4f46e5" />
                  </div>
                  <span style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{getCreatorName(product.creator_id)}</span>
                <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.9rem' }}>₹{Number(product.price).toLocaleString('en-IN')}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>{new Date(product.created_at).toLocaleDateString('en-IN')}</span>
                
                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={`/${getStoreLink(product.creator_id)}/product/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', color: '#4f46e5', backgroundColor: '#e0e7ff', borderRadius: '8px', transition: 'all 0.2s' }}
                    title="View Product"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(product.id, product.title)}
                    disabled={deletingId === product.id}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', color: '#dc2626', backgroundColor: '#fee2e2', border: 'none', borderRadius: '8px', cursor: deletingId === product.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: deletingId === product.id ? 0.5 : 1 }}
                    title="Delete Product"
                  >
                    {deletingId === product.id ? (
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
