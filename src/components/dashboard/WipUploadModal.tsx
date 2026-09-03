'use client';

import { useState } from 'react';
import { Camera, UploadCloud, CheckCircle2, X, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface WipUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  itemTitle: string;
  totalAmount: number;
  onWipSubmitted: () => void;
}

export default function WipUploadModal({
  isOpen,
  onClose,
  orderId,
  itemTitle,
  totalAmount,
  onWipSubmitted
}: WipUploadModalProps) {
  const [wipImageUrl, setWipImageUrl] = useState('');
  const [wipNotes, setWipNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wipImageUrl.trim()) {
      alert('Please provide a WIP photo image URL.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders/milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_wip',
          order_id: orderId,
          wip_image_url: wipImageUrl.trim(),
          wip_notes: wipNotes.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit WIP proof');

      alert('WIP proof submitted successfully! Buyer has been notified to review and release Phase 2 (40%).');
      onWipSubmitted();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to submit WIP');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#0a0d14',
        borderRadius: '24px',
        border: '1.5px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
        color: '#ffffff',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Upload WIP Proof (Phase 2)</h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Custom Order • Request 40% Tranche
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div style={{
          padding: '12px 14px',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          borderRadius: '14px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          fontSize: '0.76rem',
          color: '#cbd5e1',
          lineHeight: 1.4
        }}>
          You received <strong>Phase 1 (30% Raw Material Advance)</strong>. Upload a photo of the product in progress. Once the buyer reviews and approves, <strong>Phase 2 (40%)</strong> will be unlocked immediately.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              Work-In-Progress (WIP) Photo URL
            </label>
            <input
              required
              type="url"
              value={wipImageUrl}
              onChange={e => setWipImageUrl(e.target.value)}
              placeholder="https://i.ibb.co/... or image link"
              className="input-field"
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {wipImageUrl && (
            <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#030712' }}>
              <img src={wipImageUrl} alt="WIP Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e: any) => e.target.style.display = 'none'} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              Progress Notes for Buyer (Optional)
            </label>
            <textarea
              value={wipNotes}
              onChange={e => setWipNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Raw materials assembled, customized carving completed, polishing starting next..."
              className="input-field"
              style={{ fontSize: '0.82rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '100px',
              backgroundColor: '#38bdf8',
              color: '#030712',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 900,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
              marginTop: '4px'
            }}
          >
            <UploadCloud size={18} />
            <span>{submitting ? 'Submitting WIP...' : 'Submit WIP Proof & Request Phase 2 (40%)'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
