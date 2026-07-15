'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'
import AdminLoader from './AdminLoader'

export default function AdminShellWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setUser(data.user)
        setLoading(false)
      } catch (err) {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          {/* Custom Spinner */}
          {/* <div className="w-10 h-10 border-4 border-slate-700 border-t-[#6366f1] rounded-full animate-spin"></div> */}
          {/* <div className="text-[14px] font-bold tracking-tight text-slate-350">
            Loading Editor Console...
          </div> */}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased text-[#1e293b]">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[232px]'}`}>
        
        {/* Top Header */}
        <AdminTopBar collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
        
        {/* Main Body */}
        <main className="mt-[58px] p-[28px_30px] flex-1 min-w-0">
          {children}
        </main>
        
        {/* Footer with borderless layout */}
        <footer className="p-[16px_30px] flex justify-between items-center bg-white/40 text-[#64748b] text-[12px]">
          <span>© 2026 NewsAdmin. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            v2.4.1 · <span className="inline-block w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" /> All systems operational
          </span>
        </footer>
      </div>
    </div>
  )
}
