import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Heart, Sparkles, Building, Rocket, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Us | ProfitupX',
  description: 'About ProfitupX - India fastest link-in-bio commerce platform operated by PANDI GANESH BABU.',
};

export default function AboutPage() {
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
            <Link href="/about" style={{ color: '#000', fontWeight: 800, textDecoration: 'none' }}>About</Link>
            <Link href="/pricing" style={{ color: '#555', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/contact" style={{ color: '#555', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '50px 24px 80px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '32px', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '16px', color: '#000' }}>
          About ProfitupX
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '36px', lineHeight: 1.6 }}>
          Empowering Indian creators, coaches, and digital entrepreneurs to launch high-converting storefronts with instant UPI checkouts in under 2 minutes.
        </p>

        {/* Legal Entity Card */}
        <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>
            <ShieldCheck size={20} color="#0284c7" /> Legal Business Operator
          </div>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
            <strong>ProfitupX</strong> (https://profitupx.com) is founded and legally operated by <strong>PANDI GANESH BABU</strong>, headquartered in Dindigul, Tamil Nadu, India.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '16px', fontSize: '0.88rem', color: '#334155' }}>
            <div><strong>Founder / Legal Name:</strong> PANDI GANESH BABU</div>
            <div><strong>Trade Name:</strong> ProfitupX</div>
            <div><strong>Official Email:</strong> ganeshdon5555@gmail.com</div>
            <div><strong>Helpline:</strong> +91 8098824262</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '0.98rem', lineHeight: 1.8, color: '#334155' }}>
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Our Mission</h2>
            <p>
              Millions of Indian Instagram creators and educators have high-value skills and audiences but struggle with complex ecommerce tools, coding barriers, and high upfront software costs. ProfitupX was built to solve this problem by offering a zero-friction, mobile-first storefront that accepts instant UPI payments directly to Indian bank accounts.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>What We Provide</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '12px' }}>
              <div style={{ padding: '18px', background: '#fafafa', border: '1px solid #eaeaea', borderRadius: '14px' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>⚡ 1-Tap UPI Checkouts</div>
                <div style={{ fontSize: '0.88rem', color: '#64748b' }}>Seamless GPay, PhonePe, Paytm, and BHIM UPI integration with zero drop-offs.</div>
              </div>
              <div style={{ padding: '18px', background: '#fafafa', border: '1px solid #eaeaea', borderRadius: '14px' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>🛡️ Automated Escrow Protection</div>
                <div style={{ fontSize: '0.88rem', color: '#64748b' }}>Safe, compliant payout settlements via RBI-regulated payment gateways (Cashfree).</div>
              </div>
              <div style={{ padding: '18px', background: '#fafafa', border: '1px solid #eaeaea', borderRadius: '14px' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>🤖 Multilingual AI Copilot</div>
                <div style={{ fontSize: '0.88rem', color: '#64748b' }}>24/7 Voice AI Assistant supporting Tamil, Hindi, and Indian English for instant setup.</div>
              </div>
            </div>
          </section>

          <section style={{ borderTop: '1px solid #eaeaea', paddingTop: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Contact & Address</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
              <strong>Proprietorship:</strong> PANDI GANESH BABU<br />
              <strong>Address:</strong> KPT Nagar, Ayyampalayam, Dindigul, Tamil Nadu - 624601, India<br />
              <strong>Email:</strong> ganeshdon5555@gmail.com | <strong>Phone:</strong> +91 8098824262
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
