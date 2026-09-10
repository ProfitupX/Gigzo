'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Bot, 
  MessageSquare, 
  Headphones, 
  Sparkles, 
  Coins, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Globe,
  Clock,
  Star
} from 'lucide-react';
import { GooglePayLogo, PhonePeLogo, PaytmLogo, BhimUpiLogo, CredLogo } from '@/components/ui/UpiIcons';

import HeaderNav from '@/components/HeaderNav';

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0a0a0a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Universal Website Navbar */}
      <HeaderNav activePage="Pricing" />

      {/* Main Content Container */}
      <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '40px 24px 80px' }}>
        
        {/* HERO HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '100px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            <Sparkles size={14} /> Zero Risk • 0% Commission • AI & WhatsApp Powered
          </span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', marginBottom: '14px', lineHeight: 1.15 }}>
            Supercharge Your Creator Business with <br />
            <span style={{ color: '#0284c7' }}>AI Automations & 0% Platform Commission</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.08rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Sell digital products, physical items, courses, and custom services on autopilot with 24/7 WhatsApp AI sales bot, Voice Copilot, SafePay Escrow settlements, and zero platform cuts on direct UPI.
          </p>

          {/* Feature Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '24px' }}>
            {[
              { icon: Coins, text: '0% Platform Commission' },
              { icon: MessageSquare, text: 'WhatsApp AI 24/7 Automation' },
              { icon: Bot, text: 'Multilingual Voice AI Copilot' },
              { icon: ShieldCheck, text: 'SafePay Escrow Settlements' },
              { icon: Headphones, text: '24*7 Dedicated Support' },
            ].map((badge, i) => {
              const IconComp = badge.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  <IconComp size={14} color="#0284c7" />
                  <span>{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 PRICING TIERS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '70px', alignItems: 'stretch' }}>
          
          {/* TIER 1: STARTER CREATOR (0% Commission) */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '36px 30px', border: '1.5px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Starter Creator
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#f1f5f9', color: '#334155', padding: '3px 10px', borderRadius: '100px' }}>
                  FREE FOREVER
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '3.2rem', fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em' }}>₹0</span>
                <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>/ month</span>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '24px' }}>
                Perfect for educators, designers, artists and freelancers starting out. Sell with 0% platform cuts on direct UPI payments.
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '30px' }}>
                {[
                  '⚡ 0% Platform Commission on Direct UPI (GPay, PhonePe, Paytm, CRED, BHIM)',
                  '📦 Unlimited Digital & Physical Product Listings',
                  '⚡ Instant File & Template Download Delivery',
                  '🌐 Free Custom Storefront Link (profitupx.com/yourname)',
                  '🛡️ SafePay Escrow Buffer Protection (48-hr dispute holding)',
                  '🏦 Automated Bank Account / UPI Payout Settlements',
                  '🤖 Standard AI Store Assistant (24/7 product Q&A)',
                  '💳 Direct Cashfree Gateway Integration for Cards & Net Banking (5% fee)',
                  '✉️ Standard Support via Email & Ticket'
                ].map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#334155' }}>
                    <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/auth/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                border: '1px solid #cbd5e1',
                transition: 'all 0.2s'
              }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* TIER 2: PRO AI & WHATSAPP AUTOMATION (HIGHLIGHTED IN THEME STYLE) */}
          <div style={{ 
            background: '#0f172a', 
            color: '#ffffff',
            borderRadius: '24px', 
            padding: '36px 30px', 
            border: '2px solid #0f172a', 
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {/* Top Banner Tag */}
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#c8f135', color: '#070a12', padding: '4px 16px', borderRadius: '100px', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <Zap size={13} /> Most Popular • Full AI Autopilot
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Pro AI & WhatsApp
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '3px 10px', borderRadius: '100px' }}>
                  SPECIAL 0 ₹ LAUNCH OFFER
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '3.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}>₹499</span>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 600 }}>/ month</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, textDecoration: 'line-through' }}>₹1,999</span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '24px' }}>
                For scaling creators & D2C brands who want 24/7 automated WhatsApp sales, multilingual voice AI, and fast-track escrow settlements.
              </p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '30px' }}>
                {[
                  '⚡ 0% Platform Commission on all Direct UPI orders',
                  '💬 24/7 Automated WhatsApp AI Sales Agent (Auto-DM Replies & Closings)',
                  '🛒 WhatsApp Abandoned Cart Auto-Recovery (+35% more sales)',
                  '📄 Automated WhatsApp PDF Receipts & Courier Tracking alerts',
                  '🎙️ Multilingual AI Voice Copilot (Tamil, Hindi & English Store Voice)',
                  '🛡️ 30-40-30 Custom Milestone Escrow for High-Ticket Orders & Advance Bookings',
                  '⚡ 24-Hour Fast-Track Escrow Settlements to Bank/UPI',
                  '🎧 24*7 Dedicated Priority VIP Support (WhatsApp, Phone & Live Chat)',
                  '🏷️ Custom Domain Mapping (yourbrand.com)',
                  '📈 Advanced Real-Time Conversion & Traffic Analytics'
                ].map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#e2e8f0', fontWeight: feat.includes('WhatsApp') || feat.includes('Voice') || feat.includes('Escrow') || feat.includes('24*7') ? 700 : 500 }}>
                    <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/auth/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px 20px',
                backgroundColor: '#38bdf8',
                color: '#0f172a',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <span>Start Pro AI Free Today ⚡</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* TIER 3: ENTERPRISE & HIGH VOLUME */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '36px 30px', border: '1.5px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Enterprise & Scale
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#f0f9ff', color: '#0284c7', padding: '3px 10px', borderRadius: '100px' }}>
                  BESPOKE
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Custom</span>
                <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>/ volume</span>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '24px' }}>
                For high-volume creators, influencer agencies, multi-seller brands and enterprise merchants needing bespoke integrations.
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '30px' }}>
                {[
                  '⚡ 0% Platform Commission with Custom Cashfree Enterprise Gateway Routing',
                  '💬 Official WhatsApp Business API (Green Tick) Direct Integration',
                  '🛡️ Dedicated Custom Escrow Ledgers & Custom Milestone Schedules',
                  '⚡ Same-Day Instant Escrow Settlements',
                  '🎧 Dedicated 24*7 VIP Account Manager & Direct Phone Line',
                  '🏢 Multi-Seller Marketplace Management & Multi-Admin Staff Roles',
                  '🔒 Custom Legal SLA, Security Audits & Dedicated Webhooks',
                  '🤝 1-on-1 Store Optimization & Conversion Consultation'
                ].map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#334155' }}>
                    <CheckCircle2 size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                border: '1px solid #cbd5e1',
                transition: 'all 0.2s'
              }}
            >
              <span>Contact Enterprise Team</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>

        {/* 5 CORE PILLARS FEATURE DEEP-DIVE GRID (LIGHT THEME) */}
        <div style={{ marginTop: '40px', marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Why Indian Creators Choose ProfitupX
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#0a0a0a', marginTop: '6px', letterSpacing: '-0.03em' }}>
              Everything Built to Boost Your Sales & Profit
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '650px', margin: '0 auto', marginTop: '8px' }}>
              We combined the power of AI, WhatsApp, Escrow, and 0% Commission into a single unified platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            
            {/* PILLAR 1: 0% COMMISSION */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '28px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#ecfdf5', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Coins size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>0% Platform Commission</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                Keep 100% of your earnings when customers pay via Direct UPI (Google Pay, PhonePe, Paytm, CRED, BHIM). Stop paying 10-15% platform taxes to international tools.
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                <GooglePayLogo size={24} />
                <PhonePeLogo size={24} />
                <PaytmLogo size={24} />
                <CredLogo size={24} />
                <BhimUpiLogo size={24} />
              </div>
            </div>

            {/* PILLAR 2: WHATSAPP AI AUTOMATION */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '28px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>WhatsApp AI 24/7 Autopilot</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                Automate your store on WhatsApp. AI handles customer questions, recovers abandoned checkouts with personalized links, and sends instant digital download links and courier tracking receipts.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡ +35% Average Conversion Uplift</span>
              </div>
            </div>

            {/* PILLAR 3: MULTILINGUAL VOICE AI COPILOT */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '28px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Multilingual Voice AI Store Assistant</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                India&apos;s first creator platform with real-time Tamil, Hindi, and English voice AI. Your store visitors can speak directly to your store, ask about product features, sizes, delivery time, and get instant voice answers.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>
                <span>🎙️ Tamil • Hindi • English Real-Time Voice</span>
              </div>
            </div>

            {/* PILLAR 4: SAFEPAY & 30-40-30 ESCROW */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '28px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>SafePay & Milestone Escrow</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                Zero dispute friction and zero chargeback scams. Funds are held in a secure escrow buffer. For custom orders, pay in 3 stages: 30% Advance (Materials) → 40% WIP (Photo Review) → 30% Final Delivery.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700 }}>
                <span>🛡️ 48-Hour Buyer Protection Buffer</span>
              </div>
            </div>

            {/* PILLAR 5: 24*7 DEDICATED SUPPORT */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '28px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Headphones size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>24*7 Dedicated Priority Support</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                Never wait for assistance. Our support team is available 24 hours a day, 7 days a week via WhatsApp, live chat, phone helpline (+91 8098824262), and email for both you and your buyers.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#9333ea', fontWeight: 700 }}>
                <span>📞 Direct Phone & WhatsApp Support Line</span>
              </div>
            </div>

            {/* PILLAR 6: FAST PAYOUTS & CASHFREE */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '28px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Instant Settlements & Cashfree Gateway</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                Accept Debit/Credit Cards, Net Banking, and UPI internationally and domestically via Cashfree Payments. Automated settlements straight into your Indian Bank Account or UPI VPA.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>
                <span>⚡ RBI Regulated & PCI-DSS Compliant</span>
              </div>
            </div>

          </div>
        </div>

        {/* COMPARISON SAVINGS TABLE (LIGHT THEME) */}
        <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '36px', border: '1.5px solid #e2e8f0', marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
              How Much You Save on ProfitupX
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Compare our 0% Direct UPI plan against standard creator platforms on ₹1,00,000 monthly sales:
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Platform</th>
                  <th style={{ padding: '12px 16px' }}>Monthly Platform Fee</th>
                  <th style={{ padding: '12px 16px' }}>Commission per Sale</th>
                  <th style={{ padding: '12px 16px' }}>WhatsApp & Voice AI</th>
                  <th style={{ padding: '12px 16px' }}>You Take Home (on ₹1 Lakh)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f0fdf4', fontWeight: 800 }}>
                  <td style={{ padding: '16px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} /> ProfitupX (Direct UPI)
                  </td>
                  <td style={{ padding: '16px', color: '#166534' }}>₹0 / mo</td>
                  <td style={{ padding: '16px', color: '#166534' }}>0% Commission</td>
                  <td style={{ padding: '16px', color: '#166534' }}>Included 24/7 AI</td>
                  <td style={{ padding: '16px', color: '#166534', fontSize: '1.1rem' }}>₹1,00,000 (100%)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#334155' }}>
                  <td style={{ padding: '16px', fontWeight: 700 }}>Gumroad</td>
                  <td style={{ padding: '16px' }}>₹0</td>
                  <td style={{ padding: '16px', color: '#dc2626' }}>10% + gateway fee</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>No WhatsApp / No Voice</td>
                  <td style={{ padding: '16px', color: '#dc2626' }}>₹87,000 (~13% lost)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#334155' }}>
                  <td style={{ padding: '16px', fontWeight: 700 }}>Shopify</td>
                  <td style={{ padding: '16px' }}>₹1,999 / mo + Apps</td>
                  <td style={{ padding: '16px', color: '#dc2626' }}>2% + PG fees</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>Extra Paid Plugins</td>
                  <td style={{ padding: '16px', color: '#dc2626' }}>₹92,000 (Fees + Sub)</td>
                </tr>
                <tr style={{ color: '#334155' }}>
                  <td style={{ padding: '16px', fontWeight: 700 }}>Instamojo</td>
                  <td style={{ padding: '16px' }}>₹0</td>
                  <td style={{ padding: '16px', color: '#dc2626' }}>5% + ₹3 per order</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>No AI Copilot</td>
                  <td style={{ padding: '16px', color: '#dc2626' }}>₹94,000 (~6% lost)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div style={{ maxWidth: '850px', margin: '0 auto 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Got Questions?
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0a0a0a', marginTop: '6px', letterSpacing: '-0.03em' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'How does 0% Platform Commission work?',
                a: 'When your customers pay directly via UPI apps (Google Pay, PhonePe, Paytm, CRED, BHIM), 100% of the funds go directly into your verified bank account or escrow ledger with 0% platform deductions. For card and net-banking transactions processed through Cashfree, standard gateway charges apply.'
              },
              {
                q: 'How does WhatsApp AI 24/7 Automation work?',
                a: 'Once integrated, our WhatsApp AI bot acts as your 24/7 sales agent. It answers customer inquiries about your products, sends payment links, automatically follows up on abandoned checkouts, and dispatches invoice PDFs and live courier tracking numbers directly to the customer’s WhatsApp.'
              },
              {
                q: 'What is SafePay Escrow & 30-40-30 Milestone Settlement?',
                a: 'Escrow protects both you and your buyers. For standard digital and physical orders, funds are safely held in a 48-hour buyer protection buffer before release to your bank. For high-ticket custom made-to-order items (₹10,000+), funds are released in 3 milestone stages: 30% upfront for raw materials, 40% on work-in-progress photo proof, and 30% on unboxing delivery.'
              },
              {
                q: 'In what languages does the Voice AI Copilot operate?',
                a: 'Our real-time AI Voice Copilot supports Tamil, Hindi, and Indian English. Customers browsing your store on mobile can tap the voice button to speak naturally, ask questions regarding size, delivery times, or customization, and receive instantaneous multilingual audio answers.'
              },
              {
                q: 'How do I reach the 24*7 Support Team?',
                a: 'You can contact our support team at any time via WhatsApp (+91 8098824262), direct phone call (+91 8098824262), live dashboard chat, or email (ganeshdon5555@gmail.com). We guarantee rapid response times.'
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                onClick={() => toggleFaq(idx)}
                style={{ 
                  backgroundColor: openFaq === idx ? '#f8fafc' : '#ffffff', 
                  borderRadius: '16px', 
                  border: '1.5px solid #e2e8f0', 
                  padding: '20px 24px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: openFaq === idx ? '#0284c7' : '#0a0a0a', margin: 0 }}>
                    {faq.q}
                  </h4>
                  {openFaq === idx ? <ChevronUp size={18} color="#0284c7" /> : <ChevronDown size={18} color="#64748b" />}
                </div>
                {openFaq === idx && (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '12px', marginBottom: 0 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA BANNER (THEME MATCHED) */}
        <div style={{
          background: '#0a0a0a',
          color: '#ffffff',
          borderRadius: '28px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          marginBottom: '50px'
        }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            Ready to Launch Your AI-Powered Store?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.5 }}>
            Join hundreds of Indian creators selling digital products, services & merchandise with 0% commission and 24/7 WhatsApp automation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              href="/auth/login"
              style={{
                padding: '16px 32px',
                borderRadius: '100px',
                backgroundColor: '#c8f135',
                color: '#070a12',
                fontWeight: 900,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(200,241,53,0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Create Your Store in 60 Seconds 🚀</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              style={{
                padding: '16px 28px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              Talk to 24*7 Support
            </Link>
          </div>
        </div>

        {/* LEGAL ENTITY COMPLIANCE NOTICE FOR CASHFREE (MATCHED) */}
        <div style={{
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '18px',
          border: '1.5px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '0.84rem',
          color: '#64748b',
          lineHeight: 1.7
        }}>
          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#16a34a" /> Merchant & Regulatory Compliance Details
          </div>
          <div>
            <strong>Legal Operator:</strong> PANDI GANESH BABU &nbsp;|&nbsp; 
            <strong>Trade Name:</strong> ProfitupX (https://profitupx.com) &nbsp;|&nbsp; 
            <strong>Email:</strong> ganeshdon5555@gmail.com &nbsp;|&nbsp; 
            <strong>24*7 Helpline:</strong> +91 8098824262
          </div>
          <div>
            <strong>Registered Address:</strong> KPT Nagar, Ayyampalayam, Dindigul, Tamil Nadu - 624601, India
          </div>
        </div>

      </div>
    </div>
  );
}
