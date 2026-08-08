'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Tag, 
  Star, 
  Settings,
  ExternalLink
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/dashboard/products', icon: Package, label: 'Products', exact: false },
  { href: '/dashboard/analytics', icon: TrendingUp, label: 'Analytics', exact: false },
  { href: '/dashboard/categories', icon: Tag, label: 'Categories', exact: false },
  { href: '/dashboard/reviews', icon: Star, label: 'Reviews', exact: false },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings', exact: false },
];

interface SidebarNavProps {
  userName: string;
  userAvatar: string;
  userRole: string;
}

export function SidebarNav({ userName, userAvatar, userRole }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ padding: '0 12px 12px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '11px 16px',
                borderRadius: '14px',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: isActive ? '#0a0a0a' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 4px 14px rgba(10, 10, 10, 0.15)' : 'none',
                textDecoration: 'none',
              }}
            >
              <Icon 
                size={18} 
                style={{ 
                  color: isActive ? '#c8f135' : 'var(--text-muted)',
                  transition: 'color 0.2s ease',
                  flexShrink: 0 
                }} 
              />
              <span>{item.label}</span>
              {isActive && (
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: '#c8f135',
                  marginLeft: 'auto' 
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer in Sidebar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: 'auto',
        padding: '14px',
        backgroundColor: 'var(--surface-2)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
      }}>
        {userAvatar ? (
          <img src={userAvatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #0a0a0a 0%, #374151 100%)', 
            color: '#c8f135',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 800,
            fontSize: '1rem'
          }}>
            {userName?.[0]?.toUpperCase() || 'C'}
          </div>
        )}
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--foreground)' }}>
            {userName}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>
            {userRole}
          </p>
        </div>
      </div>
    </div>
  );
}
