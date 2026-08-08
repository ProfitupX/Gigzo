'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  category: string;
}

export default function ProductGallery({ images, category }: ProductGalleryProps) {
  const validImages = images.filter(Boolean);
  const [mainImg, setMainImg] = useState(validImages[0] || null);

  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      borderRadius: '28px', 
      padding: '16px',
      border: '1px solid var(--border)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
      position: 'sticky',
      top: '90px'
    }}>
      {/* Main Image */}
      <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--surface-2)', borderRadius: '20px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: validImages.length > 1 ? '16px' : '0' }}>
        {mainImg ? (
          <img src={mainImg} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Package size={48} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>No Image Available</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#0a0a0a', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '4px 12px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {category}
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {validImages.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setMainImg(img)}
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                flexShrink: 0, 
                cursor: 'pointer',
                border: mainImg === img ? '2px solid #0a0a0a' : '2px solid transparent',
                opacity: mainImg === img ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
            >
              <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
