'use client'

import React, { useState, useEffect } from 'react'

interface LayoutSection {
  id: string
  title: string
  isVisible: boolean
  categorySource: string
  order: number
  limit: number
  designStyle: string
  colorTheme: string
}

const TEMPLATE_PRESETS: Record<string, LayoutSection[]> = {
  default: [
    { id: 'breaking-news', title: 'Breaking News Ticker', isVisible: true, categorySource: 'All', order: 0, limit: 5, designStyle: 'ticker-banner', colorTheme: 'crimson' },
    { id: 'date-section', title: 'Date & Info Header', isVisible: true, categorySource: 'All', order: 1, limit: 1, designStyle: 'default', colorTheme: 'zinc' },
    { id: 'domain-header', title: 'Domain Logo Header', isVisible: true, categorySource: 'All', order: 2, limit: 1, designStyle: 'default', colorTheme: 'zinc' },
    { id: 'category-nav', title: 'Categories Navigation', isVisible: true, categorySource: 'All', order: 3, limit: 1, designStyle: 'default', colorTheme: 'indigo' },
    { id: 'first-hero', title: 'Main Hero Story', isVisible: true, categorySource: 'All', order: 4, limit: 5, designStyle: 'hero-split', colorTheme: 'indigo' },
    { id: 'us-politics', title: 'U.S. News & Politics', isVisible: true, categorySource: 'Politics', order: 5, limit: 4, designStyle: 'grid', colorTheme: 'indigo' },
    { id: 'finance-markets', title: 'Finance & Markets', isVisible: true, categorySource: 'Business', order: 6, limit: 4, designStyle: 'grid', colorTheme: 'indigo' },
    { id: 'opinion-column', title: 'Opinions & Perspectives', isVisible: true, categorySource: 'All', order: 7, limit: 3, designStyle: 'columns', colorTheme: 'zinc' },
    { id: 'technology-section', title: 'Tech Pulse', isVisible: true, categorySource: 'Technology', order: 8, limit: 4, designStyle: 'grid', colorTheme: 'indigo' },
    { id: 'trending-columns', title: 'Trending Columns', isVisible: true, categorySource: 'All', order: 9, limit: 5, designStyle: 'list', colorTheme: 'indigo' },
    { id: 'world-affairs', title: 'World Affairs', isVisible: true, categorySource: 'World', order: 10, limit: 5, designStyle: 'grid', colorTheme: 'indigo' },
    { id: 'arts-marketing-pr', title: 'Culture & Press Spotlight', isVisible: true, categorySource: 'Entertainment,Sports', order: 11, limit: 6, designStyle: 'spotlight-grid', colorTheme: 'indigo' },
    { id: 'latest-news', title: 'The Latest Chronicle Feed', isVisible: true, categorySource: 'All', order: 12, limit: 10, designStyle: 'list', colorTheme: 'indigo' }
  ],
  'grid-focus': [
    { id: 'breaking-news', title: 'Breaking Ticker Alert', isVisible: true, categorySource: 'All', order: 0, limit: 5, designStyle: 'ticker-ribbon', colorTheme: 'crimson' },
    { id: 'domain-header', title: 'Top Identity Banner', isVisible: true, categorySource: 'All', order: 1, limit: 1, designStyle: 'default', colorTheme: 'zinc' },
    { id: 'category-nav', title: 'Main Navigation Bar', isVisible: true, categorySource: 'All', order: 2, limit: 1, designStyle: 'default', colorTheme: 'indigo' },
    { id: 'first-hero', title: 'Premium Spotlights', isVisible: true, categorySource: 'All', order: 3, limit: 5, designStyle: 'hero-full', colorTheme: 'emerald' },
    { id: 'technology-section', title: 'Tech & Innovations', isVisible: true, categorySource: 'Technology', order: 4, limit: 6, designStyle: 'grid', colorTheme: 'emerald' },
    { id: 'trending-columns', title: 'Popular Columns Now', isVisible: true, categorySource: 'All', order: 5, limit: 5, designStyle: 'list', colorTheme: 'zinc' },
    { id: 'finance-markets', title: 'Markets Monitor', isVisible: true, categorySource: 'Business', order: 6, limit: 4, designStyle: 'magazine', colorTheme: 'indigo' },
    { id: 'us-politics', title: 'Political Capital', isVisible: true, categorySource: 'Politics', order: 7, limit: 4, designStyle: 'magazine', colorTheme: 'indigo' },
    { id: 'opinion-column', title: 'Perspectives Forum', isVisible: true, categorySource: 'All', order: 8, limit: 3, designStyle: 'quote', colorTheme: 'zinc' },
    { id: 'world-affairs', title: 'International Dispatch', isVisible: true, categorySource: 'World', order: 9, limit: 4, designStyle: 'grid', colorTheme: 'zinc' },
    { id: 'arts-marketing-pr', title: 'Entertainment & Corporate', isVisible: true, categorySource: 'Entertainment,Sports', order: 10, limit: 6, designStyle: 'spotlight-flex', colorTheme: 'amber' },
    { id: 'latest-news', title: 'Chronicle Feed', isVisible: true, categorySource: 'All', order: 11, limit: 8, designStyle: 'list', colorTheme: 'zinc' },
    { id: 'date-section', title: 'Header Metainfo Line', isVisible: false, categorySource: 'All', order: 12, limit: 1, designStyle: 'default', colorTheme: 'zinc' }
  ],
  minimal: [
    { id: 'breaking-news', title: 'Alerts', isVisible: true, categorySource: 'All', order: 0, limit: 8, designStyle: 'ticker-minimal', colorTheme: 'zinc' },
    { id: 'date-section', title: 'Daily Info', isVisible: true, categorySource: 'All', order: 1, limit: 1, designStyle: 'default', colorTheme: 'zinc' },
    { id: 'domain-header', title: 'Logo Header', isVisible: true, categorySource: 'All', order: 2, limit: 1, designStyle: 'default', colorTheme: 'zinc' },
    { id: 'category-nav', title: 'Nav Menu', isVisible: true, categorySource: 'All', order: 3, limit: 1, designStyle: 'default', colorTheme: 'zinc' },
    { id: 'latest-news', title: 'Chronicle Direct Stream', isVisible: true, categorySource: 'All', order: 4, limit: 15, designStyle: 'list', colorTheme: 'zinc' },
    { id: 'trending-columns', title: 'Popular Articles', isVisible: true, categorySource: 'All', order: 5, limit: 5, designStyle: 'list', colorTheme: 'zinc' },
    { id: 'opinion-column', title: 'Guest Voices', isVisible: true, categorySource: 'All', order: 6, limit: 3, designStyle: 'list', colorTheme: 'zinc' },
    { id: 'first-hero', title: 'Featured Hero Story', isVisible: false, categorySource: 'All', order: 7, limit: 1, designStyle: 'hero-minimal', colorTheme: 'zinc' },
    { id: 'us-politics', title: 'Politics', isVisible: false, categorySource: 'Politics', order: 8, limit: 4, designStyle: 'grid', colorTheme: 'zinc' },
    { id: 'finance-markets', title: 'Finance', isVisible: false, categorySource: 'Business', order: 9, limit: 4, designStyle: 'grid', colorTheme: 'zinc' },
    { id: 'technology-section', title: 'Technology', isVisible: false, categorySource: 'Technology', order: 10, limit: 4, designStyle: 'grid', colorTheme: 'zinc' },
    { id: 'world-affairs', title: 'World Affairs', isVisible: false, categorySource: 'World', order: 11, limit: 4, designStyle: 'grid', colorTheme: 'zinc' },
    { id: 'arts-marketing-pr', title: 'Culture', isVisible: false, categorySource: 'Entertainment,Sports', order: 12, limit: 4, designStyle: 'spotlight-grid', colorTheme: 'zinc' }
  ]
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: 'bg-[#6366f1]' },
  zinc: { bg: 'bg-zinc-100', text: 'text-zinc-800', border: 'border-zinc-300', accent: 'bg-zinc-800' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-250', accent: 'bg-[#059669]' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-250', accent: 'bg-[#d97706]' },
  crimson: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-250', accent: 'bg-rose-600' }
}

export default function HomeLayoutConfigPage() {
  const [sections, setSections] = useState<LayoutSection[]>([])
  const [originalSections, setOriginalSections] = useState<LayoutSection[]>([])
  const [templateName, setTemplateName] = useState('default')
  const [categoriesList, setCategoriesList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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
          setOriginalSections(JSON.parse(JSON.stringify(sortedSections)))
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
        setOriginalSections(JSON.parse(JSON.stringify(sections)))
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

  // Helper to retrieve design styles option based on section ID
  function getDesignOptions(id: string) {
    if (id === 'breaking-news') {
      return [
        { value: 'ticker-banner', label: 'Red Banner Flash' },
        { value: 'ticker-ribbon', label: 'Dark High-Contrast Ribbon' },
        { value: 'ticker-minimal', label: 'Minimal Ticker Line' }
      ]
    }
    if (id === 'first-hero') {
      return [
        { value: 'hero-split', label: 'Standard Hero Split' },
        { value: 'hero-full', label: 'Full-Width Hero Card' },
        { value: 'hero-minimal', label: 'Minimal Text Headline' }
      ]
    }
    if (id === 'opinion-column') {
      return [
        { value: 'columns', label: 'Styled Card Columns' },
        { value: 'quote', label: 'Simple Block Quote' },
        { value: 'list', label: 'Compact List' }
      ]
    }
    if (id === 'arts-marketing-pr') {
      return [
        { value: 'spotlight-grid', label: 'Spotlight Grid' },
        { value: 'spotlight-flex', label: 'Horizontal Flex Columns' },
        { value: 'spotlight-text', label: 'Text Bulletins' }
      ]
    }
    if (['date-section', 'domain-header', 'category-nav'].includes(id)) {
      return [{ value: 'default', label: 'Default Structure' }]
    }
    // Standard visual sections (us-politics, technology-section, etc.)
    return [
      { value: 'grid', label: 'Card Grid Layout' },
      { value: 'magazine', label: 'Magazine Row Layout' },
      { value: 'list', label: 'Compact List Layout' }
    ]
  }

  // Pre-defined color theme options
  const colorOptions = [
    { value: 'indigo', label: 'Brand Indigo' },
    { value: 'zinc', label: 'Slate Neutral' },
    { value: 'emerald', label: 'Forest Emerald' },
    { value: 'amber', label: 'Warm Amber' },
    { value: 'crimson', label: 'Crimson Alert' }
  ]

  // Render a specific preview mock section
  const renderPreviewMock = (section: LayoutSection) => {
    const theme = COLOR_MAP[section.colorTheme] || COLOR_MAP.indigo
    const accentColor = theme.accent
    const badgeStyle = `${theme.bg} ${theme.text} ${theme.border} border`

    switch (section.id) {
      case 'breaking-news':
        if (section.designStyle === 'ticker-banner') {
          return (
            <div key={section.id} className="bg-red-600 text-white p-2.5 px-4 rounded-xl flex items-center gap-3 text-[11px] font-bold">
              <span className="bg-white text-red-600 font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">FLASH</span>
              <div className="flex-grow truncate">🚨 {section.title}: Federal Reserve Rates Hold • New Infrastructure Funding Active</div>
            </div>
          )
        }
        if (section.designStyle === 'ticker-ribbon') {
          return (
            <div key={section.id} className="bg-slate-900 text-slate-100 p-2.5 px-4 rounded-xl flex items-center gap-3 text-[11px] font-bold border-l-4 border-red-500">
              <span className="text-red-400 font-extrabold text-[10px]">ALERT</span>
              <div className="flex-grow truncate">📰 {section.title}: Stock Indices Hit Record Highs Following Growth Agreement</div>
            </div>
          )
        }
        return (
          <div key={section.id} className="border-t border-b border-red-200 py-1.5 text-center text-[10.5px] font-bold text-red-650 tracking-wider">
            LATEST: {section.title} — Supreme Court Issues Rulings on Environmental Legislation
          </div>
        )

      case 'date-section':
        return (
          <div key={section.id} className="p-1 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-400 font-bold flex justify-between tracking-wide font-mono uppercase">
            <span>July 1, 2026</span>
            <span>Update: 11:45 AM</span>
          </div>
        )

      case 'domain-header':
        return (
          <div key={section.id} className="bg-white border border-slate-150 p-4 py-6 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-[24px] font-serif font-extrabold tracking-tighter text-slate-900 border-b-2 border-slate-900 pb-1">
              THE DOMAIN CHRONICLE
            </div>
          </div>
        )

      case 'category-nav':
        return (
          <div key={section.id} className="bg-white border border-slate-150 p-2.5 rounded-xl flex justify-between items-center text-[11px] font-bold text-[#6366f1] px-4">
            <div className="flex gap-3">
              <span className="text-slate-900 border-b border-slate-950 pb-0.5">Home</span>
              <span className="text-slate-500 font-medium">US</span>
              <span className="text-slate-500 font-medium">Business</span>
              <span className="text-slate-500 font-medium">Technology</span>
            </div>
            <span className="text-slate-450">🔍 Search...</span>
          </div>
        )

      case 'first-hero':
        if (section.designStyle === 'hero-full') {
          return (
            <div key={section.id} className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs flex flex-col gap-3">
              <div className="h-36 bg-slate-150 flex items-center justify-center text-slate-400 font-bold text-[12px] uppercase">
                [Full-Width Image Area]
              </div>
              <div className="p-4 pt-1">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${badgeStyle}`}>
                  Featured Hero
                </span>
                <h4 className="font-serif font-extrabold text-[15px] mt-2 text-slate-900">
                  Bipartisan Infrastructure Grid Reaches Funding Accord
                </h4>
              </div>
            </div>
          )
        }
        if (section.designStyle === 'hero-minimal') {
          return (
            <div key={section.id} className="p-4 bg-white border border-slate-200 rounded-xl">
              <h4 className="font-serif font-extrabold text-[16px] text-slate-900 text-center leading-snug">
                "Bipartisan Infrastructure Grid Expansion Reaches Full Accord"
              </h4>
              <p className="text-[11px] text-slate-500 text-center mt-1">A key Senate committee finalized utility grid upgrades.</p>
            </div>
          )
        }
        // Standard hero split
        return (
          <div key={section.id} className="grid grid-cols-3 gap-3">
            <div className="col-span-2 bg-white border border-slate-150 rounded-2xl p-3 flex flex-col justify-between">
              <div className="h-20 bg-slate-200 rounded-xl" />
              <div className="text-[12.5px] font-bold text-slate-800 mt-2 line-clamp-1">Infrastructure Grid Finalized</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[10.5px] font-medium text-slate-500">
              <div className="font-bold border-b pb-1 mb-1 text-[11px] text-slate-700">SIDEBAR</div>
              <div className="truncate">Stocks Rise After Agree</div>
            </div>
          </div>
        )

      case 'opinion-column':
        if (section.designStyle === 'quote') {
          return (
            <div key={section.id} className="p-4 bg-[#faf8f5] border border-amber-200/50 rounded-xl text-center">
              <span className="text-[20px] text-amber-500 font-serif block leading-none">“</span>
              <p className="text-[11.5px] italic text-slate-650 leading-relaxed m-0 px-4">
                "The Grid Lock: Why rural utility grid upgrades will shape digital agriculture over the next decade."
              </p>
              <cite className="text-[9.5px] font-bold text-slate-500 block mt-2">— Arthur Pendelton</cite>
            </div>
          )
        }
        if (section.designStyle === 'list') {
          return (
            <div key={section.id} className="bg-white border rounded-xl p-3 flex flex-col gap-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-widest border-b pb-1">OPINIONS</div>
              <div className="text-[11.5px] font-semibold text-indigo-700">Grid upgrades are long overdue • Arthur P.</div>
              <div className="text-[11.5px] font-semibold text-indigo-700">Venture capital is cooling off • Emily D.</div>
            </div>
          )
        }
        // Columns
        return (
          <div key={section.id} className="bg-zinc-50/50 border border-slate-200 p-3.5 rounded-2xl">
            <div className="text-[12px] font-bold text-slate-700 mb-2">{section.title}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2.5 rounded-lg border text-[11px] italic">"Electrifying rural grids will trigger agriculture growth..."</div>
              <div className="bg-white p-2.5 rounded-lg border text-[11px] italic">"STARTUPS: Balancing security vs scaling guidelines..."</div>
            </div>
          </div>
        )

      case 'arts-marketing-pr':
        if (section.designStyle === 'spotlight-flex') {
          return (
            <div key={section.id} className="bg-white border border-slate-150 p-3 rounded-2xl flex items-center justify-between gap-3 text-[11px]">
              <div>
                <span className="text-[#6366f1] font-bold">[Arts]</span> Digital Sculptures Blend Haptics
              </div>
              <div>
                <span className="text-amber-600 font-bold">[Strategy]</span> Hyperlocal Targeting
              </div>
            </div>
          )
        }
        if (section.designStyle === 'spotlight-text') {
          return (
            <div key={section.id} className="bg-[#fcfbf9] border p-3.5 rounded-2xl text-[11.5px] space-y-1.5">
              <div className="font-bold text-slate-800 border-b pb-0.5 mb-1">{section.title}</div>
              <div>🔹 ARTS: Spotlight exhibition starts in London</div>
              <div>🔹 MARKETING: Brands pivot to micro-campaign designs</div>
            </div>
          )
        }
        // Spotlight grid
        return (
          <div key={section.id} className="bg-[#fdfcfb] border border-slate-150 p-3.5 rounded-2xl flex flex-col gap-2">
            <div className="text-[12px] font-bold text-slate-700">{section.title}</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 border rounded-lg text-[10px]"><span className="text-indigo-600 font-bold block">ARTS</span> London Digital Display</div>
              <div className="bg-white p-2 border rounded-lg text-[10px]"><span className="text-amber-600 font-bold block">MARKETING</span> Strategy Shift</div>
              <div className="bg-white p-2 border rounded-lg text-[10px]"><span className="text-emerald-600 font-bold block">PR</span> Corporate electric fleet</div>
            </div>
          </div>
        )

      default:
        // Category feeds / Latest news
        if (section.designStyle === 'magazine') {
          return (
            <div key={section.id} className="bg-white border border-slate-150 p-3.5 rounded-2xl flex gap-3 shadow-xs">
              <div className="w-16 h-16 bg-slate-150 rounded-lg shrink-0" />
              <div className="flex-grow flex flex-col justify-center">
                <span className={`text-[8.5px] font-bold w-max px-1.5 py-0.25 rounded ${badgeStyle}`}>
                  {section.categorySource}
                </span>
                <div className="text-[12.5px] font-bold mt-1 text-slate-800">{section.title} Block Lead Article</div>
              </div>
            </div>
          )
        }
        if (section.designStyle === 'list') {
          return (
            <div key={section.id} className="bg-white border border-slate-150 p-3 rounded-2xl flex flex-col gap-1.5 shadow-xs">
              <div className="text-[12px] font-bold text-slate-700 border-b pb-1">{section.title}</div>
              <div className="text-[11.5px] font-semibold text-slate-600">▪️ Representative article entry title one ({section.categorySource})</div>
              <div className="text-[11.5px] font-semibold text-slate-600">▪️ Representative article entry title two ({section.categorySource})</div>
            </div>
          )
        }
        // Grid
        return (
          <div key={section.id} className="bg-white border border-slate-150 p-3.5 rounded-2xl shadow-xs">
            <div className="flex justify-between items-center mb-2.5 border-b pb-1">
              <span className="text-[12.5px] font-extrabold text-slate-800">{section.title}</span>
              <span className={`text-[8.5px] font-bold px-1.5 py-0.25 rounded ${badgeStyle}`}>
                {section.categorySource}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <div className="h-10 bg-slate-150 rounded-lg" />
                <div className="text-[10px] font-bold truncate">Article Entry One</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-10 bg-slate-150 rounded-lg" />
                <div className="text-[10px] font-bold truncate">Article Entry Two</div>
              </div>
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 py-24 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-[#6366f1] rounded-full animate-spin"></div>
        <div className="text-[12px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">Loading Extreme Layout Manager...</div>
      </div>
    )
  }

  return (
    <div className="max-w-[1250px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      {/* Header card with gradient backdrop */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden border border-white/10 flex justify-between items-center text-white">
        <div className="relative z-10">
          <h1 className="text-[26px] font-serif font-extrabold text-white tracking-tight m-0">Extreme Layout & Design Manager</h1>
          <p className="text-[13px] text-slate-300 mt-1 font-medium">Customize styles, design patterns, and colors for each landing page section individually</p>
        </div>
      </div>

      {/* Preset selection panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.015)] mb-6 flex flex-col gap-4">
        <div className="text-[13px] font-extrabold text-[#6366f1] tracking-wider uppercase font-sans">Template Presets</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => applyPreset('default')}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
              templateName === 'default'
                ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="text-[13.5px] font-bold text-slate-800">Default Editorial Preset</div>
            <div className="text-[11px] text-slate-400 font-medium">Standard columns, crimson alerts ticker, and traditional hero split.</div>
          </button>

          <button
            onClick={() => applyPreset('grid-focus')}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
              templateName === 'grid-focus'
                ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="text-[13.5px] font-bold text-slate-800">Modern Grid Preset</div>
            <div className="text-[11px] text-slate-400 font-medium">Emerald accents, full width visual hero cards, and magazine layout rows.</div>
          </button>

          <button
            onClick={() => applyPreset('minimal')}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
              templateName === 'minimal'
                ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="text-[13.5px] font-bold text-slate-800">Minimal Bulletin Preset</div>
            <div className="text-[11px] text-slate-400 font-medium">Neutral slate color themes, text tickers, and list configurations.</div>
          </button>
        </div>
      </div>

      {/* Main reordering & design management blocks */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.015)] mb-6 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#faf8f5]/20">
          <div className="text-[13px] font-extrabold text-[#6366f1] tracking-wider uppercase font-sans">Section Design Configurations</div>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {sections.map((section, idx) => {
            const hasCategorySource = !['breaking-news', 'date-section', 'domain-header', 'category-nav', 'opinion-column', 'latest-news', 'trending-columns'].includes(section.id)
            const designOpts = getDesignOptions(section.id)
            return (
              <div
                key={section.id}
                className={`p-4 px-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  section.isVisible 
                    ? 'border-slate-200 bg-white shadow-sm hover:border-slate-350'
                    : 'border-slate-200 bg-slate-50/55 opacity-60'
                }`}
              >
                {/* Title & System Key */}
                <div className="flex items-center gap-3.5 min-w-[260px]">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[11px] font-extrabold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionField(section.id, 'title', e.target.value)}
                      className="font-bold text-slate-800 text-[13.5px] border-none focus:bg-slate-50 p-1 px-1.5 rounded outline-none w-[200px]"
                    />
                    <div className="text-[9.5px] text-slate-450 font-bold font-mono mt-0.5 uppercase tracking-wider ml-1">
                      Key: {section.id}
                    </div>
                  </div>
                </div>

                {/* Form configuration fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row flex-wrap items-center gap-4 flex-1">
                  {/* Category Source */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Category Source</label>
                    {hasCategorySource ? (
                      <select
                        value={section.categorySource}
                        onChange={(e) => updateSectionField(section.id, 'categorySource', e.target.value)}
                        className="p-1.5 pr-6 border border-slate-200 rounded-lg text-[11.5px] bg-white text-slate-700 font-semibold outline-none cursor-pointer w-full"
                      >
                        <option value="All">All Categories</option>
                        {categoriesList.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[11.5px] text-slate-400 font-bold font-mono">Dynamic Feed</span>
                    )}
                  </div>

                  {/* Limit */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Max Items</label>
                    {!['date-section', 'domain-header', 'category-nav'].includes(section.id) ? (
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={section.limit}
                        onChange={(e) => updateSectionField(section.id, 'limit', parseInt(e.target.value) || 3)}
                        className="p-1.5 border border-slate-200 rounded-lg text-[11.5px] w-14 text-center bg-white text-slate-700 font-semibold outline-none"
                      />
                    ) : (
                      <span className="text-[11.5px] text-slate-450 font-bold font-mono">N/A</span>
                    )}
                  </div>

                  {/* Design style selection */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Design Style</label>
                    <select
                      value={section.designStyle}
                      onChange={(e) => updateSectionField(section.id, 'designStyle', e.target.value)}
                      className="p-1.5 pr-6 border border-slate-200 rounded-lg text-[11.5px] bg-white text-slate-700 font-semibold outline-none cursor-pointer w-full"
                    >
                      {designOpts.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Color theme selection */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Color Theme</label>
                    <select
                      value={section.colorTheme}
                      onChange={(e) => updateSectionField(section.id, 'colorTheme', e.target.value)}
                      className="p-1.5 pr-6 border border-slate-200 rounded-lg text-[11.5px] bg-white text-slate-700 font-semibold outline-none cursor-pointer w-full"
                    >
                      {colorOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Show toggle */}
                <div className="flex items-center gap-4 border-l lg:border-l-0 border-slate-100 pl-4 lg:pl-0 shrink-0">
                  <div className="text-center">
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Visible</label>
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

                  {/* Move up / down buttons */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1.5 border border-slate-200 rounded-lg hover:border-slate-400 text-slate-650 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[11px] font-bold active:translate-y-[1px] transition-all"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === sections.length - 1}
                      className="p-1.5 border border-slate-200 rounded-lg hover:border-slate-400 text-slate-650 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[11px] font-bold active:translate-y-[1px] transition-all"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer actions block */}
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3.5 bg-slate-50/30">
          <button
            onClick={saveLayout}
            disabled={saving}
            className="p-3 px-8 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-extrabold text-[13.5px] cursor-pointer shadow-[0_4px_12px_rgba(99,102,241,0.2)] transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? '⏳ Saving Custom Layout...' : '💾 Publish & Save Live Layout'}
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {message === 'success' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-250 text-emerald-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>✓</span> Homepage custom layout properties have been saved live! Refreshing dashboard preview frames.
        </div>
      )}
      {message === 'failed' && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>⚠️</span> An error occurred while writing configuration rules to the database.
        </div>
      )}

      {/* SIDE BY SIDE COMPARISON PREVIEWS */}
      <div className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* LEFT: CURRENT LAYOUT PREVIEW */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-slate-200/50 p-3 px-4 rounded-xl border border-slate-350 select-none">
            <span className="text-[12.5px] font-extrabold text-slate-700 tracking-wide uppercase font-sans">
              ⏮️ BEFORE: Current Live Layout
            </span>
            <span className="text-[10px] bg-slate-500 text-white font-bold px-2 py-0.5 rounded">
              Active Database Configuration
            </span>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-4 flex flex-col gap-3 min-h-[500px]">
            {originalSections
              .filter(s => s.isVisible)
              .map(section => renderPreviewMock(section))}
            {originalSections.filter(s => s.isVisible).length === 0 && (
              <div className="text-center py-20 text-slate-400 font-bold text-[12px] uppercase">
                No active layout configurations loaded
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: PROPOSED DRAFT LAYOUT PREVIEW */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-indigo-100 p-3 px-4 rounded-xl border border-indigo-200 select-none shadow-sm">
            <span className="text-[12.5px] font-extrabold text-indigo-850 tracking-wide uppercase font-sans">
              ⏭️ AFTER: Unsaved Proposed Draft
            </span>
            <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded animate-pulse">
              Live Draft Simulation
            </span>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-4 flex flex-col gap-3 min-h-[500px] shadow-sm">
            {sections
              .filter(s => s.isVisible)
              .map(section => renderPreviewMock(section))}
            {sections.filter(s => s.isVisible).length === 0 && (
              <div className="text-center py-20 text-slate-400 font-bold text-[12px] uppercase">
                All sections hidden
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
