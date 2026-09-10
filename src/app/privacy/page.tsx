import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin, Building } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | ProfitupX',
  description: 'Privacy policy for using ProfitupX platform operated by PANDI GANESH BABU.',
};

export default function PrivacyPage() {
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
            <Link href="/pricing" style={{ color: '#555', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/contact" style={{ color: '#555', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '50px 24px 80px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '32px', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '16px', color: '#000' }}>Privacy Policy</h1>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '32px' }}>Last updated: September 10, 2026</p>

        {/* Legal Merchant Notice Box */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
            <ShieldCheck size={20} color="#0284c7" /> Legal Entity & Platform Operator
          </div>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
            This Platform (<strong>ProfitupX</strong> - https://profitupx.com) is owned and operated by <strong>PANDI GANESH BABU</strong> (hereinafter referred to as &quot;Platform Owner&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '8px', fontSize: '0.88rem', color: '#334155' }}>
            <div><strong>Legal Entity Name:</strong> PANDI GANESH BABU</div>
            <div><strong>Trade Name:</strong> ProfitupX</div>
            <div><strong>Email:</strong> ganeshdon5555@gmail.com</div>
            <div><strong>Contact Number:</strong> +91 8098824262</div>
            <div style={{ gridColumn: '1 / -1' }}><strong>Registered Address:</strong> KPT Nagar, Ayyampalayam, Dindigul, Tamil Nadu - 624601, India</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '0.95rem', lineHeight: 1.8, color: '#333' }}>
          
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>1. Introduction</h2>
          <p>This Privacy Policy describes how <strong>PANDI GANESH BABU</strong> operating under the brand name <strong>ProfitupX</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, uses, shares, protects, or otherwise processes your personal data through our website https://profitupx.com (hereinafter referred to as &apos;Platform&apos;). We are committed to protecting your privacy in accordance with applicable Indian laws, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>2. Information We Collect</h2>
          <p>When you register, create a store, or purchase items through ProfitupX, we collect the following types of information:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><strong>Personal Contact Data:</strong> Name, email address, mobile/phone number, billing and shipping address.</li>
            <li><strong>Payment & Settlement Data:</strong> UPI VPA, bank account details for seller payouts (processed securely via RBI-licensed aggregators such as Cashfree).</li>
            <li><strong>Transaction Records:</strong> Order amounts, timestamps, product purchases, and invoice records.</li>
            <li><strong>Device & Analytics:</strong> IP address, browser type, operating system, and interaction telemetry.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>3. How We Use Your Information</h2>
          <p>We use your personal data to:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>Enable online transactions, UPI checkouts, and creator store functionality.</li>
            <li>Facilitate instant digital order dispatch and physical product shipment updates.</li>
            <li>Process automated seller payouts and maintain escrow compliance.</li>
            <li>Detect, prevent, and intercept fraudulent payments, chargebacks, and scam activities.</li>
            <li>Provide customer support and resolve order disputes.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>4. Data Security & Storage</h2>
          <p>All sensitive information is encrypted in transit using industry-standard SSL/TLS (HTTPS) encryption. Database connections and authentication are secured using Supabase PostgreSQL with strict Row-Level Security (RLS) policies. Payment transactions are processed directly through PCI-DSS Level 1 compliant gateway partners (Cashfree Payments).</p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>5. Grievance Officer & Contact Details</h2>
          <p>In accordance with Information Technology Act 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:</p>
          
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <strong>Grievance Officer Name:</strong> PANDI GANESH BABU<br />
            <strong>Company / Trade Name:</strong> ProfitupX<br />
            <strong>Designation:</strong> Proprietor / Platform Administrator<br />
            <strong>Email:</strong> ganeshdon5555@gmail.com<br />
            <strong>Phone / Mobile:</strong> +91 8098824262<br />
            <strong>Address:</strong> KPT Nagar, Ayyampalayam, Dindigul, Tamil Nadu - 624601, India<br />
            <strong>Working Hours:</strong> Monday – Saturday, 9:00 AM to 6:00 PM IST
          </div>
        </div>
      </div>
    </div>
  );
}
