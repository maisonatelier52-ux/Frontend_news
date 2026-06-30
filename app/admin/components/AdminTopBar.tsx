'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

function getBreadcrumb(pathname: string) {
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean)
  const crumbs: { label: string; href: string }[] = [{ label: 'Admin', href: '/admin/dashboard' }]
  let built = '/admin'
  for (const seg of segments) {
    built += `/${seg}`
    const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
    crumbs.push({ label, href: built })
  }
  return crumbs
}

const pageIcons: Record<string, string> = {
  dashboard: '⚡', news: '📰', categories: '📂', authors: '✍️', media: '🖼️',
  advertisements: '📢', comments: '💬', footer: '📋', users: '👥', settings: '⚙️', new: '✏️',
}

interface AdminTopBarProps {
  collapsed: boolean
  setCollapsed: (c: boolean) => void
  user?: any
}

export default function AdminTopBar({ collapsed, setCollapsed, user }: AdminTopBarProps) {
  const pathname = usePathname()
  const crumbs = getBreadcrumb(pathname)
  const [notifOpen, setNotifOpen] = useState(false)
  const currentPage = crumbs[crumbs.length - 1]?.label?.toLowerCase()

  const notifications = [
    { icon: '💬', text: '47 comments pending review', time: '2m ago', unread: true },
    { icon: '📰', text: 'Climate Summit article published', time: '14m ago', unread: true },
    { icon: '👤', text: 'New user registered: Lisa Park', time: '1h ago', unread: false },
    { icon: '📢', text: 'Ad slot "Header Banner" expires soon', time: '3h ago', unread: false },
  ]

  return (
    <header className={`h-[58px] bg-gradient-to-r from-[#172554] via-[#1e1b4b] to-[#311042] flex items-center justify-between px-[26px] fixed top-0 right-0 z-30 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 ${
      collapsed ? 'left-[72px]' : 'left-[232px]'
    }`}>
      
      {/* Breadcrumbs (Toggle Arrow Button REMOVED, text color contrast adjusted for dark background) */}
      <div className="flex items-center gap-1.5">
        {pageIcons[currentPage] && (
          <span className="text-base mr-0.5">{pageIcons[currentPage]}</span>
        )}
        <nav className="flex items-center gap-1.25">
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.25">
              {i > 0 && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              )}
              {i === crumbs.length - 1 ? (
                <span className="text-sm font-bold text-white">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-[13px] text-slate-300 hover:text-white no-underline transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        
        {/* Search Input (Dark Mode style) */}
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 hover:border-white/20 rounded-lg py-1.5 px-3.5 text-[13px] text-slate-300 cursor-text w-[200px] transition-all duration-150">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="flex-1 text-left text-slate-300">Quick search...</span>
          <span className="text-[10px] text-slate-300 bg-white/10 border border-white/10 px-1.25 py-0.25 rounded">⌘K</span>
        </div>

        {/* View Live Site */}
        <Link 
          href="/" 
          target="_blank" 
          className="flex items-center gap-1.25 py-1.5 px-3 border border-white/15 hover:border-white hover:text-white rounded-[7px] text-[12.5px] text-slate-200 no-underline bg-white/5 hover:bg-white/10 transition-all duration-150"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Live Site
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white rounded-lg cursor-pointer py-1.5 px-[9px] flex items-center text-slate-200 transition-all duration-150"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] rounded-full text-[9px] font-extrabold text-white flex items-center justify-center border-2 border-[#1e1b4b]">
              2
            </span>
          </button>

          {notifOpen && (
            <div className="animate-[admin-scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both] absolute top-[calc(100%+8px)] right-0 w-[320px] bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50">
              <div className="p-3.5 border-b border-[#f1f5f9] flex justify-between items-center bg-[#f8fafc]">
                <div className="text-[13px] font-bold text-[#0f172a]">Notifications</div>
                <span className="text-[10px] font-bold bg-[#1e1b4b] text-white px-1.75 py-0.5 rounded-full">2 new</span>
              </div>
              {notifications.map((n, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 p-4 border-b border-[#f8fafc] hover:bg-[#f8fafc] cursor-pointer transition-all duration-100 ${
                    n.unread ? 'bg-[#f0f5ff]/40' : 'bg-white'
                  }`}
                >
                  <div className="w-8 h-8 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg flex items-center justify-center text-base shrink-0">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] text-[#334155] leading-normal font-medium">{n.text}</div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5">{n.time}</div>
                  </div>
                  {n.unread && <div className="w-1.75 h-1.75 bg-[#1e1b4b] rounded-full shrink-0 mt-1" />}
                </div>
              ))}
              <div className="p-4 bg-[#f8fafc] border-t border-[#f1f5f9]">
                <button 
                  onClick={() => setNotifOpen(false)} 
                  className="w-full py-1.75 bg-white border border-[#e2e8f0] rounded-[7px] text-[12px] text-[#374151] cursor-pointer font-semibold shadow-sm hover:border-[#1e1b4b]"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 py-1 px-1 pl-2.5 border border-white/15 hover:border-white rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-150">
          <div className="text-right">
            <div className="text-[12px] font-bold text-white leading-none">{user?.name || 'Admin'}</div>
            <div className="text-[10px] text-slate-300">Super Admin</div>
          </div>
          <div className="w-[30px] h-[30px] rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-[12px] font-extrabold text-white shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.15)] uppercase">
            {(user?.name || 'A').charAt(0)}
          </div>
        </div>
      </div>
    </header>
  )
}
