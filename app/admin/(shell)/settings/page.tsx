'use client'

import { useState } from 'react'

const tabs = ['General', 'SEO', 'Email', 'Social', 'Security']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General')
  const [saved, setSaved] = useState(false)
  const [twoFA, setTwoFA] = useState(false)

  const [general, setGeneral] = useState({
    siteName: 'The Domain Name',
    tagline: 'US & World News, Analysis & Opinion',
    timezone: 'America/New_York',
    language: 'en',
    articlesPerPage: '10',
    breakingNewsBanner: true,
  })

  const [seo, setSeo] = useState({
    metaTitle: 'The Domain Name | US & World News, Analysis & Opinion',
    metaDescription: 'Independent, in-depth journalism covering politics, business, technology, science, culture, and sports.',
    googleAnalytics: 'G-XXXXXXXXXX',
    sitemapEnabled: true,
  })

  const [email, setEmail] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'noreply@newssite.com',
    smtpPass: '',
    fromName: 'NewsAdmin',
    fromEmail: 'noreply@newssite.com',
  })

  const [social, setSocial] = useState({
    twitter: 'https://twitter.com/newssite',
    facebook: 'https://facebook.com/newssite',
    instagram: 'https://instagram.com/newssite',
    youtube: 'https://youtube.com/@newssite',
    linkedin: '',
    rss: '/rss.xml',
  })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid #e4e4e7', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Settings</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Configure your news site preferences</p>
        </div>
        <button onClick={handleSave}
          style={{ background: '#111', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e4e4e7', marginBottom: 24, gap: 2 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 18px', fontSize: 13, border: 'none', background: 'transparent', cursor: 'pointer',
              color: activeTab === tab ? '#111' : '#6b7280',
              fontWeight: activeTab === tab ? 600 : 400,
              borderBottom: activeTab === tab ? '2px solid #111' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, padding: 28 }}>
        {/* General */}
        {activeTab === 'General' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111', paddingBottom: 12, borderBottom: '1px solid #f4f4f5' }}>General Settings</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label htmlFor="set-site-name" style={labelStyle}>Site Name</label>
                <input id="set-site-name" value={general.siteName} onChange={(e) => setGeneral((p) => ({ ...p, siteName: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="set-tagline" style={labelStyle}>Tagline</label>
                <input id="set-tagline" value={general.tagline} onChange={(e) => setGeneral((p) => ({ ...p, tagline: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="set-timezone" style={labelStyle}>Timezone</label>
                <select id="set-timezone" value={general.timezone} onChange={(e) => setGeneral((p) => ({ ...p, timezone: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata'].map((tz) => (
                    <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="set-language" style={labelStyle}>Language</label>
                <select id="set-language" value={general.language} onChange={(e) => setGeneral((p) => ({ ...p, language: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label htmlFor="set-articles-per-page" style={labelStyle}>Articles Per Page</label>
                <input id="set-articles-per-page" type="number" min={5} max={50} value={general.articlesPerPage} onChange={(e) => setGeneral((p) => ({ ...p, articlesPerPage: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f9f9f9', borderRadius: 7, border: '1px solid #e4e4e7' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>Breaking News Banner</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Show scrolling breaking news ticker on homepage</div>
              </div>
              <button onClick={() => setGeneral((p) => ({ ...p, breakingNewsBanner: !p.breakingNewsBanner }))}
                style={{ width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', background: general.breakingNewsBanner ? '#111' : '#e4e4e7', position: 'relative', transition: 'background 0.2s' }}
                aria-label="Toggle Breaking News Banner">
                <span style={{ position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', left: general.breakingNewsBanner ? 21 : 3, transition: 'left 0.2s' }} />
              </button>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'SEO' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111', paddingBottom: 12, borderBottom: '1px solid #f4f4f5' }}>SEO Settings</div>
            <div>
              <label htmlFor="set-meta-title" style={labelStyle}>Default Meta Title</label>
              <input id="set-meta-title" value={seo.metaTitle} onChange={(e) => setSeo((p) => ({ ...p, metaTitle: e.target.value }))} style={inputStyle} />
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{seo.metaTitle.length} / 65 characters</div>
            </div>
            <div>
              <label htmlFor="set-meta-desc" style={labelStyle}>Default Meta Description</label>
              <textarea id="set-meta-desc" value={seo.metaDescription} onChange={(e) => setSeo((p) => ({ ...p, metaDescription: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{seo.metaDescription.length} / 160 characters</div>
            </div>
            <div>
              <label htmlFor="set-ga" style={labelStyle}>Google Analytics ID</label>
              <input id="set-ga" value={seo.googleAnalytics} onChange={(e) => setSeo((p) => ({ ...p, googleAnalytics: e.target.value }))} placeholder="G-XXXXXXXXXX" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f9f9f9', borderRadius: 7, border: '1px solid #e4e4e7' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>Auto-generate Sitemap</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Automatically update sitemap.xml on publish</div>
              </div>
              <button onClick={() => setSeo((p) => ({ ...p, sitemapEnabled: !p.sitemapEnabled }))}
                style={{ width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', background: seo.sitemapEnabled ? '#111' : '#e4e4e7', position: 'relative' }}
                aria-label="Toggle Sitemap">
                <span style={{ position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', left: seo.sitemapEnabled ? 21 : 3, transition: 'left 0.2s' }} />
              </button>
            </div>
          </div>
        )}

        {/* Email */}
        {activeTab === 'Email' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111', paddingBottom: 12, borderBottom: '1px solid #f4f4f5' }}>Email / SMTP Configuration</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label htmlFor="set-smtp-host" style={labelStyle}>SMTP Host</label>
                <input id="set-smtp-host" value={email.smtpHost} onChange={(e) => setEmail((p) => ({ ...p, smtpHost: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="set-smtp-port" style={labelStyle}>SMTP Port</label>
                <input id="set-smtp-port" value={email.smtpPort} onChange={(e) => setEmail((p) => ({ ...p, smtpPort: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="set-smtp-user" style={labelStyle}>SMTP Username</label>
                <input id="set-smtp-user" value={email.smtpUser} onChange={(e) => setEmail((p) => ({ ...p, smtpUser: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="set-smtp-pass" style={labelStyle}>SMTP Password</label>
                <input id="set-smtp-pass" type="password" value={email.smtpPass} onChange={(e) => setEmail((p) => ({ ...p, smtpPass: e.target.value }))} placeholder="••••••••" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="set-from-name" style={labelStyle}>From Name</label>
                <input id="set-from-name" value={email.fromName} onChange={(e) => setEmail((p) => ({ ...p, fromName: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="set-from-email" style={labelStyle}>From Email</label>
                <input id="set-from-email" type="email" value={email.fromEmail} onChange={(e) => setEmail((p) => ({ ...p, fromEmail: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <button style={{ alignSelf: 'flex-start', padding: '7px 16px', background: '#f4f4f5', color: '#374151', border: '1px solid #e4e4e7', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
              Send Test Email
            </button>
          </div>
        )}

        {/* Social */}
        {activeTab === 'Social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111', paddingBottom: 12, borderBottom: '1px solid #f4f4f5' }}>Social Media Profiles</div>
            {[
              { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/yoursite' },
              { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
              { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
              { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
              { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' },
              { key: 'rss', label: 'RSS Feed URL', placeholder: '/rss.xml' },
            ].map((s) => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ ...labelStyle, margin: 0, width: 110, flexShrink: 0 }}>{s.label}</label>
                <input
                  value={social[s.key as keyof typeof social]}
                  onChange={(e) => setSocial((p) => ({ ...p, [s.key]: e.target.value }))}
                  placeholder={s.placeholder}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Security */}
        {activeTab === 'Security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111', paddingBottom: 12, borderBottom: '1px solid #f4f4f5' }}>Security Settings</div>

            {/* Change password */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 14 }}>Change Password</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label htmlFor="set-current-pass" style={labelStyle}>Current Password</label>
                  <input id="set-current-pass" type="password" placeholder="••••••••" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label htmlFor="set-new-pass" style={labelStyle}>New Password</label>
                    <input id="set-new-pass" type="password" placeholder="••••••••" style={inputStyle} />
                  </div>
                  <div>
                    <label htmlFor="set-confirm-pass" style={labelStyle}>Confirm New Password</label>
                    <input id="set-confirm-pass" type="password" placeholder="••••••••" style={inputStyle} />
                  </div>
                </div>
                <button style={{ alignSelf: 'flex-start', padding: '8px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Update Password
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 14 }}>Two-Factor Authentication</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f9f9f9', borderRadius: 7, border: '1px solid #e4e4e7' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>Enable 2FA</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Add an extra layer of security to your account</div>
                </div>
                <button onClick={() => setTwoFA(!twoFA)}
                  style={{ width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', background: twoFA ? '#111' : '#e4e4e7', position: 'relative' }}
                  aria-label="Toggle 2FA">
                  <span style={{ position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', left: twoFA ? 21 : 3, transition: 'left 0.2s' }} />
                </button>
              </div>
            </div>

            <div style={{ padding: '14px 16px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 7 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>⚠ Danger Zone</div>
              <div style={{ fontSize: 12, color: '#92400e', marginTop: 4, marginBottom: 12 }}>These actions cannot be undone. Proceed with caution.</div>
              <button style={{ padding: '7px 14px', background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                Clear All Cache
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
