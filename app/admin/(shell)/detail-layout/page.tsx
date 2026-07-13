"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import DetailPageExperience from "../../../components/DetailPageExperience";
import AdminLoader from "../../components/AdminLoader";
import type { Article } from "../../../data/news";

interface DetailLayout {
  articleId: string;
  designStyle: string; // 'classic-sidebar' | 'left-sidebar' | 'full-width'
  colorTheme: string; // 'crimson' | 'indigo' | 'emerald' | 'slate' | 'amber' | 'ocean'
  fontSizeDefault: string; // 'sm' | 'base' | 'lg' | 'xl'
  showShareBar: boolean;
  shareBarPosition: string; // 'bottom' | 'sticky-left'
  authorCardStyle: string; // 'signature' | 'classic' | 'minimal'
  showComments: boolean;
  trendingStoriesTitle?: string;
  discussionTitle?: string;
  sharePerspectiveTitle?: string;
}

const FACTORY_DEFAULT_LAYOUT: DetailLayout = {
  articleId: "global",
  designStyle: "classic-sidebar",
  colorTheme: "crimson",
  fontSizeDefault: "base",
  showShareBar: true,
  shareBarPosition: "bottom",
  authorCardStyle: "signature",
  showComments: true,
  trendingStoriesTitle: "",
  discussionTitle: "",
  sharePerspectiveTitle: ""
};

const COLOR_THEMES = [
  { value: 'crimson', label: 'Crimson Red' },
  { value: 'indigo', label: 'Brand Indigo' },
  { value: 'emerald', label: 'Forest Emerald' },
  { value: 'slate', label: 'Dark Slate' },
  { value: 'amber', label: 'Amber Gold' },
  { value: 'ocean', label: 'Ocean Blue' }
];

const LAYOUT_OPTIONS = [
  { value: 'original', label: 'Original Layout', desc: 'Original layout style: standard reading column on the left and sticky trending list on the right' },
  { value: 'left-sidebar', label: 'Left Sidebar', desc: 'Flipped layout putting the trending list on the left side of reading content' },
  { value: 'full-width', label: 'Full Width', desc: 'Centered distraction-free content layout with bottom trending list & newsletter' },
  { value: 'magazine-hero', label: 'Magazine Cover', desc: 'Massive full-width banner image above the columns with right sidebar content' },
  { value: 'minimal-focus', label: 'Minimal Focus', desc: 'Distraction-free centered card layout with thin gray border frames and no sidebars' }
];

const AUTHOR_CARD_OPTIONS = [
  { value: 'signature', label: 'Signature Profile', desc: 'Crimson/Accent top accent border, checkmark, initials avatar and contact icons' },
  { value: 'classic', label: 'Classic Gray Box', desc: 'Clean layout with card border and light background info panel' },
  { value: 'minimal', label: 'Minimal Clean Row', desc: 'Borderless layout fitting links and author role on a single line' }
];

const FALLBACK_ARTICLE = {
  id: "preview-art",
  slug: "supreme-court-reviews-landmark-administrative-state-regulations",
  title: "Supreme Court Reviews Landmark Administrative State Regulations",
  excerpt: "Justices hear arguments that could redefine agency regulatory power across multiple industries.",
  blocks: [
    { type: "paragraph", value: "Justices hear arguments that could redefine agency regulatory power across multiple industries. Legal scholars suggest that this decision could alter how federal institutions draft rules and guidelines." },
    { type: "header", value: "The Scope of Agency Jurisdiction" },
    { type: "paragraph", value: "Under existing frameworks, executive agencies rely on broad delegations from legislative chambers. Proponents argue this delegation allows specialized technocrats to draft efficient standards, while critics contend it bypasses constitutional checks." }
  ],
  category: "US & WORLD",
  author: "Juliana Vance",
  authorTitle: "Staff Reporter",
  date: "July 5, 2026",
  readTime: "6 min read",
  image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
  imageAltText: "Supreme Court Gavel and Pillars"
};

