'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Wrong password bro! Try again.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(200,241,53,0.08) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,241,53,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Login Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '28px',
        padding: '48px 40px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #c8f135 0%, #a3d911 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(200,241,53,0.3)',
          }}>
            <img src="/icon.png" alt="ProfitupX" style={{ width: 44, height: 44, borderRadius: 10 }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 6px' }}>
            Admin Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', fontWeight: 500, margin: 0 }}>
            ProfitupX — Super Admin Access
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0 32px' }} />

        <form onSubmit={handleLogin}>
          {/* Password field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                required
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 18px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '14px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = '#c8f135'; }}
                onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {error && (
              <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '8px', fontWeight: 600 }}>
                ❌ {error}
              </p>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? 'rgba(200,241,53,0.4)' : 'linear-gradient(135deg, #c8f135 0%, #a3d911 100%)',
              border: 'none',
              borderRadius: '14px',
              color: '#0a0a0a',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(200,241,53,0.3)',
            }}
          >
            {loading ? '🔐 Verifying...' : '🚀 Enter Admin Panel'}
          </button>
        </form>

        {/* Footer note */}
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textAlign: 'center', marginTop: '24px', lineHeight: 1.5 }}>
          🔒 Restricted access. Only ProfitupX super admins allowed.
        </p>
      </div>
    </div>
  );
}
