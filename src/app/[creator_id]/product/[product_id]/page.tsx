import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

import ProductInteractions from './ProductInteractions';
import ReviewsSection from './ReviewsSection';
import ProductGallery from './ProductGallery';
import { Star, ArrowLeft, Package, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ product_id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: product } = await supabase
    .from('products')
    .select('title, description')
    .eq('id', resolvedParams.product_id)
    .single();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | Gigzo Store`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ creator_id: string, product_id: string }> }) {
  const resolvedParams = await params;
  
  // Fetch Product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.product_id)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch Creator
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(resolvedParams.creator_id);
  const { data: creator } = await supabase
    .from('creators')
    .select('id, brand_name, avatar_url, store_link')
    .eq(isUUID ? 'id' : 'store_link', resolvedParams.creator_id)
    .single();

  // Parse variants
  const variantsList = product.variants ? product.variants.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '80px', color: '#0a0a0a' }}>
      
      {/* Top Header Navigation Bar */}
      <nav style={{ 
        padding: '16px 40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <Link href={`/${creator?.store_link || resolvedParams.creator_id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          {creator?.avatar_url ? (
            <img src={creator.avatar_url} alt={creator.brand_name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0a0a0a', color: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              {creator?.brand_name?.[0]?.toUpperCase() || 'S'}
            </div>
          )}
          <span style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>{creator?.brand_name || 'Store'}</span>
        </Link>
        <Link href={`/${creator?.store_link || resolvedParams.creator_id}`} style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--surface-2)', padding: '8px 16px', borderRadius: '100px' }}>
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </Link>
      </nav>

      {/* Product Main Container */}
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'start' }}>
          
          {/* Left Column: Image Gallery */}
          <ProductGallery 
            images={[product.image_url, ...(product.additional_images || [])]} 
            category={product.category} 
          />

          {/* Right Column: Product Details & Purchase Actions */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0ffd4', color: '#3a6600', padding: '6px 14px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '20px' }}>
              <Sparkles size={14} />
              <span>Official Creator Item</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px', color: '#0a0a0a' }}>
              {product.title}
            </h1>
            
            {/* Rating Stars Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>4.9</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>· Verified Buyer Ratings</span>
            </div>
            
            {/* Price Tag */}
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.03em' }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px', whiteSpace: 'pre-line' }}>
              {product.description}
            </p>

            {/* Inventory Status Pill */}
            {product.is_physical && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '18px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={20} style={{ color: product.stock > 0 ? '#16a34a' : '#dc2626' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stock Availability</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: product.stock > 0 ? '#16a34a' : '#dc2626' }}>
                      {product.stock > 0 ? `${product.stock} units available` : 'Sold out'}
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '18px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Truck size={20} style={{ color: '#0284c7' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Shipping Method</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      {product.shipping_fee > 0 ? `₹${product.shipping_fee} Flat Rate` : 'Free Shipping'}
                    </div>
                    {product.shipping_days && (
                      <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                        Est. Delivery: {product.shipping_days}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Product Interactions (Buy Now / Add to Cart / Checkout Modal) */}
            <ProductInteractions product={product} variants={variantsList} />

            {/* Real Reviews Section */}
            <ReviewsSection productId={product.id} creatorId={resolvedParams.creator_id} />

          </div>
        </div>
      </div>
    </div>
  );
}
