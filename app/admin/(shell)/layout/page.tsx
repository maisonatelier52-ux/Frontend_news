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
  const [previewTab, setPreviewTab] = useState<'draft' | 'live'>('draft')

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
      let nextSections = sections.map(s => s.id === draftSection.id ? draftSection : s)

      // If this is date-section and vertical placement preset changed, let's adjust array position!
      if (draftSection.id === 'date-section') {
        const preset = draftSection.settings?.verticalPreset || 'above-header'
        const filtered = nextSections.filter(s => s.id !== 'date-section')
        const headerIdx = filtered.findIndex(s => s.id === 'domain-header')
        const navIdx = filtered.findIndex(s => s.id === 'category-nav')

        if (preset === 'above-header') {
          if (headerIdx !== -1) {
            filtered.splice(headerIdx, 0, draftSection)
          } else {
            filtered.unshift(draftSection)
          }
        } else if (preset === 'below-header') {
          if (headerIdx !== -1) {
            filtered.splice(headerIdx + 1, 0, draftSection)
          } else {
            filtered.push(draftSection)
          }
        } else if (preset === 'below-nav') {
          if (navIdx !== -1) {
            const newNavIdx = filtered.findIndex(s => s.id === 'category-nav')
            filtered.splice(newNavIdx + 1, 0, draftSection)
          } else {
            filtered.push(draftSection)
          }
        }

        nextSections = filtered.map((s, idx) => ({ ...s, order: idx }))
      }

      // If this is breaking-news and vertical preset changed, let's adjust array position!
      if (draftSection.id === 'breaking-news') {
        const preset = draftSection.settings?.verticalPreset || 'above-header'
        const filtered = nextSections.filter(s => s.id !== 'breaking-news')
        const headerIdx = filtered.findIndex(s => s.id === 'domain-header')
        const navIdx = filtered.findIndex(s => s.id === 'category-nav')

        if (preset === 'above-header') {
          if (headerIdx !== -1) {
            filtered.splice(headerIdx, 0, draftSection)
          } else {
            filtered.unshift(draftSection)
          }
        } else if (preset === 'below-header') {
          if (headerIdx !== -1) {
            filtered.splice(headerIdx + 1, 0, draftSection)
          } else {
            filtered.push(draftSection)
          }
        } else if (preset === 'below-nav') {
          if (navIdx !== -1) {
            const newNavIdx = filtered.findIndex(s => s.id === 'category-nav')
            filtered.splice(newNavIdx + 1, 0, draftSection)
          } else {
            filtered.push(draftSection)
          }
        }

        nextSections = filtered.map((s, idx) => ({ ...s, order: idx }))
      }

      setSections(nextSections)
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

  // Helper to determine animation speed and Tailwind/CSS anim class
  const getAnimationClassAndStyles = (animation: string, speedSetting?: number) => {
    let animClass = ''
    let defaultSpeed = 28
    if (animation === 'flash-fast' || animation === 'glitch-shiver') {
      defaultSpeed = 0.8
    } else if (animation === 'fade' || animation === 'zoom-pulse' || animation === 'vertical-roll') {
      defaultSpeed = 3
    } else if (animation === 'bounce-reveal' || animation === 'shimmer') {
      defaultSpeed = 2
    }
    const speed = speedSetting || defaultSpeed

    switch (animation) {
      case 'fade':
        animClass = 'animate-custom-fade'
        break
      case 'vertical-roll':
        animClass = 'animate-vertical-roll'
        break
      case 'zoom-pulse':
        animClass = 'animate-zoom-pulse'
        break
      case 'flash-fast':
        animClass = 'animate-flash-fast'
        break
      case 'glitch-shiver':
        animClass = 'animate-glitch-shiver'
        break
      case 'slide-reveal':
        animClass = 'animate-slide-reveal'
        break
      case 'bounce-reveal':
        animClass = 'animate-bounce-reveal'
        break
      case 'shimmer':
        animClass = 'animate-shimmer'
        break
      case 'static':
        animClass = ''
        break
      case 'scroll':
      default:
        animClass = 'animate-custom-scroll'
        break
    }
    return { animClass, speed }
  }

  // Render EXACT live StockTicker replica — pixel-perfect match of what appears on the news site
  // Uses the same classes, colors, structure as Widgets.tsx StockTicker
  const renderExactLiveTicker = (sec: LayoutSection) => {
    const savedBg = sec.settings?.bgColor || '#09090b'
    const savedTextColor = sec.settings?.textColor || '#ffffff'
    const savedPrefix = sec.settings?.prefixText || 'BREAKING NEWS'
    const hidePrefix = sec.settings?.hidePrefix === true
    const isBlinking = sec.settings?.isBlinking !== false
    const animation = sec.settings?.animation || 'scroll'
    const scrollSpeed = sec.settings?.scrollSpeed
    const borderStyle = sec.settings?.borderStyle || 'none'
    const borderColor = sec.settings?.borderColor || '#e2e8f0'
    const borderCss = borderStyle === 'thin' ? `1px solid ${borderColor}` : borderStyle === 'thick' ? `3px solid ${borderColor}` : 'none'

    const sampleHeadlines = [
      'Federal Grid Expansion Accord Reaches Funding Settlement',
      'Stock Indexes Climb Amid Fed Rate Decision',
      'Supreme Court Issues Landmark Rulings on Digital Privacy',
      'Tech Giants Report Record Quarterly Earnings',
      'International Climate Summit Reaches Agreement'
    ]
    const alertText = sec.settings?.customText || sampleHeadlines.join('   •   ')

    const blinkClass = isBlinking ? 'animate-pulse' : ''
    const { animClass, speed } = getAnimationClassAndStyles(animation, scrollSpeed)

    const styleBlock = (
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes custom-fade {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
        @keyframes vertical-roll {
          0%, 100% { transform: translateY(100%); opacity: 0; }
          10%, 90% { transform: translateY(0); opacity: 1; }
          95% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes zoom-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes flash-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.05; }
        }
        @keyframes glitch-shiver {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-1.5px, 0.5px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, -0.5px); }
          80% { transform: translate(1.5px, 1px); }
        }
        @keyframes slide-reveal {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounce-reveal {
          0%, 100%, 20%, 50%, 80% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-2.5px); }
        }
        @keyframes shimmer-sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-custom-scroll {
          animation: ticker-scroll var(--ticker-duration, 28s) linear infinite;
        }
        .animate-custom-fade {
          animation: custom-fade var(--ticker-duration, 3s) ease-in-out infinite;
        }
        .animate-vertical-roll {
          animation: vertical-roll var(--ticker-duration, 3s) ease-in-out infinite;
        }
        .animate-zoom-pulse {
          animation: zoom-pulse var(--ticker-duration, 3s) ease-in-out infinite;
        }
        .animate-flash-fast {
          animation: flash-fast var(--ticker-duration, 0.8s) steps(2, start) infinite;
        }
        .animate-glitch-shiver {
          animation: glitch-shiver var(--ticker-duration, 0.5s) linear infinite;
        }
        .animate-slide-reveal {
          animation: slide-reveal var(--ticker-duration, 0.8s) ease-out forwards;
        }
        .animate-bounce-reveal {
          animation: bounce-reveal var(--ticker-duration, 2s) ease infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, currentColor 25%, #a855f7 50%, currentColor 75%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-sweep var(--ticker-duration, 2.5s) linear infinite;
        }
      `}} />
    )

    const renderTextContent = () => {
      if (animation === 'scroll') {
        return (
          <div className="relative w-full overflow-hidden flex items-center">
            <div 
              className={`flex items-center whitespace-nowrap gap-12 ${animClass}`}
              style={{ '--ticker-duration': `${speed}s` } as React.CSSProperties}
            >
              {[...sampleHeadlines, ...sampleHeadlines, ...sampleHeadlines].map((headline, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                  <span className="font-semibold" style={{ color: savedTextColor === '#ffffff' ? '#f4f4f5' : savedTextColor }}>
                    {headline}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )
      }

      return (
        <div 
          className={`flex-1 font-medium truncate ${animClass}`}
          style={{ '--ticker-duration': `${speed}s` } as React.CSSProperties}
        >
          {alertText}
        </div>
      )
    }

    return (
      <div
        className="w-full overflow-hidden py-2 border-b border-zinc-800 text-[11px] font-mono select-none"
        style={{ backgroundColor: savedBg, color: savedTextColor, border: borderCss }}
      >
        {styleBlock}
        <div className="flex items-center">
          {!hidePrefix && (
            <div
              className={`bg-red-700 text-white font-bold px-3 py-0.5 uppercase tracking-wider text-[9px] mr-4 flex-shrink-0 ${blinkClass}`}
              style={{ backgroundColor: '#b91c1c' }}
            >
              {savedPrefix}
            </div>
          )}
          {renderTextContent()}
        </div>
      </div>
    )
  }

  // Render mock of breaking-news section preview
  const renderBreakingNewsPreview = (sec: LayoutSection) => {
    const bgColor = sec.settings?.bgColor || '#09090b'
    const textColor = sec.settings?.textColor || '#ffffff'
    const customText = sec.settings?.customText || ''
    const alertText = customText || `Federal grid upgrades active • Stock indexes climb • Supreme Court issues rulings`

    const hidePrefix = sec.settings?.hidePrefix === true
    const prefixText = sec.settings?.prefixText || 'BREAKING NEWS'
    const isBlinking = sec.settings?.isBlinking !== false
    const containerStyle = sec.settings?.containerStyle || 'original'
    const animation = sec.settings?.animation || 'scroll'
    const scrollSpeed = sec.settings?.scrollSpeed
    
    const borderStyle = sec.settings?.borderStyle || 'none'
    const borderColor = sec.settings?.borderColor || '#e2e8f0'

    const borderCss = borderStyle === 'thin' ? `1px solid ${borderColor}` : borderStyle === 'thick' ? `3px solid ${borderColor}` : 'none'
    const blinkClass = isBlinking ? 'animate-pulse' : ''

    const { animClass, speed } = getAnimationClassAndStyles(animation, scrollSpeed)

    const styleBlock = (
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes custom-fade {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
        @keyframes vertical-roll {
          0%, 100% { transform: translateY(100%); opacity: 0; }
          10%, 90% { transform: translateY(0); opacity: 1; }
          95% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes zoom-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes flash-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.05; }
        }
        @keyframes glitch-shiver {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-1.5px, 0.5px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, -0.5px); }
          80% { transform: translate(1.5px, 1px); }
        }
        @keyframes slide-reveal {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounce-reveal {
          0%, 100%, 20%, 50%, 80% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-2.5px); }
        }
        @keyframes shimmer-sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-custom-scroll {
          animation: ticker-scroll var(--ticker-duration, 28s) linear infinite;
        }
        .animate-custom-fade {
          animation: custom-fade var(--ticker-duration, 3s) ease-in-out infinite;
        }
        .animate-vertical-roll {
          animation: vertical-roll var(--ticker-duration, 3s) ease-in-out infinite;
        }
        .animate-zoom-pulse {
          animation: zoom-pulse var(--ticker-duration, 3s) ease-in-out infinite;
        }
        .animate-flash-fast {
          animation: flash-fast var(--ticker-duration, 0.8s) steps(2, start) infinite;
        }
        .animate-glitch-shiver {
          animation: glitch-shiver var(--ticker-duration, 0.5s) linear infinite;
        }
        .animate-slide-reveal {
          animation: slide-reveal var(--ticker-duration, 0.8s) ease-out forwards;
        }
        .animate-bounce-reveal {
          animation: bounce-reveal var(--ticker-duration, 2s) ease infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, currentColor 25%, #a855f7 50%, currentColor 75%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-sweep var(--ticker-duration, 2.5s) linear infinite;
        }
      `}} />
    )

    const renderTextContent = () => {
      if (animation === 'scroll') {
        return (
          <div className="relative w-full overflow-hidden flex items-center">
            <div 
              className={`flex items-center whitespace-nowrap gap-12 ${animClass}`}
              style={{ '--ticker-duration': `${speed}s` } as React.CSSProperties}
            >
              <span className="flex items-center gap-2 font-medium">{alertText}</span>
              <span className="flex items-center gap-2 font-medium">{alertText}</span>
              <span className="flex items-center gap-2 font-medium">{alertText}</span>
            </div>
          </div>
        )
      }

      return (
        <div 
          className={`flex-1 font-medium truncate select-text ${animClass}`}
          style={{ '--ticker-duration': `${speed}s` } as React.CSSProperties}
        >
          {alertText}
        </div>
      )
    }

    let containerClass = ''
    let containerStyleInline: React.CSSProperties = {}

    // Original flush design — EXACT pixel-perfect match of the live StockTicker / renderExactLiveTicker
    if (containerStyle === 'original') {
      const sampleItems = alertText
        ? alertText.split('   •   ')
        : [
            'Federal grid upgrades active',
            'Stock indexes climb',
            'Supreme Court issues rulings',
          ]
      return (
        <div
          className="w-full overflow-hidden py-2 border-b border-zinc-800 text-[11px] font-mono"
          style={{ backgroundColor: bgColor, color: textColor, border: borderCss || undefined }}
        >
          {styleBlock}
          <div className="flex items-center">
            {!hidePrefix && prefixText && (
              <div
                className={`text-white font-bold px-3 py-0.5 uppercase tracking-wider text-[9px] mr-4 flex-shrink-0 ${blinkClass}`}
                style={{ backgroundColor: '#b91c1c' }}
              >
                {prefixText}
              </div>
            )}
            <div className="relative w-full overflow-hidden flex items-center">
              <div
                className={`flex items-center whitespace-nowrap gap-12 ${animClass}`}
                style={{ '--ticker-duration': `${speed}s` } as React.CSSProperties}
              >
                {[...sampleItems, ...sampleItems, ...sampleItems].map((item, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                    <span className="font-semibold" style={{ color: textColor === '#ffffff' ? '#f4f4f5' : textColor }}>
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    switch (containerStyle) {
      case 'capsule':
        containerClass = 'rounded-full px-5 py-2.5'
        break
      case 'sharp-bar':
        containerClass = 'rounded-none px-4 py-2.5'
        break
      case 'soft-box':
        containerClass = 'rounded-xl px-4 py-2.5'
        break
      case 'framed-box':
        containerClass = 'rounded-xl border-2 px-4 py-2.5'
        containerStyleInline.backgroundColor = 'transparent'
        break
      case 'left-accent':
        containerClass = 'rounded-none px-4 py-2.5'
        containerStyleInline.borderLeft = `8px solid ${borderColor || '#dc2626'}`
        break
      case 'dotted-panel':
        containerClass = 'rounded-lg border-2 border-dotted px-4 py-2.5'
        break
      case 'glassmorphism':
        containerClass = 'backdrop-blur-md border border-white/20 rounded-2xl px-5 py-2.5 shadow-sm'
        containerStyleInline.backgroundColor = 'rgba(255, 255, 255, 0.12)'
        break
      case 'diagonal-gradient':
        containerClass = 'rounded-none px-4 py-2.5'
        containerStyleInline.backgroundImage = `linear-gradient(135deg, ${bgColor} 0%, #db2777 50%, #f97316 100%)`
        break
      case 'dual-border-slate':
        containerClass = 'rounded-none px-4 py-2.5'
        containerStyleInline.borderTop = `2px solid ${borderColor || '#64748b'}`
        containerStyleInline.borderBottom = `2px solid ${borderColor || '#64748b'}`
        break
      case 'shadow-glow':
        containerClass = 'rounded-full px-5 py-2.5'
        containerStyleInline.boxShadow = `0 0 15px ${(borderColor !== '#e2e8f0' ? borderColor : bgColor)}40`
        break
      case 'minimal':
      default:
        containerClass = 'bg-transparent border-0 px-2 py-1'
        containerStyleInline.backgroundColor = 'transparent'
        break
    }

    return (
      <div
        className={`flex items-center gap-3 text-[11.5px] font-bold font-sans overflow-hidden transition-all ${containerClass}`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: borderCss,
          ...containerStyleInline
        }}
      >
        {styleBlock}
        {!hidePrefix && prefixText && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase select-none tracking-wider shrink-0 bg-white ${blinkClass}`}
            style={{ color: containerStyle === 'minimal' ? '#dc2626' : bgColor }}
          >
            {prefixText}
          </span>
        )}
        {renderTextContent()}
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
        className={`w-full flex flex-col items-center justify-center pt-2 pb-4 md:pt-4 md:pb-6 border-b border-zinc-200 px-4 select-none transition-all ${alignClass}`}
        style={{ backgroundColor: bgColor }}
      >
        {isText ? (
          <h1 
            className="font-editorial-title text-2xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black cursor-pointer text-center m-0 leading-tight"
            style={{ fontSize: logoSize, color: logoColor }}
          >
            DOMAIN NAME
          </h1>
        ) : (
          <div 
            className="border border-dashed border-slate-300 rounded flex items-center justify-center p-3 text-slate-400 font-bold bg-slate-50 text-xs shrink-0 select-none"
            style={{ width: '200px', height: '42px' }}
          >
            🖼️ {logoImg ? 'Loaded Logo' : 'Upload Image Logo'}
          </div>
        )}
        <p 
          className="mt-1 text-[8px] sm:text-xs text-zinc-500 uppercase tracking-widest text-center"
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
        className="w-full border-b border-zinc-400 py-1.5 md:py-0 select-none transition-all"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 gap-3 md:gap-0">
          <nav className={`flex items-center gap-0 overflow-x-auto no-scrollbar w-full md:w-auto flex-1 ${alignClass}`}>
            <span className={`py-2 px-3 text-xs md:text-sm font-medium transition-all ${activeDesign === 'underline' ? 'text-black border-b-2 border-black font-semibold' : 'bg-zinc-950 text-white px-3 py-1 rounded font-semibold'}`}>
              All News
            </span>
            <span className="py-2 px-3 text-xs md:text-sm font-medium text-zinc-600 hover:text-black">Politics</span>
            <span className="py-2 px-3 text-xs md:text-sm font-medium text-zinc-600 hover:text-black">Technology</span>
            <span className="py-2 px-3 text-xs md:text-sm font-medium text-zinc-600 hover:text-black">Business</span>
          </nav>

          {searchPlacement !== 'hidden' && (
            <div className={`relative flex items-center w-full max-w-[160px] md:w-40 shrink-0 ${searchPlacement === 'left' ? 'order-first' : 'order-last'}`}>
              <input
                type="text"
                readOnly
                placeholder={searchPlaceholder}
                className="w-full bg-zinc-50 border px-2.5 py-1 text-[11px] rounded outline-none cursor-default font-sans text-zinc-500 pr-8"
                style={{ borderColor: searchBorderColor, borderWidth: searchBorderThickness, borderStyle: 'solid' }}
              />
              <span className="absolute right-2.5 text-zinc-450 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          )}
        </div>
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
      case 'date-section': {
        const dateBg = section.settings?.bgColor || '#ffffff'
        const dateCol = section.settings?.textColor || '#52525b'
        const dateAlign = section.settings?.alignment || 'spaced'
        const dateBorder = section.settings?.borderStyle || 'none'
        const dateBorderCol = section.settings?.borderColor || '#e4e4e7'
        const dateBorderCss = dateBorder === 'thin' ? `1px solid ${dateBorderCol}` : dateBorder === 'thick' ? `3px solid ${dateBorderCol}` : `1px solid #e4e4e7`

        const dateAlignClass = dateAlign === 'left' ? 'justify-start gap-4' : dateAlign === 'center' ? 'justify-center gap-6' : dateAlign === 'right' ? 'justify-end gap-4' : 'justify-between'
        return (
          <div 
            key={section.id} 
            className={`w-full py-2 px-4 sm:px-6 text-xs text-zinc-650 flex items-center transition-all ${dateAlignClass}`}
            style={{ backgroundColor: dateBg, color: dateCol, borderBottom: dateBorderCss }}
          >
            <span className="flex items-center gap-1.5 font-sans font-medium">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Wednesday, July 1, 2026
            </span>
            {dateAlign === 'spaced' && (
              <span className="font-sans font-semibold text-zinc-500 text-[11px]">
                Washington, D.C.
              </span>
            )}
          </div>
        )
      }
      case 'first-hero':
        return (
          <section key={section.id} className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto text-left border-t border-zinc-200 transition-all" style={{ borderTop: borderStyle || undefined, backgroundColor: customBg }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Lead Story + Sub-articles */}
              <div className="lg:col-span-8 flex flex-col justify-start">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Lead story text */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                          Lead Story
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          US News
                        </span>
                      </div>
                      <h2 className="font-editorial-title text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight tracking-tight">
                        Senate Committee Reaches Funding Package Settlement
                      </h2>
                      <p className="mt-2 text-xs text-zinc-500 leading-relaxed font-sans line-clamp-3">
                        Senate committee members have voted to approve a packaging agreement to boost enterprise growth and infrastructure funding across rural states.
                      </p>
                    </div>
                    <div className="mt-4 border-t border-zinc-150 pt-2 flex items-center text-[10px] text-zinc-400">
                      By <span className="font-semibold text-zinc-700 ml-1">Staff Reporter</span>
                    </div>
                  </div>
                  {/* Lead image placeholder */}
                  <div className="flex-1 min-h-[140px] bg-zinc-100 rounded-sm relative overflow-hidden flex items-center justify-center text-zinc-400 font-sans text-[10px] font-bold border border-zinc-200">
                    📸 FEATURED STORY IMAGE
                  </div>
                </div>

                <div className="border-t border-zinc-200 mt-4 pt-3" />

                {/* 2 sub-articles */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-0.5">Finance</div>
                    <h3 className="font-editorial-title text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                      Stocks Rally Following Fed Policy Announcement
                    </h3>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-0.5">Technology</div>
                    <h3 className="font-editorial-title text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                      Enterprise Custom AI Models Latency Optimization
                    </h3>
                  </div>
                </div>
              </div>

              {/* Right Side: Column of Secondary/Breaking */}
              <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 space-y-4">
                <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1">
                  Breaking Updates
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">World</span>
                    <h3 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug">
                      Global Climate Summit Reaches Agreement
                    </h3>
                  </div>
                  <div className="border-t pt-2">
                    <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">Science</span>
                    <h3 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug">
                      JWST Reveals Atmospheric Findings on Exoplanet
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      case 'opinion-column':
        return (
          <div key={section.id} className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm text-left max-w-7xl mx-auto" style={{ borderTop: borderStyle || undefined, backgroundColor: customBg }}>
            <div className="border-b border-zinc-800 pb-1 mb-4 text-center">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Opinion & Columns</h2>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-mono flex items-center justify-center text-[9px] font-bold">
                    AP
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-800 leading-none">Arthur Pendelton</h4>
                  </div>
                </div>
                <h3 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug">
                  "Upgrading Rural Power Grids is Critical for AgTech Growth"
                </h3>
              </div>
              <div className="border-l border-zinc-200 pl-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-mono flex items-center justify-center text-[9px] font-bold">
                    GR
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-800 leading-none">Gary Reynolds</h4>
                  </div>
                </div>
                <h3 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug">
                  "Why Fed Rate Strategy Remains Cautious But Decisive"
                </h3>
              </div>
              <div className="border-l border-zinc-200 pl-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-mono flex items-center justify-center text-[9px] font-bold">
                    SM
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-800 leading-none">Sophia Martinez</h4>
                  </div>
                </div>
                <h3 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug">
                  "Urban Drainage Investments and Commuter Realities"
                </h3>
              </div>
            </div>
          </div>
        )
      case 'us-politics':
      case 'finance-markets':
      case 'technology-section':
      case 'world-affairs': {
        const gridTitle = section.title
        return (
          <div key={section.id} className="w-full py-4 text-left border-t border-zinc-200" style={{ borderTop: borderStyle || undefined, backgroundColor: customBg }}>
            <div className="border-b-2 border-zinc-900 pb-1 mb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-950">{gridTitle}</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug">
                    Bipartisan Infrastructure Funding Bill Passes Committee
                  </h3>
                  <div className="mt-1 text-[9px] text-zinc-400">By Reporter • Today</div>
                </div>
                <div className="w-16 h-12 bg-zinc-100 rounded-sm border border-zinc-200 flex-shrink-0 flex items-center justify-center text-[8px] text-zinc-450">📸 Image</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug">
                    Committee Outlines Legislative Blueprint for Development Boost
                  </h3>
                  <div className="mt-1 text-[9px] text-zinc-400">By Reporter • Yesterday</div>
                </div>
                <div className="w-16 h-12 bg-zinc-100 rounded-sm border border-zinc-200 flex-shrink-0 flex items-center justify-center text-[8px] text-zinc-455">📸 Image</div>
              </div>
            </div>
          </div>
        )
      }
      case 'arts-marketing-pr':
        return (
          <div key={section.id} className="w-full py-4 text-left border-t border-zinc-200" style={{ borderTop: borderStyle || undefined, backgroundColor: customBg }}>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="border-b border-zinc-200 pb-1 mb-2">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Arts & Culture</h3>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="font-editorial-title text-xs font-bold leading-snug flex-1">Opera House Reopens Following Restoration</span>
                  <div className="w-12 h-9 bg-zinc-100 border border-zinc-200 rounded-sm flex-shrink-0" />
                </div>
              </div>
              <div className="border-l border-zinc-200 pl-4">
                <div className="border-b border-zinc-200 pb-1 mb-2">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Marketing Strategy</h3>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="font-editorial-title text-xs font-bold leading-snug flex-1">Brand Tactics Adapt to Digital Audiences</span>
                  <div className="w-12 h-9 bg-zinc-100 border border-zinc-200 rounded-sm flex-shrink-0" />
                </div>
              </div>
              <div className="border-l border-zinc-200 pl-4">
                <div className="border-b border-zinc-200 pb-1 mb-2">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Press Releases</h3>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="font-editorial-title text-xs font-bold leading-snug flex-1">Announcements of Corporate Rebranding</span>
                  <div className="w-12 h-9 bg-zinc-100 border border-zinc-200 rounded-sm flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )
      case 'trending-columns':
        return (
          <div key={section.id} className="w-full py-4 text-left border-t border-zinc-200" style={{ borderTop: borderStyle || undefined, backgroundColor: customBg }}>
            <div className="border-b border-zinc-200 pb-1 mb-3">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Trending Columns</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="font-mono text-xl font-bold text-zinc-200 leading-none">01</span>
                <div>
                  <h4 className="font-editorial-title text-xs font-bold text-zinc-950 leading-tight">Energy Electrification Strategy Reaches Consensus</h4>
                  <span className="text-[9px] text-zinc-400">By Reporter</span>
                </div>
              </div>
              <div className="flex gap-3 items-start border-t pt-2">
                <span className="font-mono text-xl font-bold text-zinc-200 leading-none">02</span>
                <div>
                  <h4 className="font-editorial-title text-xs font-bold text-zinc-950 leading-tight">Federal Policy Framework Guidelines and Market Realities</h4>
                  <span className="text-[9px] text-zinc-400">By Reporter</span>
                </div>
              </div>
            </div>
          </div>
        )
      case 'latest-news':
        return (
          <div key={section.id} className="w-full py-4 text-left border-t border-zinc-200" style={{ borderTop: borderStyle || undefined, backgroundColor: customBg }}>
            <div className="border-b border-zinc-900 pb-1 mb-3 text-center">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-950">LATEST NEWS</h2>
            </div>
            <div className="space-y-3">
              <div className="border-l-2 border-zinc-200 pl-3 py-1 flex gap-4 justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-editorial-title text-xs sm:text-sm font-bold text-zinc-950 leading-snug">New Infrastructure Packaging Reaches Final Approval Stages</h4>
                  <span className="text-[9px] text-zinc-400">By Reporter • Just Now</span>
                </div>
                <div className="w-12 h-10 bg-zinc-100 border rounded flex-shrink-0" />
              </div>
              <div className="border-l-2 border-zinc-200 pl-3 py-1 flex gap-4 justify-between items-center border-t pt-2">
                <div className="flex-1">
                  <h4 className="font-editorial-title text-xs sm:text-sm font-bold text-zinc-950 leading-snug">Global Stocks Advance Following Treasury Yield Easing</h4>
                  <span className="text-[9px] text-zinc-400">By Reporter • 10m ago</span>
                </div>
                <div className="w-12 h-10 bg-zinc-100 border rounded flex-shrink-0" />
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div key={section.id} className="w-full py-3 text-left border-t border-zinc-250" style={{ borderTop: borderStyle || undefined, backgroundColor: customBg }}>
            <div className="flex justify-between items-center mb-2 border-b pb-0.5">
              <span className="text-[11.5px] font-extrabold text-slate-800">{section.title}</span>
              <span className={`text-[8px] font-bold px-1.5 py-0.25 rounded uppercase tracking-wider font-mono ${badgeStyle}`}>{section.categorySource}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-slate-100 border rounded" />
              <div className="h-10 bg-slate-100 border rounded" />
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
                {/* Background & Text Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Ticker Background Color</label>
                    <input
                      type="color"
                      value={draftSection.settings?.bgColor || '#09090b'}
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

                {/* Prefix Label Controls */}
                <div className="border-t pt-3 flex flex-col gap-3">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[12px] font-bold text-slate-700">Hide Prefix Badge Label</div>
                      <div className="text-[9.5px] text-slate-400 font-medium">Remove the prefix tag completely. Only show news.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={draftSection.settings?.hidePrefix === true}
                        onChange={(e) => updateDraftSetting('hidePrefix', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                    </label>
                  </div>

                  {!draftSection.settings?.hidePrefix && (
                    <div className="grid grid-cols-2 gap-3 animate-[admin-fade-in_0.2s_ease]">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Prefix Text Label</label>
                        <input
                          type="text"
                          value={draftSection.settings?.prefixText || 'BREAKING'}
                          onChange={(e) => updateDraftSetting('prefixText', e.target.value)}
                          className="p-2 border rounded-lg text-xs w-full bg-white text-slate-750 outline-none"
                        />
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold text-slate-650">Blinking Effect</span>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={draftSection.settings?.isBlinking !== false}
                            onChange={(e) => updateDraftSetting('isBlinking', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#6366f1]"></div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Box Container Design Options */}
                <div className="border-t pt-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Container Shape Style</label>
                  <select
                    value={draftSection.settings?.containerStyle || 'original'}
                    onChange={(e) => updateDraftSetting('containerStyle', e.target.value)}
                    className="p-2.5 border rounded-lg text-xs w-full bg-white outline-none cursor-pointer text-slate-700 font-bold"
                  >
                    <option value="original">0. Original News Ticker Design (Flush Red Block on Left)</option>
                    <option value="capsule">1. Classic Capsule Pill</option>
                    <option value="sharp-bar">2. Sharp Rectangular Bar</option>
                    <option value="soft-box">3. Soft Rounded Box</option>
                    <option value="framed-box">4. Framed Outline Box</option>
                    <option value="left-accent">5. Left Accent Stripe Bar</option>
                    <option value="minimal">6. Minimal Plain Line (No Background)</option>
                    <option value="dotted-panel">7. Dotted Outline Panel</option>
                    <option value="glassmorphism">8. Glassmorphic Translucent Plate</option>
                    <option value="diagonal-gradient">9. Diagonal Gradient Ribbon</option>
                    <option value="dual-border-slate">10. Dual Top & Bottom Border Strip</option>
                    <option value="shadow-glow">11. Outer Shadow Colored Glow Box</option>
                  </select>
                </div>

                {/* Animation Options */}
                <div className="border-t pt-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Animation & Scrolling Design</label>
                  <select
                    value={draftSection.settings?.animation || 'scroll'}
                    onChange={(e) => updateDraftSetting('animation', e.target.value)}
                    className="p-2.5 border rounded-lg text-xs w-full bg-white outline-none cursor-pointer text-slate-700 font-bold"
                  >
                    <option value="scroll">1. Classic Smooth Scrolling Marquee</option>
                    <option value="fade">2. Stationary Fade Loop (Stationary)</option>
                    <option value="static">3. Static Stationary Text Alert (No Animation)</option>
                    <option value="vertical-roll">4. Vertical Flip & Roll Scroll (Bottom-to-Top)</option>
                    <option value="zoom-pulse">5. Zoom In-Out Soft Pulse</option>
                    <option value="flash-fast">6. Fast Flash Warning Alert (Blinker)</option>
                    <option value="glitch-shiver">7. Glitch Tech Horizontal Shiver</option>
                    <option value="slide-reveal">8. Slide & Lock Left-to-Right Reveal</option>
                    <option value="bounce-reveal">9. Bounce Reveal Up & Down Loop</option>
                    <option value="shimmer">10. Wave Shimmer Highlight Sweep</option>
                  </select>
                </div>

                {/* Animation Speed Option */}
                {['scroll', 'fade', 'vertical-roll', 'zoom-pulse', 'flash-fast', 'glitch-shiver', 'slide-reveal', 'bounce-reveal', 'shimmer'].includes(draftSection.settings?.animation || 'scroll') && (
                  <div className="border-t pt-3 animate-[admin-fade-in_0.2s_ease]">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block">Animation Speed / Duration</label>
                      <span className="text-[10px] text-indigo-600 font-bold font-mono">
                        {draftSection.settings?.scrollSpeed || (draftSection.settings?.animation === 'flash-fast' || draftSection.settings?.animation === 'glitch-shiver' ? '0.8' : '28')}s
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">Fast</span>
                      <input
                        type="range"
                        min="0.5"
                        max="60"
                        step="0.5"
                        value={draftSection.settings?.scrollSpeed || (draftSection.settings?.animation === 'flash-fast' || draftSection.settings?.animation === 'glitch-shiver' ? '0.8' : '28')}
                        onChange={(e) => updateDraftSetting('scrollSpeed', parseFloat(e.target.value))}
                        className="flex-grow accent-[#6366f1] cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">Slow</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 mt-1">
                      Control the movement speed or cycle duration (lower is faster, higher is slower).
                    </p>
                  </div>
                )}

                {/* Border Options */}
                <div className="border-t pt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Border Thickness Style</label>
                    <select
                      value={draftSection.settings?.borderStyle || 'none'}
                      onChange={(e) => updateDraftSetting('borderStyle', e.target.value)}
                      className="p-2 border rounded-lg text-xs w-full bg-white outline-none text-slate-700"
                    >
                      <option value="none">No Border</option>
                      <option value="thin">Thin Border (1px)</option>
                      <option value="thick">Thick Border (3px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Border Color</label>
                    <input
                      type="color"
                      value={draftSection.settings?.borderColor || '#e2e8f0'}
                      onChange={(e) => updateDraftSetting('borderColor', e.target.value)}
                      className="w-full h-9 p-0.5 border rounded-lg bg-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* Vertical Position Presets */}
                <div className="border-t pt-3">
                  <label className="text-[12px] font-extrabold text-[#6366f1] block mb-2 uppercase tracking-wide">Vertical Placement Preset</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateDraftSetting('verticalPreset', 'above-header')}
                      className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        (draftSection.settings?.verticalPreset || 'above-header') === 'above-header'
                          ? 'border-[#6366f1] bg-indigo-50/40 text-indigo-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Above Logo
                    </button>
                    <button
                      onClick={() => updateDraftSetting('verticalPreset', 'below-header')}
                      className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        draftSection.settings?.verticalPreset === 'below-header'
                          ? 'border-[#6366f1] bg-indigo-50/40 text-indigo-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Below Logo
                    </button>
                    <button
                      onClick={() => updateDraftSetting('verticalPreset', 'below-nav')}
                      className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        draftSection.settings?.verticalPreset === 'below-nav'
                          ? 'border-[#6366f1] bg-indigo-50/40 text-indigo-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Below Nav
                    </button>
                  </div>
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
                    className="p-2.5 border rounded-lg text-xs w-full bg-white text-slate-755 outline-none resize-none font-medium"
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

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Horizontal Alignment</label>
                  <select
                    value={draftSection.settings?.alignment || 'spaced'}
                    onChange={(e) => updateDraftSetting('alignment', e.target.value)}
                    className="p-2.5 border rounded-lg text-xs w-full bg-white outline-none cursor-pointer text-slate-705 font-bold"
                  >
                    <option value="spaced">Spaced Between (Date Left, Location Right)</option>
                    <option value="left">Left Aligned</option>
                    <option value="center">Center Aligned</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>

                <div className="border-t pt-3">
                  <label className="text-[12px] font-extrabold text-[#6366f1] block mb-2 uppercase tracking-wide">Vertical Placement Preset</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateDraftSetting('verticalPreset', 'above-header')}
                      className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        (draftSection.settings?.verticalPreset || 'above-header') === 'above-header'
                          ? 'border-[#6366f1] bg-indigo-50/40 text-indigo-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Above Logo
                    </button>
                    <button
                      onClick={() => updateDraftSetting('verticalPreset', 'below-header')}
                      className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        draftSection.settings?.verticalPreset === 'below-header'
                          ? 'border-[#6366f1] bg-indigo-50/40 text-indigo-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Below Logo
                    </button>
                    <button
                      onClick={() => updateDraftSetting('verticalPreset', 'below-nav')}
                      className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        draftSection.settings?.verticalPreset === 'below-nav'
                          ? 'border-[#6366f1] bg-indigo-50/40 text-indigo-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Below Nav
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed">
                    Choose relative position. The layout section sequence indexes will be automatically recalculated upon applying section edits.
                  </p>
                </div>

                {/* Border Options */}
                <div className="border-t pt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Border Thickness Style</label>
                    <select
                      value={draftSection.settings?.borderStyle || 'none'}
                      onChange={(e) => updateDraftSetting('borderStyle', e.target.value)}
                      className="p-2 border rounded-lg text-xs w-full bg-white outline-none text-slate-700"
                    >
                      <option value="none">No Border</option>
                      <option value="thin">Thin Border (1px)</option>
                      <option value="thick">Thick Border (3px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Border Color</label>
                    <input
                      type="color"
                      value={draftSection.settings?.borderColor || '#e2e8f0'}
                      onChange={(e) => updateDraftSetting('borderColor', e.target.value)}
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

          {/* RIGHT COLUMN: DUAL PREVIEW PANELS — full width for breaking news for accurate representation */}
          <div className="flex flex-col gap-6">

            {/* PANEL 1 — EXACT replica of current live news site design (read-only) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[12px] font-extrabold text-emerald-700 uppercase tracking-widest font-sans">
                  Current Live Design
                </span>
                <span className="ml-auto text-[10px] text-slate-400 font-mono uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Live on news site right now
                </span>
              </div>
              <div className={`overflow-hidden border-2 border-emerald-300 shadow-[0_0_0_4px_rgba(134,239,172,0.15)] relative ${
                (() => {
                  const origSec = originalSections.find(s => s.id === draftSection.id) || draftSection
                  const cs = origSec.settings?.containerStyle || 'original'
                  const isFlush = cs === 'original' || cs === 'sharp-bar' || cs === 'left-accent' || cs === 'dual-border-slate' || cs === 'diagonal-gradient' || draftSection.id === 'domain-header' || draftSection.id === 'category-nav' || draftSection.id === 'date-section'
                  return isFlush ? 'rounded-none' : 'rounded-2xl'
                })()
              }`}>
                {/* Decorative label */}
                <div className="absolute top-0 right-0 z-10 bg-emerald-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider select-none">
                  LIVE
                </div>
                <div className="pointer-events-none select-none">
                  {isBreaking
                    ? renderExactLiveTicker(originalSections.find(s => s.id === draftSection.id) || draftSection)
                    : (() => {
                        const origSec = originalSections.find(s => s.id === draftSection.id) || draftSection
                        const cs = origSec.settings?.containerStyle || 'original'
                        const isFlush = cs === 'original' || cs === 'sharp-bar' || cs === 'left-accent' || cs === 'dual-border-slate' || cs === 'diagonal-gradient' || draftSection.id === 'domain-header' || draftSection.id === 'category-nav' || draftSection.id === 'date-section'
                        return (
                          <div className={isFlush ? 'p-0' : 'p-5 bg-slate-50'}>
                            {renderPreviewMock(origSec)}
                          </div>
                        )
                      })()
                  }
                </div>
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold px-1">
                ↑ This is exactly how the Breaking News Ticker appears on your live news site right now.
              </p>
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                Edit Preview
              </span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* PANEL 2 — Live-updating draft preview (updates as you change settings) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block animate-pulse"></span>
                <span className="text-[12px] font-extrabold text-indigo-700 uppercase tracking-widest font-sans">
                  Preview with Your Changes
                </span>
                <span className="ml-auto text-[10px] text-slate-400 font-mono uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Updates as you edit
                </span>
              </div>
              <div
                className={`overflow-hidden border-2 border-indigo-300 shadow-[0_0_0_4px_rgba(165,180,252,0.15)] relative ${
                  isBreaking || draftSection.settings?.containerStyle === 'original' ||
                  draftSection.settings?.containerStyle === 'sharp-bar' ||
                  draftSection.settings?.containerStyle === 'left-accent' ||
                  draftSection.settings?.containerStyle === 'dual-border-slate' ||
                  draftSection.settings?.containerStyle === 'diagonal-gradient' ||
                  draftSection.id === 'domain-header' ||
                  draftSection.id === 'category-nav' ||
                  draftSection.id === 'date-section'
                    ? 'p-0 rounded-none'
                    : 'p-5 bg-slate-50 rounded-2xl'
                }`}
              >
                {/* Decorative label */}
                <div className="absolute top-0 right-0 z-10 bg-indigo-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider select-none">
                  PREVIEW
                </div>
                {renderPreviewMock(draftSection)}
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed px-1">
                ✦ Adjust settings on the left and watch this preview update instantly.
                Click <strong className="text-[#6366f1]">Apply Section Edits</strong> above to confirm and save to the homepage.
              </p>
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

      {/* HOMEPAGE LAYOUT PREVIEW SIMULATOR */}
      <div className="flex flex-col gap-4">
        {/* Toggle bar */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs select-none">
          <div className="flex flex-col text-left">
            <span className="text-[13.5px] font-extrabold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-2">
              🖥️ Homepage Live Preview Simulator
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              Toggle tabs to compare live website view and proposed draft preview with animation
            </span>
          </div>

          <div className="bg-slate-200/50 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setPreviewTab('draft')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewTab === 'draft'
                  ? 'bg-[#6366f1] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <span>✨ Draft Preview (With Changes)</span>
            </button>
            <button
              onClick={() => setPreviewTab('live')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewTab === 'live'
                  ? 'bg-slate-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <span>🌐 Live Website View (Current)</span>
            </button>
          </div>
        </div>

        {/* Sliding Canvas Container */}
        <div className="relative w-full overflow-hidden border border-slate-200 bg-white rounded-3xl min-h-[500px] shadow-[0_8px_30px_rgba(15,23,42,0.01)]">
          <div 
            className="flex transition-transform duration-500 ease-in-out w-[200%]"
            style={{ transform: previewTab === 'draft' ? 'translateX(0%)' : 'translateX(-50%)' }}
          >
            {/* Slide 1: Proposed Draft View */}
            <div className="w-1/2 p-6 flex flex-col gap-4">
              <div className="border-b pb-3 mb-2 flex justify-between items-center select-none">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#6366f1]">
                  Proposed Draft layout preview (Unsaved)
                </span>
                <span className="text-[10px] bg-[#6366f1] text-white font-bold px-2 py-0.5 rounded animate-pulse">
                  Interactive Draft Simulation
                </span>
              </div>
              <div className="w-full flex flex-col gap-0 bg-white">
                {sections
                  .filter(s => s.isVisible)
                  .map(sec => (
                    <div key={sec.id} className="relative group">
                      <div className="absolute -top-2.5 left-3 bg-indigo-650 text-white text-[8px] font-bold px-1.5 py-0.25 rounded opacity-0 group-hover:opacity-100 transition tracking-wide z-10 select-none">
                        {sec.title}
                      </div>
                      {renderPreviewMock(sec)}
                    </div>
                  ))}
              </div>
            </div>

            {/* Slide 2: Current Live View */}
            <div className="w-1/2 p-6 flex flex-col gap-4">
              <div className="border-b pb-3 mb-2 flex justify-between items-center select-none">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Current Live layout view (Active)
                </span>
                <span className="text-[10px] bg-slate-500 text-white font-bold px-2 py-0.5 rounded">
                  Active DB State
                </span>
              </div>
              <div className="w-full flex flex-col gap-0 bg-white">
                {originalSections
                  .filter(s => s.isVisible)
                  .map(sec => (
                    <div key={sec.id} className="relative group">
                      <div className="absolute -top-2.5 left-3 bg-slate-500 text-white text-[8px] font-bold px-1.5 py-0.25 rounded opacity-0 group-hover:opacity-100 transition tracking-wide z-10 select-none">
                        {sec.title}
                      </div>
                      {renderPreviewMock(sec)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
