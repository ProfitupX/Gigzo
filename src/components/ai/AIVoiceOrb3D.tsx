'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Mic, Volume2, Cpu } from 'lucide-react';

interface AIVoiceOrb3DProps {
  state: 'idle' | 'listening' | 'speaking' | 'thinking';
  size?: number;
  compact?: boolean;
  onMicClick?: () => void;
}

export default function AIVoiceOrb3D({
  state = 'idle',
  size = 46,
  compact = true,
  onMicClick
}: AIVoiceOrb3DProps) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (state === 'speaking' || state === 'listening' || state === 'thinking') {
      const interval = setInterval(() => {
        setPulse(p => (p + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state]);

  const getOrbTheme = () => {
    switch (state) {
      case 'listening':
        return {
          primary: '#10b981',
          secondary: '#34d399',
          glow: 'rgba(16, 185, 129, 0.5)',
          label: 'Listening...',
          icon: Mic
        };
      case 'speaking':
        return {
          primary: '#38bdf8',
          secondary: '#818cf8',
          glow: 'rgba(56, 189, 248, 0.6)',
          label: 'Speaking...',
          icon: Volume2
        };
      case 'thinking':
        return {
          primary: '#c8f135',
          secondary: '#eab308',
          glow: 'rgba(200, 241, 53, 0.5)',
          label: 'Thinking...',
          icon: Cpu
        };
      default:
        return {
          primary: '#38bdf8',
          secondary: '#4f46e5',
          glow: 'rgba(56, 189, 248, 0.35)',
          label: 'AI Ready',
          icon: Sparkles
        };
    }
  };

  const theme = getOrbTheme();
  const IconComponent = theme.icon;

  if (compact) {
    return (
      <div 
        onClick={onMicClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 14px 6px 8px',
          backgroundColor: '#0a0d14',
          borderRadius: '100px',
          border: `1.5px solid ${theme.primary}`,
          boxShadow: `0 4px 18px ${theme.glow}`,
          cursor: onMicClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
      >
        {/* Mini 3D Gyroscope Stage */}
        <div style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          perspective: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {/* Gyro Ring 1 */}
          <div style={{
            position: 'absolute',
            width: `${size * 0.95}px`,
            height: `${size * 0.95}px`,
            borderRadius: '50%',
            border: `1.5px dashed ${theme.primary}`,
            transform: 'rotateX(65deg)',
            animation: 'gyroRotate1 6s linear infinite',
            boxShadow: `0 0 10px ${theme.glow}`
          }} />

          {/* Gyro Ring 2 */}
          <div style={{
            position: 'absolute',
            width: `${size * 0.85}px`,
            height: `${size * 0.85}px`,
            borderRadius: '50%',
            border: `1.5px solid ${theme.secondary}`,
            transform: 'rotateY(65deg)',
            animation: 'gyroRotate2 4s linear infinite reverse',
            boxShadow: `0 0 10px ${theme.glow}`
          }} />

          {/* Core Sphere */}
          <div style={{
            position: 'relative',
            width: `${size * 0.55}px`,
            height: `${size * 0.55}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${theme.primary} 45%, #030712 90%)`,
            border: '1.5px solid #ffffff',
            boxShadow: `0 0 15px ${theme.glow}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3
          }}>
            <IconComponent size={size * 0.26} color="#030712" />
          </div>
        </div>

        {/* Status Text Label */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {theme.label}
          </span>
          <span style={{ fontSize: '0.65rem', color: theme.primary, fontWeight: 700, textTransform: 'uppercase' }}>
            3D Cyber Core
          </span>
        </div>
      </div>
    );
  }

  // Regular Standalone Mode
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      position: 'relative'
    }}>
      <div 
        onClick={onMicClick}
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          perspective: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onMicClick ? 'pointer' : 'default'
        }}
      >
        <div style={{
          position: 'absolute',
          width: `${size * 0.95}px`,
          height: `${size * 0.95}px`,
          borderRadius: '50%',
          border: `2px dashed ${theme.primary}`,
          transform: 'rotateX(65deg)',
          animation: 'gyroRotate1 8s linear infinite',
          boxShadow: `0 0 15px ${theme.glow}`
        }} />

        <div style={{
          position: 'absolute',
          width: `${size * 0.85}px`,
          height: `${size * 0.85}px`,
          borderRadius: '50%',
          border: `2px solid ${theme.secondary}`,
          transform: 'rotateY(65deg)',
          animation: 'gyroRotate2 6s linear infinite reverse',
          boxShadow: `0 0 15px ${theme.glow}`
        }} />

        <div style={{
          position: 'relative',
          width: `${size * 0.55}px`,
          height: `${size * 0.55}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${theme.primary} 45%, #030712 90%)`,
          border: '2px solid rgba(255, 255, 255, 0.8)',
          boxShadow: `0 0 30px ${theme.glow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}>
          <IconComponent size={size * 0.24} color="#030712" />
        </div>
      </div>

      <div style={{
        padding: '5px 14px',
        borderRadius: '100px',
        backgroundColor: '#0a0d14',
        border: `1.5px solid ${theme.primary}`,
        color: '#ffffff',
        fontSize: '0.74rem',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: theme.primary }} />
        <span>{theme.label}</span>
      </div>

      <style>{`
        @keyframes gyroRotate1 {
          from { transform: rotateX(65deg) rotateZ(0deg); }
          to { transform: rotateX(65deg) rotateZ(360deg); }
        }
        @keyframes gyroRotate2 {
          from { transform: rotateY(65deg) rotateZ(0deg); }
          to { transform: rotateY(65deg) rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
}
