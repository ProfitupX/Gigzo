import HeaderNav from '@/components/HeaderNav';

export const metadata = {
  title: 'Shipping & Delivery Policy | ProfitupX',
  description: 'Shipping and delivery policy for orders placed on ProfitupX platform operated by PANDI GANESH BABU.',
};

export default function ShippingPage() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#111', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Universal Website Navbar */}
      <HeaderNav />

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '50px 24px 80px' }}>
        
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '16px', color: '#000' }}>Shipping & Delivery Policy</h1>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '32px' }}>Last updated: September 10, 2026</p>

        {/* Legal Merchant Notice Box */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
            <ShieldCheck size={20} color="#0284c7" /> Legal Entity & Merchant Details
          </div>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
            This Platform (<strong>ProfitupX</strong> - https://profitupx.com) is owned and operated by <strong>PANDI GANESH BABU</strong> (hereinafter referred to as &quot;Platform Owner&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '8px', fontSize: '0.88rem', color: '#334155' }}>
            <div><strong>Legal Entity Name:</strong> PANDI GANESH BABU</div>
            <div><strong>Trade Name:</strong> ProfitupX</div>
            <div><strong>Support Email:</strong> ganeshdon5555@gmail.com</div>
            <div><strong>Support Phone:</strong> +91 8098824262</div>
            <div style={{ gridColumn: '1 / -1' }}><strong>Registered Address:</strong> KPT Nagar, Ayyampalayam, Dindigul, Tamil Nadu - 624601, India</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '0.95rem', lineHeight: 1.8, color: '#333' }}>
          
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '10px', color: '#000' }}>1. Digital Goods & Services Delivery</h2>
          <p>For all digital products (such as eBooks, courses, software tools, design templates, and downloadable assets) sold on ProfitupX:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><strong>Instant Delivery:</strong> Access links and download files are delivered <strong>immediately upon successful payment</strong> on the order confirmation screen (`/order/[order_id]`).</li>
            <li><strong>Email Dispatch:</strong> An automated confirmation email with access links and tax invoice is dispatched to the buyer&apos;s registered email address within <strong>5 minutes</strong> of transaction completion.</li>
            <li><strong>24/7 Access:</strong> Buyers can re-download their purchased digital products at any time through their verified order link.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>2. Physical Goods Shipping & Timelines</h2>
          <p>For physical merchandise, custom goods, or packaged items shipped across India:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><strong>Dispatch Time:</strong> Orders are verified and dispatched within <strong>1 to 2 business days</strong> from the date of payment confirmation.</li>
            <li><strong>Courier Partners:</strong> Physical orders are shipped through registered domestic courier companies (e.g., Delhivery, BlueDart, DTDC) and/or Speed Post only.</li>
            <li><strong>Estimated Delivery Timeline:</strong> Standard delivery time across India is <strong>3 to 7 business days</strong> depending on the destination pincode and regional logistics conditions.</li>
            <li><strong>Tracking:</strong> Once dispatched, a live courier tracking number and link are sent via SMS / Email to the customer.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>3. Shipping Charges & Taxes</h2>
          <p>Shipping charges (if any) are clearly displayed during checkout prior to payment initiation. Standard digital delivery is free of shipping charges.</p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>4. Delivery Address & Issues</h2>
          <p>Delivery will be made to the shipping address specified by the buyer at the time of purchase. Platform Owner shall not be liable for delivery delays caused by incorrect addresses or force majeure events. If your package is delayed, damaged in transit, or undelivered, please contact our support desk immediately.</p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>5. Shipping Support & Escalations</h2>
          <p>For any questions regarding order delivery or tracking status, please contact us at:</p>
          
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <strong>Legal Name:</strong> PANDI GANESH BABU<br />
            <strong>Brand / Trade Name:</strong> ProfitupX<br />
            <strong>Support Email:</strong> ganeshdon5555@gmail.com<br />
            <strong>Helpline / Phone:</strong> +91 8098824262<br />
            <strong>Operating Address:</strong> KPT Nagar, Ayyampalayam, Dindigul, Tamil Nadu - 624601, India<br />
            <strong>Operating Hours:</strong> Monday – Saturday (9:00 AM to 6:00 PM IST)
          </div>
        </div>
      </div>
    </div>
  );
}
