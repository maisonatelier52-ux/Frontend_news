'use client';

import { useState, useEffect } from 'react';

interface ValueItem {
  title: string;
  description: string;
}

export default function AboutUsPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [leadParagraph, setLeadParagraph] = useState('');
  
  const [missionHeading, setMissionHeading] = useState('');
  const [missionContent, setMissionContent] = useState('');

  const [ownershipHeading, setOwnershipHeading] = useState('');
  const [ownershipContent, setOwnershipContent] = useState('');

  const [valuesHeading, setValuesHeading] = useState('');
  const [valuesItems, setValuesItems] = useState<ValueItem[]>([]);

  const [historyHeading, setHistoryHeading] = useState('');
  const [historyContent, setHistoryContent] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.aboutUs) {
          const a = data.aboutUs;
          setTitle(a.title || '');
          setSubtitle(a.subtitle || '');
          setLeadParagraph(a.leadParagraph || '');
          
          setMissionHeading(a.missionHeading || '');
          setMissionContent(a.missionContent || '');
          
          setOwnershipHeading(a.ownershipHeading || '');
          setOwnershipContent(a.ownershipContent || '');
          
          setValuesHeading(a.valuesHeading || '');
          setValuesItems(a.valuesItems || []);
          
          setHistoryHeading(a.historyHeading || '');
          setHistoryContent(a.historyContent || '');
        }
      }
    } catch (e) {
      console.error('Failed to load about us settings', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetOriginal() {
    if (!confirm('Are you sure you want to reset all fields to original defaults? This will not be saved until you click Save Changes.')) return;
    try {
      setLoading(true);
      const res = await fetch('/api/settings/defaults?key=aboutUs');
      if (res.ok) {
        const data = await res.json();
        if (data.aboutUs) {
          const a = data.aboutUs;
          setTitle(a.title || '');
          setSubtitle(a.subtitle || '');
          setLeadParagraph(a.leadParagraph || '');
          setMissionHeading(a.missionHeading || '');
          setMissionContent(a.missionContent || '');
          setOwnershipHeading(a.ownershipHeading || '');
          setOwnershipContent(a.ownershipContent || '');
          setValuesHeading(a.valuesHeading || '');
          setValuesItems(a.valuesItems || []);
          setHistoryHeading(a.historyHeading || '');
          setHistoryContent(a.historyContent || '');
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

  function handleAddValue() {
    setValuesItems([...valuesItems, { title: 'New Value Key', description: 'Description text...' }]);
  }

  function handleRemoveValue(index: number) {
    setValuesItems(valuesItems.filter((_, i) => i !== index));
  }

  function handleValueChange(index: number, field: 'title' | 'description', value: string) {
    setValuesItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  async function handleSave() {
    try {
      const payload = {
        aboutUs: {
          title,
          subtitle,
          leadParagraph,
          missionHeading,
          missionContent,
          ownershipHeading,
          ownershipContent,
          valuesHeading,
          valuesItems,
          historyHeading,
          historyContent
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
            action: 'ABOUT_US_UPDATE',
            details: { title },
            user: 'Admin'
          })
        });
      }
    } catch (err) {
      alert('Failed to save About Us page settings');
    }
  }

  const inputStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 6, padding: '7px 11px', fontSize: 12, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-500 font-sans">Syncing About Us configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1150px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-sans font-extrabold text-[#111] m-0">About Us Content Manager</h1>
          <p className="text-[12.5px] text-slate-500 mt-1 font-medium">Manage and change the core content sections of the About Us page while preserving its original design structure.</p>
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
          
          {/* Core Page Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Header Section</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Page Header Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Page Subtitle</label>
                <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Lead Introductory Paragraph (use **Text** for bold highlight)</label>
              <textarea 
                rows={3}
                value={leadParagraph} 
                onChange={(e) => setLeadParagraph(e.target.value)} 
                style={{ ...inputStyle, width: '100%', fontFamily: 'sans-serif', lineHeight: 1.5 }} 
              />
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Our Mission Section</span>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Section Title</label>
                <input value={missionHeading} onChange={(e) => setMissionHeading(e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Section Content Text</label>
                <textarea 
                  rows={4}
                  value={missionContent} 
                  onChange={(e) => setMissionContent(e.target.value)} 
                  style={{ ...inputStyle, width: '100%', fontFamily: 'sans-serif', lineHeight: 1.5 }} 
                />
              </div>
            </div>
          </div>

          {/* Ownership Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Independent Ownership Section</span>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Section Title</label>
                <input value={ownershipHeading} onChange={(e) => setOwnershipHeading(e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Section Content Text</label>
                <textarea 
                  rows={4}
                  value={ownershipContent} 
                  onChange={(e) => setOwnershipContent(e.target.value)} 
                  style={{ ...inputStyle, width: '100%', fontFamily: 'sans-serif', lineHeight: 1.5 }} 
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Our Values Section (Unordered List Design)</span>
              <button onClick={handleAddValue} className="px-2.5 py-1 text-[10.5px] font-bold rounded bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition">
                + Add Value Item
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Section Title</label>
                <input value={valuesHeading} onChange={(e) => setValuesHeading(e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
              </div>

              {valuesItems.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-6 font-sans border border-dashed border-slate-200 rounded-lg">
                  No value items added yet. Click "+ Add Value Item" to start composting.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {valuesItems.map((val, idx) => (
                    <div key={idx} className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-2 relative">
                      <button onClick={() => handleRemoveValue(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-750 font-semibold text-[10.5px] bg-transparent border-none cursor-pointer">
                        ✕ Delete
                      </button>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1 space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Bold Key / Prefix</label>
                          <input value={val.title} onChange={(e) => handleValueChange(idx, 'title', e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Description Content</label>
                          <textarea rows={2} value={val.description} onChange={(e) => handleValueChange(idx, 'description', e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Our History Section</span>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Section Title</label>
                <input value={historyHeading} onChange={(e) => setHistoryHeading(e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Section Content Text</label>
                <textarea 
                  rows={4}
                  value={historyContent} 
                  onChange={(e) => setHistoryContent(e.target.value)} 
                  style={{ ...inputStyle, width: '100%', fontFamily: 'sans-serif', lineHeight: 1.5 }} 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] sticky top-6 space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Live Layout Preview</span>
            <div className="border border-slate-150 rounded-lg p-4 bg-white font-sans max-h-[600px] overflow-y-auto space-y-4 select-none">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">{title || 'About Us'}</h2>
                <p className="text-[9.5px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{subtitle || 'Sub-title text'}</p>
              </div>
              
              <p className="text-[11.5px] font-medium font-serif leading-relaxed text-slate-800 italic">
                {leadParagraph.replace(/\*\*/g, '') || 'Lead paragraph introduction text details...'}
              </p>

              {missionHeading && (
                <div className="space-y-1 mt-3">
                  <h3 className="text-xs font-bold text-slate-900">{missionHeading}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500">{missionContent}</p>
                </div>
              )}

              {ownershipHeading && (
                <div className="space-y-1 mt-3">
                  <h3 className="text-xs font-bold text-slate-900">{ownershipHeading}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500">{ownershipContent}</p>
                </div>
              )}

              {valuesHeading && (
                <div className="space-y-1 mt-3">
                  <h3 className="text-xs font-bold text-slate-900">{valuesHeading}</h3>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                    {valuesItems.map((val, idx) => (
                      <li key={idx}>
                        <strong className="font-bold text-slate-900">{val.title}: </strong>{val.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {historyHeading && (
                <div className="space-y-1 mt-3">
                  <h3 className="text-xs font-bold text-slate-900">{historyHeading}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500">{historyContent}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