const FALLBACK_TRENDING = [
  { category: "World", title: "Global Supply Chains Rerouted Amid Maritime Corridor Pressure" },
  { category: "Finance", title: "Central Banks Signal Flexible Inflation Strategy Measures" },
  { category: "Technology", title: "Space Telescope Reveals Deepest Field Star Cluster Patterns" }
];

interface ZoomControlProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

function ZoomControl({ zoom, setZoom }: ZoomControlProps) {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm px-2 py-1 rounded-xl select-none text-[10px]">
      <button
        type="button"
        onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
        className="p-0.5 px-1 hover:bg-slate-100 rounded font-bold text-slate-500 transition cursor-pointer select-none"
        title="Zoom Out"
      >
        ➖
      </button>
      <span className="font-bold font-mono text-slate-650 min-w-[28px] text-center text-[10.5px]">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={() => setZoom(z => Math.min(z + 0.25, 2.0))}
        className="p-0.5 px-1 hover:bg-slate-100 rounded font-bold text-slate-500 transition cursor-pointer select-none"
        title="Zoom In"
      >
        ➕
      </button>
      {zoom !== 1 && (
        <button
          type="button"
          onClick={() => setZoom(1)}
          className="ml-1 p-0.5 px-1.5 text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-bold transition cursor-pointer select-none"
          title="Reset Zoom"
        >
          Reset
        </button>
      )}
    </div>
  );
}

function SimulatorViewport({
  children,
  naturalWidth = 1280,
  centered = false,
  zoom = 1
}: {
  children: React.ReactNode;
  naturalWidth?: number;
  centered?: boolean;
  zoom?: number;
}) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const [iframeRef, setIframeRef] = React.useState<HTMLIFrameElement | null>(null);
  const [baseScale, setBaseScale] = React.useState(1);
  const NATURAL_WIDTH = naturalWidth;
  const VIEWPORT_HEIGHT = NATURAL_WIDTH === 375 ? 680 : NATURAL_WIDTH === 768 ? 850 : 900;

  const iframeDoc = iframeRef?.contentWindow?.document;
  const mountNode = iframeDoc?.body;

  React.useEffect(() => {
    function measure() {
      if (!outerRef.current) return;
      const availW = outerRef.current.getBoundingClientRect().width;
      const newScale = availW > 0 ? Math.min(availW / NATURAL_WIDTH, 1) : 1;
      setBaseScale(newScale);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [NATURAL_WIDTH]);

  React.useEffect(() => {
    if (!iframeDoc) return;
    const head = iframeDoc.head;
    head.innerHTML = '';
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
      head.appendChild(node.cloneNode(true));
    });
    iframeDoc.documentElement.className = document.documentElement.className;
    if (iframeDoc.body) {
      iframeDoc.body.className = document.body.className + ' bg-white';
    }
    const style = iframeDoc.createElement('style');
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        overflow-y: auto !important;
        height: 100%;
      }
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      html, body {
        background-color: #ffffff !important;
      }
    `;
    head.appendChild(style);
  }, [iframeDoc]);

  const effectiveScale = baseScale * zoom;
  const outerHeight = Math.round(VIEWPORT_HEIGHT * baseScale * Math.min(zoom, 1));
  const outerW = centered
    ? baseScale >= 1
      ? `${NATURAL_WIDTH * Math.min(zoom, 1)}px`
      : '100%'
    : '100%';
  const maxW = centered ? `${NATURAL_WIDTH}px` : '100%';
  const transformedWidth = Math.round(NATURAL_WIDTH * effectiveScale);
  const transformedHeight = Math.round(VIEWPORT_HEIGHT * effectiveScale);

  return (
    <div ref={outerRef} className={`flex ${centered ? 'justify-center py-3' : ''} relative group w-full`}>
      <div
        className="overflow-hidden bg-white border border-slate-100 rounded-xl"
        style={{
          width: outerW,
          maxWidth: maxW,
          height: `${outerHeight}px`,
          ...(centered ? {
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          } : {})
        }}
      >
        <div
          style={{
            width: `${transformedWidth}px`,
            height: `${transformedHeight}px`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <iframe
            ref={setIframeRef}
            title="Viewport Simulator"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${NATURAL_WIDTH}px`,
              height: `${VIEWPORT_HEIGHT}px`,
              border: 'none',
              transformOrigin: 'top left',
              transform: `scale(${effectiveScale})`
            }}
          >
            {mountNode && createPortal(children, mountNode)}
          </iframe>
        </div>
      </div>
    </div>
  );
}

