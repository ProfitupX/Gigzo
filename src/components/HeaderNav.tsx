'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HeaderNav({ activePage }: { activePage?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      <nav
        className="glass-nav"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          height: '72px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #eaeaea',
          transition: 'box-shadow 0.3s',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/icon.png" alt="ProfitupX" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 900, fontSize: '1.45rem', letterSpacing: '-1px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0a0a0a', lineHeight: 1 }}>ProfitupX</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav-links">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontWeight: activePage === l.label ? 900 : 700,
              fontSize: '0.9rem',
              color: activePage === l.label ? '#0a0a0a' : '#4b5563',
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
              textDecoration: 'none'
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#0a0a0a', cursor: 'pointer' }} className="desktop-nav-links">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            EN
          </div>
          <Link href="/auth/login" style={{ 
            background: '#0a0a0a', color: '#fff', padding: '10px 24px', 
            borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem',
            textDecoration: 'none', transition: 'transform 0.2s',
          }}>
            Get Started
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '8px', borderRadius: '10px', color: '#0a0a0a' }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setMobileOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'fixed', top: 84, left: 20, right: 20, zIndex: 999,
              background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.4)', borderRadius: '32px',
              padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px',
              boxShadow: '0 32px 64px rgba(0,0,0,0.15)',
            }}>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{
                fontWeight: 700, fontSize: '1.1rem', padding: '14px 16px',
                borderRadius: '16px', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#f8fafc', textDecoration: 'none'
              }}>
                {l.label}
                <IconArrow />
              </Link>
            ))}
            <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
            <Link href="/auth/login" style={{ marginTop: '4px', width: '100%', display: 'flex', justifyContent: 'center', padding: '14px', borderRadius: '100px', fontSize: '1rem', background: '#0a0a0a', color: '#fff', textDecoration: 'none', fontWeight: 800 }} onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </motion.div>
        </>
      )}
    </header>
  );
}
