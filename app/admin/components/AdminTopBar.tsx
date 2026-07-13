'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

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
  const currentPage = crumbs[crumbs.length - 1]?.label?.toLowerCase()

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
            <span key={`${crumb.href}-${i}`} className="flex items-center gap-1.25">
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

        {/* User Profile Avatar */}
        <div className="w-[30px] h-[30px] rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-[12px] font-extrabold text-white shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.15)] border border-white/15 hover:border-white cursor-pointer transition-all duration-150 uppercase">
          {(user?.name || 'A').charAt(0)}
        </div>
      </div>
    </header>
  )
}
