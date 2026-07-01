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
  settings: Record<string, any>
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: 'bg-[#6366f1]' },
  zinc: { bg: 'bg-zinc-100', text: 'text-zinc-800', border: 'border-zinc-300', accent: 'bg-zinc-850' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-250', accent: 'bg-[#059669]' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-250', accent: 'bg-[#d97706]' },
  crimson: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-250', accent: 'bg-rose-600' }
}

const colorOptions = [
  { value: 'indigo', label: 'Brand Indigo' },
  { value: 'zinc', label: 'Slate Neutral' },
  { value: 'emerald', label: 'Forest Emerald' },
  { value: 'amber', label: 'Warm Amber' },
  { value: 'crimson', label: 'Crimson Alert' }
]

function getDesignOptions(sectionId: string) {
  if (sectionId === 'first-hero') {
    return [
      { value: 'hero-split', label: 'Standard Hero Split' },
      { value: 'hero-full', label: 'Full-Width Hero Card' },
      { value: 'hero-minimal', label: 'Minimal Text Headline' }
    ]
  }
  if (sectionId === 'opinion-column') {
    return [
      { value: 'columns', label: 'Styled Card Columns' },
      { value: 'quote', label: 'Simple Block Quote' },
      { value: 'list', label: 'Compact List' }
    ]
  }
  if (sectionId === 'arts-marketing-pr') {
    return [
      { value: 'spotlight-grid', label: 'Spotlight Grid' },
      { value: 'spotlight-flex', label: 'Horizontal Flex Columns' },
      { value: 'spotlight-text', label: 'Text Bulletins' }
    ]
  }
  return [
    { value: 'grid', label: 'Card Grid Layout' },
    { value: 'magazine', label: 'Magazine Row Layout' },
    { value: 'list', label: 'Compact List Layout' }
  ]
}

export default function HomeLayoutConfigPage() {
  const [sections, setSections] = useState<LayoutSection[]>([])
  const [originalSections, setOriginalSections] = useState<LayoutSection[]>([])
  const [categoriesList, setCategoriesList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  // Navigation / Customizer sub-page state
  const [activeEditId, setActiveEditId] = useState<string | null>(null)
  const [draftSection, setDraftSection] = useState<LayoutSection | null>(null)

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
        }
      } catch (err) {
        console.error('Failed to load layout data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Enter sub-page customization edit mode
  function enterEditMode(section: LayoutSection) {
    setActiveEditId(section.id)
    setDraftSection(JSON.parse(JSON.stringify(section)))
  }

  // Save current section draft edits and exit back to main board
  function saveSectionDraft() {
    if (draftSection) {
      setSections(prev => 
        prev.map(s => s.id === draftSection.id ? draftSection : s)
      )
    }
    setActiveEditId(null)
    setDraftSection(null)
  }

  // Discard section draft edits and exit back to main board
  function cancelSectionEdit() {
    setActiveEditId(null)
    setDraftSection(null)
  }

  // Undo changes: reset Proposed Draft list in memory back to Original live database state
  function undoAllChanges() {
    setSections(JSON.parse(JSON.stringify(originalSections)))
    setMessage('undone')
    setTimeout(() => setMessage(null), 3000)
  }

  // Update field in current draft section
  function updateDraftField(field: keyof LayoutSection, value: any) {
    if (draftSection) {
      setDraftSection({ ...draftSection, [field]: value })
    }
  }

  // Update dynamic setting in current draft section
  function updateDraftSetting(key: string, value: any) {
    if (draftSection) {
      const nextSettings = { ...draftSection.settings, [key]: value }
      setDraftSection({ ...draftSection, settings: nextSettings })
    }
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
          templateName: 'custom',
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

  // Render mock of breaking-news section preview
  const renderBreakingNewsPreview = (sec: LayoutSection) => {
    const isScrolling = sec.settings?.isScrolling !== false
    const bgColor = sec.settings?.bgColor || '#dc2626'
    const textColor = sec.settings?.textColor || '#ffffff'
    const customText = sec.settings?.customText || ''
    const alertText = customText || `Breaking News: Federal grid upgrades active • Stock indexes climb • Supreme Court issues rulings`

    return (
      <div 
        className="p-2.5 px-4 rounded-xl flex items-center gap-3 text-[11.5px] font-bold font-sans overflow-hidden"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span className="bg-white px-2 py-0.5 rounded text-[10px] font-extrabold uppercase select-none tracking-wider shadow-xs shrink-0" style={{ color: bgColor }}>
          BREAKING
        </span>
        {isScrolling ? (
          React.createElement('marquee', { className: 'cursor-default flex-1 font-medium' }, alertText)
        ) : (
          <div className="flex-1 font-medium truncate animate-pulse select-text">{alertText}</div>
        )}
      </div>
    )
  }

  // Render mock of domain-header section preview
  const renderDomainHeaderPreview = (sec: LayoutSection) => {
    const isText = sec.settings?.logoType !== 'image'
    const alignment = sec.settings?.alignment || 'center'
    const logoSize = sec.settings?.logoSize || '36px'
    const logoColor = sec.settings?.logoColor || '#000000'
    const logoImg = sec.settings?.logoImage || ''
    const tagline = sec.settings?.taglineText || 'Truth, Clarity, and Perspective • Independent Journalism'
    const tagSize = sec.settings?.taglineSize || '11px'
    const tagColor = sec.settings?.taglineColor || '#64748b'
    const bgColor = sec.settings?.bgColor || '#ffffff'

    const alignClass = alignment === 'left' ? 'items-start text-left' : alignment === 'right' ? 'items-end text-right' : 'items-center text-center'

    return (
      <div 
        className={`p-6 rounded-2xl flex flex-col justify-center border shadow-xs select-none transition-all ${alignClass}`}
        style={{ backgroundColor: bgColor }}
      >
        {isText ? (
          <h1 
            className="font-serif font-extrabold tracking-tighter uppercase m-0 leading-tight"
            style={{ fontSize: logoSize, color: logoColor }}
          >
            DOMAIN NAME
          </h1>
        ) : (
          <div 
            className="border-2 border-dashed border-slate-350 rounded-lg flex items-center justify-center p-3 text-slate-400 font-bold bg-slate-50 text-xs shrink-0 select-none"
            style={{ width: '200px', height: '50px' }}
          >
            🖼️ {logoImg ? 'Loaded: ' + logoImg.substring(0, 15) + '...' : 'Upload Image Logo'}
          </div>
        )}
        <p 
          className="mt-2 uppercase tracking-widest font-bold font-sans m-0"
          style={{ fontSize: tagSize, color: tagColor }}
        >
          {tagline}
        </p>
      </div>
    )
  }

  // Render mock of category-nav section preview
  const renderCategoryNavPreview = (sec: LayoutSection) => {
    const bgColor = sec.settings?.bgColor || '#ffffff'
    const alignment = sec.settings?.alignment || 'center'
    const searchPlacement = sec.settings?.searchPlacement || 'right'
    const activeDesign = sec.settings?.activeLinkDesign || 'underline'
    const searchPlaceholder = sec.settings?.searchPlaceholder || 'Search articles...'
    const searchBorderColor = sec.settings?.searchBorderColor || '#e4e4e7'
    const searchBorderThickness = sec.settings?.searchBorderThickness || '1px'

    const alignClass = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center'

    return (
      <div 
        className="p-3 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-3 shadow-xs select-none"
        style={{ backgroundColor: bgColor }}
      >
        <nav className={`flex items-center gap-4 text-[12px] font-bold text-slate-800 flex-1 ${alignClass}`}>
          <span className={activeDesign === 'underline' ? 'border-b-2 border-slate-900 pb-0.5' : 'bg-slate-900 text-white px-2 py-0.5 rounded'}>
            All News
          </span>
          <span className="text-slate-500 font-medium hover:text-slate-800">Politics</span>
          <span className="text-slate-500 font-medium hover:text-slate-800">Technology</span>
          <span className="text-slate-500 font-medium hover:text-slate-800">Business</span>
        </nav>

        {searchPlacement !== 'hidden' && (
          <div className={`relative flex items-center w-40 shrink-0 ${searchPlacement === 'left' ? 'order-first' : 'order-last'}`}>
            <input
              type="text"
              readOnly
              placeholder={searchPlaceholder}
              className="w-full bg-slate-50 px-2.5 py-1 text-[11px] rounded outline-none cursor-default font-semibold text-slate-400"
              style={{ borderColor: searchBorderColor, borderWidth: searchBorderThickness, borderStyle: 'solid' }}
            />
            <span className="absolute right-2 text-slate-350 text-[10px]">🔍</span>
          </div>
        )}
      </div>
    )
  }

  // Render standard mock components
  const renderPreviewMock = (section: LayoutSection) => {
    if (section.id === 'breaking-news') return renderBreakingNewsPreview(section)
    if (section.id === 'domain-header') return renderDomainHeaderPreview(section)
    if (section.id === 'category-nav') return renderCategoryNavPreview(section)

    const theme = COLOR_MAP[section.colorTheme] || COLOR_MAP.indigo
    const badgeStyle = `${theme.bg} ${theme.text} ${theme.border} border`
    const borderStyle = section.settings?.borderColor ? `3px solid ${section.settings.borderColor}` : ''
    const customBg = section.settings?.bgColor || '#ffffff'

    switch (section.id) {
      case 'date-section':
        const dateBg = section.settings?.bgColor || '#f8fafc'
        const dateCol = section.settings?.textColor || '#64748b'
        return (
          <div 
            key={section.id} 
            className="p-1 px-3 border rounded-lg text-[10px] font-bold flex justify-between tracking-wide font-mono uppercase"
            style={{ backgroundColor: dateBg, color: dateCol }}
          >
            <span>Wednesday, July 1, 2026</span>
            <span>Washington, D.C.</span>
          </div>
        )
      case 'first-hero':
        if (section.designStyle === 'hero-full') {
          return (
            <div key={section.id} className="border rounded-2xl overflow-hidden shadow-xs flex flex-col gap-2" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
              <div className="h-32 bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-[11px] uppercase">[Featured Image Hero]</div>
              <div className="p-3">
                <span className={`text-[8.5px] font-bold px-1.5 py-0.25 rounded uppercase tracking-wider font-mono ${badgeStyle}`}>{section.title}</span>
                <h4 className="font-serif font-extrabold text-[14px] mt-1 text-slate-800">Grid Expansion Accord Reaches Funding Settlement</h4>
              </div>
            </div>
          )
        }
        if (section.designStyle === 'hero-minimal') {
          return (
            <div key={section.id} className="p-3 bg-white border rounded-xl text-center" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
              <h4 className="font-serif font-extrabold text-[14px] text-slate-900 leading-snug">"Infrastructure Expansion Finalized Under Senate Committee Vote"</h4>
            </div>
          )
        }
        return (
          <div key={section.id} className="grid grid-cols-3 gap-3">
            <div className="col-span-2 border rounded-2xl p-3 flex flex-col justify-between" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
              <div className="h-16 bg-slate-200 rounded-lg" />
              <div className="text-[11.5px] font-bold text-slate-800 mt-2 truncate">Grid Electrification Agreement Passed</div>
            </div>
            <div className="bg-slate-50 border rounded-2xl p-3 text-[10px] font-medium text-slate-400">
              <div className="font-bold border-b pb-0.5 mb-1 text-slate-600 uppercase">TRENDING</div>
              <div className="truncate">Stocks Rally Following</div>
            </div>
          </div>
        )
      case 'opinion-column':
        if (section.designStyle === 'quote') {
          return (
            <div key={section.id} className="p-4 bg-[#faf8f5] border rounded-xl text-center" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
              <blockquote className="text-[11px] italic text-slate-650 leading-relaxed">"Electrifying rural grids will trigger agriculture growth..."</blockquote>
              <cite className="text-[9px] font-bold text-slate-400 block mt-2">— Arthur Pendelton</cite>
            </div>
          )
        }
        return (
          <div key={section.id} className="border p-3 rounded-2xl shadow-xs" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
            <div className="text-[11px] font-bold text-slate-700 mb-1.5">{section.title}</div>
            <div className="grid grid-cols-2 gap-2 text-[10.5px] italic">
              <div className="bg-white p-2 rounded border">"Rural grid upgrades will shape digital agriculture..."</div>
              <div className="bg-white p-2 rounded border">"STARTUPS: Balancing security vs scaling rules..."</div>
            </div>
          </div>
        )
      default:
        // Category blocks
        if (section.designStyle === 'magazine') {
          return (
            <div key={section.id} className="border p-3 rounded-2xl flex gap-3 shadow-xs" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
              <div className="w-14 h-14 bg-slate-150 rounded-lg shrink-0" />
              <div className="flex-grow flex flex-col justify-center gap-1.5">
                <span className={`text-[8px] font-bold w-max px-1.5 py-0.25 rounded uppercase tracking-wider font-mono ${badgeStyle}`}>{section.categorySource}</span>
                <div className="text-[12px] font-bold text-slate-800 line-clamp-1">{section.title} Row Entry</div>
              </div>
            </div>
          )
        }
        if (section.designStyle === 'list') {
          return (
            <div key={section.id} className="border p-3 rounded-2xl flex flex-col gap-1.5 shadow-xs" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
              <div className="text-[11.5px] font-bold text-slate-700 border-b pb-0.5">{section.title}</div>
              <div className="text-[11px] text-slate-600 truncate">▪️ Representative article entry headline one ({section.categorySource})</div>
              <div className="text-[11px] text-slate-600 truncate">▪️ Representative article entry headline two ({section.categorySource})</div>
            </div>
          )
        }
        return (
          <div key={section.id} className="border p-3 rounded-2xl shadow-xs" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
            <div className="flex justify-between items-center mb-2 border-b pb-0.5">
              <span className="text-[11.5px] font-extrabold text-slate-800">{section.title}</span>
              <span className={`text-[8px] font-bold px-1.5 py-0.25 rounded uppercase tracking-wider font-mono ${badgeStyle}`}>{section.categorySource}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-slate-150 rounded" />
              <div className="h-10 bg-slate-150 rounded" />
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 py-24 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-[#6366f1] rounded-full animate-spin"></div>
        <div className="text-[12px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">Loading Homepage Customizer...</div>
      </div>
    )
  }

  // SUB-PAGE EDITOR VIEW: Custom settings panel for the selected active section
  if (activeEditId && draftSection) {
    const isBreaking = draftSection.id === 'breaking-news'
    const isHeader = draftSection.id === 'domain-header'
    const isNav = draftSection.id === 'category-nav'
    const isDate = draftSection.id === 'date-section'

    return (
      <div className="animate-[admin-fade-in_0.35s_ease_both]">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-[11px] text-slate-450 font-bold uppercase tracking-widest flex items-center gap-1 mb-1">
              <span>Homepage Layout</span> ➔ <span>Custom Settings</span>
            </div>
            <h1 className="text-[25px] font-serif font-extrabold text-slate-900 m-0">
              Customize Section: {draftSection.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cancelSectionEdit}
              className="p-2 px-5 bg-white text-slate-650 border rounded-xl text-[12.5px] font-bold hover:bg-slate-50 cursor-pointer transition"
            >
              Cancel & Back
            </button>
            <button
              onClick={saveSectionDraft}
              className="p-2 px-6 bg-[#6366f1] text-white rounded-xl text-[12.5px] font-bold hover:bg-[#4f46e5] cursor-pointer shadow-[0_3px_8px_rgba(99,102,241,0.2)] transition"
            >
              Apply Section Edits
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: OPTIONS CONTROLLER */}
          <div className="bg-white rounded-2xl border p-6 flex flex-col gap-5 shadow-xs">
            <div className="text-[13px] font-extrabold text-[#6366f1] border-b pb-2 tracking-wider uppercase font-sans">
              Layout & Presentation Controls
            </div>

            {/* 1. BREAKING NEWS TICKER SETTINGS */}
            {isBreaking && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Ticker Background Color</label>
                    <input
                      type="color"
                      value={draftSection.settings?.bgColor || '#dc2626'}
                      onChange={(e) => updateDraftSetting('bgColor', e.target.value)}
                      className="w-full h-9 p-0.5 border rounded-lg cursor-pointer bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Ticker Text Color</label>
                    <input
                      type="color"
                      value={draftSection.settings?.textColor || '#ffffff'}
                      onChange={(e) => updateDraftSetting('textColor', e.target.value)}
                      className="w-full h-9 p-0.5 border rounded-lg cursor-pointer bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-[12.5px] font-bold text-slate-800">Auto-Scroll Animation</div>
                    <div className="text-[10px] text-slate-450 mt-0.5 font-medium">If disabled, the ticker remains stationary as a line alert.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={draftSection.settings?.isScrolling !== false}
                      onChange={(e) => updateDraftSetting('isScrolling', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                  </label>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Limit News Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={draftSection.limit}
                    onChange={(e) => updateDraftField('limit', parseInt(e.target.value) || 5)}
                    className="p-2 border rounded-lg text-xs w-full bg-white text-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Custom Ticker Text Override (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Enter manual text override. Leave empty to scroll live breaking articles automatically..."
                    value={draftSection.settings?.customText || ''}
                    onChange={(e) => updateDraftSetting('customText', e.target.value)}
                    className="p-2.5 border rounded-lg text-xs w-full bg-white text-slate-750 outline-none resize-none font-medium"
                  />
                </div>
              </div>
            )}

            {/* 2. LOGO HEADER SETTINGS */}
            {isHeader && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Logo Banner Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateDraftSetting('logoType', 'text')}
                      className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        draftSection.settings?.logoType !== 'image' ? 'border-[#6366f1] bg-indigo-50/40 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Text Typography Logo
                    </button>
                    <button
                      onClick={() => updateDraftSetting('logoType', 'image')}
                      className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        draftSection.settings?.logoType === 'image' ? 'border-[#6366f1] bg-indigo-50/40 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Image Logo Asset
                    </button>
                  </div>
                </div>

                {draftSection.settings?.logoType === 'image' ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Logo Image URL</label>
                    <input
                      type="text"
                      placeholder="/logo-placeholder.png"
                      value={draftSection.settings?.logoImage || ''}
                      onChange={(e) => updateDraftSetting('logoImage', e.target.value)}
                      className="p-2 border rounded-lg text-xs w-full bg-white text-slate-750 outline-none"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Logo Font Color</label>
                      <input
                        type="color"
                        value={draftSection.settings?.logoColor || '#000000'}
                        onChange={(e) => updateDraftSetting('logoColor', e.target.value)}
                        className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Logo Font Size</label>
                      <select
                        value={draftSection.settings?.logoSize || '36px'}
                        onChange={(e) => updateDraftSetting('logoSize', e.target.value)}
                        className="p-2 border rounded-lg text-xs w-full bg-white outline-none cursor-pointer font-bold text-slate-700"
                      >
                        <option value="28px">28px (Compact)</option>
                        <option value="36px">36px (Normal)</option>
                        <option value="48px">48px (Large)</option>
                        <option value="64px">64px (Extra Large)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Logo Alignment</label>
                  <select
                    value={draftSection.settings?.alignment || 'center'}
                    onChange={(e) => updateDraftSetting('alignment', e.target.value)}
                    className="p-2 border rounded-lg text-xs w-full bg-white outline-none cursor-pointer font-bold text-slate-700"
                  >
                    <option value="left">Left Align</option>
                    <option value="center">Center Align</option>
                    <option value="right">Right Align</option>
                  </select>
                </div>

                <div className="border-t pt-3">
                  <label className="text-[12px] font-extrabold text-[#6366f1] block mb-2 uppercase tracking-wide">Subtitle Tagline Settings</label>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-405 block mb-1">Tagline Text</label>
                      <input
                        type="text"
                        value={draftSection.settings?.taglineText || ''}
                        onChange={(e) => updateDraftSetting('taglineText', e.target.value)}
                        className="p-2 border rounded-lg text-xs w-full bg-white text-slate-750 outline-none font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-405 block mb-1">Tagline Color</label>
                        <input
                          type="color"
                          value={draftSection.settings?.taglineColor || '#64748b'}
                          onChange={(e) => updateDraftSetting('taglineColor', e.target.value)}
                          className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-405 block mb-1">Tagline Size</label>
                        <select
                          value={draftSection.settings?.taglineSize || '12px'}
                          onChange={(e) => updateDraftSetting('taglineSize', e.target.value)}
                          className="p-2 border rounded-lg text-xs w-full bg-white outline-none cursor-pointer text-slate-750"
                        >
                          <option value="9px">9px (Micro)</option>
                          <option value="11px">11px (Normal)</option>
                          <option value="12px">12px (Standard)</option>
                          <option value="14px">14px (Large)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Header Background Color</label>
                  <input
                    type="color"
                    value={draftSection.settings?.bgColor || '#ffffff'}
                    onChange={(e) => updateDraftSetting('bgColor', e.target.value)}
                    className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 3. CATEGORIES NAVIGATION SETTINGS */}
            {isNav && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Navbar Background Color</label>
                    <input
                      type="color"
                      value={draftSection.settings?.bgColor || '#ffffff'}
                      onChange={(e) => updateDraftSetting('bgColor', e.target.value)}
                      className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Navbar Alignment</label>
                    <select
                      value={draftSection.settings?.alignment || 'center'}
                      onChange={(e) => updateDraftSetting('alignment', e.target.value)}
                      className="p-2.5 border rounded-lg text-xs w-full bg-white outline-none cursor-pointer text-slate-705 font-bold"
                    >
                      <option value="left">Left Align Links</option>
                      <option value="center">Center Align Links</option>
                      <option value="right">Right Align Links</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Active Category Style</label>
                  <select
                    value={draftSection.settings?.activeLinkDesign || 'underline'}
                    onChange={(e) => updateDraftSetting('activeLinkDesign', e.target.value)}
                    className="p-2.5 border rounded-lg text-xs w-full bg-white outline-none cursor-pointer text-slate-705 font-bold"
                  >
                    <option value="underline">Underline Highlight</option>
                    <option value="capsule">Colored Background Capsule</option>
                  </select>
                </div>

                <div className="border-t pt-3 flex flex-col gap-3">
                  <label className="text-[12px] font-extrabold text-[#6366f1] block uppercase tracking-wide">Search Box Customizations</label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-450 block mb-1">Search Placement</label>
                      <select
                        value={draftSection.settings?.searchPlacement || 'right'}
                        onChange={(e) => updateDraftSetting('searchPlacement', e.target.value)}
                        className="p-2 border rounded-lg text-xs w-full bg-white outline-none text-slate-700"
                      >
                        <option value="left">Aligned Left</option>
                        <option value="right">Aligned Right</option>
                        <option value="hidden">Hidden / Disabled</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-450 block mb-1">Placeholder Text</label>
                      <input
                        type="text"
                        value={draftSection.settings?.searchPlaceholder || ''}
                        onChange={(e) => updateDraftSetting('searchPlaceholder', e.target.value)}
                        className="p-2 border rounded-lg text-xs w-full bg-white text-slate-700 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-455 block mb-1">Border Color</label>
                      <input
                        type="color"
                        value={draftSection.settings?.searchBorderColor || '#e4e4e7'}
                        onChange={(e) => updateDraftSetting('searchBorderColor', e.target.value)}
                        className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-455 block mb-1">Border Thickness</label>
                      <select
                        value={draftSection.settings?.searchBorderThickness || '1px'}
                        onChange={(e) => updateDraftSetting('searchBorderThickness', e.target.value)}
                        className="p-2 border rounded-lg text-xs w-full bg-white outline-none text-slate-700"
                      >
                        <option value="1px">1px (Thin)</option>
                        <option value="2px">2px (Medium)</option>
                        <option value="3px">3px (Thick)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DATE SECTION SETTINGS */}
            {isDate && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Background Color</label>
                    <input
                      type="color"
                      value={draftSection.settings?.bgColor || '#f8fafc'}
                      onChange={(e) => updateDraftSetting('bgColor', e.target.value)}
                      className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Text Color</label>
                    <input
                      type="color"
                      value={draftSection.settings?.textColor || '#64748b'}
                      onChange={(e) => updateDraftSetting('textColor', e.target.value)}
                      className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. STANDARD NEWS SECTIONS SETTINGS */}
            {!isBreaking && !isHeader && !isNav && !isDate && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Design Style</label>
                    <select
                      value={draftSection.designStyle}
                      onChange={(e) => updateDraftField('designStyle', e.target.value)}
                      className="p-2.5 border rounded-lg text-xs w-full bg-white outline-none text-slate-700 font-bold"
                    >
                      {getDesignOptions(draftSection.id).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Color Theme Badge</label>
                    <select
                      value={draftSection.colorTheme}
                      onChange={(e) => updateDraftField('colorTheme', e.target.value)}
                      className="p-2.5 border rounded-lg text-xs w-full bg-white outline-none text-slate-700 font-bold"
                    >
                      {colorOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t pt-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Background Color Override</label>
                    <input
                      type="color"
                      value={draftSection.settings?.bgColor || '#ffffff'}
                      onChange={(e) => updateDraftSetting('bgColor', e.target.value)}
                      className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Top Border Color (Accent)</label>
                    <input
                      type="color"
                      value={draftSection.settings?.borderColor || '#ffffff'}
                      onChange={(e) => updateDraftSetting('borderColor', e.target.value)}
                      className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: FOCUSED SECTION PREVIEW */}
          <div className="flex flex-col gap-3">
            <div className="bg-[#eff6ff] p-3 px-4 border rounded-xl border-blue-200 select-none">
              <span className="text-[12.5px] font-extrabold text-blue-800 tracking-wide uppercase font-sans">
                👁️ Live Section Preview Mockup
              </span>
            </div>
            <div className="bg-slate-100/50 border border-slate-200 rounded-3xl p-6 min-h-[220px] flex flex-col justify-center gap-3">
              {renderPreviewMock(draftSection)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // MAIN DASHBOARD VIEW: Lists the sections and displays stacked dual previews
  return (
    <div className="max-w-[1250px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      {/* Header board */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center text-white gap-4">
        <div>
          <h1 className="text-[26px] font-serif font-extrabold text-white tracking-tight m-0">Modular Homepage Builder</h1>
          <p className="text-[13px] text-slate-300 mt-1 font-medium">Reorder elements globally or click customize to adjust individual alignment, logo files, and marquee scrolls.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undoAllChanges}
            className="bg-white/10 hover:bg-white/20 text-white transition px-4 py-2.5 rounded-xl text-[12.5px] font-bold border border-white/10 cursor-pointer"
          >
            ↩️ Undo Changes
          </button>
          <button
            onClick={saveLayout}
            disabled={saving}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white transition px-5 py-2.5 rounded-xl text-[12.5px] font-bold shadow-[0_4px_12px_rgba(99,102,241,0.2)] cursor-pointer"
          >
            {saving ? '⏳ Publishing...' : '💾 Confirm & Save Changes'}
          </button>
        </div>
      </div>

      {/* Save Message Status Toast */}
      {message === 'success' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-250 text-emerald-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>✓</span> Layout configurations saved successfully! Changes are now live on the homepage.
        </div>
      )}
      {message === 'failed' && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>⚠️</span> Failed to persist changes to the database. Please try again.
        </div>
      )}
      {message === 'undone' && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>↩️</span> Draft layout discarded. Reverted back to the active database configuration.
        </div>
      )}

      {/* Sections Table list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.015)] mb-8 overflow-hidden">
        <div className="p-4 px-5 border-b border-slate-100 bg-[#faf8f5]/20 text-[13px] font-extrabold text-[#6366f1] tracking-wider uppercase font-sans">
          Homepage Layout Sections
        </div>
        <div className="p-5 flex flex-col gap-3">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className={`p-3 px-5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                section.isVisible 
                  ? 'border-slate-200 bg-white shadow-xs hover:border-slate-350'
                  : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              {/* Order & Title */}
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-650 text-[11px] font-extrabold flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-slate-800 text-[13.5px]">{section.title}</div>
                  <div className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    System ID: {section.id}
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-500">
                <div>Style: <span className="text-slate-800 capitalize">{section.designStyle}</span></div>
                <div>Theme: <span className="text-slate-800 capitalize">{section.colorTheme}</span></div>
                <div>Status: {section.isVisible ? <span className="text-emerald-600 font-bold">Visible</span> : <span className="text-slate-400 font-medium">Hidden</span>}</div>
              </div>

              {/* Actions & Move Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => enterEditMode(section)}
                  className="p-1.5 px-3.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-[12px] font-bold cursor-pointer transition-all"
                >
                  ⚙️ Customize Style & Options
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 border rounded-lg hover:border-slate-400 bg-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[11px]"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === sections.length - 1}
                    className="p-1.5 border rounded-lg hover:border-slate-400 bg-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[11px]"
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DUAL COMPILATION PREVIEWS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* LEFT: CURRENT LAYOUT PREVIEW */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-slate-200/60 p-3 px-4 rounded-xl border border-slate-350 select-none">
            <span className="text-[12.5px] font-extrabold text-slate-700 tracking-wide uppercase font-sans">
              ⏮️ BEFORE: Live Website View
            </span>
            <span className="text-[10px] bg-slate-500 text-white font-bold px-2 py-0.5 rounded">
              Active DB State
            </span>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-4 flex flex-col gap-3 min-h-[500px]">
            {originalSections
              .filter(s => s.isVisible)
              .map(sec => (
                <div key={sec.id} className="relative group">
                  <div className="absolute -top-2.5 left-3 bg-slate-500 text-white text-[8px] font-bold px-1.5 py-0.25 rounded opacity-0 group-hover:opacity-100 transition tracking-wide select-none">
                    {sec.title}
                  </div>
                  {renderPreviewMock(sec)}
                </div>
              ))}
          </div>
        </div>

        {/* RIGHT: PROPOSED DRAFT LAYOUT PREVIEW */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-indigo-50 p-3 px-4 rounded-xl border border-indigo-200 select-none">
            <span className="text-[12.5px] font-extrabold text-indigo-850 tracking-wide uppercase font-sans">
              ⏭️ AFTER: Proposed Draft View (Unsaved)
            </span>
            <span className="text-[10px] bg-[#6366f1] text-white font-bold px-2 py-0.5 rounded animate-pulse">
              Interactive Draft Simulation
            </span>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-4 flex flex-col gap-3 min-h-[500px]">
            {sections
              .filter(s => s.isVisible)
              .map(sec => (
                <div key={sec.id} className="relative group">
                  <div className="absolute -top-2.5 left-3 bg-indigo-650 text-white text-[8px] font-bold px-1.5 py-0.25 rounded opacity-0 group-hover:opacity-100 transition tracking-wide select-none">
                    {sec.title}
                  </div>
                  {renderPreviewMock(sec)}
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  )
}
