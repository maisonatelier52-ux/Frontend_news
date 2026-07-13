'use client';

import { useState, useEffect } from 'react';

interface TeamMember {
  name: string;
  role: string;
  category: string;
  bio: string;
  profileImage: string;
  visible: boolean;
}

const categoryColors: Record<string, string> = {
  Politics: '#3b82f6',
  Technology: '#8b5cf6',
  Business: '#f59e0b',
  World: '#10b981',
  Sports: '#ef4444',
  Entertainment: '#ec4899',
  Science: '#06b6d4',
  Health: '#84cc16',
};

export default function OurTeamManagerPage() {
  const [pageTitle, setPageTitle] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');
  const [pageIntro, setPageIntro] = useState('');
  const [latestArticlesHeading, setLatestArticlesHeading] = useState('Latest Articles');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  // Form for add/edit
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.ourTeam) {
          const t = data.ourTeam;
          setPageTitle(t.pageTitle || '');
          setPageSubtitle(t.pageSubtitle || '');
          setPageIntro(t.pageIntro || '');
          setLatestArticlesHeading(t.latestArticlesHeading || 'Latest Articles');
          setMembers(t.members || []);
        }
      }
    } catch (e) {
      console.error('Failed to load ourTeam settings', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetOriginal() {
    if (!confirm('Are you sure you want to reset all fields to original defaults? This will not be saved until you click Save Changes.')) return;
    try {
      setLoading(true);
      const res = await fetch('/api/settings/defaults?key=ourTeam');
      if (res.ok) {
        const data = await res.json();
        if (data.ourTeam) {
          const t = data.ourTeam;
          setPageTitle(t.pageTitle || '');
          setPageSubtitle(t.pageSubtitle || '');
          setPageIntro(t.pageIntro || '');
          setLatestArticlesHeading(t.latestArticlesHeading || 'Latest Articles');
          setMembers(t.members || []);
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
    await loadSettings();
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function openAddForm() {
    setEditingIdx(null);
    setFormName('');
    setFormRole('');
    setFormCategory('');
    setFormBio('');
    setFormImage('');
    setFormVisible(true);
    setShowForm(true);
  }

  function openEditForm(idx: number) {
    const m = members[idx];
    setEditingIdx(idx);
    setFormName(m.name);
    setFormRole(m.role);
    setFormCategory(m.category);
    setFormBio(m.bio);
    setFormImage(m.profileImage);
    setFormVisible(m.visible);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingIdx(null);
  }

  function saveMember() {
    const member: TeamMember = {
      name: formName.trim(),
      role: formRole.trim(),
      category: formCategory.trim(),
      bio: formBio.trim(),
      profileImage: formImage.trim(),
      visible: formVisible,
    };
    if (!member.name) return;

    if (editingIdx !== null) {
      setMembers(prev => prev.map((m, i) => i === editingIdx ? member : m));
      setImgErrors(prev => { const c = { ...prev }; delete c[editingIdx]; return c; });
    } else {
      setMembers(prev => [...prev, member]);
    }
    closeForm();
  }

  function deleteMember(idx: number) {
    setMembers(prev => prev.filter((_, i) => i !== idx));
  }

  function toggleVisibility(idx: number) {
    setMembers(prev => prev.map((m, i) => i === idx ? { ...m, visible: !m.visible } : m));
  }

  function moveMember(idx: number, dir: -1 | 1) {
    const newList = [...members];
    const target = idx + dir;
    if (target < 0 || target >= newList.length) return;
    [newList[idx], newList[target]] = [newList[target], newList[idx]];
    setMembers(newList);
  }

  async function handleSave() {
    try {
      const payload = { ourTeam: { pageTitle, pageSubtitle, pageIntro, latestArticlesHeading, members } };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'activity', action: 'OUR_TEAM_UPDATE', details: { memberCount: members.length }, user: 'Admin' }),
        });
      }
    } catch {
      alert('Failed to save Our Team settings');
    }
  }

  const inp = { border: '1px solid #e2e8f0', borderRadius: 6, padding: '7px 11px', fontSize: 12, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' } as React.CSSProperties;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Loading Our Team configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1150px] animate-[admin-fade-in_0.4s_ease_both] pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-sans font-extrabold text-[#111] m-0">Our Team Manager</h1>
          <p className="text-[12.5px] text-slate-500 mt-1 font-medium">Curate and manage team members shown on the public "Our Team" page. Control visibility per member.</p>
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
            className="px-4 py-2 bg-[#111] hover:bg-[#222] text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-sm flex items-center gap-1.5"
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-5">

          {/* Page Header Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Page Header</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-655">Page Title</label>
                <input value={pageTitle} onChange={e => setPageTitle(e.target.value)} style={{ ...inp, width: '100%' }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-655">Subtitle</label>
                <input value={pageSubtitle} onChange={e => setPageSubtitle(e.target.value)} style={{ ...inp, width: '100%' }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-655">Intro Paragraph</label>
              <textarea rows={3} value={pageIntro} onChange={e => setPageIntro(e.target.value)} style={{ ...inp, width: '100%', fontFamily: 'sans-serif', lineHeight: 1.5 }} />
            </div>
          </div>

          {/* Author Profile Page Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Author Profile Page</span>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-655">"Latest Articles" Section Heading</label>
              <input
                value={latestArticlesHeading}
                onChange={e => setLatestArticlesHeading(e.target.value)}
                placeholder="e.g. Latest Articles"
                style={{ ...inp, width: '100%' }}
              />
              <p className="text-[10.5px] text-slate-400">This heading appears on each author's public profile page above their articles list.</p>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Team Members ({members.filter(m => m.visible).length} visible / {members.length} total)</span>
              <button onClick={openAddForm} className="px-2.5 py-1 text-[10.5px] font-bold rounded bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition">
                + Add Member
              </button>
            </div>

            {members.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 border border-dashed border-slate-200 rounded-lg">
                No members added yet. Click "+ Add Member".
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {members.map((m, idx) => (
                  <div key={idx} className={`border rounded-xl p-4 flex items-center gap-4 transition-all ${m.visible ? 'border-slate-200 bg-slate-50/40' : 'border-slate-150 bg-slate-50 opacity-60'}`}>
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-[#1e1b4b] text-white flex items-center justify-center font-extrabold text-[15px] shrink-0 overflow-hidden uppercase">
                      {m.profileImage && !imgErrors[idx] ? (
                        <img src={m.profileImage} alt={m.name} className="w-full h-full object-cover" onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))} />
                      ) : m.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-bold text-slate-900">{m.name}</span>
                        <span className="text-[10px] text-white font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: categoryColors[m.category] || '#6366f1' }}>{m.category}</span>
                        {!m.visible && <span className="text-[9.5px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">Hidden</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{m.role}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Up/Down */}
                      <button onClick={() => moveMember(idx, -1)} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer bg-transparent border-none" title="Move up">
                        ▲
                      </button>
                      <button onClick={() => moveMember(idx, 1)} disabled={idx === members.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer bg-transparent border-none" title="Move down">
                        ▼
                      </button>

                      {/* Visibility toggle */}
                      <button
                        onClick={() => toggleVisibility(idx)}
                        title={m.visible ? 'Click to hide' : 'Click to show'}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border cursor-pointer transition-all ${m.visible ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {m.visible ? '● Visible' : '○ Hidden'}
                      </button>

                      <button onClick={() => openEditForm(idx)} className="px-2.5 py-1 text-[10.5px] font-bold border border-slate-200 bg-white text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                        Edit
                      </button>
                      <button onClick={() => deleteMember(idx)} className="px-2.5 py-1 text-[10.5px] font-bold border border-red-100 bg-white text-red-600 rounded-lg cursor-pointer hover:bg-red-50 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Panel */}
        <div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] sticky top-6 space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Live Preview</span>
            <div className="border border-slate-100 rounded-lg p-4 bg-white max-h-[600px] overflow-y-auto space-y-3 select-none">
              <div className="pb-2 border-b border-slate-100">
                <h2 className="font-serif text-base font-bold text-slate-900">{pageTitle || 'Our Team'}</h2>
                <p className="text-[9.5px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{pageSubtitle || 'The journalists behind Domain Name'}</p>
              </div>
              <p className="text-[10.5px] text-slate-600 leading-relaxed italic">{pageIntro || 'Intro paragraph...'}</p>
              <div className="grid grid-cols-1 gap-2">
                {members.filter(m => m.visible).map((m, i) => (
                  <div key={i} className="flex gap-2 items-start bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1e1b4b] text-white flex items-center justify-center font-bold text-[11px] shrink-0 overflow-hidden uppercase">
                      {m.profileImage ? (
                        <img src={m.profileImage} alt={m.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : m.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold text-slate-900">{m.name}</div>
                      <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: categoryColors[m.category] || '#6366f1' }}>{m.category} · {m.role}</div>
                      <div className="text-[9.5px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{m.bio}</div>
                    </div>
                  </div>
                ))}
                {members.filter(m => m.visible).length === 0 && (
                  <div className="text-[10px] text-slate-300 italic text-center py-4">No visible members yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-[520px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden animate-[admin-scale-in_0.2s_ease_both]">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-[17px] font-extrabold text-[#0f172a]">
                {editingIdx !== null ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-700 cursor-pointer text-xl bg-transparent border-none">✕</button>
            </div>

            <div className="p-6 space-y-4 bg-[#f8fafc] max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650">Name *</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" style={{ ...inp, width: '100%' }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650">Role / Title</label>
                  <input value={formRole} onChange={e => setFormRole(e.target.value)} placeholder="e.g. Senior Correspondent" style={{ ...inp, width: '100%' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650">Category</label>
                  <input value={formCategory} onChange={e => setFormCategory(e.target.value)} placeholder="e.g. Politics" style={{ ...inp, width: '100%' }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650">Profile Image URL</label>
                  <input value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="/authors/name.webp" style={{ ...inp, width: '100%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-650">Bio / Description</label>
                <textarea rows={4} value={formBio} onChange={e => setFormBio(e.target.value)} placeholder="Short biography..." style={{ ...inp, width: '100%', fontFamily: 'sans-serif', lineHeight: 1.5 }} />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl">
                <button
                  onClick={() => setFormVisible(v => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer border-none shrink-0 ${formVisible ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formVisible ? 'left-5' : 'left-0.5'}`} />
                </button>
                <div>
                  <div className="text-[12px] font-bold text-slate-800">
                    {formVisible ? '● Visible on public page' : '○ Hidden from public page'}
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-medium">Toggle to control if this member shows publicly</div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
              <button onClick={closeForm} className="p-2 px-5 bg-white text-slate-700 rounded-xl font-bold text-[13px] cursor-pointer border border-slate-200">Cancel</button>
              <button
                onClick={saveMember}
                disabled={!formName.trim()}
                className="p-2 px-6 bg-[#111] hover:bg-[#222] disabled:opacity-50 text-white rounded-xl font-extrabold text-[13px] cursor-pointer transition"
              >
                {editingIdx !== null ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
