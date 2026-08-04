"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

interface Comment {
  name: string;
  date: string;
  text: string;
}

interface DetailPageExperienceProps {
  layout: {
    designStyle: string; // 'original' | 'left-sidebar' | 'full-width' | 'magazine-hero' | 'minimal-focus'
    colorTheme: string; // 'crimson' | 'indigo' | 'emerald' | 'slate' | 'amber' | 'ocean'
    fontSizeDefault: string; // 'sm' | 'base' | 'lg' | 'xl'
    showShareBar: boolean;
    shareBarPosition: string; // 'bottom' | 'sticky-left'
    authorCardStyle: string; // 'signature' | 'classic' | 'minimal'
    showComments: boolean;
    trendingStoriesTitle?: string;
    discussionTitle?: string;
    sharePerspectiveTitle?: string;
  };
  article: any;
  trendingArticles: any[];
  isPreview?: boolean;
}

type FontSize = "sm" | "base" | "lg" | "xl";

function parseAdDimension(sizeStr: string, defaultWidth: number, defaultHeight: number) {
  if (!sizeStr) return { width: defaultWidth, height: defaultHeight };
  const normalized = sizeStr.replace(/[\s×*]/g, 'x').toLowerCase();
  const parts = normalized.split('x');
  const width = parseInt(parts[0], 10);
  const height = parseInt(parts[1], 10);
  if (!isNaN(width) && !isNaN(height)) {
    return { width, height };
  }
  return { width: defaultWidth, height: defaultHeight };
}

