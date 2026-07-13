'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterLink {
  id: number;
  label: string;
  url: string;
  isVisible?: boolean;
}

interface FooterColumn {
  id: number;
  heading: string;
  isVisible?: boolean;
  links: FooterLink[];
}

export default function FooterPage() {
  const [columns, setColumns] = useState<FooterColumn[]>([]);
  const [copyright, setCopyright] = useState('© 2026 The Domain Name. All rights reserved.');
  const [description, setDescription] = useState('');
  const [logoText, setLogoText] = useState('The Domain Name');
  
  // Custom styling settings
  const [bgColor, setBgColor] = useState('#09090b');
  const [textColorPrimary, setTextColorPrimary] = useState('#ffffff');
  const [textColorSecondary, setTextColorSecondary] = useState('#a1a1aa');
  const [paddingY, setPaddingY] = useState('40px');
  const [borderTopColor, setBorderTopColor] = useState('#27272a');

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [newLink, setNewLink] = useState<Record<number, { label: string; url: string }>>({});

  // Reset/Revert options
  const [history, setHistory] = useState<any[]>([]);
  const [originalLayout, setOriginalLayout] = useState<any | null>(null);
  const [publishedBackup, setPublishedBackup] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load configuration from database
  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.footer) {
          const f = data.footer;
          const configObj = {
            logoText: f.logoText || 'The Domain Name',
            description: f.description || f.address || '',
            copyright: f.copyright || '© 2026 The Domain Name. All rights reserved.',
            bgColor: f.bgColor || '#09090b',
            textColorPrimary: f.textColorPrimary || '#ffffff',
            textColorSecondary: f.textColorSecondary || '#a1a1aa',
            paddingY: f.paddingY || '40px',
            borderTopColor: f.borderTopColor || '#27272a',
            columns: f.columns || []
          };
          setLogoText(configObj.logoText);
          setDescription(configObj.description);
          setCopyright(configObj.copyright);
          setBgColor(configObj.bgColor);
          setTextColorPrimary(configObj.textColorPrimary);
          setTextColorSecondary(configObj.textColorSecondary);
          setPaddingY(configObj.paddingY);
          setBorderTopColor(configObj.borderTopColor);
          setColumns(configObj.columns);
          setOriginalLayout(configObj);
        }
      }
    } catch (e) {
      console.error('Failed to load footer settings', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  const pushStateToHistory = () => {
    const currentState = {
      logoText,
      description,
      copyright,
      bgColor,
      textColorPrimary,
      textColorSecondary,
      paddingY,
      borderTopColor,
      columns: JSON.parse(JSON.stringify(columns))
    };
    setHistory((prev) => [...prev, currentState].slice(-10));
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setLogoText(previous.logoText);
    setDescription(previous.description);
    setCopyright(previous.copyright);
    setBgColor(previous.bgColor);
    setTextColorPrimary(previous.textColorPrimary);
    setTextColorSecondary(previous.textColorSecondary);
    setPaddingY(previous.paddingY);
    setBorderTopColor(previous.borderTopColor);
    setColumns(previous.columns);
    setHistory((prev) => prev.slice(0, -1));
  };

  function updateColumnHeading(colId: number, value: string) {
    pushStateToHistory();
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, heading: value } : c));
  }

  function toggleColumnVisibility(colId: number) {
    pushStateToHistory();
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, isVisible: !(c.isVisible !== false) } : c));
  }

  function addLink(colId: number) {
    const link = newLink[colId];
    if (!link?.label) return;
    pushStateToHistory();
    setColumns((prev) => prev.map((c) => c.id === colId
      ? { 
          ...c, 
          links: [...c.links, { id: Date.now(), label: link.label, url: link.url || '#', isVisible: true }] 
        }
      : c));
    setNewLink((prev) => ({ ...prev, [colId]: { label: '', url: '' } }));
  }

  function removeLink(colId: number, linkId: number) {
    pushStateToHistory();
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, links: c.links.filter((l) => l.id !== linkId) } : c));
  }

  function toggleLinkVisibility(colId: number, linkId: number) {
    pushStateToHistory();
    setColumns((prev) => prev.map((c) => c.id === colId 
      ? { 
          ...c, 
          links: c.links.map(l => l.id === linkId ? { ...l, isVisible: !(l.isVisible !== false) } : l) 
        } 
      : c
    ));
  }

  function updateLinkValue(colId: number, linkId: number, field: 'label' | 'url', value: string) {
    pushStateToHistory();
    setColumns((prev) => prev.map((c) => c.id === colId 
      ? { ...c, links: c.links.map(l => l.id === linkId ? { ...l, [field]: value } : l) } 
      : c
    ));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);
      
      const backupObj = JSON.parse(JSON.stringify(originalLayout));

      const payload = {
        footer: {
          logoText,
          description,
          copyright,
          bgColor,
          textColorPrimary,
          textColorSecondary,
          paddingY,
          borderTopColor,
          columns
        }
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaved(true);
        setPublishedBackup(backupObj);
        setOriginalLayout({ logoText, description, copyright, bgColor, textColorPrimary, textColorSecondary, paddingY, borderTopColor, columns });
        setHistory([]);
        setMessage('success');
        setTimeout(() => setSaved(false), 2500);

        // Audit Log
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'activity',
            action: 'FOOTER_UPDATE',
            details: { logoText, columnsCount: columns.length },
            user: 'Admin'
          })
        });
      } else {
        setMessage('failed');
      }
    } catch (err) {
      setMessage('failed');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  const resetDraft = () => {
    if (!originalLayout) return;
    setLogoText(originalLayout.logoText);
    setDescription(originalLayout.description);
    setCopyright(originalLayout.copyright);
    setBgColor(originalLayout.bgColor);
    setTextColorPrimary(originalLayout.textColorPrimary);
    setTextColorSecondary(originalLayout.textColorSecondary);
    setPaddingY(originalLayout.paddingY);
    setBorderTopColor(originalLayout.borderTopColor);
    setColumns(JSON.parse(JSON.stringify(originalLayout.columns)));
    setMessage('reset-draft');
    setTimeout(() => setMessage(null), 3000);
  };

  const revertToPreviousDesign = async () => {
    if (!publishedBackup) return;
    try {
      setLoading(true);
      setMessage(null);
      const payload = { footer: publishedBackup };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setOriginalLayout({ ...publishedBackup });
        setPublishedBackup(null);
        setLogoText(publishedBackup.logoText);
        setDescription(publishedBackup.description);
        setCopyright(publishedBackup.copyright);
        setBgColor(publishedBackup.bgColor);
        setTextColorPrimary(publishedBackup.textColorPrimary);
        setTextColorSecondary(publishedBackup.textColorSecondary);
        setPaddingY(publishedBackup.paddingY);
        setBorderTopColor(publishedBackup.borderTopColor);
        setColumns(publishedBackup.columns);
        setMessage('reverted-backup');
      } else {
        setMessage('failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('failed');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const revertToOriginal = async () => {
    if (!confirm('Are you sure you want to revert to original database settings?')) return;
    try {
      setLoading(true);
      const res = await fetch('/api/settings', { method: 'PATCH' });
      if (res.ok) {
        await fetchSettings();
        setMessage('factory-reset');
      } else {
        setMessage('failed');
      }
    } catch (e) {
      console.error(e);
      setMessage('failed');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const inputStyle: React.CSSProperties = { 
    border: '1px solid #cbd5e1', 
    borderRadius: 6, 
    padding: '6px 10px', 
    fontSize: 12, 
    color: '#1e293b', 
    outline: 'none', 
    background: '#fff', 
    boxSizing: 'border-box' 
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-2">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-500 font-sans">Syncing Footer Configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] animate-[admin-fade-in_0.4s_ease_both] pb-16 font-sans">
           {/* CSS to hide scrollbar cross-browser */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 m-0">Footer Layout Manager</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Customize the brand column, links, visibility switches, headings, and color parameters of the public footer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={undo}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-1 select-none"
            >
              ↩ Undo
            </button>
          )}
          <button
            onClick={resetDraft}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition select-none"
            title="Discard current unsaved changes and reset back to last saved state"
          >
            🔄 Reset Draft
          </button>
          <button
            onClick={revertToPreviousDesign}
            disabled={!publishedBackup || saving}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-50 disabled:text-amber-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl cursor-pointer border border-amber-500 disabled:border-slate-200 transition flex items-center gap-1 select-none shadow-sm"
            title="Rollback the database layout to the design active before the last save action"
          >
            ↩️ Reset to Previous
          </button>
          <button
            onClick={revertToOriginal}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 text-xs font-bold rounded-xl cursor-pointer transition select-none"
            title="Revert back to the factory seeded layout settings"
          >
            ⚙️ Reset to Original
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl cursor-pointer transition shadow-[0_4px_12px_rgba(99,102,241,0.25)] flex items-center gap-1.5 select-none"
          >
            {saving ? '⏳ Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Action Messages Banners */}
      {message === 'success' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-205 text-emerald-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>✓</span> Footer layout settings updated successfully! Changes are live on the public site.
        </div>
      )}
      {message === 'failed' && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>⚠️</span> Failed to save footer configurations. Please try again.
        </div>
      )}
      {message === 'reset-draft' && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-250 text-amber-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>🔄</span> Proposed draft layout reset to published database settings!
        </div>
      )}
      {message === 'factory-reset' && (
        <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-850 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>⚙️</span> Draft restored to factory default layout templates!
        </div>
      )}
      {message === 'reverted-backup' && (
        <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-850 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>↩️</span> Database successfully reverted to the previous layout design!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: General Brand & Color Customizations (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Logo & Brand Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Brand Column Details</span>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 block">Footer Title/Logo Text</label>
              <input 
                value={logoText} 
                onChange={(e) => { pushStateToHistory(); setLogoText(e.target.value); }} 
                style={{ ...inputStyle, width: '100%' }} 
                placeholder="e.g. The Domain Name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 block">Footer Description Text</label>
              <textarea 
                value={description} 
                onChange={(e) => { pushStateToHistory(); setDescription(e.target.value); }} 
                style={{ ...inputStyle, width: '100%', minHeight: 90, resize: 'vertical' }} 
                placeholder="Brief information about the publication"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 block">Bottom Copyright Text</label>
              <input 
                value={copyright} 
                onChange={(e) => { pushStateToHistory(); setCopyright(e.target.value); }} 
                style={{ ...inputStyle, width: '100%' }} 
                placeholder="e.g. © 2026 The Domain Name. All rights reserved."
              />
            </div>
          </div>

          {/* Color Themes & Spacing */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Theme & Color Options</span>
            
            <div className="space-y-3.5">
              {/* Bg Color */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">Background Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => { pushStateToHistory(); setBgColor(e.target.value); }} 
                    className="w-8 h-8 border border-slate-200 p-0.5 cursor-pointer rounded bg-transparent" 
                  />
                  <input 
                    type="text" 
                    value={bgColor} 
                    onChange={(e) => { pushStateToHistory(); setBgColor(e.target.value); }} 
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace' }} 
                  />
                </div>
              </div>

              {/* Color Picker 2: Primary Text (Logo, Links) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">Primary Color (Logo, Links Text)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={textColorPrimary} 
                    onChange={(e) => { pushStateToHistory(); setTextColorPrimary(e.target.value); }} 
                    className="w-8 h-8 border border-slate-200 p-0.5 cursor-pointer rounded bg-transparent" 
                  />
                  <input 
                    type="text" 
                    value={textColorPrimary} 
                    onChange={(e) => { pushStateToHistory(); setTextColorPrimary(e.target.value); }} 
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace' }} 
                  />
                </div>
              </div>

              {/* Color Picker 1: Secondary Text (Description, Subtitles, Copyright) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">Secondary Color (Description, Subtitles, Copyright)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={textColorSecondary} 
                    onChange={(e) => { pushStateToHistory(); setTextColorSecondary(e.target.value); }} 
                    className="w-8 h-8 border border-slate-200 p-0.5 cursor-pointer rounded bg-transparent" 
                  />
                  <input 
                    type="text" 
                    value={textColorSecondary} 
                    onChange={(e) => { pushStateToHistory(); setTextColorSecondary(e.target.value); }} 
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace' }} 
                  />
                </div>
              </div>

              {/* Border Top Color */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">Border Top Divider Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={borderTopColor} 
                    onChange={(e) => { pushStateToHistory(); setBorderTopColor(e.target.value); }} 
                    className="w-8 h-8 border border-slate-200 p-0.5 cursor-pointer rounded bg-transparent" 
                  />
                  <input 
                    type="text" 
                    value={borderTopColor} 
                    onChange={(e) => { pushStateToHistory(); setBorderTopColor(e.target.value); }} 
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace' }} 
                  />
                </div>
              </div>

              {/* Vertical spacing */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">Vertical Padding</label>
                <select 
                  value={paddingY} 
                  onChange={(e) => { pushStateToHistory(); setPaddingY(e.target.value); }} 
                  className="w-full border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700 bg-white"
                >
                  <option value="20px">20px (Compact)</option>
                  <option value="40px">40px (Default)</option>
                  <option value="60px">60px (Spacious)</option>
                  <option value="80px">80px (Very Wide)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Columns & Links Management (Span 8) — sticky, scrollable, hidden scrollbar */}
        <div 
          className="lg:col-span-8 lg:sticky lg:top-4 lg:self-start overflow-y-auto no-scrollbar space-y-6"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Footer Link Columns</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {columns.map((col, idx) => (
                <div key={col.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30 flex flex-col justify-between">
                  
                  {/* Column Header */}
                  <div className="bg-slate-100/80 p-3.5 border-b border-slate-200 flex justify-between items-center gap-2">
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Column {idx + 1} {idx % 2 === 1 ? '(Right stack)' : ''}</span>
                      <input
                        value={col.heading}
                        onChange={(e) => updateColumnHeading(col.id, e.target.value)}
                        style={{ ...inputStyle, width: '100%', fontWeight: 700, padding: '4px 8px' }}
                        placeholder="Subtitle (e.g. Categories)"
                      />
                    </div>
                    <button 
                      onClick={() => toggleColumnVisibility(col.id)}
                      className={`px-2 py-1.5 text-[9px] font-bold rounded cursor-pointer transition select-none ${
                        col.isVisible !== false ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-150 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {col.isVisible !== false ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  {/* Links Content */}
                  <div className="p-3.5 space-y-2.5 flex-1 bg-white">
                    {col.links.map((link) => (
                      <div 
                        key={link.id} 
                        className={`flex flex-col gap-2 p-2 rounded-lg border transition ${
                          link.isVisible !== false 
                            ? 'bg-white border-slate-200 shadow-2xs' 
                            : 'bg-slate-50 border-slate-200 opacity-70'
                        }`}
                      >
                        {/* Text inputs on a single row */}
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Text Label</span>
                            <input 
                              value={link.label} 
                              onChange={(e) => updateLinkValue(col.id, link.id, 'label', e.target.value)} 
                              style={{ ...inputStyle, width: '100%', padding: '4px 8px', fontSize: 11 }} 
                              placeholder="Link Text" 
                            />
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Path / URL</span>
                            <input 
                              value={link.url} 
                              onChange={(e) => updateLinkValue(col.id, link.id, 'url', e.target.value)} 
                              style={{ ...inputStyle, width: '100%', padding: '4px 8px', fontSize: 11 }} 
                              placeholder="URL path" 
                            />
                          </div>
                        </div>
                        
                        {/* Action buttons row */}
                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-100 mt-0.5">
                          <button
                            type="button"
                            onClick={() => toggleLinkVisibility(col.id, link.id)}
                            className={`px-2 py-1 text-[9px] font-extrabold rounded-md cursor-pointer transition select-none flex items-center gap-1 ${
                              link.isVisible !== false 
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            }`}
                          >
                            <span>{link.isVisible !== false ? '👁️ Shown' : '🙈 Hidden'}</span>
                          </button>
                          
                          <button 
                            type="button"
                            onClick={() => removeLink(col.id, link.id)} 
                            className="px-2 py-1 text-[9px] font-extrabold text-rose-600 hover:text-white hover:bg-rose-600 rounded-md transition cursor-pointer select-none flex items-center gap-1 border border-rose-200 hover:border-rose-600"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add New Link */}
                    <div className="flex gap-1.5 pt-3 mt-3 border-t border-dashed border-slate-200">
                      <input
                        placeholder="New Link Text"
                        value={newLink[col.id]?.label || ''}
                        onChange={(e) => setNewLink((prev) => ({ ...prev, [col.id]: { ...prev[col.id], label: e.target.value } }))}
                        style={{ ...inputStyle, flex: 1, padding: '5px 8px' }}
                      />
                      <input
                        placeholder="Path (e.g. /about)"
                        value={newLink[col.id]?.url || ''}
                        onChange={(e) => setNewLink((prev) => ({ ...prev, [col.id]: { ...prev[col.id], url: e.target.value } }))}
                        style={{ ...inputStyle, flex: 1.2, padding: '5px 8px' }}
                      />
                      <button 
                        onClick={() => addLink(col.id)} 
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded cursor-pointer transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Live Preview Box */}
      <div className="mt-8 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Live Dynamic Footer Preview</span>
          <span className="text-[10px] text-slate-400 font-mono">Binded to form settings in real-time</span>
        </div>
        
        {/* Replicated Footer Preview */}
        <div 
          style={{ backgroundColor: bgColor, color: textColorPrimary, paddingBottom: paddingY, paddingTop: paddingY }}
          className="px-6 sm:px-8 w-full select-none text-[13px] font-sans transition-all duration-300"
        >
          <div 
            style={{ borderTop: `1px solid ${borderTopColor}`, paddingTop: paddingY }}
            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-10"
          >
            
            {/* Brand column */}
            <div className="lg:col-span-3 space-y-3.5 text-left">
              <h4 style={{ color: textColorPrimary }} className="font-serif text-[17px] font-bold tracking-tight">
                {logoText}
              </h4>
              <p style={{ color: textColorSecondary }} className="text-[12px] leading-relaxed font-normal max-w-[240px]">
                {description || 'Brand description text...'}
              </p>
            </div>

            {/* Dynamic columns */}
            {columns.map((col, idx) => {
              if (col.isVisible === false) return null;
              const spanClass = idx === 3 ? "lg:col-span-3" : "lg:col-span-2";
              const headingText = col.heading || "";
              
              return (
                <div key={col.id} className={`${spanClass} text-left`}>
                  {headingText ? (
                    <h5 
                      style={{ color: textColorSecondary }}
                      className="text-[10px] font-extrabold uppercase tracking-widest mb-4 font-sans"
                    >
                      {headingText}
                    </h5>
                  ) : (
                    <h5 className="text-[10px] uppercase text-transparent mb-4 font-sans select-none hidden lg:block">
                      &nbsp;
                    </h5>
                  )}
                  <div className="space-y-3 flex flex-col text-[13px] font-medium">
                    {col.links.map((link) => {
                      if (link.isVisible === false) return null;
                      return (
                        <span 
                          key={link.id} 
                          style={{ color: textColorPrimary }}
                          className="hover:opacity-80 transition-opacity duration-150 cursor-pointer"
                        >
                          {link.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Bottom Bar */}
          <div 
            style={{ borderTop: `1px solid ${borderTopColor}`, paddingTop: '20px' }}
            className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-left"
          >
            <div style={{ color: textColorSecondary }} className="w-full text-center sm:text-left">
              {copyright}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
