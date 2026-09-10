import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
  title: 'Pricing & Plans | ProfitupX',
  description: 'Transparent pricing with 0 monthly subscription for creators on ProfitupX platform operated by PANDI GANESH BABU.',
};

export default function PricingPage() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#111', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Header Nav */}
      <header style={{ borderBottom: '1px solid #eaeaea', padding: '16px 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/icon.png" alt="ProfitupX" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#000', letterSpacing: '-0.5px' }}>ProfitupX</span>
          </Link>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.88rem', fontWeight: 600 }}>
            <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
            <Link href="/about" style={{ color: '#555', textDecoration: 'none' }}>About</Link>
            <Link href="/pricing" style={{ color: '#000', fontWeight: 800, textDecoration: 'none' }}>Pricing</Link>
            <Link href="/contact" style={{ color: '#555', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '50px 24px 80px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '32px', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '100px', background: '#ecfdf5', color: '#059669', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Zero Risk • Pay As You Earn
          </span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#000', marginBottom: '12px' }}>
            Simple & Transparent Pricing
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.6 }}>
            No monthly subscription. No hidden hosting fees. You only pay when you make a sale.
          </p>
        </div>

        {/* Pricing Card */}
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#0f172a', color: '#fff', borderRadius: '28px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1.5px solid #1e293b', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Creator Standard Plan
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '8px' }}>
            ₹0 <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8' }}>/ month</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '28px' }}>
            5% platform fee per successful order + standard payment gateway processing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', marginBottom: '32px' }}>
            {[
              'Unlimited digital & physical product listings',
              'Direct UPI, Cards & Net Banking checkouts via Cashfree',
              'Instant download delivery & automated order tracking',
              'Custom link-in-bio storefront (`profitupx.com/yourname`)',
              '48-hour automated escrow settlements to Indian Bank / UPI',
              '24/7 AI Multilingual Voice Store Copilot (Tamil / Hindi / English)',
              'Zero setup fees & no lock-in contract'
            ].map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                <CheckCircle2 size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Link
            href="/auth/login"
            style={{ display: 'block', padding: '16px 24px', background: '#38bdf8', color: '#0f172a', borderRadius: '14px', fontWeight: 900, fontSize: '1rem', textDecoration: 'none', transition: 'background 0.2s', boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)' }}
          >
            Start Selling Free 🚀
          </Link>
        </div>

        {/* Legal Entity Notice */}
        <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          <strong>Operated by:</strong> PANDI GANESH BABU | <strong>Brand:</strong> ProfitupX | <strong>Email:</strong> ganeshdon5555@gmail.com | <strong>Helpline:</strong> +91 8098824262
        </div>
      </div>
    </div>
  );
}