export default function DetailPageExperience({
  layout,
  article,
  trendingArticles = [],
  isPreview = false,
}: DetailPageExperienceProps) {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const resolvedTrendingTitle = layout.trendingStoriesTitle?.trim() || "Trending Stories";
  const resolvedDiscussionTitle = layout.discussionTitle?.trim() || "Discussion";
  const resolvedShareTitle = layout.sharePerspectiveTitle?.trim() || "Share your perspective";
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [showAuthorPanel, setShowAuthorPanel] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [ads, setAds] = useState<any[]>([]);
  const [closedAdIds, setClosedAdIds] = useState<string[]>([]);

  React.useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  React.useEffect(() => {
    async function loadComments() {
      if (isPreview || !article?.id) return;
      try {
        const res = await fetch(`/api/comments?articleId=${article.id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (e) {
        console.error("Failed to load comments", e);
      }
    }
    loadComments();
  }, [article?.id, isPreview]);

  React.useEffect(() => {
    function syncClosedAds() {
      try {
        const closed = localStorage.getItem("domain_closed_ads");
        if (closed) {
          setClosedAdIds(JSON.parse(closed));
        }
      } catch (e) {}
    }
    syncClosedAds();
    window.addEventListener("storage", syncClosedAds);
    window.addEventListener("domain_ad_dismissed", syncClosedAds);
    return () => {
      window.removeEventListener("storage", syncClosedAds);
      window.removeEventListener("domain_ad_dismissed", syncClosedAds);
    };
  }, []);

  React.useEffect(() => {
    async function loadAds() {
      try {
        const res = await fetch("/api/advertisements");
        if (res.ok) {
          const data = await res.json();
          setAds(data.filter((ad: any) => ad.status === "active"));
        }
      } catch (err) {
        console.error("Failed to load advertisements in preview:", err);
      }
    }
    loadAds();
  }, []);

  const isAuthorObj = article.author && typeof article.author === 'object';
  const authorName = isAuthorObj ? (article.author.name || "Juliana Vance") : (article.author || "Juliana Vance");
  const authorRole = isAuthorObj ? (article.author.role || article.authorTitle || "Staff Reporter") : (article.authorTitle || "Staff Reporter");
  const authorBio = isAuthorObj && article.author.bio ? article.author.bio : "A veteran journalist dedicated to in-depth research, reporting on critical affairs, and providing objective coverage of domestic and international issues.";
  const authorEmail = isAuthorObj && article.author.email ? article.author.email : `${(authorName).toLowerCase().replace(/\s/g, '')}@magazinegazette.com`;
  const authorImage = isAuthorObj ? article.author.image : null;

  const authorDetails = {
    name: authorName,
    role: authorRole,
    category: article.category || "US & WORLD",
    bio: authorBio,
    email: authorEmail,
    image: authorImage,
    gender: "female",
    websiteUrl: `https://www.magazinegazette.com/staff/${authorName.toLowerCase().replace(/\s/g, '-')}`,
    socialLinks: {
      twitter: isAuthorObj && article.author.twitter ? article.author.twitter : `https://twitter.com/${authorName.toLowerCase().replace(/\s/g, '')}`,
      medium: isAuthorObj && article.author.medium ? article.author.medium : `https://medium.com/@${authorName.toLowerCase().replace(/\s/g, '')}`,
      substack: isAuthorObj && article.author.substack ? article.author.substack : `https://substack.com/@${authorName.toLowerCase().replace(/\s/g, '')}`
    }
  };

  const authorArticles = [
    { _id: "art-1", category: "US", slug: "clean-energy-grids-see-record-infrastructure-investments", title: "Clean Energy Grids See Record Infrastructure Investments" },
    { _id: "art-2", category: "US", slug: "midterm-legislative-priorities-shift-in-bipartisan-consensus", title: "Midterm Legislative Priorities Shift in Bipartisan Consensus" }
  ];

  if (!article) return null;

  // Theme Classes Mapper
  const themeAccentClasses: Record<string, string> = {
    crimson: "text-red-750",
    indigo: "text-indigo-650",
    emerald: "text-emerald-700",
    slate: "text-slate-800",
    amber: "text-amber-600",
    ocean: "text-sky-700",
  };

  const themeBgClasses: Record<string, string> = {
    crimson: "bg-red-750",
    indigo: "bg-indigo-650",
    emerald: "bg-emerald-700",
    slate: "bg-slate-800",
    amber: "bg-amber-600",
    ocean: "bg-sky-700",
  };

  const themeBorderClasses: Record<string, string> = {
    crimson: "border-red-750",
    indigo: "border-indigo-650",
    emerald: "border-emerald-700",
    slate: "border-slate-800",
    amber: "border-amber-600",
    ocean: "border-sky-700",
  };

  const themeHoverTextClasses: Record<string, string> = {
    crimson: "hover:text-red-750",
    indigo: "hover:text-indigo-650",
    emerald: "hover:text-emerald-700",
    slate: "hover:text-slate-800",
    amber: "hover:text-amber-600",
    ocean: "hover:text-sky-700",
  };

  const themeHoverBorderClasses: Record<string, string> = {
    crimson: "hover:border-red-750",
    indigo: "hover:border-indigo-650",
    emerald: "hover:border-emerald-700",
    slate: "hover:border-slate-800",
    amber: "hover:border-amber-600",
    ocean: "hover:border-sky-700",
  };

  const accentColorClass = themeAccentClasses[layout.colorTheme] || "text-red-750";
  const accentBgClass = themeBgClasses[layout.colorTheme] || "bg-red-750";
  const accentBorderClass = themeBorderClasses[layout.colorTheme] || "border-red-750";
  const accentHoverTextClass = themeHoverTextClasses[layout.colorTheme] || "hover:text-red-700";
  const accentHoverBorderClass = themeHoverBorderClasses[layout.colorTheme] || "hover:border-red-750";
  const designStyle = layout.designStyle === "classic-sidebar" ? "original" : layout.designStyle;

  const parseAdSize = (sizeStr: string, fallbackW = 300, fallbackH = 250) => {
    const parts = (sizeStr || "").split(/[x×]/);
    const w = parseInt(parts[0]) || fallbackW;
    const h = parseInt(parts[1]) || fallbackH;
    return { w, h };
  };

  const visibleAds = ads.filter((ad: any) => !closedAdIds.includes(ad._id));
  const detailPageBelowSubscriptionAd = visibleAds.find((ad: any) => ad.position === "Detail Page Below Subscription");
  const footerBannerAds = visibleAds.filter((ad: any) => ad.position === "Footer Banner");
  const stickyBottomAd = visibleAds.find((ad: any) => ad.position === "Sticky Bottom");

  const filteredTrendingArticles = (trendingArticles || []).filter(
    (trend: any) =>
      trend.slug !== article.slug &&
      trend._id !== article.id &&
      trend.id !== article.id &&
      trend._id !== article._id &&
      trend.title?.trim().toLowerCase() !== article.title?.trim().toLowerCase()
  );

  const displayTrendingArticles = filteredTrendingArticles.length > 0 ? filteredTrendingArticles : (trendingArticles || []);

  const handleToggleBookmark = () => {
    if (bookmarkedIds.includes(article.id)) {
      setBookmarkedIds([]);
    } else {
      setBookmarkedIds([article.id]);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl || window.location.href);
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2000);
    } catch (err) {
      console.error("Failed to copy link");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess("");

    if (!nameInput.trim() || !emailInput.trim() || !commentInput.trim()) {
      setCommentError("Please fill in all fields.");
      return;
    }

    if (isPreview) {
      setCommentError("Comments cannot be submitted in preview mode.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          articleTitle: article.title,
          name: nameInput,
          email: emailInput,
          text: commentInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCommentError(data.error || "Failed to submit comment.");
      } else {
        setCommentSuccess(data.message || "Comment submitted for review!");
        setNameInput("");
        setEmailInput("");
        setCommentInput("");
      }
    } catch (e) {
      setCommentError("An unexpected error occurred.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const renderBlock = (block: any, index: number) => {
    const fontClasses: Record<FontSize, string> = {
      sm: "text-xs sm:text-sm leading-[1.6] text-zinc-800 font-serif",
      base: "text-sm sm:text-base leading-[1.6] text-zinc-800 font-serif",
      lg: "text-base sm:text-lg leading-[1.6] text-zinc-900 font-serif",
      xl: "text-lg sm:text-xl leading-[1.6] text-zinc-900 font-serif",
    };
    const fontSize = (layout.fontSizeDefault as FontSize) || "base";

    switch (block.type) {
      case "paragraph": {
        const text = block.value || "";
        if (index === 0) {
          const firstLetter = text.charAt(0);
          const rest = text.slice(1);
          if (designStyle === "minimal-focus") {
            return (
              <p key={block.id || index} className={fontClasses[fontSize]}>
                <span className="float-left text-5xl md:text-6xl font-black font-serif mr-3 mt-1.5 text-zinc-900 border border-zinc-900 px-3 py-1 bg-zinc-55 shadow-2xs leading-[0.85] select-none">
                  {firstLetter}
                </span>
                {rest}
              </p>
            );
          }
          return (
            <p key={block.id || index} className={fontClasses[fontSize]}>
              <span className="float-left text-5xl md:text-6xl font-bold font-serif mr-2 mt-1.5 text-zinc-900 leading-[0.8] select-none">
                {firstLetter}
              </span>
              {rest}
            </p>
          );
        }
        return (
          <p key={block.id || index} className={fontClasses[fontSize]}>
            {text}
          </p>
        );
      }

      case "subheading":
      case "header":
        return (
          <h3 key={block.id || index} className="font-editorial-title text-xl sm:text-2xl font-bold text-zinc-900 pt-3 pb-2">
            {block.value}
          </h3>
        );

      case "pullquote":
        return (
          <blockquote key={block.id || index} className="border-l-4 border-zinc-900 pl-6 py-2 my-8 font-serif italic text-zinc-800 text-lg sm:text-xl max-w-xl mx-auto">
            <p className="leading-relaxed">“{block.value.quote || block.value}”</p>
            {block.value.author && (
              <cite className="block text-xs font-bold text-zinc-500 font-sans uppercase tracking-widest mt-2.5 not-italic">
                — {block.value.author}
              </cite>
            )}
          </blockquote>
        );

      case "list":
      case "bullet-list":
      case "bulletList": {
        let items: string[] = [];
        let introText = "";
        let isLightBox = false;

        if (typeof block.value === 'object' && block.value !== null) {
          introText = block.value.intro || block.value.title || "";
          isLightBox = block.value.style === 'light-box' || block.value.isLightBox === true;
          if (Array.isArray(block.value.items)) {
            items = block.value.items;
          } else if (typeof block.value.rawText === 'string') {
            items = block.value.rawText.split('\n');
          }
        } else if (Array.isArray(block.value)) {
          items = block.value;
        } else if (typeof block.value === 'string') {
          items = block.value.split('\n');
        }

        const cleanItems = items
          .map((s: string) => s.replace(/^[•\-\*\d+\.]\s*/, '').trim())
          .filter(Boolean);

        if (cleanItems.length === 0 && !introText) return null;

        const listContent = (
          <div className="space-y-3">
            {introText && (
              <p className="font-serif text-base sm:text-lg text-zinc-900 leading-relaxed font-semibold">
                {introText}
              </p>
            )}
            {cleanItems.length > 0 && (
              <ul className="space-y-1.5 pl-6 list-disc font-serif text-sm sm:text-base text-zinc-800 leading-relaxed">
                {cleanItems.map((item: string, i: number) => (
                  <li key={i} className="pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

        if (isLightBox) {
          return (
            <div key={block.id || index} className="my-8 bg-slate-50 border border-slate-200/80 rounded-xl p-6 sm:p-7 shadow-xs">
              {listContent}
            </div>
          );
        }

        return (
          <div key={block.id || index} className="my-6">
            {listContent}
          </div>
        );
      }

      case "image":
        return (
          <figure key={block.id || index} className="my-8 space-y-2">
            <div className="relative aspect-[16/10] bg-zinc-50 rounded-sm overflow-hidden border border-zinc-200 shadow-xs">
              <img src={block.value.url || block.url} alt={block.value.caption || block.caption || "Image"} className="w-full h-full object-cover" />
            </div>
            {(block.value.caption || block.caption) && (
              <figcaption className="text-[11px] text-zinc-500 text-center font-sans leading-relaxed italic">
                {block.value.caption || block.caption}
              </figcaption>
            )}
          </figure>
        );

      case "at-glance":
        return (
          <div key={block.id || index} className={`my-8 bg-zinc-50 rounded-sm p-6 max-w-xl mx-auto space-y-4 shadow-3xs ${designStyle === "minimal-focus" ? "border-2 border-dashed border-zinc-300 bg-stone-50/60" : "border border-zinc-200"}`}>
            <div className="border-b border-zinc-200 pb-3">
              <h4 className="font-editorial-title text-base font-extrabold text-zinc-900 tracking-tight">
                {block.value.title || "At a Glance"}
              </h4>
              {block.value.subtitle && (
                <p className="text-[10px] text-zinc-400 font-sans font-bold uppercase tracking-wider mt-1">
                  {block.value.subtitle}
                </p>
              )}
            </div>
            <div className="divide-y divide-zinc-200/60 text-xs">
              {block.value.rows?.map((row: any, rIndex: number) => (
                <div key={rIndex} className="py-2.5 flex justify-between items-start gap-4">
                  <span className="font-bold text-zinc-800 font-sans shrink-0 uppercase tracking-wider text-[9px]">
                    {row.label}
                  </span>
                  <span className="text-zinc-655 text-right leading-relaxed font-sans">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div key={block.id || index} className={`my-8 bg-white rounded-sm p-6 space-y-5 shadow-3xs ${designStyle === "minimal-focus" ? "border-2 border-dashed border-zinc-300" : "border border-zinc-250"}`}>
            <h4 className="font-editorial-title text-base font-extrabold text-zinc-900 border-b border-zinc-200 pb-2.5 tracking-tight">
              {block.value.title || "Frequently Asked Questions"}
            </h4>
            <div className="space-y-4">
              {block.value.items?.map((qa: any, qIndex: number) => (
                <div key={qIndex} className="space-y-2 border-b border-zinc-100 last:border-b-0 pb-3 last:pb-0">
                  <h5 className="text-sm font-bold text-zinc-900 flex items-start gap-2 leading-snug">
                    <span className="text-zinc-400 select-none font-mono">Q:</span>
                    {qa.question}
                  </h5>
                  <p className="text-xs text-zinc-655 leading-relaxed pl-5 font-sans bg-zinc-50 p-3 border-l-2 border-zinc-900 rounded-r-xs">
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">
      <Header
        activeCategory={article.category}
        setActiveCategory={(cat) => {
          const targetUrl = cat === "All" ? "/" : `/${encodeURIComponent(cat.toLowerCase())}`;
          window.location.href = targetUrl;
        }}
        searchQuery=""
        setSearchQuery={(query) => {
          if (query) {
            window.location.href = `/?search=${encodeURIComponent(query)}`;
          }
        }}
        bookmarkCount={2}
        showBookmarksOnly={false}
        setShowBookmarksOnly={() => {}}
      />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* 1. Magazine Cover Hero Header */}
        {designStyle === "magazine-hero" && (
          <div className="mb-10 space-y-6 text-left max-w-5xl mx-auto animate-[admin-fade-in_0.3s_ease-out]">
            {/* Category tag */}
            <div className="flex items-center select-none">
              <span className={`text-[10px] ${accentColorClass} font-extrabold uppercase tracking-widest border border-zinc-200 px-3 py-1 rounded-[4px] bg-zinc-50`}>
                {article.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="font-editorial-title text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 leading-[1.08] tracking-tight">
              {article.title}
            </h1>

            {/* Excerpt / Subtitle */}
            <p className="text-zinc-550 text-sm sm:text-base leading-snug italic font-serif border-l-2 border-zinc-300 pl-4 py-1">
              {article.excerpt}
            </p>

            {/* Print style Info Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center border-y border-zinc-200 py-3.5 text-xs text-zinc-550 select-none">
              <div className="font-medium">
                By{" "}
                <button
                  onClick={() => setShowAuthorPanel(true)}
                  className={`font-bold text-zinc-800 ${accentHoverTextClass} underline underline-offset-2 transition cursor-pointer`}
                  title="View Author Profile"
                >
                  {authorDetails.name}
                </button>
                <span className="text-zinc-400"> • {authorDetails.role}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Published {article.date}</span>
                <span className="text-zinc-300">•</span>
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Huge Featured Photo */}
            <div className="relative aspect-[21/9] bg-zinc-50 rounded-xs overflow-hidden border border-zinc-200 shadow-xs">
              <img
                src={article.image}
                alt={article.imageAltText || article.title}
                className="w-full h-full object-cover filter brightness-95"
              />
            </div>
            <div className="text-[10px] text-zinc-400 font-mono text-right italic select-none">
              {article.imageAltText || article.title || "Photo Credits: Unsplash Editorial Archives."}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12">
          
          {/* Main Reading Column */}
          <div className={`
            ${(designStyle === "full-width" || designStyle === "minimal-focus") ? "lg:col-span-12 max-w-3xl mx-auto w-full" : "lg:col-span-8"}
            ${designStyle === "left-sidebar" ? "lg:order-2" : ""}
            ${designStyle === "minimal-focus" ? "border-t-4 border-b-4 border-double border-zinc-950 bg-stone-50/30 p-5 sm:p-8 shadow-xs text-left animate-[admin-fade-in_0.3s_ease-out]" : ""}
            space-y-6
          `}>
            
            {/* Standard detail headers (hidden in magazine cover style) */}
            {designStyle !== "magazine-hero" && (
              <>
                {/* Category tag */}
                {designStyle === "minimal-focus" ? (
                  <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-405 select-none pt-0.5">
                    <div className="h-[1px] flex-grow bg-zinc-250" />
                    <span className={accentColorClass}>{article.category}</span>
                    <div className="h-[1px] flex-grow bg-zinc-250" />
                  </div>
                ) : (
                  <div className="flex items-center select-none text-left">
                    <span className={`text-[10px] ${accentColorClass} font-extrabold uppercase tracking-widest border border-zinc-200 px-3 py-1 rounded-[4px] bg-zinc-50`}>
                      {article.category}
                    </span>
                  </div>
                )}

                {/* Headline */}
                <div className={designStyle === "minimal-focus" ? "pt-2 text-center" : "pt-0.5 text-left"}>
                  <h1 className={designStyle === "minimal-focus" ? "font-editorial-title text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 leading-[1.08] tracking-tight px-2" : "font-editorial-title text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 leading-[1.08] tracking-tight"}>
                    {article.title}
                  </h1>
                </div>

                {/* Excerpt / Subtitle */}
                {designStyle === "minimal-focus" ? (
                  <p className="text-center text-zinc-555 text-sm sm:text-base leading-snug italic font-serif max-w-2xl mx-auto border-none pl-0 pt-2">
                    {article.excerpt}
                  </p>
                ) : (
                  <p className="text-zinc-555 text-sm sm:text-base leading-snug italic font-serif border-l-2 border-zinc-300 pl-4 py-1 text-left">
                    {article.excerpt}
                  </p>
                )}

                {/* Print style Info Bar */}
                {designStyle === "minimal-focus" ? (
                  <div className="flex flex-wrap justify-center items-center gap-4 border-y border-zinc-250 py-3 text-xs text-zinc-500 font-medium select-none">
                    <div>
                      By{" "}
                      <button
                        onClick={() => setShowAuthorPanel(true)}
                        className={`font-bold text-zinc-800 ${accentHoverTextClass} underline underline-offset-2 transition cursor-pointer`}
                      >
                        {authorDetails.name}
                      </button>
                      <span className="text-zinc-400"> • {authorDetails.role}</span>
                    </div>
                    <span className="text-zinc-300 select-none">•</span>
                    <div>Published {article.date}</div>
                    <span className="text-zinc-300 select-none">•</span>
                    <div>{article.readTime}</div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center border-y border-zinc-200 py-3.5 text-xs text-zinc-550 select-none">
                    <div className="font-medium text-left">
                      By{" "}
                      <button
                        onClick={() => setShowAuthorPanel(true)}
                        className={`font-bold text-zinc-800 ${accentHoverTextClass} underline underline-offset-2 transition cursor-pointer`}
                        title="View Author Profile"
                      >
                        {authorDetails.name}
                      </button>
                      <span className="text-zinc-400"> • {authorDetails.role}</span>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span>Published {article.date}</span>
                        <span className="text-zinc-300">•</span>
                        <span>{article.readTime}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Bookmark Button */}
                        <button
                          onClick={handleToggleBookmark}
                          className="text-zinc-500 hover:text-black transition cursor-pointer"
                          title={bookmarkedIds.includes(article.id) ? "Remove Bookmark" : "Bookmark Article"}
                        >
                          <svg className="w-4.5 h-4.5" fill={bookmarkedIds.includes(article.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>

                        {/* Share Link */}
                        <button
                          onClick={handleShare}
                          className="text-zinc-500 hover:text-black transition cursor-pointer relative"
                          title="Copy Article Link"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318m0 0a3 3 0 10-4.243-4.243m4.243 4.243L13.32 12.35m0 0l4.636 2.318m0 0a3 3 0 11-4.243 4.243m4.243-4.243L13.32 12.35M6 16a3 3 0 100-6 3 3 0 000 6z" />
                          </svg>
                          {showShareNotification && (
                            <span className="absolute bottom-7 right-0 bg-zinc-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded whitespace-nowrap shadow-md">
                              Link copied!
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Featured Photo */}
                <div className="relative aspect-[16/10] bg-zinc-50 rounded-xs overflow-hidden border border-zinc-200 shadow-xs">
                  <img
                    src={article.image}
                    alt={article.imageAltText || article.title}
                    className="w-full h-full object-cover filter brightness-95"
                  />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono text-right italic select-none">
                  {article.imageAltText || article.title || "Photo Credits: Unsplash Editorial Archives."}
                </div>
              </>
            )}

            {/* Sticky Share Bar Option */}
            {layout.showShareBar && layout.shareBarPosition === "sticky-left" && (
              <div className="hidden xl:block fixed left-10 top-40 bg-white border border-zinc-200 rounded-full p-2 space-y-4 shadow-sm z-30 animate-[admin-fade-in_0.3s_ease-out]">
                <button
                  onClick={handleShare}
                  className={`p-2 rounded-full text-zinc-550 ${accentHoverTextClass} transition cursor-pointer relative flex items-center justify-center`}
                  title="Copy Link"
                >
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {showShareNotification && (
                    <span className="absolute left-10 top-1 bg-zinc-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded whitespace-nowrap shadow-md">
                      Copied!
                    </span>
                  )}
                </button>
                <div className="h-4 border-l border-zinc-200 mx-auto" />
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}%20${encodeURIComponent(currentUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 flex items-center justify-center rounded-full text-zinc-555 hover:text-green-600 transition cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
                <a
                  href={`https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 flex items-center justify-center rounded-full text-zinc-555 hover:text-orange-600 transition cursor-pointer"
                  title="Share on Reddit"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.275-1.84.731-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z"/></svg>
                </a>
              </div>
            )}

            {/* Article Content */}
            <article className="mt-8 font-editorial-body space-y-3.5 pb-2 text-left">
              {(article.blocks || [{ type: "paragraph", value: article.excerpt }]).map((block: any, idx: number) => renderBlock(block, idx))}
            </article>

            {/* Standard Bottom Share options */}
            {layout.showShareBar && layout.shareBarPosition === "bottom" && (
              <div className="py-3.5 border-b border-zinc-200 select-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                      Share this story
                    </span>
                    <div className="h-[1px] w-8 bg-zinc-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}%20${encodeURIComponent(currentUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      className={`p-2 rounded-full border border-zinc-200 text-zinc-655 hover:text-green-600 hover:border-green-600 transition flex items-center justify-center w-[34px] h-[34px]`}
                      title="Share on WhatsApp"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    </a>
                    
                    {/* Reddit */}
                    <a
                      href={`https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article.title)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-full border border-zinc-200 text-zinc-655 hover:text-orange-600 hover:border-orange-600 transition flex items-center justify-center w-[34px] h-[34px]"
                      title="Share on Reddit"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.275-1.84.731-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z"/></svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-full border border-zinc-200 text-zinc-655 hover:text-blue-700 hover:border-blue-700 transition flex items-center justify-center w-[34px] h-[34px]"
                      title="Share on LinkedIn"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent("Check out this article: " + currentUrl)}`}
                      className="p-2 rounded-full border border-zinc-200 text-zinc-655 hover:text-zinc-950 hover:border-zinc-950 transition flex items-center justify-center w-[34px] h-[34px]"
                      title="Share via Email"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-full border border-zinc-200 text-zinc-655 hover:text-blue-600 hover:border-blue-600 transition flex items-center justify-center w-[34px] h-[34px]"
                      title="Share on Facebook"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>

                    {/* Twitter / X */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-full border border-zinc-200 text-zinc-655 hover:text-black hover:border-black transition flex items-center justify-center w-[34px] h-[34px]"
                      title="Share on X"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>

                    {/* Copy Link Button */}
                    <button
                      onClick={handleShare}
                      className={`p-2 rounded-full border border-zinc-200 text-zinc-655 ${accentHoverTextClass} ${accentHoverBorderClass} transition cursor-pointer relative flex items-center justify-center w-[34px] h-[34px]`}
                      title="Copy Article Link"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {showShareNotification && (
                        <span className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded whitespace-nowrap shadow-md z-20">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Author Card styles */}
            {layout.authorCardStyle === "signature" && (
              <div className="my-12 p-6 sm:p-8 bg-zinc-50 border border-zinc-200 rounded-lg shadow-3xs flex flex-col gap-4 select-none relative overflow-hidden animate-[admin-fade-in_0.3s_ease-out]">
                {/* Decorative top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${accentBgClass}`} />
                
                {/* Top Row: Avatar, Name, Label, and Badge */}
                <div className="flex items-center justify-between w-full gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-50 ${accentColorClass} flex items-center justify-center font-bold border-2 border-white shadow-md cursor-pointer text-lg sm:text-xl overflow-hidden`} onClick={() => setShowAuthorPanel(true)}>
                        {authorDetails.image ? <img src={authorDetails.image} alt={authorDetails.name} className="w-full h-full object-cover" /> : authorDetails.name.charAt(0)}
                      </div>
                    </div>
                    
                    {/* Name and Label */}
                    <div className="text-left">
                      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${accentColorClass} block leading-none mb-1`}>
                        Journalist Profile
                      </span>
                      <h4 className="text-sm sm:text-lg font-serif font-black text-zinc-900 tracking-tight leading-tight cursor-pointer" onClick={() => setShowAuthorPanel(true)}>
                        {authorDetails.name}
                      </h4>
                    </div>
                  </div>
                  
                  {/* Badge role */}
                  <span className="shrink-0 text-[8px] sm:text-[10px] px-2 sm:px-3 py-1 bg-zinc-900 text-white font-extrabold uppercase tracking-widest rounded-sm shadow-3xs">
                    {authorDetails.role}
                  </span>
                </div>

                {/* Bio description */}
                <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans italic text-left border-t border-zinc-200/40 pt-3">
                  “{authorDetails.bio}”
                </p>

                {/* Bottom row: links */}
                <div className="flex flex-wrap items-center justify-start gap-2 pt-2 border-t border-zinc-200/60 text-xs text-zinc-555 font-medium">
                  <span className={`hover:${accentColorClass} transition duration-200 flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded-sm shadow-3xs hover:shadow-2xs text-[10px] sm:text-xs`}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{authorDetails.email}</span>
                  </span>
                  <span className="text-zinc-300 hidden sm:inline select-none">•</span>
                  <button className={`text-zinc-655 hover:${accentColorClass} font-bold transition duration-200 cursor-pointer text-[10px] sm:text-xs`} onClick={() => setShowAuthorPanel(true)}>
                    View Profile
                  </button>
                </div>
              </div>
            )}

            {layout.authorCardStyle === "classic" && (
              <div className="my-10 border border-zinc-200 bg-white p-5 select-none rounded shadow-3xs text-left animate-[admin-fade-in_0.3s_ease-out]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 overflow-hidden">
                    {authorDetails.image ? <img src={authorDetails.image} alt={authorDetails.name} className="w-full h-full object-cover" /> : authorDetails.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{authorDetails.name}</h4>
                    <span className="text-[10px] text-zinc-555 font-medium">{authorDetails.role}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-605 leading-relaxed font-sans mt-3">
                  {authorDetails.bio}
                </p>
              </div>
            )}

            {layout.authorCardStyle === "minimal" && (
              <div className="my-8 py-4 border-t border-b border-zinc-250/60 flex items-center justify-between text-xs text-zinc-655 select-none text-left animate-[admin-fade-in_0.3s_ease-out]">
                <div>
                  Written by <span className="font-bold text-zinc-900">{authorDetails.name}</span> ({authorDetails.role})
                </div>
                <button className={`font-bold hover:underline cursor-pointer ${accentColorClass}`} onClick={() => setShowAuthorPanel(true)}>
                  Contact Author
                </button>
              </div>
            )}

            {/* Comments and Discussion Area */}
            {layout.showComments && (
              <section className="space-y-6 pt-4">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2 text-left">
                  {resolvedDiscussionTitle} ({comments.length})
                </h3>

                {/* List of comments */}
                <div className="space-y-4">
                  {comments.length === 0 && (
                    <div className="text-xs text-zinc-500 italic">No comments yet. Be the first to share your perspective.</div>
                  )}
                  {comments.map((comment, index) => (
                    <div key={comment._id || index} className="bg-zinc-50/50 border border-zinc-200 p-4 rounded-xs transition hover:shadow-2xs text-left">
                      <div className="flex justify-between items-center text-[10.5px] text-zinc-500 mb-1.5 font-mono">
                        <span className="font-bold text-zinc-800">{comment.name}</span>
                        <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : comment.date}</span>
                      </div>
                      <p className="text-xs text-zinc-750 leading-relaxed font-sans">{comment.text}</p>
                    </div>
                  ))}
                </div>

                {/* Submit Comment Form */}
                <form onSubmit={handleCommentSubmit} className="border border-zinc-200 p-5 bg-zinc-50/40 rounded-xs space-y-4">
                  <h4 className="text-xs font-bold text-zinc-850 uppercase tracking-widest text-left">{resolvedShareTitle}</h4>
                  
                  {commentError && (
                    <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded border border-red-100 text-left">
                      {commentError}
                    </div>
                  )}
                  {commentSuccess && (
                    <div className="bg-emerald-50 text-emerald-700 text-[11px] p-3 rounded border border-emerald-100 text-left">
                      {commentSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name / Signature"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-white border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-zinc-800 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                      required
                      disabled={isSubmittingComment}
                    />
                    <input
                      type="email"
                      placeholder="Subscriber Email Address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-white border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-zinc-800 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                      required
                      disabled={isSubmittingComment}
                    />
                  </div>
                  <textarea
                    placeholder="Add your comments here..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="bg-white border border-zinc-200 rounded px-3.5 py-3 text-xs text-zinc-800 w-full h-24 resize-none focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                    required
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className={`text-white text-xs font-bold py-2.5 px-5 rounded transition btn-3d-indigo self-start font-sans ${isSubmittingComment ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-900 cursor-pointer hover:bg-zinc-800'}`}
                  >
                    {isSubmittingComment ? "Submitting..." : "Submit Comment"}
                  </button>
                </form>
              </section>
            )}

            {/* Bottom sections for Full Width / Minimal Layouts (Preserves Trending stories & Newsletter Dispatch below comments) */}
            {(designStyle === "full-width" || designStyle === "minimal-focus") && (
              <div className="border-t border-zinc-200 pt-8 mt-8 space-y-8 text-left">
                {/* Trending Stories */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider border-b-2 border-zinc-900 pb-2 text-left">
                    {resolvedTrendingTitle}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayTrendingArticles.map((trend, index) => (
                      <Link
                        key={trend._id || trend.id || index}
                        href={trend.slug ? `/article/${trend.slug}` : "#"}
                        className="flex items-start gap-4 group cursor-pointer"
                      >
                        <span className={`font-serif text-3xl font-normal text-zinc-300 group-hover:${accentColorClass} transition duration-300 leading-none select-none`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                            {trend.category}
                          </span>
                          <h5 className={`text-xs sm:text-sm font-bold text-zinc-900 leading-snug font-serif group-hover:${accentColorClass} transition duration-300`}>
                            {trend.title}
                          </h5>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Dispatch box */}
                <div className={`p-6 rounded-sm space-y-4 shadow-xs text-left max-w-xl mx-auto w-full ${designStyle === "minimal-focus" ? "bg-stone-50 border-2 border-double border-zinc-800 text-zinc-900" : "bg-zinc-900 text-white"}`}>
                  <div className="space-y-1">
                    <h4 className={`text-[9px] font-bold uppercase tracking-widest ${designStyle === "minimal-focus" ? "text-zinc-500" : "text-zinc-400"}`}>The Dispatch</h4>
                    <p className="text-base font-serif font-bold leading-tight">Stay informed with weekly analysis</p>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${designStyle === "minimal-focus" ? "text-zinc-600" : "text-zinc-400"}`}>
                    Join our newsletter list to receive investigative reports directly in your inbox.
                  </p>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-2.5">
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className={`text-xs rounded p-2.5 w-full ${designStyle === "minimal-focus" ? "bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-650 focus:outline-none" : "bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"}`}
                      required
                    />
                    <button
                      type="submit"
                      className={`w-full text-xs font-bold py-2 rounded transition cursor-pointer ${designStyle === "minimal-focus" ? "bg-zinc-900 hover:bg-zinc-800 text-white" : "bg-white hover:bg-zinc-105 text-black"}`}
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
                {detailPageBelowSubscriptionAd && (
                  <div className="w-full mt-6 flex flex-col items-center select-none">
                    <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">Advertisement</span>
                    {(() => {
                      const { w, h } = parseAdSize(detailPageBelowSubscriptionAd.size, 728, 90);
                      return (
                        <div className="relative overflow-hidden border border-zinc-200 shadow-3xs max-w-full" style={{ width: `${w}px`, height: `${h}px` }}>
                          <img src={detailPageBelowSubscriptionAd.imageUrl} alt={detailPageBelowSubscriptionAd.name} className="w-full h-full object-cover" />
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right/Left Sidebar Area (rendered in original, left-sidebar, and magazine-hero styles) */}
          {(designStyle !== "full-width" && designStyle !== "minimal-focus") && (
            <div className={`
              lg:col-span-4 space-y-8 lg:sticky lg:top-8 lg:self-start h-fit border-t lg:border-t-0 lg:border-l border-zinc-200 pt-8 lg:pt-0 lg:pl-8
              ${designStyle === "left-sidebar" ? "lg:order-1" : ""}
            `}>
              {/* Trending Stories */}
              <div className="space-y-6">
                <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider border-b-2 border-zinc-900 pb-2 text-left">
                  {resolvedTrendingTitle}
                </h4>
                <div className="space-y-5 text-left">
                  {displayTrendingArticles.map((trend, index) => (
                    <Link
                      key={trend._id || trend.id || index}
                      href={trend.slug ? `/article/${trend.slug}` : "#"}
                      className="flex items-start gap-4 group cursor-pointer"
                    >
                      <span className={`font-serif text-3xl font-normal text-zinc-300 group-hover:${accentColorClass} transition duration-300 leading-none select-none`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                          {trend.category}
                        </span>
                        <h5 className={`text-xs sm:text-sm font-medium text-zinc-800 leading-snug font-serif group-hover:${accentColorClass} transition duration-300`}>
                          {trend.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Dispatch box */}
              <div className="bg-zinc-900 text-white p-6 rounded-sm space-y-4 shadow-xs text-left">
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Magazine Gazette</h4>
                  <p className="text-base font-serif font-bold leading-tight">Stay informed with daily analysis</p>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Join 20,000+ readers. Get curated briefs and breaking news alerts sent directly to your inbox.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-2.5">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="bg-zinc-800 border border-zinc-700 text-xs rounded p-2.5 w-full text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-black text-xs font-bold py-2 rounded hover:bg-zinc-100 transition cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Detail Page Below Subscription Ad */}
              {detailPageBelowSubscriptionAd && (
                <div className="w-full flex flex-col items-center border-t border-zinc-150 pt-6 select-none">
                  <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">Advertisement</span>
                  {(() => {
                    const { w, h } = parseAdSize(detailPageBelowSubscriptionAd.size, 300, 250);
                    return (
                      <div className="relative overflow-hidden border border-zinc-200 shadow-3xs max-w-full" style={{ width: `${w}px`, height: `${h}px` }}>
                        <img src={detailPageBelowSubscriptionAd.imageUrl} alt={detailPageBelowSubscriptionAd.name} className="w-full h-full object-cover" />
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* More News Section */}
      <div className="w-full border-t border-zinc-200 mt-6 pt-6 pb-6 select-none">
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-editorial-title font-black text-zinc-900 uppercase tracking-wide mb-6">
            More News
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTrendingArticles.slice(0, 4).map((art, index) => (
              <Link key={art._id || art.id || index} href={`/article/${art.slug}`} className="group flex flex-col gap-3 cursor-pointer">
                <div className="w-full aspect-[4/3] overflow-hidden rounded bg-zinc-100">
                  <img 
                    src={art.image || art.featuredImage || '/article-placeholder.jpg'} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-800 leading-snug group-hover:underline">
                    {art.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      {footerBannerAds.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 select-none border-t border-zinc-150 pt-6">
          <div className="relative bg-zinc-50/50 p-3 rounded border border-zinc-200 flex flex-col items-center justify-center animate-[admin-fade-in_0.3s_ease-out]">
            <button
              onClick={() => {
                const adToClose = footerBannerAds[0];
                if (adToClose) {
                  const nextClosed = [...closedAdIds, adToClose._id];
                  setClosedAdIds(nextClosed);
                  try {
                    localStorage.setItem("domain_closed_ads", JSON.stringify(nextClosed));
                  } catch (e) {}
                  window.dispatchEvent(new Event("domain_ad_dismissed"));
                }
              }}
              className="absolute top-2 right-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer transition z-10"
              title="Close Ad"
            >
              ✕
            </button>
            <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">Advertisement</span>
            
            {/* Mobile Footer Banner */}
            {(() => {
              const mobileAd = footerBannerAds.find(a => a.size.includes("320")) || footerBannerAds[0];
              if (!mobileAd) return null;
              const { w, h } = parseAdSize(mobileAd.size, 320, 50);
              return (
                <div 
                  className="md:hidden relative overflow-hidden border border-zinc-200 shadow-3xs bg-white" 
                  style={{ width: `${w}px`, height: `${h}px` }}
                >
                  <img src={mobileAd.imageUrl} alt={mobileAd.name} className="w-full h-full object-cover" />
                </div>
              );
            })()}

            {/* Desktop/Tablet Footer Banner */}
            {(() => {
              const desktopAd = footerBannerAds.find(a => a.size.includes("728")) || footerBannerAds.find(a => a.size.includes("300")) || footerBannerAds[0];
              if (!desktopAd) return null;
              const { w, h } = parseAdSize(desktopAd.size, 728, 90);
              return (
                <div 
                  className="hidden md:block relative overflow-hidden border border-zinc-200 shadow-3xs bg-white" 
                  style={{ width: `${w}px`, height: `${h}px` }}
                >
                  <img src={desktopAd.imageUrl} alt={desktopAd.name} className="w-full h-full object-cover" />
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Editorial Footer */}
      <Footer />

      {/* Slide-out Author Panel */}
      {showAuthorPanel && authorDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs select-none">
          <div className="absolute inset-0 -z-10" onClick={() => setShowAuthorPanel(false)} />
          
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 py-4 px-6 flex items-center justify-between">
              <h3 className="font-editorial-title font-black text-base tracking-tight uppercase">
                Journalist Profile
              </h3>
              <button
                onClick={() => setShowAuthorPanel(false)}
                className="text-zinc-400 hover:text-black font-semibold text-xs transition cursor-pointer flex items-center gap-1"
              >
                <span>Close</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Content */}
            <div className="flex-grow p-6 sm:p-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-555 border-2 border-zinc-300 shadow-md text-3xl overflow-hidden">
                  {authorDetails.image ? <img src={authorDetails.image} alt={authorDetails.name} className="w-full h-full object-cover" /> : authorDetails.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-editorial-title text-2xl font-black text-zinc-900 leading-snug">
                    {authorDetails.name}
                  </h2>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest mt-1">
                    {authorDetails.role} • {authorDetails.category} Beat
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-zinc-150 pt-4">
                <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest text-left">
                  Biography
                </h4>
                <p className="text-xs text-zinc-655 leading-relaxed font-sans text-left">
                  {authorDetails.bio}
                </p>
              </div>

              <div className="space-y-1 text-xs text-zinc-605 bg-zinc-50 border border-zinc-200 p-3 rounded-xs font-mono text-left">
                <div>
                  <span className="font-bold text-zinc-700">Email Contact:</span>{" "}
                  <a href={`mailto:${authorDetails.email}`} className="text-blue-700 hover:underline">
                    {authorDetails.email}
                  </a>
                </div>
                <div>
                  <span className="font-bold text-zinc-700">Gender:</span>{" "}
                  <span className="capitalize">{authorDetails.gender}</span>
                </div>
              </div>

              {/* Social Channels list */}
              <div className="space-y-2 border-t border-zinc-150 pt-4 text-left">
                <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
                  Social Networks
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-zinc-900 text-white text-[10px] px-2.5 py-1.5 rounded-sm hover:bg-zinc-800 transition font-mono cursor-pointer">
                    Twitter/X
                  </span>
                  <span className="bg-zinc-800 text-white text-[10px] px-2.5 py-1.5 rounded-sm hover:bg-zinc-700 transition font-mono cursor-pointer">
                    Medium
                  </span>
                  <span className="bg-amber-700 text-white text-[10px] px-2.5 py-1.5 rounded-sm hover:bg-amber-600 transition font-mono cursor-pointer">
                    Substack
                  </span>
                </div>
              </div>

              {/* Other stories published list */}
              <div className="space-y-3 border-t border-zinc-150 pt-4 text-left">
                <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
                  Published Coverage ({authorArticles.length})
                </h4>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                  {authorArticles.map((art) => (
                    <div
                      key={art._id}
                      className="p-3 bg-zinc-50 border border-zinc-205/60 hover:border-zinc-400 rounded-sm cursor-pointer transition flex justify-between gap-3 items-center group"
                    >
                      <div>
                        <span className="text-[8px] font-extrabold text-red-700 uppercase tracking-wider">
                          {art.category}
                        </span>
                        <h5 className="text-xs font-bold text-zinc-855 group-hover:text-red-700 leading-snug mt-0.5">
                          {art.title}
                        </h5>
                      </div>
                      <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 transition shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-zinc-50 border-t border-zinc-200 py-3 px-6 text-center text-[9px] text-zinc-400 font-mono">
              © {new Date().getFullYear()} Magazine Gazette. Staff Bio Database.
            </div>
          </div>
        </div>
      )}
      {stickyBottomAd && !closedAdIds.includes(stickyBottomAd._id) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end pointer-events-none pb-2 select-none">
          <div className="relative bg-zinc-100/95 border border-zinc-300 p-1.5 shadow-lg rounded-none flex flex-col items-center pointer-events-auto">
            <button 
              onClick={() => {
                const nextClosed = [...closedAdIds, stickyBottomAd._id];
                setClosedAdIds(nextClosed);
                try {
                  localStorage.setItem("domain_closed_ads", JSON.stringify(nextClosed));
                } catch (e) {}
                window.dispatchEvent(new Event("domain_ad_dismissed"));
              }} 
              className="absolute -top-2 -right-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-bold border border-zinc-200 cursor-pointer shadow-md transition"
              title="Close Ad"
            >
              ✕
            </button>
            <span className="text-[8px] text-zinc-400 font-mono tracking-widest uppercase mb-0.5 leading-none">Advertisement</span>
            {(() => {
              const { w, h } = parseAdSize(stickyBottomAd.size, 320, 50);
              return (
                <div className="relative overflow-hidden border border-zinc-200 bg-white" style={{ width: `${w}px`, height: `${h}px` }}>
                  <img src={stickyBottomAd.imageUrl} alt={stickyBottomAd.name} className="w-full h-full object-cover" />
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
