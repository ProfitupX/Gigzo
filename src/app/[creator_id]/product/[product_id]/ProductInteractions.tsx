'use client';

import { useState } from 'react';
import CheckoutModal from './CheckoutModal';
import { ShoppingBag, Zap, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function ProductInteractions({ 
  product, 
  variants 
}: { 
  product: any, 
  variants: string[] 
}) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(variants.length > 0 ? variants[0] : null);
  const [added, setAdded] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = () => {
    if (product.stock === 0 && product.is_physical) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (product.stock === 0 && product.is_physical) return;
    setShowCheckout(true);
  };

  return (
    <div>
      {/* Variations Selector */}
      {variants.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--foreground)' }}>Select Variant</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {variants.map(variant => (
              <button 
                key={variant}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                style={{
                  padding: '10px 18px',
                  backgroundColor: selectedVariant === variant ? '#0a0a0a' : '#fff',
                  color: selectedVariant === variant ? '#fff' : '#0a0a0a',
                  border: `2px solid ${selectedVariant === variant ? '#0a0a0a' : 'var(--border)'}`,
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: selectedVariant === variant ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          type="button"
          onClick={handleBuyNow}
          disabled={product.stock === 0 && product.is_physical}
          className="btn-lime"
          style={{ 
            width: '100%', 
            padding: '18px', 
            fontSize: '1.05rem', 
            fontWeight: 900, 
            borderRadius: '100px',
            cursor: (product.stock === 0 && product.is_physical) ? 'not-allowed' : 'pointer',
            opacity: (product.stock === 0 && product.is_physical) ? 0.5 : 1,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '10px',
            boxShadow: '0 8px 24px rgba(200, 241, 53, 0.35)'
          }}
        >
          <Zap size={20} />
          <span>{product.is_physical && product.stock === 0 ? 'Sold Out' : 'Buy Now — Express Checkout'}</span>
        </button>

        <button 
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0 && product.is_physical}
          className="btn-secondary"
          style={{ 
            width: '100%', 
            padding: '16px', 
            fontSize: '0.95rem', 
            fontWeight: 800, 
            borderRadius: '100px',
            cursor: (product.stock === 0 && product.is_physical) ? 'not-allowed' : 'pointer',
            opacity: (product.stock === 0 && product.is_physical) ? 0.5 : 1,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '10px'
          }}
        >
          {added ? <Check size={18} style={{ color: '#16a34a' }} /> : <ShoppingBag size={18} />}
          <span>{added ? 'Added to Cart' : 'Add to Bag'}</span>
        </button>
      </div>

      {/* Trust Guarantee Bar */}
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: '16px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <ShieldCheck size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
          <span>Verified Creator Store</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <Truck size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
          <span>UPI / COD Supported</span>
        </div>
      </div>

      {/* Checkout Modal Trigger */}
      {showCheckout && (
        <CheckoutModal 
          product={product} 
          selectedVariant={selectedVariant} 
          onClose={() => setShowCheckout(false)} 
        />
      )}
    </div>
  );
}
