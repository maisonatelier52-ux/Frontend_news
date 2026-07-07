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
                        return (
                          <div
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 cursor-pointer group mb-10 pb-10 border-b border-zinc-200"
                            onClick={() => setSelectedArticleId(heroArticle.id)}
                          >
                            <div className="lg:col-span-8 overflow-hidden relative aspect-[16/9] bg-zinc-100 rounded-sm">
                              <img
                                src={heroArticle.image}
                                alt={heroArticle.title}
                                className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
                              />
                            </div>
                            <div className="lg:col-span-4 flex flex-col justify-between py-1 border-l-3 border-[#6366f1] pl-6">
                              <div>
                                <span className={`text-[10px] ${themeTextColor} font-extrabold uppercase tracking-widest mb-2 block`}>
                                  Editorial Spotlight
                                </span>
                                <h2 className="font-editorial-title text-xl sm:text-2.5xl font-extrabold text-zinc-900 leading-snug tracking-tight group-hover:text-zinc-700 transition">
                                  {heroArticle.title}
                                </h2>
                                <p className="mt-3 text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans line-clamp-[11]">
                                  {getHeroDescription(heroArticle)}
                                </p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                                <span>By <span className="font-semibold text-zinc-700">{heroArticle.author}</span></span>
                                <span>{heroArticle.readTime}</span>
                              </div>
                            </div>
                          </div>
                        );
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
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 cursor-pointer group mb-10 pb-10 border-b border-zinc-200"
                            onClick={() => setSelectedArticleId(heroArticle.id)}
                          >
                            <div className="lg:col-span-7 overflow-hidden relative aspect-[16/10] bg-zinc-100 rounded-sm">
                              <img
                                src={heroArticle.image}
                                alt={heroArticle.title}
                                className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
                              />
                            </div>
                            <div className="lg:col-span-5 flex flex-col justify-between py-1">
                              <div>
                                <span className={`text-[10px] ${themeTextColor} font-extrabold uppercase tracking-widest mb-2.5 block`}>
                                  Latest in {decodedCategory}
                                </span>
                                <h2 className="font-editorial-title text-2xl sm:text-3.5xl font-extrabold text-zinc-900 leading-tight tracking-tight group-hover:text-zinc-700 transition">
                                  {heroArticle.title}
                                </h2>
                                <p className="mt-3 text-sm text-zinc-600 leading-relaxed font-sans line-clamp-[14]">
                                  {getHeroDescription(heroArticle)}
                                </p>
                              </div>
                              <div className="mt-6 border-t border-zinc-100 pt-3 flex items-center justify-between text-[11px] text-zinc-400 font-sans">
                                <span>By <span className="font-semibold text-zinc-700">{heroArticle.author}</span> • {heroArticle.date}</span>
                                <span className="font-semibold text-zinc-700">{heroArticle.readTime}</span>
                              </div>
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
                    {layout.designStyle === 'modern-spotlight' && (
                      <>
                        {layout.isVisibleSpotlight && spotlightArticles.length > 0 && (
                          <div className="mb-12 border-t border-b border-zinc-200/70 py-8 select-none">
                            {/* Heading */}
                            <div className="mb-5 flex items-center justify-between">
                              {(layout.spotlightStyle === 'minimal') ? (
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-sans border-b border-zinc-900 pb-1 w-full text-left">
                                  {decodedCategory} Spotlight Digest
                                </h3>
                              ) : (layout.spotlightStyle === 'premium') ? (
                                <h3 className={`text-xs font-bold uppercase tracking-widest ${themeTextColor} flex items-center gap-1.5 font-sans`}>
                                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                                  {decodedCategory} Premium Spotlight
                                </h3>
                              ) : (
                                <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 font-sans ${themeTextColor}`}>
                                  • {decodedCategory.toUpperCase()} SPOTLIGHT DIGEST
                                </h3>
                              )}
                            </div>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {spotlightArticles.map((article) => {
                                if (layout.spotlightStyle === 'minimal') {
                                  return (
                                    <div
                                      key={article.id}
                                      onClick={() => setSelectedArticleId(article.id)}
                                      className="group cursor-pointer flex flex-col justify-between border-t border-zinc-200 pt-4"
                                    >
                                      <div>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${themeTextColor} mb-1 block`}>
                                          {article.category}
                                        </span>
                                        <h4 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-[#6366f1] transition leading-snug">
                                          {article.title}
                                        </h4>
                                        <p className="text-xs text-zinc-500 mt-2 line-clamp-3 leading-relaxed">
                                          {article.excerpt}
                                        </p>
                                      </div>
                                      <span className="text-[9.5px] text-zinc-400 mt-4 block font-mono">
                                        By {article.author} &bull; {article.readTime}
                                      </span>
                                    </div>
                                  );
                                } else if (layout.spotlightStyle === 'premium') {
                                  return (
                                    <div
                                      key={article.id}
                                      onClick={() => setSelectedArticleId(article.id)}
                                      className="group cursor-pointer bg-zinc-50/40 hover:bg-zinc-50 border border-zinc-200/80 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-305 transform hover:-translate-y-1 flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="overflow-hidden rounded-md aspect-[16/9] mb-3.5 bg-zinc-100 relative">
                                          <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover filter brightness-95 group-hover:scale-103 transition duration-500 absolute inset-0"
                                          />
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${themeTextColor} mb-1.5 block`}>
                                          {article.category}
                                        </span>
                                        <h4 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-[#6366f1] transition leading-snug">
                                          {article.title}
                                        </h4>
                                        <p className="text-xs text-zinc-600 mt-2 line-clamp-2 leading-relaxed">
                                          {article.excerpt}
                                        </p>
                                      </div>
                                      <div className="mt-4 pt-3 border-t border-zinc-150 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                                        <span>By <span className="text-zinc-600 font-medium">{article.author}</span></span>
                                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  // Standard
                                  return (
                                    <div
                                      key={article.id}
                                      onClick={() => setSelectedArticleId(article.id)}
                                      className="group cursor-pointer flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="overflow-hidden rounded-sm aspect-[16/9] mb-3 bg-zinc-100 relative">
                                          <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0"
                                          />
                                        </div>
                                        <h4 className="font-editorial-title text-base sm:text-[17px] font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                                          {article.title}
                                        </h4>
                                        <p className="text-xs text-zinc-550 mt-2 line-clamp-3 leading-relaxed">
                                          {article.excerpt}
                                        </p>
                                      </div>
                                      <span className="text-[10px] text-zinc-400 mt-3 font-sans block">
                                        {article.author} - {article.readTime}
                                      </span>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        )}

                        {leftListArticles.length > 0 && (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
                            <div className={layout.isVisibleSidebar ? "lg:col-span-8" : "lg:col-span-12"}>
                              <div className="space-y-0">
                                {leftListArticles.map((article, idx) => (
                                  <div
                                    key={article.id}
                                    onClick={() => setSelectedArticleId(article.id)}
                                    className={`group cursor-pointer flex gap-6 justify-between items-start py-5 ${idx < leftListArticles.length - 1 ? "border-b border-zinc-150" : ""}`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-[#6366f1] transition">
                                        {article.title}
                                      </h3>
                                      <p className="mt-1.5 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                                        {article.excerpt}
                                      </p>
                                      <div className="mt-2.5 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                                        <span>By <span className="text-zinc-500 font-medium">{article.author}</span> &bull; {article.date}</span>
                                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                                      </div>
                                    </div>
                                    <div className="w-24 sm:w-32 overflow-hidden rounded-sm aspect-[4/3] bg-zinc-100 flex-shrink-0 relative">
                                      <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {layout.isVisibleSidebar && (
                              <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-8 lg:sticky lg:top-6 lg:self-start">
                                <div className="border-b border-zinc-200 pb-1.5 mb-4">
                                  <h3 className={`text-xs font-bold uppercase tracking-wider ${themeTextColor}`}>{sidebarTitle}</h3>
                                </div>
                                <div className="divide-y divide-zinc-100">
                                  {sidebarArticles.map((article) => (
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
                    )}

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

                    {/* 3. MAGAZINE GRID: 2x2 grid card feed */}
                    {layout.designStyle === 'magazine-grid' && (
                      <div className="space-y-8 border-t border-zinc-200 pt-6">
                        <div className="border-b border-zinc-250 pb-2">
                          <h3 className={`text-xs font-bold uppercase tracking-widest ${themeTextColor}`}>Visual Magazine Grid Cover</h3>
                        </div>
                        <div className={layout.isVisibleSidebar ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
                          {leftListArticles.map((article) => (
                            <div
                              key={article.id}
                              onClick={() => setSelectedArticleId(article.id)}
                              className="group cursor-pointer bg-zinc-50/50 border border-zinc-200 p-4 rounded-md flex flex-col justify-between hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-zinc-50"
                            >
                              <div>
                                <div className="w-full aspect-[16/9] overflow-hidden rounded relative bg-zinc-100 mb-3.5">
                                  <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-102 transition duration-500 absolute inset-0" />
                                </div>
                                <span className="text-[8.5px] bg-zinc-900 text-white font-extrabold px-1.5 py-0.5 tracking-wider uppercase inline-block mb-2 rounded-sm">{article.category}</span>
                                <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 group-hover:text-[#6366f1] transition leading-snug">{article.title}</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed font-sans line-clamp-2 mt-2">{article.excerpt}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-zinc-150 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                                <span>By {article.author}</span>
                                <span>{article.readTime}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {layout.isVisibleSidebar && sidebarArticles.length > 0 && (
                          <div className="border-t border-zinc-100 pt-6">
                            <div className="space-y-4">
                              {sidebarArticles.map((article) => (
                                <div key={article.id} onClick={() => setSelectedArticleId(article.id)} className="group cursor-pointer flex gap-4 justify-between items-center py-2 border-b border-zinc-100 last:border-b-0 pb-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-editorial-title text-sm font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">{article.title}</h4>
                                    <span className="text-[10px] text-zinc-400 block mt-1">{article.author} &bull; {article.readTime}</span>
                                  </div>
                                  <div className="w-16 h-12 bg-zinc-100 border rounded flex-shrink-0 overflow-hidden relative">
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4. CLASSIC BROADSHEET: text-only columns */}
                    {layout.designStyle === 'classic-broadsheet' && (
                      <div className="space-y-8 border-t border-zinc-200 pt-6">
                        <div className="border-b border-zinc-950 pb-2 text-center">
                          <h3 className={`text-xs font-bold uppercase tracking-widest ${themeTextColor}`}>Editorial Broadsheet Board</h3>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200`}>
                          {[
                            { title: "Lead Highlights", list: leftListArticles },
                            { title: "Weekly Currents", list: sidebarArticles.slice(0, 2) },
                            { title: "Briefing Chronicles", list: sidebarArticles.slice(2, 4) }
                          ].map((col, idx) => (
                            <div key={idx} className={`space-y-5 ${idx > 0 ? 'md:pl-6' : ''} pt-4 md:pt-0`}>
                              <div className="border-b border-zinc-200 pb-1">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{col.title}</h4>
                              </div>
                              <div className="space-y-4">
                                {col.list.map((art, aIdx) => (
                                  <div key={art.id} onClick={() => setSelectedArticleId(art.id)} className="group cursor-pointer flex gap-4 items-start py-1">
                                    <span className="font-serif text-lg font-extrabold text-zinc-350 group-hover:text-zinc-555 transition-colors leading-none pt-0.5">
                                      0{aIdx + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-editorial-title text-sm font-bold text-zinc-950 leading-snug group-hover:text-[#6366f1] transition-colors">
                                        "{art.title}"
                                      </h5>
                                      <p className="text-[11px] text-zinc-500 leading-relaxed font-serif italic mt-1.5 line-clamp-3">{art.excerpt}</p>
                                      <span className="text-[9px] text-zinc-400 block mt-2 font-mono">{art.readTime}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. EDITORIAL MASONRY ROW: asymmetrical columns */}
                    {layout.designStyle === 'editorial-masonry' && (
                      <div className="space-y-8 border-t border-zinc-200 pt-6 animate-fade-in">
                        <div className="border-b border-zinc-900 pb-2">
                          <h3 className={`text-xs font-bold uppercase tracking-widest ${themeTextColor}`}>Editorial Masonry Row</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                          {/* Left Column: Cards list */}
                          <div className="space-y-6">
                            {leftListArticles.slice(0, 2).map((article) => (
                              <div key={article.id} onClick={() => setSelectedArticleId(article.id)} className="group cursor-pointer bg-zinc-50 border border-zinc-200 p-4 rounded hover:shadow transition duration-300">
                                <div className="w-full aspect-[16/10] overflow-hidden rounded relative mb-3 bg-zinc-100">
                                  <img src={article.image} alt={article.title} className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0" />
                                </div>
                                <h4 className="font-editorial-title text-sm sm:text-base font-bold text-zinc-900 leading-snug group-hover:text-[#6366f1] transition">{article.title}</h4>
                                <span className="text-[10px] text-zinc-400 block mt-2">{article.author} &bull; {article.readTime}</span>
                              </div>
                            ))}
                          </div>

                          {/* Middle Column: Heavy highlighted card */}
                          <div className="space-y-6 md:border-l md:border-r md:border-zinc-200 md:px-6">
                            {leftListArticles.length > 2 && (() => {
                              const article = leftListArticles[2];
                              return (
                                <div onClick={() => setSelectedArticleId(article.id)} className="group cursor-pointer flex flex-col justify-between">
                                  <div className="w-full aspect-[4/5] overflow-hidden rounded relative mb-4 bg-zinc-100">
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0" />
                                  </div>
                                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${themeTextColor} mb-2 block`}>Featured Highlight</span>
                                  <h4 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">{article.title}</h4>
                                  <p className="text-xs text-zinc-600 leading-relaxed font-sans line-clamp-3 mt-2">{article.excerpt}</p>
                                  <span className="text-[10px] text-zinc-400 mt-4 block">{article.author} &bull; {article.readTime}</span>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Right Column: Mini news links list */}
                          <div className="space-y-4">
                            <div className="border-b border-zinc-200 pb-1.5">
                              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">More Coverage</h4>
                            </div>
                            <div className="divide-y divide-zinc-100">
                              {sidebarArticles.map((article) => (
                                <div key={article.id} onClick={() => setSelectedArticleId(article.id)} className="group cursor-pointer py-3 first:pt-0">
                                  <h4 className="font-editorial-title text-sm font-bold text-zinc-900 group-hover:text-[#6366f1] transition leading-snug">{article.title}</h4>
                                  <div className="mt-1 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                                    <span>{article.author}</span>
                                    <span className="font-semibold text-zinc-705">{article.readTime}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

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
