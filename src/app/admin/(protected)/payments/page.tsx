'use client';

import { useEffect, useState } from 'react';
import { Search, IndianRupee, CheckCircle2, Clock, Send } from 'lucide-react';

interface Creator {
  id: string;
  brand_name: string;
  upi_id: string | null;
  revenue: number; // Total Sales (Paid orders)
  paid_out: number; // Total payouts recorded
}

export default function AdminPaymentsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchStats = () => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setCreators(d.creators || []); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRecordPayout = async (sellerId: string, sellerName: string, pendingAmount: number, upiId: string | null) => {
    if (pendingAmount <= 0) {
      alert('No pending balance to pay.');
      return;
    }

    const amountStr = window.prompt(`Record payout for ${sellerName}\n\nPending Balance: ₹${pendingAmount}\nSeller UPI: ${upiId || 'Not provided'}\n\nEnter the amount you sent:`, String(pendingAmount));
    if (!amountStr) return;
    
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    const utr = window.prompt(`(Optional) Enter the UTR / Transaction Reference Number:`, '');

    setPayingId(sellerId);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record_payout', id: sellerId, amount, utr }),
      });
      if (res.ok) {
        // Optimistically update
        setCreators(prev => prev.map(c => 
          c.id === sellerId ? { ...c, paid_out: c.paid_out + amount } : c
        ));
        alert('Payout recorded successfully!');
      } else {
        alert('Failed to record payout.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
    setPayingId(null);
  };

  const filtered = creators.filter(c => c.brand_name?.toLowerCase().includes(search.toLowerCase()));

  // Calculations
  const totalPlatformSales = creators.reduce((sum, c) => sum + c.revenue, 0);
  const totalCommission = totalPlatformSales * 0.05;
  const totalSellerNet = totalPlatformSales * 0.95;
  const totalPaidOut = creators.reduce((sum, c) => sum + c.paid_out, 0);
  const totalPending = totalSellerNet - totalPaidOut;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', margin: '0 0 6px' }}>Payments & Payouts</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>Track seller earnings, platform commission (5%), and record payouts.</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Total Sales', value: `₹${totalPlatformSales.toLocaleString('en-IN')}`, color: '#0a0a0a' },
          { label: 'Platform Comm (5%)', value: `₹${Math.round(totalCommission).toLocaleString('en-IN')}`, color: '#4f46e5' },
          { label: 'Net Seller Due (95%)', value: `₹${Math.round(totalSellerNet).toLocaleString('en-IN')}`, color: '#0a0a0a' },
          { label: 'Total Paid Out', value: `₹${Math.round(totalPaidOut).toLocaleString('en-IN')}`, color: '#16a34a' },
          { label: 'Total Pending', value: `₹${Math.round(totalPending).toLocaleString('en-IN')}`, color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{s.label}</p>
            <p style={{ color: s.color, fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search seller..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px 12px 42px',
            backgroundColor: '#ffffff', border: '1px solid var(--border)',
            borderRadius: '12px', color: '#0a0a0a', fontSize: '0.9rem',
            outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = '#c8f135'; e.target.style.boxShadow = '0 0 0 3px rgba(200,241,53,0.2)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
        />
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1.5fr) minmax(180px, 1.5fr) 100px 100px 100px 100px 140px', gap: '16px', padding: '16px 24px', backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          {['Seller', 'UPI ID', 'Total Sales', 'Net (95%)', 'Paid Out', 'Pending', 'Action'].map(h => (
            <span key={h} style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.9rem', fontWeight: 500 }}>No sellers found.</p>}

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '950px' }}>
            {filtered.map(seller => {
              const netEarnings = seller.revenue * 0.95;
              const pending = netEarnings - seller.paid_out;
              
              return (
                <div key={seller.id}
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1.5fr) minmax(180px, 1.5fr) 100px 100px 100px 100px 140px', gap: '16px', padding: '16px 24px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s', alignItems: 'center' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seller.brand_name}</span>
                  <span style={{ color: seller.upi_id ? '#0a0a0a' : 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {seller.upi_id || 'Not provided'}
                  </span>
                  
                  <span style={{ color: '#0a0a0a', fontWeight: 600, fontSize: '0.9rem' }}>₹{Math.round(seller.revenue).toLocaleString('en-IN')}</span>
                  <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.9rem' }}>₹{Math.round(netEarnings).toLocaleString('en-IN')}</span>
                  <span style={{ color: '#0a0a0a', fontWeight: 600, fontSize: '0.9rem' }}>₹{Math.round(seller.paid_out).toLocaleString('en-IN')}</span>
                  <span style={{ color: pending > 0 ? '#dc2626' : '#16a34a', fontWeight: 800, fontSize: '0.9rem' }}>
                    ₹{Math.round(pending).toLocaleString('en-IN')}
                  </span>
                  
                  {/* Actions */}
                  <div>
                    {pending > 0 ? (
                      <button
                        onClick={() => handleRecordPayout(seller.id, seller.brand_name, Math.round(pending), seller.upi_id)}
                        disabled={payingId === seller.id}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 12px', color: '#ffffff', backgroundColor: '#0a0a0a', border: 'none', borderRadius: '8px', cursor: payingId === seller.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: payingId === seller.id ? 0.7 : 1, fontSize: '0.75rem', fontWeight: 700 }}
                        title="Mark as Paid"
                      >
                        {payingId === seller.id ? (
                          <div style={{ width: 14, height: 14, border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <>
                            <Send size={14} />
                            Pay Now
                          </>
                        )}
                      </button>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', padding: '6px 12px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
                        <CheckCircle2 size={14} />
                        All Settled
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
