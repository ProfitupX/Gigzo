import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

import ProductInteractions from './ProductInteractions';
import ReviewsSection from './ReviewsSection';
import { ArrowLeft, Share2, Star } from 'lucide-react';

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
    .select('id, brand_name, store_link')
    .eq(isUUID ? 'id' : 'store_link', resolvedParams.creator_id)
    .single();

  // Parse variants
  const variantsList = product.variants ? product.variants.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ 
        backgroundColor: '#ffffff', 
        minHeight: '100vh', 
        width: '100%',
        maxWidth: '500px', 
        fontFamily: "'Plus Jakarta Sans', sans-serif", 
        color: '#0a0a0a', 
        position: 'relative',
        boxShadow: '0 0 40px rgba(0,0,0,0.05)'
      }}>
      
      {/* Top Floating Nav overlaying the image */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        <Link href={`/${creator?.store_link || resolvedParams.creator_id}`} style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', border: '1px solid rgba(0,0,0,0.05)' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Full-Bleed Image Area */}
      <div style={{ width: '100%', height: '65vh', position: 'relative', backgroundColor: 'var(--surface-2)' }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No Image Available
          </div>
        )}
      </div>

      {/* Bottom Sheet Details Container */}
      <div style={{ 
        position: 'relative', 
        marginTop: '-30px', 
        backgroundColor: '#ffffff', 
        borderTopLeftRadius: '32px', 
        borderTopRightRadius: '32px', 
        padding: '32px 24px 140px', 
        minHeight: '40vh',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.08)'
      }}>
        
        {/* Drag Handle (Visual only) */}
        <div style={{ width: '40px', height: '5px', backgroundColor: 'var(--border)', borderRadius: '100px', margin: '0 auto 24px' }}></div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                New Season
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#0a0a0a', margin: 0, paddingRight: '20px' }}>
                {product.title}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap', marginTop: '4px' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>4.9 (120 reviews)</span>
            </div>
          </div>
          
          {/* Price */}
          <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.03em' }}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '24px 0' }}></div>

          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>Description</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '32px' }}>
            {product.description}
          </p>

          <ReviewsSection productId={product.id} creatorId={creator?.id || resolvedParams.creator_id} />
        </div>
      </div>

      {/* Sticky Bottom Actions (Variants & Checkout) */}
      <ProductInteractions product={product} variants={variantsList} />
      
      </div>
    </div>
  );
}
