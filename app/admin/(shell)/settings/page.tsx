'use client'

import { useState, useEffect } from 'react'
import { useAdminModal } from '../../components/AdminModalContext'

const TABS = ['General', 'Theme Builder', 'SEO', 'Security', 'Backup & Restore', 'Activity Logs']

const FONT_OPTIONS = ['Geist', 'Lora', 'Courier', 'Arial', 'Times New Roman', 'Georgia']

// Curated list of typography elements that need individual controls
const TYPOGRAPHY_KEYS = [
  { key: 'siteTitle', label: 'Site Title' },
  { key: 'logoText', label: 'Logo Text' },
  { key: 'navigationMenu', label: 'Navigation Menu' },
  { key: 'categoryNavigation', label: 'Category Navigation' },
  { key: 'categoryLabel', label: 'Category Badge' },
  { key: 'leadStoryCategory', label: 'Lead Story Beat' },
  { key: 'leadStoryTitle', label: 'Lead Story Title' },
  { key: 'leadStoryDescription', label: 'Lead Story Description' },
  { key: 'newsCardTitle', label: 'News Card Title' },
  { key: 'newsCardDescription', label: 'News Card Description' },
  { key: 'sidebarTitles', label: 'Sidebar Titles' },
  { key: 'widgetTitles', label: 'Widget Titles' },
  { key: 'footerTitles', label: 'Footer Column Titles' },
  { key: 'footerText', label: 'Footer Text' },
  { key: 'detailPageTitle', label: 'Detail Page Title' },
  { key: 'detailPageDescription', label: 'Detail Page Description' },
  { key: 'author', label: 'Author Text' },
  { key: 'date', label: 'Date Text' },
  { id: 'breadcrumb', key: 'breadcrumb', label: 'Breadcrumb Text' },
  { key: 'relatedNews', label: 'Related News Title' },
  { key: 'tags', label: 'Tags Badge' },
  { key: 'buttons', label: 'Button Typography' }
]

