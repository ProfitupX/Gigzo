'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Package, 
  Truck, 
  Download, 
  ArrowLeft, 
  Receipt, 
  MapPin, 
  Send, 
  X,
  Lock,
  Phone,
  Mail,
  Copy,
  Check,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';
import { getEscrowProtectionStatus, EscrowProtectionStatus, calculateMilestoneSchedule } from '@/lib/escrowLedger';
import { createClient } from '@/lib/supabase/client';

export default function OrderReceiptPage({ params }: { params: Promise<{ order_id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.order_id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Damaged / Broken Product');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [disputeSuccess, setDisputeSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [wipProcessing, setWipProcessing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleApproveWip = async () => {
    if (!confirm('Approve this Work-In-Progress (WIP) and unlock Phase 2 (40%) payment?')) return;
    setWipProcessing(true);
    try {
      const res = await fetch('/api/orders/milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_wip', order_id: orderId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('WIP Approved! Phase 2 (40%) payment unlocked.');
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to approve WIP');
    } finally {
      setWipProcessing(false);
    }
  };

  const handleRejectWip = async () => {
    const reason = prompt('Please enter the reason for rejecting the WIP proof:');
    if (!reason) return;
    setWipProcessing(true);
    try {
      const res = await fetch('/api/orders/milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject_wip', order_id: orderId, rejection_reason: reason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Order cancelled at WIP stage. Seller retains 30% advance for materials. You will not be charged further.');
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to reject WIP');
    } finally {
      setWipProcessing(false);
    }
  };

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            image_url,
            is_physical,
            price
          )
        `)
        .eq('id', orderId)
        .single();

      if (data) {
        setOrder(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReceiptLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingDispute(true);

    try {
      const res = await fetch('/api/orders/dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          reason: disputeReason,
          description: disputeNotes,
          buyer_phone: order?.buyer_phone
        })
      });

      const d = await res.json();
      if (res.ok) {
        setDisputeSuccess(true);
        setOrder((prev: any) => ({ ...prev, status: 'disputed' }));
        setTimeout(() => {
          setDisputeModalOpen(false);
        }, 2500);
      } else {
        alert(d.error || 'Failed to submit dispute');
      }
    } catch (e) {
      alert('Network error. Please try again.');
    } finally {
      setSubmittingDispute(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #cbd5e1', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Order Receipt Not Found</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Please check the link provided in your receipt or contact support.</p>
        <Link href="/" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '100px' }}>
          Return to Home
        </Link>
      </div>
    );
  }

  const protection: EscrowProtectionStatus = getEscrowProtectionStatus(order.created_at);
  const isDisputed = order.status === 'disputed';
  const whatsappReceiptText = encodeURIComponent(
    `🛍️ *Order Receipt: #${order.id.slice(0, 8)}*\n\n` +
    `*Item:* ${order.products?.title || 'Product'}\n` +
    `*Amount:* ₹${Number(order.amount).toLocaleString('en-IN')}\n` +
    `*Status:* 🛡️ Escrow Protected (48h Protection)\n\n` +
    `*Live Tracking & Dispute Portal:* ${typeof window !== 'undefined' ? window.location.href : ''}`
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', padding: '24px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Top Header Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          position: 'relative'
        }}>
          {/* Status Icon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              backgroundColor: isDisputed ? '#fee2e2' : '#dcfce7',
              color: isDisputed ? '#dc2626' : '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isDisputed ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            </div>

            <div style={{
              padding: '4px 12px',
              borderRadius: '100px',
              fontSize: '0.75rem',
              fontWeight: 800,
              backgroundColor: isDisputed ? '#fee2e2' : '#f0fdf4',
              color: isDisputed ? '#dc2626' : '#16a34a',
              border: `1px solid ${isDisputed ? '#fca5a5' : '#bbf7d0'}`,
              textTransform: 'uppercase'
            }}>
              {isDisputed ? '🚨 Dispute Under Review' : '🛡️ Escrow Vault Secured'}
            </div>
          </div>

          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 4px', color: '#0f172a' }}>
            {isDisputed ? 'Order Disputed' : 'Order Receipt & Status'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.84rem', margin: 0 }}>
            Order ID: <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{order.id}</strong>
          </p>
        </div>

        {/* 48-Hour Buyer Protection Banner Card */}
        <div style={{
          backgroundColor: isDisputed ? '#fef2f2' : '#fffbeb',
          border: `1.5px solid ${isDisputed ? '#fca5a5' : '#fde68a'}`,
          borderRadius: '20px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color={isDisputed ? '#dc2626' : '#d97706'} />
              <span style={{ fontSize: '0.84rem', fontWeight: 900, color: isDisputed ? '#991b1b' : '#92400e' }}>
                48-Hour ProfitupX Buyer Protection Policy
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', backgroundColor: isDisputed ? '#dc2626' : '#d97706', color: '#ffffff', padding: '2px 8px', borderRadius: '100px', fontWeight: 900 }}>
              {isDisputed ? 'ESCROW FROZEN' : '100% REFUND SAFE'}
            </span>
          </div>

          {!isDisputed ? (
            <>
              <p style={{ fontSize: '0.78rem', color: '#78350f', margin: 0, lineHeight: 1.4 }}>
                Your payment of <strong>₹{Number(order.amount).toLocaleString('en-IN')}</strong> is safely locked in the <strong>Central Escrow Vault</strong>. The seller will only receive funds after 48 hours if you have no complaints.
              </p>
              
              <div style={{ width: '100%', height: '6px', backgroundColor: '#fef3c7', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${protection.percentMatured}%`, height: '100%', backgroundColor: '#d97706', borderRadius: '10px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#92400e', fontWeight: 700 }}>
                <span>{protection.statusText}</span>
                <span>48H Window</span>
              </div>
            </>
          ) : (
            <p style={{ fontSize: '0.8rem', color: '#991b1b', margin: 0, fontWeight: 700 }}>
              🚨 You have raised a dispute for this order. The seller payout has been frozen in Escrow Vault. Admin will review and process your refund.
            </p>
          )}
        </div>

        {/* 30-40-30 Custom Milestone Escrow Stepper (ONLY FOR ₹10,000+ HIGH-TICKET CUSTOM ORDERS) */}
        {(() => {
          const wipMatch = order.utr_ref?.match(/\[WIP_PROOF:\s*([^\]]+)\]/);
          const wipImageUrl = wipMatch ? wipMatch[1] : null;
          const isMilestoneOrder = Number(order.amount) >= 10000 || !!wipImageUrl || order.status.startsWith('wip_');
          
          if (!isMilestoneOrder) return null;

          const schedule = calculateMilestoneSchedule(order.amount);

          return (
            <div style={{
              backgroundColor: '#070d19',
              borderRadius: '24px',
              padding: '22px',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#38bdf8" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                    30-40-30 Custom Milestone Escrow
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#38bdf8', color: '#030712', padding: '2px 8px', borderRadius: '100px', fontWeight: 900 }}>
                  STAGE {order.status === 'wip_submitted' ? '2 (WIP REVIEW)' : order.status === 'wip_approved' ? '2 (APPROVED)' : order.status === 'wip_rejected' ? 'CANCELLED' : '1 (ADVANCE)'}
                </span>
              </div>

              {/* 3-Stage Progress Steps */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.72rem' }}>
                <div style={{ padding: '8px', backgroundColor: 'rgba(56,189,248,0.15)', borderRadius: '12px', border: '1px solid #38bdf8', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: '#38bdf8' }}>1. Advance (30%)</div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#fff' }}>₹{schedule.phase1Advance}</div>
                  <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>✓ Paid (Materials)</div>
                </div>

                <div style={{ padding: '8px', backgroundColor: order.status === 'wip_submitted' ? 'rgba(234,179,8,0.15)' : order.status === 'wip_approved' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)', borderRadius: '12px', border: `1px solid ${order.status === 'wip_submitted' ? '#eab308' : order.status === 'wip_approved' ? '#10b981' : 'rgba(255,255,255,0.1)'}`, textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: order.status === 'wip_submitted' ? '#eab308' : order.status === 'wip_approved' ? '#10b981' : '#e2e8f0' }}>2. WIP (40%)</div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#fff' }}>₹{schedule.phase2Wip}</div>
                  <div style={{ fontSize: '0.65rem', color: order.status === 'wip_submitted' ? '#eab308' : order.status === 'wip_approved' ? '#10b981' : '#94a3b8', fontWeight: 700 }}>
                    {order.status === 'wip_submitted' ? '⏳ Review Needed' : order.status === 'wip_approved' ? '✓ Approved' : order.status === 'wip_rejected' ? '✗ Rejected' : 'Waiting Photo'}
                  </div>
                </div>

                <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: '#e2e8f0' }}>3. Delivery (30%)</div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#fff' }}>₹{schedule.phase3Delivery}</div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Final Unboxing</div>
                </div>
              </div>

              {/* Work-In-Progress (WIP) Photo Review Card */}
              {wipImageUrl && order.status === 'wip_submitted' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: 'rgba(234, 179, 8, 0.08)',
                  borderRadius: '16px',
                  border: '1.5px solid #eab308',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fef08a', fontWeight: 800, fontSize: '0.84rem' }}>
                    <Camera size={18} color="#eab308" />
                    <span>Seller Uploaded Work-In-Progress (WIP) Proof!</span>
                  </div>

                  <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#030712' }}>
                    <img src={wipImageUrl} alt="WIP Proof" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>

                  <p style={{ fontSize: '0.76rem', color: '#cbd5e1', margin: 0, lineHeight: 1.35 }}>
                    Please review the custom craftsmanship. If satisfied, click <strong>Approve & Pay Phase 2 (40%)</strong>. If unsatisfied, you can reject without any further charges.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={wipProcessing}
                      onClick={handleApproveWip}
                      style={{
                        padding: '12px',
                        borderRadius: '100px',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                      }}
                    >
                      {wipProcessing ? 'Processing...' : `✅ Approve & Pay 40% (₹${schedule.phase2Wip})`}
                    </button>

                    <button
                      type="button"
                      disabled={wipProcessing}
                      onClick={handleRejectWip}
                      style={{
                        padding: '12px',
                        borderRadius: '100px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
                      }}
                    >
                      ❌ Reject & Cancel
                    </button>
                  </div>
                </div>
              )}

              {order.status === 'wip_rejected' && (
                <div style={{ padding: '12px', backgroundColor: 'rgba(220,38,38,0.15)', border: '1px solid #dc2626', borderRadius: '12px', fontSize: '0.78rem', color: '#fca5a5' }}>
                  🚫 <strong>WIP Rejected by Buyer:</strong> Order has been cancelled. Seller retains 30% advance for raw materials. No further charges will be billed.
                </div>
              )}
            </div>
          );
        })()}

        {/* Order Details Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Purchased Product */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: 56, height: 56, borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
              {order.products?.image_url ? (
                <img src={order.products.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Package size={26} style={{ margin: '14px auto', display: 'block', color: '#94a3b8' }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {order.products?.title || 'Purchased Product'}
              </div>
              {order.selected_variant && (
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
                  Variant: {order.selected_variant}
                </div>
              )}
              <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                {order.products?.is_physical ? '🚚 Physical Delivery' : '⚡ Digital Item'}
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              ₹{Number(order.amount).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Delivery / Buyer Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Buyer Name</span>
              <strong style={{ color: '#0f172a' }}>{order.buyer_name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Phone</span>
              <strong style={{ color: '#0f172a' }}>{order.buyer_phone}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Email</span>
              <strong style={{ color: '#0f172a' }}>{order.buyer_email}</strong>
            </div>

            {order.shipping_address && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', alignItems: 'flex-start' }}>
                <span>Delivery Address</span>
                <span style={{ color: '#0f172a', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>
                  {order.shipping_address}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* WhatsApp Receipt Button */}
          <a
            href={`https://wa.me/91${order.buyer_phone}?text=${whatsappReceiptText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '100px',
              backgroundColor: '#25D366',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
            }}
          >
            <span>📲 Save Receipt on WhatsApp</span>
          </a>

          {/* Report Issue / Dispute Button */}
          {!isDisputed && (
            <button
              type="button"
              onClick={() => setDisputeModalOpen(true)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '100px',
                backgroundColor: '#ffffff',
                color: '#dc2626',
                border: '1.5px solid #fca5a5',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <AlertTriangle size={16} />
              <span>Report Issue / Request Refund (48H Window)</span>
            </button>
          )}

          {/* Copy Receipt Link */}
          <button
            type="button"
            onClick={handleCopyReceiptLink}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px'
            }}
          >
            {copiedLink ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Permanent Receipt Link'}</span>
          </button>
        </div>

      </div>

      {/* DISPUTE MODAL */}
      {disputeModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={22} color="#dc2626" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                  Raise Buyer Protection Dispute
                </h3>
              </div>
              <button
                onClick={() => setDisputeModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {disputeSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={28} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: '#166534' }}>
                  Dispute Registered Successfully!
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.84rem', margin: 0 }}>
                  Seller payout has been **FROZEN** in Escrow Vault. Admin will review and process your refund within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDispute} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Select Issue Reason
                  </label>
                  <select
                    value={disputeReason}
                    onChange={e => setDisputeReason(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <option value="Damaged / Broken Product">⚠️ Damaged / Broken Product</option>
                    <option value="Wrong Item Received">❌ Wrong Item Received</option>
                    <option value="Item Not Received (Seller Delayed)">🚫 Item Not Received (Seller Delayed)</option>
                    <option value="Fake / Quality Issue">🛑 Fake / Quality Issue</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Describe the Issue
                  </label>
                  <textarea
                    required
                    value={disputeNotes}
                    onChange={e => setDisputeNotes(e.target.value)}
                    rows={3}
                    placeholder="Provide details about what went wrong with your order..."
                    className="input-field"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: '12px', fontSize: '0.74rem', color: '#991b1b', fontWeight: 600 }}>
                  🔒 Submitting this dispute immediately locks the seller payout in Escrow Vault to protect your money.
                </div>

                <button
                  type="submit"
                  disabled={submittingDispute}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '100px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.92rem',
                    fontWeight: 900,
                    cursor: submittingDispute ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  {submittingDispute ? 'Freezing Escrow & Submitting...' : 'Submit Dispute & Freeze Payout'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
