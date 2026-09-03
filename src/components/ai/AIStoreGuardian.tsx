'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Package, 
  CreditCard, 
  ShoppingCart,
  X
} from 'lucide-react';
import Link from 'next/link';

import { playSarvamTTS } from '@/lib/sarvamVoice';

interface AIStoreGuardianProps {
  creatorId: string;
}

export default function AIStoreGuardian({ creatorId }: AIStoreGuardianProps) {
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [storeStatus, setStoreStatus] = useState<{
    missingUpi: boolean;
    missingProducts: boolean;
    pendingOrdersCount: number;
    outOfStockCount: number;
    brandName: string;
  }>({
    missingUpi: false,
    missingProducts: false,
    pendingOrdersCount: 0,
    outOfStockCount: 0,
    brandName: 'Creator'
  });

  const supabase = createClient();

  useEffect(() => {
    async function auditStore() {
      if (!creatorId) return;

      const [creatorRes, productsRes, ordersRes] = await Promise.all([
        supabase.from('creators').select('brand_name, upi_id').eq('id', creatorId).single(),
        supabase.from('products').select('id, stock, is_physical').eq('creator_id', creatorId),
        supabase.from('orders').select('id, status').eq('creator_id', creatorId),
      ]);

      const creator = creatorRes.data;
      const products = productsRes.data || [];
      const orders = ordersRes.data || [];

      const missingUpi = !creator?.upi_id || creator.upi_id.trim() === '';
      const missingProducts = products.length === 0;
      const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
      const outOfStockCount = products.filter(p => p.is_physical && (p.stock === 0 || p.stock === null)).length;

      setStoreStatus({
        missingUpi,
        missingProducts,
        pendingOrdersCount,
        outOfStockCount,
        brandName: creator?.brand_name || 'Creator'
      });
      setLoading(false);
    }
    auditStore();
  }, [creatorId]);

  const speakAlert = (text: string) => {
    playSarvamTTS(text, 'ta-IN');
  };

  if (loading || dismissed) return null;

  // Determine highest priority alert
  let alertType: 'upi' | 'product' | 'orders' | 'all_good' = 'all_good';
  let title = '';
  let description = '';
  let audioAlert = '';
  let actionLink = '';
  let actionText = '';

  if (storeStatus.missingUpi) {
    alertType = 'upi';
    title = '⚠️ UPI Payout ID Missing';
    description = 'Customers unga store-la buy pannum podhu ungalukku payout vara, UPI ID mandatory!';
    audioAlert = 'Unga UPI ID innum fill pannala. Customers buy pannum podhu panam vara Settings-la UPI ID add pannunga!';
    actionLink = '/dashboard/settings';
    actionText = 'Add UPI ID Now';
  } else if (storeStatus.missingProducts) {
    alertType = 'product';
    title = '🛍️ No Products in Your Store';
    description = 'Unga live store-la innum product add pannala. Voice-la 1-minute-la product create panlaam!';
    audioAlert = 'Unga store-la innum products illa. Ippove Voice Studio-la or Products page-la product add pannunga!';
    actionLink = '/dashboard/ai-assistant';
    actionText = 'Create Product with AI';
  } else if (storeStatus.pendingOrdersCount > 0) {
    alertType = 'orders';
    title = `📦 ${storeStatus.pendingOrdersCount} Pending Order(s)`;
    description = 'Pudhu orders ungalukku vandhurukku! Check panni verify / dispatch pannunga.';
    audioAlert = `Ungalukku ${storeStatus.pendingOrdersCount} orders pending-la irukku. Orders page-la check pannunga!`;
    actionLink = '/dashboard/orders';
    actionText = 'View Orders';
  }

  if (alertType === 'all_good') return null;

  return (
    <div style={{
      marginBottom: '24px',
      padding: '16px 20px',
      backgroundColor: alertType === 'upi' ? '#fffbeb' : alertType === 'product' ? '#f0fdf4' : '#eff6ff',
      borderRadius: '20px',
      border: `1.5px solid ${alertType === 'upi' ? '#fde047' : alertType === 'product' ? '#bbf7d0' : '#bfdbfe'}`,
      boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: '#0a0a0a',
          color: '#c8f135',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={20} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0a0a0a' }}>
              {title}
            </span>
            <span style={{ fontSize: '0.68rem', backgroundColor: '#0a0a0a', color: '#c8f135', padding: '2px 6px', borderRadius: '100px', fontWeight: 800 }}>
              24/7 AI GUARDIAN
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '2px 0 0 0', lineHeight: 1.5 }}>
            {description}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Voice Alert Speaker */}
        <button
          onClick={() => speakAlert(audioAlert)}
          className="btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '100px', fontSize: '0.78rem', gap: '4px' }}
          title="Play Voice Alert"
        >
          <Volume2 size={14} />
          <span>Voice Alert</span>
        </button>

        {/* Action Link */}
        <Link
          href={actionLink}
          className="btn-primary"
          style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '0.82rem', gap: '6px', textDecoration: 'none' }}
        >
          <span>{actionText}</span>
          <ArrowRight size={14} />
        </Link>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
          title="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
