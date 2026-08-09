import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SidebarNav } from './SidebarNav';
import { MobileBottomNav } from './MobileBottomNav';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Ensure creator profile exists
  const { data: creator } = await supabase
    .from('creators')
    .select('id, brand_name')
    .eq('id', user.id)
    .single();

  if (!creator) {
    const randomStr = Math.random().toString(36).substring(2, 8);
    const brandName = user.user_metadata?.full_name || 'My Store';
    const storeLink = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + randomStr;

    await supabase.from('creators').insert({
      id: user.id,
      brand_name: brandName,
      avatar_url: user.user_metadata?.avatar_url,
      store_link: storeLink,
    });
  }

  const brandTitle = creator?.brand_name || user.user_metadata?.full_name || 'My Store';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa', color: '#0a0a0a' }}>
      {/* Sidebar (Desktop Only) */}
      <aside className="desktop-sidebar" style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border)',
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 20,
      }}>
        {/* Brand Logo */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '32px', paddingLeft: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 30L22 10H32L22 30H12Z" fill="#0a0a0a" />
            <path d="M8 26L14 14H22L16 26H8Z" fill="#0a0a0a" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 900, fontSize: '1.3rem', letterSpacing: '-1.5px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0a0a0a', lineHeight: 1 }}>Gigzo</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: 'var(--pastel-lime)', color: '#3a6600', padding: '3px 8px', borderRadius: '100px', letterSpacing: '0.04em' }}>STORE</span>
            </div>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#6b7280', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Powered by ProfitupX</span>
          </div>
        </Link>

        {/* Client-side navigation */}
        <SidebarNav
          userName={brandTitle}
          userAvatar={user.user_metadata?.avatar_url || ''}
          userRole="Store Admin"
        />
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header style={{
          height: '68px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Show logo on mobile since sidebar is hidden */}
            <div className="mobile-menu-btn" style={{ display: 'none', width: 32, height: 32, borderRadius: 8, background: '#0a0a0a', color: '#c8f135', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
              G
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 14px', 
              backgroundColor: 'var(--surface-2)', 
              borderRadius: '100px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-secondary)'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
              Live Store Ready
            </div>
          </div>

          <a href={`/${user.id}`} target="_blank" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '0.82rem', gap: '6px' }}>
            <span>View Live Store</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </header>

        {/* Page Content */}
        <main className="dashboard-main-content-inner" style={{ flex: 1, padding: '36px 40px 60px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
