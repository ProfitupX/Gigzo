'use client';

import { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Copy, 
  Check, 
  Clock, 
  Download, 
  Truck, 
  QrCode, 
  Smartphone,
  ShieldCheck,
  Zap,
  Info,
  Receipt,
  Layers,
  Sparkles
} from 'lucide-react';
import { GooglePayLogo, PhonePeLogo, PaytmLogo, BhimUpiLogo, UpiBadge } from '@/components/ui/UpiIcons';
import { calculateMilestoneSchedule } from '@/lib/escrowLedger';

interface CheckoutModalProps {
  product: any;
  selectedVariant: string | null;
  onClose: () => void;
  initialStep?: 'details' | 'payment' | 'success';
  initialOrderId?: string;
}

export default function CheckoutModal({ 
  product, 
  selectedVariant, 
  onClose, 
  initialStep = 'details', 
  initialOrderId = '' 
}: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>(initialStep);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [activeTab, setActiveTab] = useState<'apps' | 'qr'>('apps');

  const isPhysical = product.is_physical;
  const shippingFee = isPhysical ? (Number(product.shipping_fee) || 0) : 0;
  const itemPrice = Number(product.price) || 0;
  const totalPrice = itemPrice + shippingFee;

  // High-Ticket Custom / Advance Booking Detection (ONLY FOR ₹10,000+ HIGH-TICKET CUSTOM PRODUCTS)
  const isCustomProduct = totalPrice >= 10000 && (
    product.is_custom_order || 
    /custom|advance|booking|handmade|tailor|portrait|art|craft/i.test(product.title || '') || 
    /custom|advance|booking|made-to-order/i.test(product.description || '')
  );

  const [paymentMode, setPaymentMode] = useState<'milestone' | 'full'>(isCustomProduct ? 'milestone' : 'full');
  const milestoneSchedule = calculateMilestoneSchedule(totalPrice);

  const payableAmount = (isCustomProduct && paymentMode === 'milestone') 
    ? milestoneSchedule.phase1Advance 
    : totalPrice;

  const adminUpiId = process.env.NEXT_PUBLIC_ADMIN_UPI_ID || '8015078755@ptsbi';
  const upiPayUrl = `upi://pay?pa=${adminUpiId}&pn=ProfitupX&am=${payableAmount}&tn=Order-${orderId || 'STORE'}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiPayUrl)}`;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          selectedVariant,
          buyer_name: name,
          buyer_email: email,
          buyer_phone: phone,
          shipping_address: isPhysical ? `${address}, PIN: ${pincode}` : null
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to place order');
      }

      setOrderId(data.order_id);
      setStep('success');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Payment confirmation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(10, 10, 10, 0.82)',
      backdropFilter: 'blur(10px)',
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
        boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative',
        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#0a0a0a', color: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>G</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.94rem', letterSpacing: '-0.02em', color: '#0a0a0a' }}>
                {step === 'details' ? 'Delivery Details' : step === 'payment' ? 'Fast UPI Payment' : 'Order Receipt'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} /> 100% Secure & Zero Gateway Fee
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '8px', color: '#64748b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div style={{ padding: '12px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', border: '1px solid #e2e8f0', flexShrink: 0 }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>Item</div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, color: '#0f172a' }}>{product.title}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              {selectedVariant && (
                <span style={{ fontSize: '0.72rem', backgroundColor: '#e2e8f0', color: '#334155', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  {selectedVariant}
                </span>
              )}
              {shippingFee > 0 && <span style={{ fontSize: '0.7rem', color: '#64748b' }}>+ ₹{shippingFee} delivery</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0a0a0a' }}>₹{totalPrice.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px' }}>

          {/* STEP 1: BUYER DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Your Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g. Ramesh Kumar" className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Email Address</label>
                  <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="ramesh@gmail.com" className="input-field" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Phone / WhatsApp</label>
                  <input required value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="9876543210" className="input-field" />
                </div>
              </div>

              {isPhysical && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Delivery Address</label>
                    <textarea required value={address} onChange={e => setAddress(e.target.value)} rows={2} placeholder="Door No, Street Name, Area, City" className="input-field" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Pincode</label>
                    <input required value={pincode} onChange={e => setPincode(e.target.value)} type="text" placeholder="600001" className="input-field" />
                  </div>
                </>
              )}

              {/* 30-40-30 Custom Milestone Escrow Card (FOR CUSTOM & ADVANCE BOOKING ONLY) */}
              {isCustomProduct && (
                <div style={{
                  padding: '14px',
                  backgroundColor: '#070d19',
                  borderRadius: '18px',
                  border: '1.5px solid rgba(56, 189, 248, 0.35)',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} color="#38bdf8" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                        30-40-30 Custom Milestone Escrow
                      </span>
                    </div>
                    <span style={{ fontSize: '0.65rem', backgroundColor: '#38bdf8', color: '#030712', padding: '2px 8px', borderRadius: '100px', fontWeight: 900 }}>
                      CUSTOM ORDER
                    </span>
                  </div>

                  <p style={{ fontSize: '0.74rem', color: '#cbd5e1', margin: 0, lineHeight: 1.35 }}>
                    Zero financial risk for made-to-order items. Pay in 3 verified stages:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '0.7rem' }}>
                    <div style={{ padding: '6px 8px', backgroundColor: 'rgba(56,189,248,0.15)', borderRadius: '10px', border: '1px solid #38bdf8', textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#38bdf8' }}>1. Advance (30%)</div>
                      <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#fff' }}>₹{milestoneSchedule.phase1Advance}</div>
                      <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Raw Materials</div>
                    </div>
                    <div style={{ padding: '6px 8px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#e2e8f0' }}>2. WIP (40%)</div>
                      <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#fff' }}>₹{milestoneSchedule.phase2Wip}</div>
                      <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>On Photo Review</div>
                    </div>
                    <div style={{ padding: '6px 8px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#e2e8f0' }}>3. Delivery (30%)</div>
                      <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#fff' }}>₹{milestoneSchedule.phase3Delivery}</div>
                      <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Final Unboxing</div>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-lime" style={{ width: '100%', padding: '15px', borderRadius: '100px', fontSize: '0.96rem', fontWeight: 900, gap: '8px', marginTop: '6px', justifyContent: 'center', boxShadow: '0 8px 24px rgba(200,241,53,0.3)' }}>
                <span>
                  {isCustomProduct && paymentMode === 'milestone' 
                    ? `Proceed to Pay Phase 1 (30% Advance) — ₹${payableAmount.toLocaleString('en-IN')}` 
                    : `Proceed to UPI Payment — ₹${totalPrice.toLocaleString('en-IN')}`}
                </span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 2: PROFESSIONAL DIRECT UPI APP & QR PAYMENT */}
          {step === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Modern Payment Amount Banner */}
              <div style={{
                padding: '14px 18px',
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#c8f135', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isCustomProduct && paymentMode === 'milestone' 
                      ? 'Payable Today (30% Raw Material Advance)' 
                      : 'Total Payable Amount'}
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, lineHeight: 1.1, marginTop: '2px' }}>
                    ₹{payableAmount.toLocaleString('en-IN')}
                  </div>
                  {isCustomProduct && paymentMode === 'milestone' && (
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                      Total Custom Order Value: ₹{totalPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(200,241,53,0.15)',
                  border: '1px solid rgba(200,241,53,0.4)',
                  borderRadius: '100px',
                  color: '#c8f135',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Zap size={13} /> 0% Fee UPI
                </div>
              </div>

              {/* Toggle: 1-Click UPI Apps vs QR Code */}
              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('apps')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'apps' ? '#ffffff' : 'transparent',
                    color: activeTab === 'apps' ? '#0a0a0a' : '#64748b',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: activeTab === 'apps' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  <Smartphone size={15} />
                  <span>1-Click UPI Apps</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'qr' ? '#ffffff' : 'transparent',
                    color: activeTab === 'qr' ? '#0a0a0a' : '#64748b',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: activeTab === 'qr' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  <QrCode size={15} />
                  <span>Scan QR Code</span>
                </button>
              </div>

              {/* TAB 1: 1-CLICK UPI APPS (Grid with Official Brand Logos) */}
              {activeTab === 'apps' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', textAlign: 'left' }}>
                    Tap to open your payment app:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {/* Google Pay */}
                    <a 
                      href={upiPayUrl}
                      className="upi-app-card"
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <GooglePayLogo size={36} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>Google Pay</div>
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>⚡ 1-Tap Pay</div>
                      </div>
                    </a>

                    {/* PhonePe */}
                    <a 
                      href={upiPayUrl}
                      className="upi-app-card"
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <PhonePeLogo size={36} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>PhonePe</div>
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>⚡ 1-Tap Pay</div>
                      </div>
                    </a>

                    {/* Paytm */}
                    <a 
                      href={upiPayUrl}
                      className="upi-app-card"
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <PaytmLogo size={36} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>Paytm</div>
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>⚡ 1-Tap Pay</div>
                      </div>
                    </a>

                    {/* BHIM / Other UPI */}
                    <a 
                      href={upiPayUrl}
                      className="upi-app-card"
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <BhimUpiLogo size={36} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>Any UPI App</div>
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>⚡ BHIM / Cred</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: CLEAN QR CODE CARD */}
              {activeTab === 'qr' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>
                    Scan with any UPI App (GPay / PhonePe / Paytm / BHIM)
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1.5px solid #cbd5e1',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                  }}>
                    <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '170px', height: '170px', display: 'block' }} />
                  </div>
                </div>
              )}

              {/* Primary Confirm Button */}
              <button 
                type="button" 
                onClick={handleConfirmPayment} 
                disabled={submitting} 
                className="btn-lime" 
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '100px',
                  fontSize: '0.98rem',
                  fontWeight: 900,
                  gap: '8px',
                  justifyContent: 'center',
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(200,241,53,0.35)',
                  backgroundColor: '#c8f135',
                  color: '#0a0a0a',
                  marginTop: '4px'
                }}
              >
                {submitting ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span>Confirming Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>I Have Paid ₹{totalPrice.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => setStep('details')} 
                style={{ background: 'none', border: 'none', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
              >
                ← Back to Delivery Details
              </button>
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', backgroundColor: '#f0ffd4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #c8f135', boxShadow: '0 8px 24px rgba(200,241,53,0.35)' }}>
                <CheckCircle2 size={38} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 6px', color: '#0f172a' }}>Order Placed Successfully!</h3>
                <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
                  Thank you, <strong>{name}</strong>! Your order has been placed.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div style={{ width: '100%', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '18px', border: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b' }}>
                  <span>Order Reference</span>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b' }}>
                  <span>Amount Paid</span>
                  <span style={{ fontWeight: 900, color: '#0f172a' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Status</span>
                  <span style={{ fontWeight: 800, color: '#d97706', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '100px', fontSize: '0.74rem' }}>
                    Payment Processing / Recorded
                  </span>
                </div>
              </div>

              {!isPhysical ? (
                <div style={{ padding: '14px', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0', width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Download size={22} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#166534' }}>Digital Item Unlocked</div>
                    <div style={{ fontSize: '0.76rem', color: '#15803d' }}>Access instructions sent to <strong>{email}</strong>.</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '14px', backgroundColor: '#e0f2fe', borderRadius: '16px', border: '1px solid #bae6fd', width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Truck size={22} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0369a1' }}>Dispatching to Address</div>
                    <div style={{ fontSize: '0.76rem', color: '#0284c7' }}>Expected delivery in 3-5 business days.</div>
                  </div>
                </div>
              )}

              {/* 48-Hour Escrow Protection Notice */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fffbeb',
                borderRadius: '16px',
                border: '1px solid #fde68a',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldCheck size={20} color="#d97706" style={{ flexShrink: 0 }} />
                <div style={{ textAlign: 'left', fontSize: '0.76rem', color: '#92400e', lineHeight: 1.3 }}>
                  <strong>48-Hour Buyer Protection:</strong> Funds held in Escrow. You can report any issue or request a 100% refund within 48 hours.
                </div>
              </div>

              {/* WhatsApp 1-Click Receipt Button */}
              {orderId && (
                <a
                  href={`https://wa.me/91${phone}?text=${encodeURIComponent(`🛍️ *Order Confirmed!* \nItem: ${product.title}\nAmount: ₹${totalPrice}\nReceipt & 48H Dispute Portal: ${typeof window !== 'undefined' ? window.location.origin : ''}/order/${orderId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '100px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(37,211,102,0.25)'
                  }}
                >
                  <span>📲 Save Receipt on WhatsApp</span>
                </a>
              )}

              {/* View Live Receipt & Dispute Portal */}
              {orderId && (
                <a
                  href={`/order/${orderId}`}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '100px',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Receipt size={15} />
                  <span>View Live Receipt & Dispute Portal</span>
                </a>
              )}

              <button type="button" onClick={onClose} className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '100px', fontSize: '0.92rem', marginTop: '2px' }}>
                Done & Return to Store
              </button>
            </div>
          )}

        </div>

        {/* Security Footer */}
        <div style={{ padding: '12px 20px', backgroundColor: '#fafafa', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
          <ShieldCheck size={14} color="#16a34a" />
          <span>Secured Direct UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
        </div>

      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .upi-app-card:hover {
          border-color: #0a0a0a !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08) !important;
        }
        .upi-app-card:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
}
