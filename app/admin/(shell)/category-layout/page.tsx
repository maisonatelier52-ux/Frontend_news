"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CategoryPageExperience from "../../../components/CategoryPageExperience";
import type { Article } from "../../../data/news";

interface CategoryLayout {
  categoryId: string;
  designStyle: string;
  colorTheme: string;
  isVisibleSpotlight: boolean;
  isVisibleSidebar: boolean;
  spotlightStyle?: string;
  broadsheetStyle?: string;
}

const FACTORY_DEFAULT_LAYOUT: CategoryLayout = {
  categoryId: "global",
  designStyle: "original",
  colorTheme: "indigo",
  isVisibleSpotlight: true,
  isVisibleSidebar: true,
  spotlightStyle: "standard",
  broadsheetStyle: "illustrated"
};

const COLOR_THEMES = [
  { value: 'indigo', label: 'Brand Indigo' },
  { value: 'crimson', label: 'Crimson Red' },
  { value: 'emerald', label: 'Forest Emerald' },
  { value: 'slate', label: 'Dark Slate' },
  { value: 'amber', label: 'Amber Gold' },
  { value: 'ocean', label: 'Ocean Blue' }
];

const LAYOUT_OPTIONS = [
  { value: 'original', label: 'Original Layout', desc: 'Default layout: Hero story and sidebar list (no spotlight section)' },
  { value: 'modern-spotlight', label: 'Editorial Spotlight', desc: 'Multi-column balanced grid layout with broadsheet, text-only, or premium options' },
  { value: 'split-timeline', label: 'Split Detail + Image', desc: '7/12 column live stream updates + 5/12 column featured stories' },
  { value: 'magazine-grid', label: 'Hero Split + Image', desc: '2x2 visual image grids with clean borders' },
  { value: 'editorial-masonry', label: 'Featured Card Box', desc: 'Asymmetrical columns: visual grids, middle highlights & text lists' }
];

const FALLBACK_ARTICLES: Article[] = [
  {
    id: "fallback-US-0",
    slug: "supreme-court-reviews-landmark-administrative-state-regulations",
    title: "Supreme Court Reviews Landmark Administrative State Regulations",
    excerpt: "Justices hear arguments that could redefine agency regulatory power across multiple industries.",
    content: ["Justices hear arguments that could redefine agency regulatory power across multiple industries."],
    category: "US",
    author: "Juliana Vance",
    authorTitle: 'Staff Reporter',
    date: "July 5, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    commentsCount: 5,
    isLead: true,
    isBreaking: false,
    isTrending: false
  },
  {
    id: "fallback-US-1",
    slug: "clean-energy-grids-see-record-infrastructure-investments",
    title: "Clean Energy Grids See Record Infrastructure Investments",
    excerpt: "State departments authorize $12B funding package for transmission lines and grid resilience.",
    content: ["State departments authorize $12B funding package for transmission lines and grid resilience."],
    category: "US",
    author: "David Pierce",
    authorTitle: 'Staff Reporter',
    date: "July 4, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    commentsCount: 3,
    isLead: false,
    isBreaking: false,
    isTrending: false
  },
  {
    id: "fallback-US-2",
    slug: "midterm-legislative-priorities-shift-in-bipartisan-consensus",
    title: "Midterm Legislative Priorities Shift in Bipartisan Consensus",
    excerpt: "Congressional leaders outline draft strategy focusing on rural broadband and regional transit frameworks.",
    content: ["Congressional leaders outline draft strategy focusing on rural broadband and regional transit frameworks."],
    category: "US",
    author: "Sarah Jenkins",
    authorTitle: 'Staff Reporter',
    date: "July 3, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    commentsCount: 2,
    isLead: false,
    isBreaking: false,
    isTrending: false
  },
  {
    id: "fallback-US-3",
    slug: "urban-housing-affordability-initiatives-show-early-success",
    title: "Urban Housing Affordability Initiatives Show Early Success",
    excerpt: "Metropolitan zoning reforms increase residential construction permits by 22% in pilot program areas.",
    content: ["Metropolitan zoning reforms increase residential construction permits by 22% in pilot program areas."],
    category: "US",
    author: "Marcus Brody",
    authorTitle: 'Staff Reporter',
    date: "July 2, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    commentsCount: 9,
    isLead: false,
    isBreaking: false,
    isTrending: false
  },
  {
    id: "fallback-US-4",
    slug: "federal-cybersecurity-framework-standardized-across-agencies",
    title: "Federal Cybersecurity Framework Standardized Across Agencies",
    excerpt: "Zero-trust verification mandate goes into full effect to counter infrastructure vulnerabilities.",
    content: ["Zero-trust verification mandate goes into full effect to counter infrastructure vulnerabilities."],
    category: "US",
    author: "Elena Rostova",
    authorTitle: 'Staff Reporter',
    date: "July 1, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    commentsCount: 1,
    isLead: false,
    isBreaking: false,
    isTrending: false
  }
];

