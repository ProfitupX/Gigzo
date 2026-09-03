'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CheckoutModal from './CheckoutModal';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { ProductVariant } from '@/lib/variantUtils';

export default function ProductInteractions({ 
  product, 
  variants = [] 
}: { 
  product: any, 
  variants: ProductVariant[] 
}) {
  const basePrice = Number(product.price) || 0;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [liked, setLiked] = useState(false);

  // Current active price based on selected variant
  const activePrice = selectedVariant && selectedVariant.price !== undefined 
    ? selectedVariant.price 
    : basePrice;

  // Clone product with updated active price for checkout
  const activeProduct = {
    ...product,
    price: activePrice
  };

  const handleBuyNow = () => {
    if (product.stock === 0 && product.is_physical) return;
    setShowCheckout(true);
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        padding: '16px 20px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.08)'
      }}>
        
        {/* Variations Row with clean pill UI */}
        {variants.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
              <span>SELECT OPTION:</span>
              {selectedVariant && selectedVariant.price !== undefined && (
                <span style={{ color: '#0a0a0a', fontWeight: 900 }}>
                  ₹{selectedVariant.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              {variants.map((v, idx) => {
                const isSelected = selectedVariant?.name === v.name;
                const hasCustomPrice = v.price !== undefined && v.price !== basePrice;

                return (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      minWidth: '54px',
                      height: '44px',
                      padding: '0 16px',
                      backgroundColor: isSelected ? '#0a0a0a' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#0a0a0a',
                      border: `1.5px solid ${isSelected ? '#0a0a0a' : '#e2e8f0'}`,
                      borderRadius: '100px',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                    }}
                  >
                    <span>{v.name}</span>
                    {hasCustomPrice && (
                      <span style={{ 
                        fontSize: '0.72rem', 
                        opacity: isSelected ? 0.9 : 0.6,
                        fontWeight: 700 
                      }}>
                        ₹{v.price}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            onClick={() => setLiked(!liked)}
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '100px', 
              backgroundColor: liked ? '#fee2e2' : '#fff', 
              border: `1px solid ${liked ? '#fca5a5' : 'var(--border)'}`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0,
              cursor: 'pointer',
              color: liked ? '#ef4444' : '#0a0a0a',
              transition: 'all 0.2s'
            }}
          >
            <Heart size={22} fill={liked ? '#ef4444' : 'none'} />
          </button>
          
          <button 
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock === 0 && product.is_physical}
            style={{ 
              flex: 1, 
              height: '56px', 
              fontSize: '1.05rem', 
              fontWeight: 900, 
              borderRadius: '100px', 
              backgroundColor: '#0a0a0a', 
              color: '#c8f135', 
              border: 'none', 
              cursor: (product.stock === 0 && product.is_physical) ? 'not-allowed' : 'pointer',
              opacity: (product.stock === 0 && product.is_physical) ? 0.5 : 1,
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}
          >
            <ShoppingBag size={20} />
            <span>
              {product.is_physical && product.stock === 0 
                ? 'Sold Out' 
                : `Buy Now — ₹${activePrice.toLocaleString('en-IN')}`
              }
            </span>
          </button>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal 
          product={activeProduct} 
          selectedVariant={selectedVariant ? (selectedVariant.price ? `${selectedVariant.name} (₹${selectedVariant.price})` : selectedVariant.name) : null}
          onClose={() => setShowCheckout(false)} 
        />
      )}
    </>
  );
}
