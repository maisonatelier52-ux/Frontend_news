'use client';

import React, { useState, useEffect } from 'react';
import AdminLoader from '../../components/AdminLoader';
import { useAdminModal } from '../../components/AdminModalContext';

interface KeyPoint {
  title: string;
  description: string;
}

export default function AdvertisingPolicyPage() {
  const { showAlert, showConfirm } = useAdminModal();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [leadParagraph, setLeadParagraph] = useState('');
  
  const [introHeading, setIntroHeading] = useState('');
  const [introContent, setIntroContent] = useState('');

  const [guidelinesHeading, setGuidelinesHeading] = useState('');
  const [guidelinesItems, setGuidelinesItems] = useState<KeyPoint[]>([]);

  const [transparencyHeading, setTransparencyHeading] = useState('');
  const [transparencyContent, setTransparencyContent] = useState('');
  
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
          setIntroHeading(a.introHeading || '');
          setIntroContent(a.introContent || '');
          setGuidelinesHeading(a.guidelinesHeading || '');
          setGuidelinesItems(a.guidelinesItems || []);
          setTransparencyHeading(a.transparencyHeading || '');
          setTransparencyContent(a.transparencyContent || '');
        }
      }
    } catch (e) {
      console.error('Failed to load Advertising Policy settings', e);
    } finally {
      setLoading(false);
    }
  }

  function handleResetOriginal() {
    showConfirm(
      'Are you sure you want to reset all fields to original defaults? This will not be saved until you click Save Changes.',
      async () => {
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
              setIntroHeading(a.introHeading || '');
              setIntroContent(a.introContent || '');
              setGuidelinesHeading(a.guidelinesHeading || '');
              setGuidelinesItems(a.guidelinesItems || []);
              setTransparencyHeading(a.transparencyHeading || '');
              setTransparencyContent(a.transparencyContent || '');
            }
            showAlert('Fields reset to original defaults.', 'info', 'Reset');
          }
        } catch (e) {
          showAlert('Failed to reset to original', 'error', 'Error');
        } finally {
          setLoading(false);
        }
      },
      'Reset to Original'
    );
  }

  function handleGetPrevious() {
    showConfirm(
      'Are you sure you want to revert all changes to the last saved version?',
      async () => {
        await fetchSettings();
        showAlert('Reverted to last saved version.', 'info', 'Reverted');
      },
      'Revert Changes'
    );
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  function handleAddItem() {
    setGuidelinesItems([...guidelinesItems, { title: 'New Rule', description: 'Rule description...' }]);
  }

  function handleRemoveItem(index: number) {
    setGuidelinesItems(guidelinesItems.filter((_, i) => i !== index));
  }

  function handleItemChange(index: number, field: 'title' | 'description', value: string) {
    setGuidelinesItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  async function handleSave() {
    try {
      const payload = {
        advertisingPolicy: {
          title,
          subtitle,
          leadParagraph,
          introHeading,
          introContent,
          guidelinesHeading,
          guidelinesItems,
          transparencyHeading,
          transparencyContent
        }
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaved(true);
        showAlert('Advertising Policy updated successfully!', 'success', 'Saved');
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
      } else {
        showAlert('Failed to save Advertising Policy settings', 'error', 'Error');
      }
    } catch (err) {
      showAlert('Failed to save Advertising Policy settings', 'error', 'Error');
    }
  }

  const inputStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 6, padding: '7px 11px', fontSize: 12, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }

  if (loading) {
    return <AdminLoader />;
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

          {/* Intro Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Introduction Section</span>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Intro Heading</label>
                <input value={introHeading} onChange={(e) => setIntroHeading(e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Intro Content</label>
                <textarea rows={4} value={introContent} onChange={(e) => setIntroContent(e.target.value)} style={{ ...inputStyle, width: '100%', lineHeight: 1.4, fontFamily: 'sans-serif' }} />
              </div>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Guidelines & Rules</span>
              <button onClick={handleAddItem} className="px-2.5 py-1 text-[10.5px] font-bold rounded bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition">
                + Add Rule Item
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Section Heading</label>
                <input value={guidelinesHeading} onChange={(e) => setGuidelinesHeading(e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
              </div>

              {guidelinesItems.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-6 font-sans border border-dashed border-slate-200 rounded-lg">
                  No guideline items added yet. Click "+ Add Rule Item".
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {guidelinesItems.map((item, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2 relative">
                      <button onClick={() => handleRemoveItem(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-750 font-bold text-xs bg-transparent border-none cursor-pointer">
                        ✕ Delete
                      </button>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1 space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Rule Title</label>
                          <input value={item.title} onChange={(e) => handleItemChange(idx, 'title', e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Rule Description</label>
                          <textarea rows={2} value={item.description} onChange={(e) => handleItemChange(idx, 'description', e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transparency Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Transparency Section</span>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Transparency Heading</label>
                <input value={transparencyHeading} onChange={(e) => setTransparencyHeading(e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Transparency Content</label>
                <textarea rows={4} value={transparencyContent} onChange={(e) => setTransparencyContent(e.target.value)} style={{ ...inputStyle, width: '100%', lineHeight: 1.4, fontFamily: 'sans-serif' }} />
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
                <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">{title || 'Advertising & Sponsored Policy'}</h2>
                <p className="text-[9.5px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{subtitle || 'Separation of editorial and commercial activities'}</p>
              </div>

              <p className="text-[11.5px] font-medium font-serif leading-relaxed text-slate-800 italic">
                {leadParagraph.replace(/\*\*/g, '') || 'Lead paragraph text details...'}
              </p>

              {introHeading && (
                <div className="space-y-1 mt-3">
                  <h3 className="text-xs font-bold text-slate-900">{introHeading}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed m-0">{introContent}</p>
                </div>
              )}

              {guidelinesHeading && (
                <div className="space-y-2 mt-3">
                  <h3 className="text-xs font-bold text-slate-900">{guidelinesHeading}</h3>
                  <div className="space-y-2">
                    {guidelinesItems.map((item, idx) => (
                      <div key={idx} className="text-[11px] text-slate-500">
                        <strong className="font-bold text-slate-900">{item.title}: </strong>{item.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {transparencyHeading && (
                <div className="space-y-1 mt-3">
                  <h3 className="text-xs font-bold text-slate-900">{transparencyHeading}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed m-0">{transparencyContent}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
