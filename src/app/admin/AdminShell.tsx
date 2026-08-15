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
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
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
      background: '#0a0a0a',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '0',
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #c8f135, #a3d911)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <img src="/icon.png" alt="ProfitupX" style={{ width: 24, height: 24, borderRadius: 6 }} />
          </div>
          <div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.03em', display: 'block', lineHeight: 1 }}>ProfitupX</span>
            <span style={{ color: '#c8f135', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Portal</span>
          </div>
        </Link>
      </div>

      {/* Badge */}
      <div style={{ padding: '14px 20px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)',
          borderRadius: '100px', padding: '5px 12px',
          color: '#c8f135', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <Shield size={11} /> Super Admin
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 16px', flex: 1 }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 10px' }}>Navigation</p>
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
                padding: '11px 14px',
                borderRadius: '12px',
                marginBottom: '4px',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                color: isActive ? '#0a0a0a' : 'rgba(255,255,255,0.55)',
                background: isActive ? '#c8f135' : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={17} style={{ flexShrink: 0, color: isActive ? '#0a0a0a' : 'rgba(255,255,255,0.35)' }} />
              {item.label}
              {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0a0a0a', marginLeft: 'auto', opacity: 0.5 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '11px 14px', borderRadius: '12px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
            color: '#ef4444', fontWeight: 700, fontSize: '0.85rem',
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff' }}>
      {/* Desktop sidebar */}
      <div className="admin-desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', zIndex: 1, width: 260 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          background: 'rgba(15,17,23,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            className="admin-mobile-menu"
            onClick={() => setMobileOpen(true)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
          >
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600 }}>Live Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px', padding: '6px 14px',
              color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 700,
            }}>
              🔐 Ganesh — Super Admin
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-mobile-menu { display: flex !important; }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 6px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
