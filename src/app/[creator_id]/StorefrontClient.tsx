'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Tag, Sparkles, ShieldCheck, Truck, CheckCircle2, Package, ArrowUpRight } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  shipping_fee: number;
}

interface Creator {
  id: string;
  brand_name: string;
  bio: string | null;
  avatar_url: string | null;
}

interface StorefrontClientProps {
  creator: Creator;
  products: Product[];
}

export default function StorefrontClient({ creator, products }: StorefrontClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '80px', color: '#0a0a0a' }}>
      
      {/* Hero Banner Area */}
      <div style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        padding: '60px 24px 70px',
        textAlign: 'center',
        borderBottomLeftRadius: '36px',
        borderBottomRightRadius: '36px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle glow orb */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(200,241,53,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            margin: '0 auto 20px auto',
            border: '4px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}>
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt={creator.brand_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#c8f135' }}>
                {creator.brand_name[0]?.toUpperCase() || 'S'}
              </span>
            )}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(200,241,53,0.15)', color: '#c8f135', padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '14px' }}>
            <Sparkles size={12} />
            <span>Verified Creator Store</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '14px' }}>
            {creator.brand_name}
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.98rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto' }}>
            {creator.bio || 'Welcome to my official store! Browse my exclusive digital guides, presets, and physical merchandise below.'}
          </p>

          {/* Trust Highlights */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              <ShieldCheck size={14} style={{ color: '#c8f135' }} /> 100% UPI Secure
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              <Truck size={14} style={{ color: '#c8f135' }} /> Instant Digital Delivery
            </div>
          </div>
        </div>
      </div>

      {/* Main Store Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Category Pills Filtering */}
        {categories.length > 1 && (
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: selectedCategory === cat ? '#0a0a0a' : '#ffffff',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                    borderRadius: '100px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: `1.5px solid ${selectedCategory === cat ? '#0a0a0a' : 'var(--border)'}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: selectedCategory === cat ? '0 4px 14px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  {cat === 'All' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Storefront Products Section */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              {selectedCategory === 'All' ? 'All Catalog Products' : `${selectedCategory} Items`}
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {filteredProducts.length} Item{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--text-muted)' }}>
                <Package size={24} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>No products found in this category.</p>
            </div>
          ) : (
            <div className="storefront-product-grid">
              {filteredProducts.map(product => (
                <Link
                  key={product.id}
                  href={`/${creator.id}/product/${product.id}`}
                  className="bento-hover"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    padding: '12px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Image container */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: 'var(--surface-2)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={28} style={{ color: 'var(--text-muted)' }} />
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '8px', right: '8px',
                      backgroundColor: '#0a0a0a',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '100px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {product.category}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 4px 4px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a0a0a', lineHeight: 1.3, marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.title}
                    </h3>

                    {/* Rating Stars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={12} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>4.9</span>
                    </div>

                    {/* Price & Buy Icon */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '6px' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0a0a0a' }}>
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </div>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#0a0a0a',
                        color: '#c8f135',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <ShoppingBag size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ marginTop: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>Powered by</span>
          <strong style={{ color: '#0a0a0a', fontWeight: 900, letterSpacing: '-0.5px' }}>Gigzo</strong>
        </footer>
      </div>

      {/* Responsive 2-Column Grid on Mobile */}
      <style>{`
        .storefront-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        @media (max-width: 640px) {
          .storefront-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
