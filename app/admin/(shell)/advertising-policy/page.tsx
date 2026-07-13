'use client';

import { useState, useEffect } from 'react';

interface PolicySection {
  heading: string;
  content: string;
  listItems?: string[];
}

export default function AdvertisingPolicyManagerPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [leadParagraph, setLeadParagraph] = useState('');
  const [sections, setSections] = useState<PolicySection[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.advertisingPolicy) {
          const a = data.advertisingPolicy;
          setTitle(a.title || '');
          setSubtitle(a.subtitle || '');
          setLeadParagraph(a.leadParagraph || '');
          setSections(a.sections || []);
        }
      }
    } catch (e) {
      console.error('Failed to load advertising policy settings', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetOriginal() {
    if (!confirm('Are you sure you want to reset all fields to original defaults? This will not be saved until you click Save Changes.')) return;
    try {
      setLoading(true);
      const res = await fetch('/api/settings/defaults?key=advertisingPolicy');
      if (res.ok) {
        const data = await res.json();
        if (data.advertisingPolicy) {
          const a = data.advertisingPolicy;
          setTitle(a.title || '');
          setSubtitle(a.subtitle || '');
          setLeadParagraph(a.leadParagraph || '');
          setSections(a.sections || []);
        }
      }
    } catch (e) {
      console.error('Failed to reset to original', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetPrevious() {
    if (!confirm('Are you sure you want to revert all changes to the last saved version?')) return;
    await fetchSettings();
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  function handleAddSection() {
    setSections([...sections, { heading: 'New Section Heading', content: 'New section content paragraphs...', listItems: [] }]);
  }

  function handleRemoveSection(index: number) {
    setSections(sections.filter((_, i) => i !== index));
  }

  function handleSectionChange(index: number, field: keyof PolicySection, value: any) {
    setSections(prev => prev.map((sec, i) => i === index ? { ...sec, [field]: value } : sec));
  }

  function handleAddListItem(secIdx: number) {
    setSections(prev => prev.map((sec, i) => {
      if (i === secIdx) {
        const currentList = sec.listItems || [];
        return {
          ...sec,
          listItems: [...currentList, 'New list item content...']
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

  function handleListItemChange(secIdx: number, itemIdx: number, val: string) {
    setSections(prev => prev.map((sec, i) => {
      if (i === secIdx) {
        const currentList = sec.listItems || [];
        const updatedList = currentList.map((item, idx) => idx === itemIdx ? val : item);
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
        advertisingPolicy: {
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
        setTimeout(() => setSaved(false), 2500);

        // Audit Log
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'activity',
            action: 'ADVERTISING_POLICY_UPDATE',
            details: { title },
            user: 'Admin'
          })
        });
      }
    } catch (err) {
      alert('Failed to save Advertising Policy settings');
    }
  }

  const inputStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 6, padding: '7px 11px', fontSize: 12, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-500 font-sans">Syncing Advertising Policy configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1150px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-sans font-extrabold text-[#111] m-0">Advertising Policy Manager</h1>
          <p className="text-[12.5px] text-slate-500 mt-1 font-medium">Manage editorial independence terms, sponsored content guidelines, and contact details.</p>
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

          {/* Policy Sections */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Policy Guidelines & Rules</span>
              <button onClick={handleAddSection} className="px-2.5 py-1 text-[10.5px] font-bold rounded bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition">
                + Add Guidelines Section
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 font-sans border border-dashed border-slate-200 rounded-lg">
                No policy sections added yet. Click "+ Add Guidelines Section".
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
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Section Heading</label>
                      <input value={sec.heading} onChange={(e) => handleSectionChange(secIdx, 'heading', e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Section Content Text</label>
                      <textarea rows={4} value={sec.content} onChange={(e) => handleSectionChange(secIdx, 'content', e.target.value)} style={{ ...inputStyle, width: '100%', lineHeight: 1.4, fontFamily: 'sans-serif' }} />
                    </div>

                    {/* Bullet List Items */}
                    <div className="space-y-2 border-t border-slate-150 pt-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">List Bullet Items (Optional)</label>
                        <button onClick={() => handleAddListItem(secIdx)} className="px-2 py-0.5 text-[9.5px] font-bold rounded bg-slate-800 text-white cursor-pointer hover:bg-slate-700 transition">
                          + Add Bullet
                        </button>
                      </div>

                      {sec.listItems && sec.listItems.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {sec.listItems.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex gap-2 items-center">
                              <input value={item} onChange={(e) => handleListItemChange(secIdx, itemIdx, e.target.value)} style={{ ...inputStyle, flexGrow: 1 }} />
                              <button onClick={() => handleRemoveListItem(secIdx, itemIdx)} className="text-red-500 hover:text-red-750 font-bold text-xs cursor-pointer border-none bg-transparent">
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
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
                <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">{title || 'Advertising & Sponsored Policy'}</h2>
                <p className="text-[9.5px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{subtitle || 'Separation of editorial and commercial activities'}</p>
              </div>

              <p className="text-[11.5px] font-medium font-serif leading-relaxed text-slate-800 italic">
                {leadParagraph.replace(/\*\*/g, '') || 'Lead paragraph text details...'}
              </p>

              {sections.map((sec, idx) => (
                <div key={idx} className="space-y-2 mt-4">
                  <h3 className="text-xs font-bold text-slate-900">{sec.heading}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed whitespace-pre-line m-0">{sec.content.replace(/\*\*/g, '')}</p>
                  
                  {sec.listItems && sec.listItems.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                      {sec.listItems.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
