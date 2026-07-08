'use client'

import { useState, useEffect, useRef } from 'react'
import StatusBadge from '../../components/StatusBadge'

const adPositions = ['Header Banner', 'Sidebar Top', 'Sidebar Bottom', 'In-Article', 'Footer Banner', 'Sticky Bottom']
const adSizes = ['728×90', '300×250', '320×50', '640×200', '160×600', '300×600']

interface Ad {
  _id: string
  name: string
  position: string
  size: string
  imageUrl: string
  status: string // 'active' | 'inactive'
  clicks: number
  impressions: string | number
  startDate: string
  endDate: string
}

export default function AdvertisementsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [newAd, setNewAd] = useState({
    name: '',
    position: 'Header Banner',
    size: '728×90',
    imageUrl: '',
    startDate: '',
    endDate: ''
  })

  // Load from database
  async function fetchAds() {
    try {
      setLoading(true)
      const res = await fetch('/api/advertisements')
      if (res.ok) {
        const data = await res.json()
        setAds(data)
      }
    } catch (e) {
      console.error('Failed to load advertisements from API', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'images/ad')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        setNewAd((prev) => ({ ...prev, imageUrl: data.url }))
      } else {
        alert('Failed to upload image. Please try again.')
      }
    } catch (err) {
      console.error('Image upload error:', err)
      alert('Failed to upload image due to a network error.')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [])

  async function toggleStatus(id: string, currentStatus: string) {
    try {
      const nextStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const res = await fetch('/api/advertisements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      })
      if (res.ok) {
        setAds((prev) => prev.map((a) => a._id === id ? { ...a, status: nextStatus } : a))
      }
    } catch (e) {
      console.error('Failed to toggle ad status', e)
    }
  }

  async function deleteAd(id: string) {
    if (confirm('Are you sure you want to delete this ad slot?')) {
      try {
        const res = await fetch(`/api/advertisements?id=${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          setAds((prev) => prev.filter((a) => a._id !== id))
          if (editingId === id) {
            cancelEdit()
          }
        }
      } catch (e) {
        console.error('Failed to delete ad campaign', e)
      }
    }
  }

  function handleEdit(ad: Ad) {
    setEditingId(ad._id)
    setNewAd({
      name: ad.name,
      position: ad.position,
      size: ad.size,
      imageUrl: ad.imageUrl || '',
      startDate: ad.startDate === '—' ? '' : ad.startDate,
      endDate: ad.endDate === '—' ? '' : ad.endDate
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setNewAd({ name: '', position: 'Header Banner', size: '728×90', imageUrl: '', startDate: '', endDate: '' })
    setShowForm(false)
  }

  async function handleSaveAd() {
    if (!newAd.name.trim() || !newAd.imageUrl.trim()) return

    try {
      if (editingId !== null) {
        // Editing Mode
        const res = await fetch('/api/advertisements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            name: newAd.name,
            position: newAd.position,
            size: newAd.size,
            imageUrl: newAd.imageUrl,
            startDate: newAd.startDate || '—',
            endDate: newAd.endDate || '—'
          })
        })
        if (res.ok) {
          const updated = await res.json()
          setAds((prev) => prev.map((a) => a._id === editingId ? updated : a))
          setEditingId(null)
        }
      } else {
        // Adding Mode
        const res = await fetch('/api/advertisements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newAd.name,
            position: newAd.position,
            size: newAd.size,
            imageUrl: newAd.imageUrl,
            startDate: newAd.startDate || '—',
            endDate: newAd.endDate || '—'
          })
        })
        if (res.ok) {
          const created = await res.json()
          setAds((prev) => [created, ...prev])
        }
      }
      setNewAd({ name: '', position: 'Header Banner', size: '728×90', imageUrl: '', startDate: '', endDate: '' })
      setShowForm(false)
    } catch (e) {
      console.error('Failed to save advertisement', e)
    }
  }

  // Calculate dynamic stats
  const activeCount = ads.filter((a) => a.status === 'active').length
  const totalClicks = ads.reduce((sum, a) => sum + (Number(a.clicks) || 0), 0)
  
  const parseImpressions = (imp: string | number): number => {
    if (typeof imp === 'number') return imp
    if (!imp || imp === '—') return 0
    const normalized = imp.toUpperCase().trim()
    if (normalized.endsWith('K')) return parseFloat(normalized) * 1000
    if (normalized.endsWith('M')) return parseFloat(normalized) * 1000000
    return parseFloat(normalized) || 0
  }
  
  const totalImpressionsVal = ads.reduce((sum, a) => sum + parseImpressions(a.impressions), 0)
  const totalImpressionsStr = totalImpressionsVal >= 1000000 
    ? (totalImpressionsVal / 1000000).toFixed(1) + 'M' 
    : totalImpressionsVal >= 1000 
      ? (totalImpressionsVal / 1000).toFixed(0) + 'K' 
      : totalImpressionsVal.toString()

  const estimatedRevenue = (totalClicks * 0.18).toFixed(2)

  // Filter ads based on search query
  const filteredAds = ads.filter((ad) => 
    ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const inputStyle: React.CSSProperties = { 
    width: '100%', 
    border: '1px solid #e4e4e7', 
    borderRadius: 6, 
    padding: '9px 12px', 
    fontSize: 13, 
    color: '#111', 
    outline: 'none', 
    background: '#fff', 
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-left pb-16">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Advertisement Engine</h1>
          <p className="text-xs text-zinc-500 mt-1">Configure layout banner slots, and direct image campaigns live synced with database</p>
        </div>
        <button 
          onClick={() => {
            if (showForm && editingId !== null) {
              cancelEdit()
            } else {
              setShowForm(!showForm)
              setEditingId(null)
            }
          }}
          className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border-none py-2 px-4 rounded-md text-xs font-bold shadow-3xs cursor-pointer transition select-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            {showForm ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />}
          </svg>
          <span>{showForm ? 'Close Editor' : 'Add Advertisement'}</span>
        </button>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Slots', value: activeCount, color: 'text-emerald-700', bg: 'bg-emerald-50/40 border-emerald-100' },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), color: 'text-zinc-900', bg: 'bg-zinc-50 border-zinc-100' },
          { label: 'Impressions', value: totalImpressionsStr, color: 'text-zinc-900', bg: 'bg-zinc-50 border-zinc-100' },
          { label: 'Est. Revenue', value: `$${estimatedRevenue}`, color: 'text-amber-700', bg: 'bg-amber-50/40 border-amber-100' },
        ].map((s, index) => (
          <div key={index} className={`border rounded-lg p-4 shadow-3xs hover:shadow-2xs transition select-none ${s.bg}`}>
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">{s.label}</div>
            <div className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Interactive Form Panel (Add / Edit) */}
      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-lg shadow-3xs p-6 space-y-5 animate-[admin-fade-in_0.2s_ease-out]">
          <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
            <h3 className="font-bold text-sm text-zinc-900">
              {editingId !== null ? `Edit Advertisement` : 'Configure New Advertisement'}
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">DATABASE INTEGRATED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ad name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Ad Campaign Name *</label>
              <input 
                type="text"
                placeholder="e.g. Q3 Premium Tech Sponsor" 
                value={newAd.name} 
                onChange={(e) => setNewAd((p) => ({ ...p, name: e.target.value }))} 
                style={inputStyle} 
              />
            </div>

            {/* Position */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Placement Zone</label>
              <select 
                value={newAd.position} 
                onChange={(e) => setNewAd((p) => ({ ...p, position: e.target.value }))} 
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {adPositions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Ad Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Dimension Scale</label>
              <select 
                value={newAd.size} 
                onChange={(e) => setNewAd((p) => ({ ...p, size: e.target.value }))} 
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {adSizes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Date period range */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Campaign Active Period</label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={newAd.startDate} 
                  onChange={(e) => setNewAd((p) => ({ ...p, startDate: e.target.value }))} 
                  style={{ ...inputStyle, flex: 1 }} 
                />
                <input 
                  type="date" 
                  value={newAd.endDate} 
                  onChange={(e) => setNewAd((p) => ({ ...p, endDate: e.target.value }))} 
                  style={{ ...inputStyle, flex: 1 }} 
                />
              </div>
            </div>

            {/* Banner Image URL & File Upload */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Banner Image *</label>
              
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                {/* Text URL option */}
                <input 
                  type="text" 
                  placeholder="Paste banner image URL (e.g. https://example.com/banner.jpg)" 
                  value={newAd.imageUrl} 
                  onChange={(e) => setNewAd((p) => ({ ...p, imageUrl: e.target.value }))} 
                  style={{ ...inputStyle, flex: 1 }} 
                />
                
                {/* File Upload Option */}
                <div className="shrink-0 flex items-center">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-zinc-400 py-2 px-4 rounded-md text-xs font-bold shadow-3xs cursor-pointer transition select-none flex items-center gap-1.5 whitespace-nowrap text-zinc-700 w-full justify-center sm:w-auto"
                  >
                    {uploading ? (
                      <>
                        <span className="inline-block animate-spin">⏳</span>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span>📤</span>
                        <span>Upload Image File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <span className="text-[10px] text-zinc-400 block mt-1 leading-normal">
                Choose to paste an external image URL or upload an image file directly (which will be saved under <strong>/images/ad/</strong> folder).
              </span>
            </div>
          </div>

          {/* Localized preview box */}
          {newAd.imageUrl && (
            <div className="border border-zinc-155 rounded bg-zinc-50/50 p-4 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Live Banner Preview</span>
              <div className="max-w-full overflow-hidden flex justify-center border border-zinc-200 bg-white p-2 rounded">
                <img 
                  src={newAd.imageUrl} 
                  alt="Campaign banner preview" 
                  className="max-h-36 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&fit=crop'
                  }}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={handleSaveAd} 
              disabled={!newAd.name.trim() || !newAd.imageUrl.trim()}
              className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white border-none py-2 px-5 rounded-md text-xs font-bold shadow-3xs cursor-pointer transition select-none"
            >
              {editingId !== null ? 'Update Ad Slot' : 'Save Ad Slot'}
            </button>
            <button 
              onClick={cancelEdit} 
              className="bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-300 py-2 px-4 rounded-md text-xs font-semibold cursor-pointer transition select-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters & search row */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-grow max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text"
            placeholder="Search campaigns or placement zone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-zinc-200 rounded-md text-xs w-full outline-none focus:border-zinc-500 transition"
          />
        </div>
        <div className="text-[10px] text-zinc-400 font-mono text-right select-none">
          Showing {filteredAds.length} of {ads.length} configured items
        </div>
      </div>

      {/* Ad List Table Section */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-3xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-zinc-400 font-mono animate-pulse">
            Syncing campaigns from MongoDB...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-150">
                  {['Campaign Name', 'Zone Position', 'Dimension', 'Clicks', 'Impressions', 'Active Range', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-[10px] text-zinc-400 font-bold uppercase tracking-wider select-none whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredAds.length > 0 ? (
                  filteredAds.map((ad) => (
                    <tr key={ad._id} className="hover:bg-zinc-50/40 transition">
                      <td className="py-3.5 px-4 font-bold text-zinc-900 select-all">{ad.name}</td>
                      <td className="py-3.5 px-4 text-zinc-500 font-semibold">{ad.position}</td>
                      <td className="py-3.5 px-4 font-mono text-zinc-400">{ad.size}</td>
                      <td className="py-3.5 px-4 font-bold text-zinc-700">{ad.clicks.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-zinc-555 font-mono">{ad.impressions}</td>
                      <td className="py-3.5 px-4 text-[10px] text-zinc-400 font-mono">
                        {ad.startDate && ad.startDate !== '—' ? new Date(ad.startDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : '—'} – {ad.endDate && ad.endDate !== '—' ? new Date(ad.endDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: '2-digit'}) : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={ad.status as any} />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(ad)}
                            className="text-[11px] font-bold px-2.5 py-1 border border-zinc-200 rounded-sm bg-white hover:bg-zinc-50 cursor-pointer text-zinc-700 transition"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => toggleStatus(ad._id, ad.status)}
                            className={`text-[11px] font-bold px-2.5 py-1 border rounded-sm cursor-pointer transition ${ad.status === 'active' ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700' : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'}`}
                          >
                            {ad.status === 'active' ? 'Pause' : 'Resume'}
                          </button>
                          <button 
                            onClick={() => deleteAd(ad._id)}
                            className="text-[11px] font-bold px-2.5 py-1 border border-red-200 hover:bg-red-50 rounded-sm cursor-pointer text-red-650 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400 font-mono">
                      No active campaigns match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ad Position Visual Layout Map */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
        <div className="border-b border-zinc-150 pb-2">
          <h3 className="font-bold text-sm text-zinc-900">Placement Zone Mapping</h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">Visualize where advertisements scale and fit inside standard reader pages</p>
        </div>
        <div className="border border-dashed border-zinc-200 rounded-md overflow-hidden bg-zinc-50/50 p-4 max-w-2xl mx-auto space-y-3">
          {/* Header Banner Zone */}
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-md py-2.5 text-center text-xs text-indigo-700 font-bold tracking-wide select-none">
            📢 Header Banner (728×90 Horizontal Scale)
          </div>
          
          {/* Body structure split */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow bg-zinc-100/50 border border-zinc-200 rounded-md p-6 text-center text-xs text-zinc-500 font-medium select-none">
              Article Content Grid
              <div className="bg-amber-50/60 border border-amber-200 rounded-sm py-1.5 px-3 mt-4 text-[10px] text-amber-700 font-bold tracking-wide">
                📢 In-Article Native Banner (640×200 Medium banner)
              </div>
            </div>
            <div className="w-full sm:w-48 flex flex-col gap-2 shrink-0">
              <div className="bg-purple-50/60 border border-purple-200 rounded-md py-4 px-3 text-center text-[10px] text-purple-700 font-bold tracking-wide select-none">
                📢 Sidebar Top (300×250 Rectangular Grid)
              </div>
              <div className="bg-zinc-200/40 border border-zinc-300 rounded-md py-4 px-3 text-center text-[10px] text-zinc-400 font-bold tracking-wide select-none">
                Sidebar Bottom Ad Slot
              </div>
            </div>
          </div>

          {/* Footer Banner Zone */}
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-md py-2.5 text-center text-xs text-indigo-700 font-bold tracking-wide select-none">
            📢 Footer Banner (728×90 Horizontal Scale)
          </div>
        </div>
      </div>

    </div>
  )
}
