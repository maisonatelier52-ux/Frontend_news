'use client'

import React, { useState, useEffect } from 'react'

interface LayoutSection {
  id: string
  title: string
  isVisible: boolean
  categorySource: string
  order: number
  limit: number
}

const TEMPLATE_PRESETS: Record<string, LayoutSection[]> = {
  default: [
    { id: 'breaking-news', title: 'Breaking News Ticker', isVisible: true, categorySource: 'All', order: 0, limit: 5 },
    { id: 'date-section', title: 'Date & Info Header', isVisible: true, categorySource: 'All', order: 1, limit: 1 },
    { id: 'domain-header', title: 'Domain Logo Header', isVisible: true, categorySource: 'All', order: 2, limit: 1 },
    { id: 'category-nav', title: 'Categories Navigation', isVisible: true, categorySource: 'All', order: 3, limit: 1 },
    { id: 'first-hero', title: 'Main Hero Story', isVisible: true, categorySource: 'All', order: 4, limit: 5 },
    { id: 'us-politics', title: 'U.S. News & Politics', isVisible: true, categorySource: 'Politics', order: 5, limit: 4 },
    { id: 'finance-markets', title: 'Finance & Markets', isVisible: true, categorySource: 'Business', order: 6, limit: 4 },
    { id: 'opinion-column', title: 'Opinions & Perspectives', isVisible: true, categorySource: 'All', order: 7, limit: 3 },
    { id: 'technology-section', title: 'Tech Pulse', isVisible: true, categorySource: 'Technology', order: 8, limit: 4 },
    { id: 'trending-columns', title: 'Trending Columns', isVisible: true, categorySource: 'All', order: 9, limit: 5 },
    { id: 'world-affairs', title: 'World Affairs', isVisible: true, categorySource: 'World', order: 10, limit: 5 },
    { id: 'arts-marketing-pr', title: 'Culture & Press Spotlight', isVisible: true, categorySource: 'Entertainment,Sports', order: 11, limit: 6 },
    { id: 'latest-news', title: 'The Latest Chronicle Feed', isVisible: true, categorySource: 'All', order: 12, limit: 10 }
  ],
  'grid-focus': [
    { id: 'breaking-news', title: 'Breaking Ticker Alert', isVisible: true, categorySource: 'All', order: 0, limit: 5 },
    { id: 'domain-header', title: 'Top Identity Banner', isVisible: true, categorySource: 'All', order: 1, limit: 1 },
    { id: 'category-nav', title: 'Main Navigation Bar', isVisible: true, categorySource: 'All', order: 2, limit: 1 },
    { id: 'first-hero', title: 'Premium Spotlights', isVisible: true, categorySource: 'All', order: 3, limit: 5 },
    { id: 'technology-section', title: 'Tech & Innovations', isVisible: true, categorySource: 'Technology', order: 4, limit: 6 },
    { id: 'trending-columns', title: 'Popular Columns Now', isVisible: true, categorySource: 'All', order: 5, limit: 5 },
    { id: 'finance-markets', title: 'Markets Monitor', isVisible: true, categorySource: 'Business', order: 6, limit: 4 },
    { id: 'us-politics', title: 'Political Capital', isVisible: true, categorySource: 'Politics', order: 7, limit: 4 },
    { id: 'opinion-column', title: 'Perspectives Forum', isVisible: true, categorySource: 'All', order: 8, limit: 3 },
    { id: 'world-affairs', title: 'International Dispatch', isVisible: true, categorySource: 'World', order: 9, limit: 4 },
    { id: 'arts-marketing-pr', title: 'Entertainment & Corporate', isVisible: true, categorySource: 'Entertainment,Sports', order: 10, limit: 6 },
    { id: 'latest-news', title: 'Chronicle Feed', isVisible: true, categorySource: 'All', order: 11, limit: 8 },
    { id: 'date-section', title: 'Header Metainfo Line', isVisible: false, categorySource: 'All', order: 12, limit: 1 }
  ],
  minimal: [
    { id: 'breaking-news', title: 'Alerts', isVisible: true, categorySource: 'All', order: 0, limit: 8 },
    { id: 'date-section', title: 'Daily Info', isVisible: true, categorySource: 'All', order: 1, limit: 1 },
    { id: 'domain-header', title: 'Logo Header', isVisible: true, categorySource: 'All', order: 2, limit: 1 },
    { id: 'category-nav', title: 'Nav Menu', isVisible: true, categorySource: 'All', order: 3, limit: 1 },
    { id: 'latest-news', title: 'Chronicle Direct Stream', isVisible: true, categorySource: 'All', order: 4, limit: 15 },
    { id: 'trending-columns', title: 'Popular Articles', isVisible: true, categorySource: 'All', order: 5, limit: 5 },
    { id: 'opinion-column', title: 'Guest Voices', isVisible: true, categorySource: 'All', order: 6, limit: 3 },
    { id: 'first-hero', title: 'Featured Hero Story', isVisible: false, categorySource: 'All', order: 7, limit: 1 },
    { id: 'us-politics', title: 'Politics', isVisible: false, categorySource: 'Politics', order: 8, limit: 4 },
    { id: 'finance-markets', title: 'Finance', isVisible: false, categorySource: 'Business', order: 9, limit: 4 },
    { id: 'technology-section', title: 'Technology', isVisible: false, categorySource: 'Technology', order: 10, limit: 4 },
    { id: 'world-affairs', title: 'World Affairs', isVisible: false, categorySource: 'World', order: 11, limit: 4 },
    { id: 'arts-marketing-pr', title: 'Culture', isVisible: false, categorySource: 'Entertainment,Sports', order: 12, limit: 4 }
  ]
}

