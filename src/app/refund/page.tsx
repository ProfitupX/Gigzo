import HeaderNav from '@/components/HeaderNav';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | ProfitupX',
  description: 'Refund, return, and cancellation policy for using ProfitupX platform operated by PANDI GANESH BABU.',
};

export default function RefundPage() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#111', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Universal Website Navbar */}
      <HeaderNav />

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '50px 24px 80px' }}>
        
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '16px', color: '#000' }}>Refund & Cancellation Policy</h1>
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
          
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '10px', color: '#000' }}>1. Cancellation Policy</h2>
          <p>We understand that circumstances may change. Under this policy:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><strong>Digital Goods / Subscriptions:</strong> Cancellation requests for digital products, templates, or courses must be made within <strong>24 hours</strong> of purchase, provided the download link or access key has not been accessed or redeemed.</li>
            <li><strong>Physical Products:</strong> Cancellation requests can be made within <strong>24 hours</strong> of placing an order or prior to the merchant initiating dispatch/shipment. Once dispatched, orders cannot be cancelled mid-transit.</li>
            <li>To initiate a cancellation, email us at <strong>ganeshdon5555@gmail.com</strong> or raise a dispute via your Order Tracking page (`/order/[order_id]`) quoting your Order ID.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>2. Return & Replacement Policy</h2>
          <p>We offer return or replacement within <strong>7 days</strong> from the date of delivery under the following conditions:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>The item delivered is physically damaged, defective, or significantly different from the product description.</li>
            <li>The item must be in its original condition, unused, with all original tags and packaging intact.</li>
            <li>Damaged or missing items must be reported within <strong>48 hours</strong> of delivery along with photographic or video proof.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>3. Refund Process & Timelines</h2>
          <p>Once your return or cancellation request is received and approved by our support team:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><strong>Approval Time:</strong> Verification and approval are completed within <strong>24 to 48 hours</strong>.</li>
            <li><strong>Refund Settlement:</strong> Approved refunds are credited back to the original payment source (UPI ID, Debit/Credit Card, or Net Banking) via our payment gateway partner (Cashfree Payments).</li>
            <li><strong>Refund Credit Time:</strong> It typically takes <strong>5 to 7 business days</strong> for the refunded amount to reflect in your bank account, depending on your issuing bank.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', color: '#000' }}>4. Contact for Refunds & Disputes</h2>
          <p>For any refund requests, billing queries, or order issues, please reach out to our dedicated support desk:</p>
          
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <strong>Legal Name:</strong> PANDI GANESH BABU<br />
            <strong>Brand / Trade Name:</strong> ProfitupX<br />
            <strong>Support Email:</strong> ganeshdon5555@gmail.com<br />
            <strong>Support Helpline:</strong> +91 8098824262<br />
            <strong>Registered Address:</strong> KPT Nagar, Ayyampalayam, Dindigul, Tamil Nadu - 624601, India<br />
            <strong>Support Desk Hours:</strong> Monday – Saturday (9:00 AM to 6:00 PM IST)
          </div>
        </div>
      </div>
    </div>
  );
}