const FALLBACK_TRENDING: Article[] = [
  {
    id: "fallback-World-0",
    slug: "global-supply-chains-rerouted-amid-maritime-corridor-pressure",
    title: "Global Supply Chains Rerouted Amid Maritime Corridor Pressure",
    excerpt: "Shipping conglomerates shift trade lanes around southern ports to secure transport schedules.",
    content: ["Shipping conglomerates shift trade lanes around southern ports to secure transport schedules."],
    category: "World",
    author: "Hans Mueller",
    authorTitle: 'Staff Reporter',
    date: "July 5, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80",
    commentsCount: 8,
    isLead: false,
    isBreaking: false,
    isTrending: true
  },
  {
    id: "fallback-Finance-0",
    slug: "central-banks-signal-flexible-inflation-strategy-measures",
    title: "Central Banks Signal Flexible Inflation Strategy Measures",
    excerpt: "Global treasury heads emphasize yield stability and domestic productivity indices.",
    content: ["Global treasury heads emphasize yield stability and domestic productivity indices."],
    category: "Finance",
    author: "Gary Reynolds",
    authorTitle: 'Staff Reporter',
    date: "July 5, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    commentsCount: 4,
    isLead: false,
    isBreaking: false,
    isTrending: true
  }
];

// ZoomControl Props
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

