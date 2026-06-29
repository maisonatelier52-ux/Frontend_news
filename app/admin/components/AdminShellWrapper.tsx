'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'

export default function AdminShellWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased text-[#1e293b]">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[232px]'}`}>
        
        {/* Top Header */}
        <AdminTopBar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        {/* Main Body */}
        <main className="mt-[58px] p-[28px_30px] flex-1">
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
