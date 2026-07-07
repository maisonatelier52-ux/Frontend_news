"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import ArticleReader from "./ArticleReader";
import type { Article } from "../data/news";
import OriginalCategoryLayout from "./OriginalCategoryLayout";


interface Comment {
  name: string;
  date: string;
  text: string;
}

const INITIAL_COMMENTS: Record<string, Comment[]> = {
  "1": [
    { name: "Arthur Pendelton, D.C.", date: "June 26, 2026", text: "This bipartisan agreement is long overdue. Upgrading rural grids is critical for agricultural tech integrations." },
    { name: "Sophia Martinez, Chicago", date: "June 26, 2026", text: "Excellent news, but I hope a significant chunk goes toward upgrading locks and dams in the Midwest." }
  ],
  "2": [
    { name: "Gary Reynolds, NY", date: "June 26, 2026", text: "The Fed is playing it safe, which is wise. Inflation is cooling, but retail costs are still quite high." }
  ],
  "3": [
    { name: "Dev_Architect", date: "June 25, 2026", text: "Enterprise custom models are a game changer. We shifted to a local 7B model and saw a massive drop in latency and cost." }
  ],
  "4": [
    { name: "Astro_Girl", date: "June 26, 2026", text: "Every time JWST releases findings like this, it makes me realize how much we have left to discover. Absolutely mind-blowing." }
  ],
  "5": [
    { name: "Marcus Brody, Boston", date: "June 25, 2026", text: "This is a great idea, but city planning regulations and suburban NIMBYism make it incredibly difficult to implement in the US." }
  ],
};

interface CategoryPageExperienceProps {
  decodedCategory: string;
  tagline: string;
  layout: {
    categoryId: string;
    designStyle: string;
    colorTheme: string;
    isVisibleSpotlight: boolean;
    isVisibleSidebar: boolean;
    spotlightStyle?: string;
  };
  articles: Article[];
  trendingArticles: Article[];
  isPreview?: boolean;
}