// SimulatorViewport
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
  const outerRef = React.useRef<HTMLDivElement>(null)
  const [iframeRef, setIframeRef] = React.useState<HTMLIFrameElement | null>(null)
  const [baseScale, setBaseScale] = React.useState(1)
  const NATURAL_WIDTH = naturalWidth

  // Fixed viewport heights for realistic simulator scrolling
  const VIEWPORT_HEIGHT = NATURAL_WIDTH === 375 ? 680 : NATURAL_WIDTH === 768 ? 850 : 900

  const iframeDoc = iframeRef?.contentWindow?.document
  const mountNode = iframeDoc?.body

  // Measure available width and calculate scale
  React.useEffect(() => {
    function measure() {
      if (!outerRef.current) return
      const availW = outerRef.current.getBoundingClientRect().width
      const newScale = availW > 0 ? Math.min(availW / NATURAL_WIDTH, 1) : 1
      setBaseScale(newScale)
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (outerRef.current) ro.observe(outerRef.current)

    return () => ro.disconnect()
  }, [NATURAL_WIDTH])

  // Copy document styles to iframe doc
  React.useEffect(() => {
    if (!iframeDoc) return

    const head = iframeDoc.head
    head.innerHTML = '' // clear

    // Copy stylesheet links and styles
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
      head.appendChild(node.cloneNode(true))
    })

    // Match root document classes/styles
    iframeDoc.documentElement.className = document.documentElement.className
    if (iframeDoc.body) {
      iframeDoc.body.className = document.body.className + ' bg-white'
    }

    // Embed styling to allow native vertical scrolling inside iframe with premium scrollbars
    const style = iframeDoc.createElement('style')
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        overflow-y: auto !important; /* Enable native vertical scrolling inside simulator frame */
        height: 100%;
      }
      /* Custom scrollbar styling for the simulator view window */
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
      /* Custom style overrides to ensure the viewport background is solid white */
      html, body {
        background-color: #ffffff !important;
      }
    `
    head.appendChild(style)
  }, [iframeDoc])

  const effectiveScale = baseScale * zoom
  const outerHeight = Math.round(VIEWPORT_HEIGHT * baseScale * Math.min(zoom, 1))
  const outerW = centered
    ? baseScale >= 1
      ? `${NATURAL_WIDTH * Math.min(zoom, 1)}px`
      : '100%'
    : '100%'

  const maxW = centered ? `${NATURAL_WIDTH}px` : '100%'

  const transformedWidth = Math.round(NATURAL_WIDTH * effectiveScale)
  const transformedHeight = Math.round(VIEWPORT_HEIGHT * effectiveScale)

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

export default function CategoryLayoutPage() {
  const [layout, setLayout] = useState<CategoryLayout>({
    categoryId: "global",
    designStyle: "original",
    colorTheme: "indigo",
    isVisibleSpotlight: true,
    isVisibleSidebar: true,
    spotlightStyle: "standard",
    broadsheetStyle: "illustrated"
  });
  const [originalLayout, setOriginalLayout] = useState<CategoryLayout>({
    categoryId: "global",
    designStyle: "original",
    colorTheme: "indigo",
    isVisibleSpotlight: true,
    isVisibleSidebar: true,
    spotlightStyle: "standard",
    broadsheetStyle: "illustrated"
  });

  // Undo / History stacks
  const [layoutHistory, setLayoutHistory] = useState<CategoryLayout[]>([]);

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishedBackup, setPublishedBackup] = useState<CategoryLayout | null>(null);
  const [message, setMessage] = useState<'success' | 'failed' | 'undone' | 'reset' | 'factory-reset' | 'reverted-backup' | null>(null);

  // Preview config states matching Homepage Layout builder
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewTab, setPreviewTab] = useState<'draft' | 'live'>('draft');
  const [mainZoom, setMainZoom] = useState(1);

  // Load layout configuration AND real articles from database
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // 1. Fetch Global Category Layout Settings
        const layoutRes = await fetch("/api/category-layout");
        if (layoutRes.ok) {
          const layoutData = await layoutRes.json();
          setLayout(layoutData);
          setOriginalLayout({ ...layoutData });
        }

        // 2. Fetch Real Articles from Database
        const res = await fetch("/api/news?activeOnly=true");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((art: any) => {
            const paragraphs = art.blocks
              ? art.blocks.filter((b: any) => b.type === 'paragraph').map((b: any) => b.value)
              : [art.excerpt || ''];

            return {
              id: art._id,
              title: art.title,
              excerpt: art.excerpt || '',
              content: paragraphs.length > 0 ? paragraphs : [art.excerpt || ''],
              category: art.category,
              author: art.author,
              authorTitle: 'Staff Reporter',
              date: new Date(art.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              readTime: art.readTime || '5 mins',
              image: art.featuredImage || '/article-placeholder.jpg',
              isLead: art.options?.featuredArticle || false,
              isBreaking: art.options?.breakingNews || false,
              isTrending: art.options?.featuredArticle || false,
              commentsCount: Math.floor(Math.random() * 25) + 3
            };
          });

          // Filter for US Category
          const usArticles = mapped.filter((a: any) => a.category === "US");
          const otherArticles = mapped.filter((a: any) => a.category !== "US").slice(0, 7);

          // Merge with fallbacks to ensure rich preview length
          const finalUS = usArticles.length > 0 ? [...usArticles, ...FALLBACK_ARTICLES] : FALLBACK_ARTICLES;
          
          setArticles(finalUS);
          setTrendingArticles(otherArticles.length > 0 ? otherArticles : FALLBACK_TRENDING);
        }
      } catch (err) {
        console.error("Failed to load category preview data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update layout draft field and save history
  const updateField = (field: keyof CategoryLayout, val: any) => {
    // Push deep copy of current draft to history before modifying
    setLayoutHistory(prev => [...prev, JSON.parse(JSON.stringify(layout))]);
    setLayout(prev => ({ ...prev, [field]: val }));
  };

  // Revert back to the previous design layout (Undo action)
  const undoLastAction = () => {
    if (layoutHistory.length > 0) {
      const nextHistory = [...layoutHistory];
      const previousState = nextHistory.pop();
      setLayoutHistory(nextHistory);
      if (previousState) {
        setLayout(previousState);
        setMessage('undone');
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  // Reset current draft back to the active published database state
  const resetToOriginal = () => {
    setLayoutHistory(prev => [...prev, JSON.parse(JSON.stringify(layout))]);
    setLayout({ ...originalLayout });
    setMessage('reset');
    setTimeout(() => setMessage(null), 3000);
  };

  // Revert completely back to factory defaults — resets DB via PATCH
  const revertToDatabaseLayout = async () => {
    try {
      const res = await fetch('/api/category-layout', { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        const reset = {
          categoryId: data.categoryId || 'global',
          designStyle: data.designStyle || 'original',
          colorTheme: data.colorTheme || 'indigo',
          isVisibleSpotlight: data.isVisibleSpotlight !== undefined ? data.isVisibleSpotlight : true,
          isVisibleSidebar: data.isVisibleSidebar !== undefined ? data.isVisibleSidebar : true,
          spotlightStyle: data.spotlightStyle || 'standard',
          broadsheetStyle: data.broadsheetStyle || 'illustrated'
        };
        setLayout(reset);
        setOriginalLayout(reset);
        setLayoutHistory([]);
        setMessage('reset');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error('Revert failed:', err);
    }
  };

  // Revert draft layout back to factory defaults (Reset to Original Design option)
  const resetToFactoryDefaults = () => {
    setLayoutHistory(prev => [...prev, JSON.parse(JSON.stringify(layout))]);
    setLayout({ ...FACTORY_DEFAULT_LAYOUT });
    setMessage('factory-reset');
    setTimeout(() => setMessage(null), 3000);
  };

  // Save changes via API
  const saveLayout = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      // Store backup of previous published state for immediate rollbacks
      const previousPublishedBackup = JSON.parse(JSON.stringify(originalLayout));
      
      const res = await fetch("/api/category-layout", {
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
    } catch (err) {
      console.error(err);
      setMessage('failed');
    } finally {
      setSaving(false);
      setShowConfirmModal(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Restore the previously published layout state from the database backup
  const revertToPreviousDesign = async () => {
    if (!publishedBackup) return;
    try {
      setSaving(true);
      const res = await fetch("/api/category-layout", {
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
    } catch (err) {
      console.error(err);
      setMessage('failed');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Render miniature CSS layouts matching homepage customizer
  const renderLayoutIcon = (value: string) => {
    // 1. modern-spotlight (editorial-spotlight): 3 equal columns layout
    if (value === 'modern-spotlight') {
      return (
        <div className="w-full h-full flex gap-1 p-1 bg-white border border-zinc-305 rounded shadow-xs">
          <div className="flex-1 flex flex-col gap-0.5 border-r border-zinc-200 pr-0.5">
            <div className="h-4 bg-zinc-250 rounded-[1px] w-full" />
            <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-0.5 bg-zinc-400 rounded-[1px] w-3/4" />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 border-r border-zinc-200 px-0.5">
            <div className="h-4 bg-zinc-250 rounded-[1px] w-full" />
            <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-0.5 bg-zinc-400 rounded-[1px] w-3/4" />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 pl-0.5">
            <div className="h-4 bg-zinc-250 rounded-[1px] w-full" />
            <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-0.5 bg-zinc-400 rounded-[1px] w-3/4" />
          </div>
        </div>
      );
    }

    // 2. split-timeline (split-detail): Image LEFT (42%), red accent border + text RIGHT
    if (value === 'split-timeline') {
      return (
        <div className="w-full h-full flex gap-1 p-1 bg-white border border-zinc-300 rounded shadow-xs">
          <div className="flex-[2] bg-zinc-300 border border-zinc-350 rounded-[1px]" />
          <div className="flex-[3] flex flex-col justify-center gap-0.5 pl-1 border-l-2 border-red-600">
            <div className="h-0.5 bg-zinc-305 rounded w-1/2" />
            <div className="h-1.5 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-1.5 bg-zinc-800 rounded-[1px] w-3/4" />
            <div className="h-0.5 bg-zinc-305 rounded w-full" />
            <div className="h-0.5 bg-zinc-305 rounded w-4/5" />
          </div>
        </div>
      );
    }

    // 3. magazine-grid (hero-split): Left 2/3 vertical, right 2 horizontal stacked cards
    if (value === 'magazine-grid') {
      return (
        <div className="w-full h-full flex gap-1 p-1 bg-white border border-zinc-300 rounded shadow-xs">
          <div className="flex-[2] bg-zinc-100 border border-zinc-250 rounded-[1px]" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex-1 bg-zinc-100 border border-zinc-250 rounded-[1px]" />
            <div className="flex-1 bg-zinc-100 border border-zinc-250 rounded-[1px]" />
          </div>
        </div>
      );
    }

    // 4. classic-broadsheet: Thick top border, massive headline, text below
    if (value === 'classic-broadsheet') {
      return (
        <div className="w-full h-full flex flex-col gap-0.5 p-1 bg-white border border-zinc-300 rounded shadow-xs border-t-2 border-t-zinc-800">
          <div className="flex items-center gap-0.5 mb-0.5">
            <div className="w-3 h-1 bg-red-500 rounded-[1px]" />
            <div className="flex-1 border-b border-zinc-300" />
          </div>
          <div className="h-2.5 bg-zinc-900 rounded-[1px] w-full" />
          <div className="h-2 bg-zinc-900 rounded-[1px] w-5/6" />
          <div className="flex gap-1 mt-0.5 flex-1">
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="h-0.5 bg-zinc-305 rounded w-full" />
              <div className="h-0.5 bg-zinc-305 rounded w-4/5" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="h-0.5 bg-zinc-305 rounded w-full" />
              <div className="h-0.5 bg-zinc-205 rounded w-3/4" />
            </div>
          </div>
        </div>
      );
    }

    // 5. editorial-masonry (featured-card): Card box with text LEFT, image RIGHT
    if (value === 'editorial-masonry') {
      return (
        <div className="w-full h-full p-1 bg-white border border-zinc-300 rounded shadow-xs">
          <div className="w-full h-full border border-zinc-200 bg-zinc-50 rounded-[2px] flex gap-1 p-0.5">
            <div className="flex-[7] flex flex-col justify-center gap-0.5 px-0.5">
              <div className="w-5 h-1 bg-zinc-900 rounded-[1px]" />
              <div className="h-1.5 bg-zinc-700 rounded-[1px] w-full" />
              <div className="h-1.5 bg-zinc-700 rounded-[1px] w-3/4" />
              <div className="h-0.5 bg-zinc-305 rounded w-full mt-0.5" />
            </div>
            <div className="flex-[5] bg-zinc-300 rounded-[1px] border border-zinc-200" />
          </div>
        </div>
      );
    }

    // 6. original: Image LEFT (55%), text RIGHT (45%)
    if (value === 'original') {
      return (
        <div className="w-full h-full flex gap-1 p-1 bg-white border border-zinc-300 rounded shadow-xs">
          <div className="flex-[7] bg-zinc-200 border border-zinc-250 rounded-[1px]" />
          <div className="flex-[5] flex flex-col justify-center gap-0.5 px-0.5">
            <div className="h-1 bg-zinc-800 rounded-[1px] w-full" />
            <div className="h-1 bg-zinc-800 rounded-[1px] w-4/5" />
            <div className="h-0.5 bg-zinc-300 rounded w-full mt-0.5" />
            <div className="h-0.5 bg-zinc-300 rounded w-2/3" />
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">Loading settings & preview...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1250px] w-full min-w-0 animate-[admin-fade-in_0.4s_ease_both] pb-12 font-sans select-none relative">
      {/* Header board */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#172554] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-4">
        <div>
          <h1 className="text-[26px] font-serif font-extrabold text-white tracking-tight m-0">Category Layout Manager</h1>
          <p className="text-[13px] text-slate-300 mt-1 font-medium">Configure global category templates, spotlight grids, and accents applied uniformly to all category pages.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={undoLastAction}
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
            onClick={resetToOriginal}
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
            ⚙️ Reset to Original Design
          </button>
          {publishedBackup && (
            <button
              onClick={revertToPreviousDesign}
              disabled={saving}
              className="bg-amber-600 hover:bg-amber-700 text-white transition px-4 py-2.5 rounded-xl text-[12.5px] font-bold border border-amber-500 cursor-pointer shadow-sm animate-pulse"
              title="Rollback the published database layout to the design active before the last publish action"
            >
              ↩️ Revert to Previous Design
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
          <span>✓</span> Category layout configurations updated successfully! Changes are live on all category pages.
        </div>
      )}
      {message === 'failed' && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[13px] font-bold flex items-center gap-2 animate-[admin-fade-in_0.3s_ease]">
          <span>⚠️</span> Failed to save category layouts. Please try again.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: controls */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-6">
          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">Global Category Settings</h3>
              <button
                onClick={revertToDatabaseLayout}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold px-2 py-1 rounded"
                title="Discard all changes and reset original databases reference state"
              >
                Revert Original
              </button>
            </div>
            
            {/* Design Style visual cards grid */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-3">Design Layout Style</label>
              <div className="grid grid-cols-2 gap-3">
                {LAYOUT_OPTIONS.map(opt => {
                  const isSelected = layout.designStyle === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => updateField('designStyle', opt.value)}
                      className={`p-3 min-h-[135px] rounded-xl border-2 flex flex-col items-center justify-start gap-1.5 transition text-center cursor-pointer hover:scale-[1.01] duration-150 ${
                        isSelected
                          ? 'border-[#6366f1] bg-[#6366f1]/5 text-[#6366f1]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-350 hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Mini Visual Grid Icon */}
                      <div className="w-16 h-10 flex-shrink-0">
                        {renderLayoutIcon(opt.value)}
                      </div>
                      <span className={`text-[10.5px] font-extrabold tracking-tight leading-none block text-slate-700 ${isSelected ? 'text-[#6366f1]' : ''}`}>{opt.label}</span>
                      <span className="text-[8.5px] text-slate-400 font-medium leading-tight block max-w-full line-clamp-3">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Themes */}
            <div className="mb-4 border-t pt-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-2">Category Badge Accent</label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_THEMES.map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => updateField('colorTheme', theme.value)}
                    className={`p-2 rounded-lg border text-[11px] font-bold transition flex items-center justify-between cursor-pointer ${
                      layout.colorTheme === theme.value
                        ? 'border-slate-800 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-650 hover:border-slate-300'
                    }`}
                  >
                    <span>{theme.label}</span>
                    <span className={`w-3.5 h-3.5 rounded-full ${theme.value === 'slate' ? 'bg-slate-600' : theme.value === 'indigo' ? 'bg-[#6366f1]' : theme.value === 'crimson' ? 'bg-rose-600' : theme.value === 'emerald' ? 'bg-emerald-600' : theme.value === 'amber' ? 'bg-amber-600' : 'bg-sky-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="border-t pt-4 space-y-3.5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Category Spotlight Grid</span>
                    <span className="text-[10px] text-slate-400 font-medium">Show 3 Curated Spotlight Cards Digest</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layout.isVisibleSpotlight}
                      onChange={e => updateField('isVisibleSpotlight', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                  </label>
                </div>

                {layout.isVisibleSpotlight && (
                  <div className="pl-4 border-l-2 border-slate-100 space-y-2 mt-1 py-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Spotlight Design Option</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'standard', label: 'Standard' },
                        { value: 'minimal', label: 'Minimal' },
                        { value: 'premium', label: 'Better' }
                      ].map(styleOpt => (
                        <button
                          key={styleOpt.value}
                          onClick={() => updateField('spotlightStyle', styleOpt.value)}
                          className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold transition text-center cursor-pointer ${
                            (layout.spotlightStyle || 'standard') === styleOpt.value
                              ? 'border-[#6366f1] bg-[#6366f1]/5 text-[#6366f1]'
                              : 'border-slate-200 bg-white text-slate-650 hover:border-slate-350'
                          }`}
                        >
                          {styleOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Sticky Trending Sidebar</span>
                  <span className="text-[10px] text-slate-400 font-medium">Display sticky sidebar feed in grids</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layout.isVisibleSidebar}
                    onChange={e => updateField('isVisibleSidebar', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                </label>
              </div>

              {layout.designStyle === 'classic-broadsheet' && (
                <div className="flex flex-col gap-2 border-t pt-4">
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Broadsheet Grid Option</span>
                      <span className="text-[10px] text-slate-400 font-medium">Select broadsheet layout style variant</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[
                        { value: 'illustrated', label: 'Illustrated Banner' },
                        { value: 'text-only', label: 'Pure Typographical' },
                        { value: 'asymmetric', label: 'Asymmetric Editorial' },
                        { value: 'vintage-columns', label: 'Vintage Columns' }
                      ].map(broadsheetOpt => (
                        <button
                          key={broadsheetOpt.value}
                          onClick={() => updateField('broadsheetStyle', broadsheetOpt.value)}
                          className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition text-center cursor-pointer ${
                            (layout.broadsheetStyle || 'illustrated') === broadsheetOpt.value
                              ? 'border-[#6366f1] bg-[#6366f1]/5 text-[#6366f1]'
                              : 'border-slate-200 bg-white text-slate-650 hover:border-slate-350'
                          }`}
                        >
                          {broadsheetOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Device simulator */}
        <div className="lg:col-span-8 lg:sticky lg:top-[115px] self-start space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Device view toggles */}
              <div className="bg-slate-200/50 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${deviceView === 'desktop'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Desktop
                </button>
                <button
                  onClick={() => setDeviceView('tablet')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${deviceView === 'tablet'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  Tablet
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${deviceView === 'mobile'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  Mobile
                </button>
              </div>

              {/* Draft/Live toggles */}
              <div className="bg-slate-200/50 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                <button
                  onClick={() => setPreviewTab('draft')}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${previewTab === 'draft'
                      ? 'bg-[#6366f1] text-white shadow-sm'
                      : 'text-slate-650 hover:text-slate-800'
                    }`}
                >
                  <span>✨ Draft</span>
                </button>
                <button
                  onClick={() => setPreviewTab('live')}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${previewTab === 'live'
                      ? 'bg-slate-500 text-white shadow-sm'
                      : 'text-slate-650 hover:text-slate-800'
                    }`}
                >
                  <span>🌐 Live</span>
                </button>
              </div>
            </div>
          </div>

          {/* Device indicator bar */}
          {deviceView !== 'desktop' && (
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Previewing at {deviceView === 'tablet' ? '768px (Tablet)' : '375px (Mobile)'} width
            </div>
          )}

          {/* Sliding Canvas Container */}
          <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: '200%',
                transform: previewTab === 'draft' ? 'translateX(0%)' : 'translateX(-50%)',
              }}
            >
              {/* Proposed Draft */}
              <div style={{ width: '50%', minWidth: 0 }} className="flex flex-col bg-white">
                <div className="flex justify-between items-center px-5 py-3 border-b border-slate-100 bg-slate-50 select-none flex-shrink-0 gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#6366f1] truncate">
                    📝 Proposed Draft Category Page (Unsaved)
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] bg-[#6366f1] text-white font-bold px-2 py-0.5 rounded-full animate-pulse whitespace-nowrap">
                      Interactive Simulation
                    </span>
                    <ZoomControl zoom={mainZoom} setZoom={setMainZoom} />
                  </div>
                </div>
                <SimulatorViewport naturalWidth={deviceView === 'mobile' ? 375 : deviceView === 'tablet' ? 768 : 1280} centered={deviceView !== 'desktop'} zoom={mainZoom}>
                  <CategoryPageExperience
                    decodedCategory="US"
                    tagline="Covering American politics, policy, and national affairs."
                    layout={layout}
                    articles={articles}
                    trendingArticles={trendingArticles}
                    isPreview={true}
                  />
                </SimulatorViewport>
              </div>

              {/* Current Live View */}
              <div style={{ width: '50%', minWidth: 0 }} className="flex flex-col bg-white border-l border-slate-100">
                <div className="flex justify-between items-center px-5 py-3 border-b border-slate-100 bg-slate-50 select-none flex-shrink-0 gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 truncate">
                    🌐 Current Live Category Page (Active)
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] bg-slate-500 text-white font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      Active DB State
                    </span>
                    <ZoomControl zoom={mainZoom} setZoom={setMainZoom} />
                  </div>
                </div>
                <SimulatorViewport naturalWidth={deviceView === 'mobile' ? 375 : deviceView === 'tablet' ? 768 : 1280} centered={deviceView !== 'desktop'} zoom={mainZoom}>
                  <CategoryPageExperience
                    decodedCategory="US"
                    tagline="Covering American politics, policy, and national affairs."
                    layout={originalLayout}
                    articles={articles}
                    trendingArticles={trendingArticles}
                    isPreview={true}
                  />
                </SimulatorViewport>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] animate-[admin-fade-in_0.2s_ease_both]">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-md w-full p-6 animate-[admin-zoom-in_0.2s_ease_both] text-slate-800">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-800">Publish Layout Changes</h2>
            </div>
            
            <p className="text-xs text-slate-550 leading-relaxed mb-5">
              Are you sure you want to publish these Category Layout modifications? This will update the visual design style and accents globally on <strong>all category page instances</strong> immediately.
            </p>

            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-[11.5px] space-y-2 mb-6 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-450">Design Template:</span>
                <span className="font-extrabold text-[#6366f1] capitalize">{layout.designStyle.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Accent Theme:</span>
                <span className="font-extrabold text-slate-700 capitalize">{layout.colorTheme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Spotlight Row:</span>
                <span className="font-bold text-slate-650">{layout.isVisibleSpotlight ? `✅ Visible (${layout.spotlightStyle || 'standard'})` : "❌ Hidden"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Trending Sidebar:</span>
                <span className="font-bold text-slate-650">{layout.isVisibleSidebar ? "✅ Enabled" : "❌ Disabled"}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 font-sans">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 transition px-4.5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveLayout}
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white transition px-5 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_12px_rgba(99,102,241,0.2)] cursor-pointer"
              >
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reset to Original Design Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] animate-[admin-fade-in_0.2s_ease_both]">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-md w-full p-6 animate-[admin-zoom-in_0.2s_ease_both] text-slate-800">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-800">Reset to Original Design</h2>
            </div>
            
            <p className="text-xs text-slate-550 leading-relaxed mb-6">
              Are you sure you want to reset the category page layout to the original design? This will restore the factory default settings (Original Layout, Brand Indigo theme, and default feeds) and publish them to the live site immediately.
            </p>

            <div className="flex justify-end gap-3 font-sans">
              <button
                onClick={() => setShowResetModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 transition px-4.5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowResetModal(false);
                  await revertToDatabaseLayout();
                }}
                className="bg-red-650 hover:bg-red-700 text-white transition px-5 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_12px_rgba(220,38,38,0.2)] cursor-pointer"
              >
                Confirm & Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
