'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Download, 
  ArrowRight,
  Lock,
  Copy,
  Check,
  Sparkles,
  Receipt,
  Truck
} from 'lucide-react';

interface CheckoutModalProps {
  product: any;
  selectedVariant: string | null;
  onClose: () => void;
}

export default function CheckoutModal({ product, selectedVariant, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [utrRef, setUtrRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const supabase = createClient();

  const isPhysical = product.is_physical;
  const shippingFee = isPhysical ? (Number(product.shipping_fee) || 0) : 0;
  const itemPrice = Number(product.price) || 0;
  const totalPrice = itemPrice + shippingFee;

  // Master Platform Admin UPI ID (ALL payments come 100% to this ID)
  const masterUpiId = process.env.NEXT_PUBLIC_ADMIN_UPI_ID || '8015078755@ptsbi';
  const currentOrderId = orderId || `ORD_${Date.now()}`;
  const upiIntentUrl = `upi://pay?pa=${masterUpiId}&pn=${encodeURIComponent('Gigzo Store')}&am=${totalPrice}&tn=${currentOrderId}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiIntentUrl)}`;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(masterUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompleteOrder = async () => {
    if (!utrRef || utrRef.trim().length !== 12 || !/^\d+$/.test(utrRef.trim())) {
      alert("Please enter a valid 12-digit UPI UTR / Reference Number.");
      return;
    }
    
    setSubmitting(true);
    const newOrderId = orderId || `ORD_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const { error } = await supabase.from('orders').insert({
      creator_id: product.creator_id,
      product_id: product.id,
      amount: totalPrice,
      status: 'paid',
      buyer_name: name,
      buyer_email: email,
      buyer_phone: phone,
      shipping_address: isPhysical ? `${address}, PIN: ${pincode}` : null,
      payment_method: 'direct_upi',
      utr_ref: utrRef.trim() || null,
      selected_variant: selectedVariant || null,
    });

    if (error) {
      console.error('Order creation failed:', error);
      alert('Failed to record order: ' + error.message + '\n\n(Hint: Make sure your Supabase "orders" table has a policy allowing anonymous INSERT operations.)');
      setSubmitting(false);
      return;
    }

    setOrderId(newOrderId);
    setSubmitting(false);
    setStep('success');
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
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>Instant UPI Checkout</span>
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

          {/* STEP 1: BUYER DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleNextToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '100px', fontSize: '0.95rem', gap: '8px', marginTop: '8px' }}>
                <span>Continue to Payment</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 2: DIRECT INSTANT UPI PAYMENT */}
          {step === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f0ffd4', borderRadius: '20px', border: '1.5px solid #c8f135', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                
                {/* Dynamic QR Code */}
                <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '16px', border: '1px solid #d1d5db', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                  <img src={qrCodeUrl} alt="Scan UPI QR Code" style={{ width: '160px', height: '160px', borderRadius: '8px' }} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#3a6600' }}>Scan QR or click your preferred app below on mobile:</span>

                {/* 1-Tap Mobile UPI Intent App Buttons */}
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a 
                    href={`intent://pay?pa=${masterUpiId}&pn=Gigzo_Store&am=${totalPrice}&tn=${currentOrderId}&cu=INR#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`}
                    style={{ 
                      padding: '12px', borderRadius: '12px', backgroundColor: '#ffffff', color: '#1a73e8', 
                      border: '1.5px solid #4285f4', fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <span>Google Pay</span>
                  </a>

                  <a 
                    href={`intent://pay?pa=${masterUpiId}&pn=Gigzo_Store&am=${totalPrice}&tn=${currentOrderId}&cu=INR#Intent;scheme=upi;package=com.phonepe.app;end`}
                    style={{ 
                      padding: '12px', borderRadius: '12px', backgroundColor: '#ffffff', color: '#5f259f', 
                      border: '1.5px solid #5f259f', fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <span>PhonePe</span>
                  </a>

                  <a 
                    href={`intent://pay?pa=${masterUpiId}&pn=Gigzo_Store&am=${totalPrice}&tn=${currentOrderId}&cu=INR#Intent;scheme=upi;package=net.one97.paytm;end`}
                    style={{ 
                      padding: '12px', borderRadius: '12px', backgroundColor: '#ffffff', color: '#002e6e', 
                      border: '1.5px solid #00baf2', fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <span>Paytm</span>
                  </a>

                  <a 
                    href={upiIntentUrl}
                    style={{ 
                      padding: '12px', borderRadius: '12px', backgroundColor: '#0a0a0a', color: '#c8f135', 
                      border: '1.5px solid #0a0a0a', fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <span>Any UPI App →</span>
                  </a>
                </div>

                {/* Master UPI ID Box */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '8px 14px', borderRadius: '100px', border: '1px solid #d1d5db', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111' }}>Master UPI: {masterUpiId}</span>
                  <button type="button" onClick={handleCopyUpi} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                    {copiedUpi ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* UTR / Payment Ref Input for Fraud Prevention */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  UPI UTR / Ref No. (12 Digits)
                </label>
                <input 
                  value={utrRef} 
                  onChange={e => setUtrRef(e.target.value)} 
                  type="text" 
                  maxLength={16}
                  placeholder="e.g. 423819028471" 
                  className="input-field" 
                  style={{ fontWeight: 700, letterSpacing: '0.04em' }}
                />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Enter the 12-digit UTR number shown in your GPay/PhonePe payment receipt.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setStep('details')} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '100px', fontSize: '0.9rem' }}>
                  Back
                </button>
                <button type="button" onClick={handleCompleteOrder} disabled={submitting} className="btn-lime" style={{ flex: 2, padding: '14px', borderRadius: '100px', fontSize: '0.95rem', gap: '8px', justifyContent: 'center' }}>
                  <Lock size={16} />
                  <span>{submitting ? 'Verifying...' : 'I Have Paid — Confirm Order'}</span>
                </button>
              </div>
            </div>
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
                  Thank you, <strong style={{ color: 'var(--foreground)' }}>{name}</strong>! Your order has been recorded.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div style={{ width: '100%', padding: '18px', backgroundColor: 'var(--surface-2)', borderRadius: '18px', border: '1px solid var(--border)', textAlign: 'left', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  <span>Order Reference</span>
                  <span style={{ fontWeight: 800, color: 'var(--foreground)' }}>{orderId}</span>
                </div>
                {utrRef && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                    <span>UPI UTR / Ref</span>
                    <span style={{ fontWeight: 800, color: '#16a34a' }}>{utrRef}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  <span>Recipient UPI</span>
                  <span style={{ fontWeight: 800, color: 'var(--foreground)' }}>{masterUpiId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Receipt Sent To</span>
                  <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{email}</span>
                </div>
              </div>

              {!isPhysical ? (
                <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0', width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Download size={24} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#166534' }}>Digital Download Unlocked</div>
                    <div style={{ fontSize: '0.78rem', color: '#15803d' }}>Download access link has been dispatched to {email}.</div>
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
          <span>Secure 100% Direct UPI Payout</span>
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
