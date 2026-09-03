'use client';

import { useState } from 'react';
import { Package, Truck, CheckCircle2, X, Send, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderDispatchModal3DProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  buyerName: string;
  itemTitle: string;
  onConfirmDispatch: (orderId: string, trackingNumber: string) => Promise<boolean>;
}

export default function OrderDispatchModal3D({
  isOpen,
  onClose,
  orderId,
  buyerName,
  itemTitle,
  onConfirmDispatch
}: OrderDispatchModal3DProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('Delhivery / DTDC');
  const [isDispatching, setIsDispatching] = useState(false);
  const [boxState, setBoxState] = useState<'OPEN' | 'SEALING' | 'SHIPPED'>('OPEN');

  if (!isOpen) return null;

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);
    setBoxState('SEALING');

    setTimeout(async () => {
      const fullTracking = trackingNumber.trim() ? `${courierName}: ${trackingNumber.trim()}` : 'Dispatched via Standard Courier';
      const success = await onConfirmDispatch(orderId, fullTracking);

      if (success) {
        setBoxState('SHIPPED');
        setTimeout(() => {
          setIsDispatching(false);
          onClose();
        }, 1800);
      } else {
        setIsDispatching(false);
        setBoxState('OPEN');
        alert('Failed to update order status');
      }
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#0a0d14',
        borderRadius: '28px',
        border: '1.5px solid rgba(200, 241, 53, 0.3)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.8), 0 0 40px rgba(200, 241, 53, 0.15)',
        color: '#ffffff',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        animation: 'modalFadeIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'rgba(200,241,53,0.15)', border: '1px solid #c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c8f135' }}>
              <Package size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>3D Order Dispatch</h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Package Seal & Courier Dispatch Flow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 3D Package Stage */}
        <div style={{
          height: '180px',
          backgroundColor: '#030712',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          perspective: '800px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Cyber Stage Floor Grid */}
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            width: '280px',
            height: '100px',
            backgroundImage: 'radial-gradient(rgba(200, 241, 53, 0.25) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
            transform: 'rotateX(60deg)',
            opacity: 0.6
          }} />

          {/* 3D Parcel Box */}
          <div style={{
            position: 'relative',
            width: '90px',
            height: '80px',
            background: 'linear-gradient(145deg, #d97706 0%, #b45309 60%, #78350f 100%)',
            borderRadius: '12px',
            border: '2px solid #fef08a',
            boxShadow: '0 15px 35px rgba(0,0,0,0.8), 0 0 20px rgba(234, 179, 8, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: boxState === 'SEALING' 
              ? 'rotateY(360deg) scale(0.95)' 
              : boxState === 'SHIPPED'
              ? 'translateY(-10px) scale(1.05)'
              : 'rotateY(-15deg) rotateX(10deg)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Box Tape / Label */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '14px',
              backgroundColor: '#c8f135',
              boxShadow: '0 0 8px rgba(200,241,53,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.55rem',
              fontWeight: 900,
              color: '#0a0a0a'
            }}>
              {boxState === 'SHIPPED' ? 'SEALED & SHIPPED' : 'PROFITUPX'}
            </div>

            <Package size={32} color="#ffffff" style={{ opacity: 0.4 }} />
          </div>

          {/* Stage Status Text */}
          <div style={{
            marginTop: '12px',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: boxState === 'SHIPPED' ? '#10b981' : '#c8f135'
          }}>
            {boxState === 'OPEN' && `Ready to Pack: ${itemTitle}`}
            {boxState === 'SEALING' && 'Sealing Package & Attaching Label...'}
            {boxState === 'SHIPPED' && '🚚 Order Dispatched Successfully!'}
          </div>
        </div>

        {/* Dispatch Form */}
        {boxState !== 'SHIPPED' && (
          <form onSubmit={handleDispatch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Courier Service Name
              </label>
              <input
                type="text"
                value={courierName}
                onChange={e => setCourierName(e.target.value)}
                placeholder="e.g. Delhivery, DTDC, IndiaPost"
                className="input-field"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Tracking / AWB Number (Optional)
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                placeholder="e.g. DEL7492019482"
                className="input-field"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={isDispatching}
              className="btn-lime"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '100px',
                fontSize: '0.92rem',
                fontWeight: 900,
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px'
              }}
            >
              <Truck size={18} />
              <span>{isDispatching ? 'Packing & Dispatching...' : 'Confirm 3D Dispatch & Ship'}</span>
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
