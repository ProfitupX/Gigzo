import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { 
  Plus, 
  Tag, 
  Star, 
  TrendingUp, 
  Settings, 
  Package, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  IndianRupee,
  Users,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const uid = user!.id;

  // Fetch stats in parallel
  const [
    { count: productCount },
    { data: orders },
    { data: products },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('creator_id', uid),
    supabase.from('orders').select('amount, status, created_at, buyer_name').eq('creator_id', uid).order('created_at', { ascending: false }).limit(20),
    supabase.from('products').select('id, title, price, stock, category, image_url').eq('creator_id', uid).order('created_at', { ascending: false }).limit(5),
  ]);

  const totalRevenue = orders?.reduce((sum, o) => sum + (Number(o.amount) || 0), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const paidOrders = orders?.filter(o => o.status === 'paid').length || 0;
  const totalOrders = orders?.length || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Retention calc (repeat buyers by name)
  const buyerCounts: Record<string, number> = {};
  orders?.forEach(o => { if (o.buyer_name) buyerCounts[o.buyer_name] = (buyerCounts[o.buyer_name] || 0) + 1; });
  const returningBuyers = Object.values(buyerCounts).filter(c => c > 1).length;
  const totalBuyers = Object.keys(buyerCounts).length;
  const retentionRate = totalBuyers > 0 ? Math.round((returningBuyers / totalBuyers) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Overview</h1>
            <span className="badge badge-lime" style={{ fontSize: '0.72rem' }}>
              <Sparkles size={12} /> Store Active
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Welcome back! Here is real-time performance summary of your creator store.
          </p>
        </div>
        <Link href="/dashboard/products" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '100px', fontSize: '0.9rem', gap: '8px' }}>
          <Plus size={18} />
          <span>New Product</span>
        </Link>
      </div>

      {/* Quick Action Navigation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { icon: Tag, title: 'Categories', sub: 'Organise catalog', href: '/dashboard/categories', accent: '#0284c7', bg: '#e0f2fe' },
          { icon: Star, title: 'Customer Reviews', sub: 'View buyer feedback', href: '/dashboard/reviews', accent: '#d97706', bg: '#fef3c7' },
          { icon: TrendingUp, title: 'Analytics', sub: 'Track sales & traffic', href: '/dashboard/analytics', accent: '#16a34a', bg: '#dcfce7' },
          { icon: Settings, title: 'Store Settings', sub: 'Update profile & UPI', href: '/dashboard/settings', accent: '#7c3aed', bg: '#ede9fe' },
        ].map((item) => {
          const IconComponent = item.icon;
          return (
            <Link 
              href={item.href} 
              key={item.href} 
              className="bento-hover"
              style={{ 
                background: '#ffffff', 
                padding: '20px', 
                borderRadius: '20px', 
                textDecoration: 'none',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: item.bg,
                color: item.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconComponent size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--foreground)' }}>{item.title}</h3>
                  <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>{item.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[
          { 
            label: 'Total Revenue', 
            value: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`, 
            sub: '+12.5% vs last month', 
            icon: IndianRupee,
            up: true,
            color: '#16a34a',
            bg: '#f0fdf4'
          },
          { 
            label: 'Total Orders', 
            value: String(totalOrders), 
            sub: `${pendingOrders} pending delivery`, 
            icon: ShoppingBag,
            up: true,
            color: '#0284c7',
            bg: '#e0f2fe'
          },
          { 
            label: 'Paid Orders', 
            value: String(paidOrders), 
            sub: `₹${avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} avg order`, 
            icon: CheckCircle2,
            up: true,
            color: '#7c3aed',
            bg: '#ede9fe'
          },
          { 
            label: 'Active Inventory', 
            value: String(productCount || 0), 
            sub: 'Listed items in store', 
            icon: Package,
            up: true,
            color: '#d97706',
            bg: '#fef3c7'
          },
          { 
            label: 'Customer Retention', 
            value: `${retentionRate}%`, 
            sub: `${returningBuyers} repeat buyers`, 
            icon: Users,
            up: retentionRate > 0,
            color: '#ca8a04',
            bg: '#fefce8'
          },
        ].map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div key={i} className="card" style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem' }}>{stat.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StatIcon size={16} />
                </div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: stat.up ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Section: Recent Orders & Inventory */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>

        {/* Recent Orders */}
        <div className="card" style={{ borderRadius: '24px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Recent Orders</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest customer transactions</p>
            </div>
            <Link href="/dashboard/analytics" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View Analytics</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orders.slice(0, 5).map((o, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 14px', 
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: 36, height: 36, borderRadius: '50%', 
                      backgroundColor: '#0a0a0a', color: '#c8f135', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 800, fontSize: '0.85rem' 
                    }}>
                      {o.buyer_name?.[0]?.toUpperCase() || 'B'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '0.88rem' }}>{o.buyer_name || 'Anonymous Buyer'}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <Clock size={12} />
                        <span>{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 900, fontSize: '0.95rem' }}>₹{Number(o.amount).toLocaleString('en-IN')}</p>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '100px',
                      display: 'inline-block', marginTop: '2px', textTransform: 'uppercase',
                      backgroundColor: o.status === 'paid' ? '#dcfce7' : o.status === 'pending' ? '#fef3c7' : '#e0f2fe',
                      color: o.status === 'paid' ? '#16a34a' : o.status === 'pending' ? '#d97706' : '#0284c7',
                    }}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--surface-2)', borderRadius: '18px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--text-muted)' }}>
                <ShoppingBag size={20} />
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>No orders yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Share your store link on Instagram to start getting orders.</p>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="card" style={{ borderRadius: '24px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Inventory Summary</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your recent products catalog</p>
            </div>
            <Link href="/dashboard/products" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>All Products</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {products.map((p) => (
                <div key={p.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '14px', 
                  padding: '12px 14px', 
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: '14px' 
                }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', flexShrink: 0, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={20} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span style={{ backgroundColor: '#fff', padding: '2px 8px', borderRadius: '6px', fontWeight: 600, border: '1px solid var(--border)' }}>{p.category}</span>
                      <span>Stock: {p.stock ?? 0}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--surface-2)', borderRadius: '18px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--text-muted)' }}>
                <Package size={20} />
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>No products listed</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>Add your digital or physical product to start selling.</p>
              <Link href="/dashboard/products" className="btn-lime" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
                Add Product
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
