'use client'

import { useState, useEffect } from 'react'

interface FooterLink {
  id: number
  label: string
  url: string
}

interface FooterColumn {
  id: number
  heading: string
  links: FooterLink[]
  isVisible?: boolean
}

interface SocialLink {
  id: number
  platform: string
  icon: string
  url: string
}

export default function FooterPage() {
  const [columns, setColumns] = useState<FooterColumn[]>([])
  const [socials, setSocials] = useState<SocialLink[]>([])
  const [copyright, setCopyright] = useState('© 2026 The Domain Name. All rights reserved.')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [logoText, setLogoText] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  
  // Custom styling settings
  const [bgColor, setBgColor] = useState('#111111')
  const [textColor, setTextColor] = useState('#d4d4d8')
  const [paddingY, setPaddingY] = useState('40px')
  const [borderTopColor, setBorderTopColor] = useState('#27272a')

  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [newLink, setNewLink] = useState<Record<number, { label: string; url: string }>>({})

  // Load from Database settings config
  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.footer) {
          const f = data.footer
          setColumns(f.columns || [])
          setSocials(f.socials || [])
          setCopyright(f.copyright || '© 2026 The Domain Name. All rights reserved.')
          setAddress(f.address || '')
          setPhone(f.phone || '')
          setEmail(f.email || '')
          setLogoText(f.logoText || 'THE DOMAIN NAME')
          setNewsletter(f.newsletter !== false)
          setBgColor(f.bgColor || '#111111')
          setTextColor(f.textColor || '#d4d4d8')
          setPaddingY(f.paddingY || '40px')
          setBorderTopColor(f.borderTopColor || '#27272a')
        }
      }
    } catch (e) {
      console.error('Failed to load footer settings', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  function updateColumnHeading(colId: number, value: string) {
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, heading: value } : c))
  }

  function toggleColumnVisibility(colId: number) {
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, isVisible: !(c.isVisible !== false) } : c))
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

  function updateLinkValue(colId: number, linkId: number, field: 'label' | 'url', value: string) {
    setColumns((prev) => prev.map((c) => c.id === colId 
      ? { ...c, links: c.links.map(l => l.id === linkId ? { ...l, [field]: value } : l) } 
      : c
    ))
  }

  function updateSocial(id: number, value: string) {
    setSocials((prev) => prev.map((s) => s.id === id ? { ...s, url: value } : s))
  }

  async function handleSave() {
    try {
      const payload = {
        footer: {
          layout: 'dynamic',
          columns,
          socials,
          copyright,
          address,
          phone,
          email,
          logoText,
          newsletter,
          bgColor,
          textColor,
          paddingY,
          borderTopColor
        }
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);

        // Audit Log
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'activity',
            action: 'FOOTER_UPDATE',
            details: { headingKeys: columns.map(c => c.heading) },
            user: 'Admin'
          })
        });
      }
    } catch (err) {
      alert('Failed to save footer layout settings');
    }
  }

  const inputStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 6, padding: '7px 11px', fontSize: 12, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-500 font-sans">Syncing Footer configuration...</span>
      </div>
    )
  }

  return (
    <div className="max-w-[1150px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-sans font-extrabold text-[#111] m-0">Footer Manager</h1>
          <p className="text-[12.5px] text-slate-500 mt-1 font-medium">Manage column structure, navigation items, newsletter visibility, social hooks and visual styling tokens.</p>
        </div>
        <button onClick={handleSave}
          className="px-4 py-2 bg-[#111] hover:bg-[#222] text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-[0_2px_4px_rgba(0,0,0,0.06)] flex items-center gap-1.5"
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns Settings - Span 2 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Footer Columns */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Footer Link Columns</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {columns.map((col) => (
                <div key={col.id} className="border border-slate-150 rounded-lg overflow-hidden flex flex-col justify-between">
                  {/* Column header */}
                  <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center gap-2">
                    <input
                      value={col.heading}
                      onChange={(e) => updateColumnHeading(col.id, e.target.value)}
                      style={{ ...inputStyle, width: '100%', fontWeight: 700, fontSize: 13 }}
                    />
                    <button 
                      onClick={() => toggleColumnVisibility(col.id)}
                      className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                        col.isVisible !== false ? 'bg-indigo-50 text-indigo-750' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {col.isVisible !== false ? 'Show' : 'Hide'}
                    </button>
                  </div>

                  {/* Links */}
                  <div className="p-3 space-y-2 flex-1">
                    {col.links.map((link) => (
                      <div key={link.id} className="flex items-center gap-2">
                        <input value={link.label} onChange={(e) => updateLinkValue(col.id, link.id, 'label', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Label" />
                        <input value={link.url} onChange={(e) => updateLinkValue(col.id, link.id, 'url', e.target.value)} style={{ ...inputStyle, flex: 1.2 }} placeholder="URL" />
                        <button onClick={() => removeLink(col.id, link.id)} className="text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer text-sm font-bold leading-none p-1">✕</button>
                      </div>
                    ))}

                    {/* Add link */}
                    <div className="flex gap-2 pt-2.5 mt-2.5 border-t border-dashed border-slate-150">
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
                        style={{ ...inputStyle, flex: 1.2 }}
                      />
                      <button onClick={() => addLink(col.id)} className="px-2.5 py-1 bg-black text-white hover:bg-slate-800 text-xs font-semibold rounded cursor-pointer">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Social Media Profile URLs</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socials.map((s) => (
                <div key={s.id} className="flex items-center gap-3.5 border border-slate-150 p-2.5 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-800 text-xs shrink-0 select-none">
                    {s.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">{s.platform}</span>
                    <input
                      value={s.url}
                      onChange={(e) => updateSocial(s.id, e.target.value)}
                      style={{ ...inputStyle, width: '100%', padding: '4px 8px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns Settings - Span 1 */}
        <div className="space-y-6">
          
          {/* Logo & Contact details */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Logo & Contact Details</span>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Footer Logo Title</label>
              <input value={logoText} onChange={(e) => setLogoText(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Office Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Office Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Editorial Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Copyright Text</label>
              <input value={copyright} onChange={(e) => setCopyright(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-150 p-2.5 rounded">
              <span className="text-xs font-semibold text-slate-700">Show Newsletter Box</span>
              <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="w-4 h-4 cursor-pointer text-black" />
            </div>
          </div>

          {/* Layout & Appearance styling */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Appearance Styling</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600">Background Color</label>
                <div className="flex gap-1">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 border-none p-0 cursor-pointer rounded bg-transparent" />
                  <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 text-[10px] uppercase font-mono" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600">Text & Links Color</label>
                <div className="flex gap-1">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-6 h-6 border-none p-0 cursor-pointer rounded bg-transparent" />
                  <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 text-[10px] uppercase font-mono" />
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-slate-600 block">Vertical Spacing (Padding): <span className="font-mono">{paddingY}</span></label>
                <select value={paddingY} onChange={(e) => setPaddingY(e.target.value)} className="w-full border border-slate-200 rounded px-1.5 py-1 text-[11px]">
                  <option value="20px">20px (Compact)</option>
                  <option value="40px">40px (Default)</option>
                  <option value="60px">60px (Generous)</option>
                  <option value="80px">80px (Extra Spacious)</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