export default function HomeLayoutConfigPage() {
  const [sections, setSections] = useState<LayoutSection[]>([])
  const [templateName, setTemplateName] = useState('default')
  const [categoriesList, setCategoriesList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  // AI Suggestions
  const [aiOptimizing, setAiOptimizing] = useState(false)
  const [aiExplanation, setAiExplanation] = useState<string | null>(null)

  // Fetch Category options and current Layout
  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch('/api/categories')
        if (catRes.ok) {
          const cats = await catRes.json()
          setCategoriesList(cats.map((c: any) => c.name))
        }

        const layoutRes = await fetch('/api/home-layout')
        if (layoutRes.ok) {
          const layout = await layoutRes.json()
          const sortedSections = (layout.sections as LayoutSection[]).sort((a, b) => a.order - b.order)
          setSections(sortedSections)
          setTemplateName(layout.templateName || 'default')
        }
      } catch (err) {
        console.error('Failed to load layout data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Preset switch
  function applyPreset(preset: string) {
    if (preset === 'current') return
    const defaultData = TEMPLATE_PRESETS[preset]
    if (defaultData) {
      const cloned = JSON.parse(JSON.stringify(defaultData)) as LayoutSection[]
      setSections(cloned.sort((a, b) => a.order - b.order))
      setTemplateName(preset)
      setAiExplanation(null)
    }
  }

  // Update specific field in layout
  function updateSectionField(id: string, field: keyof LayoutSection, value: any) {
    setSections(prev => 
      prev.map(s => {
        if (s.id === id) {
          return { ...s, [field]: value }
        }
        return s
      })
    )
    setTemplateName('custom')
  }

  // Move index up
  function moveUp(index: number) {
    if (index === 0) return
    const copy = [...sections]
    const temp = copy[index]
    copy[index] = copy[index - 1]
    copy[index - 1] = temp

    // Recalculate order index values
    const updated = copy.map((sec, idx) => ({ ...sec, order: idx }))
    setSections(updated)
    setTemplateName('custom')
  }

  // Move index down
  function moveDown(index: number) {
    if (index === sections.length - 1) return
    const copy = [...sections]
    const temp = copy[index]
    copy[index] = copy[index + 1]
    copy[index + 1] = temp

    // Recalculate order index values
    const updated = copy.map((sec, idx) => ({ ...sec, order: idx }))
    setSections(updated)
    setTemplateName('custom')
  }

  // AI Layout Suggestion Heuristic
  function triggerAiHeuristic() {
    setAiOptimizing(true)
    setAiExplanation(null)
    setTimeout(() => {
      // Create an optimized order: Hero first, then Politics, Finance, Tech, Opinions, World, Spotlights, latest, and metadata/tickers on top
      const orderTemplate = ['breaking-news', 'date-section', 'domain-header', 'category-nav', 'first-hero', 'us-politics', 'technology-section', 'finance-markets', 'opinion-column', 'trending-columns', 'world-affairs', 'arts-marketing-pr', 'latest-news']
      const reordered = [...sections].sort((a, b) => {
        const aIdx = orderTemplate.indexOf(a.id)
        const bIdx = orderTemplate.indexOf(b.id)
        return aIdx - bIdx
      }).map((sec, idx) => ({ ...sec, order: idx, isVisible: true }))

      setSections(reordered)
      setTemplateName('custom')
      setAiOptimizing(false)
      setAiExplanation("💡 AI Optimization applied! We rearranged sections to put the 'Main Hero Story' at prime focus, followed by high-retention 'Tech Pulse' and 'US Politics' columns to maximize session depth. Opinions are placed centrally to drive engagement, and header items are visible to maintain easy site navigation.")
    }, 800)
  }

  // Save layout logic
  async function saveLayout() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/home-layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateName,
          sections
        })
      })

      if (res.ok) {
        setMessage('success')
        setTimeout(() => setMessage(null), 4000)
      } else {
        setMessage('failed')
      }
    } catch (err) {
      console.error(err)
      setMessage('failed')
    } finally {
      setSaving(false)
    }
  }

  // Scroll to preview
  function scrollToPreview() {
    const el = document.getElementById('home-layout-preview')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 py-24 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-[#6366f1] rounded-full animate-spin"></div>
        <div className="text-[12px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">Loading Layout Settings...</div>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] animate-[admin-fade-in_0.4s_ease_both]">
      {/* Header card with gradient backdrop */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-4">
        <div className="relative z-10">
          <h1 className="text-[26px] font-serif font-extrabold text-white tracking-tight m-0">Home Page Layout Manager</h1>
          <p className="text-[13px] text-slate-300 mt-1 font-medium">Design and restructure sections of the landing homepage dynamically</p>
        </div>
        <button
          onClick={triggerAiHeuristic}
          disabled={aiOptimizing}
          className="relative z-10 flex items-center gap-1.5 bg-[#4f46e5] text-white hover:bg-[#6366f1] transition-all px-4 py-2 rounded-xl text-[12.5px] font-bold shadow-[0_4px_12px_rgba(79,70,229,0.3)] cursor-pointer"
        >
          {aiOptimizing ? '⏳ Optimizing...' : '💡 Optimize with AI'}
        </button>
      </div>

      {/* Preset selection panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.015)] mb-6 flex flex-col gap-4">
        <div className="text-[13px] font-extrabold text-[#6366f1] tracking-wider uppercase font-sans">Layout Presets</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => applyPreset('default')}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
              templateName === 'default'
                ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="text-[13.5px] font-bold text-slate-800">Default Editorial Layout</div>
            <div className="text-[11px] text-slate-400 font-medium">Traditional columns, hero focus, and complete categories list view.</div>
          </button>

          <button
            onClick={() => applyPreset('grid-focus')}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
              templateName === 'grid-focus'
                ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="text-[13.5px] font-bold text-slate-800">Modern Grid Focus</div>
            <div className="text-[11px] text-slate-400 font-medium">Prioritizes tech cards grid first, showing visual news grids on top.</div>
          </button>

          <button
            onClick={() => applyPreset('minimal')}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
              templateName === 'minimal'
                ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="text-[13.5px] font-bold text-slate-800">Minimal Bulletin Feed</div>
            <div className="text-[11px] text-slate-400 font-medium">Hides visual hero areas and presents a direct list of latest stream.</div>
          </button>
        </div>

        {aiExplanation && (
          <div className="p-3.5 px-4 bg-indigo-50 border border-indigo-200 text-indigo-800 text-[12px] font-semibold rounded-xl leading-relaxed animate-[admin-fade-in_0.3s_ease]">
            {aiExplanation}
          </div>
        )}
      </div>

      {/* Main reordering management table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.015)] mb-6 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#faf8f5]/20">
          <div className="text-[13px] font-extrabold text-[#6366f1] tracking-wider uppercase font-sans">Sections Ordering & Sources</div>
          <button
            onClick={scrollToPreview}
            className="text-[11px] font-bold text-[#6366f1] hover:underline cursor-pointer border-none bg-transparent"
          >
            👁️ Scroll to Live Preview
          </button>
        </div>

        <div className="p-4 flex flex-col gap-2.5">
          {sections.map((section, idx) => {
            const hasCategorySource = !['breaking-news', 'date-section', 'domain-header', 'category-nav', 'opinion-column', 'latest-news', 'trending-columns'].includes(section.id)
            return (
              <div
                key={section.id}
                className={`p-3.5 px-5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  section.isVisible 
                    ? 'border-slate-200 bg-white shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 opacity-60'
                }`}
              >
                {/* Pos & Title */}
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[11px] font-extrabold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionField(section.id, 'title', e.target.value)}
                      className="border-none font-bold text-slate-800 text-[13.5px] outline-none hover:bg-slate-50 focus:bg-slate-50 p-1 rounded w-[220px]"
                    />
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider font-mono">
                      System Key: {section.id}
                    </div>
                  </div>
                </div>

                {/* Settings Inputs */}
                <div className="flex flex-wrap items-center gap-4.5">
                  {/* Category Source */}
                  {hasCategorySource ? (
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Source Category</label>
                      <select
                        value={section.categorySource}
                        onChange={(e) => updateSectionField(section.id, 'categorySource', e.target.value)}
                        className="p-1 px-2 border border-slate-200 rounded-lg text-[12px] bg-white text-slate-700 font-semibold outline-none cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        {categoriesList.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Source Category</label>
                      <span className="text-[12px] text-slate-400 font-bold font-mono">Internal Dynamic</span>
                    </div>
                  )}

                  {/* Limit */}
                  {!['date-section', 'domain-header', 'category-nav'].includes(section.id) && (
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Max Articles</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={section.limit}
                        onChange={(e) => updateSectionField(section.id, 'limit', parseInt(e.target.value) || 3)}
                        className="p-1 border border-slate-200 rounded-lg text-[12px] w-14 text-center bg-white text-slate-700 font-semibold outline-none"
                      />
                    </div>
                  )}

                  {/* Visibility toggle */}
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-400 block mb-1 uppercase tracking-wider text-center">Visible</label>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={section.isVisible}
                        onChange={(e) => updateSectionField(section.id, 'isVisible', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                    </label>
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 border border-slate-200 rounded-lg hover:border-slate-400 text-slate-650 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[11px] font-bold active:translate-y-[1px] transition-all"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === sections.length - 1}
                    className="p-1.5 border border-slate-200 rounded-lg hover:border-slate-400 text-slate-650 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[11px] font-bold active:translate-y-[1px] transition-all"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 flex gap-3.5 justify-end bg-slate-50/30">
          <button
            onClick={scrollToPreview}
            className="p-2.5 px-5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-[13px] cursor-pointer hover:bg-slate-50 transition-all"
          >
            👁️ Preview Layout Below
          </button>
          
          <button
            onClick={saveLayout}
            disabled={saving}
            className="p-2.5 px-6 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-extrabold text-[13px] cursor-pointer shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_15px_rgba(99,102,241,0.35)] transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? '⏳ Saving Layout...' : '💾 Confirm & Save Layout'}
          </button>
        </div>
      </div>

      {/* Save Message Toast */}
      {message === 'success' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12.5px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>✓</span> Homepage layout layout structure has been updated successfully! Loading new configurations.
        </div>
      )}
      {message === 'failed' && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[12.5px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>⚠️</span> Failed to save the custom home layout config. Please verify your connection and try again.
        </div>
      )}

      {/* HOME PAGE DEMO PREVIEW BLOCK */}
      <div id="home-layout-preview" className="mt-12 pt-6 border-t border-slate-200 scroll-mt-20">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-[19px] font-serif font-extrabold text-slate-800 m-0">Live Simulation Preview</h2>
            <p className="text-[12.5px] text-slate-400 mt-1 font-medium">Demonstrates how the layout sections organize on the public homepage. Hiding sections updates the view.</p>
          </div>
          <span className="text-[10px] bg-[#6366f1]/10 text-[#6366f1] font-extrabold px-2 py-0.75 rounded-full select-none tracking-widest uppercase font-mono">
            Interactive Demo
          </span>
        </div>

        {/* Home page visual preview shell */}
        <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(15,23,42,0.06)] p-5 flex flex-col gap-4 font-sans text-slate-800">
          <div className="p-3 bg-white/70 border border-slate-100 rounded-2xl flex items-center gap-2 text-[11px] text-slate-500 font-bold select-none justify-center">
            🖥️ Public Home Page Preview Wireframe
          </div>

          <div className="flex flex-col gap-4">
            {sections
              .filter(s => s.isVisible)
              .map(section => {
                switch (section.id) {
                  case 'breaking-news':
                    return (
                      <div key={section.id} className="bg-red-50 border border-red-150 p-2.5 px-4 rounded-xl flex items-center gap-3 text-[11.5px] font-bold text-red-700 animate-[admin-scale-in_0.2s_ease]">
                        <span className="bg-red-650 text-white font-extrabold px-1.5 py-0.5 rounded text-[10px] uppercase select-none tracking-wider">BREAKING</span>
                        {React.createElement('marquee', { className: 'cursor-default flex-1 font-medium' }, `🚨 ${section.title}: Federal Reserve Announces Rate Decision • Supreme Court Issues Rulings on Environmental Legislation • Tech Stocks Surge Amid AI Breakthroughs`)}
                      </div>
                    )
                  case 'date-section':
                    return (
                      <div key={section.id} className="bg-slate-100/60 p-2 border border-slate-200/50 rounded-xl text-[11px] text-slate-400 font-bold flex justify-between px-4 tracking-wide font-mono uppercase select-none">
                        <span>Wednesday, July 1, 2026</span>
                        <span>Latest Update: 11:30 AM EST</span>
                      </div>
                    )
                  case 'domain-header':
                    return (
                      <div key={section.id} className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col items-center justify-center select-none shadow-sm">
                        <div className="text-[28px] font-serif font-extrabold tracking-tighter text-slate-900 border-b-2 border-slate-900 pb-1 uppercase">
                          The Domain Chronicle
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-2">Independent Journal of Journalism</div>
                      </div>
                    )
                  case 'category-nav':
                    return (
                      <div key={section.id} className="bg-white border border-slate-150 p-3.5 rounded-2xl flex justify-center gap-4 text-[12px] font-bold text-[#6366f1] select-none shadow-sm">
                        <span className="bg-[#6366f1] text-white px-2 py-0.5 rounded cursor-default">All News</span>
                        {categoriesList.slice(0, 5).map(c => (
                          <span key={c} className="hover:text-slate-900 cursor-default">{c}</span>
                        ))}
                        <span className="text-slate-350 cursor-default">More ▾</span>
                      </div>
                    )
                  case 'first-hero':
                    return (
                      <div key={section.id} className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-1">
                        {/* Lead Article (Left 2 cols) */}
                        <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                          <div className="h-44 bg-slate-200 relative">
                            <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[9.5px] font-bold px-2 py-0.5 rounded">Lead Story</div>
                            <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0 p-3 text-white flex items-end font-serif font-extrabold text-[15px]">
                              Bipartisan Infrastructure Grid Expansion Reaches Full Funding Accord
                            </div>
                          </div>
                          <div className="p-4 flex flex-col gap-2">
                            <p className="text-[12px] text-slate-500 leading-relaxed m-0 font-medium">A key Senate committee passed the rural electrification upgrade budget, enabling new utility tech integration.</p>
                            <div className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">By Sarah Johnson · 5 mins read</div>
                          </div>
                        </div>

                        {/* Side Bar Ticker (Right 1 col) */}
                        <div className="bg-white border border-slate-150 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                          <div className="text-[11.5px] font-bold text-slate-800 uppercase tracking-widest border-b pb-1">SIDEBAR SPOTLIGHTS</div>
                          <div className="flex flex-col gap-2.5">
                            <div className="text-[12px] font-bold hover:text-indigo-600 cursor-default leading-snug">Retail Costs Remain Elevated as Inflation Cools</div>
                            <div className="text-[12px] font-bold hover:text-indigo-600 cursor-default leading-snug">Enterprise AI Models Drive Massive Low Latency Drops</div>
                            <div className="text-[12px] font-bold hover:text-indigo-600 cursor-default leading-snug">JWST Captures Deep Stellar Nursery Formations</div>
                          </div>
                        </div>

                        {/* Sub Stories (Right 1 col) */}
                        <div className="bg-white border border-slate-150 rounded-2xl p-4 flex flex-col gap-3 shadow-sm justify-between">
                          <div className="text-[11.5px] font-bold text-slate-800 uppercase tracking-widest border-b pb-1">FEATURED RECENT</div>
                          <div className="flex flex-col gap-2.5">
                            <div className="text-[12.5px] font-bold">Urban Transit Hub Re-zoning Blocked in Local Vote</div>
                            <div className="text-[12.5px] font-bold">Oceanic Heat Records Challenge Marine Ecosystem Resilience</div>
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold font-mono uppercase mt-2">Updated 10m ago</div>
                        </div>
                      </div>
                    )
                  case 'opinion-column':
                    return (
                      <div key={section.id} className="bg-[#fafafa] border border-slate-150 p-5 rounded-2xl flex flex-col gap-4 shadow-sm select-none">
                        <div className="flex justify-between items-center border-b pb-2">
                          <div className="font-serif font-extrabold text-[15px] text-slate-800">{section.title}</div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Perspectives</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border border-slate-150 rounded-xl bg-white flex flex-col justify-between h-32">
                            <blockquote className="text-[11.5px] italic text-slate-600 leading-relaxed">"The Grid Lock: Why rural grid upgrades will shape the digital agriculture boom over the next decade."</blockquote>
                            <cite className="text-[10px] font-bold text-slate-700 not-italic uppercase tracking-wider block mt-2">— Arthur Pendelton</cite>
                          </div>
                          <div className="p-4 border border-slate-150 rounded-xl bg-white flex flex-col justify-between h-32">
                            <blockquote className="text-[11.5px] italic text-slate-600 leading-relaxed">"Market Safety vs Innovation: The balancing act of monetary guidelines in high-tech startups."</blockquote>
                            <cite className="text-[10px] font-bold text-slate-700 not-italic uppercase tracking-wider block mt-2">— Emily Davis</cite>
                          </div>
                          <div className="p-4 border border-slate-150 rounded-xl bg-white flex flex-col justify-between h-32">
                            <blockquote className="text-[11.5px] italic text-slate-600 leading-relaxed">"Beyond GPU scarcity: Software efficiency is emerging as the true constraint of AI scale."</blockquote>
                            <cite className="text-[10px] font-bold text-slate-700 not-italic uppercase tracking-wider block mt-2">— Michael Chen</cite>
                          </div>
                        </div>
                      </div>
                    )
                  case 'us-politics':
                  case 'finance-markets':
                  case 'technology-section':
                  case 'world-affairs':
                    return (
                      <div key={section.id} className="bg-white border border-slate-150 p-5 rounded-2xl flex flex-col gap-3.5 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <div className="font-serif font-extrabold text-[15px] text-slate-800">{section.title}</div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Source: {section.categorySource} (Limit: {section.limit})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {Array.from({ length: Math.min(4, section.limit) }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                              <div className="h-24 bg-slate-150 rounded-xl" />
                              <div className="text-[12.5px] font-bold leading-snug line-clamp-2">Example story headline representing content for category {section.categorySource}</div>
                              <div className="text-[10px] text-slate-400 font-bold font-mono uppercase">2 hours ago</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  case 'trending-columns':
                    return (
                      <div key={section.id} className="bg-white border border-slate-150 p-4 rounded-2xl flex flex-col gap-2.5 shadow-sm select-none">
                        <div className="text-[12px] font-bold text-slate-800 uppercase tracking-widest border-b pb-1">{section.title}</div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2.5 text-[12.5px]">
                            <span className="font-extrabold text-indigo-500 font-mono text-[14px]">01</span>
                            <span className="font-bold hover:text-indigo-650 cursor-default">Federal grid upgrade parameters finalized in Congress</span>
                          </div>
                          <div className="flex items-start gap-2.5 text-[12.5px]">
                            <span className="font-extrabold text-indigo-500 font-mono text-[14px]">02</span>
                            <span className="font-bold hover:text-indigo-650 cursor-default">The software trends behind lower enterprise LLM costs</span>
                          </div>
                          <div className="flex items-start gap-2.5 text-[12.5px]">
                            <span className="font-extrabold text-indigo-500 font-mono text-[14px]">03</span>
                            <span className="font-bold hover:text-indigo-650 cursor-default">Startups face zoning issues for modern energy hubs</span>
                          </div>
                        </div>
                      </div>
                    )
                  case 'arts-marketing-pr':
                    return (
                      <div key={section.id} className="bg-[#fcfbf9] border border-slate-150 p-5 rounded-2xl flex flex-col gap-3.5 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <div className="font-serif font-extrabold text-[15px] text-slate-800">{section.title}</div>
                          <span className="text-[9.5px] bg-[#6366f1]/10 text-[#6366f1] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">Combined spotlight (Limit: {section.limit})</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-white border rounded-xl shadow-xs">
                            <div className="text-[10px] text-indigo-600 font-extrabold uppercase mb-1">Culture & Arts</div>
                            <div className="text-[12.5px] font-bold leading-snug line-clamp-2">Arts Spotlight: New Exhibitions Blend Digital Sculptures and Haptic Displays</div>
                          </div>
                          <div className="p-4 bg-white border rounded-xl shadow-xs">
                            <div className="text-[10px] text-amber-600 font-extrabold uppercase mb-1">Strategy & Growth</div>
                            <div className="text-[12.5px] font-bold leading-snug line-clamp-2">Growth Focus: Hyperlocal Target Campaigns Dominate Retail Strategies</div>
                          </div>
                          <div className="p-4 bg-white border rounded-xl shadow-xs">
                            <div className="text-[10px] text-emerald-600 font-extrabold uppercase mb-1">Corporate Release</div>
                            <div className="text-[12.5px] font-bold leading-snug line-clamp-2">Press Release: Global Logistics Firm Announces Electric Cargo Fleet Rollout</div>
                          </div>
                        </div>
                      </div>
                    )
                  case 'latest-news':
                    return (
                      <div key={section.id} className="bg-white border border-slate-150 p-5 rounded-2xl flex flex-col gap-3.5 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <div className="font-serif font-extrabold text-[15px] text-slate-800">{section.title}</div>
                          <span className="text-[10px] text-slate-400 font-semibold font-mono">Bottom Feed (Max: {section.limit})</span>
                        </div>
                        <div className="flex flex-col gap-3.5">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-4 items-center">
                              <div className="w-14 h-14 bg-slate-150 rounded-xl shrink-0" />
                              <div className="flex-1">
                                <div className="text-[13px] font-bold leading-snug hover:text-indigo-600 cursor-default">Public release headline detailing latest chronicle feed, updates, and events</div>
                                <div className="text-[10.5px] text-slate-400 font-medium mt-1">Written by Editorial Staff · 10 mins ago</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  default:
                    return null
                }
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