export default function DetailLayoutPage() {
  const [layout, setLayout] = useState<DetailLayout>({ ...FACTORY_DEFAULT_LAYOUT });
  const [originalLayout, setOriginalLayout] = useState<DetailLayout>({ ...FACTORY_DEFAULT_LAYOUT });
  const [layoutHistory, setLayoutHistory] = useState<DetailLayout[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishedBackup, setPublishedBackup] = useState<DetailLayout | null>(null);
  const [message, setMessage] = useState<'success' | 'failed' | 'undone' | 'reset' | 'factory-reset' | 'reverted-backup' | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mainZoom, setMainZoom] = useState(1);
  const [article, setArticle] = useState<any>(FALLBACK_ARTICLE);
  const [trendingArticles, setTrendingArticles] = useState<any[]>(FALLBACK_TRENDING);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 1. Fetch details configurations
        const res = await fetch("/api/detail-layout");
        if (res.ok) {
          const conf = await res.json();
          setLayout(conf);
          setOriginalLayout({ ...conf });
        }

        // 2. Fetch real database articles for realistic simulation details
        const newsRes = await fetch("/api/news?activeOnly=true");
        if (newsRes.ok) {
          const data = await newsRes.json();
          if (Array.isArray(data) && data.length > 0) {
            const firstArt = data[0];
            setArticle({
              id: firstArt._id,
              slug: firstArt.slug,
              title: firstArt.title,
              excerpt: firstArt.excerpt || "",
              blocks: firstArt.blocks || [{ id: "p-0", type: "paragraph", value: firstArt.excerpt || "" }],
              category: firstArt.category || "US & WORLD",
              author: firstArt.author || "Staff Writer",
              authorTitle: "Staff Reporter",
              date: new Date(firstArt.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              readTime: firstArt.readTime || "5 min read",
              image: firstArt.featuredImage || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
              imageAltText: firstArt.imageAltText || firstArt.title
            });

            // Set trending list
            const otherArticles = data.slice(1, 4).map((art: any) => ({
              category: art.category || "General",
              title: art.title
            }));
            if (otherArticles.length > 0) {
              setTrendingArticles(otherArticles);
            }
          }
        }
      } catch (err) {
        console.error("Load layout error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pushHistory = (newLayout: DetailLayout) => {
    setLayoutHistory((prev) => [...prev, JSON.parse(JSON.stringify(layout))].slice(-10));
    setLayout(newLayout);
  };

  const undo = () => {
    if (layoutHistory.length === 0) return;
    const previous = layoutHistory[layoutHistory.length - 1];
    setLayout(previous);
    setLayoutHistory((prev) => prev.slice(0, -1));
    setMessage('undone');
    setTimeout(() => setMessage(null), 2500);
  };

  const updateField = (field: keyof DetailLayout, value: any) => {
    const next = { ...layout, [field]: value };
    pushHistory(next);
  };

  const restoreDraft = () => {
    pushHistory({ ...originalLayout });
    setMessage('reset');
    setShowResetModal(false);
    setTimeout(() => setMessage(null), 2500);
  };

  const restoreFactoryDefaults = () => {
    pushHistory({ ...layout });
    setLayout({ ...FACTORY_DEFAULT_LAYOUT });
    setMessage('factory-reset');
    setShowResetModal(false);
    setTimeout(() => setMessage(null), 2500);
  };

  const revertToDatabaseLayout = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/detail-layout", { method: "PATCH" });
      if (res.ok) {
        const data = await res.json();
        setLayout(data);
        setOriginalLayout({ ...data });
        setLayoutHistory([]);
        setMessage('factory-reset');
      } else {
        setMessage('failed');
      }
    } catch {
      setMessage('failed');
    } finally {
      setSaving(false);
      setShowResetModal(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const saveLayout = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const previousPublishedBackup = JSON.parse(JSON.stringify(originalLayout));
      const res = await fetch("/api/detail-layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(layout)
      });
      if (res.ok) {
        setPublishedBackup(previousPublishedBackup);
        setOriginalLayout({ ...layout });
        setLayoutHistory([]);
        setMessage('success');
      } else {
        setMessage('failed');
      }
    } catch {
      setMessage('failed');
    } finally {
      setSaving(false);
      setShowConfirmModal(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const revertToPreviousDesign = async () => {
    if (!publishedBackup) return;
    try {
      setSaving(true);
      const res = await fetch("/api/detail-layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publishedBackup)
      });
      if (res.ok) {
        setLayout({ ...publishedBackup });
        setOriginalLayout({ ...publishedBackup });
        setPublishedBackup(null);
        setLayoutHistory([]);
        setMessage('reverted-backup');
      } else {
        setMessage('failed');
      }
    } catch {
      setMessage('failed');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const renderLayoutIcon = (value: string) => {
    // 1. Right Sidebar ('original')
    if (value === 'original') {
      return (
        <div className="w-full h-full flex gap-1 p-1 bg-white border border-zinc-300 rounded shadow-xs">
          <div className="flex-[3] flex flex-col gap-0.5">
            <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-4 bg-zinc-250 rounded-[1px] w-full" />
            <div className="h-0.5 bg-zinc-400 rounded-[1px] w-3/4" />
            <div className="h-0.5 bg-zinc-450 rounded-[1px] w-1/2" />
          </div>
          <div className="flex-1 border-l border-zinc-200 pl-0.5 flex flex-col gap-0.5 justify-center">
            <div className="h-1.5 bg-zinc-305 rounded-[1px] w-full" />
            <div className="h-1 bg-zinc-305 rounded-[1px] w-3/4" />
          </div>
        </div>
      );
    }

    // 2. Left Sidebar ('left-sidebar')
    if (value === 'left-sidebar') {
      return (
        <div className="w-full h-full flex gap-1 p-1 bg-white border border-zinc-300 rounded shadow-xs">
          <div className="flex-1 border-r border-zinc-200 pr-0.5 flex flex-col gap-0.5 justify-center">
            <div className="h-1.5 bg-zinc-305 rounded-[1px] w-full" />
            <div className="h-1 bg-zinc-305 rounded-[1px] w-3/4" />
          </div>
          <div className="flex-[3] flex flex-col gap-0.5">
            <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-4 bg-zinc-250 rounded-[1px] w-full" />
            <div className="h-0.5 bg-zinc-400 rounded-[1px] w-3/4" />
            <div className="h-0.5 bg-zinc-450 rounded-[1px] w-1/2" />
          </div>
        </div>
      );
    }

    // 3. Full Width ('full-width')
    if (value === 'full-width') {
      return (
        <div className="w-full h-full flex flex-col gap-0.5 p-1 bg-white border border-zinc-300 rounded shadow-xs px-2 justify-between">
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-3 bg-zinc-250 rounded-[1px] w-full" />
            <div className="h-0.5 bg-zinc-400 rounded-[1px] w-5/6" />
          </div>
          <div className="border-t border-zinc-250 pt-0.5 flex gap-1 items-center justify-between">
            <div className="w-4 h-1 bg-zinc-305 rounded-[1px]" />
            <div className="w-4 h-1 bg-zinc-900 rounded-[1px]" />
          </div>
        </div>
      );
    }

    // 4. Magazine Cover ('magazine-hero')
    if (value === 'magazine-hero') {
      return (
        <div className="w-full h-full flex flex-col gap-0.5 p-1 bg-white border border-zinc-300 rounded shadow-xs">
          <div className="h-3.5 bg-zinc-300 border border-zinc-250 rounded-[1px] w-full" />
          <div className="flex gap-1 flex-1">
            <div className="flex-[3] flex flex-col gap-0.5">
              <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
              <div className="h-0.5 bg-zinc-400 rounded-[1px] w-5/6" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5 justify-center border-l border-zinc-200 pl-0.5">
              <div className="h-1 bg-zinc-305 rounded-[1px] w-full" />
            </div>
          </div>
        </div>
      );
    }

    // 5. Minimal Focus ('minimal-focus')
    if (value === 'minimal-focus') {
      return (
        <div className="w-full h-full flex items-center justify-center p-1 bg-white border border-zinc-300 rounded shadow-xs">
          <div className="w-5/6 h-full border border-dashed border-zinc-350 p-1 flex flex-col gap-0.5 justify-center">
            <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-3 bg-zinc-250 rounded-[1px] w-full" />
            <div className="h-0.5 bg-zinc-400 rounded-[1px] w-3/4" />
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <AdminLoader />;
  }

  const isChanged = JSON.stringify(layout) !== JSON.stringify(originalLayout);
  const simWidth = deviceView === "mobile" ? 375 : deviceView === "tablet" ? 768 : 1200;

  return (
    <div className="max-w-[1250px] w-full min-w-0 animate-[admin-fade-in_0.4s_ease_both] pb-12 font-sans select-none relative p-4 sm:p-6 lg:p-8">
      {/* Premium Header Board */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-4">
        <div>
          <h1 className="text-[26px] font-serif font-extrabold text-white tracking-tight m-0">Article Detail Layout Manager</h1>
          <p className="text-[13px] text-slate-300 mt-1 font-medium">Configure global article template themes, column grids, share bar structures, and bio panels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={undo}
            disabled={layoutHistory.length === 0}
            className={`px-4 py-2.5 rounded-xl text-[12.5px] font-bold border transition cursor-pointer select-none ${
              layoutHistory.length === 0
                ? 'border-white/5 bg-white/5 text-white/40 cursor-not-allowed'
                : 'border-white/10 bg-white/10 hover:bg-white/15 text-white'
            }`}
            title="Undo the last change made in this session"
          >
            ↩️ Undo
          </button>
          <button
            onClick={restoreDraft}
            className="bg-white/10 hover:bg-white/15 text-white transition px-4 py-2.5 rounded-xl text-[12.5px] font-bold border border-white/10 cursor-pointer"
            title="Reset current draft options back to the published database layout settings"
          >
            🔄 Reset Draft
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="bg-white/10 hover:bg-white/15 text-white transition px-4 py-2.5 rounded-xl text-[12.5px] font-bold border border-white/10 cursor-pointer"
            title="Revert layout back to the original factory default design"
          >
            ⚙️ Reset Design
          </button>
          {publishedBackup && (
            <button
              onClick={revertToPreviousDesign}
              disabled={saving}
              className="bg-amber-600 hover:bg-amber-700 text-white transition px-4 py-2.5 rounded-xl text-[12.5px] font-bold border border-amber-500 cursor-pointer shadow-sm animate-pulse"
              title="Rollback the published database layout to the design active before the last publish action"
            >
              ↩️ Revert Previous Layout
            </button>
          )}
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={saving}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white transition px-5 py-2.5 rounded-xl text-[12.5px] font-bold shadow-[0_4px_12px_rgba(99,102,241,0.2)] cursor-pointer"
          >
            {saving ? '⏳ Publishing...' : '💾 Publish Layout'}
          </button>
        </div>
      </div>

      {/* Action Messages */}
      {message === 'success' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-250 text-emerald-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>✓</span> Article detail layout configurations updated successfully! Changes are live on all detail pages.
        </div>
      )}
      {message === 'failed' && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>⚠️</span> Failed to save layouts. Please try again.
        </div>
      )}
      {message === 'undone' && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-850 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>↩️</span> Reverted last draft layout modification!
        </div>
      )}
      {message === 'reset' && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-250 text-amber-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>🔄</span> Proposed draft layout reset to published database settings!
        </div>
      )}
      {message === 'factory-reset' && (
        <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>⚙️</span> Draft restored to factory default layout templates!
        </div>
      )}
      {message === 'reverted-backup' && (
        <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-850 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>↩️</span> Database successfully reverted to the previous layout design!
        </div>
      )}

      {/* Editor Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Controls Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-6">
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">Global Article Settings</h3>
            <button
              onClick={revertToDatabaseLayout}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold px-2 py-1 rounded"
              title="Discard all changes and reset original databases reference state"
            >
              Revert Original
            </button>
          </div>

          {/* Design Layout Selection with Mini Visual Icons */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Grid & Sidebar Style</label>
            <div className="grid grid-cols-3 gap-2">
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateField('designStyle', opt.value)}
                  className={`flex flex-col h-20 items-center justify-between p-1.5 rounded-lg border text-center transition cursor-pointer ${
                    layout.designStyle === opt.value
                      ? "border-indigo-500 bg-indigo-50/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-full h-10 select-none overflow-hidden mb-1">
                    {renderLayoutIcon(opt.value)}
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-850 truncate w-full">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Theme */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Accent Color Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => updateField('colorTheme', theme.value)}
                  className={`p-2.5 rounded-lg border text-[10px] font-bold text-center capitalize cursor-pointer transition ${
                    layout.colorTheme === theme.value
                      ? "border-indigo-500 bg-indigo-50/20 text-indigo-950"
                      : "border-slate-200 hover:bg-slate-50 text-slate-655"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full mx-auto mb-1.5 ${
                    theme.value === 'crimson' ? 'bg-red-750' :
                    theme.value === 'indigo' ? 'bg-indigo-650' :
                    theme.value === 'emerald' ? 'bg-emerald-600' :
                    theme.value === 'slate' ? 'bg-slate-800' :
                    theme.value === 'amber' ? 'bg-amber-500' : 'bg-sky-600'
                  }`} />
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Default Font Size */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Default Font Size</label>
            <div className="grid grid-cols-4 gap-2">
              {['sm', 'base', 'lg', 'xl'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateField('fontSizeDefault', sz)}
                  className={`p-2 border rounded-lg text-center cursor-pointer capitalize text-xs font-bold transition ${
                    layout.fontSizeDefault === sz
                      ? "border-indigo-500 bg-indigo-50/20 text-indigo-950"
                      : "border-slate-200 hover:bg-slate-50 text-slate-655"
                  }`}
                >
                  {sz === 'sm' ? 'Small' : sz === 'base' ? 'Normal' : sz === 'lg' ? 'Large' : 'Huge'}
                </button>
              ))}
            </div>
          </div>

          {/* Author Card style */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Author Bio Card Style</label>
            <div className="space-y-2">
              {AUTHOR_CARD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateField('authorCardStyle', opt.value)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition cursor-pointer ${
                    layout.authorCardStyle === opt.value
                      ? "border-indigo-500 bg-indigo-50/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-bold text-slate-900">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Toggles */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Interactions & Socials</label>
            
            {/* Share bar visibility */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Show Social Sharing Bar</div>
                <div className="text-[10px] text-slate-500">Allow readers to share articles to networks</div>
              </div>
              <input
                type="checkbox"
                checked={layout.showShareBar}
                onChange={(e) => updateField('showShareBar', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-350 rounded cursor-pointer"
              />
            </div>

            {/* Share bar position */}
            {layout.showShareBar && (
              <div className="flex items-center justify-between pl-4 border-l border-slate-200 py-1">
                <div>
                  <div className="text-xs font-bold text-slate-850">Sharing bar Alignment</div>
                  <div className="text-[10px] text-slate-500">Choose bottom list or sticky floating widget</div>
                </div>
                <select
                  value={layout.shareBarPosition}
                  onChange={(e) => updateField('shareBarPosition', e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="bottom">Below Content</option>
                  <option value="sticky-left">Left Floating</option>
                </select>
              </div>
            )}

            {/* Show Comments */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Enable Comments & Discussions</div>
                <div className="text-[10px] text-slate-500">Display comment listing and form at bottom</div>
              </div>
              <input
                type="checkbox"
                checked={layout.showComments}
                onChange={(e) => updateField('showComments', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-355 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Detail Page Text Labels */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Detail Page Text Labels</label>
            <p className="text-[9.5px] text-slate-400 font-medium">Customise headings and titles on the article page. Leave blank to use default values.</p>

            {/* Trending Stories Subtitle */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] inline-block"></span>
                Trending Stories Subtitle
              </label>
              <input
                type="text"
                value={layout.trendingStoriesTitle || ''}
                placeholder="e.g. Trending Stories"
                onChange={(e) => updateField('trendingStoriesTitle', e.target.value)}
                className="p-2 border border-slate-200 rounded-lg text-xs w-full bg-white text-slate-700 outline-none focus:border-[#6366f1] transition placeholder:text-slate-350"
              />
            </div>

            {/* Comment Subtitle Discussion */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                Comment Subtitle Discussion
              </label>
              <input
                type="text"
                value={layout.discussionTitle || ''}
                placeholder="e.g. DISCUSSION"
                onChange={(e) => updateField('discussionTitle', e.target.value)}
                className="p-2 border border-slate-200 rounded-lg text-xs w-full bg-white text-slate-700 outline-none focus:border-[#6366f1] transition placeholder:text-slate-350"
              />
            </div>

            {/* Share Your Perspective */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                "Share Your Perspective" Text
              </label>
              <input
                type="text"
                value={layout.sharePerspectiveTitle || ''}
                placeholder="e.g. Share Your Perspective"
                onChange={(e) => updateField('sharePerspectiveTitle', e.target.value)}
                className="p-2 border border-slate-200 rounded-lg text-xs w-full bg-white text-slate-700 outline-none focus:border-[#6366f1] transition placeholder:text-slate-350"
              />
            </div>
          </div>

        </div>

        {/* Right Side: Preview Simulator — sticky like category layout */}
        <div className="lg:col-span-8 lg:sticky lg:top-[115px] self-start space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3.5 shadow-3xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2 select-none">Viewport:</span>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                {(['desktop', 'tablet', 'mobile'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setDeviceView(view)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md capitalize transition cursor-pointer ${
                      deviceView === view ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
            <ZoomControl zoom={mainZoom} setZoom={setMainZoom} />
          </div>

          {/* Simulated view wrapper */}
          <SimulatorViewport naturalWidth={simWidth} centered zoom={mainZoom}>
            <DetailPageExperience
              layout={layout}
              article={article}
              trendingArticles={trendingArticles}
              isPreview
            />
          </SimulatorViewport>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-3xs flex items-center justify-center z-50 animate-[admin-fade-in_0.2s_ease-out]">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl animate-[admin-scale-up_0.2s_ease-out]">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Publish layout changes?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This will update the article detail page template color theme, sidebar alignments, and styles globally across the news site.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-lg text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveLayout}
                className="px-4 py-2 bg-indigo-655 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                {saving ? "Publishing..." : "Confirm & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-3xs flex items-center justify-center z-50 animate-[admin-fade-in_0.2s_ease-out]">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl animate-[admin-scale-up_0.2s_ease-out]">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Revert layouts?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Do you want to discard your draft modifications or revert everything back to original factory defaults?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-lg text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={restoreDraft}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-lg text-slate-700 cursor-pointer"
              >
                Revert to Last Published
              </button>
              <button
                onClick={revertToDatabaseLayout}
                className="px-4 py-2 bg-rose-605 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                {saving ? "Reverting..." : "Reset to Factory Default"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
