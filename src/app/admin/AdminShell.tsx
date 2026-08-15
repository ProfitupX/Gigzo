'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  LogOut,
  Shield,
  Menu,
  X,
  IndianRupee,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/payments', label: 'Payments', icon: IndianRupee, exact: false },
  { href: '/admin/sellers', label: 'Sellers', icon: Users, exact: false },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, exact: false },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
  { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp, exact: false },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const Sidebar = () => (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '0',
      flexShrink: 0,
      overflowY: 'auto',
      zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src="/icon.png" alt="ProfitupX" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          <span style={{ fontWeight: 900, fontSize: '1.3rem', letterSpacing: '-1.5px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0a0a0a', lineHeight: 1 }}>ProfitupX</span>
        </Link>
        <button
          className="admin-mobile-close"
          onClick={() => setMobileOpen(false)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Badge */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          backgroundColor: '#0a0a0a',
          borderRadius: '100px', padding: '5px 12px',
          color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <Shield size={11} color="#c8f135" /> Super Admin
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 8px' }}>Menu</p>
        {navItems.map(item => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 16px',
                borderRadius: '14px',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.88rem',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: isActive ? '#0a0a0a' : 'transparent',
                boxShadow: isActive ? '0 4px 14px rgba(10, 10, 10, 0.15)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0, color: isActive ? '#c8f135' : 'var(--text-muted)', transition: 'color 0.2s ease' }} />
              <span>{item.label}</span>
              {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#c8f135', marginLeft: 'auto' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '11px 16px', borderRadius: '14px',
            backgroundColor: 'var(--surface-2)', border: 'none',
            color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget.style.color = '#ef4444'); (e.currentTarget.style.backgroundColor = '#fee2e2'); }}
          onMouseLeave={e => { (e.currentTarget.style.color = 'var(--text-secondary)'); (e.currentTarget.style.backgroundColor = 'var(--surface-2)'); }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0a0a0a' }}>
      {/* Desktop sidebar */}
      <div className="admin-desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', zIndex: 1, width: 260, backgroundColor: '#ffffff', height: '100vh' }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="admin-mobile-menu"
              onClick={() => setMobileOpen(true)}
              style={{ display: 'none', background: 'none', border: 'none', color: '#0a0a0a', cursor: 'pointer', padding: '4px' }}
            >
              <Menu size={24} />
            </button>
            <div className="admin-mobile-logo" style={{ display: 'none' }}>
              <img src="/icon.png" alt="ProfitupX" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
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
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }}></span>
              Live Dashboard
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              backgroundColor: '#0a0a0a', border: 'none',
              borderRadius: '100px', padding: '8px 16px',
              color: '#ffffff', fontSize: '0.82rem', fontWeight: 700,
              boxShadow: '0 4px 14px rgba(10, 10, 10, 0.1)',
            }}>
              🔐 Ganesh
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, padding: '36px 40px 60px', overflowY: 'auto', maxWidth: '1400px', width: '100%', margin: '0 auto' }} className="admin-main-content">
          {children}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        :root {
          --border: #e5e7eb;
          --surface-2: #f3f4f6;
          --text-secondary: #4b5563;
          --text-muted: #9ca3af;
        }

        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-mobile-menu { display: flex !important; }
          .admin-mobile-logo { display: block !important; }
          .admin-mobile-close { display: block !important; }
          .admin-main-content { padding: 24px 16px 80px !important; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}</style>
    </div>
  );
}
