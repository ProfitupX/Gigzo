'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  X, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  Copy,
  Check,
  Clock,
  Download,
  Truck
} from 'lucide-react';

interface CheckoutModalProps {
  product: any;
  selectedVariant: string | null;
  onClose: () => void;
  initialStep?: 'details' | 'payment' | 'success';
  initialOrderId?: string;
}

export default function CheckoutModal({ product, selectedVariant, onClose, initialStep = 'details', initialOrderId = '' }: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>(initialStep);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(initialOrderId);

  const isPhysical = product.is_physical;
  const shippingFee = isPhysical ? (Number(product.shipping_fee) || 0) : 0;
  const itemPrice = Number(product.price) || 0;
  const totalPrice = itemPrice + shippingFee;

  const handleCashfreeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/checkout/cashfree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          selectedVariant,
          buyer_name: name,
          buyer_email: email,
          buyer_phone: phone,
          shipping_address: isPhysical ? `${address}, PIN: ${pincode}` : null,
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Checkout API error:', data);
        const errMsg = data.details?.message || data.error || 'Failed to initialize payment';
        throw new Error(errMsg);
      }

      if (data.payment_session_id) {
        // Load Cashfree SDK
        const loadCashfree = async () => {
          return new Promise((resolve, reject) => {
            if ((window as any).Cashfree) return resolve((window as any).Cashfree);
            const script = document.createElement('script');
            script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
            script.onload = () => {
              const cf = (window as any).Cashfree({ mode: 'production' }); // or sandbox based on env
              resolve(cf);
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
        };

        const cf: any = await loadCashfree();
        
        cf.checkout({
          paymentSessionId: data.payment_session_id,
          returnUrl: `${window.location.origin}/${product.creator_id}/product/${product.id}?success=true&order_ref=${data.order_id}`
        });

      } else {
        throw new Error('No payment session received');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Payment failed to initialize. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(10, 10, 10, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div className="bottom-sheet-modal" style={{
        backgroundColor: '#ffffff',
        borderRadius: '28px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        position: 'relative',
        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#0a0a0a', color: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>G</div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>Secure Checkout</span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Order Summary Bar */}
        <div style={{ padding: '16px 24px', backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', border: '1px solid var(--border)', flexShrink: 0 }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#999' }}>No Image</div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {selectedVariant ? `Variant: ${selectedVariant}` : product.category}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 900 }}>₹{totalPrice.toLocaleString('en-IN')}</div>
            {shippingFee > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+ ₹{shippingFee} ship</div>}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>

          {/* STEP 1: BUYER DETAILS (Cashfree) */}
          {step === 'details' && (
            <form onSubmit={handleCashfreeCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Rahul Sharma" className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="rahul@gmail.com" className="input-field" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Phone / WhatsApp</label>
                  <input required value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="9876543210" className="input-field" />
                </div>
              </div>

              {isPhysical && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Delivery Address</label>
                    <textarea required value={address} onChange={e => setAddress(e.target.value)} rows={2} placeholder="House/Flat No., Street, Landmark, City" className="input-field" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Pincode</label>
                    <input required value={pincode} onChange={e => setPincode(e.target.value)} type="text" placeholder="400001" className="input-field" />
                  </div>
                </>
              )}

              <button type="submit" disabled={submitting} className="btn-lime" style={{ width: '100%', padding: '16px', borderRadius: '100px', fontSize: '0.95rem', gap: '8px', marginTop: '8px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer', justifyContent: 'center' }}>
                {submitting ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Pay ₹{totalPrice.toLocaleString('en-IN')} Securely</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#f0ffd4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>Order Placed Successfully!</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Thank you! Your payment has been confirmed.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div style={{ width: '100%', padding: '18px', backgroundColor: 'var(--surface-2)', borderRadius: '18px', border: '1px solid var(--border)', textAlign: 'left', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  <span>Order Reference</span>
                  <span style={{ fontWeight: 800, color: 'var(--foreground)' }}>{orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  <span>Payment Method</span>
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>Online Payment</span>
                </div>
              </div>

              {!isPhysical ? (
                <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0', width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Download size={24} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#166534' }}>Digital Download Unlocked</div>
                    <div style={{ fontSize: '0.78rem', color: '#15803d' }}>Download access link has been dispatched to your email.</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '14px', backgroundColor: '#e0f2fe', borderRadius: '16px', border: '1px solid #bae6fd', width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Truck size={22} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0369a1' }}>Dispatching to Address</div>
                    <div style={{ fontSize: '0.78rem', color: '#0284c7' }}>Expected delivery in 3-5 business days.</div>
                  </div>
                </div>
              )}

              <button type="button" onClick={onClose} className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '100px', fontSize: '0.92rem', marginTop: '10px' }}>
                Done & Return to Store
              </button>
            </div>
          )}

        </div>

        {/* Security Footer */}
        <div style={{ padding: '14px 24px', backgroundColor: '#fafafa', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <Lock size={12} />
          <span>Secured by Cashfree Payments</span>
        </div>

      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
