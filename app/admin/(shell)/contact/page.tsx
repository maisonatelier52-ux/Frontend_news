'use client';

import React, { useState, useEffect } from 'react';
import AdminLoader from '../../components/AdminLoader';

interface Department {
  name: string;
  description: string;
  email: string;
}

export default function ContactUsPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [introText, setIntroText] = useState('');
  
  const [deptHeading, setDeptHeading] = useState('');
  const [deptSubheading, setDeptSubheading] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.contactUs) {
          const c = data.contactUs;
          setTitle(c.title || '');
          setSubtitle(c.subtitle || '');
          setIntroText(c.introText || '');
          setDeptHeading(c.deptHeading || '');
          setDeptSubheading(c.deptSubheading || '');
          setDepartments(c.departments || []);
        }
      }
    } catch (e) {
      console.error('Failed to load contact settings', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetOriginal() {
    if (!confirm('Are you sure you want to reset all fields to original defaults? This will not be saved until you click Save Changes.')) return;
    try {
      setLoading(true);
      const res = await fetch('/api/settings/defaults?key=contactUs');
      if (res.ok) {
        const data = await res.json();
        if (data.contactUs) {
          const c = data.contactUs;
          setTitle(c.title || '');
          setSubtitle(c.subtitle || '');
          setIntroText(c.introText || '');
          setDeptHeading(c.deptHeading || '');
          setDeptSubheading(c.deptSubheading || '');
          setDepartments(c.departments || []);
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

  function handleAddDept() {
    setDepartments([...departments, { name: 'New Department Name', description: 'Brief description...', email: 'contact@magazinegazette.com' }]);
  }

  function handleRemoveDept(index: number) {
    setDepartments(departments.filter((_, i) => i !== index));
  }

  function handleDeptChange(index: number, field: keyof Department, val: string) {
    setDepartments(prev => prev.map((item, i) => i === index ? { ...item, [field]: val } : item));
  }

  async function handleSave() {
    try {
      const payload = {
        contactUs: {
          title,
          subtitle,
          introText,
          deptHeading,
          deptSubheading,
          departments
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
            action: 'CONTACT_US_UPDATE',
            details: { title },
            user: 'Admin'
          })
        });
      }
    } catch (err) {
      alert('Failed to save Contact Us settings');
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
          <h1 className="text-[22px] font-sans font-extrabold text-[#111] m-0">Contact Us Manager</h1>
          <p className="text-[12.5px] text-slate-500 mt-1 font-medium">Configure page headings, introductory paragraphs, and edit departmental contacts.</p>
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
          
          {/* Header Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Header & Introduction</span>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600">Page Header Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600">Page Subtitle / Mission Statement</label>
                  <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Department Configuration */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Department List Details</span>
              <button onClick={handleAddDept} className="px-2.5 py-1 text-[10.5px] font-bold rounded bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition">
                + Add Department
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600">Department Section Title</label>
                  <input value={deptHeading} onChange={(e) => setDeptHeading(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600">Department Section Subtitle</label>
                  <input value={deptSubheading} onChange={(e) => setDeptSubheading(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                </div>
              </div>

              {departments.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-6 font-sans border border-dashed border-slate-200 rounded-lg">
                  No departments added yet. Click "+ Add Department" to begin.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {departments.map((item, idx) => (
                    <div key={idx} className="border border-slate-150 rounded-lg p-4 bg-slate-50/50 space-y-3 relative animate-[admin-fade-in_0.2s_ease]">
                      <button onClick={() => handleRemoveDept(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-750 font-bold text-xs bg-transparent border-none cursor-pointer">
                        ✕ Delete
                      </button>

                      <div className="grid grid-cols-2 gap-3 max-w-[85%]">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Department Name</label>
                          <input value={item.name} onChange={(e) => handleDeptChange(idx, 'name', e.target.value)} style={{ ...inputStyle, width: '100%', fontWeight: 700 }} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Contact Email</label>
                          <input value={item.email} onChange={(e) => handleDeptChange(idx, 'email', e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Brief Description</label>
                        <textarea rows={2} value={item.description} onChange={(e) => handleDeptChange(idx, 'description', e.target.value)} style={{ ...inputStyle, width: '100%', lineHeight: 1.4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] sticky top-6 space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Live Layout Preview</span>
            <div className="border border-slate-150 rounded-lg p-4 bg-white font-sans max-h-[600px] overflow-y-auto space-y-5 select-none">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">{title || 'Contact Us'}</h2>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-2">{subtitle || 'Sub-title text'}</p>
              </div>

              {deptHeading && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900">{deptHeading}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{deptSubheading}</p>
                  
                  <div className="space-y-4 pt-1">
                    {departments.map((item, idx) => (
                      <div key={idx} className="space-y-1 border-b border-slate-50 pb-2">
                        <h4 className="text-[11.5px] font-serif font-bold text-slate-900">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
                        <a href="#" className="text-[11px] font-semibold text-slate-900 hover:underline">{item.email}</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
