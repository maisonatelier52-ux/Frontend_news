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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Left Column - 8 cols */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Daily Hourly Traffic Graph */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-sans font-bold text-[14.5px] text-[#1e1b4b] m-0">
                  Hourly Traffic Distribution
                </h3>
                <p className="text-[12.5px] text-[#64748b] mt-0.5 font-sans">
                  Most active time: <span className="font-bold text-[#1e1b4b]">{daily.mostActiveHour}</span> (Eastern Time)
                </p>
              </div>
              <span className="text-[12px] bg-slate-100 text-[#475569] font-bold px-2.5 py-1 rounded">
                Most Active Day: {daily.mostActiveDay}
              </span>
            </div>
            
            {/* Custom Bar Chart representing hours */}
            <div className="flex items-end gap-1.5 h-[160px] pt-4 overflow-x-auto no-scrollbar">
              {barData.map((val: number, i: number) => (
                <div key={i} className="flex-1 min-w-[12px] flex flex-col items-center gap-2 group">
                  <div
                    className={`w-full rounded-t-[2px] transition-all duration-300 ${
                      i === activeHourIndex() 
                        ? 'bg-[#1e1b4b] shadow-[0_2px_8px_rgba(30,27,75,0.25)]' 
                        : 'bg-[#e2e8f0] group-hover:bg-[#cbd5e1]'
                    }`}
                    style={{ height: `${(val / maxBar) * 110}px` }}
                    title={`${val} views at ${i === 0 ? '12 AM' : i === 12 ? '12 PM' : i > 12 ? `${i - 12} PM` : `${i} AM`}`}
                  />
                  <span className="text-[8px] text-[#94a3b8] font-mono">
                    {i}h
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Articles Distribution by Category Analysis */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
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

          {/* Geographic Visitor Traffic Analysis */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <h3 className="font-sans font-bold text-[14.5px] text-[#1e1b4b] m-0 mb-4">
              Geographic Visitor Traffic Analysis
            </h3>
            
            {countries.topCountries.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-slate-400 py-8">
                <span className="text-3xl mb-2">🌍</span>
                <span className="text-[12.5px] font-bold text-slate-700">No Visitor Traffic Yet</span>
                <span className="text-[11px] mt-1 max-w-[240px] text-slate-500 leading-normal">
                  Real-time country tracking will update automatically as visitors navigate the site.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {countries.topCountries.map((c: any, idx: number) => (
                  <div key={c.code || idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5">
                    <div className="flex justify-between items-center text-[12px] font-sans font-medium">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 text-center rounded bg-indigo-100 text-[10px] font-bold text-indigo-700">{idx + 1}</span>
                        <span className="font-bold text-slate-800">{c.country} ({c.code})</span>
                      </span>
                      <span className="text-slate-700 font-bold">{c.views.toLocaleString()} views ({c.percentage}%)</span>
                    </div>
                    <div className="h-[6px] bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - 4 cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Server status cards */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
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

          {/* CMS Overview Progress (Published vs draft) */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <h3 className="font-sans font-bold text-[14px] text-[#1e1b4b] uppercase tracking-widest m-0 mb-4">
              Content Pipeline
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Published News', value: audit.published, total: audit.totalArticles, color: 'bg-green-600' },
                { label: 'Draft Articles', value: audit.drafts, total: audit.totalArticles, color: 'bg-slate-400' },
                { label: 'Scheduled Releases', value: audit.scheduled, total: audit.totalArticles, color: 'bg-amber-500' },
                { label: 'Pending Editorial Review', value: audit.pendingReview, total: audit.totalArticles, color: 'bg-indigo-600' }
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[12px] font-sans">
                    <span className="text-[#64748b] font-semibold">{item.label}</span>
                    <span className="text-[#1e1b4b] font-bold">{item.value} / {item.total}</span>
                  </div>
                  <div className="h-[5px] bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: progressPercent(item.value, item.total) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Authors Output Analysis */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <h3 className="font-sans font-bold text-[14px] text-[#1e1b4b] uppercase tracking-widest m-0 mb-4">
              Authors Output Analysis
            </h3>
            <div className="flex flex-col gap-3">
              {(content.authorBreakdown || []).map((auth: any) => (
                <div key={auth.name} className="flex justify-between items-center text-[12.5px] p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">{auth.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{auth.category}</span>
                  </div>
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                    {auth.count} articles
                  </span>
                </div>
              ))}
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
