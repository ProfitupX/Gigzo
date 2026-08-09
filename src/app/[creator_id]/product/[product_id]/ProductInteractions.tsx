'use client';

import { useState } from 'react';
import CheckoutModal from './CheckoutModal';
import { ShoppingBag, Heart } from 'lucide-react';

export default function ProductInteractions({ 
  product, 
  variants 
}: { 
  product: any, 
  variants: string[] 
}) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(variants.length > 0 ? variants[0] : null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleBuyNow = () => {
    if (product.stock === 0 && product.is_physical) return;
    setShowCheckout(true);
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        padding: '16px 20px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.08)'
      }}>
        
        {/* Variations Row */}
        {variants.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {variants.map(variant => (
              <button 
                key={variant}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                style={{
                  minWidth: '48px',
                  height: '48px',
                  padding: '0 16px',
                  backgroundColor: selectedVariant === variant ? '#0a0a0a' : '#fff',
                  color: selectedVariant === variant ? '#fff' : '#0a0a0a',
                  border: `1px solid ${selectedVariant === variant ? '#0a0a0a' : 'var(--border)'}`,
                  borderRadius: '100px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                {variant}
              </button>
            ))}
          </div>
        )}

        {/* Action Row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ width: '56px', height: '56px', borderRadius: '100px', backgroundColor: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Heart size={22} />
          </button>
          <button 
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock === 0 && product.is_physical}
            style={{ 
              flex: 1, 
              height: '56px', 
              fontSize: '1.05rem', 
              fontWeight: 800, 
              borderRadius: '100px',
              backgroundColor: '#0a0a0a',
              color: '#fff',
              border: 'none',
              cursor: (product.stock === 0 && product.is_physical) ? 'not-allowed' : 'pointer',
              opacity: (product.stock === 0 && product.is_physical) ? 0.5 : 1,
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px'
            }}
          >
            <ShoppingBag size={20} />
            <span>{product.is_physical && product.stock === 0 ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal 
          product={product} 
          selectedVariant={selectedVariant}
          onClose={() => setShowCheckout(false)} 
        />
      )}
    </>
  );
}
