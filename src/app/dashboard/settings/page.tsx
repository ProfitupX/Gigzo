'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link as LinkIcon, Copy, Check, ExternalLink, Save, User, Globe, Store, CheckCircle, Smartphone, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [creatorId, setCreatorId] = useState('');
  
  const [brandName, setBrandName] = useState('');
  const [storeLink, setStoreLink] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setCreatorId(user.id);
      
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data) {
        setBrandName(data.brand_name || '');
        setStoreLink(data.store_link || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
        setUpiId(data.upi_id || '');
        setBankName(data.bank_name || '');
        setBankAccountNo(data.bank_account_no || '');
        setBankIfsc(data.bank_ifsc || '');
        setIsVerified(data.is_verified || false);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('creators')
      .update({
        brand_name: brandName,
        store_link: storeLink,
        bio,
        avatar_url: avatarUrl,
        upi_id: upiId,
        bank_name: bankName || null,
        bank_account_no: bankAccountNo || null,
        bank_ifsc: bankIfsc || null,
      })
      .eq('id', creatorId);
      
    setSaving(false);
    
    if (error) {
      alert(error.message);
    } else {
      alert('Store settings updated successfully!');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const fullStoreUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${storeLink || creatorId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullStoreUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '4px' }}>Store Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Manage your storefront link, brand profile, and UPI payout settings.</p>
      </div>

      {/* Store Link Card */}
      {!loading && (
        <div className="card" style={{ padding: '28px', borderRadius: '24px', border: '2px solid #0a0a0a', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'var(--pastel-lime)', color: '#3a6600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkIcon size={18} />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Your Live Storefront Link</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Copy and paste this link into your Instagram, YouTube, or WhatsApp bio.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input 
              readOnly 
              value={fullStoreUrl} 
              className="input-field"
              style={{ flex: 1, minWidth: '260px', fontWeight: 700, backgroundColor: 'var(--surface-2)' }} 
            />
            <button 
              className="btn-lime" 
              onClick={copyToClipboard}
              style={{ padding: '12px 24px', borderRadius: '100px', fontSize: '0.88rem', gap: '6px' }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <a 
              href={`/${storeLink || creatorId}`}
              target="_blank" 
              rel="noreferrer" 
              className="btn-secondary"
              style={{ padding: '12px 24px', borderRadius: '100px', fontSize: '0.88rem', gap: '6px' }}
            >
              <ExternalLink size={16} />
              <span>Visit Store</span>
            </a>
          </div>
        </div>
      )}

      {/* Profile & UPI Form */}
      <div className="card" style={{ padding: '32px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>
            <Store size={20} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Public Profile & UPI Payout Details</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading store profile settings...</div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Brand / Store Name</label>
              <input 
                required 
                value={brandName} 
                onChange={e => setBrandName(e.target.value)} 
                type="text" 
                placeholder="My Store Name" 
                className="input-field" 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Store Link (URL Slug)</label>
              <input 
                required 
                value={storeLink} 
                onChange={e => setStoreLink(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                type="text" 
                placeholder="mystore" 
                className="input-field" 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Only lowercase letters, numbers, and hyphens.</p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Bio / Tagline</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                rows={3} 
                placeholder="Digital products, presets & exclusive content for creators..." 
                className="input-field" 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Your UPI ID (For Direct Payments / Settlement)
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  value={upiId} 
                  onChange={e => setUpiId(e.target.value)} 
                  type="text" 
                  placeholder="e.g. 9876543210@paytm or yourname@okicici" 
                  className="input-field" 
                  style={{ fontWeight: 700 }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                ProfitupX will send your 95% earnings to this UPI ID.
              </p>
            </div>

            {/* Optional Bank Account Details */}
            <div style={{ padding: '20px', backgroundColor: 'var(--surface-2)', borderRadius: '18px', border: '1px dashed var(--border)', display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Direct Bank Account (Optional)</h3>
                {isVerified ? (
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '100px', fontWeight: 800 }}>
                    ✓ Verified Seller
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '100px', fontWeight: 800 }}>
                    Verification Pending
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Bank Name</label>
                  <input value={bankName} onChange={e => setBankName(e.target.value)} type="text" placeholder="HDFC, SBI, ICICI..." className="input-field" style={{ backgroundColor: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Account Number</label>
                  <input value={bankAccountNo} onChange={e => setBankAccountNo(e.target.value)} type="text" placeholder="1234567890" className="input-field" style={{ backgroundColor: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>IFSC Code</label>
                  <input value={bankIfsc} onChange={e => setBankIfsc(e.target.value.toUpperCase())} type="text" placeholder="HDFC0001234" className="input-field" style={{ backgroundColor: '#fff' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Avatar Image URL</label>
              <input 
                value={avatarUrl} 
                onChange={e => setAvatarUrl(e.target.value)} 
                type="url" 
                placeholder="https://..." 
                className="input-field" 
              />
            </div>

            <button 
              type="submit" 
              disabled={saving} 
              className="btn-primary" 
              style={{ justifySelf: 'start', padding: '14px 28px', fontSize: '0.92rem', borderRadius: '100px', gap: '8px' }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid #fca5a5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>Account Actions</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Sign out of your ProfitupX dashboard on this device.
        </p>
        <button 
          onClick={handleLogout}
          className="btn-secondary" 
          style={{ padding: '12px 24px', fontSize: '0.92rem', borderRadius: '100px', gap: '8px', color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
