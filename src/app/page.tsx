'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Banknote, Zap, Smartphone, Target, HeartHandshake, Package, Rocket, 
  Sparkles, Heart, MessageCircle, Send, CheckCircle, TrendingUp, Play
} from 'lucide-react';

/* =====================================================================
   ICONS (inline SVG to avoid extra dependencies)
   ===================================================================== */
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="currentColor" fillOpacity="0.12" />
      <path d="M5 9.5L7.5 12L13 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
function IconStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#fbbf24">
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.3l4.2-.7L8 1z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconZap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconMobile() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}
function IconRupee() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12M6 8h12M9 21l6-13M6 8c0 3.31 2.69 6 6 6" />
    </svg>
  );
}
function IconTrendingUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
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
/* Stat icons */
function IconStore({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconCoin({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 8h6M9 12h6M9 16h4" />
      <path d="M15 8v8" />
    </svg>
  );
}
function IconCheckCircle({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IconRocket({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
/* Pain point icons */
function IconDollarOff({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M10.5 6H14a2 2 0 010 4h-1.5" />
      <path d="M8 10.5c0 2.21 1.79 4 4 4h.5" />
      <line x1="12" y1="3" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function IconDesktop({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function IconXCircle({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
function IconClock({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
/* Social proof platform icons */
function IconInstagramColor({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  );
}
function IconHeart({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
function IconComment({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function IconSend({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function IconVerified({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1d9bf0">
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1.01-2.52-1.27-3.91-.81-.67-1.31-1.91-2.19-3.34-2.19-1.43 0-2.67.88-3.34 2.19-1.39-.46-2.9-.2-3.91.81-1.01 1.01-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12c0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1.01 2.52 1.27 3.91.81.67 1.31 1.91 2.19 3.34 2.19 1.43 0 2.67-.88 3.34-2.19 1.39.46 2.9.2 3.91-.81 1.01-1.01 1.27-2.52.81-3.91 1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
    </svg>
  );
}

/* =====================================================================
   ANIMATED COUNTER
   ===================================================================== */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

/* =====================================================================
   FAQ ITEM
   ===================================================================== */
function FaqItem({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="faq-item" style={{ borderBottom: 'none', padding: '0 28px' }}>
      <button
        className="faq-question"
        style={{ width: '100%', background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', color: 'inherit', textAlign: 'left' }}
        onClick={() => setOpen(!open)}
        id={`faq-${question.slice(0, 20).replace(/\s/g, '-')}`}
      >
        <span style={{ fontSize: '1.05rem', fontWeight: 700, flex: 1 }}>{question}</span>
        <div className={`faq-icon${open ? ' open' : ''}`}>
          <svg viewBox="0 0 14 14">
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
        </div>
      </button>
      <div
        className="faq-answer"
        style={{
          maxHeight: open ? '320px' : '0',
          opacity: open ? 1 : 0,
        }}
      >
        <p style={{ paddingBottom: '24px', color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.97rem' }}>{answer}</p>
      </div>
    </div>
  );
}

/* =====================================================================
   MAIN PAGE
   ===================================================================== */
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Mobile App', href: '#mobile-app' },
  ];

  const painPoints = [
    {
      emoji: '😤',
      title: 'Shopify Costs Too Much',
      problem: '₹3,000/month just for a store you barely use?',
      solution: 'Gigzo is free to start. Pay only when you earn — just a small % per sale.',
      color: 'var(--pastel-pink)',
      accent: '#be185d',
    },
    {
      emoji: '📱',
      title: 'Desktop-Only Tools',
      problem: 'Existing platforms force you to sit at a laptop to manage your store.',
      solution: 'Gigzo is built mobile-first. Manage, upload, and track sales from your phone.',
      color: 'var(--pastel-purple)',
      accent: '#5b21b6',
    },
    {
      emoji: '🛒',
      title: 'Buyers Drop Off at Checkout',
      problem: 'Account creation, credit card forms, OTPs — buyers give up.',
      solution: 'Zero-registration checkout. One UPI tap to pay. Conversion rates soar.',
      color: 'var(--pastel-lime)',
      accent: '#3a6600',
    },
    {
      emoji: '⚡',
      title: 'Setup Takes Days',
      problem: 'Building a Shopify store needs developers, designers, and patience.',
      solution: 'Your Gigzo store is live in under 2 minutes. Seriously.',
      color: 'var(--pastel-orange)',
      accent: '#c2410c',
    },
  ];

  const features = [
    { icon: <IconLink />, title: 'Link-in-Bio Storefront', desc: 'One beautiful link that acts as your entire online store — perfect for Instagram bio.', color: '#e0f2fe', accent: '#0284c7' },
    { icon: <IconRupee />, title: 'UPI-First Payments', desc: 'Deep-link to GPay, PhonePe & Paytm. Buyers pay in 1 tap — no friction, no drops.', color: 'var(--pastel-lime)', accent: '#3a6600' },
    { icon: <IconMobile />, title: 'Mobile Dashboard', desc: 'Add products, track orders, and manage payouts all from your smartphone.', color: 'var(--pastel-purple)', accent: '#5b21b6' },
    { icon: <IconZap />, title: '2-Minute Go-Live', desc: 'Upload photo → Set price → Get link. Your store is live before your chai gets cold.', color: 'var(--pastel-orange)', accent: '#c2410c' },
    { icon: <IconTrendingUp />, title: 'Real-Time Analytics', desc: "See who's visiting, what's selling, and how much you've earned — live.", color: 'var(--pastel-pink)', accent: '#be185d' },
    { icon: <IconShield />, title: 'Auto Digital Delivery', desc: "Sold an ebook or preset? Gigzo auto-emails the file. You're asleep, money's flowing.", color: '#f0fdf4', accent: '#16a34a' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Sign Up in 1 Click',
      desc: 'Login with Google. No forms, no credit card, no waiting. Your account is ready instantly.',
      color: 'var(--accent-lime)',
      textColor: '#1a2a00',
      hint: 'Takes 30 seconds',
    },
    {
      num: '02',
      title: 'Build Your Store',
      desc: 'Set your brand name, upload avatar, add your UPI ID. Then upload a product — photo, title, price — done.',
      color: 'var(--primary)',
      textColor: '#ffffff',
      hint: 'Under 2 minutes',
    },
    {
      num: '03',
      title: 'Share & Start Earning',
      desc: 'Drop your Gigzo link in your Instagram bio. Your followers tap, pay via UPI, and receive their order automatically.',
      color: '#7b5ea7',
      textColor: '#ffffff',
      hint: 'Instant live link',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      handle: '@priya.creates',
      followers: '85K followers',
      avatar: '🎨',
      text: 'I sold ₹47,000 worth of Lightroom presets in the first week. Setting up took literally 90 seconds. This is insane.',
      stars: 5,
      badge: 'Digital Creator',
    },
    {
      name: 'Arjun Mehta',
      handle: '@arjun.fitness',
      followers: '210K followers',
      avatar: '💪',
      text: 'My followers were dropping off at Shopify checkout. Switched to Gigzo and my conversion rate jumped 3x overnight.',
      stars: 5,
      badge: 'Fitness Coach',
    },
    {
      name: 'Kavya Nair',
      handle: '@kavya.craft',
      followers: '42K followers',
      avatar: '✨',
      text: 'Finally a tool made for Indian creators. UPI payments, INR pricing, mobile management — everything just works.',
      stars: 5,
      badge: 'Handmade Seller',
    },
    {
      name: 'Rohan Joshi',
      handle: '@rohan.edu',
      followers: '130K followers',
      avatar: '📚',
      text: 'Launched my ₹499 PDF guide and made ₹28,000 in 3 days just from one Instagram story. Zero tech setup needed.',
      stars: 5,
      badge: 'Educator',
    },
  ];

  const tickerItems = [
    { icon: <Banknote size={16} />, text: 'Sell Digital Products' },
    { icon: <Zap size={16} />, text: '2-Minute Setup' },
    { icon: <Smartphone size={16} />, text: 'UPI Payments' },
    { icon: <Target size={16} />, text: 'Instagram-Optimized' },
    { icon: <HeartHandshake size={16} />, text: 'Made for Indian Creators' },
    { icon: <Banknote size={16} />, text: 'Zero Monthly Fees' },
    { icon: <Package size={16} />, text: 'Auto Delivery' },
    { icon: <Rocket size={16} />, text: 'Go Live Instantly' },
  ];

  const faqs = [
    { question: 'Is Gigzo really free to start?', answer: 'Yes! Gigzo is completely free to start. We charge only a small platform fee (3-5%) on successful sales. No monthly subscription, no setup fee, no hidden charges.' },
    { question: 'What can I sell on Gigzo?', answer: 'You can sell digital products (ebooks, PDF guides, Lightroom presets, Notion templates, courses, audio files) and simple physical products with flat-rate shipping. Multi-product stores are coming in V2.' },
    { question: 'How do I get paid?', answer: 'Your buyers pay via UPI (GPay, PhonePe, Paytm) directly. Payments are settled to your bank account weekly, with clear payout reports in your dashboard.' },
    { question: 'Do my buyers need to create an account?', answer: 'Absolutely not! That\'s our biggest advantage. Buyers just enter their name + email for delivery. Payment is one UPI tap. Zero friction, maximum conversions.' },
    { question: 'How fast can I launch my store?', answer: 'Tested by real creators — average launch time is under 2 minutes. Login → upload product → get link → put in bio. That\'s it.' },
    { question: 'Is this only for big influencers?', answer: 'Not at all. We\'re built for micro-creators (even 1K followers). If your audience trusts you, they\'ll buy from you. Follower count matters less than authentic connection.' },
  ];

  return (
    <div style={{ background: '#ffffff', color: '#0a0a0a', overflowX: 'hidden', position: 'relative' }}>
      {/* ============================================================
          GLOBAL BACKGROUND ORBS — subtle ambient color
          ============================================================ */}
      <div className="orb orb-lime" style={{ width: 600, height: 600, top: '5vh', right: '-10vw' }} />
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: '50vh', left: '-8vw' }} />
      <div className="orb orb-lime" style={{ width: 400, height: 400, top: '110vh', right: '5vw' }} />
      <div className="orb orb-pink" style={{ width: 350, height: 350, top: '170vh', left: '20vw' }} />
      <div className="orb orb-purple" style={{ width: 450, height: 450, top: '240vh', right: '-5vw' }} />

      {/* ============================================================
          NAVBAR
          ============================================================ */}
      <nav
        className="glass-nav"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          height: '72px',
          transition: 'box-shadow 0.3s',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 30L22 10H32L22 30H12Z" fill="#0a0a0a" />
            <path d="M8 26L14 14H22L16 26H8Z" fill="#0a0a0a" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 900, fontSize: '1.45rem', letterSpacing: '-1px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0a0a0a', lineHeight: 1 }}>Gigzo</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#6b7280', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Powered by ProfitupX</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav-links">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} style={{
              fontWeight: 700, fontSize: '0.9rem', color: '#0a0a0a',
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.6'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              {l.label}
            </a>
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
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
          >
            Get Started
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer', padding: '8px', borderRadius: '10px', color: 'var(--foreground)' }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 999,
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '4px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{
              fontWeight: 600, fontSize: '1.05rem', padding: '12px 16px',
              borderRadius: 12, color: 'var(--text-secondary)',
            }}>
              {l.label}
            </a>
          ))}
          <Link href="/auth/login" className="btn-primary mobile-menu-start-btn" style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>
            Start for Free
          </Link>
        </div>
      )}

      {/* ============================================================
          HERO SECTION (Redesigned)
          ============================================================ */}
      <section className="relative overflow-hidden" style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 0 100px',
        background: '#ffffff'
      }}>
        <div className="container-wide relative z-10">
          <div className="mobile-stack" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}>
            {/* Left Column: Copy & Network Graph */}
            <div>
              {/* Announcement badge */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
                className="badge badge-lime" style={{ marginBottom: '24px' }}>
                <Sparkles size={14} className="text-lime-700" />
                <span>India's #1 Creator Commerce Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ 
                  fontSize: 'clamp(3.5rem, 6.5vw, 5.5rem)', 
                  fontWeight: 900, 
                  lineHeight: 1.05, 
                  marginBottom: '24px', 
                  letterSpacing: '-0.04em',
                  color: '#0a0a0a'
                }}
              >
                Sell <br/>
                Anything. <br/>
                No Website <br/>
                Needed. <span style={{ display: 'inline-flex', verticalAlign: 'middle', width: 48, height: 48, background: 'var(--pastel-pink)', borderRadius: '50%', color: '#9d174d', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={24} /></span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '440px', marginBottom: '32px' }}
              >
                The easiest way for Indian creators to sell digital products, courses, and communities. Zero setup cost. Turn your audience into a revenue machine and start monetizing today.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                style={{ marginBottom: '48px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}
              >
                <Link href="/auth/login" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#0a0a0a',
                  color: '#fff',
                  padding: '16px 32px',
                  borderRadius: '100px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  letterSpacing: '-0.02em',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
                >
                  Start Selling for Free
                </Link>
                <a href="#how-it-works" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, padding: '16px 24px', borderRadius: '100px', background: 'transparent', transition: 'background 0.2s', color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f3f4f6'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <Play size={18} fill="currentColor" /> See how it works
                </a>
              </motion.div>

              {/* Network Graph (Adapted for Highlights) */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
                style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '180px' }}>
                
                {/* Connecting Lines */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'visible' }}>
                  <path d="M 160 20 L 260 20 L 300 80 L 400 80" fill="none" stroke="var(--border)" strokeWidth="2" />
                  <path d="M 180 80 L 300 80" fill="none" stroke="var(--border)" strokeWidth="2" />
                  <path d="M 180 140 L 260 140" fill="none" stroke="var(--border)" strokeWidth="2" />
                  <path d="M 260 20 L 240 80" fill="none" stroke="var(--border)" strokeWidth="2" />
                  <path d="M 300 80 L 320 140" fill="none" stroke="var(--border)" strokeWidth="2" />
                </svg>

                {/* Nodes (Pills mapped to Gigzo Highlights) */}
                <div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 1, background: '#fff', border: '1px solid var(--border)', padding: '8px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700 }}>Join 250+ creators</div>
                <div style={{ position: 'absolute', top: '0px', left: '200px', zIndex: 1, background: '#fff', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>+</div>
                <div style={{ position: 'absolute', top: '0px', left: '260px', zIndex: 1, background: '#fff', border: '1px solid var(--border)', padding: '8px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700 }}>+₹499 New Sale</div>
                
                <div style={{ position: 'absolute', top: '60px', left: '0px', zIndex: 1, background: '#fff', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>+</div>
                <div style={{ position: 'absolute', top: '60px', left: '60px', zIndex: 1, background: '#a7f3d0', padding: '8px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, color: '#065f46' }}>₹3,450 Today's Rev</div>
                <div style={{ position: 'absolute', top: '60px', left: '260px', zIndex: 1, background: '#fff', border: '1px solid var(--border)', padding: '8px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700 }}>Weekly Payouts</div>
                <div style={{ position: 'absolute', top: '60px', left: '420px', zIndex: 1, background: '#fff', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>+</div>

                <div style={{ position: 'absolute', top: '120px', left: '0px', zIndex: 1, background: '#fff', border: '1px solid var(--border)', padding: '8px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700 }}>Zero Setup Cost</div>
                <div style={{ position: 'absolute', top: '120px', left: '160px', zIndex: 1, background: '#fff', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>+</div>
              </motion.div>
            </div>

            {/* Right Column: Organic Bento Shapes */}
            <motion.div 
              className="hero-bento-grid"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '220px 220px', gap: '20px', position: 'relative' }}>
              
              {/* Top Left: Green Girl */}
              <div style={{ position: 'relative', background: '#a7f3d0', borderRadius: '40px 100px 40px 40px', overflow: 'hidden', gridRow: 'span 2' }}>
                <Image src="/creator_green_bg.jpg" alt="Creator using app" fill style={{ objectFit: 'cover' }} />
              </div>

              {/* Top Right: Purple Chart */}
              <div style={{ background: '#c4b5fd', borderRadius: '100px 40px 40px 100px', padding: '32px', display: 'flex', flexDirection: 'column', color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>July</div>
                  <div style={{ background: '#0a0a0a', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>+1424</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, gap: '8px' }}>
                  {[40, 70, 45, 90, 60, 110, 80].map((h, i) => (
                    <div key={i} style={{ width: '100%', background: 'rgba(255,255,255,0.4)', height: `${h}%`, borderRadius: '100px 100px 0 0' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                  <span>Ap</span><span>My</span><span>Ju</span><span>Jl</span><span>Au</span><span>Se</span>
                </div>
              </div>

              {/* Bottom Right: Yellow Guy */}
              <div style={{ position: 'relative', background: '#fef08a', borderRadius: '40px 40px 100px 40px', overflow: 'hidden', gridRow: 'span 2', marginTop: '-220px', zIndex: 1 }}>
                <Image src="/creator_yellow_bg.jpg" alt="Creator smiling" fill style={{ objectFit: 'cover' }} />
              </div>

              {/* Bottom Left: Pink Team */}
              <div style={{ position: 'relative', background: '#fbcfe8', borderRadius: '40px 100px 100px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '0', gridRow: '2 / 3', gridColumn: '1 / 2' }}>
                <div style={{ position: 'absolute', top: 16, right: 24, width: 32, height: 32, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>+</div>
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f43f5e', border: '3px solid #fbcfe8', zIndex: 2, overflow: 'hidden', position: 'relative' }}>
                    <Image src="/creator_green_bg.jpg" alt="Avatar" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#3b82f6', border: '3px solid #fbcfe8', marginLeft: '-20px', zIndex: 1, overflow: 'hidden', position: 'relative' }}>
                    <Image src="/creator_yellow_bg.jpg" alt="Avatar" fill style={{ objectFit: 'cover' }} />
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#9d174d' }}>Shine together</div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TICKER / MARQUEE
          ============================================================ */}
      <div style={{ background: 'var(--primary)', padding: '14px 0', overflow: 'hidden' }}>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 700, fontSize: '0.88rem',
                padding: '0 32px', opacity: i % 2 === 0 ? 1 : 0.6, letterSpacing: '0.02em',
              }}>
                <span style={{ color: 'var(--accent-lime)' }}>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          STATS BENTO SECTION
          ============================================================ */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', gridAutoRows: 'minmax(160px, auto)' }}>

            {/* Big stat 1 — Active Stores */}
            <div style={{
              gridColumn: 'span 4', gridRow: 'span 1',
              background: 'var(--primary)', color: '#fff',
              borderRadius: 24, padding: '32px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <IconStore size={24} />
              </div>
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  <AnimatedCounter target={250} suffix="+" />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: '6px' }}>Active Creator Stores</div>
              </div>
            </div>

            {/* Big stat 2 — Revenue */}
            <div style={{
              gridColumn: 'span 4', gridRow: 'span 1',
              background: 'var(--accent-lime)', color: '#1a2a00',
              borderRadius: 24, padding: '32px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCoin size={24} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  ₹<AnimatedCounter target={10} suffix=" Lakh+" />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.55)', fontWeight: 600, marginTop: '6px' }}>Revenue Processed</div>
              </div>
            </div>

            {/* Stat 3 — Checkout rate */}
            <div style={{
              gridColumn: 'span 2', gridRow: 'span 1',
              background: '#ede9fe', color: '#5b21b6',
              borderRadius: 24, padding: '28px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(91,33,182,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheckCircle size={22} />
              </div>
              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  <AnimatedCounter target={95} suffix="%" />
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: '6px', opacity: 0.7 }}>Checkout Rate</div>
              </div>
            </div>

            {/* Stat 4 — Launch time */}
            <div style={{
              gridColumn: 'span 2', gridRow: 'span 1',
              background: '#0a0a0a', color: '#fff',
              borderRadius: 24, padding: '28px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(200,241,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-lime)' }}>
                <IconRocket size={22} />
              </div>
              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  2<span style={{ fontSize: '1.2rem' }}>min</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: '6px', opacity: 0.6 }}>Store Launch</div>
              </div>
            </div>

            {/* Wide tagline card */}
            <div style={{
              gridColumn: 'span 12',
              background: 'var(--surface-2)',
              borderRadius: 24, padding: '28px 36px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid var(--border)',
              flexWrap: 'wrap', gap: '16px',
            }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>
                India's fastest growing creator commerce platform — <span style={{ color: 'var(--foreground)' }}>built for Instagram sellers.</span>
              </p>
              <Link href="/auth/login" className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '12px 24px' }}>Join Free →</Link>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          PAIN POINTS — Lyf-style colored card layout
          ============================================================ */}
      <section id="pain-points" className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="mobile-stack mobile-stack-gap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '64px' }}>
            <div>
              <span className="section-tag">The Problem</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', lineHeight: 1.1 }}>
                We Know the<br />
                <span style={{ color: '#f97316' }}>Struggle.</span>
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Existing e-commerce tools were built for Western businesses with big budgets. Indian Instagram creators need something built just for them.
            </p>
          </div>

          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {/* Card 1 — High Fees */}
            <div style={{ background: 'var(--accent-lime)', borderRadius: 24, padding: '36px', position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconDollarOff size={24} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.5 }}>01 / Pain</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '10px', color: '#1a2a00', letterSpacing: '-0.02em' }}>Shopify Costs Too Much</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(0,0,0,0.6)', lineHeight: 1.7, marginBottom: '24px' }}>₹3,000/month for a store you barely use? Gigzo is free to start — pay only a small % per sale.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', color: '#1a2a00' }}>
                <span>Free to start</span>
                <IconArrow />
              </div>
            </div>

            {/* Card 2 — Desktop-only */}
            <div style={{ background: '#0a0a0a', borderRadius: 24, padding: '36px', position: 'relative', overflow: 'hidden', color: '#fff',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                  <IconDesktop size={24} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.3 }}>02 / Pain</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-0.02em' }}>Desktop-Only Tools</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '24px' }}>Existing platforms force you to sit at a laptop. Gigzo is 100% mobile-first — manage everything from your phone.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                <span>Mobile dashboard</span>
                <IconArrow />
              </div>
            </div>

            {/* Card 3 — Cart abandonment */}
            <div style={{ background: '#ede9fe', borderRadius: 24, padding: '36px', position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(91,33,182,0.12)', borderRadius: 12, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b21b6' }}>
                  <IconXCircle size={24} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.3, color: '#5b21b6' }}>03 / Pain</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '10px', color: '#3b0764', letterSpacing: '-0.02em' }}>Buyers Drop at Checkout</h3>
              <p style={{ fontSize: '0.88rem', color: '#5b21b6', lineHeight: 1.7, marginBottom: '24px', opacity: 0.75 }}>Account creation, credit card forms, OTPs — buyers give up. Gigzo: zero registration, one UPI tap.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', color: '#5b21b6' }}>
                <span>1-tap UPI checkout</span>
                <IconArrow />
              </div>
            </div>

            {/* Card 4 — Setup takes days */}
            <div style={{ background: '#fff7ed', borderRadius: 24, padding: '36px', position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(194,65,12,0.1)', borderRadius: 12, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c' }}>
                  <IconClock size={24} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.3, color: '#c2410c' }}>04 / Pain</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '10px', color: '#7c2d12', letterSpacing: '-0.02em' }}>Setup Takes Days</h3>
              <p style={{ fontSize: '0.88rem', color: '#9a3412', lineHeight: 1.7, marginBottom: '24px', opacity: 0.75 }}>Building a Shopify store needs developers, designers, and patience. Gigzo store is live in under 2 minutes.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', color: '#c2410c' }}>
                <span>2-minute launch</span>
                <IconArrow />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
          ============================================================ */}
      <section id="how-it-works" className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Process</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px' }}>
              Live in <span className="gradient-text-lime">3 Easy Steps</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              No developer. No credit card. No complicated setup. Just you, your products, and your audience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {steps.map((s, i) => (
              <div key={s.title} style={{
                background: s.color,
                color: s.textColor,
                borderRadius: 24,
                padding: '40px 32px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', right: '20px', top: '20px',
                  fontSize: '5rem', fontWeight: 900, opacity: 0.15,
                  lineHeight: 1, letterSpacing: '-0.04em',
                }}>
                  {s.num}
                </div>

                <div style={{
                  display: 'inline-block', background: s.textColor === '#fff' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                  borderRadius: 12, padding: '8px 14px', fontSize: '0.78rem', fontWeight: 800,
                  letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px',
                  color: s.textColor,
                }}>
                  Step {s.num} · {s.hint}
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: s.textColor }}>{s.title}</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8, color: s.textColor }}>{s.desc}</p>

                <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.7 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Learn more</span>
                  <IconArrow />
                </div>
              </div>
            ))}
          </div>

          {/* Central CTA */}
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <Link href="/auth/login" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px', display: 'inline-flex', gap: '10px' }}>
              <span>Start Your Store Now</span>
              <span>→</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: '12px', fontWeight: 600 }}>
              Free forever · No credit card · Live in 2 min
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          DASHBOARD PREVIEW (LINKTREE-STYLE)
          ============================================================ */}
      <section style={{ padding: '100px 0', background: '#0a0a0a', color: '#fff', overflow: 'hidden' }}>
        <div className="container">
          <div className="mobile-stack mobile-stack-gap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Left: Copy */}
            <div>
              <span className="section-tag" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Store</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '24px', lineHeight: 1.1, marginTop: '12px' }}>
                Your Brand.<br />
                <span className="gradient-text-lime">Your Link.</span><br />
                Your Empire.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '40px' }}>
                Gigzo gives you a stunning mobile-optimized storefront that loads in under 1 second — even on 4G. Designed specifically for Instagram's in-app browser.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: <IconTrendingUp />, text: 'Custom brand colors and avatar' },
                  { icon: <IconLink />, text: 'Unlimited digital & physical products' },
                  { icon: <IconRupee />, text: 'Real-time sales dashboard in INR' },
                  { icon: <IconZap />, text: 'Auto email delivery for digital goods' },
                  { icon: <IconMobile />, text: 'Custom short link (gogo.to/yourname)' },
                ].map(f => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(200,241,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-lime)', flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.92rem' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '40px', display: 'flex', gap: '14px' }}>
                <Link href="/auth/login" className="btn-lime" style={{ fontSize: '0.95rem' }}>
                  Create Your Link →
                </Link>
              </div>
            </div>

            {/* Right: Dashboard screenshot */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
              }}>
                <Image
                  src="/dashboard_mockup.jpg"
                  alt="Gigzo creator dashboard showing sales analytics"
                  width={600}
                  height={380}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>

              {/* Floating metric card */}
              <div style={{
                position: 'absolute', bottom: '-20px', left: '-20px',
                background: '#fff', color: '#0a0a0a', borderRadius: 16,
                padding: '16px 20px', boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                minWidth: '160px',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Monthly Earnings</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em' }}>₹84K</div>
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>↑ 127% growth</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES SHOWCASE (Replaces Pricing)
          ============================================================ */}
      <section id="features" className="section" style={{ background: '#ffffff', overflow: 'hidden' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '80px' }}>
            <span className="section-tag">Platform Features</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '16px' }}>
              Everything you need.<br />
              <span className="gradient-text-lime">Built right in.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              We've replaced complex subscriptions with a single, powerful platform. From mobile management to full analytics — it's all here.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
            
            {/* Feature 1: Mobile App Dashboard */}
            <div className="mobile-stack mobile-stack-gap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              {/* Text Left */}
              <div style={{ paddingRight: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--surface-2)', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '24px' }}>
                  <Smartphone size={16} /> Native Experience
                </div>
                <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em' }}>
                  A real mobile app <br/> dashboard.
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                  Manage your entire store from your phone. No clunky desktop interfaces. Check sales, update inventory, and withdraw funds on the go with a buttery-smooth mobile UI.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['1-tap UPI payouts', 'Real-time order notifications', 'Manage products anywhere'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
                      <CheckCircle size={18} color="#16a34a" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              {/* UI Mockup Right */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '280px', height: '560px', background: '#f5f5f7', borderRadius: '40px', border: '12px solid #0a0a0a', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '24px', background: '#0a0a0a', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }} />
                  <div style={{ padding: '40px 20px 20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>G</div>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb' }} />
                    </div>
                    <div style={{ background: '#0a0a0a', borderRadius: '24px', padding: '24px', color: '#fff' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Total Earnings</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900 }}>₹45,290</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '8px' }}>Recent Sales</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      {[499, 1299, 899].map((amt, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px', borderRadius: '16px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)' }} />
                            <div style={{ width: 80, height: 8, background: 'var(--border)', borderRadius: 4 }} />
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>+₹{amt}</div>
                        </div>
                      ))}
                    </div>
                    {/* Bottom Nav */}
                    <div style={{ height: '60px', background: '#fff', borderRadius: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 'auto', boxShadow: '0 -4px 20px rgba(0,0,0,0.03)' }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: '#0a0a0a' }} />
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--border)' }} />
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--border)' }} />
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--border)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Marketplace Grid (Image Left) */}
            <div className="mobile-stack mobile-stack-gap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              {/* UI Mockup Left */}
              <div style={{ display: 'flex', justifyContent: 'center', order: -1 }}>
                <div style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '24px', border: '1px solid var(--border)', padding: '24px', boxShadow: '0 24px 60px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', gap: '12px', overflow: 'hidden', marginBottom: '24px' }}>
                    {['All', 'Digital', 'Presets', 'Ebooks'].map((tag, i) => (
                      <div key={tag} style={{ padding: '6px 16px', background: i === 0 ? '#0a0a0a' : 'var(--surface-2)', color: i === 0 ? '#fff' : '#0a0a0a', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>{tag}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { h: 180, c: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
                      { h: 140, c: 'linear-gradient(135deg, #f0ffd4, #d9f99d)' },
                      { h: 150, c: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' },
                      { h: 190, c: 'linear-gradient(135deg, #ecfeff, #a5f3fc)' },
                    ].map((card, i) => (
                      <div key={i} style={{ background: card.c, height: card.h, borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.8)', padding: '4px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800 }}>₹999</div>
                        <div style={{ width: '70%', height: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 4, marginBottom: 6 }} />
                        <div style={{ width: '40%', height: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Text Right */}
              <div style={{ paddingLeft: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--pastel-purple)', color: '#5b21b6', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '24px' }}>
                  <Target size={16} /> Gigzo Marketplace
                </div>
                <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em' }}>
                  Get discovered by <br/> new buyers.
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                  Don't just rely on your Instagram bio link. Every product you create is automatically indexed in the Gigzo Marketplace, exposing you to thousands of cross-shopping buyers daily.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Automated cross-selling', 'Trending product charts', 'Global search visibility'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
                      <CheckCircle size={18} color="#7b5ea7" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3: Custom Store (Text Left) */}
            <div className="mobile-stack mobile-stack-gap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              <div style={{ paddingRight: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--pastel-pink)', color: '#9d174d', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '24px' }}>
                  <Package size={16} /> Storefront Builder
                </div>
                <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em' }}>
                  Your own website,<br/> zero coding.
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                  Get a beautiful, conversion-optimized storefront out of the box. Brand it with your colors, upload your avatar, and share your unique `gogo.store/yourname` link anywhere.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.08)' }}>
                  {/* Browser Bar */}
                  <div style={{ background: '#f5f5f7', padding: '12px 16px', display: 'flex', gap: '6px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                  </div>
                  {/* Store Content */}
                  <div style={{ padding: '32px 24px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #f472b6, #fb923c)' }} />
                      <div>
                        <div style={{ width: 120, height: 16, background: '#0a0a0a', borderRadius: 4, marginBottom: 8 }} />
                        <div style={{ width: 80, height: 10, background: 'var(--text-muted)', borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ background: '#fff', padding: '12px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                          <div style={{ width: '100%', height: 100, background: 'var(--surface-2)', borderRadius: '8px', marginBottom: '12px' }} />
                          <div style={{ width: '80%', height: 8, background: 'var(--border)', borderRadius: 4, marginBottom: 8 }} />
                          <div style={{ width: '40%', height: 8, background: 'var(--border)', borderRadius: 4 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Analytics (Image Left) */}
            <div className="mobile-stack mobile-stack-gap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', order: -1 }}>
                <div style={{ width: '100%', maxWidth: '440px', background: '#0a0a0a', borderRadius: '24px', padding: '32px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', color: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Analytics</div>
                    <div style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800 }}>Last 7 Days</div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Store Views</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>840</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Conversion</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#c8f135' }}>4.2%</div>
                    </div>
                  </div>
                  {/* Bar Chart Mockup */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '8px' }}>
                    {[40, 70, 45, 90, 60, 110, 80].map((h, i) => (
                      <div key={i} style={{ width: '100%', background: i === 5 ? '#c8f135' : 'rgba(255,255,255,0.1)', height: `${h}%`, borderRadius: '4px 4px 0 0', transition: 'height 1s ease' }} />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ paddingLeft: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--pastel-lime)', color: '#3a6600', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '24px' }}>
                  <TrendingUp size={16} /> A to Z Analytics
                </div>
                <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em' }}>
                  Track everything. <br/> <span style={{ color: '#16a34a' }}>100% Free.</span>
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                  We don't hide your data behind a paywall. Get deep insights into page views, conversion rates, and top-performing products out of the box — completely free forever.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Store visitor tracking', 'Conversion funnels', 'Revenue breakdowns'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
                      <CheckCircle size={18} color="#c8f135" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS — Twitter/Instagram Social Proof cards
          ============================================================ */}
      <section style={{ padding: '100px 0', background: '#ffffff', overflow: 'hidden', position: 'relative' }}>
        <div className="absolute inset-0 z-0 bg-grid-pattern-full opacity-30 pointer-events-none"></div>
        <div className="container relative z-10">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-tag">Creator Stories</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '16px' }}>
              Don't take our word for it.<br />
              <span style={{ color: '#7b5ea7' }}>Trust our creators.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
              Thousands of Indian creators are already earning on Gigzo. Here's what they say.
            </p>
          </div>

          {/* Row 1 — 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {[
              {
                name: 'Priya Sharma', handle: '@priya.creates', badge: 'Digital Creator',
                date: '12 Jun 2026', time: '09:41 AM',
                text: 'Sold ₹47,000 of Lightroom presets in the first week using Gigzo. Setting up took literally 90 seconds. No tech skills needed at all!',
                likes: 342, comments: 28, avatarBg: '#fce7f3', avatarText: 'PS', platform: 'instagram',
              },
              {
                name: 'Arjun Mehta', handle: '@arjun.fitness', badge: 'Fitness Coach',
                date: '3 Jul 2026', time: '07:15 PM',
                text: 'My followers were dropping off at Shopify checkout. Switched to @gogocreate and my conversion rate jumped 3x overnight. UPI checkout is a game changer.',
                likes: 891, comments: 63, avatarBg: '#e0f2fe', avatarText: 'AM', platform: 'instagram',
              },
              {
                name: 'Kavya Nair', handle: '@kavya.craft', badge: 'Handmade Seller',
                date: '19 Jul 2026', time: '02:30 PM',
                text: 'Finally a tool made for Indian creators. UPI payments, INR pricing, mobile management — everything just works perfectly.',
                likes: 214, comments: 17, avatarBg: '#ede9fe', avatarText: 'KN', platform: 'instagram',
              },
            ].map((t, i) => (
              <motion.div 
                key={t.name} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="bento-hover"
                style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 20, padding: '24px',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#374151', flexShrink: 0 }}>
                      {t.avatarText}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>{t.name}</span>
                        <IconVerified size={14} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.handle}</div>
                    </div>
                  </div>
                  <IconInstagramColor size={20} />
                </div>

                {/* Text */}
                <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {t.text}
                </p>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <IconHeart size={13} /> {t.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <IconComment size={13} /> {t.comments}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.date} · {t.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2 — 2 cards offset (wider) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
            {[
              {
                name: 'Rohan Joshi', handle: '@rohan.edu', badge: 'Educator',
                date: '25 Jul 2026', time: '11:00 AM',
                text: 'Launched my ₹499 PDF guide and made ₹28,000 in 3 days just from one Instagram story. @gogocreate handles everything automatically — delivery, payments, receipts. Zero setup headache.',
                likes: 1204, comments: 98, avatarBg: '#fef3c7', avatarText: 'RJ',
              },
              {
                name: 'Sneha Kulkarni', handle: '@sneha.style', badge: 'Fashion Creator',
                date: '1 Aug 2026', time: '05:22 PM',
                text: 'I was skeptical at first — but my buyers literally just tap UPI and the order is placed. No account creation, no OTP drama. My sales went from 3/week to 40/week in one month.',
                likes: 677, comments: 54, avatarBg: '#dcfce7', avatarText: 'SK',
              },
            ].map((t, i) => (
              <motion.div 
                key={t.name} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="bento-hover"
                style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 20, padding: '28px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#374151', flexShrink: 0 }}>
                      {t.avatarText}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t.name}</span>
                        <IconVerified size={14} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.handle}</div>
                    </div>
                  </div>
                  <span className="badge badge-lime" style={{ fontSize: '0.7rem' }}>{t.badge}</span>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {t.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <IconHeart size={13} /> {t.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <IconComment size={13} /> {t.comments}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <IconSend size={13} />
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.date} · {t.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================================
          FAQ SECTION — Reference Style with Grouped Categories
          ============================================================ */}
      <section id="faq" className="section" style={{ background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}>
        {/* Skewed accent strip — exact match to reference design */}
        <div className="skew-accent" style={{ opacity: 0.10, background: 'linear-gradient(135deg, var(--accent-lime) 0%, var(--accent-purple) 100%)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Editorial heading — reference style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '20px' }}>
              Frequently<br /><span className="gradient-text-lime">Asked</span><br />Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
              Everything you need to know about Gigzo. If your question isn't here, drop us a message.
            </p>
          </motion.div>

          {/* Category 1: Getting Started */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-lime)', flexShrink: 0 }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Getting Started</h3>
            </div>
            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
              {[
                { question: 'Is Gigzo really free to start?', answer: 'Yes! Gigzo is completely free to start. We charge only a small platform fee (3–5%) on successful sales. No monthly subscription, no setup fee, no hidden charges.' },
                { question: 'How fast can I launch my store?', answer: 'Tested by real creators — average launch time is under 2 minutes. Login → upload product → get link → put in bio. That\'s it.' },
                { question: 'Is this only for big influencers?', answer: 'Not at all. We\'re built for micro-creators (even 1K followers). If your audience trusts you, they\'ll buy from you. Follower count matters less than authentic connection.' },
              ].map((f, i) => (
                <div key={f.question} style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <FaqItem question={f.question} answer={f.answer} defaultOpen={i === 0} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category 2: Payments & Products */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-purple)', flexShrink: 0 }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Payments & Products</h3>
            </div>
            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
              {[
                { question: 'What can I sell on Gigzo?', answer: 'You can sell digital products (ebooks, PDF guides, Lightroom presets, Notion templates, courses, audio files) and simple physical products with flat-rate shipping. Multi-product stores are coming in V2.' },
                { question: 'How do I get paid?', answer: 'Your buyers pay via UPI (GPay, PhonePe, Paytm) directly. Payments are settled to your bank account weekly, with clear payout reports in your dashboard.' },
                { question: 'Do my buyers need to create an account?', answer: 'Absolutely not! That\'s our biggest advantage. Buyers just enter their name + email for delivery. Payment is one UPI tap. Zero friction, maximum conversions.' },
              ].map((f, i) => (
                <div key={f.question} style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <FaqItem question={f.question} answer={f.answer} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '20px' }}>
              Still have questions? We're here to help.
            </p>
            <a href="mailto:hello@gogocreate.in" className="btn-secondary" style={{ display: 'inline-flex' }}>
              Contact Support →
            </a>
          </motion.div>
        </div>
      </section>


      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(200,241,53,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Rocket size={48} className="text-lime-400" />
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '20px', lineHeight: 1.05, letterSpacing: '-0.04em' }}>
            Your Store is<br />
            <span className="gradient-text-lime">2 Minutes Away</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '40px' }}>
            Join 250+ Indian creators already earning with Gigzo. No tech skills needed. No monthly fees. Just your link and your audience.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/login" className="btn-lime" style={{ fontSize: '1.05rem', padding: '18px 36px' }}>
              Create Free Store → 
            </Link>
            <a href="#how-it-works" className="btn-secondary" style={{ fontSize: '1.05rem', padding: '18px 36px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
              See How It Works
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '48px', flexWrap: 'wrap' }}>
            {['✓ Free forever plan', '✓ No credit card', '✓ Live in 2 minutes'].map(t => (
              <span key={t} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>
      {/* ============================================================
          MOBILE APP DOWNLOAD SECTION
          ============================================================ */}
      <section id="mobile-app" className="section" style={{ background: '#f8fafc', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '16px', color: '#0a0a0a' }}>
              Run your business <br/> from your pocket.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              Download the Gigzo Creator App. Track sales, upload products, and manage your store — 100% on mobile.
            </motion.p>
          </div>

          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', gridAutoRows: 'minmax(280px, auto)' }}>
            
            {/* Download CTA */}
            <div style={{ gridColumn: 'span 8', background: '#0a0a0a', borderRadius: '32px', padding: '48px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(200,241,53,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
              <div style={{ zIndex: 1, maxWidth: '400px' }}>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.1 }}>Get the Android APK</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>Experience blazing fast product uploads and instant push notifications for every sale you make.</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-lime" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '1.05rem', borderRadius: '100px' }}>
                    <Smartphone size={20} /> Download APK (Soon)
                  </button>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>v1.0.0 Alpha</span>
                </div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div style={{ gridColumn: 'span 4', background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '160px', height: '160px', border: '2px dashed #e5e7eb', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', background: '#fafafa' }}>
                <Smartphone size={40} className="text-gray-300" />
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>Scan to Download</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Point your camera (Coming soon)</div>
            </div>

            {/* Feature 1 */}
            <div style={{ gridColumn: 'span 6', background: 'var(--pastel-lime)', borderRadius: '32px', padding: '40px', color: '#1a2a00', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ flex: 1, zIndex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 16px rgba(200,241,53,0.3)' }}>
                  <Zap size={24} fill="currentColor" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.1 }}>Cha-Ching Alerts</h3>
                <p style={{ fontWeight: 500, opacity: 0.8, fontSize: '0.95rem' }}>Instant push notifications the second someone buys your product.</p>
              </div>
              <div style={{ width: '140px', height: '100%', background: 'rgba(255,255,255,0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.6)', transform: 'rotate(10deg) translateY(20px)', zIndex: 0 }} />
            </div>

            {/* Feature 2 */}
            <div style={{ gridColumn: 'span 6', background: '#ede9fe', borderRadius: '32px', padding: '40px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ flex: 1, zIndex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: '#c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#fff' }}>
                  <Rocket size={24} fill="currentColor" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.1 }}>1-Tap Upload</h3>
                <p style={{ fontWeight: 500, opacity: 0.8, fontSize: '0.95rem' }}>Upload PDFs, courses, and zip files directly from your phone's storage.</p>
              </div>
              <div style={{ width: '140px', height: '100%', background: 'rgba(255,255,255,0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.6)', transform: 'rotate(-10deg) translateY(20px)', zIndex: 0 }} />
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="footer" style={{ padding: '60px 0 32px' }}>
        <div className="container">
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#1a2a00', fontWeight: 900, fontSize: '0.9rem' }}>G</span>
                </div>
                <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', letterSpacing: '-1px' }}>Gigzo</span>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, maxWidth: '260px' }}>
                India's fastest link-in-bio commerce platform. Built for Indian creators, powered by UPI.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}>
                  <IconInstagram />
                </a>
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'How It Works', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Refund Policy'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontWeight: 800, color: '#fff', marginBottom: '16px', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: '0.88rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.color = ''; }}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <p style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>© 2026 Gigzo powered by ProfitupX. Made with <Heart size={14} className="text-red-500" fill="currentColor" /> in India</p>
            <p style={{ fontSize: '0.82rem' }}>Empowering creators to monetize their passion.</p>
          </div>
        </div>
      </footer>

      {/* ============================================================
          MOBILE RESPONSIVE STYLES
          ============================================================ */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .desktop-nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 768px) {
          nav { padding: 0 20px !important; }
          .footer > div > div:first-child { 
            grid-template-columns: 1fr !important; 
            gap: 32px !important; 
          }
          .pricing-card.featured { transform: scale(1) !important; }
          
          /* Fix grid column spans inside mobile-stack */
          .mobile-stack > div {
            grid-column: 1 / -1 !important;
          }
          
          /* Fix Hero images and grid for mobile */
          .hero-bento-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto auto auto auto !important;
            gap: 16px !important;
          }
          .hero-bento-grid > div {
            min-height: 220px !important;
            margin-top: 0 !important;
            grid-row: auto !important;
            grid-column: 1 / -1 !important;
          }
          
          /* Shrink Mobile Menu Button */
          .mobile-menu-start-btn {
            padding: 12px 16px !important;
            font-size: 0.95rem !important;
          }
        }

        @media (max-width: 640px) {
          .hero-cta { flex-direction: column !important; align-items: stretch !important; }
          .hero-cta a, .hero-cta button { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
