'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Search, Home, ArrowLeft, SlidersHorizontal, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  shipping_fee: number;
  is_physical?: boolean;
}

interface Creator {
  id: string;
  brand_name: string;
  bio: string | null;
  avatar_url: string | null;
  store_link: string | null;
}

interface StorefrontClientProps {
  creator: Creator;
  products: Product[];
}

export default function StorefrontClient({ creator, products }: StorefrontClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '100px', color: '#0a0a0a', position: 'relative' }}>
      
      {/* App Header (ASOS Style) */}
      <div style={{ padding: '16px 20px', position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 50 }}>
        
        {/* Top Row: Brand & Icons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.05em', margin: 0, textTransform: 'lowercase' }}>
            {creator.brand_name.replace(/\s+/g, '')}
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={20} />
            </button>
            <button style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <ShoppingBag size={20} />
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', backgroundColor: '#dc2626', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                0
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, height: '48px', backgroundColor: 'var(--surface-2)', borderRadius: '100px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search for styles, products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: 500 }}
            />
          </div>
          <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', margin: '16px 0', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedCategory === cat ? '#0a0a0a' : 'var(--surface-2)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {cat === 'All' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {/* Hero Promotional Banner */}
        {selectedCategory === 'All' && !searchQuery && (
          <div style={{ 
            backgroundColor: '#fae8d4', 
            borderRadius: '24px', 
            padding: '32px 24px', 
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* If creator has avatar, show a subtle version in BG */}
            {creator.avatar_url && (
              <img src={creator.avatar_url} style={{ position: 'absolute', right: '-10%', bottom: '-20%', height: '140%', opacity: 0.15, objectFit: 'cover', mixBlendMode: 'multiply' }} alt="Hero Background" />
            )}
            
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '60%' }}>
              <div style={{ display: 'inline-flex', padding: '4px 10px', backgroundColor: '#fff', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, color: '#d97706', marginBottom: '12px' }}>
                New In
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '10px', color: '#451a03' }}>
                Store Essentials
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#78350f', marginBottom: '20px', lineHeight: 1.4 }}>
                Discover new items to embrace the latest trends. Carefully curated by {creator.brand_name}.
              </p>
              <button style={{ backgroundColor: '#0a0a0a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 700, fontSize: '0.85rem' }}>
                Shop Now
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="asos-product-grid">
          {filteredProducts.map(product => (
            <Link
              key={product.id}
              href={`/${creator.store_link || creator.id}/product/${product.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{ position: 'relative', backgroundColor: 'var(--surface-2)', borderRadius: '16px', aspectRatio: '3/4', overflow: 'hidden', marginBottom: '12px' }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Image</div>
                )}
                
                {/* Floating Heart */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  <Heart size={16} color="#0a0a0a" />
                </div>
                
                {/* Tags */}
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: '#fff', padding: '4px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800 }}>
                  {product.stock > 0 ? 'Best Seller' : 'Sold Out'}
                </div>
              </div>

              <div style={{ padding: '0 4px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.title}
                </h3>
                <div style={{ fontSize: '1.05rem', fontWeight: 900 }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Bottom Nav Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        {/* Floating Pill Nav */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          pointerEvents: 'auto'
        }}>
          <button style={{ width: '56px', height: '48px', borderRadius: '100px', backgroundColor: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
            <Home size={20} fill="#fff" />
          </button>
          <button style={{ width: '56px', height: '48px', borderRadius: '100px', backgroundColor: 'transparent', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
            <Search size={22} />
          </button>
          <button style={{ width: '56px', height: '48px', borderRadius: '100px', backgroundColor: 'transparent', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
            <ShoppingBag size={22} />
          </button>
        </div>
      </div>

      <style>{`
        .asos-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .asos-product-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }
        @media (min-width: 900px) {
          .asos-product-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
