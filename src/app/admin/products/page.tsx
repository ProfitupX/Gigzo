'use client';

import { useEffect, useState } from 'react';
import { Search, Package } from 'lucide-react';

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

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        setProducts(d.products || []);
        setCreators(d.creators || []);
        setLoading(false);
      });
  }, []);

  const getCreatorName = (id: string) => creators.find(c => c.id === id)?.brand_name || 'Unknown';
  const getStoreLink = (id: string) => creators.find(c => c.id === id)?.store_link || id;

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    getCreatorName(p.creator_id).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(200,241,53,0.2)', borderTopColor: '#c8f135', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 6px' }}>All Products</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>{products.length} products across all seller stores</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 420 }}>
        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        <input
          type="text"
          placeholder="Search product or seller name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '11px 16px 11px 38px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', color: '#fff', fontSize: '0.88rem',
            outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 120px 80px', gap: '16px', padding: '14px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['Product', 'Seller', 'Price', 'Added', 'Link'].map(h => (
            <span key={h} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px', fontSize: '0.9rem' }}>No products found.</p>}

        {filtered.map(product => (
          <div key={product.id}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 120px 80px', gap: '16px', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Package size={16} color="#6366f1" />
              </div>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>{getCreatorName(product.creator_id)}</span>
            <span style={{ color: '#c8f135', fontWeight: 800, fontSize: '0.88rem' }}>₹{Number(product.price).toLocaleString('en-IN')}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{new Date(product.created_at).toLocaleDateString('en-IN')}</span>
            <a
              href={`/${getStoreLink(product.creator_id)}/product/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none', background: 'rgba(99,102,241,0.1)', padding: '5px 10px', borderRadius: '8px', display: 'inline-block' }}
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
