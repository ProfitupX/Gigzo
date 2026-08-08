'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, MessageSquare, ThumbsUp, User } from 'lucide-react';

type Review = {
  id: string;
  product_id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  product_title?: string;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star
        key={s}
        size={16}
        fill={s <= rating ? '#f59e0b' : 'none'}
        color={s <= rating ? '#f59e0b' : '#d1d5db'}
      />
    ))}
  </div>
);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch reviews joined with product titles
      const { data } = await supabase
        .from('reviews')
        .select('*, products(title)')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      const mapped: Review[] = (data || []).map((r: any) => ({
        ...r,
        product_title: r.products?.title || 'Product Item',
      }));

      setReviews(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '4px' }}>Customer Feedback & Reviews</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Buyer ratings and feedback left on your store items.</p>
      </div>

      {/* Summary Card */}
      <div className="card" style={{ padding: '28px', borderRadius: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
        <div style={{ textAlign: 'center', paddingRight: '24px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '3.6rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '8px' }}>{avgRating}</div>
          <StarRating rating={Math.round(Number(avgRating))} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, marginTop: '10px' }}>
            Based on {reviews.length} buyer review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
          {ratingDist.map(({ star, count, pct }) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '40px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{star}</span>
                <Star size={12} fill="#f59e0b" color="#f59e0b" />
              </div>
              <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--surface-2)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '100px', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '24px', textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>All Reviews</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '24px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--text-muted)' }}>
              <MessageSquare size={24} />
            </div>
            <p style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '4px' }}>No reviews yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Customer feedback will appear here once buyers leave reviews on your products.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(r => (
              <div key={r.id} className="card" style={{ padding: '20px 24px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#0a0a0a', color: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                      {r.buyer_name?.[0]?.toUpperCase() || 'B'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '0.92rem' }}>{r.buyer_name || 'Anonymous'}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Purchased {r.product_title}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <StarRating rating={r.rating} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '48px' }}>
                  {r.comment || 'No written comment left.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
