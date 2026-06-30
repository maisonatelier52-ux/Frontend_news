'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'

interface Article {
  _id: string
  title: string
  category: string
  author: string
  status: string
  date: string
  views: string | number
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const newsRes = await fetch('/api/news')
        if (newsRes.ok) {
          const data = await newsRes.json()
          setArticles(data)
        }
        
        const catRes = await fetch('/api/categories')
        if (catRes.ok) {
          const data = await catRes.json()
          setCategories(data.map((c: any) => c.name))
        }
      } catch (err) {
        console.error('Failed to fetch news listing data:', err)
      }
    }
    loadData()
  }, [])

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    const matchCat = filterCategory === 'all' || a.category === filterCategory
    return matchSearch && matchStatus && matchCat
  })

  async function deleteArticle(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a._id !== id))
        setSelected((prev) => prev.filter((i) => i !== id))
      }
    } catch (err) {
      console.error('Delete article error:', err)
    }
  }

  async function toggleVisibility(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setArticles((prev) => 
          prev.map((a) => a._id === id ? { ...a, status: newStatus } : a)
        )
      } else {
        const errData = await res.json()
        alert(errData.error || 'Failed to update article visibility')
      }
    } catch (err) {
      console.error('Toggle visibility error:', err)
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  function toggleAll() {
    if (selected.length === filtered.length && filtered.length > 0) setSelected([])
    else setSelected(filtered.map((a) => a._id))
  }

  return (
    <div className="max-w-[1200px] animate-[admin-fade-in_0.4s_ease_both]">
      
      {/* Header Area (with colorful dark smudge gradient background mesh card) */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden border border-white/10 flex justify-between items-center text-white">
        {/* Soft smudge blurred overlays */}
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-blue-500 rounded-full mix-blend-screen filter blur-2xl opacity-15 pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[40%] w-48 h-48 bg-purple-500 rounded-full mix-blend-screen filter blur-2xl opacity-15 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-[28px] font-serif font-extrabold text-white tracking-tight m-0">
            News Articles
          </h1>
          <p className="text-[13.5px] text-slate-300 mt-1.5 font-medium">
            {articles.length} total articles published across sections
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="relative z-10 flex items-center gap-2 bg-[#1e1b4b] text-white hover:bg-[#2e1f5e] px-4 py-2.5 rounded-lg text-[13px] font-bold shadow-[0_4px_12px_rgba(30,27,75,0.2)] no-underline transition-all duration-150 border border-white/10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Article
        </Link>
      </div>

      {/* Filters (Soft card, borderless, floating layout) */}
      <div className="bg-white rounded-xl p-4 px-5 flex gap-3.5 items-center mb-5 flex-wrap shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        
        {/* Search box */}
        <div className="flex-1 min-w-[220px] flex items-center gap-2.5 bg-[#f8fafc] rounded-lg p-2 px-3.5 border border-transparent focus-within:border-[#1e1b4b]/30 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            id="news-search"
            type="text"
            placeholder="Search articles or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none bg-transparent text-[13px] text-[#1e1b4b] outline-none flex-1 font-medium placeholder-[#94a3b8]"
          />
        </div>

        {/* Status drop */}
        <select
          id="news-filter-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-[#e2e8f0] focus:border-[#1e1b4b]/30 rounded-lg p-2 px-3.5 text-[13px] text-[#475569] bg-white outline-none cursor-pointer font-medium transition-all"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>

        {/* Category drop */}
        <select
          id="news-filter-category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-[#e2e8f0] focus:border-[#1e1b4b]/30 rounded-lg p-2 px-3.5 text-[13px] text-[#475569] bg-white outline-none cursor-pointer font-medium transition-all"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Bulk Action Controls */}
        {selected.length > 0 && (
          <div className="flex gap-2 ml-auto animate-[admin-scale-in_0.2s_ease-both]">
            <button className="px-3.5 py-1.75 text-[12px] font-bold border border-[#e2e8f0] hover:border-[#1e1b4b] rounded-lg bg-white cursor-pointer text-[#475569] hover:text-[#1e1b4b] transition-all">
              Publish ({selected.length})
            </button>
            <button className="px-3.5 py-1.75 text-[12px] font-bold border border-[#fee2e2] hover:border-[#ef4444] rounded-lg bg-white cursor-pointer text-[#ef4444] hover:bg-[#fef2f2] transition-all">
              Delete ({selected.length})
            </button>
          </div>
        )}
      </div>

      {/* Main Table Card (Borderless container with soft shadow) */}
      <div className="bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#faf8f5]/50 border-b border-[#f1f5f9]">
                <th className="p-4 px-5 w-9 text-left">
                  <input 
                    type="checkbox" 
                    checked={selected.length === filtered.length && filtered.length > 0} 
                    onChange={toggleAll} 
                    className="cursor-pointer rounded border-[#cbd5e1] text-[#1e1b4b] focus:ring-[#1e1b4b]/30" 
                  />
                </th>
                {['Title', 'Category', 'Author', 'Views', 'Status', 'Date', 'Actions'].map((h) => (
                  <th 
                    key={h} 
                    className="p-4 px-3 text-left text-[10px] font-bold text-[#64748b] tracking-wider uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#94a3b8] text-[13.5px] font-medium">
                    No articles found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((art, i) => (
                  <tr 
                    key={art._id} 
                    className={`hover:bg-[#faf8f5]/30 transition-colors duration-150 ${
                      i < filtered.length - 1 ? 'border-b border-[#f8fafc]' : ''
                    } ${
                      selected.includes(art._id) ? 'bg-[#eff6ff]/35' : ''
                    }`}
                  >
                    <td className="p-4 px-5">
                      <input 
                        type="checkbox" 
                        checked={selected.includes(art._id)} 
                        onChange={() => toggleSelect(art._id)} 
                        className="cursor-pointer rounded border-[#cbd5e1] text-[#1e1b4b] focus:ring-[#1e1b4b]/30" 
                      />
                    </td>
                    <td className="p-4 px-3 max-w-[280px] truncate font-semibold text-[#1e1b4b] text-[13.5px]">
                      {art.title}
                    </td>
                    <td className="p-4 px-3 text-[12.5px] text-[#64748b] whitespace-nowrap">
                      {art.category}
                    </td>
                    <td className="p-4 px-3 text-[12.5px] text-[#64748b] whitespace-nowrap">
                      {art.author}
                    </td>
                    <td className="p-4 px-3 text-[12.5px] text-[#64748b] whitespace-nowrap">
                      {art.views || 0}
                    </td>
                    <td className="p-4 px-3">
                      <StatusBadge status={art.status as 'published' | 'draft' | 'scheduled'} />
                    </td>
                    <td className="p-4 px-3 text-[12px] text-[#94a3b8] whitespace-nowrap">
                      {new Date(art.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleVisibility(art._id, art.status)}
                          className={`text-[12px] font-semibold p-1.5 px-3 rounded-md border cursor-pointer transition-all flex items-center gap-1.5 ${
                            art.status === 'published'
                              ? 'text-emerald-700 hover:bg-emerald-50 border-emerald-200 hover:border-emerald-500 bg-transparent'
                              : 'text-slate-500 hover:bg-slate-50 border-slate-200 hover:border-slate-400 bg-transparent'
                          }`}
                          title="Toggle visibility status"
                        >
                          {art.status === 'published' ? '👁️ Hide' : '👁️ Show'}
                        </button>
                        <Link 
                          href={`/admin/news/new?id=${art._id}`} 
                          className="text-[12px] font-semibold text-[#475569] hover:text-[#1e1b4b] bg-[#f8fafc] hover:bg-[#eff6ff] p-1.5 px-3 rounded-md border border-[#e2e8f0] hover:border-[#1e1b4b] no-underline transition-all"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => deleteArticle(art._id)}
                          className="text-[12px] font-semibold text-[#ef4444] hover:bg-[#fef2f2] p-1.5 px-3 rounded-md border border-[#fee2e2] hover:border-[#ef4444] bg-transparent cursor-pointer transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginator Footer */}
        <div className="p-4 px-5 border-t border-[#f1f5f9] flex justify-between items-center bg-[#faf8f5]/20">
          <span className="text-[12.5px] text-[#64748b]">
            Showing {filtered.length} of {articles.length} articles
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((p) => (
              <button 
                key={p} 
                className={`w-7.5 h-7.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                  p === 1 
                    ? 'bg-[#1e1b4b] text-white shadow-[0_2px_6px_rgba(30,27,75,0.2)]' 
                    : 'bg-white border border-[#e2e8f0] text-[#475569] hover:border-[#1e1b4b] hover:text-[#1e1b4b]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
