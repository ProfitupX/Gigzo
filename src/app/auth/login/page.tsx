'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import Link from 'next/link';

/* ── tiny inline SVG icons ── */
function IconGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#c8f135" fillOpacity="0.2" />
      <path d="M4.5 8.5L6.5 10.5L11.5 5.5" stroke="#3a6600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#fbbf24">
      <path d="M7 1l1.57 3.18L12 4.64l-2.5 2.44.59 3.44L7 8.82l-3.09 1.7.59-3.44L2 4.64l3.43-.46L7 1z"/>
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 8h10M9 4l4 4-4 4"/>
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconRupee() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12M6 8h12M9 21l6-13M6 8c0 3.31 2.69 6 6 6"/>
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}

function IconTrending() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}

/* ── Animated counter ── */
function StatNumber({ value, suffix = '' }: { value: string; suffix?: string }) {
  return (
    <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
      {value}<span style={{ fontSize: '1.2rem' }}>{suffix}</span>
    </div>
  );
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ── Ambient orbs ── */}
      <div style={{
        position: 'fixed', top: '-10vh', right: '-5vw',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,241,53,0.22) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-5vh', left: '-8vw',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,94,167,0.18) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ══════════════════════════════════
          LEFT PANEL — Bento grid
      ════════════════════════════════════ */}
      <div style={{
        flex: '0 0 55%',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
      }} className="auth-left-panel">
        {/* Logo */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '36px' }}>
          <img src="/icon.png" alt="ProfitupX" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 900, fontSize: '1.45rem', letterSpacing: '-1px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0a0a0a', lineHeight: 1 }}>ProfitupX</span>
          </div>
        </Link>

        {/* Bento Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto auto', gap: '16px' }}>

          {/* Hero card — spans 2 cols */}
          <div style={{
            gridColumn: '1 / -1',
            background: '#0a0a0a',
            borderRadius: '24px',
            padding: '36px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Lime glow */}
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,241,53,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '16px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c8f135' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>India's Creator Commerce Platform</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px', position: 'relative', zIndex: 1 }}>
              Turn your Instagram<br />audience into{' '}
              <span style={{
                background: 'linear-gradient(135deg, #c8f135, #a8cc1a)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>real income.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.65, maxWidth: '420px', position: 'relative', zIndex: 1 }}>
              Launch your store in 2 minutes. Accept UPI payments. Zero tech skills needed.
            </p>

            {/* Progress bar */}
            <div style={{ marginTop: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600 }}>Creator Revenue This Month</span>
                <span style={{ color: '#c8f135', fontSize: '0.75rem', fontWeight: 700 }}>₹2.4Cr+</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 100 }}>
                <div style={{ height: '100%', width: '78%', background: 'linear-gradient(90deg, #c8f135, #a8cc1a)', borderRadius: 100, boxShadow: '0 0 12px rgba(200,241,53,0.4)' }} />
              </div>
            </div>
          </div>

          {/* Stat card — Creators */}
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '24px',
            border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', gap: '8px',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f0ffd4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a6600', marginBottom: '4px' }}>
              <IconUsers />
            </div>
            <StatNumber value="10K+" />
            <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Active Creators</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 100 }}>↑ +23% this month</span>
            </div>
          </div>

          {/* Stat card — Revenue */}
          <div style={{
            background: 'linear-gradient(135deg, #7b5ea7 0%, #5b21b6 100%)',
            borderRadius: '20px', padding: '24px',
            boxShadow: '0 8px 24px rgba(123,94,167,0.25)',
            display: 'flex', flexDirection: 'column', gap: '8px', color: '#fff',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(123,94,167,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(123,94,167,0.25)'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
              <IconRupee />
            </div>
            <StatNumber value="₹2Cr+" />
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Creator Earnings</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c8f135', background: 'rgba(200,241,53,0.15)', padding: '2px 8px', borderRadius: 100 }}>↑ Processed Safely</span>
            </div>
          </div>

          {/* Checkout time card */}
          <div style={{
            background: '#fff3e0',
            borderRadius: '20px', padding: '24px',
            border: '1px solid #fed7aa',
            display: 'flex', flexDirection: 'column', gap: '8px',
            transition: 'transform 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c', marginBottom: '4px' }}>
              <IconZap />
            </div>
            <StatNumber value="8" suffix="sec" />
            <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Avg. Checkout Time</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c2410c', marginTop: 'auto' }}>Fastest in India</div>
          </div>

          {/* Testimonial card */}
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '24px',
            border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', gap: '10px',
            transition: 'transform 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(i => <IconStar key={i} />)}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Made ₹47,000 in my first week. Setup was literally 90 seconds!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#be185d' }}>PS</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Priya Sharma</div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>@priya.creates · 85K followers</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT PANEL — Auth Form
      ════════════════════════════════════ */}
      <div style={{
        flex: '0 0 45%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 48px',
        position: 'relative',
        zIndex: 1,
      }} className="auth-right-panel">
        
        {/* Glass form card */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: '44px',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#f0ffd4', border: '1px solid rgba(168,204,26,0.3)',
              borderRadius: 100, padding: '5px 12px', marginBottom: '20px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8f135' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3a6600' }}>Free to start · No card needed</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', marginBottom: '8px', lineHeight: 1.1 }}>
              Start earning<br />today.
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>
              Join 250+ Indian creators already selling with ProfitupX.
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '16px 24px',
              background: loading ? '#f3f4f6' : '#fff',
              color: '#0a0a0a',
              border: '1.5px solid #e5e7eb',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.borderColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
          >
            {loading ? (
              <>
                <div style={{ width: 20, height: 20, border: '2px solid #e5e7eb', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Connecting...
              </>
            ) : (
              <>
                <IconGoogle />
                Continue with Google
              </>
            )}
          </button>

          {/* Get Started CTA */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px 24px',
              background: '#0a0a0a',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              fontFamily: 'inherit',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background = '#c8f135'; (e.currentTarget as HTMLElement).style.color = '#1a2a00'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(200,241,53,0.4)'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            Create Free Store <IconArrow />
          </button>

          {/* Feature list */}
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Store live in under 2 minutes',
              'UPI payments — GPay, PhonePe, Paytm',
              'Auto digital delivery included',
            ].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconCheck />
                <span style={{ fontSize: '0.83rem', color: '#374151', fontWeight: 600 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div style={{
            marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #f3f4f6',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <IconShield />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.5 }}>
              Secured by Google OAuth. By continuing you agree to our{' '}
              <a href="#" style={{ color: '#374151', fontWeight: 700, textDecoration: 'underline' }}>Terms</a>{' '}
              &amp;{' '}
              <a href="#" style={{ color: '#374151', fontWeight: 700, textDecoration: 'underline' }}>Privacy</a>.
            </p>
          </div>

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/" style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-left-panel, .auth-right-panel {
          animation: fadeIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .auth-right-panel { animation-delay: 0.1s; opacity: 0; }

        @media (max-width: 900px) {
          .auth-left-panel {
            display: none !important;
          }
          .auth-right-panel {
            flex: 1 !important;
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
