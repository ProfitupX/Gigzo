'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  RefreshCw,
  Building2,
  Cpu,
  Layers,
  Sparkles,
  IndianRupee
} from 'lucide-react';
import { calculateSplitSettlement, generateBlockHash, SplitSettlement } from '@/lib/escrowLedger';

interface EscrowVaultLockerProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  sellerUpi: string | null;
  amount: number;
  onConfirmPayout?: (amount: number, utr: string) => Promise<boolean>;
}

// Synthesizer Web Audio Sound Effects for immersive mechanical vault feel
function playVaultSound(type: 'click' | 'unlock' | 'cash' | 'beep' | 'bolt') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } else if (type === 'bolt') {
      // Heavy mechanical piston slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'unlock') {
      // Hydraulic heavy whoosh & massive vault unseal
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } else if (type === 'cash') {
      // Crisp holographic chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch (e) {
    // Ignore audio restrictions
  }
}

export default function EscrowVaultLocker({
  isOpen,
  onClose,
  sellerId,
  sellerName,
  sellerUpi,
  amount,
  onConfirmPayout
}: EscrowVaultLockerProps) {
  const [vaultState, setVaultState] = useState<'SEALED_HOLD' | 'SCANNING_AUTHENTICATION' | 'UNSEALED_DISPERSED'>('SEALED_HOLD');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [doorAngle, setDoorAngle] = useState(0);
  const [boltsRetracted, setBoltsRetracted] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [customUtr, setCustomUtr] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [split, setSplit] = useState<SplitSettlement>(calculateSplitSettlement(amount, 'ORDER_REF', sellerId));

  useEffect(() => {
    if (isOpen) {
      setVaultState('SEALED_HOLD');
      setWheelRotation(0);
      setDoorAngle(0);
      setBoltsRetracted(false);
      setCustomUtr(`UTR${Date.now().toString().slice(-8)}`);
      setSplit(calculateSplitSettlement(amount, `ORD_${Date.now()}`, sellerId));
    }
  }, [isOpen, amount, sellerId]);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(split.blockHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleUnlockAndDisperse = async () => {
    if (vaultState !== 'SEALED_HOLD' || isProcessing) return;

    setIsProcessing(true);
    setVaultState('SCANNING_AUTHENTICATION');
    playVaultSound('beep');

    // 1. Spin 6-Spoke Wheel (Ratchet clicks)
    let angle = 0;
    const interval = setInterval(() => {
      angle += 60;
      setWheelRotation(angle);
      playVaultSound('click');
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setWheelRotation(720);

      // 2. Retract 4 Hydraulic Locking Bolts
      playVaultSound('bolt');
      setBoltsRetracted(true);

      // 3. Heavy 3D Vault Door Swings Open
      setTimeout(async () => {
        playVaultSound('unlock');
        setDoorAngle(-82); // 3D Perspective Swing Open!

        if (onConfirmPayout) {
          await onConfirmPayout(split.sellerShare, customUtr);
        }

        setTimeout(() => {
          playVaultSound('cash');
          setVaultState('UNSEALED_DISPERSED');
          setIsProcessing(false);
        }, 600);
      }, 400);

    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(3, 7, 18, 0.92)',
      backdropFilter: 'blur(18px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '580px',
        backgroundColor: '#070d19',
        borderRadius: '32px',
        border: '1.5px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 30px 100px rgba(0, 0, 0, 0.9), 0 0 50px rgba(56, 189, 248, 0.15)',
        overflow: 'hidden',
        color: '#ffffff',
        position: 'relative',
        animation: 'vaultModalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>

        {/* Ambient Top Glow Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '6px',
          background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)',
          boxShadow: '0 0 25px #38bdf8'
        }} />

        {/* Header Strip */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 100%)',
              border: '1px solid #38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>CENTRAL ESCROW 3D VAULT</span>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#38bdf8', color: '#030712', padding: '2px 8px', borderRadius: '100px', fontWeight: 900 }}>
                  3D HARDWARE MODEL
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                DIGITAL FINANCE • ZERO TRUST ESCROW
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 3D Model Viewport */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* 3D HARDWARE VAULT STAGE */}
          <div style={{
            position: 'relative',
            height: '300px',
            backgroundColor: '#030712',
            borderRadius: '26px',
            border: '1.5px solid rgba(56, 189, 248, 0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1400px',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.95)'
          }}>

            {/* Background Perspective Grid Floor (Pedestal) */}
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '50%',
              transform: 'translateX(-50%) rotateX(65deg)',
              width: '440px',
              height: '240px',
              backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.25) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.6,
              borderRadius: '24px'
            }} />

            {/* Ambient Blue Volumetric Light Cone */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 45%, rgba(56, 189, 248, 0.22) 0%, rgba(3, 7, 18, 0.85) 75%)',
              pointerEvents: 'none'
            }} />

            {/* 3D METALLIC SAFE CHASSIS (Outer Body) */}
            <div style={{
              position: 'relative',
              width: '240px',
              height: '220px',
              borderRadius: '34px',
              background: 'linear-gradient(145deg, #1e3a8a 0%, #0f244a 40%, #081329 100%)',
              border: '4px solid #38bdf8',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 25px rgba(56, 189, 248, 0.45), 0 0 35px rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
              zIndex: 5
            }}>

              {/* 4 Solid Support Feet under the Safe */}
              <div style={{ position: 'absolute', bottom: '-10px', left: '16px', width: '28px', height: '10px', backgroundColor: '#0f244a', borderRadius: '4px', border: '1px solid #38bdf8', boxShadow: '0 4px 10px rgba(0,0,0,0.8)' }} />
              <div style={{ position: 'absolute', bottom: '-10px', right: '16px', width: '28px', height: '10px', backgroundColor: '#0f244a', borderRadius: '4px', border: '1px solid #38bdf8', boxShadow: '0 4px 10px rgba(0,0,0,0.8)' }} />

              {/* INNER CHAMBER (Revealed when door opens) */}
              <div style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '24px',
                background: 'radial-gradient(circle at center, #0284c7 0%, #082f49 50%, #030712 100%)',
                border: '2px solid rgba(56, 189, 248, 0.3)',
                boxShadow: 'inset 0 0 35px rgba(0,0,0,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* 3D Stack of Glowing Metallic Coins ($ / ₹ / Crypto) */}
                <div style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: 'drop-shadow(0 10px 20px rgba(56, 189, 248, 0.5))'
                }}>
                  {/* Coin 1 (Bottom Stack) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '20px',
                    width: '64px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 60%, #0369a1 100%)',
                    border: '2px solid #e0f2fe',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.6)'
                  }} />
                  {/* Coin 2 (Middle Stack) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '22px',
                    left: '20px',
                    width: '64px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(180deg, #7dd3fc 0%, #0284c7 60%, #0369a1 100%)',
                    border: '2px solid #ffffff'
                  }} />
                  {/* Coin 3 (Top Upright Coin with Rupee & Dollar Symbol) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '24px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffffff 0%, #7dd3fc 50%, #0284c7 100%)',
                    border: '3px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0369a1',
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    boxShadow: '0 0 25px rgba(255,255,255,0.8), inset 0 0 10px rgba(2,132,199,0.5)',
                    animation: vaultState === 'UNSEALED_DISPERSED' ? 'coinFloat 2s ease-in-out infinite' : 'none'
                  }}>
                    ₹
                  </div>

                  {/* Vault Amount Label */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    backgroundColor: 'rgba(3, 7, 18, 0.85)',
                    border: '1px solid #38bdf8',
                    padding: '2px 10px',
                    borderRadius: '100px',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: '#38bdf8',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)'
                  }}>
                    ₹{split.sellerShare.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* 3D HEAVY VAULT DOOR (Swings open on left hinge) */}
              <div style={{
                position: 'absolute',
                inset: '6px',
                borderRadius: '26px',
                background: 'linear-gradient(145deg, #1e3a8a 0%, #0f244a 50%, #0a1733 100%)',
                border: '3px solid #60a5fa',
                boxShadow: 'inset 0 0 20px rgba(56, 189, 248, 0.5), 10px 0 25px rgba(0,0,0,0.8)',
                transformOrigin: 'left center',
                transform: `rotateY(${doorAngle}deg)`,
                transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backfaceVisibility: 'hidden',
                zIndex: 10
              }}>

                {/* Left Heavy Industrial Hinges */}
                <div style={{ position: 'absolute', top: '24px', left: '-6px', width: '10px', height: '32px', backgroundColor: '#38bdf8', borderRadius: '4px', border: '1px solid #ffffff', boxShadow: '0 0 8px #38bdf8' }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '-6px', width: '10px', height: '32px', backgroundColor: '#38bdf8', borderRadius: '4px', border: '1px solid #ffffff', boxShadow: '0 0 8px #38bdf8' }} />

                {/* Right Side 4 Heavy Hydraulic Locking Bolts */}
                <div style={{ position: 'absolute', top: '30px', right: boltsRetracted ? '0px' : '-8px', width: '10px', height: '14px', backgroundColor: '#38bdf8', borderRadius: '3px', border: '1px solid #ffffff', transition: 'all 0.3s ease', boxShadow: '0 0 8px #38bdf8' }} />
                <div style={{ position: 'absolute', top: '70px', right: boltsRetracted ? '0px' : '-8px', width: '10px', height: '14px', backgroundColor: '#38bdf8', borderRadius: '3px', border: '1px solid #ffffff', transition: 'all 0.3s ease', boxShadow: '0 0 8px #38bdf8' }} />
                <div style={{ position: 'absolute', bottom: '70px', right: boltsRetracted ? '0px' : '-8px', width: '10px', height: '14px', backgroundColor: '#38bdf8', borderRadius: '3px', border: '1px solid #ffffff', transition: 'all 0.3s ease', boxShadow: '0 0 8px #38bdf8' }} />
                <div style={{ position: 'absolute', bottom: '30px', right: boltsRetracted ? '0px' : '-8px', width: '10px', height: '14px', backgroundColor: '#38bdf8', borderRadius: '3px', border: '1px solid #ffffff', transition: 'all 0.3s ease', boxShadow: '0 0 8px #38bdf8' }} />

                {/* 6-SPOKE METALLIC 3D TURN WHEEL */}
                <div style={{
                  position: 'relative',
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: 'transform 0.4s ease-out'
                }}>

                  {/* 6 Radiating Cylindrical Blue Spokes */}
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <div
                      key={deg}
                      style={{
                        position: 'absolute',
                        width: '8px',
                        height: '92px',
                        transform: `rotate(${deg}deg)`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {/* Top Spoke Cap */}
                      <div style={{
                        width: '12px',
                        height: '18px',
                        borderRadius: '6px',
                        background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                        border: '1.5px solid #ffffff',
                        boxShadow: '0 0 10px #38bdf8'
                      }} />
                      {/* Bottom Spoke Cap */}
                      <div style={{
                        width: '12px',
                        height: '18px',
                        borderRadius: '6px',
                        background: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 100%)',
                        border: '1.5px solid #ffffff',
                        boxShadow: '0 0 10px #38bdf8'
                      }} />
                    </div>
                  ))}

                  {/* Central Heavy Chrome Hub Cap */}
                  <div style={{
                    position: 'relative',
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #e0f2fe 0%, #38bdf8 50%, #0f244a 100%)',
                    border: '3px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.8), inset 0 0 10px rgba(0,0,0,0.5)',
                    zIndex: 4
                  }}>
                    <Lock size={20} color="#0369a1" />
                  </div>

                </div>

                {/* Vault Door Brand Plate */}
                <div style={{
                  marginTop: '10px',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#93c5fd',
                  textTransform: 'uppercase',
                  borderTop: '1px solid rgba(147, 197, 253, 0.3)',
                  paddingTop: '4px'
                }}>
                  PROFITUPX • ESCROW LOCKER
                </div>

              </div>

            </div>

            {/* Chamber Floating Status Badge */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              backgroundColor: 'rgba(3, 7, 18, 0.88)',
              padding: '5px 16px',
              borderRadius: '100px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.74rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 20
            }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: vaultState === 'UNSEALED_DISPERSED' ? '#10b981' : '#38bdf8',
                boxShadow: `0 0 10px ${vaultState === 'UNSEALED_DISPERSED' ? '#10b981' : '#38bdf8'}`
              }} />
              <span>
                {vaultState === 'SEALED_HOLD' && 'ESCROW LOCKED: 3D Safe Sealed with 4-Bolt Mechanism'}
                {vaultState === 'SCANNING_AUTHENTICATION' && 'UNSEALING: Rotating Wheel & Retracting Bolts...'}
                {vaultState === 'UNSEALED_DISPERSED' && 'ESCROW RELEASED: 95% Dispersed to Seller UPI'}
              </span>
            </div>

          </div>

          {/* 48-Hour ProfitupX Buyer Protection Cooling Widget */}
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'rgba(234, 179, 8, 0.08)',
            borderRadius: '18px',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#eab308" />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase' }}>
                  48-Hour ProfitupX Buyer Protection Window
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', backgroundColor: '#eab308', color: '#0a0a0a', padding: '2px 8px', borderRadius: '100px', fontWeight: 900 }}>
                DISPUTE SAFE
              </span>
            </div>

            {/* Progress Cooling Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>Cooling Status: <strong>Funds Maturing from Escrow</strong></span>
                <span style={{ color: '#eab308', fontWeight: 800 }}>0 Disputes Reported</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: '#eab308', borderRadius: '10px', boxShadow: '0 0 10px #eab308' }} />
              </div>
            </div>
          </div>

          {/* Automated Split Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* 95% Seller Payout Card */}
            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '18px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Seller Net (95%)
                </span>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                  ESCROW
                </span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                ₹{split.sellerShare.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Destination: <strong>{sellerUpi || 'Pending UPI'}</strong>
              </div>
            </div>

            {/* 5% Platform Fee Card */}
            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '18px',
              border: '1px solid rgba(129, 140, 248, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Platform Fee (5%)
                </span>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(129,140,248,0.15)', color: '#818cf8', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                  TREASURY
                </span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                ₹{split.platformShare.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Master: <strong>8015078755@ptsbi</strong>
              </div>
            </div>
          </div>

          {/* Cryptographic Proof Hash Bar */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Immutable Block Proof Hash
              </div>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {split.blockHash}
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleCopyHash}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: copiedHash ? '#10b981' : '#cbd5e1',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copiedHash ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedHash ? 'Copied' : 'Proof'}</span>
            </button>
          </div>

          {/* Action Button */}
          {vaultState === 'SEALED_HOLD' && (
            <button
              type="button"
              onClick={handleUnlockAndDisperse}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                color: '#030712',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 30px rgba(56, 189, 248, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={18} />
              <span>Unlock 3D Vault & Disperse Payout (₹{split.sellerShare.toLocaleString('en-IN')})</span>
            </button>
          )}

          {vaultState === 'UNSEALED_DISPERSED' && (
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '100px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)'
              }}
            >
              <CheckCircle2 size={18} />
              <span>Settlement Complete — Close Vault</span>
            </button>
          )}

        </div>

        {/* Security Ledger Status Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          color: '#64748b',
          backgroundColor: 'rgba(255, 255, 255, 0.01)'
        }}>
          <ShieldCheck size={14} color="#38bdf8" />
          <span>Central Bank Escrow Protocol & Fraud Mitigation Verified</span>
        </div>

      </div>

      <style>{`
        @keyframes vaultModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(15px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes coinFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