export default function CategoryPageExperience({
  decodedCategory,
  tagline,
  layout,
  articles,
  trendingArticles,
  isPreview = false
}: CategoryPageExperienceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  // Comments State
  const [comments, setComments] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    if (isPreview) return;
    try {
      const savedBookmarks = localStorage.getItem("domain_bookmarks");
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }

      const savedComments = localStorage.getItem("domain_comments");
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, [isPreview]);

  // Sync bookmarks with localStorage
  const handleToggleBookmark = (id: string) => {
    if (isPreview) return;
    let next: string[];
    if (bookmarkedIds.includes(id)) {
      next = bookmarkedIds.filter((bId) => bId !== id);
    } else {
      next = [...bookmarkedIds, id];
    }
    setBookmarkedIds(next);
    try {
      localStorage.setItem("domain_bookmarks", JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Add Comment handler
  const handleAddComment = (id: string, name: string, text: string) => {
    if (isPreview) return;
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const newComment: Comment = { name, date: formatted, text };
    const updated = {
      ...comments,
      [id]: [newComment, ...(comments[id] || [])],
    };

    setComments(updated);
    try {
      localStorage.setItem("domain_comments", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSubmitted(false), 5000);
  };

  // Navigation router push handler
  const handleCategoryChange = (cat: string) => {
    if (isPreview) return;
    window.location.href = cat === "All" ? "/" : `/${cat}`;
  };

  // Filter Articles for this Category Page
  const filteredArticles = articles.filter((article) => {
    if (showBookmarksOnly && !bookmarkedIds.includes(article.id)) {
      return false;
    }
    if (article.category?.toUpperCase() !== decodedCategory?.toUpperCase()) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchExcerpt = article.excerpt.toLowerCase().includes(q);
      const matchAuthor = article.author.toLowerCase().includes(q);
      return matchTitle || matchExcerpt || matchAuthor;
    }
    return true;
  });

  const getComments = (articleId: string) => {
    return comments[articleId] || [];
  };

  const getCommentsCount = (article: Article) => {
    const list = comments[article.id];
    return list ? list.length : article.commentsCount;
  };

  const articlesWithDynamicStats = filteredArticles.map((art) => ({
    ...art,
    commentsCount: getCommentsCount(art),
  }));

  const selectedArticle = articles.find((a) => a.id === selectedArticleId);
  const activeArticleWithStats = selectedArticle ? {
    ...selectedArticle,
    commentsCount: getCommentsCount(selectedArticle),
  } : null;

  // ─── Data slicing (mirrors real app/[category]/page.tsx exactly) ───────────
  const hasArticles = articlesWithDynamicStats.length > 0;
  const heroArticle = hasArticles ? articlesWithDynamicStats[0] : null;
  const remainingArticles = hasArticles ? articlesWithDynamicStats.slice(1) : [];

  // Spotlight: always slice first 3 of remaining when enabled (same as real page)
  const showSpotlight = layout.isVisibleSpotlight;
  const spotlightArticles = showSpotlight ? remainingArticles.slice(0, 3) : [];

  // Subgrid: starts after spotlight if shown
  const subgridArticles = showSpotlight ? remainingArticles.slice(3) : remainingArticles;

  // Left list: first 7 subgrid articles
  const leftListArticles = subgridArticles.slice(0, 7);
  const extraArticles = subgridArticles.slice(7);
  const hasExtraArticles = extraArticles.length > 0;

  // Sidebar: extra category articles or trending fallback (up to 7)
  const sidebarArticles = (hasExtraArticles ? extraArticles : trendingArticles).slice(0, 7);
  const sidebarTitle = hasExtraArticles ? `More in ${decodedCategory}` : "Trending Coverage";




  const BADGE_COLOR_MAP: Record<string, string> = {
    'indigo': 'text-[#6366f1]',
    'crimson': 'text-rose-650',
    'emerald': 'text-emerald-650',
    'slate': 'text-slate-700',
    'amber': 'text-amber-650',
    'ocean': 'text-sky-650'
  };
  const themeTextColor = BADGE_COLOR_MAP[layout.colorTheme] || 'text-[#6366f1]';

  // Helper to retrieve description text exclusively from the body paragraphs
  const getHeroDescription = (article: any) => {
    let text = article.content?.join(' ') || '';
    const minLength = 800;
    if (text.length < minLength) {
      const padding = " Furthermore, the editorial board emphasizes that these structural developments are part of a broader shift in regional regulatory and economic policies. As analysts continue to dissect the ramifications of this transition, institutional leaders are preparing multi-phase contingency plans to align with updated operational benchmarks. This analysis indicates that long-term strategic adjustments will be necessary to sustain growth across energy, technology, and commerce divisions globally.";
      text = text ? `${text} ${padding}` : padding;
      while (text.length < minLength) {
        text += " Institutional frameworks will be standardized to sustain long-term project viability and support secondary sectors.";
      }
    }
    return text;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Main Editorial Header */}
      <Header
        activeCategory={decodedCategory}
        setActiveCategory={handleCategoryChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarkCount={bookmarkedIds.length}
        showBookmarksOnly={showBookmarksOnly}
        setShowBookmarksOnly={setShowBookmarksOnly}
      />

      {/* Main Content Body */}
      <main className="flex-grow">
        {searchQuery !== "" || showBookmarksOnly ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 select-none">
            <div className="border-b border-zinc-950 pb-2 mb-6 flex justify-between items-end">
              <h2 className="text-xl font-editorial-title font-bold text-zinc-900 uppercase tracking-wide">
                {showBookmarksOnly ? `Bookmarks in ${decodedCategory}` : `Search in ${decodedCategory}: "${searchQuery}"`}
              </h2>
              <span className="text-xs text-zinc-400 font-mono font-semibold">{articlesWithDynamicStats.length} Articles</span>
            </div>

            {articlesWithDynamicStats.length === 0 ? (
              <div className="w-full text-center py-16 px-4">
                <p className="text-sm text-zinc-500 font-medium">No matching articles found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articlesWithDynamicStats.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticleId(article.id)}
                    className="group cursor-pointer border border-zinc-250 p-4 rounded-sm flex flex-col justify-between hover:border-zinc-400 transition animate-fade-in"
                  >
                    <div>
                      <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/9] mb-3 relative">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0"
                        />
                      </div>
                      <div className={`flex items-center gap-2 mb-1.5 text-[10px] ${themeTextColor} font-extrabold uppercase tracking-widest`}>
                        <span>{article.category}</span>
                      </div>
                      <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                      <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                      <span className="font-semibold text-zinc-700">{article.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 select-none animate-fade-in">
            {/* Category Page Title */}
            <div className="border-b border-zinc-200 pb-5 mb-8 flex flex-col justify-start items-start gap-1.5">
              <h1 className="text-3.5xl sm:text-4.5xl font-editorial-title font-extrabold text-zinc-950 uppercase tracking-tight leading-none">
                {decodedCategory}
              </h1>
              <p className="text-sm text-zinc-500 italic font-serif mt-1">
                {tagline}
              </p>
            </div>

            {!hasArticles ? (
              <div className="w-full text-center py-16 px-4">
                <p className="text-sm text-zinc-500 font-medium">No articles published in this category yet.</p>
              </div>
            ) : (
              <>
                {/* Normal visual layout options */}
                {/* Hero Feature Story - Conditional on Selected designStyle */}
                {heroArticle && (() => {
                  // Style 1: Editorial Spotlight Hero (modern-spotlight)
                  if (layout.designStyle === 'modern-spotlight') {
                    // Redelegated to the multi-column top section below — no single giant hero focus
                    return null;
                  }

                      // Style 2: Split Detail + Image Hero (split-timeline)
                      if (layout.designStyle === 'split-timeline') {
                        return (
                          <div
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 cursor-pointer group mb-10 pb-10 border-b border-zinc-200"
                            onClick={() => setSelectedArticleId(heroArticle.id)}
                          >
                            <div className="lg:col-span-6 overflow-hidden relative aspect-[16/10] bg-zinc-100 rounded-sm">
                              <img
                                src={heroArticle.image}
                                alt={heroArticle.title}
                                className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
                              />
                            </div>
                            <div className="lg:col-span-6 flex flex-col justify-between py-1 border-l-2 border-red-650 pl-6 bg-zinc-50/40 p-4 rounded-sm">
                              <div>
                                <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-widest mb-2 block">
                                  Split Detail Cover
                                </span>
                                <h2 className="font-editorial-title text-xl sm:text-3xl font-extrabold text-zinc-900 leading-snug tracking-tight group-hover:text-zinc-750 transition">
                                  {heroArticle.title}
                                </h2>
                                <p className="mt-3 text-xs sm:text-sm text-zinc-550 leading-relaxed font-sans line-clamp-[10]">
                                  {getHeroDescription(heroArticle)}
                                </p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-450 font-sans">
                                <span>By <span className="font-semibold text-zinc-705">{heroArticle.author}</span> &bull; {heroArticle.date}</span>
                                <span className="font-bold">{heroArticle.readTime}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Style 3: Hero Split + Image Hero (magazine-grid)
                      if (layout.designStyle === 'magazine-grid') {
                        return (
                          <div
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12 cursor-pointer group mb-12 pb-12 border-b border-zinc-200/80 items-center"
                            onClick={() => setSelectedArticleId(heroArticle.id)}
                          >
                            {/* Left Text Column (5/12) */}
                            <div className="lg:col-span-5 flex flex-col justify-between h-full py-2">
                              <div>
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="text-[10px] font-mono tracking-widest text-zinc-405 uppercase">
                                    01 / Featured Cover
                                  </span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${themeTextColor}`}>
                                    {decodedCategory}
                                  </span>
                                </div>
                                <h2 className="font-editorial-title text-3xl sm:text-4xl lg:text-4.5xl font-extrabold text-zinc-950 leading-tight tracking-tight group-hover:text-zinc-700 transition duration-300">
                                  {heroArticle.title}
                                </h2>
                                <p className="mt-4 text-xs sm:text-sm text-zinc-500 leading-relaxed font-serif line-clamp-[8]">
                                  {getHeroDescription(heroArticle)}
                                </p>
                              </div>
                              <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                                <span>By <span className="font-semibold text-zinc-700">{heroArticle.author}</span> &bull; {heroArticle.date}</span>
                                <span className="font-bold text-zinc-750 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">{heroArticle.readTime}</span>
                              </div>
                            </div>

                            {/* Right Image Column (7/12) */}
                            <div className="lg:col-span-7 overflow-hidden relative aspect-[4/3] bg-zinc-50 border border-zinc-200/60 rounded-lg shadow-xs group-hover:shadow-md transition-all duration-500">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={heroArticle.image}
                                alt={heroArticle.title}
                                className="w-full h-full object-cover filter brightness-[0.98] group-hover:scale-102 transition duration-700 absolute inset-0"
                              />
                            </div>
                          </div>
                        );
                      }

                      // Style 4: Classic Broadsheet / Wide Banner Hero (classic-broadsheet)
                      if (layout.designStyle === 'classic-broadsheet') {
                        return (
                          <div
                            className="flex flex-col cursor-pointer group mb-10 pb-10 border-b-3 border-zinc-800"
                            onClick={() => setSelectedArticleId(heroArticle.id)}
                          >
                            <div className="w-full aspect-[21/9] min-h-[300px] overflow-hidden relative bg-zinc-100 rounded-sm mb-6">
                              <img
                                src={heroArticle.image}
                                alt={heroArticle.title}
                                className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
                              />
                            </div>
                            <div className="border-t-2 border-b border-zinc-900 py-3 mb-4 text-center">
                              <span className={`text-[10px] ${themeTextColor} font-extrabold uppercase tracking-widest`}>
                                Broadsheet Special Report &bull; {heroArticle.date}
                              </span>
                            </div>
                            <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold text-zinc-900 leading-none text-center tracking-tight group-hover:text-zinc-700 transition">
                              {heroArticle.title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
                              <div className="md:col-span-8">
                                <p className="text-sm text-zinc-600 leading-relaxed font-serif line-clamp-[10]">
                                  {getHeroDescription(heroArticle)}
                                </p>
                              </div>
                              <div className="md:col-span-4 border-l border-zinc-200 pl-6 flex flex-col justify-between py-1">
                                <div className="text-xs text-zinc-505 leading-relaxed">
                                  <strong className="text-zinc-900 block mb-1">Editorial Desk</strong>
                                  This coverage is part of our ongoing commitment to independent journalism and deep-dive policy analytics.
                                </div>
                                <div className="text-[10px] text-zinc-400 font-sans mt-4">
                                  <span>Reporter: <span className="font-bold text-zinc-700">{heroArticle.author}</span></span>
                                  <span className="block mt-1">Reading Duration: {heroArticle.readTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Style 5: Featured Card Box Hero (editorial-masonry)
                      if (layout.designStyle === 'editorial-masonry') {
                        return (
                          <div
                            className="bg-zinc-50/70 border-2 border-zinc-200 rounded-xl p-6 sm:p-8 cursor-pointer group mb-10 hover:shadow-md hover:border-zinc-300 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8"
                            onClick={() => setSelectedArticleId(heroArticle.id)}
                          >
                            <div className="lg:col-span-6 overflow-hidden relative aspect-[4/3] bg-zinc-100 rounded-lg shadow-xs">
                              <img
                                src={heroArticle.image}
                                alt={heroArticle.title}
                                className="w-full h-full object-cover filter brightness-95 group-hover:scale-102 transition duration-500 absolute inset-0"
                              />
                            </div>
                            <div className="lg:col-span-6 flex flex-col justify-between py-1">
                              <div>
                                <span className="text-[10px] bg-[#6366f1] text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3.5 inline-block">
                                  Featured Card Box
                                </span>
                                <h2 className="font-editorial-title text-2xl sm:text-3.5xl font-extrabold text-zinc-900 leading-tight tracking-tight group-hover:text-[#6366f1] transition duration-300">
                                  {heroArticle.title}
                                </h2>
                                <p className="mt-3.5 text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans line-clamp-[12]">
                                  {getHeroDescription(heroArticle)}
                                </p>
                              </div>
                              <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-[10.5px] text-zinc-450 font-sans">
                                <span>By <span className="font-bold text-zinc-750">{heroArticle.author}</span> &bull; {heroArticle.date}</span>
                                <span className="font-semibold text-zinc-750 bg-white border px-2 py-0.5 rounded-md">{heroArticle.readTime}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Style 6: Original Category Page Layout Hero (original)
                      // Rendered entirely by <OriginalCategoryLayout> below — return null here
                      if (layout.designStyle === 'original') {
                        return null;
                      }

                      return null;
                    })()}

                    {/* 1. EDITORIAL SPOTLIGHT / MODERN SPOTLIGHT DESIGN */}
                    {layout.designStyle === 'modern-spotlight' && (() => {
                      const spotlightStyle = layout.spotlightStyle || 'standard';
                      const topCount = 4;
                      const topArticles = articlesWithDynamicStats.slice(0, topCount);
                      const listArticles = articlesWithDynamicStats.slice(topCount);

                      // For sidebar:
                      const finalSidebarArticles = trendingArticles.slice(0, 7);
                      const finalSidebarTitle = "Trending Coverage";

                      return (
                        <>
                          {/* Top Section: Balanced News Layout without Main Hero Focus */}
                          {layout.isVisibleSpotlight && topArticles.length > 0 && (
                            <div className="mb-12 border-b border-zinc-200 pb-10 select-none animate-fade-in">
                              
                              {/* Dynamic Spotlight Header */}
                              <div className="mb-6 flex items-center justify-between">
                                {spotlightStyle === 'minimal' ? (
                                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 font-sans border-b-2 border-zinc-900 pb-1.5 w-full text-left">
                                    {decodedCategory} Broadsheet Column Digest
                                  </h3>
                                ) : spotlightStyle === 'premium' ? (
                                  <h3 className={`text-xs font-extrabold uppercase tracking-widest ${themeTextColor} flex items-center gap-2 font-sans`}>
                                    <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                                    {decodedCategory} Premium Spotlight Grid
                                  </h3>
                                ) : (
                                  <h3 className={`text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 font-sans ${themeTextColor}`}>
                                    ✦ {decodedCategory.toUpperCase()} EDITORIAL SPOTLIGHT
                                  </h3>
                                )}
                              </div>

                              {/* Grid rendering based on spotlightStyle */}
                              {spotlightStyle === 'standard' && topArticles.length >= 3 && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                  {/* Left Feature Column (7/12) */}
                                  <div 
                                    onClick={() => setSelectedArticleId(topArticles[0].id)}
                                    className="lg:col-span-7 flex flex-col justify-between group cursor-pointer border-b lg:border-b-0 lg:border-r border-zinc-200 pb-6 lg:pb-0 lg:pr-8"
                                  >
                                    <div>
                                      <div className="overflow-hidden rounded-sm aspect-[16/10] mb-4 bg-zinc-100 border border-zinc-150 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={topArticles[0].image}
                                          alt={topArticles[0].title}
                                          className="w-full h-full object-cover filter brightness-95 group-hover:scale-102 transition duration-500 absolute inset-0"
                                        />
                                      </div>
                                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${themeTextColor} mb-2 block`}>
                                        {topArticles[0].category} &bull; Editorial Choice
                                      </span>
                                      <h4 className="font-editorial-title text-xl sm:text-2xl font-extrabold text-zinc-955 leading-snug group-hover:text-zinc-650 transition">
                                        {topArticles[0].title}
                                      </h4>
                                      <p className="text-xs text-zinc-650 mt-2.5 line-clamp-3 leading-relaxed font-sans">
                                        {topArticles[0].excerpt}
                                      </p>
                                    </div>
                                    <div className="text-[10px] text-zinc-400 mt-4 font-sans flex justify-between items-center border-t border-zinc-100 pt-3">
                                      <span>By <span className="font-semibold text-zinc-600">{topArticles[0].author}</span></span>
                                      <span>{topArticles[0].readTime}</span>
                                    </div>
                                  </div>

                                  {/* Right Side Stack (5/12) */}
                                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                    {topArticles.slice(1, 4).map((article, idx, arr) => (
                                      <div
                                        key={article.id}
                                        onClick={() => setSelectedArticleId(article.id)}
                                        className={`group cursor-pointer flex flex-col justify-between flex-1 ${idx < arr.length - 1 ? 'border-b border-zinc-150 pb-3' : ''}`}
                                      >
                                        <div className="flex gap-4">
                                          <div className="flex-1 min-w-0">
                                            <span className={`text-[9px] font-extrabold uppercase tracking-wider ${themeTextColor} mb-1 block`}>
                                              {article.category}
                                            </span>
                                            <h5 className="font-editorial-title text-sm sm:text-base font-bold text-zinc-955 leading-snug group-hover:text-zinc-650 transition">
                                              {article.title}
                                            </h5>
                                            <p className="text-[11px] text-zinc-500 mt-1 line-clamp-4 leading-relaxed font-sans">
                                              {article.excerpt}
                                            </p>
                                          </div>
                                          <div className="w-20 sm:w-24 overflow-hidden rounded-sm aspect-[4/3] bg-zinc-100 border border-zinc-150 flex-shrink-0 relative self-start">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                              src={article.image}
                                              alt={article.title}
                                              className="w-full h-full object-cover filter brightness-95 group-hover:scale-102 transition duration-300 absolute inset-0"
                                            />
                                          </div>
                                        </div>
                                        <div className="text-[10px] text-zinc-405 mt-3 font-sans flex justify-between items-center">
                                          <span>By <span className="font-semibold text-zinc-600">{article.author}</span></span>
                                          <span>{article.readTime}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {spotlightStyle === 'standard' && topArticles.length < 3 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                                  {topArticles.map((article, idx) => (
                                    <div
                                      key={article.id}
                                      onClick={() => setSelectedArticleId(article.id)}
                                      className={`group cursor-pointer flex flex-col justify-between ${idx > 0 ? 'md:pl-6' : ''} ${idx < topArticles.length - 1 ? 'md:pr-6 pb-6 md:pb-0' : ''}`}
                                    >
                                      <div>
                                        <div className="overflow-hidden rounded-sm aspect-[16/10] mb-4 bg-zinc-100 border border-zinc-150 relative">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover filter brightness-95 group-hover:scale-102 transition duration-300 absolute inset-0"
                                          />
                                        </div>
                                        <span className={`text-[9px] font-extrabold uppercase tracking-wider ${themeTextColor} mb-1.5 block`}>
                                          {article.category}
                                        </span>
                                        <h4 className="font-editorial-title text-lg font-bold text-zinc-950 leading-snug group-hover:text-zinc-650 transition">
                                          {article.title}
                                        </h4>
                                        <p className="text-xs text-zinc-600 mt-2.5 line-clamp-3 leading-relaxed font-sans">
                                          {article.excerpt}
                                        </p>
                                      </div>
                                      <div className="text-[10px] text-zinc-400 mt-4 font-sans flex justify-between items-center border-t border-zinc-100 pt-2">
                                        <span>By <span className="font-semibold text-zinc-600">{article.author}</span></span>
                                        <span>{article.readTime}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {spotlightStyle === 'minimal' && (
                                <div className="bg-[#fafaf9] border border-zinc-200/80 p-6 rounded-md shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/80">
                                  {topArticles.map((article, idx) => {
                                    const romanNumerals = ["I", "II", "III", "IV"];
                                    return (
                                      <div
                                        key={article.id}
                                        onClick={() => setSelectedArticleId(article.id)}
                                        className={`group cursor-pointer flex flex-col justify-between pt-4 sm:pt-0 ${idx > 0 ? 'sm:pl-6' : ''} ${idx < topArticles.length - 1 ? 'sm:pr-2' : ''}`}
                                      >
                                        <div>
                                          <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5 mb-3.5">
                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${themeTextColor}`}>
                                              Section {romanNumerals[idx] || (idx + 1)}
                                            </span>
                                            <span className="text-[9px] text-zinc-400 font-mono">{article.readTime}</span>
                                          </div>
                                          <h4 className="font-editorial-title text-base font-extrabold text-zinc-950 leading-snug group-hover:text-zinc-600 transition duration-200">
                                            {article.title}
                                          </h4>
                                          <p className="text-[11.5px] text-zinc-550 mt-2.5 line-clamp-6 leading-relaxed font-serif">
                                            {article.excerpt}
                                          </p>
                                        </div>
                                        <div className="text-[9px] text-zinc-450 mt-5 pt-2 border-t border-zinc-100 font-mono uppercase tracking-wider">
                                          By {article.author}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {spotlightStyle === 'premium' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {topArticles.map((article) => (
                                    <div
                                      key={article.id}
                                      onClick={() => setSelectedArticleId(article.id)}
                                      className="group cursor-pointer bg-white hover:bg-zinc-50/40 border border-zinc-200/80 p-5 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                                    >
                                      <div className="flex gap-5">
                                        <div className="flex-1 min-w-0">
                                          <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${layout.colorTheme === 'indigo' ? 'bg-[#6366f1]/10 text-[#6366f1]' : layout.colorTheme === 'crimson' ? 'bg-rose-100 text-rose-700' : layout.colorTheme === 'emerald' ? 'bg-emerald-100 text-emerald-700' : layout.colorTheme === 'slate' ? 'bg-slate-100 text-slate-700' : layout.colorTheme === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'} mb-2.5`}>
                                            {article.category}
                                          </span>
                                          <h4 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-950 leading-snug group-hover:text-zinc-700 transition">
                                            {article.title}
                                          </h4>
                                          <p className="text-xs text-zinc-500 mt-2 line-clamp-3 leading-relaxed font-sans">
                                            {article.excerpt}
                                          </p>
                                        </div>
                                        <div className="w-24 sm:w-28 overflow-hidden rounded-lg aspect-square bg-zinc-100 border border-zinc-150 flex-shrink-0 relative self-start">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition duration-505 absolute inset-0"
                                          />
                                        </div>
                                      </div>
                                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                                        <span>By <span className="text-zinc-650 font-semibold">{article.author}</span></span>
                                        <div className="flex items-center gap-2.5">
                                          <span>💬 {article.commentsCount || 0}</span>
                                          <span className="font-semibold text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-md">{article.readTime}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                            </div>
                          )}

                          {/* Remaining Articles List + Sidebar */}
                          {listArticles.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start animate-fade-in">
                              <div className={layout.isVisibleSidebar ? "lg:col-span-8" : "lg:col-span-12"}>
                                <div className={`grid grid-cols-1 ${layout.isVisibleSidebar ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
                                  {listArticles.map((article) => (
                                    <div
                                      key={article.id}
                                      onClick={() => setSelectedArticleId(article.id)}
                                      className="group cursor-pointer bg-white border border-zinc-200/80 p-4 rounded-xl shadow-xs hover:shadow-md hover:border-zinc-350 transition-all duration-300 flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="overflow-hidden rounded-lg aspect-[16/10] mb-3.5 bg-zinc-50 border border-zinc-100 relative">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover brightness-95 group-hover:scale-102 transition duration-500 absolute inset-0"
                                          />
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className={`text-[9px] font-extrabold uppercase tracking-widest ${themeTextColor}`}>
                                            {article.category}
                                          </span>
                                          <span className="text-[10px] text-zinc-300">•</span>
                                          <span className="text-[9.5px] text-zinc-400 font-sans">{article.date}</span>
                                        </div>
                                        <h3 className="font-editorial-title text-base font-bold text-zinc-950 leading-snug group-hover:text-zinc-650 transition-colors duration-200">
                                          {article.title}
                                        </h3>
                                        <p className="mt-2 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                                          {article.excerpt}
                                        </p>
                                      </div>
                                      <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                                        <span>By <span className="font-semibold text-zinc-600">{article.author}</span></span>
                                        <div className="flex items-center gap-2">
                                          <span>💬 {article.commentsCount || 0}</span>
                                          <span className="font-semibold text-zinc-650">{article.readTime}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {layout.isVisibleSidebar && (
                                <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-8 lg:sticky lg:top-6 lg:self-start">
                                  <div className="border-b border-zinc-200 pb-1.5 mb-4">
                                    <h3 className={`text-xs font-bold uppercase tracking-wider ${themeTextColor}`}>{finalSidebarTitle}</h3>
                                  </div>
                                  <div className="divide-y divide-zinc-100">
                                    {finalSidebarArticles.map((article) => (
                                      <div key={article.id} onClick={() => setSelectedArticleId(article.id)} className="group cursor-pointer py-3 first:pt-0">
                                        <h4 className="font-editorial-title text-sm font-bold text-zinc-900 group-hover:text-[#6366f1] transition leading-snug">{article.title}</h4>
                                        <div className="mt-1 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                                          <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                                          <span className="font-semibold text-zinc-700">{article.readTime}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                        </>
                      );
                    })()}

                    {/* 2. SPLIT TIMELINE: 7/12 timeline stream + 5/12 featured items */}
                    {layout.designStyle === 'split-timeline' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start border-t border-zinc-200 pt-6">
                        <div className={layout.isVisibleSidebar ? "lg:col-span-7 space-y-4" : "lg:col-span-12 space-y-4"}>
                          <div className="border-b border-zinc-200 pb-1.5">
                            <h3 className={`text-xs font-bold uppercase tracking-wider ${themeTextColor} flex items-center gap-1.5`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-ping" />
                              Category Live Feed
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {leftListArticles.map((article) => (
                              <div
                                key={article.id}
                                onClick={() => setSelectedArticleId(article.id)}
                                className="group cursor-pointer border-l-2 border-zinc-200 hover:border-zinc-800 pl-4 py-2 hover:bg-zinc-50/50 rounded transition-all duration-200 flex gap-4 justify-between"
                              >
                                <div className="flex-1 min-w-0">
                                  <span className="text-[9.5px] text-red-600 font-bold tracking-widest uppercase block mb-0.5">UPDATE &bull; {article.readTime}</span>
                                  <h4 className="font-editorial-title text-sm sm:text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">{article.title}</h4>
                                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                                </div>
                                <div className="w-16 h-12 bg-zinc-100 rounded flex-shrink-0 overflow-hidden relative">
                                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {layout.isVisibleSidebar && (
                          <div className="lg:col-span-5 lg:border-l lg:border-zinc-200 lg:pl-6 space-y-4 lg:sticky lg:top-6 lg:self-start">
                            <div className="border-b border-zinc-200 pb-1.5">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Spotlight Cover</h3>
                            </div>
                            <div className="space-y-6">
                              {sidebarArticles.map((article) => (
                                <div
                                  key={article.id}
                                  onClick={() => setSelectedArticleId(article.id)}
                                  className="group cursor-pointer flex flex-col justify-between py-2 border-b border-zinc-200 last:border-0 first:pt-0"
                                >
                                  <div>
                                    <div className="overflow-hidden rounded aspect-[16/9] mb-3.5 relative bg-zinc-100">
                                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-101 transition duration-300 absolute inset-0" />
                                    </div>
                                    <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-[#6366f1] transition leading-snug">{article.title}</h3>
                                    <p className="text-xs text-zinc-650 mt-1.5 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                                  </div>
                                  <span className="text-[10px] text-zinc-400 mt-3 font-sans block">{article.author} &bull; {article.readTime}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. MAGAZINE GRID: Bold editorial split + curated stream */}
                    {layout.designStyle === 'magazine-grid' && (() => {
                      const remainingCategoryArticles = articlesWithDynamicStats.slice(1);
                      const heroCard = remainingCategoryArticles[0];
                      const stackCards = remainingCategoryArticles.slice(1, 5);
                      const streamCards = remainingCategoryArticles.slice(5);

                      return (
                        <div className="space-y-0 border-t-2 border-zinc-900 pt-8 animate-fade-in select-none">
                          {/* Section label */}
                          <div className="flex items-center justify-between mb-8">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] ${themeTextColor}`}>✦ Hero Split + Coverage</h3>
                            <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest">{decodedCategory}</span>
                          </div>

                          {/* Main split: big hero left + stacked right */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                            {/* Left: Big Hero */}
                            {heroCard && (
                              <div
                                onClick={() => setSelectedArticleId(heroCard.id)}
                                className="lg:col-span-7 group cursor-pointer relative overflow-hidden min-h-[420px] bg-zinc-900"
                              >
                                <img
                                  src={heroCard.image}
                                  alt={heroCard.title}
                                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-103 transition-all duration-700"
                                />
                                {/* Dark gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-7">
                                  <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded mb-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white`}>
                                    {heroCard.category}
                                  </span>
                                  <h2 className="font-editorial-title text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug group-hover:text-zinc-100 transition mb-3">
                                    {heroCard.title}
                                  </h2>
                                  <p className="text-sm text-white/75 leading-relaxed line-clamp-3 font-sans">
                                    {heroCard.excerpt}
                                  </p>
                                  <div className="mt-4 flex items-center gap-3 text-[10px] text-white/55 font-mono uppercase tracking-wider">
                                    <span>By {heroCard.author}</span>
                                    <span>&bull;</span>
                                    <span>{heroCard.readTime}</span>
                                    <span>&bull;</span>
                                    <span>{heroCard.date}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Right: 2x2 stacked cards */}
                            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 divide-y divide-zinc-100 bg-white">
                              {stackCards.map((article) => (
                                <div
                                  key={article.id}
                                  onClick={() => setSelectedArticleId(article.id)}
                                  className="group cursor-pointer flex gap-4 p-5 hover:bg-zinc-50 transition-colors duration-200"
                                >
                                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg relative bg-zinc-100">
                                    <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <span className={`text-[8px] font-black uppercase tracking-widest ${themeTextColor}`}>{article.category}</span>
                                      <span className="text-zinc-300 text-[10px]">&bull;</span>
                                      <span className="text-[8.5px] text-zinc-400">{article.date}</span>
                                    </div>
                                    <h4 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug group-hover:text-zinc-650 transition line-clamp-2">{article.title}</h4>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 line-clamp-2 font-sans">{article.excerpt}</p>
                                    <span className="text-[9px] text-zinc-400 font-mono mt-1.5 block">{article.author} &bull; {article.readTime}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Below: Full-width horizontal stream list */}
                          {streamCards.length > 0 && (
                            <div className="mt-10 pt-8 border-t border-zinc-200">
                              <div className="flex items-center gap-3 mb-6">
                                <h4 className={`text-[10px] font-black uppercase tracking-widest ${themeTextColor}`}>More Coverage</h4>
                                <div className="flex-1 h-px bg-zinc-200" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {streamCards.map((article) => (
                                  <div
                                    key={article.id}
                                    onClick={() => setSelectedArticleId(article.id)}
                                    className="group cursor-pointer flex gap-4 items-start py-3 border-b border-zinc-100 hover:border-zinc-300 transition-colors duration-200"
                                  >
                                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded relative bg-zinc-100">
                                      <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className={`text-[8px] font-black uppercase tracking-widest ${themeTextColor} block mb-0.5`}>{article.category}</span>
                                      <h4 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug group-hover:text-zinc-650 transition line-clamp-2">{article.title}</h4>
                                      <span className="text-[9px] text-zinc-400 font-mono mt-1 block">{article.author} &bull; {article.readTime}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* 4. CLASSIC BROADSHEET: Premium Minimalist Editorial Broadsheet */}
                    {layout.designStyle === 'classic-broadsheet' && (() => {
                      const remainingArticles = articlesWithDynamicStats.slice(1);
                      const leadArticle = remainingArticles[0];
                      const secondaryArticles = remainingArticles.slice(1, 4);
                      const bottomArticles = remainingArticles.slice(4);

                      return (
                        <div className="space-y-12 pt-6 animate-fade-in select-none">
                          {/* Elegant Thin Top Header */}
                          <div className="border-y border-zinc-200 py-3 flex justify-between items-center text-xs tracking-[0.2em] font-medium text-zinc-500 uppercase">
                            <span>{decodedCategory} Chronicle</span>
                            <span>Est. 2026</span>
                            <span>Volume IV</span>
                          </div>

                          {/* Split layout: Asymmetric 2-column structure with zero box containers */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Left: Lead Article Column (col-span-8) */}
                            {leadArticle && (
                              <div
                                onClick={() => setSelectedArticleId(leadArticle.id)}
                                className="lg:col-span-8 group cursor-pointer space-y-5"
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${themeTextColor}`}>
                                      Lead Feature
                                    </span>
                                    <span className="text-zinc-350 text-xs">&bull;</span>
                                    <span className="text-[10px] text-zinc-400 font-mono tracking-wider">{leadArticle.date}</span>
                                  </div>
                                  <h2 className="font-editorial-title text-2.5xl sm:text-3.5xl lg:text-4xl font-extrabold text-zinc-955 leading-tight group-hover:text-zinc-700 transition">
                                    {leadArticle.title}
                                  </h2>
                                </div>

                                <div className="overflow-hidden rounded-md bg-zinc-50 aspect-[21/9]">
                                  <img 
                                    src={leadArticle.image} 
                                    alt={leadArticle.title} 
                                    className="w-full h-full object-cover filter brightness-[0.98] group-hover:scale-101 transition duration-700"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
                                  <div className="sm:col-span-4 border-l-2 border-zinc-900 pl-4 py-1">
                                    <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 leading-none">Author Profile</p>
                                    <p className="text-xs font-bold text-zinc-800 mt-2">{leadArticle.author}</p>
                                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">{leadArticle.readTime}</p>
                                  </div>
                                  <div className="sm:col-span-8">
                                    <p className="text-sm text-zinc-650 leading-relaxed font-serif first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                                      {leadArticle.content?.[0] || leadArticle.excerpt}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Right: Secondary Articles Stack (col-span-4) */}
                            <div className="lg:col-span-4 space-y-8 divide-y divide-zinc-200/85 lg:pl-6 lg:border-l lg:border-zinc-200">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 pb-1">
                                Category Context
                              </h4>
                              
                              {secondaryArticles.map((article, index) => (
                                <div
                                  key={article.id}
                                  onClick={() => setSelectedArticleId(article.id)}
                                  className={`group cursor-pointer pt-6 first:pt-0 ${index > 0 ? 'border-t border-zinc-100' : ''} space-y-3`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-405">0{index + 1}</span>
                                    <span className="text-zinc-300 text-xs">&bull;</span>
                                    <span className="text-[9px] font-mono text-zinc-450 tracking-wider">{article.date}</span>
                                  </div>
                                  <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-955 leading-snug group-hover:text-zinc-700 transition">
                                    {article.title}
                                  </h3>
                                  <p className="text-xs text-zinc-550 leading-relaxed line-clamp-3 font-sans">
                                    {article.excerpt}
                                  </p>
                                  <div className="flex justify-between items-center text-[9px] text-zinc-400 font-mono tracking-wider pt-1">
                                    <span>BY {article.author.toUpperCase()}</span>
                                    <span>{article.readTime}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Divider Line */}
                          <div className="h-px bg-zinc-200" />

                          {/* Bottom Row: In Brief Horizontal Stream */}
                          {bottomArticles.length > 0 && (
                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] ${themeTextColor}`}>
                                  Editorial Dispatch
                                </h3>
                                <div className="flex-1 h-px bg-zinc-150" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                                {bottomArticles.slice(0, 3).map((article, idx) => (
                                  <div
                                    key={article.id}
                                    onClick={() => setSelectedArticleId(article.id)}
                                    className={`group cursor-pointer pt-4 md:pt-0 ${idx > 0 ? 'md:pl-6' : ''} flex flex-col justify-between`}
                                  >
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between text-[9px] text-zinc-400 font-mono tracking-wider">
                                        <span>REPORT {idx + 1}</span>
                                        <span>{article.readTime}</span>
                                      </div>
                                      <h4 className="font-editorial-title text-base font-bold text-zinc-950 leading-snug group-hover:text-zinc-650 transition">
                                        {article.title}
                                      </h4>
                                      <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed font-sans">
                                        {article.excerpt}
                                      </p>
                                    </div>
                                    <div className="mt-4 pt-2 border-t border-zinc-100 flex items-center justify-between text-[9px] text-zinc-400 font-mono">
                                      <span>By {article.author}</span>
                                      <span>{article.date}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* 5. EDITORIAL MASONRY ROW: asymmetrical columns */}
                    {layout.designStyle === 'editorial-masonry' && (() => {
                      const remainingCategoryArticles = articlesWithDynamicStats.slice(1);
                      const gridArticles = remainingCategoryArticles;
                      
                      const chunks: any[] = [];
                      for (let i = 0; i < gridArticles.length; i += 3) {
                        chunks.push(gridArticles.slice(i, i + 3));
                      }
                      
                      const sidebarArticles = trendingArticles.slice(0, 7);
                      const sidebarTitle = "Trending Coverage";

                      return (
                        <div className="space-y-8 border-t border-zinc-200 pt-6 animate-fade-in select-none">
                          <div className="border-b border-zinc-900 pb-2">
                            <h3 className={`text-xs font-bold uppercase tracking-widest ${themeTextColor}`}>Editorial Masonry Rows</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Part: Stacked chunks of repeating 2x1 grid patterns */}
                            <div className="lg:col-span-8 space-y-8">
                              {chunks.map((chunk, chunkIdx) => {
                                const isSingle = chunk.length === 1;
                                const isDouble = chunk.length === 2;
                                
                                if (isSingle) {
                                  const article = chunk[0];
                                  return (
                                    <div key={chunkIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div 
                                        onClick={() => setSelectedArticleId(article.id)} 
                                        className="md:col-span-2 group cursor-pointer bg-white border border-zinc-200/80 p-5 rounded-xl hover:shadow-md hover:border-zinc-300 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                                      >
                                        <div className="md:col-span-7 aspect-[16/10] overflow-hidden rounded-lg relative bg-zinc-55 border border-zinc-200/50 shadow-2xs group-hover:shadow transition duration-500">
                                          <img src={article.image} alt={article.title} className="w-full h-full object-cover filter brightness-95 group-hover:scale-102 transition duration-700 absolute inset-0" />
                                        </div>
                                        <div className="md:col-span-5 flex flex-col justify-between h-full py-1">
                                          <div>
                                            <div className="flex items-center gap-1.5 mb-2">
                                              <span className={`text-[8.5px] font-extrabold uppercase tracking-widest ${themeTextColor}`}>
                                                {article.category}
                                              </span>
                                              <span className="text-[10px] text-zinc-300">&bull;</span>
                                              <span className="text-[9px] text-zinc-400 font-sans">{article.date}</span>
                                            </div>
                                            <h4 className="font-editorial-title text-base sm:text-lg lg:text-xl font-bold text-zinc-950 leading-snug group-hover:text-zinc-650 transition">{article.title}</h4>
                                            <p className="text-xs text-zinc-500 leading-relaxed font-sans line-clamp-4 mt-2">{article.excerpt}</p>
                                          </div>
                                          <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                                            <span>By <span className="font-semibold text-zinc-600">{article.author}</span></span>
                                            <span className="font-semibold text-zinc-605">{article.readTime}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                
                                if (isDouble) {
                                  return (
                                    <div key={chunkIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {chunk.map((article: any) => (
                                        <div 
                                          key={article.id} 
                                          onClick={() => setSelectedArticleId(article.id)} 
                                          className="group cursor-pointer bg-white border border-zinc-200/80 p-5 rounded-xl hover:shadow-md hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between h-full"
                                        >
                                          <div>
                                            <div className="w-full aspect-[16/10] overflow-hidden rounded-lg relative mb-4 bg-zinc-55 border border-zinc-200/50 shadow-2xs group-hover:shadow transition duration-500">
                                              <img src={article.image} alt={article.title} className="w-full h-full object-cover filter brightness-95 group-hover:scale-102 transition duration-700 absolute inset-0" />
                                            </div>
                                            <div className="flex items-center gap-1.5 mb-2">
                                              <span className={`text-[8.5px] font-extrabold uppercase tracking-widest ${themeTextColor}`}>
                                                {article.category}
                                              </span>
                                              <span className="text-[10px] text-zinc-300">&bull;</span>
                                              <span className="text-[9px] text-zinc-400 font-sans">{article.date}</span>
                                            </div>
                                            <h4 className="font-editorial-title text-sm sm:text-base font-bold text-zinc-955 leading-snug group-hover:text-zinc-650 transition">{article.title}</h4>
                                            <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed font-sans">{article.excerpt}</p>
                                          </div>
                                          <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                                            <span>By <span className="font-semibold text-zinc-600">{article.author}</span></span>
                                            <span className="font-semibold text-zinc-605">{article.readTime}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                
                                const smallCards = chunk.slice(0, 2);
                                const bigCard = chunk[2];
                                
                                return (
                                  <div key={chunkIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                    {/* 2 small cards stacked on the left */}
                                    <div className="space-y-6 flex flex-col justify-between">
                                      {smallCards.map((article: any) => (
                                        <div 
                                          key={article.id} 
                                          onClick={() => setSelectedArticleId(article.id)} 
                                          className="group cursor-pointer bg-white border-zinc-200/80 p-5 rounded-xl hover:shadow-md hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between h-full"
                                        >
                                          <div>
                                            <div className="w-full aspect-[16/10] overflow-hidden rounded-lg relative mb-4 bg-zinc-55 border border-zinc-200/50 shadow-2xs group-hover:shadow transition duration-500">
                                              <img src={article.image} alt={article.title} className="w-full h-full object-cover filter brightness-95 group-hover:scale-102 transition duration-700 absolute inset-0" />
                                            </div>
                                            <div className="flex items-center gap-1.5 mb-2">
                                              <span className={`text-[8.5px] font-extrabold uppercase tracking-widest ${themeTextColor}`}>
                                                {article.category}
                                              </span>
                                              <span className="text-[10px] text-zinc-300">&bull;</span>
                                              <span className="text-[9px] text-zinc-400 font-sans">{article.date}</span>
                                            </div>
                                            <h4 className="font-editorial-title text-sm sm:text-base font-bold text-zinc-955 leading-snug group-hover:text-zinc-655 transition">{article.title}</h4>
                                            <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed font-sans">{article.excerpt}</p>
                                          </div>
                                          <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                                            <span>By <span className="font-semibold text-zinc-600">{article.author}</span></span>
                                            <span className="font-semibold text-zinc-605">{article.readTime}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {/* 1 big card on the right */}
                                    <div>
                                      <div 
                                        onClick={() => setSelectedArticleId(bigCard.id)} 
                                        className="group cursor-pointer bg-white border-zinc-200/80 p-5 rounded-xl hover:shadow-md hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between h-full"
                                      >
                                        <div>
                                          <div className="w-full aspect-[4/5] overflow-hidden rounded-lg relative mb-4 bg-zinc-55 border border-zinc-200/50 shadow-2xs group-hover:shadow transition duration-500">
                                            <img src={bigCard.image} alt={bigCard.title} className="w-full h-full object-cover filter brightness-[0.98] group-hover:scale-102 transition duration-700 absolute inset-0" />
                                          </div>
                                          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${themeTextColor} mb-2 block`}>Featured Highlight</span>
                                          <h4 className="font-editorial-title text-base sm:text-lg lg:text-xl font-bold text-zinc-955 leading-snug group-hover:text-zinc-650 transition">{bigCard.title}</h4>
                                          <p className="text-sm text-zinc-600 leading-relaxed font-sans line-clamp-[10] mt-2">{bigCard.content?.[0] || bigCard.excerpt}</p>
                                        </div>
                                        <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                                          <span>By <span className="font-semibold text-zinc-600">{bigCard.author}</span></span>
                                          <span className="font-semibold text-zinc-605">{bigCard.readTime}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Right Part: Sticky Sidebar */}
                            <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-8 flex flex-col lg:sticky lg:top-6 lg:self-start">
                              <div className="border-b border-zinc-200 pb-2 mb-4">
                                <h4 className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                                  {sidebarTitle}
                                </h4>
                              </div>
                              <div className="divide-y divide-zinc-100">
                                {sidebarArticles.map((article) => (
                                  <div key={article.id} onClick={() => setSelectedArticleId(article.id)} className="group cursor-pointer py-4 first:pt-0">
                                    <h4 className="font-editorial-title text-sm font-bold text-zinc-955 group-hover:text-[#6366f1] transition leading-snug">
                                      {article.title}
                                    </h4>
                                    <div className="mt-2 flex justify-between items-center text-[10px] text-zinc-450 font-sans">
                                      <span>By <span className="font-semibold text-zinc-555">{article.author}</span></span>
                                      <span>{article.readTime}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                             </div>
                           </div>
                         </div>
                      );
                    })()}

                    {/* 6. ORIGINAL LAYOUT — shared component, exact match to real category page */}
                    {layout.designStyle === 'original' && (
                      <OriginalCategoryLayout
                        decodedCategory={decodedCategory}
                        heroArticle={heroArticle}
                        spotlightArticles={spotlightArticles}
                        leftListArticles={leftListArticles}
                        sidebarArticles={sidebarArticles}
                        sidebarTitle={sidebarTitle}
                        isVisibleSidebar={layout.isVisibleSidebar}
                        isVisibleSpotlight={layout.isVisibleSpotlight}
                        onArticleClick={(id) => setSelectedArticleId(id)}
                      />
                    )}
                  </>
                )}
              </div>
            )}
      </main>

      {/* Newsletter signup section */}
      <section className="bg-zinc-50 border-t border-zinc-250 py-10 px-4 select-none">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="font-editorial-title text-xl sm:text-2xl font-bold text-zinc-900">
            Subscribe to The Domain Name
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            Join 240,000+ readers. Get curated briefs, breaking news alerts, and deep-dive investigations sent directly to your inbox every morning.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-white border border-zinc-250 px-4 py-2 text-xs rounded-sm w-full focus:border-zinc-500"
              required
            />
            <button
              type="submit"
              className="bg-zinc-950 text-white text-xs font-bold py-2.5 px-6 rounded-sm hover:bg-zinc-800 transition cursor-pointer flex-shrink-0"
            >
              Sign Up
            </button>
          </form>

          {newsletterSubmitted && (
            <p className="text-xs font-semibold text-emerald-650 animate-pulse">
              ✓ Subscribed successfully! Welcome to the Dom.
            </p>
          )}
        </div>
      </section>

      {/* Main Editorial Footer */}
      <footer className="bg-white border-t border-zinc-300 py-10 px-4 sm:px-6 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="font-editorial-title text-lg font-extrabold text-zinc-900 tracking-tight">
              The Domain Name
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
              An independent, employee-owned publication covering national policy, international affairs, global markets, technology, and arts. Headquartered in Washington, D.C.
            </p>
          </div>

          <div>
            <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-3.5">
              Categories
            </h5>
            <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-650 font-medium">
              <li>
                <button onClick={() => { handleCategoryChange("US"); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  U.S. News & Politics
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Finance"); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Finance & Markets
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Technology"); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Technology & Science
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("World"); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  World Affairs
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Marketing"); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Marketing & Strategy
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Entertainment"); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Arts & Entertainment
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-3.5">
              Other Sections
            </h5>
            <ul className="space-y-2 text-xs text-zinc-650 font-medium">
              <li>
                <button onClick={() => { handleCategoryChange("PR News"); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Press Releases & News
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-zinc-400 font-mono">
          <div>
            © {new Date().getFullYear()} The Domain Name. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span>•</span>
            <span className="cursor-pointer hover:underline">Terms of Service</span>
            <span>•</span>
            <span className="cursor-pointer hover:underline">Ethics Guidelines</span>
          </div>
        </div>
      </footer>

      {/* Immersive Article Reader Drawer */}
      {activeArticleWithStats && (
        <ArticleReader
          article={activeArticleWithStats}
          onClose={() => setSelectedArticleId(null)}
          isBookmarked={bookmarkedIds.includes(activeArticleWithStats.id)}
          onToggleBookmark={handleToggleBookmark}
          comments={getComments(activeArticleWithStats.id)}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}
