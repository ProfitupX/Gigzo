'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} | ProfitupX Store`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log('Error sharing', err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      style={{ 
        width: '40px', 
        height: '40px', 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(10px)', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: copied ? '#16a34a' : '#0a0a0a', 
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'color 0.2s ease',
        cursor: 'pointer'
      }}
      title="Share Product"
    >
      <Share2 size={18} />
    </button>
  );
}
