'use client';

import React, { useState, useEffect } from 'react';
import { useAdminModal } from '../../components/AdminModalContext';

interface ListItem {
  title: string;
  description: string;
}

interface PrivacySection {
  heading: string;
  intro?: string;
  listItems?: ListItem[];
  body?: string;
}

export default function PrivacyManagerPage() {
  const { showAlert, showConfirm } = useAdminModal();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [leadParagraph, setLeadParagraph] = useState('');
  const [sections, setSections] = useState<PrivacySection[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.privacyPolicy) {
          const p = data.privacyPolicy;
          setTitle(p.title || '');
          setSubtitle(p.subtitle || '');
          setLeadParagraph(p.leadParagraph || '');
          setSections(p.sections || []);
        }
      }
    } catch (e) {
      console.error('Failed to load privacy settings', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetOriginal() {
    showConfirm('Are you sure you want to reset all fields to original defaults? This will not be saved until you click Save Changes.', async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/settings/defaults?key=privacyPolicy');
        if (res.ok) {
          const data = await res.json();
          if (data.privacyPolicy) {
            const p = data.privacyPolicy;
            setTitle(p.title || '');
            setSubtitle(p.subtitle || '');
            setLeadParagraph(p.leadParagraph || '');
            setSections(p.sections || []);
          }
          showAlert('Reset to original successfully.', 'info', 'Reset');
        }
      } catch (e) {
        showAlert('Failed to reset to original', 'error', 'Error');
      } finally {
        setLoading(false);
      }
    }, 'Reset to Original');
  }

  async function handleGetPrevious() {
    showConfirm('Are you sure you want to revert all changes to the last saved version?', async () => {
      await fetchSettings();
      showAlert('Reverted to last saved version.', 'info', 'Reverted');
    }, 'Revert Changes');
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  function handleAddSection() {
    setSections([...sections, { heading: 'New Section Heading', intro: '', listItems: [], body: 'New section content body paragraph text...' }]);
  }

  function handleRemoveSection(index: number) {
    setSections(sections.filter((_, i) => i !== index));
  }

  function handleSectionChange(index: number, field: keyof PrivacySection, value: any) {
    setSections(prev => prev.map((sec, i) => i === index ? { ...sec, [field]: value } : sec));
  }

  function handleAddListItem(secIdx: number) {
    setSections(prev => prev.map((sec, i) => {
      if (i === secIdx) {
        const currentList = sec.listItems || [];
        return {
          ...sec,
          listItems: [...currentList, { title: 'Bold Bullet Label', description: 'Bullet list description...' }]
        };
      }
      return sec;
    }));
  }

  function handleRemoveListItem(secIdx: number, itemIdx: number) {
    setSections(prev => prev.map((sec, i) => {
      if (i === secIdx) {
        const currentList = sec.listItems || [];
        return {
          ...sec,
          listItems: currentList.filter((_, idx) => idx !== itemIdx)
        };
      }
      return sec;
    }));
  }

  function handleListItemChange(secIdx: number, itemIdx: number, field: keyof ListItem, val: string) {
    setSections(prev => prev.map((sec, i) => {
      if (i === secIdx) {
        const currentList = sec.listItems || [];
        const updatedList = currentList.map((item, idx) => idx === itemIdx ? { ...item, [field]: val } : item);
        return {
          ...sec,
          listItems: updatedList
        };
      }
      return sec;
    }));
  }

  async function handleSave() {
    try {
      const payload = {
        privacyPolicy: {
          title,
          subtitle,
          leadParagraph,
          sections
        }
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaved(true);
        showAlert('Privacy Policy updated successfully!', 'success', 'Saved');
        setTimeout(() => setSaved(false), 2500);

        // Audit Log
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'activity',
            action: 'PRIVACY_POLICY_UPDATE',
            details: { title },
            user: 'Admin'
          })
        });
      } else {
        showAlert('Failed to save Privacy Policy settings', 'error', 'Error');
      }
    } catch (err) {
      showAlert('Failed to save Privacy Policy settings', 'error', 'Error');
    }
  }

  const inputStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 6, padding: '7px 11px', fontSize: 12, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        {/* <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div> */}
        {/* <span className="text-xs font-semibold text-slate-500 font-sans">Syncing Privacy Policy configuration...</span> */}
      </div>
    );
  }

  return (
    <div className="max-w-[1150px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-sans font-extrabold text-[#111] m-0">Privacy Policy Manager</h1>
          <p className="text-[12.5px] text-slate-500 mt-1 font-medium">Manage and change the core privacy terms and legal clauses dynamically.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleResetOriginal}
            className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
          >
            Reset to Original
          </button>
          <button onClick={handleGetPrevious}
            className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
          >
            Get Previous Saved
          </button>
          <button onClick={handleSave}
            className="px-4 py-2 bg-[#111] hover:bg-[#222] text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-[0_2px_4px_rgba(0,0,0,0.06)] flex items-center gap-1.5"
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Block */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Header Details</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Page Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Subtitle / Date String</label>
                <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Lead Paragraph Text (use **Text** for bold highlight)</label>
              <textarea 
                rows={3}
                value={leadParagraph} 
                onChange={(e) => setLeadParagraph(e.target.value)} 
                style={{ ...inputStyle, width: '100%', fontFamily: 'sans-serif', lineHeight: 1.5 }} 
              />
            </div>
          </div>

          {/* Privacy Clauses / Sections */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Clauses / Custom Sections</span>
              <button onClick={handleAddSection} className="px-2.5 py-1 text-[10.5px] font-bold rounded bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition">
                + Add Clause Section
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 font-sans border border-dashed border-slate-200 rounded-lg">
                No privacy clauses added yet. Click "+ Add Clause Section".
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {sections.map((sec, secIdx) => (
                  <div key={secIdx} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-4 relative">
                    <button onClick={() => handleRemoveSection(secIdx)} className="absolute top-3 right-3 text-red-500 hover:text-red-750 font-bold text-xs bg-transparent border-none cursor-pointer">
                      ✕ Delete Section
                    </button>

                    {/* Heading */}
                    <div className="space-y-1.5 max-w-[80%]">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Clause Section Heading</label>
                      <input value={sec.heading} onChange={(e) => handleSectionChange(secIdx, 'heading', e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
                    </div>

                    {/* Optional Intro */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Intro Paragraph Content (Optional)</label>
                      <textarea rows={2} value={sec.intro || ''} onChange={(e) => handleSectionChange(secIdx, 'intro', e.target.value)} style={{ ...inputStyle, width: '100%', lineHeight: 1.4 }} />
                    </div>

                    {/* Bullet Items */}
                    <div className="space-y-2 border-t border-slate-150 pt-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">List Bullet Items (Optional)</label>
                        <button onClick={() => handleAddListItem(secIdx)} className="px-2 py-0.5 text-[9.5px] font-bold rounded bg-slate-800 text-white cursor-pointer hover:bg-slate-700 transition">
                          + Add Bullet
                        </button>
                      </div>

                      {sec.listItems && sec.listItems.length > 0 && (
                        <div className="space-y-3 pt-1">
                          {sec.listItems.map((item, itemIdx) => (
                            <div key={itemIdx} className="border border-slate-200/80 rounded bg-white p-2.5 space-y-2 relative">
                              <button onClick={() => handleRemoveListItem(secIdx, itemIdx)} className="absolute top-1.5 right-2 text-red-500 hover:text-red-700 text-[10px] bg-transparent border-none cursor-pointer">
                                ✕ Delete Bullet
                              </button>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[8.5px] font-bold text-slate-400 uppercase block">Bullet Bold Prefix</label>
                                  <input value={item.title} onChange={(e) => handleListItemChange(secIdx, itemIdx, 'title', e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
                                </div>
                                <div className="col-span-2 space-y-1">
                                  <label className="text-[8.5px] font-bold text-slate-400 uppercase block">Bullet Description</label>
                                  <textarea rows={1} value={item.description} onChange={(e) => handleListItemChange(secIdx, itemIdx, 'description', e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Clause Body */}
                    <div className="space-y-1.5 border-t border-slate-150 pt-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Main Clause Body / Paragraph content</label>
                      <textarea rows={3} value={sec.body || ''} onChange={(e) => handleSectionChange(secIdx, 'body', e.target.value)} style={{ ...inputStyle, width: '100%', lineHeight: 1.4, fontFamily: 'sans-serif' }} />
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] sticky top-6 space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Live Layout Preview</span>
            <div className="border border-slate-150 rounded-lg p-4 bg-white font-sans max-h-[600px] overflow-y-auto space-y-4 select-none">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">{title || 'Privacy Policy'}</h2>
                <p className="text-[9.5px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{subtitle || 'Last Updated: July 13, 2026'}</p>
              </div>

              <p className="text-[11.5px] font-medium font-serif leading-relaxed text-slate-800 italic">
                {leadParagraph.replace(/\*\*/g, '') || 'Lead paragraph text details...'}
              </p>

              {sections.map((sec, idx) => (
                <div key={idx} className="space-y-2 mt-4">
                  <h3 className="text-xs font-bold text-slate-900">{sec.heading}</h3>
                  {sec.intro && <p className="text-[11px] text-slate-500 leading-relaxed m-0">{sec.intro}</p>}
                  
                  {sec.listItems && sec.listItems.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                      {sec.listItems.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <strong className="font-bold text-slate-900">{item.title}: </strong>{item.description}
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.body && <p className="text-[11px] text-slate-500 leading-relaxed m-0">{sec.body}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
