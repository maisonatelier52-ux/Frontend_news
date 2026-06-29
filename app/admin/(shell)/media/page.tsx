'use client'

import { useState } from 'react'

const mediaItems = [
  { id: 1, name: 'senate-vote.jpg', type: 'image', size: '1.2 MB', date: 'Jun 29, 2026', url: 'https://picsum.photos/seed/1/400/300' },
  { id: 2, name: 'tech-summit.jpg', type: 'image', size: '0.9 MB', date: 'Jun 29, 2026', url: 'https://picsum.photos/seed/2/400/300' },
  { id: 3, name: 'market-rally.jpg', type: 'image', size: '1.5 MB', date: 'Jun 28, 2026', url: 'https://picsum.photos/seed/3/400/300' },
  { id: 4, name: 'climate-summit.jpg', type: 'image', size: '2.1 MB', date: 'Jun 28, 2026', url: 'https://picsum.photos/seed/4/400/300' },
  { id: 5, name: 'world-cup.jpg', type: 'image', size: '0.7 MB', date: 'Jun 27, 2026', url: 'https://picsum.photos/seed/5/400/300' },
  { id: 6, name: 'supreme-court.jpg', type: 'image', size: '1.8 MB', date: 'Jun 27, 2026', url: 'https://picsum.photos/seed/6/400/300' },
  { id: 7, name: 'startup-funding.jpg', type: 'image', size: '0.6 MB', date: 'Jun 26, 2026', url: 'https://picsum.photos/seed/7/400/300' },
  { id: 8, name: 'unemployment-data.jpg', type: 'image', size: '0.4 MB', date: 'Jun 26, 2026', url: 'https://picsum.photos/seed/8/400/300' },
  { id: 9, name: 'hurricane-map.jpg', type: 'image', size: '3.2 MB', date: 'Jun 25, 2026', url: 'https://picsum.photos/seed/9/400/300' },
  { id: 10, name: 'nba-preview.jpg', type: 'image', size: '1.1 MB', date: 'Jun 25, 2026', url: 'https://picsum.photos/seed/10/400/300' },
  { id: 11, name: 'infra-bill.jpg', type: 'image', size: '0.8 MB', date: 'Jun 24, 2026', url: 'https://picsum.photos/seed/11/400/300' },
  { id: 12, name: 'fed-rates.jpg', type: 'image', size: '1.4 MB', date: 'Jun 24, 2026', url: 'https://picsum.photos/seed/12/400/300' },
]

export default function MediaPage() {
  const [selected, setSelected] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const filtered = mediaItems.filter((m) => m.name.includes(search))

  function toggleSelect(id: number) {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  function copyUrl(id: number, url: string) {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Media Library</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{mediaItems.length} files · 18.7 MB used</p>
        </div>
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Upload Files
        </button>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false) }}
        style={{
          border: `2px dashed ${dragging ? '#111' : '#e4e4e7'}`,
          borderRadius: 8,
          padding: '28px 40px',
          textAlign: 'center',
          marginBottom: 20,
          background: dragging ? '#f9f9f9' : '#fff',
          transition: 'all 0.15s',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
        <div style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>Drag & drop files here</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>or <span style={{ color: '#111', fontWeight: 600 }}>browse to upload</span> · PNG, JPG, WebP, GIF, MP4, PDF</div>
      </div>

      {/* Search & filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e4e4e7', borderRadius: 6, padding: '7px 12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            id="media-search"
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 13, outline: 'none', flex: 1 }}
          />
        </div>
        <select style={{ border: '1px solid #e4e4e7', borderRadius: 6, padding: '7px 12px', fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer', outline: 'none' }}>
          <option>All Types</option>
          <option>Images</option>
          <option>Videos</option>
          <option>Documents</option>
        </select>
        {selected.length > 0 && (
          <button style={{ padding: '7px 12px', fontSize: 12, border: '1px solid #fecaca', borderRadius: 5, background: '#fff', cursor: 'pointer', color: '#dc2626' }}>
            Delete ({selected.length})
          </button>
        )}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleSelect(item.id)}
            style={{
              background: '#fff',
              border: `2px solid ${selected.includes(item.id) ? '#111' : '#e4e4e7'}`,
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
              position: 'relative',
            }}
          >
            {selected.includes(item.id) && (
              <div style={{ position: 'absolute', top: 7, right: 7, width: 18, height: 18, background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.name} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{item.size} · {item.date}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 7 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); copyUrl(item.id, item.url) }}
                  style={{ flex: 1, fontSize: 10, padding: '3px 6px', border: '1px solid #e4e4e7', borderRadius: 4, background: '#f9f9f9', cursor: 'pointer', color: copied === item.id ? '#16a34a' : '#374151' }}
                >
                  {copied === item.id ? '✓ Copied' : 'Copy URL'}
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: 10, padding: '3px 6px', border: '1px solid #fecaca', borderRadius: 4, background: '#fff', cursor: 'pointer', color: '#dc2626' }}
                >
                  Del
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
