'use client'

import Link from 'next/link'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'

const recentArticles = [
  { id: 1, title: 'US Senate Passes Major Infrastructure Bill', category: 'Politics', author: 'Sarah Johnson', status: 'published', date: 'Jun 29, 2026' },
  { id: 2, title: 'Tech Giants Face New Antitrust Scrutiny in Europe', category: 'Technology', author: 'Michael Chen', status: 'published', date: 'Jun 29, 2026' },
  { id: 3, title: 'Global Markets Rally on Fed Rate Decision', category: 'Business', author: 'Emily Davis', status: 'draft', date: 'Jun 28, 2026' },
  { id: 4, title: 'Climate Summit: Nations Agree on New Targets', category: 'World', author: 'James Wilson', status: 'scheduled', date: 'Jun 30, 2026' },
  { id: 5, title: 'Sports Roundup: World Cup Qualifiers Results', category: 'Sports', author: 'Lisa Park', status: 'published', date: 'Jun 28, 2026' },
]

const barData = [42, 67, 55, 89, 73, 96, 81]
const barDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const maxBar = Math.max(...barData)

export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] animate-[admin-fade-in_0.4s_ease_both]">
      
      {/* Title Header with Glowing Smudge Gradient Backdrop (Equal height/alignment concept, Dark Mesh Style) */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden border border-white/10 text-white">
        {/* Soft smudge blurred overlays */}
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-blue-500 rounded-full mix-blend-screen filter blur-2xl opacity-15 pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[40%] w-48 h-48 bg-purple-500 rounded-full mix-blend-screen filter blur-2xl opacity-15 pointer-events-none" />

        <h1 className="text-[28px] font-serif font-extrabold text-white tracking-tight m-0 relative z-10">
          Dashboard
        </h1>
        <p className="text-[13.5px] text-slate-300 mt-1.5 leading-relaxed relative z-10 font-medium">
          Welcome back. Here's a summary of the editorial portal activities today.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Articles"
          value="1,284"
          change="12 articles"
          positive
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatCard
          label="Published Today"
          value="18"
          change="3 articles"
          positive
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatCard
          label="Active Ad Slots"
          value="9"
          change="2 slots"
          positive={false}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
        />
        <StatCard
          label="Pending Comments"
          value="47"
          change="5 comments"
          positive={false}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-[1fr_320px] gap-4">
        
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          
          {/* Traffic Chart */}
          <div className="bg-white border-none rounded-lg p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-sans font-bold text-[14.5px] text-[#1e1b4b] m-0">
                  Page Views — This Week
                </h3>
                <p className="text-[12.5px] text-[#64748b] mt-0.5">
                  203,415 total views across channels
                </p>
              </div>
              <span className="text-[12.5px] text-[#16a34a] font-bold">
                ↑ 18.4%
              </span>
            </div>
            <div className="flex items-end gap-3.5 h-[130px] pt-4">
              {barData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className={`w-full rounded-t-[3px] transition-all duration-300 ${
                      i === 6 
                        ? 'bg-[#1e1b4b] shadow-[0_2px_8px_rgba(30,27,75,0.2)]' 
                        : 'bg-[#e2e8f0] group-hover:bg-[#cbd5e1]'
                    }`}
                    style={{ height: `${(val / maxBar) * 90}px` }}
                  />
                  <span className="text-[10px] text-[#64748b] font-medium tracking-wide">
                    {barDays[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <div className="p-4 px-5 border-b border-[#f1f5f9] flex justify-between items-center bg-[#faf8f5]/40">
              <h3 className="font-sans font-bold text-[14.5px] text-[#1e1b4b] m-0">
                Recent Articles
              </h3>
              <Link 
                href="/admin/news" 
                className="text-[12.5px] text-[#1e1b4b] hover:underline font-semibold"
              >
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#faf8f5]/20">
                    {['Title', 'Category', 'Author', 'Status', 'Date'].map((h) => (
                      <th 
                        key={h} 
                        className="p-3 px-5 text-left text-[10px] font-bold text-[#64748b] tracking-wider uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.map((art, i) => (
                    <tr 
                      key={art.id} 
                      className={`hover:bg-[#faf8f5]/30 transition-colors duration-150 ${
                        i < recentArticles.length - 1 ? 'border-b border-[#f8fafc]' : ''
                      }`}
                    >
                      <td className="p-3.5 px-5 text-[13.5px] text-[#1e1b4b] font-semibold max-w-[260px] truncate">
                        {art.title}
                      </td>
                      <td className="p-3.5 px-5 text-[12.5px] text-[#64748b]">
                        {art.category}
                      </td>
                      <td className="p-3.5 px-5 text-[12.5px] text-[#64748b]">
                        {art.author}
                      </td>
                      <td className="p-3.5 px-5">
                        <StatusBadge status={art.status as 'published' | 'draft' | 'scheduled'} />
                      </td>
                      <td className="p-3.5 px-5 text-[12px] text-[#94a3b8]">
                        {art.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <h3 className="font-sans font-bold text-[14.5px] text-[#1e1b4b] m-0 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { 
                  label: 'Add New Article', 
                  href: '/admin/news/new', 
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  ) 
                },
                { 
                  label: 'Manage Ads', 
                  href: '/admin/advertisements', 
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  ) 
                },
                { 
                  label: 'Review Comments', 
                  href: '/admin/comments', 
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  ) 
                },
                { 
                  label: 'Upload Media', 
                  href: '/admin/media', 
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  ) 
                },
                { 
                  label: 'Edit Footer', 
                  href: '/admin/footer', 
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                  ) 
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2.5 px-3 py-2 border border-[#e2e8f0] hover:border-[#1e1b4b] hover:text-[#1e1b4b] rounded-lg text-[13px] text-[#475569] hover:bg-[#faf8f5]/40 no-underline font-medium transition-all duration-150"
                >
                  <span className="shrink-0 opacity-75">{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <h3 className="font-sans font-bold text-[14.5px] text-[#1e1b4b] m-0 mb-4">
              System Status
            </h3>
            <div className="flex flex-col gap-3.5">
              {[
                { label: 'Site Status', status: 'Online', ok: true },
                { label: 'Database', status: 'Connected', ok: true },
                { label: 'CDN Edge', status: 'Active', ok: true },
                { label: 'Cache Sync', status: 'Warming', ok: false },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[13px] text-[#64748b] font-medium">{item.label}</span>
                  <span className={`text-[11.5px] font-bold flex items-center gap-1.5 ${item.ok ? 'text-[#16a34a]' : 'text-[#d97706]'}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${item.ok ? 'bg-[#16a34a]' : 'bg-[#d97706]'}`} />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Overview Progress */}
          <div className="bg-white rounded-lg p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <h3 className="font-sans font-bold text-[14.5px] text-[#1e1b4b] m-0 mb-4">
              Content Overview
            </h3>
            <div className="flex flex-col gap-3.5">
              {[
                { label: 'Published', value: 1142, total: 1284, color: 'bg-[#16a34a]' },
                { label: 'Drafts', value: 98, total: 1284, color: 'bg-[#64748b]' },
                { label: 'Scheduled', value: 44, total: 1284, color: 'bg-[#d97706]' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-[#64748b] font-semibold">{item.label}</span>
                    <span className="text-[#64748b] font-medium">{item.value}</span>
                  </div>
                  <div className="h-[5px] bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${(item.value / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
