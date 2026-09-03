'use client';

import { useEffect, useState } from 'react';
import { 
  ExternalLink, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  Building2, 
  CreditCard,
  Cpu,
  Sparkles,
  X,
  Lock,
  Layers
} from 'lucide-react';
import { generateSellerVerificationProof } from '@/lib/escrowLedger';

interface Seller {
  id: string;
  brand_name: string;
  store_link: string;
  avatar_url: string;
  created_at: string;
  revenue: number;
  orderCount: number;
  upi_id?: string | null;
  is_verified?: boolean;
  bank_account_no?: string | null;
  bank_ifsc?: string | null;
  bank_name?: string | null;
  bio?: string | null;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'verified' | 'unverified'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Certificate Modal
  const [selectedProofSeller, setSelectedProofSeller] = useState<Seller | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const d = await res.json();
      if (d && d.creators) {
        setSellers(d.creators);
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

  const handleToggleVerification = async (sellerId: string, currentStatus: boolean | undefined) => {
    const nextStatus = !currentStatus;
    const action = nextStatus ? 'verify_seller' : 'unverify_seller';

    setVerifyingId(sellerId);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: sellerId }),
      });

      if (res.ok) {
        setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, is_verified: nextStatus } : s));
      } else {
        alert('Failed to update verification status.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
    setVerifyingId(null);
  };

  const handleDelete = async (id: string, brand: string) => {
    if (!window.confirm(`⚠️ WARNING: Are you sure you want to permanently delete seller "${brand}" and all their products? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_seller', id }),
      });
      if (res.ok) {
        setSellers(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Failed to delete seller.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
    setDeletingId(null);
  };

  const filtered = sellers
    .filter(s => {
      if (filterTab === 'verified') return s.is_verified === true;
      if (filterTab === 'unverified') return !s.is_verified;
      return true;
    })
    .filter(s =>
      s.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.store_link?.toLowerCase().includes(search.toLowerCase()) ||
      s.upi_id?.toLowerCase().includes(search.toLowerCase())
    );

  const verifiedCount = sellers.filter(s => s.is_verified).length;
  const unverifiedCount = sellers.length - verifiedCount;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0a', margin: '0 0 6px' }}>
          Seller Verification & On-Chain Registry
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>
          Manage merchant KYC verification, bank settlement credentials, and cryptographic trust proof badges.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Total Registered</p>
          <p style={{ color: '#0a0a0a', fontWeight: 900, fontSize: '1.6rem', margin: 0 }}>{sellers.length}</p>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
            <ShieldCheck size={14} /> On-Chain Verified
          </div>
          <p style={{ color: '#16a34a', fontWeight: 900, fontSize: '1.6rem', margin: 0 }}>{verifiedCount}</p>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #fef08a', borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#854d0e', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
            <Clock size={14} /> Pending Verification
          </div>
          <p style={{ color: '#ca8a04', fontWeight: 900, fontSize: '1.6rem', margin: 0 }}>{unverifiedCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '100px' }}>
          {[
            { id: 'all', label: `All (${sellers.length})` },
            { id: 'verified', label: `Verified (${verifiedCount})` },
            { id: 'unverified', label: `Pending (${unverifiedCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: filterTab === tab.id ? '#0a0a0a' : 'transparent',
                color: filterTab === tab.id ? '#ffffff' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search seller, link or UPI..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 16px 10px 42px',
              backgroundColor: '#ffffff', border: '1px solid var(--border)',
              borderRadius: '100px', color: '#0a0a0a', fontSize: '0.88rem',
              outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) 130px minmax(180px, 2fr) 80px 100px 220px', gap: '16px', padding: '16px 24px', backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          {['Seller Profile', 'Status', 'Bank / UPI Details', 'Orders', 'Revenue', 'On-Chain & Actions'].map(h => (
            <span key={h} style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.9rem', fontWeight: 500 }}>No sellers found.</p>
        )}

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '980px' }}>
            {filtered.map(seller => (
              <div key={seller.id}
                style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) 130px minmax(180px, 2fr) 80px 100px 220px', gap: '16px', padding: '18px 24px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* 1. Seller Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c8f135', fontWeight: 900, fontSize: '0.95rem', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    {seller.avatar_url ? <img src={seller.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : seller.brand_name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {seller.brand_name}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                      /{seller.store_link || seller.id.slice(0, 8)}
                    </span>
                  </div>
                </div>

                {/* 2. Verification Badge */}
                <div>
                  {seller.is_verified ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>
                      <ShieldCheck size={13} /> Verified
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>
                      <Clock size={13} /> Pending
                    </span>
                  )}
                </div>

                {/* 3. Bank & UPI Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {seller.upi_id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: '#0a0a0a', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {seller.upi_id}
                      </span>
                      <button
                        onClick={() => handleCopy(seller.upi_id!, `upi_${seller.id}`)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedKey === `upi_${seller.id}` ? '#16a34a' : '#94a3b8' }}
                        title="Copy UPI ID"
                      >
                        {copiedKey === `upi_${seller.id}` ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>No UPI ID added</span>
                  )}

                  {seller.bank_account_no && (
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      A/C: ••••{seller.bank_account_no.slice(-4)} ({seller.bank_ifsc || 'IFSC'})
                    </span>
                  )}
                </div>

                {/* 4. Orders */}
                <span style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9rem' }}>{seller.orderCount}</span>

                {/* 5. Revenue */}
                <span style={{ color: seller.revenue > 0 ? '#16a34a' : 'var(--text-secondary)', fontWeight: 800, fontSize: '0.9rem' }}>
                  ₹{seller.revenue.toLocaleString('en-IN')}
                </span>

                {/* 6. Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Blockchain Proof Button */}
                  <button
                    onClick={() => setSelectedProofSeller(seller)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: '1px solid #c8f135',
                      backgroundColor: 'rgba(200, 241, 53, 0.15)',
                      color: '#0a0a0a',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="View Blockchain Verification Proof"
                  >
                    <Cpu size={13} />
                    <span>Proof</span>
                  </button>

                  {/* Verify / Revoke Toggle */}
                  <button
                    onClick={() => handleToggleVerification(seller.id, seller.is_verified)}
                    disabled={verifyingId === seller.id}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: verifyingId === seller.id ? 'not-allowed' : 'pointer',
                      border: 'none',
                      backgroundColor: seller.is_verified ? '#f3f4f6' : '#0a0a0a',
                      color: seller.is_verified ? '#4b5563' : '#c8f135',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {verifyingId === seller.id ? (
                      <div style={{ width: 12, height: 12, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : seller.is_verified ? (
                      'Revoke'
                    ) : (
                      'Verify'
                    )}
                  </button>

                  {/* Visit Store */}
                  <a
                    href={`/${seller.store_link || seller.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', color: '#4f46e5', backgroundColor: '#e0e7ff', borderRadius: '8px' }}
                    title="View Storefront"
                  >
                    <ExternalLink size={14} />
                  </a>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(seller.id, seller.brand_name)}
                    disabled={deletingId === seller.id}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', color: '#dc2626', backgroundColor: '#fee2e2', border: 'none', borderRadius: '8px', cursor: deletingId === seller.id ? 'not-allowed' : 'pointer' }}
                    title="Delete Seller"
                  >
                    {deletingId === seller.id ? (
                      <div style={{ width: 12, height: 12, border: '2px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blockchain Verification Certificate Modal */}
      {selectedProofSeller && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(5, 7, 12, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          {(() => {
            const proof = generateSellerVerificationProof(
              selectedProofSeller.id, 
              selectedProofSeller.brand_name, 
              selectedProofSeller.upi_id || 'PENDING'
            );

            return (
              <div style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: '#0a0d14',
                borderRadius: '28px',
                border: '1.5px solid rgba(200, 241, 53, 0.3)',
                boxShadow: '0 24px 70px rgba(0,0,0,0.8), 0 0 40px rgba(200, 241, 53, 0.15)',
                color: '#ffffff',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={24} color="#c8f135" />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>On-Chain Seller Certificate</h3>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>
                        PROFITUPX CRYPTOGRAPHIC TRUST LEDGER
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProofSeller(null)}
                    style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Certificate Details */}
                <div style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Merchant Name:</span>
                    <span style={{ fontWeight: 800, color: '#ffffff' }}>{selectedProofSeller.brand_name}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>KYC Trust Index:</span>
                    <span style={{ fontWeight: 900, color: '#c8f135' }}>{proof.trustScore}% Verified</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Escrow Status:</span>
                    <span style={{ fontWeight: 800, color: '#10b981' }}>{proof.escrowAccountStatus}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Protocol Version:</span>
                    <span style={{ fontWeight: 800, color: '#38bdf8' }}>{proof.protocolVersion}</span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                      Cryptographic Block Signature
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'monospace', wordBreak: 'break-all', marginTop: '2px' }}>
                      {proof.blockHash}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProofSeller(null)}
                  className="btn-lime"
                  style={{ width: '100%', padding: '14px', borderRadius: '100px', fontSize: '0.92rem', fontWeight: 900, justifyContent: 'center' }}
                >
                  Close Certificate
                </button>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
