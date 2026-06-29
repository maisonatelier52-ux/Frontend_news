'use client'

import { useState } from 'react'

const initialColumns = [
  {
    id: 1, heading: 'Company',
    links: [
      { id: 1, label: 'About Us', url: '/about' },
      { id: 2, label: 'Careers', url: '/careers' },
      { id: 3, label: 'Contact', url: '/contact' },
      { id: 4, label: 'Advertise', url: '/advertise' },
    ],
  },
  {
    id: 2, heading: 'News',
    links: [
      { id: 1, label: 'Politics', url: '/category/politics' },
      { id: 2, label: 'Technology', url: '/category/technology' },
      { id: 3, label: 'Business', url: '/category/business' },
      { id: 4, label: 'World', url: '/category/world' },
    ],
  },
  {
    id: 3, heading: 'Policies',
    links: [
      { id: 1, label: 'Privacy Policy', url: '/privacy' },
      { id: 2, label: 'Terms of Service', url: '/terms' },
      { id: 3, label: 'Cookie Policy', url: '/cookies' },
      { id: 4, label: 'DMCA', url: '/dmca' },
    ],
  },
]

const initialSocials = [
  { id: 1, platform: 'Twitter/X', icon: '𝕏', url: 'https://twitter.com/newssite' },
  { id: 2, platform: 'Facebook', icon: 'f', url: 'https://facebook.com/newssite' },
  { id: 3, platform: 'Instagram', icon: '📸', url: 'https://instagram.com/newssite' },
  { id: 4, platform: 'YouTube', icon: '▶', url: 'https://youtube.com/@newssite' },
  { id: 5, platform: 'LinkedIn', icon: 'in', url: 'https://linkedin.com/company/newssite' },
]

export default function FooterPage() {
  const [columns, setColumns] = useState(initialColumns)
  const [socials, setSocials] = useState(initialSocials)
  const [copyright, setCopyright] = useState('© 2026 The Domain Name. All rights reserved.')
  const [saved, setSaved] = useState(false)
  const [newLink, setNewLink] = useState<Record<number, { label: string; url: string }>>({})

  function updateColumnHeading(colId: number, value: string) {
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, heading: value } : c))
  }

  function addLink(colId: number) {
    const link = newLink[colId]
    if (!link?.label) return
    setColumns((prev) => prev.map((c) => c.id === colId
      ? { ...c, links: [...c.links, { id: c.links.length + 1, label: link.label, url: link.url || '#' }] }
      : c))
    setNewLink((prev) => ({ ...prev, [colId]: { label: '', url: '' } }))
  }

  function removeLink(colId: number, linkId: number) {
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, links: c.links.filter((l) => l.id !== linkId) } : c))
  }

  function updateSocial(id: number, field: 'url', value: string) {
    setSocials((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle: React.CSSProperties = { border: '1px solid #e4e4e7', borderRadius: 5, padding: '6px 10px', fontSize: 12, color: '#111', outline: 'none', background: '#fff' }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Footer Manager</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Manage footer columns, links, social media, and copyright</p>
        </div>
        <button onClick={handleSave}
          style={{ background: '#111', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Footer Columns */}
      <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, padding: 22, marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 16 }}>Footer Columns</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {columns.map((col) => (
            <div key={col.id} style={{ border: '1px solid #e4e4e7', borderRadius: 7, overflow: 'hidden' }}>
              {/* Column header */}
              <div style={{ background: '#f9f9f9', padding: '10px 14px', borderBottom: '1px solid #e4e4e7' }}>
                <input
                  value={col.heading}
                  onChange={(e) => updateColumnHeading(col.id, e.target.value)}
                  style={{ ...inputStyle, width: '100%', fontWeight: 600, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              {/* Links */}
              <div style={{ padding: 12 }}>
                {col.links.map((link) => (
                  <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                    <input defaultValue={link.label} style={{ ...inputStyle, flex: 1 }} placeholder="Label" />
                    <input defaultValue={link.url} style={{ ...inputStyle, flex: 1 }} placeholder="URL" />
                    <button onClick={() => removeLink(col.id, link.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16, lineHeight: 1 }} aria-label="Remove link">×</button>
                  </div>
                ))}

                {/* Add link */}
                <div style={{ display: 'flex', gap: 5, marginTop: 8, paddingTop: 8, borderTop: '1px dashed #e4e4e7' }}>
                  <input
                    placeholder="Label"
                    value={newLink[col.id]?.label || ''}
                    onChange={(e) => setNewLink((prev) => ({ ...prev, [col.id]: { ...prev[col.id], label: e.target.value } }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    placeholder="URL"
                    value={newLink[col.id]?.url || ''}
                    onChange={(e) => setNewLink((prev) => ({ ...prev, [col.id]: { ...prev[col.id], url: e.target.value } }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button onClick={() => addLink(col.id)} style={{ padding: '5px 10px', background: '#111', color: '#fff', border: 'none', borderRadius: 5, fontSize: 12, cursor: 'pointer' }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, padding: 22, marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 16 }}>Social Media Links</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {socials.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: '#f4f4f5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#374151', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div style={{ width: 100, fontSize: 13, color: '#374151', fontWeight: 500 }}>{s.platform}</div>
              <input
                value={s.url}
                onChange={(e) => updateSocial(s.id, 'url', e.target.value)}
                style={{ ...inputStyle, flex: 1, fontSize: 13 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, padding: 22, marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 12 }}>Copyright Text</div>
        <input
          value={copyright}
          onChange={(e) => setCopyright(e.target.value)}
          style={{ ...inputStyle, width: '100%', fontSize: 13, padding: '9px 12px', boxSizing: 'border-box' }}
        />
      </div>

      {/* Live Preview */}
      <div style={{ border: '1px solid #e4e4e7', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', background: '#f9f9f9', borderBottom: '1px solid #e4e4e7', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Footer Preview
        </div>
        <div style={{ background: '#111111', padding: '30px 28px 20px', color: '#e5e5e5' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            {columns.map((col) => (
              <div key={col.id}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{col.heading}</div>
                {col.links.map((link) => (
                  <div key={link.id} style={{ fontSize: 12, color: '#9ca3af', marginBottom: 5 }}>{link.label}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{copyright}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map((s) => (
                <div key={s.id} style={{ width: 24, height: 24, background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#aaa' }}>{s.icon}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
