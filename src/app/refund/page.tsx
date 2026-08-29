import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | ProfitupX',
  description: 'Refund, return, and cancellation policy for using ProfitupX platform.',
};

export default function RefundPage() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#111', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '40px', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '40px' }}>Refund & Cancellation Policy</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem', lineHeight: 1.8, color: '#333' }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '20px' }}>Cancellation Policy</h2>
          <p>This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this policy:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>Cancellations will only be considered if the request is made 1 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.</li>
            <li>Profitupx does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.</li>
            <li>In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 1 days of receipt of products.</li>
            <li>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 1 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.</li>
            <li>In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.</li>
            <li>In case of any refunds approved by Profitupx, it will take 1 days for the refund to be processed to you.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '40px' }}>Return Policy</h2>
          <p>We offer refund / exchange within first 1 days from the date of your purchase. If 1 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind.</p>
          <p>In order to become eligible for a return or an exchange:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>The purchased item should be unused and in the same condition as you received it.</li>
            <li>The item must have original packaging.</li>
            <li>If the item that you purchased on a sale, then the item may not be eligible for a return / exchange.</li>
          </ul>
          <p>Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.</p>
          <p>You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified to you at the item of purchase. For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further, if the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.</p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '40px' }}>Shipping Policy</h2>
          <p>The orders for the user are shipped through registered domestic courier companies and/or speed post only. Orders are shipped within 1 days from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms. Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority. Delivery of all orders will be made to the address provided by the buyer at the time of purchase. Delivery of our services will be confirmed on your email ID as specified at the time of registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.</p>
        </div>
      </div>
    </div>
  );
}
