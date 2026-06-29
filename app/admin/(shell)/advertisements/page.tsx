'use client'

import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'

const adPositions = ['Header Banner', 'Sidebar Top', 'Sidebar Bottom', 'In-Article', 'Footer Banner', 'Sticky Bottom']

const initialAds = [
  { id: 1, name: 'Google AdSense — Header', position: 'Header Banner', size: '728×90', status: 'active', clicks: 2840, impressions: '124K', startDate: 'Jun 1, 2026', endDate: 'Jul 31, 2026' },
  { id: 2, name: 'NewsMax Sponsor — Sidebar', position: 'Sidebar Top', size: '300×250', status: 'active', clicks: 1200, impressions: '87K', startDate: 'Jun 15, 2026', endDate: 'Jul 15, 2026' },
  { id: 3, name: 'In-Article Native Ad', position: 'In-Article', size: '640×200', status: 'active', clicks: 640, impressions: '43K', startDate: 'Jun 1, 2026', endDate: 'Aug 1, 2026' },
  { id: 4, name: 'Footer Network Ad', position: 'Footer Banner', size: '728×90', status: 'inactive', clicks: 0, impressions: '—', startDate: '—', endDate: '—' },
  { id: 5, name: 'Sticky Mobile Banner', position: 'Sticky Bottom', size: '320×50', status: 'active', clicks: 3100, impressions: '210K', startDate: 'May 20, 2026', endDate: 'Jul 20, 2026' },
]

export default function AdvertisementsPage() {
  const [ads, setAds] = useState(initialAds)
  const [showForm, setShowForm] = useState(false)
  const [newAd, setNewAd] = useState({ name: '', position: 'Header Banner', size: '728×90', code: '', startDate: '', endDate: '' })

  function toggleStatus(id: number) {
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a))
  }

  function deleteAd(id: number) {
    setAds((prev) => prev.filter((a) => a.id !== id))
  }

  function addAd() {
    if (!newAd.name) return
    setAds((prev) => [...prev, {
      id: prev.length + 1, ...newAd, status: 'active', clicks: 0, impressions: '—',
    }])
    setNewAd({ name: '', position: 'Header Banner', size: '728×90', code: '', startDate: '', endDate: '' })
    setShowForm(false)
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid #e4e4e7', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Advertisements</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Manage ad slots across your news site</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Ad Slot
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Active Ads', value: ads.filter((a) => a.status === 'active').length, color: '#16a34a' },
          { label: 'Total Clicks', value: '7,780', color: '#111' },
          { label: 'Total Impressions', value: '464K', color: '#111' },
          { label: 'Est. Revenue', value: '$1,240', color: '#d97706' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, padding: 22, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 16 }}>New Ad Slot</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Ad Name *</label>
              <input placeholder="e.g. Google AdSense — Header" value={newAd.name} onChange={(e) => setNewAd((p) => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Position</label>
              <select value={newAd.position} onChange={(e) => setNewAd((p) => ({ ...p, position: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                {adPositions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Ad Size</label>
              <select value={newAd.size} onChange={(e) => setNewAd((p) => ({ ...p, size: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['728×90', '300×250', '320×50', '640×200', '160×600', '300×600'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Start / End Date</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="date" value={newAd.startDate} onChange={(e) => setNewAd((p) => ({ ...p, startDate: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
                <input type="date" value={newAd.endDate} onChange={(e) => setNewAd((p) => ({ ...p, endDate: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Ad Code / Script</label>
            <textarea placeholder="Paste your ad code here (Google AdSense, custom script, etc.)" rows={4} value={newAd.code} onChange={(e) => setNewAd((p) => ({ ...p, code: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addAd} style={{ padding: '8px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save Ad Slot</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 14px', background: '#fff', color: '#374151', border: '1px solid #e4e4e7', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Ad table */}
      <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e4e4e7' }}>
              {['Ad Name', 'Position', 'Size', 'Clicks', 'Impressions', 'Period', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ads.map((ad, i) => (
              <tr key={ad.id} style={{ borderBottom: i < ads.length - 1 ? '1px solid #f4f4f5' : 'none' }}>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500, color: '#111' }}>{ad.name}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#6b7280' }}>{ad.position}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{ad.size}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#374151', fontWeight: 500 }}>{ad.clicks.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#374151' }}>{ad.impressions}</td>
                <td style={{ padding: '12px 14px', fontSize: 11, color: '#9ca3af' }}>{ad.startDate} – {ad.endDate}</td>
                <td style={{ padding: '12px 14px' }}>
                  <StatusBadge status={ad.status as 'active' | 'inactive'} />
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleStatus(ad.id)}
                      style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #e4e4e7', borderRadius: 4, background: '#fff', cursor: 'pointer', color: '#374151' }}>
                      {ad.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => deleteAd(ad.id)}
                      style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #fecaca', borderRadius: 4, background: '#fff', cursor: 'pointer', color: '#dc2626' }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ad Position Map */}
      <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, padding: 22, marginTop: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 14 }}>Ad Position Map</div>
        <div style={{ border: '1px dashed #e4e4e7', borderRadius: 6, overflow: 'hidden', background: '#fafafa' }}>
          {/* Header */}
          <div style={{ background: '#dbeafe', border: '1px solid #bfdbfe', margin: 8, borderRadius: 4, padding: '8px 12px', textAlign: 'center', fontSize: 12, color: '#1d4ed8', fontWeight: 500 }}>
            📢 Header Banner (728×90)
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '0 8px 8px' }}>
            <div style={{ flex: 1, background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: 4, padding: '30px 12px', textAlign: 'center', fontSize: 11, color: '#0369a1' }}>
              Article Content Area
            </div>
            <div style={{ width: 120, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ background: '#f3e8ff', border: '1px solid #ddd6fe', borderRadius: 4, padding: '10px 6px', textAlign: 'center', fontSize: 10, color: '#6d28d9' }}>Sidebar Top (300×250)</div>
              <div style={{ background: '#f5f5f5', border: '1px solid #e4e4e7', borderRadius: 4, padding: '10px 6px', textAlign: 'center', fontSize: 10, color: '#9ca3af' }}>Sidebar Bottom</div>
            </div>
          </div>
          <div style={{ background: '#fef9c3', border: '1px solid #fde68a', margin: '0 8px 8px', borderRadius: 4, padding: '7px 12px', textAlign: 'center', fontSize: 12, color: '#92400e', fontWeight: 500 }}>
            📢 Footer Banner (728×90)
          </div>
        </div>
      </div>
    </div>
  )
}
