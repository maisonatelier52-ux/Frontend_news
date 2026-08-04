'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import StatCard from '../../components/StatCard'
import AdminLoader from '../../components/AdminLoader'
import StatusBadge from '../../components/StatusBadge'

interface StatItem {
  label: string
  value: string | number
  change: string
  positive: boolean
  icon: any
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/analytics/stats')
        if (res.ok) {
          const stats = await res.json()
          setData(stats)
        } else {
          setError('Failed to fetch live statistics')
        }
      } catch (err) {
        setError('Network error loading dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    loadStats();
  }, [])

  if (loading) {
    return <AdminLoader />;
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
        ⚠️ {error || 'Something went wrong while loading analytics. Please reload.'}
      </div>
    )
  }

  const { traffic, countries, daily, content, audit, system } = data;

  const barData = daily.hourlyViews || [];
  const maxBar = Math.max(...barData, 1);

  // Styling helpers
  const progressPercent = (val: number, total: number) => {
    return total > 0 ? `${(val / total) * 100}%` : '0%';
  };

  return (
    <div className="max-w-[1250px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      
      {/* Title Header with Glowing Smudge Gradient Backdrop */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden border border-white/10 text-white">
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-blue-500 rounded-full mix-blend-screen filter blur-2xl opacity-15 pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[40%] w-48 h-48 bg-purple-500 rounded-full mix-blend-screen filter blur-2xl opacity-15 pointer-events-none" />

        <div className="flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-[28px] font-serif font-extrabold text-white tracking-tight m-0">
              Editorial Console
            </h1>
            <p className="text-[13.5px] text-slate-300 mt-1.5 leading-relaxed font-medium">
              Live statistics from user sessions. Connected to news databases and CDN edge.
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-300 text-[11px] font-mono px-3 py-1 rounded-full border border-green-500/30">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
              LIVE DATA UPDATED
            </span>
          </div>
        </div>
      </div>

      {/* Traffic Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Page Views"
          value={traffic.pageViews.toLocaleString()}
          change={`Unique: ${traffic.uniqueVisitors.toLocaleString()}`}
          positive
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatCard
          label="Today's Views"
          value={traffic.today.toLocaleString()}
          change={`Yesterday: ${traffic.yesterday.toLocaleString()}`}
          positive={traffic.today >= traffic.yesterday}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatCard
          label="This Week"
          value={traffic.thisWeek.toLocaleString()}
          change="Last 7 days"
          positive
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          label="This Month"
          value={traffic.thisMonth.toLocaleString()}
          change={`Yearly: ${traffic.yearly.toLocaleString()}`}
          positive
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        
        {/* Left Column - 8 cols */}
        <div className="lg:col-span-8 flex flex-col">

          {/* Articles Distribution by Category Analysis */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-bold text-[14.5px] text-[#1e1b4b] m-0">
                  Articles Analysis by Category
                </h3>
                <span className="text-[11px] font-bold text-slate-500 font-mono">
                  Total Articles: {audit.totalArticles}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(content.categoryBreakdown || []).map((cat: any) => {
                  const percent = audit.totalArticles > 0 ? (cat.count / audit.totalArticles) * 100 : 0;
                  return (
                    <div key={cat.name} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[12.5px] font-sans">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                        <span className="font-bold text-indigo-900">{cat.count} articles</span>
                      </div>
                      <div className="h-[6px] bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{ width: `${percent}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - 4 cols */}
        <div className="lg:col-span-4 flex flex-col">
          
          {/* Server status cards */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] h-full flex flex-col justify-between">
            <div>
              <h3 className="font-sans font-bold text-[14px] text-[#1e1b4b] uppercase tracking-widest m-0 mb-4">
                Infrastructure Status
              </h3>
              <div className="flex flex-col gap-3.5">
                {[
                  { label: 'Portal Engine', status: 'Online', val: 'Vercel Edge', ok: true },
                  { label: 'Database Cluster', status: 'Connected', val: 'MongoDB Atlas', ok: true },
                  { label: 'Server Instance', status: system.serverHealth, ok: true },
                  { label: 'Storage Volume', status: system.storageUsage, ok: true },
                  { label: 'API Endpoint Health', status: system.apiStatus, ok: true },
                  { label: 'Search Indexer', status: system.searchIndexStatus, ok: true },
                  { label: 'Image Compressor', status: system.imageOptimizationStatus, ok: true },
                  { label: 'Sitemap Auto-Gen', status: system.sitemapStatus, ok: true },
                  { label: 'RSS feeds', status: system.rssFeedStatus, ok: true },
                  { label: 'Cache Last Cleared', status: system.lastCacheCleared, ok: false }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-[12.5px]">
                    <span className="text-[#64748b] font-medium font-sans">{item.label}</span>
                    <span className={`font-bold font-mono flex items-center gap-1.5 ${item.ok ? 'text-[#16a34a]' : 'text-slate-600'}`}>
                      {item.ok && <span className="inline-block w-1.5 h-1.5 bg-[#16a34a] rounded-full" />}
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic 3-Column Bottom Row for Content Performance & Quality Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
        
        {/* Most Viewed Content */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-[#f1f5f9] bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-sans font-bold text-[13px] text-[#1e1b4b] uppercase tracking-wider m-0">
                Most Viewed Content
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {content.mostViewedNews.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-[12.5px] font-sans font-medium">
                  No articles found in database.
                </div>
              ) : (
                content.mostViewedNews.slice(0, 5).map((art: any, i: number) => (
                  <div key={i} className="p-3.5 flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <div className="text-[12.5px] text-slate-800 font-semibold truncate max-w-[280px]">
                        {art.title}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Beat: {art.category}
                      </span>
                    </div>
                    <span className="shrink-0 bg-indigo-50 text-[#1e40af] text-[11px] font-bold px-2 py-0.5 rounded">
                      {art.views.toLocaleString()} views
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Least Viewed (Low Velocity) */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-[#f1f5f9] bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-sans font-bold text-[13px] text-[#1e1b4b] uppercase tracking-wider m-0">
                Least Viewed (Low Velocity)
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {content.leastViewedNews.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-[12.5px] font-sans font-medium">
                  No articles found in database.
                </div>
              ) : (
                content.leastViewedNews.slice(0, 5).map((art: any, i: number) => (
                  <div key={i} className="p-3.5 flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <div className="text-[12.5px] text-slate-800 font-semibold truncate max-w-[280px]">
                        {art.title}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Beat: {art.category}
                      </span>
                    </div>
                    <span className="shrink-0 bg-rose-50 text-[#dc2626] text-[11px] font-bold px-2 py-0.5 rounded">
                      {art.views.toLocaleString()} views
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Metadata & Quality Audit */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-[14px] text-[#1e1b4b] uppercase tracking-widest m-0 mb-4">
              Metadata & Quality Audit
            </h3>
            <div className="flex flex-col gap-3.5">
              {[
                { label: 'Broken Images', val: audit.brokenImages, limit: 0, desc: 'Requires replacement' },
                { label: 'Missing Alt Text tags', val: audit.missingAltText, limit: 2, desc: 'Hinders screen-readers' },
                { label: 'Missing Meta Titles', val: audit.missingMetaTitles, limit: 0, desc: 'Truncated in search engines' },
                { label: 'Missing Meta Descriptions', val: audit.missingMetaDescriptions, limit: 0, desc: 'Fails search snippet audits' },
                { label: 'Duplicate Titles', val: audit.duplicateTitles, limit: 0, desc: 'Creates keyword self-cannibalization' }
              ].map((item) => {
                const isIssue = item.val > item.limit;
                return (
                  <div key={item.label} className="flex justify-between items-start gap-4 text-[12px]">
                    <div>
                      <span className="text-slate-800 font-bold block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-sans block">{item.desc}</span>
                    </div>
                    <span className={`font-bold font-mono px-2 py-0.5 rounded ${isIssue ? 'bg-red-50 text-red-650' : 'bg-green-50 text-green-600'}`}>
                      {isIssue ? `⚠ ${item.val}` : '✓ Clear'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center text-[12px]">
            <div>
              <span className="text-slate-800 font-bold">SEO Score Overview</span>
              <span className="text-[10px] text-[#16a34a] font-bold block mt-0.5">Internal Links Health: {audit.internalLinkHealth}</span>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-green-500/25 flex items-center justify-center text-[11px] font-bold text-green-600 shrink-0">
              {audit.seoScore}%
            </div>
          </div>
        </div>

      </div>

    </div>
  )

  function activeHourIndex() {
    return data ? data.daily.hourlyViews.indexOf(Math.max(...data.daily.hourlyViews, 1)) : 0;
  }
}