export default function SettingsPage() {
  const { showAlert, showConfirm } = useAdminModal()
  const [activeTab, setActiveTab] = useState('General')
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [backups, setBackups] = useState<any[]>([])
  const [backupLoading, setBackupLoading] = useState(false)

  // Central site settings states
  const [siteName, setSiteName] = useState('Magazine Gazette')
  const [tagline, setTagline] = useState('US & World News, Analysis & Opinion')
  const [timezone, setTimezone] = useState('America/New_York')
  const [language, setLanguage] = useState('en')
  const [articlesPerPage, setArticlesPerPage] = useState('10')

  // Theme states
  const [themeMode, setThemeMode] = useState('light')
  const [primaryCol, setPrimaryCol] = useState('#1e40af')
  const [secondaryCol, setSecondaryCol] = useState('#0f172a')
  const [accentCol, setAccentCol] = useState('#dc2626')
  const [bgCol, setBgCol] = useState('#ffffff')
  const [borderCol, setBorderCol] = useState('#e2e8f0')
  const [cardCol, setCardCol] = useState('#ffffff')
  const [buttonCol, setButtonCol] = useState('#1e40af')
  const [buttonTextCol, setButtonTextCol] = useState('#ffffff')
  const [hoverCol, setHoverCol] = useState('#1d4ed8')
  const [linkCol, setLinkCol] = useState('#2563eb')
  const [borderRadius, setBorderRadius] = useState('6px')
  const [containerWidth, setContainerWidth] = useState('1280px')
  const [typography, setTypography] = useState<Record<string, any>>({})

  // Selected typography key to configure
  const [selectedTypoKey, setSelectedTypoKey] = useState('newsCardTitle')

  // SEO states
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [robotsText, setRobotsText] = useState('')
  const [sitemapEnabled, setSitemapEnabled] = useState(true)
  const [googleAnalytics, setGoogleAnalytics] = useState('')
  const [articleSchema, setArticleSchema] = useState(true)
  const [breadcrumbSchema, setBreadcrumbSchema] = useState(true)

  // Security states
  const [twoFA, setTwoFA] = useState(false)
  const [maxAttempts, setMaxAttempts] = useState('5')
  const [sessionLimit, setSessionLimit] = useState('60')
  const [ipWhitelist, setIpWhitelist] = useState('')

  // Load configuration from database
  async function loadSettings() {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        
        // General values
        if (data.seo) {
          setMetaTitle(data.seo.globalTitle || '')
          setMetaDescription(data.seo.metaDescription || '')
          setRobotsText(data.seo.robotsText || '')
          setSitemapEnabled(data.seo.sitemapEnabled !== false)
          setGoogleAnalytics(data.seo.googleAnalytics || '')
          setArticleSchema(data.seo.articleSchema !== false)
          setBreadcrumbSchema(data.seo.breadcrumbSchema !== false)
        }

        // Theme values
        if (data.theme) {
          const t = data.theme
          setThemeMode(t.mode || 'light')
          setPrimaryCol(t.primaryColor || '#1e40af')
          setSecondaryCol(t.secondaryColor || '#0f172a')
          setAccentCol(t.accentColor || '#dc2626')
          setBgCol(t.backgroundColor || '#ffffff')
          setBorderCol(t.borderColor || '#e2e8f0')
          setCardCol(t.cardColor || '#ffffff')
          setButtonCol(t.buttonColor || '#1e40af')
          setButtonTextCol(t.buttonTextColor || '#ffffff')
          setHoverCol(t.hoverColor || '#1d4ed8')
          setLinkCol(t.linkColor || '#2563eb')
          setBorderRadius(t.borderRadius || '6px')
          setContainerWidth(t.containerWidth || '1280px')
          setTypography(t.typography || {})
        }

        // Security values
        if (data.security) {
          const s = data.security
          setTwoFA(s.twoFactorEnabled || false)
          setMaxAttempts(String(s.maxLoginAttempts || 5))
          setSessionLimit(String(s.sessionLimitMinutes || 60))
          setIpWhitelist(s.ipWhitelist || '')
        }
      }
    } catch (e) {
      console.error('Failed to load settings from API:', e)
    } finally {
      setLoading(false)
    }
  }

  // Load audit logs
  async function loadLogs() {
    try {
      const res = await fetch('/api/logs?limit=30')
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch (err) {}
  }

  // Load backup files
  async function loadBackups() {
    try {
      const res = await fetch('/api/backup')
      if (res.ok) {
        const data = await res.json()
        setBackups(data)
      }
    } catch (err) {}
  }

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (activeTab === 'Activity Logs') {
      loadLogs()
    }
    if (activeTab === 'Backup & Restore') {
      loadBackups()
    }
  }, [activeTab])

  // Save central Site Configurations
  async function handleSave() {
    try {
      const payload = {
        theme: {
          mode: themeMode,
          primaryColor: primaryCol,
          secondaryColor: secondaryCol,
          accentColor: accentCol,
          backgroundColor: bgCol,
          borderColor: borderCol,
          cardColor: cardCol,
          buttonColor: buttonCol,
          buttonTextColor: buttonTextCol,
          hoverColor: hoverCol,
          linkColor: linkCol,
          borderRadius,
          containerWidth,
          typography
        },
        seo: {
          globalTitle: metaTitle,
          metaDescription,
          robotsText,
          sitemapEnabled,
          googleAnalytics,
          articleSchema,
          breadcrumbSchema
        },
        security: {
          twoFactorEnabled: twoFA,
          maxLoginAttempts: parseInt(maxAttempts) || 5,
          sessionLimitMinutes: parseInt(sessionLimit) || 60,
          ipWhitelist
        }
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaved(true);
        showAlert('Site settings updated successfully!', 'success', 'Saved');
        setTimeout(() => setSaved(false), 3000);
        
        // Log the change
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'activity',
            action: 'SETTINGS_UPDATE',
            details: { updatedTab: activeTab },
            user: 'Admin'
          })
        });
      } else {
        showAlert('Failed to save settings', 'error', 'Error');
      }
    } catch (e) {
      showAlert('Failed to save settings', 'error', 'Error');
    }
  }

  // Restore Default settings values
  function handleResetToDefault() {
    showConfirm(
      'Are you sure you want to restore default factory configurations? All theme colors, spacing and font selectors will be set back to original defaults.',
      async () => {
        try {
          const res = await fetch('/api/settings', { method: 'PATCH' });
          if (res.ok) {
            showAlert('Site settings reset successfully!', 'success', 'Reset Complete');
            loadSettings();
          } else {
            showAlert('Failed to reset default settings', 'error', 'Error');
          }
        } catch (err) {
          showAlert('Failed to reset default settings', 'error', 'Error');
        }
      },
      'Restore Defaults'
    );
  }

  // Handle manual backup trigger
  async function triggerBackup() {
    setBackupLoading(true)
    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'backup' })
      })
      if (res.ok) {
        showAlert('Database snapshot created successfully!', 'success', 'Backup Complete')
        loadBackups()
      } else {
        showAlert('Backup failed.', 'error', 'Error')
      }
    } catch (err) {
      showAlert('Backup failed', 'error', 'Error')
    } finally {
      setBackupLoading(false)
    }
  }

  // Handle restore DB trigger
  function triggerRestore(filename: string) {
    showConfirm(
      `CRITICAL WARNING: Restoring the database to ${filename} will clear and overwrite all current collections. Are you sure you want to proceed?`,
      async () => {
        try {
          const res = await fetch('/api/backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'restore', filename })
          })
          if (res.ok) {
            showAlert('Database restored successfully! Loading updated settings.', 'success', 'Restore Complete')
            loadSettings()
          } else {
            const err = await res.json()
            showAlert(`Restore failed: ${err.error}`, 'error', 'Restore Error')
          }
        } catch (err) {
          showAlert('Restore operation failed', 'error', 'Restore Error')
        }
      },
      'Restore Database'
    );
  }

  const updateTypographyAttr = (key: string, field: string, value: string) => {
    setTypography((prev) => {
      const el = prev[key] || { font: 'Geist', size: '1rem', weight: '500', spacing: '0em', height: '1.4' };
      return {
        ...prev,
        [key]: {
          ...el,
          [field]: value
        }
      };
    });
  };

  const getFontFamilyCss = (font: string) => {
    if (font === 'Lora') return 'Georgia, serif';
    if (font === 'Courier') return 'monospace';
    return 'sans-serif';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-500">Retrieving Site Configs...</span>
      </div>
    )
  }

  const currentTypoItem = typography[selectedTypoKey] || { font: 'Geist', size: '14px', weight: '500', spacing: '0em', height: '1.4' };

  return (
    <div className="max-w-[1100px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-sans font-extrabold text-[#111] m-0">Settings Dashboard</h1>
          <p className="text-[12.5px] text-slate-500 mt-1 font-medium">Configure news behaviors, appearance presets, search engine crawls and audit trails.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleResetToDefault}
            className="px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition"
          >
            Restore Default
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-[#111] hover:bg-[#222] text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[12.5px] border-none bg-transparent cursor-pointer font-sans transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'text-[#111] font-bold border-b-2 border-black -mb-[1px]' 
                : 'text-slate-500 hover:text-[#111] font-medium'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        
        {/* TAB 1: General */}
        {activeTab === 'General' && (
          <div className="space-y-6">
            <h3 className="text-[14.5px] font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">General Configurations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">Site Name Title</label>
                <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs font-sans focus:border-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">Editorial Tagline</label>
                <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs font-sans focus:border-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">Global Timezone</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs font-sans focus:border-black cursor-pointer">
                  {['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata'].map((tz) => (
                    <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">Primary Language beat</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs font-sans focus:border-black cursor-pointer">
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">News Feed page size</label>
                <input type="number" value={articlesPerPage} onChange={(e) => setArticlesPerPage(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs font-sans focus:border-black" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Theme Builder */}
        {activeTab === 'Theme Builder' && (
          <div className="space-y-6">
            <h3 className="text-[14.5px] font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">Appearance Styling & Custom Theme Builder</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Brand Colors & Layout */}
              <div className="space-y-4 border-r border-slate-100 pr-5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Palette & Sizing</span>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 block">Active Theme Preset</label>
                  <div className="flex gap-2">
                    {['light', 'dark', 'custom'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setThemeMode(mode)}
                        className={`flex-1 py-1.5 px-3 rounded text-[11px] font-bold cursor-pointer capitalize border ${
                          themeMode === mode ? 'bg-[#111] text-white border-black' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Primary Color</label>
                    <div className="flex gap-1">
                      <input type="color" value={primaryCol} onChange={(e) => setPrimaryCol(e.target.value)} className="w-6 h-6 border-none p-0 cursor-pointer rounded bg-transparent" />
                      <input type="text" value={primaryCol} onChange={(e) => setPrimaryCol(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 text-[10px] uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Secondary Text</label>
                    <div className="flex gap-1">
                      <input type="color" value={secondaryCol} onChange={(e) => setSecondaryCol(e.target.value)} className="w-6 h-6 border-none p-0 cursor-pointer rounded bg-transparent" />
                      <input type="text" value={secondaryCol} onChange={(e) => setSecondaryCol(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 text-[10px] uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Brand Accent</label>
                    <div className="flex gap-1">
                      <input type="color" value={accentCol} onChange={(e) => setAccentCol(e.target.value)} className="w-6 h-6 border-none p-0 cursor-pointer rounded bg-transparent" />
                      <input type="text" value={accentCol} onChange={(e) => setAccentCol(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 text-[10px] uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Background</label>
                    <div className="flex gap-1">
                      <input type="color" value={bgCol} onChange={(e) => setBgCol(e.target.value)} className="w-6 h-6 border-none p-0 cursor-pointer rounded bg-transparent" />
                      <input type="text" value={bgCol} onChange={(e) => setBgCol(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 text-[10px] uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Card Base</label>
                    <div className="flex gap-1">
                      <input type="color" value={cardCol} onChange={(e) => setCardCol(e.target.value)} className="w-6 h-6 border-none p-0 cursor-pointer rounded bg-transparent" />
                      <input type="text" value={cardCol} onChange={(e) => setCardCol(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 text-[10px] uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Borders</label>
                    <div className="flex gap-1">
                      <input type="color" value={borderCol} onChange={(e) => setBorderCol(e.target.value)} className="w-6 h-6 border-none p-0 cursor-pointer rounded bg-transparent" />
                      <input type="text" value={borderCol} onChange={(e) => setBorderCol(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 text-[10px] uppercase font-mono" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Border Radius: <span className="font-mono">{borderRadius}</span></label>
                    <input type="range" min="0" max="24" step="2" value={parseInt(borderRadius) || 0} onChange={(e) => setBorderRadius(`${e.target.value}px`)} className="w-full cursor-pointer accent-black" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Max Page Width: <span className="font-mono">{containerWidth}</span></label>
                    <select value={containerWidth} onChange={(e) => setContainerWidth(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 py-1 text-[11px]">
                      <option value="1100px">1100px (Compact)</option>
                      <option value="1280px">1280px (Standard)</option>
                      <option value="1440px">1440px (Wide)</option>
                      <option value="100%">100% (Fluid Width)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Middle Column: Typography Selectors */}
              <div className="space-y-4 border-r border-slate-100 pr-5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Typography Hierarchy</span>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 block">Select Text Tag to Configure</label>
                  <select 
                    value={selectedTypoKey} 
                    onChange={(e) => setSelectedTypoKey(e.target.value)} 
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-black cursor-pointer"
                  >
                    {TYPOGRAPHY_KEYS.map((k) => (
                      <option key={k.key} value={k.key}>{k.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Font Family</label>
                    <select
                      value={currentTypoItem.font}
                      onChange={(e) => updateTypographyAttr(selectedTypoKey, 'font', e.target.value)}
                      className="w-full border border-slate-200 rounded p-1.5 text-[11px] cursor-pointer"
                    >
                      {FONT_OPTIONS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Font Size: <span className="font-mono">{currentTypoItem.size}</span></label>
                    <input 
                      placeholder="e.g. 1.2rem or 16px" 
                      value={currentTypoItem.size} 
                      onChange={(e) => updateTypographyAttr(selectedTypoKey, 'size', e.target.value)}
                      className="w-full border border-slate-200 rounded p-1.5 text-[11px] font-mono" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Font Weight: <span className="font-mono">{currentTypoItem.weight}</span></label>
                    <select
                      value={currentTypoItem.weight}
                      onChange={(e) => updateTypographyAttr(selectedTypoKey, 'weight', e.target.value)}
                      className="w-full border border-slate-200 rounded p-1.5 text-[11px] cursor-pointer"
                    >
                      {['300', '400', '500', '600', '700', '800', '900'].map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Letter Spacing</label>
                    <input 
                      placeholder="e.g. -0.02em or 0.05em" 
                      value={currentTypoItem.spacing} 
                      onChange={(e) => updateTypographyAttr(selectedTypoKey, 'spacing', e.target.value)}
                      className="w-full border border-slate-200 rounded p-1.5 text-[11px] font-mono" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Line Height (Spacing)</label>
                    <input 
                      placeholder="e.g. 1.2 or 1.5" 
                      value={currentTypoItem.height} 
                      onChange={(e) => updateTypographyAttr(selectedTypoKey, 'height', e.target.value)}
                      className="w-full border border-slate-200 rounded p-1.5 text-[11px] font-mono" 
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Live Preview Frame */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Live Design Preview</span>
                  
                  {/* Style Preview Box */}
                  <div 
                    style={{
                      backgroundColor: themeMode === 'dark' ? '#0f172a' : bgCol,
                      borderColor: borderCol,
                      borderRadius: borderRadius,
                    }}
                    className="border p-4 shadow-sm min-h-[160px] flex flex-col justify-center items-center gap-3 transition-colors"
                  >
                    <span 
                      style={{ 
                        color: themeMode === 'dark' ? '#f8fafc' : primaryCol,
                        fontFamily: getFontFamilyCss(currentTypoItem.font),
                        fontSize: currentTypoItem.size,
                        fontWeight: currentTypoItem.weight,
                        letterSpacing: currentTypoItem.spacing,
                        lineHeight: currentTypoItem.height
                      }}
                      className="text-center block break-words w-full"
                    >
                      Quick preview text based on configuration details
                    </span>
                    <button 
                      style={{ backgroundColor: buttonCol, color: buttonTextCol, borderRadius: borderRadius }}
                      className="px-4 py-1.5 text-xs font-semibold border-none cursor-pointer transition-colors shadow-2xs"
                    >
                      Theme Button
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[10.5px] leading-relaxed text-slate-500">
                  💡 **Instant global application**: When you click **Save Changes**, these colors and font configurations are applied immediately across all public layouts using Server-Side CSS Variable compilation.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: SEO */}
        {activeTab === 'SEO' && (
          <div className="space-y-6">
            <h3 className="text-[14.5px] font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">Search Engine Optimization (SEO)</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">Global Homepage Meta Title</label>
                <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-black" />
                <span className="text-[10px] text-slate-400 font-mono block">Recommended length: 50-60 characters ({metaTitle.length})</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">Global Meta Description</label>
                <textarea rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-black resize-y" />
                <span className="text-[10px] text-slate-400 font-mono block">Recommended length: 150-160 characters ({metaDescription.length})</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">Canonical robots.txt directive</label>
                <textarea rows={4} value={robotsText} onChange={(e) => setRobotsText(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono focus:border-black resize-y" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-150 p-3 rounded-lg">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Google Analytics Tag</span>
                    <span className="text-[10px] text-slate-400 block">Enable G-tag scripts</span>
                  </div>
                  <input value={googleAnalytics} onChange={(e) => setGoogleAnalytics(e.target.value)} placeholder="G-XXXXXXXXXX" className="flex-1 max-w-[150px] border border-slate-200 bg-white rounded p-1.5 text-xs text-center" />
                </div>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-150 p-3 rounded-lg">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Sitemap XML Generation</span>
                    <span className="text-[10px] text-slate-400 block">Index urls in sitemap.xml</span>
                  </div>
                  <input type="checkbox" checked={sitemapEnabled} onChange={(e) => setSitemapEnabled(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Security */}
        {activeTab === 'Security' && (
          <div className="space-y-6">
            <h3 className="text-[14.5px] font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">Console Security Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-150 p-4 rounded-lg">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[10.5px] text-slate-400 block">Require email verification OTP code on sign-in</span>
                </div>
                <input type="checkbox" checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} className="w-4 h-4 cursor-pointer" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700">Max Login Attempts (locks account temporarily)</label>
                  <input type="number" value={maxAttempts} onChange={(e) => setMaxAttempts(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-black" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700">Auto session timeout (minutes)</label>
                  <input type="number" value={sessionLimit} onChange={(e) => setSessionLimit(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-black" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700">Console Access IP Whitelist</label>
                <textarea rows={3} value={ipWhitelist} onChange={(e) => setIpWhitelist(e.target.value)} placeholder="Comma-separated IP addresses (leave blank to allow all)" className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono focus:border-black resize-y" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Backup & Restore */}
        {activeTab === 'Backup & Restore' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-[14.5px] font-bold text-slate-800 m-0 uppercase tracking-wider">Manual Database Backup & Restore Snapshots</h3>
              <button 
                onClick={triggerBackup}
                disabled={backupLoading}
                className="px-3.5 py-1.5 bg-[#111] hover:bg-[#222] text-white text-xs font-semibold rounded cursor-pointer transition disabled:opacity-50"
              >
                {backupLoading ? 'Creating Backup...' : 'Create Snapshot Backup'}
              </button>
            </div>
            
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Available Backup Files ({backups.length})</span>
              
              {backups.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium">
                  No backup files found. Click "Create Snapshot Backup" above to create one.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="p-3">Filename</th>
                        <th className="p-3">File Size</th>
                        <th className="p-3">Created At</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {backups.map((b) => (
                        <tr key={b.filename} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-slate-800">{b.filename}</td>
                          <td className="p-3 text-slate-600">{(b.size / 1024).toFixed(1)} KB</td>
                          <td className="p-3 text-slate-500">{new Date(b.createdAt).toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => triggerRestore(b.filename)}
                              className="px-2.5 py-1 border border-slate-350 text-slate-700 bg-white hover:bg-slate-100 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Restore Database
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: Activity Logs */}
        {activeTab === 'Activity Logs' && (
          <div className="space-y-6">
            <h3 className="text-[14.5px] font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">Security & Console Activity History</h3>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full border-collapse text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Action Description</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-xs text-slate-400 font-medium">No activity history logged.</td>
                    </tr>
                  ) : (
                    logs.map((l) => (
                      <tr key={l._id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500 font-mono">{new Date(l.timestamp).toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            l.type === 'security' ? 'bg-red-50 text-red-650' : l.type === 'error' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {l.type}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-semibold">{l.user}</td>
                        <td className="p-3 text-slate-800">{l.action}</td>
                        <td className="p-3 text-slate-400 font-mono">{l.ip || '127.0.0.1'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
