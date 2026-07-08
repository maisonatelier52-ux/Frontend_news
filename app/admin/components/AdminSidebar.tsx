'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
  badgeColor?: string
}

interface AdminSidebarProps {
  collapsed: boolean
  setCollapsed: (c: boolean) => void
  user?: any
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard', href: '/admin/dashboard',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'News Articles', href: '/admin/news',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
        badge: '18',
      },
      {
        label: 'Categories', href: '/admin/categories',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
      },
      {
        label: 'Authors', href: '/admin/authors',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
      },
    ],
  },
  {
    label: 'Engagement',
    items: [
      {
        label: 'Advertisements', href: '/admin/advertisements',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
      },
      {
        label: 'Comments Mod', href: '/admin/comments',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      },
      {
        label: 'Subscriptions', href: '/admin/subscriptions',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      },
    ],
  },
  {
    label: 'Site Config',
    items: [
      {
        label: 'Home Layout', href: '/admin/layout',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>,
      },
      {
        label: 'Category Layout', href: '/admin/category-layout',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>,
      },
      {
        label: 'Detail Page Layout', href: '/admin/detail-layout',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17h6M9 13h6M9 9h6"/></svg>,
      },
      {
        label: 'Footer Manager', href: '/admin/footer',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="3" y1="3" x2="21" y2="3"/><line x1="3" y1="21" x2="21" y2="21"/></svg>,
      },
    ],
  },
]

export default function AdminSidebar({ collapsed, setCollapsed, user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  function isActive(href: string) {
    if (href === '/admin/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className={`animate-[admin-slide-right_0.4s_cubic-bezier(0.16,1,0.3,1)_both] min-h-screen bg-white flex flex-col fixed top-0 left-0 bottom-0 z-40 shadow-[10px_0_30px_rgba(15,23,42,0.04),_1px_0_0_rgba(15,23,42,0.05)] transition-all duration-300 ${
      collapsed ? 'w-[72px]' : 'w-[232px]'
    }`}>
      
      {/* Brand Header: Set height h-[58px] to align perfectly with topbar header, smudging colors using dark mesh gradient */}
      <div className={`h-[58px] bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] flex items-center justify-between px-5 shrink-0 ${
        collapsed ? 'justify-center !px-0' : ''
      }`}>
        {collapsed ? (
          <button 
            onClick={() => setCollapsed(false)}
            className="p-1.5 hover:bg-white/10 rounded-md text-slate-300 hover:text-white cursor-pointer border-none bg-transparent flex items-center justify-center transition-colors"
            title="Expand sidebar"
          >
            {/* Hamburger to expand within collapsed sidebar */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        ) : (
          <>
            <Link href="/admin/dashboard" className="flex items-center no-underline">
              {/* White brand text for dark backdrop */}
              <span className="text-white font-serif text-[23px] font-extrabold tracking-tight uppercase">
                Admin
              </span>
            </Link>
            <button 
              onClick={() => setCollapsed(true)}
              className="p-1 hover:bg-white/10 rounded-md text-slate-300 hover:text-white cursor-pointer border-none bg-transparent flex items-center justify-center transition-colors"
              title="Collapse sidebar"
            >
              {/* Close icon button inside sidebar header to collapse */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Nav List: Nav list container is scrollable, Action button is placed inside to allow it to scroll along with list items */}
      <nav className="flex-1 p-[16px_12px] overflow-y-auto no-scrollbar flex flex-col gap-5">
        
        {/* Action Button: New Article (Deep Indigo Blue styling) now scrolls with the list */}
        <div className={`flex shrink-0 ${collapsed ? 'justify-center' : ''}`}>
          {collapsed ? (
            <Link 
              href="/admin/news/new" 
              className="w-10 h-10 bg-[#1e1b4b] text-white hover:bg-[#2e1f5e] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(30,27,75,0.2)] transition-all"
              title="New Article"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </Link>
          ) : (
            <Link 
              href="/admin/news/new" 
              className="w-full flex items-center justify-center gap-2 bg-[#1e1b4b] text-white hover:bg-[#2e1f5e] rounded-lg p-[8px_12px] no-underline text-[12.5px] font-bold transition-all duration-150 shadow-[0_4px_12px_rgba(30,27,75,0.15)]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Article
            </Link>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex flex-col gap-6">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-0">
              {!collapsed && (
                <div className="text-[10px] font-bold text-[#94a3b8] tracking-[0.1em] uppercase px-2.5 mb-1.5">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center rounded-lg mb-0.5 text-[13.5px] font-medium no-underline transition-all duration-150 ${
                      collapsed ? 'justify-center p-2.5' : 'gap-[11px] px-3.5 py-2.25'
                    } ${
                      active 
                        ? 'bg-[#eff6ff] text-[#1e1b4b] font-semibold' 
                        : 'bg-transparent text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e1b4b]'
                    }`}
                  >
                    <span className={`${active ? 'opacity-100 text-[#1e1b4b]' : 'opacity-70'} shrink-0`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className={`px-1.75 py-0.25 rounded-full text-[10px] font-bold ${
                        active 
                          ? 'bg-[#1e1b4b] text-white' 
                          : 'bg-[#f1f5f9] text-[#64748b]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* View Site */}
      <div className={`p-[0_12px_12px] flex ${collapsed ? 'justify-center' : ''}`}>
        {collapsed ? (
          <Link 
            href="/" 
            target="_blank" 
            className="w-10 h-10 border border-[#e2e8f0] text-[#64748b] hover:text-[#1e1b4b] hover:bg-[#f8fafc] rounded-xl flex items-center justify-center transition-all"
            title="View live site"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </Link>
        ) : (
          <Link 
            href="/" 
            target="_blank" 
            className="w-full flex items-center justify-center gap-2 p-[9px_12px] rounded-lg no-underline text-[#64748b] hover:text-[#1e1b4b] hover:bg-[#f8fafc] text-[12.5px] transition-all duration-150 border border-[#e2e8f0]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View live site
          </Link>
        )}
      </div>

      {/* User Area Footer */}
      <div className={`p-[14px_16px_18px] border-t border-[#f1f5f9] flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
        <div className="w-[34px] h-[34px] rounded-full bg-[#1e1b4b] text-white flex items-center justify-center text-[13px] font-extrabold shrink-0 shadow-[0_2px_6px_rgba(30,27,75,0.15)] uppercase">
          {(user?.name || 'A').charAt(0)}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#0f172a] truncate">{user?.name || 'Admin User'}</div>
              <div className="text-[11px] text-[#64748b] truncate">{user?.email || 'admin@newssite.com'}</div>
            </div>
            <button 
              onClick={handleLogout}
              title="Sign out" 
              className="text-[#94a3b8] hover:text-[#ef4444] flex transition-colors duration-150 bg-transparent border-none cursor-pointer p-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
