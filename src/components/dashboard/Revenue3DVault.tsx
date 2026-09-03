'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Zap, 
  ArrowRight, 
  IndianRupee, 
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface Revenue3DVaultProps {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
}

export default function Revenue3DVault({
  totalRevenue,
  totalOrders,
  pendingOrders,
  paidOrders
}: Revenue3DVaultProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const netEarnings = Math.round(totalRevenue * 0.95);
  const platformFee = totalRevenue - netEarnings;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: '#070d19',
        borderRadius: '28px',
        border: '1.5px solid rgba(56, 189, 248, 0.3)',
        padding: '28px',
        color: '#ffffff',
        overflow: 'hidden',
        boxShadow: isHovered 
          ? '0 24px 70px rgba(0,0,0,0.6), 0 0 40px rgba(56, 189, 248, 0.25)' 
          : '0 12px 40px rgba(0,0,0,0.4)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}
    >
      {/* Background Cyber Glow & Grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '10%',
        width: '350px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%)',
        pointerEvents: 'none'
      }} />

      {/* Left Info Column */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38bdf8',
            color: '#38bdf8',
            fontSize: '0.74rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} /> 48-HOUR ESCROW VAULT SECURED
          </span>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
            95% Net Payout Guarantee
          </span>
        </div>

        <div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total Net Seller Revenue (95%)
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span>₹{netEarnings.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 800 }}>
              (Gross: ₹{totalRevenue.toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        {/* Mini 3-Pill Ledger Info */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>PAID ORDERS</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981' }}>{paidOrders} Orders</div>
          </div>

          <div style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>48H COOLING (HOLD)</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#eab308' }}>{pendingOrders} In Vault</div>
          </div>

          <div style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>PLATFORM FEE (5%)</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#818cf8' }}>₹{platformFee.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Right 3D Metallic Mini Safe / Crystal Model */}
      <div style={{
        position: 'relative',
        width: '160px',
        height: '150px',
        perspective: '1000px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {/* Isometric 3D Floor Grid */}
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          width: '140px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
          transform: 'rotateX(60deg)'
        }} />

        {/* 3D Metallic Safe Body */}
        <div style={{
          position: 'relative',
          width: '110px',
          height: '110px',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #1e3a8a 0%, #0f244a 60%, #081329 100%)',
          border: '3px solid #38bdf8',
          boxShadow: '0 15px 35px rgba(0,0,0,0.8), inset 0 0 15px rgba(56, 189, 248, 0.5), 0 0 25px rgba(56, 189, 248, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isHovered ? 'rotateY(-15deg) rotateX(8deg) scale(1.05)' : 'rotateY(0deg)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* 6-Spoke Wheel Visual */}
          <div style={{
            position: 'relative',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #e0f2fe 0%, #38bdf8 50%, #0f244a 100%)',
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)'
          }}>
            <Lock size={16} color="#0369a1" />
          </div>

          <div style={{
            fontSize: '0.6rem',
            fontWeight: 900,
            color: '#93c5fd',
            letterSpacing: '0.08em',
            marginTop: '6px'
          }}>
            VAULT 95%
          </div>
        </div>

        {/* Floating ₹ Coin Shimmer */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffffff 0%, #38bdf8 60%, #0284c7 100%)',
          border: '2px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0369a1',
          fontWeight: 900,
          fontSize: '0.85rem',
          boxShadow: '0 0 15px rgba(255,255,255,0.8)',
          animation: 'floatingCoin 2.5s ease-in-out infinite'
        }}>
          ₹
        </div>
      </div>

      <style>{`
        @keyframes floatingCoin {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(8deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
