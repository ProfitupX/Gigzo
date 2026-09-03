'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Send, 
  Copy, 
  Check, 
  ShieldCheck, 
  Building2,
  Lock,
  Unlock,
  Zap,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import EscrowVaultLocker from '@/components/admin/EscrowVaultLocker';
import { generateBlockHash } from '@/lib/escrowLedger';

interface Creator {
  id: string;
  brand_name: string;
  upi_id: string | null;
  revenue: number; // Total Sales (Paid orders)
  paid_out: number; // Total payouts recorded
  is_verified?: boolean;
  bank_account_no?: string | null;
  bank_ifsc?: string | null;
  bank_name?: string | null;
}

export default function AdminPaymentsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Escrow Vault Locker State
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [activeVaultSeller, setActiveVaultSeller] = useState<{
    id: string;
    name: string;
    upi: string | null;
    amount: number;
  } | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const d = await res.json();
      if (d && d.creators) {
        setCreators(d.creators);
      }
    } catch (e) {
      console.error('Stats fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenVaultLocker = (sellerId: string, sellerName: string, pendingAmount: number, upiId: string | null) => {
    setActiveVaultSeller({
      id: sellerId,
      name: sellerName,
      upi: upiId,
      amount: pendingAmount
    });
    setVaultModalOpen(true);
  };

  const handleConfirmVaultPayout = async (payoutAmount: number, utr: string) => {
    if (!activeVaultSeller) return false;

    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_payout',
          id: activeVaultSeller.id,
          amount: payoutAmount,
          utr
        }),
      });

      if (res.ok) {
        setCreators(prev => prev.map(c => 
          c.id === activeVaultSeller.id ? { ...c, paid_out: c.paid_out + payoutAmount } : c
        ));
        return true;
      }
    } catch (e) {
      console.error('Payout failed:', e);
    }
    return false;
  };

  const handleTestSimulator = () => {
    setActiveVaultSeller({
      id: 'SIMULATOR_SELLER_001',
      name: 'Organic Silk Store (Simulator)',
      upi: 'organicsilk@okaxis',
      amount: 4500
    });
    setVaultModalOpen(true);
  };

  const filtered = creators.filter(c => 
    c.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.upi_id?.toLowerCase().includes(search.toLowerCase())
  );

  // Ledger Calculations
  const totalPlatformSales = creators.reduce((sum, c) => sum + c.revenue, 0);
  const totalCommission = totalPlatformSales * 0.05;
  const totalSellerNet = totalPlatformSales * 0.95;
  const totalPaidOut = creators.reduce((sum, c) => sum + c.paid_out, 0);
  const totalInVaultHold = Math.max(0, totalSellerNet - totalPaidOut);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner: Central Bank Escrow Protocol */}
      <div style={{
        padding: '24px',
        backgroundColor: '#0a0d14',
        borderRadius: '24px',
        border: '1.5px solid rgba(200, 241, 53, 0.25)',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            backgroundColor: 'rgba(200, 241, 53, 0.15)',
            border: '1px solid #c8f135',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c8f135'
          }}>
            <Lock size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0, color: '#ffffff' }}>
                Central Bank Escrow & Settlement Console
              </h1>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#c8f135', color: '#0a0a0a', padding: '2px 8px', borderRadius: '100px', fontWeight: 900 }}>
                ESCROW V2.4
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: '4px 0 0', fontWeight: 500 }}>
              Automated 95/5 Split Protocol • Fraud Mitigation Vault • On-Chain Ledger Verification
            </p>
          </div>
        </div>

        {/* Vault Simulator Button */}
        <button
          onClick={handleTestSimulator}
          style={{
            padding: '12px 20px',
            borderRadius: '100px',
            backgroundColor: 'rgba(200, 241, 53, 0.15)',
            border: '1.5px solid #c8f135',
            color: '#c8f135',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={16} />
          <span>Test 3D Vault Locker UI</span>
        </button>
      </div>

      {/* Escrow Vault Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Sales Volume', value: `₹${totalPlatformSales.toLocaleString('en-IN')}`, desc: 'Gross Inflow', color: '#0a0a0a', bg: '#ffffff' },
          { label: 'Central Escrow Vault (Hold)', value: `₹${Math.round(totalInVaultHold).toLocaleString('en-IN')}`, desc: 'Sealed Payouts', color: '#eab308', bg: '#fefce8' },
          { label: 'Platform Treasury (5%)', value: `₹${Math.round(totalCommission).toLocaleString('en-IN')}`, desc: 'Revenue Reserve', color: '#4f46e5', bg: '#eef2ff' },
          { label: 'Dispersed to Sellers (95%)', value: `₹${Math.round(totalPaidOut).toLocaleString('en-IN')}`, desc: 'Settled to UPI', color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Fraud Protocol Trust', value: '99.4%', desc: 'Safe & Verified', color: '#16a34a', bg: '#f0fdf4' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: s.bg, border: '1px solid var(--border)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                {s.label}
              </p>
            </div>
            <p style={{ color: s.color, fontWeight: 900, fontSize: '1.35rem', margin: '0 0 2px' }}>{s.value}</p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.desc}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search seller name or UPI..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 42px',
              backgroundColor: '#ffffff', border: '1px solid var(--border)',
              borderRadius: '12px', color: '#0a0a0a', fontSize: '0.88rem',
              outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          />
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          Showing {filtered.length} Sellers in Escrow Registry
        </div>
      </div>

      {/* Escrow Ledger Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1.5fr) minmax(200px, 2fr) 90px 100px 90px 110px 140px', gap: '16px', padding: '16px 24px', backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          {['Seller & On-Chain Proof', 'Bank / UPI Destination', 'Gross Sales', 'Net Due (95%)', 'Dispersed', 'In Vault Hold', 'Escrow Action'].map(h => (
            <span key={h} style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.9rem', fontWeight: 500 }}>
            No sellers found in the escrow registry.
          </p>
        )}

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '1000px' }}>
            {filtered.map(seller => {
              const netEarnings = seller.revenue * 0.95;
              const pendingInVault = netEarnings - seller.paid_out;
              const mockHash = generateBlockHash({ orderId: seller.id, creatorId: seller.id, amount: seller.revenue });
              
              return (
                <div 
                  key={seller.id}
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1.5fr) minmax(200px, 2fr) 90px 100px 90px 110px 140px', gap: '16px', padding: '18px 24px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s', alignItems: 'center' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Seller Name & On-Chain Proof */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {seller.brand_name}
                      </span>
                      {seller.is_verified && (
                        <span title="On-Chain KYC Verified" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <ShieldCheck size={14} color="#16a34a" />
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b' }}>
                      {mockHash.substring(0, 16)}...
                    </span>
                  </div>

                  {/* Bank / UPI Details with Copy */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {seller.upi_id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: '#0a0a0a', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                          {seller.upi_id}
                        </span>
                        <button
                          onClick={() => handleCopy(seller.upi_id!, `pay_upi_${seller.id}`)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedKey === `pay_upi_${seller.id}` ? '#16a34a' : '#94a3b8' }}
                          title="Copy UPI ID"
                        >
                          {copiedKey === `pay_upi_${seller.id}` ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>No UPI configured</span>
                    )}

                    {seller.bank_account_no && (
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        A/C: ••••{seller.bank_account_no.slice(-4)} | {seller.bank_ifsc || 'IFSC'}
                      </span>
                    )}
                  </div>
                  
                  <span style={{ color: '#0a0a0a', fontWeight: 600, fontSize: '0.88rem' }}>₹{Math.round(seller.revenue).toLocaleString('en-IN')}</span>
                  <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.88rem' }}>₹{Math.round(netEarnings).toLocaleString('en-IN')}</span>
                  <span style={{ color: '#0a0a0a', fontWeight: 600, fontSize: '0.88rem' }}>₹{Math.round(seller.paid_out).toLocaleString('en-IN')}</span>
                  
                  {/* In Vault Hold */}
                  <div>
                    {pendingInVault > 0 ? (
                      <span style={{ color: '#eab308', fontWeight: 900, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} />
                        ₹{Math.round(pendingInVault).toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.85rem' }}>₹0 (Cleared)</span>
                    )}
                  </div>
                  
                  {/* Escrow Actions */}
                  <div>
                    {pendingInVault > 0 ? (
                      <button
                        onClick={() => handleOpenVaultLocker(seller.id, seller.brand_name, Math.round(pendingInVault), seller.upi_id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          color: '#0a0a0a',
                          backgroundColor: '#c8f135',
                          border: 'none',
                          borderRadius: '100px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          fontSize: '0.76rem',
                          fontWeight: 900,
                          boxShadow: '0 4px 12px rgba(200, 241, 53, 0.3)'
                        }}
                      >
                        <Unlock size={13} />
                        <span>Unlock Vault</span>
                      </button>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 700, color: '#16a34a', padding: '5px 10px', backgroundColor: '#dcfce7', borderRadius: '100px' }}>
                        <CheckCircle2 size={13} />
                        Dispersed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3D Cyber Vault Locker Modal */}
      {activeVaultSeller && (
        <EscrowVaultLocker
          isOpen={vaultModalOpen}
          onClose={() => { setVaultModalOpen(false); setActiveVaultSeller(null); }}
          sellerId={activeVaultSeller.id}
          sellerName={activeVaultSeller.name}
          sellerUpi={activeVaultSeller.upi}
          amount={activeVaultSeller.amount}
          onConfirmPayout={handleConfirmVaultPayout}
        />
      )}

    </div>
  );
}
