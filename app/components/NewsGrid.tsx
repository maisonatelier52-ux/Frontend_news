"use client";

import React from "react";
import { Article } from "../data/news";

interface NewsGridProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
  activeCategory: string;
  searchQuery: string;
  showBookmarksOnly: boolean;
  sections?: any[];
}

export default function NewsGrid({
  articles,
  onSelectArticle,
  activeCategory,
  searchQuery,
  showBookmarksOnly,
  sections,
}: NewsGridProps) {

  const isCustomView = searchQuery !== "" || showBookmarksOnly;

  if (isCustomView) {
    if (articles.length === 0) {
      return (
        <div className="w-full text-center py-16 px-4 select-none">
          <p className="text-sm text-zinc-500 font-medium">No articles matching your filters were found.</p>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 select-none">
        <div className="border-b border-zinc-950 pb-2 mb-6 flex justify-between items-end">
          <h2 className="text-xl font-editorial-title font-bold text-zinc-900 uppercase tracking-wide">
            {showBookmarksOnly
              ? "Your Reading List"
              : `Search Results: "${searchQuery}"`}
          </h2>
          <span className="text-xs text-zinc-400 font-mono font-semibold">{articles.length} Articles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article.id)}
              className="group cursor-pointer border border-zinc-200 p-4 rounded-sm flex flex-col justify-between editorial-hover animate-fade-in"
            >
              <div>
                <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/9] mb-3 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 group-hover:brightness-100 transition duration-300 absolute inset-0"
                  />
                </div>
                <div className="flex items-center gap-2 mb-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  <span>{article.category}</span>
                  {article.isBreaking && (
                    <span className="bg-red-50 text-red-600 border border-red-200 px-1 py-0.2 rounded-[3px] text-[9px]">
                      Breaking
                    </span>
                  )}
                </div>
                <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                  {article.title}
                </h3>
                <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                <span>By {article.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Front Page Curated Layout ---
  // Slice articles by categories for sections (showing 3 per section)
  const getSectionArticles = (cat: string, count = 3) => {
    return articles.filter(a => a.category === cat && !a.isLead).slice(0, count);
  };

  const usArticles = getSectionArticles("US", 8);
  const worldArticles = getSectionArticles("World", 3);
  const financeArticles = getSectionArticles("Finance", 8);
  const techArticles = getSectionArticles("Technology", 3);
  const entertainmentArticles = getSectionArticles("Entertainment", 3);
  const marketingArticles = getSectionArticles("Marketing", 3);
  const prnewsArticles = getSectionArticles("PR News", 3);

  // opinionArticles: select a few US or World news articles that are not the lead and not in the first 3
  const opinionArticles = articles
    .filter(a => (a.category === "US" || a.category === "World") && !a.isLead)
    .slice(3, 6);

  // Trending Panel: top 5 trending articles
  const trendingArticles = articles.filter(a => a.isTrending).slice(0, 5);

  // Latest reports: list the rest of the articles that are not yet highlighted in above boxes
  const highlightedIds = new Set([
    ...usArticles.map(a => a.id),
    ...worldArticles.map(a => a.id),
    ...financeArticles.map(a => a.id),
    ...techArticles.map(a => a.id),
    ...entertainmentArticles.map(a => a.id),
    ...marketingArticles.map(a => a.id),
    ...prnewsArticles.map(a => a.id),
    ...opinionArticles.map(a => a.id),
    articles.find(a => a.isLead)?.id,
    ...articles.filter(a => a.isBreaking).map(a => a.id),
  ].filter(Boolean) as string[]);

  const remainingArticles = articles.filter(a => !highlightedIds.has(a.id));

  const heroSection = sections?.find((s: any) => s.id === 'first-hero');
  const heroStyle = heroSection?.designStyle || 'hero-split';

  const getSectionStyle = (sectionId: string, currentStyle: string) => {
    switch (heroStyle) {
      case 'hero-split':
        if (sectionId === 'us-politics') return 'politics-magazine';
        if (sectionId === 'technology-section') return 'columns';
        if (sectionId === 'world-affairs') return 'grid';
        break;
      case 'editorial-spotlight':
        if (sectionId === 'us-politics') return 'politics-columns';
        if (sectionId === 'technology-section') return 'split-trio';
        if (sectionId === 'world-affairs') return 'editorial-strip';
        break;
      case 'cover-story':
        if (sectionId === 'us-politics') return 'politics-minimal';
        if (sectionId === 'technology-section') return 'carousel';
        if (sectionId === 'world-affairs') return 'headline-wall';
        break;
      case 'split-detail':
        if (sectionId === 'us-politics') return 'politics-hero';
        if (sectionId === 'technology-section') return 'grid';
        if (sectionId === 'world-affairs') return 'masonry';
        break;
      case 'featured-card':
        if (sectionId === 'us-politics') return 'politics-split';
        if (sectionId === 'technology-section') return 'headline-wall';
        if (sectionId === 'world-affairs') return 'list';
        break;
      case 'classic-broadsheet':
        if (sectionId === 'us-politics') return 'politics-columns';
        if (sectionId === 'technology-section') return 'columns';
        if (sectionId === 'world-affairs') return 'headline-wall';
        break;
      case 'hero-full':
        if (sectionId === 'us-politics') return 'politics-magazine';
        if (sectionId === 'technology-section') return 'carousel';
        if (sectionId === 'world-affairs') return 'grid';
        break;
      case 'hero-minimal':
        if (sectionId === 'us-politics') return 'politics-minimal';
        if (sectionId === 'technology-section') return 'list';
        if (sectionId === 'world-affairs') return 'columns';
        break;
    }
    return currentStyle;
  };

  const usPoliticsSection = sections?.find((s: any) => s.id === 'us-politics');
  const usStyle = getSectionStyle('us-politics', usPoliticsSection?.designStyle || 'grid');
  const isUsVisible = usPoliticsSection ? usPoliticsSection.isVisible !== false : true;
  const isCustomPoliticsStyle = ['politics-hero', 'politics-columns', 'politics-split', 'politics-masonry-heavy', 'politics-minimal', 'politics-magazine'].includes(usStyle);

  const financeSection = sections?.find((s: any) => s.id === 'finance-markets');
  const financeStyle = financeSection?.designStyle || 'grid';
  const isFinanceVisible = financeSection ? financeSection.isVisible !== false : true;
  const isCustomFinanceStyle = ['politics-hero', 'politics-columns', 'politics-split', 'politics-masonry-heavy', 'politics-minimal', 'politics-magazine'].includes(financeStyle);

  const techSection = sections?.find((s: any) => s.id === 'technology-section');
  const techStyle = getSectionStyle('technology-section', techSection?.designStyle || 'grid');
  const isTechVisible = techSection ? techSection.isVisible !== false : true;

  const worldSection = sections?.find((s: any) => s.id === 'world-affairs');
  const worldStyle = getSectionStyle('world-affairs', worldSection?.designStyle || 'grid');
  const isWorldVisible = worldSection ? worldSection.isVisible !== false : true;

  const artsPrSection = sections?.find((s: any) => s.id === 'arts-marketing-pr');
  const isArtsPrVisible = artsPrSection ? artsPrSection.isVisible !== false : true;

  const latestNewsSection = sections?.find((s: any) => s.id === 'latest-news');
  const isLatestNewsVisible = latestNewsSection ? latestNewsSection.isVisible !== false : true;

  const renderDynamicSection = (sectionTitle: string, style: string, items: Article[]) => {
    const headerEl = (
      <div className="border-print-thick pt-1.5 flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">{sectionTitle}</h2>
      </div>
    );

    if (style === 'politics-hero') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left lead story (takes 8/12 cols) */}
            <div 
              className="lg:col-span-8 group cursor-pointer flex flex-col justify-start"
              onClick={() => onSelectArticle(items[0]?.id)}
            >
              {items[0] && (
                <>
                  <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/10] mb-4 relative border border-zinc-250">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={items[0].image} 
                      alt={items[0].title} 
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0" 
                    />
                  </div>
                  <h3 className="font-editorial-title text-2xl font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                    {items[0].title}
                  </h3>
                  <p className="mt-2.5 text-sm text-zinc-650 leading-relaxed font-sans">{items[0].excerpt}</p>
                  <div className="mt-3.5 flex items-center justify-between text-[11px] text-zinc-400 font-sans">
                    <span>By <span className="text-zinc-500 font-medium">{items[0].author}</span> • {items[0].date}</span>
                    <span className="font-semibold text-zinc-700">{items[0].readTime}</span>
                  </div>
                </>
              )}
            </div>

            {/* Right text bulletins list (takes 4/12 cols) */}
            <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-5">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-250 pb-1.5">
                Bulletins & Updates
              </div>
              <div className="flex flex-col gap-4">
                {items.slice(1, 5).map((article, idx) => (
                  <div
                    key={article.id}
                    className="group cursor-pointer flex gap-4 items-start border-b border-zinc-100 last:border-0 pb-4 last:pb-0"
                    onClick={() => onSelectArticle(article.id)}
                  >
                    <div className="font-serif text-2xl font-bold text-zinc-300 group-hover:text-zinc-500 transition-colors leading-none pt-0.5">
                      0{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-editorial-title text-[15px] font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                        {article.title}
                      </h4>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2 font-sans">{article.excerpt}</p>
                      <div className="mt-2 text-[10px] text-zinc-400 font-sans">{article.date} · {article.readTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (style === 'politics-columns') {
      const isFinanceSection = sectionTitle.toLowerCase().includes('finance') || sectionTitle.toLowerCase().includes('market');

      if (isFinanceSection) {
        // FINANCE: 2×2 image-on-top card grid — completely different from U.S. News stacked rows
        return (
          <div className="w-full">
            {headerEl}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {items.slice(0, 4).map((article) => (
                <div
                  key={article.id}
                  className="group cursor-pointer flex flex-col bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                  onClick={() => onSelectArticle(article.id)}
                >
                  {/* Image on top */}
                  <div className="w-full overflow-hidden relative bg-zinc-200" style={{ aspectRatio: '16/8' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover brightness-95 group-hover:scale-[1.03] group-hover:brightness-100 transition duration-500 absolute inset-0"
                    />
                  </div>
                  {/* Text below */}
                  <div className="flex-1 flex flex-col justify-between p-4">
                    <div>
                      <div className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 mb-1.5">{article.category}</div>
                      <h3 className="font-editorial-title text-[15px] font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition line-clamp-3">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed line-clamp-2 font-sans">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-zinc-200 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                      <span>By <span className="font-semibold text-zinc-600">{article.author}</span></span>
                      <span className="font-semibold text-zinc-700">{article.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // U.S. NEWS & POLITICS: Clean stacked rows — image left, text right, NO colors, thin top dividers
      return (
        <div className="w-full">
          {headerEl}
          <div className="flex flex-col">
            {items.slice(0, 4).map((article, idx) => (
              <div
                key={article.id}
                className={`group cursor-pointer flex gap-5 items-start py-5 ${idx > 0 ? 'border-t border-zinc-200' : ''} hover:bg-zinc-50/40 transition-colors duration-150`}
                onClick={() => onSelectArticle(article.id)}
              >
                {/* Image */}
                <div className="w-32 sm:w-44 flex-shrink-0 overflow-hidden rounded-sm relative bg-zinc-100 border border-zinc-200" style={{ minHeight: '80px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover brightness-95 group-hover:scale-[1.03] group-hover:brightness-100 transition duration-500 absolute inset-0"
                  />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">{article.category}</span>
                      {article.isBreaking && (
                        <span className="bg-zinc-900 text-white px-1.5 py-0.5 rounded-[2px] text-[8px] font-bold uppercase tracking-wide">Breaking</span>
                      )}
                    </div>
                    <h3 className="font-editorial-title text-base sm:text-[17px] font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] text-zinc-500 leading-relaxed line-clamp-2 font-sans hidden sm:block">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-center gap-3 text-[10px] text-zinc-400 font-sans">
                    <span>By <span className="text-zinc-600 font-semibold">{article.author}</span></span>
                    <span>·</span>
                    <span>{article.date}</span>
                    <span className="ml-auto font-semibold text-zinc-600">{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'politics-split') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left wide photo card */}
            <div 
              className="lg:col-span-6 group cursor-pointer flex flex-col justify-start"
              onClick={() => onSelectArticle(items[0]?.id)}
            >
              {items[0] && (
                <>
                  <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/9] mb-4 relative border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={items[0].image} 
                      alt={items[0].title} 
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0" 
                    />
                  </div>
                  <h3 className="font-editorial-title text-xl font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                    {items[0].title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-3">{items[0].excerpt}</p>
                </>
              )}
            </div>

            {/* Right stacked cards */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {items.slice(1, 4).map((article) => (
                <div
                  key={article.id}
                  className="group cursor-pointer flex gap-4 items-center py-2 border-b border-zinc-100 last:border-0 last:pb-0"
                  onClick={() => onSelectArticle(article.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                      {article.title}
                    </h4>
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{article.excerpt}</p>
                    <div className="mt-2 text-[10px] text-zinc-400 font-sans">{article.date} · {article.readTime}</div>
                  </div>
                  <div className="w-24 h-16 sm:w-28 sm:h-20 overflow-hidden rounded bg-zinc-100 relative flex-shrink-0 border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover brightness-95 group-hover:scale-102 transition duration-500 absolute inset-0" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (style === 'politics-masonry-heavy') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.slice(0, 3).map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer bg-zinc-50 border-t-4 border-t-zinc-900 border border-zinc-200 p-4 rounded shadow-sm hover:shadow transition duration-200 flex flex-col justify-between"
                onClick={() => onSelectArticle(article.id)}
              >
                <div>
                  <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/11] mb-3 relative border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0" 
                    />
                  </div>
                  <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-655 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-200 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                  <span>By <span className="text-zinc-500 font-medium">{article.author}</span></span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'politics-minimal') {
      return (
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: U.S. News & Politics minimalist list (takes 7/12 cols) */}
            <div className={`${sectionTitle === 'U.S. News & Politics' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
              <div className="border-print-thick pt-1.5 flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">{sectionTitle}</h2>
              </div>
              <div className="flex flex-col gap-0 border-t border-zinc-200">
                {items.slice(0, 4).map((article) => (
                  <div
                    key={article.id}
                    className="group cursor-pointer flex gap-6 items-center justify-between py-3 hover:bg-zinc-50/50 px-2 rounded-sm transition-colors duration-150"
                    onClick={() => onSelectArticle(article.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-400 font-sans">{article.date}</span>
                      </div>
                      <h4 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition mt-1.5">
                        {article.title}
                      </h4>
                      <p className="mt-1 text-[12px] text-zinc-500 line-clamp-1 font-sans">{article.excerpt}</p>
                    </div>
                    <div className="w-24 h-16 overflow-hidden rounded bg-zinc-100 border border-zinc-200 flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover brightness-95 group-hover:scale-102 transition duration-500 absolute inset-0" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Finance & Markets text-only list (takes 5/12 cols) */}
            {sectionTitle === 'U.S. News & Politics' && (
              <div className="lg:col-span-5 lg:border-l lg:border-zinc-200 lg:pl-8 space-y-4">
                <div className="border-print-thick pt-1.5 flex justify-between items-center mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Finance & Markets</h2>
                </div>
                <div className="flex flex-col gap-4 border-t border-zinc-200 pt-3">
                  {financeArticles.slice(0, 3).map((article) => (
                    <div
                      key={article.id}
                      className="group cursor-pointer flex flex-col justify-start border-b border-zinc-100 last:border-0 pb-4 last:pb-0"
                      onClick={() => onSelectArticle(article.id)}
                    >
                      <h3 className="font-editorial-title text-[14px] sm:text-[15px] font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-zinc-600 line-clamp-2 leading-relaxed font-sans">
                        {article.excerpt}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                        <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (style === 'politics-magazine') {
      return (
        <div className="w-full">
          {headerEl}
          {/* Full-width hero banner image */}
          {items[0] && (
            <div
              className="group cursor-pointer relative w-full overflow-hidden rounded-sm mb-6 border border-zinc-200"
              style={{ aspectRatio: '21/9', minHeight: '280px' }}
              onClick={() => onSelectArticle(items[0].id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={items[0].image}
                alt={items[0].title}
                className="w-full h-full object-cover brightness-75 group-hover:brightness-80 group-hover:scale-[1.02] transition duration-700 absolute inset-0"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/30 to-transparent" />
              {/* Text overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                    {items[0].isBreaking ? 'Breaking' : items[0].category}
                  </span>
                  <span className="text-white/60 text-[10px] font-sans">{items[0].date}</span>
                </div>
                <h3 className="font-editorial-title text-white text-xl sm:text-3xl font-extrabold leading-tight tracking-tight drop-shadow-md max-w-4xl">
                  {items[0].title}
                </h3>
                <p className="mt-2 text-white/75 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl line-clamp-2">
                  {items[0].excerpt}
                </p>
                <div className="mt-3 flex items-center gap-3 text-[10px] text-white/55 font-sans">
                  <span>By <span className="text-white/80 font-semibold">{items[0].author}</span></span>
                  <span>•</span>
                  <span>{items[0].readTime}</span>
                </div>
              </div>
            </div>
          )}
          {/* Horizontal strip of 3 article cards below */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-b border-zinc-200 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200">
            {items.slice(1, 4).map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer flex gap-3 items-start p-4 hover:bg-zinc-50/70 transition-colors duration-150"
                onClick={() => onSelectArticle(article.id)}
              >
                {/* Thumbnail */}
                <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded bg-zinc-100 relative border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition duration-500 absolute inset-0"
                  />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1">{article.category}</div>
                  <h4 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition line-clamp-3">
                    {article.title}
                  </h4>
                  <div className="mt-1.5 text-[10px] text-zinc-400 font-sans">{article.readTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'grid') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {items.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="group cursor-pointer space-y-2.5"
              >
                <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/10] relative border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover brightness-95 group-hover:scale-[1.02] transition duration-500 absolute inset-0"
                  />
                </div>
                <div>
                  <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">{article.excerpt}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                    <span>By <span className="text-zinc-500 font-medium">{article.author}</span></span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'magazine') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div
              className="lg:col-span-7 group cursor-pointer flex flex-col gap-2.5"
              onClick={() => onSelectArticle(items[0]?.id)}
            >
              {items[0] && (
                <>
                  <div className="w-full aspect-[16/10] bg-zinc-100 rounded-sm overflow-hidden relative border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={items[0].image}
                      alt={items[0].title}
                      className="w-full h-full object-cover brightness-95 group-hover:scale-[1.01] transition duration-500 absolute inset-0"
                    />
                  </div>
                  <h3 className="font-editorial-title text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {items[0].title}
                  </h3>
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">{items[0].excerpt}</p>
                  <div className="text-[10px] text-zinc-400 font-sans">
                    By <span className="font-semibold text-zinc-600">{items[0].author}</span> · {items[0].readTime}
                  </div>
                </>
              )}
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
              {items.slice(1, 3).map((article) => (
                <div
                  key={article.id}
                  className="group cursor-pointer flex gap-4 items-start border-b border-zinc-100 last:border-b-0 pb-3 last:pb-0"
                  onClick={() => onSelectArticle(article.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                      {article.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-normal">{article.excerpt}</p>
                    <span className="text-[9px] text-zinc-400 block mt-1.5">{article.readTime}</span>
                  </div>
                  <div className="w-20 h-14 bg-zinc-100 border border-zinc-200 flex-shrink-0 relative overflow-hidden rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover brightness-95 absolute inset-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (style === 'list') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="space-y-4">
            {items.slice(0, 4).map((article, idx) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className={`group cursor-pointer flex gap-5 items-start py-4 ${idx > 0 ? 'border-t border-zinc-200' : ''} hover:bg-zinc-50/40 transition-colors px-2 rounded-sm`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">{article.category}</div>
                  <h3 className="font-editorial-title text-[15px] sm:text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed line-clamp-2 font-sans">{article.excerpt}</p>
                  <div className="mt-2.5 flex items-center gap-3 text-[10px] text-zinc-400 font-sans">
                    <span>By <span className="text-zinc-600 font-semibold">{article.author}</span></span>
                    <span>·</span>
                    <span>{article.date}</span>
                    <span className="ml-auto font-semibold text-zinc-700">{article.readTime}</span>
                  </div>
                </div>
                <div className="w-24 h-16 sm:w-28 sm:h-18 bg-zinc-100 border border-zinc-200 flex-shrink-0 relative overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover brightness-95 group-hover:scale-102 transition duration-500 absolute inset-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'masonry') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.slice(0, 2).map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="group cursor-pointer bg-zinc-50/80 border border-zinc-200 p-4 rounded-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/9] mb-4 relative border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover brightness-95 group-hover:scale-[1.01] transition duration-500 absolute inset-0"
                    />
                  </div>
                  <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-600 line-clamp-3 leading-relaxed font-sans">{article.excerpt}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-200 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                  <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                  <span className="font-semibold text-zinc-700">{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'columns') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            {items.slice(0, 3).map((article, idx) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className={`group cursor-pointer flex flex-col justify-between ${idx > 0 ? 'md:pl-5' : ''}`}
              >
                <div>
                  <h3 className="font-editorial-title text-[15px] font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                    "{article.title}"
                  </h3>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-4 font-serif italic">{article.excerpt}</p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-zinc-150 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                  <span>By <span className="text-zinc-500 font-medium">{article.author}</span></span>
                  <span className="font-semibold text-zinc-700">{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'carousel') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent snap-x">
            {items.map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="flex-shrink-0 w-[280px] snap-start bg-zinc-50 border border-zinc-200 rounded p-3 flex flex-col gap-3 group cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-full aspect-[16/10] bg-zinc-100 rounded-sm relative overflow-hidden border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover brightness-95 group-hover:scale-[1.02] transition duration-500 absolute inset-0"
                  />
                </div>
                <div>
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-normal font-sans">{article.excerpt}</p>
                  <div className="mt-2.5 flex justify-between items-center text-[9px] text-zinc-400 font-sans border-t border-zinc-150 pt-2">
                    <span>{article.date}</span>
                    <span className="font-semibold text-zinc-700">{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'editorial-strip') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {items.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="group cursor-pointer relative aspect-[16/10] rounded-sm overflow-hidden border border-zinc-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover filter brightness-75 group-hover:brightness-85 group-hover:scale-[1.03] transition duration-700 absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-900/40 to-transparent z-10" />
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <span className="text-[8px] bg-red-700 text-white font-extrabold px-1.5 py-0.5 tracking-wider uppercase inline-block mb-1.5 rounded-sm">
                    {article.category}
                  </span>
                  <h3 className="font-editorial-title text-white text-sm sm:text-base font-bold leading-tight tracking-tight drop-shadow">
                    {article.title}
                  </h3>
                  <div className="text-[9px] text-white/60 font-sans mt-1.5 flex items-center justify-between">
                    <span>By {article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (style === 'split-trio') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div
              className="lg:col-span-7 bg-zinc-50/50 border border-zinc-200 p-4 rounded-sm flex flex-col gap-3 group cursor-pointer hover:bg-zinc-50/80 transition-colors"
              onClick={() => onSelectArticle(items[0]?.id)}
            >
              {items[0] && (
                <>
                  <div className="w-full aspect-[16/10] bg-zinc-100 rounded-sm relative overflow-hidden border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={items[0].image}
                      alt={items[0].title}
                      className="w-full h-full object-cover brightness-95 group-hover:scale-[1.01] transition duration-500 absolute inset-0"
                    />
                  </div>
                  <div>
                    <h3 className="font-editorial-title text-lg font-bold text-zinc-900 leading-snug">
                      {items[0].title}
                    </h3>
                    <p className="text-xs text-zinc-550 line-clamp-2 mt-1.5 leading-relaxed font-sans">{items[0].excerpt}</p>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-200/60 pt-2">
                      <span>By <span className="text-zinc-650 font-medium">{items[0].author}</span></span>
                      <span>{items[0].readTime}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4 justify-center">
              {items.slice(1, 3).map((article) => (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="group cursor-pointer border-b last:border-0 border-zinc-150 pb-4 last:pb-0 flex flex-col justify-between"
                >
                  <h4 className="font-editorial-title text-[15px] font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-normal font-sans">{article.excerpt}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[9px] text-zinc-400 font-sans">
                    <span>{article.date}</span>
                    <span className="font-semibold text-zinc-700">{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (style === 'headline-wall') {
      return (
        <div className="w-full">
          {headerEl}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.slice(0, 4).map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="group cursor-pointer border border-zinc-200/80 rounded p-4 flex flex-col justify-between bg-zinc-50/20 hover:bg-zinc-50/80 transition-all shadow-sm"
              >
                <div>
                  <span className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest">{article.category}</span>
                  <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-600 transition leading-snug mt-1">
                    "{article.title}"
                  </h3>
                  <p className="text-[11.5px] text-zinc-500 leading-relaxed font-sans mt-2 line-clamp-2">{article.excerpt}</p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-zinc-150 flex items-center justify-between text-[9px] text-zinc-400 font-sans">
                  <span>By <span className="font-medium text-zinc-550">{article.author}</span></span>
                  <span className="font-semibold text-zinc-700">{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="w-full">
        {headerEl}
        <div className="text-sm text-zinc-500">Select a custom layout style.</div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">

      {isCustomPoliticsStyle || isCustomFinanceStyle ? (
        <>
          {/* U.S. News & Politics (Dynamic Full-width layout option or standard grid fallback) */}
          {isUsVisible && (
            <div className="w-full pb-4">
              {isCustomPoliticsStyle ? (
                renderDynamicSection("U.S. News & Politics", usStyle, usArticles)
              ) : (
                /* Fallback to standard 3-column view if only Finance is custom */
                <div className="space-y-4">
                  <div className="border-print-thick pt-1.5 flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">U.S. News & Politics</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {usArticles.slice(0, 3).map((article) => (
                      <div
                        key={article.id}
                        className="group cursor-pointer flex gap-4 items-start py-1"
                        onClick={() => onSelectArticle(article.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                            {article.title}
                          </h3>
                          <p className="mt-1 text-xs text-zinc-550 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                            <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                            <span className="font-semibold text-zinc-700">{article.readTime}</span>
                          </div>
                        </div>
                        <div className="w-20 sm:w-28 overflow-hidden rounded-sm aspect-[4/3] bg-zinc-100 flex-shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Finance & Markets (Dynamic Full-width layout option or standard grid fallback) */}
          {isFinanceVisible && usStyle !== 'politics-minimal' && (
            <div className="w-full border-b border-zinc-200 pb-8">
              {isCustomFinanceStyle ? (
                renderDynamicSection("Finance & Markets", financeStyle, financeArticles)
              ) : (
                /* Fallback to standard 3-column view if only Politics is custom */
                <div className="space-y-4">
                  <div className="border-print-thick pt-1.5 flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Finance & Markets</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {financeArticles.slice(0, 3).map((article) => (
                      <div
                        key={article.id}
                        className="group cursor-pointer flex gap-4 items-start py-1"
                        onClick={() => onSelectArticle(article.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                            {article.title}
                          </h3>
                          <p className="mt-1 text-xs text-zinc-550 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                            <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                            <span className="font-semibold text-zinc-700">{article.readTime}</span>
                          </div>
                        </div>
                        <div className="w-20 sm:w-28 overflow-hidden rounded-sm aspect-[4/3] bg-zinc-100 flex-shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Original side-by-side layout (Fallback when both styles are standard) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-zinc-200 pb-8">
          {/* U.S. News */}
          {isUsVisible && (
            <div className="lg:col-span-6 space-y-4">
              <div className="border-print-thick pt-1.5 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">U.S. News & Politics</h2>
              </div>
              <div className="space-y-4">
                {usArticles.slice(0, 3).map((article, idx) => (
                  <div
                    key={article.id}
                    className="group cursor-pointer flex gap-4 items-start py-1"
                    onClick={() => onSelectArticle(article.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{article.excerpt}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                        <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                      </div>
                    </div>
                    <div className="w-20 sm:w-28 overflow-hidden rounded-sm aspect-[4/3] bg-zinc-100 flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finance */}
          {isFinanceVisible && (
            <div className={`${isUsVisible ? 'lg:col-span-6 lg:border-l lg:border-zinc-200 lg:pl-8' : 'lg:col-span-12'} space-y-4`}>
              <div className="border-print-thick pt-1.5 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Finance & Markets</h2>
              </div>
              <div className="space-y-4">
                {financeArticles.slice(0, 3).map((article, idx) => (
                  <div
                    key={article.id}
                    className="group cursor-pointer flex gap-4 items-start py-1"
                    onClick={() => onSelectArticle(article.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{article.excerpt}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                        <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                      </div>
                    </div>
                    <div className="w-20 sm:w-28 overflow-hidden rounded-sm aspect-[4/3] bg-zinc-100 flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 2: Opinion columns (Text-only print-style layout) - Commented out as requested
      <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
        <div className="border-b border-zinc-800 pb-1.5 mb-6 text-center">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900">Opinion & Columns</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divider-y md:divider-y-0 md:divider-x divider-zinc-200">
          {opinionArticles.map((article, idx) => (
            <div
              key={article.id}
              className="group cursor-pointer flex flex-col justify-between py-2 md:py-0 md:px-3 first:pl-0 last:pr-0"
              onClick={() => onSelectArticle(article.id)}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-mono flex items-center justify-center text-[10px] font-bold">
                    {article.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-800 leading-none">{article.author}</h4>
                    <span className="text-[9px] text-zinc-400 font-sans">{article.authorTitle}</span>
                  </div>
                </div>
                <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-600 transition leading-snug">
                  &ldquo;{article.title}&rdquo;
                </h3>
                <p className="mt-2 text-xs text-zinc-600 leading-relaxed font-editorial-body">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}
      </div>
      */}

      {/* Section 3: Tech & Science (Split Layout with Sidebar Trending) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">

        {/* Left Side: Tech and Science (Takes 8/12) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Technology */}
          {isTechVisible && renderDynamicSection("Technology & AI", techStyle, techArticles)}

          {/* World Affairs */}
          {isWorldVisible && renderDynamicSection("World Affairs", worldStyle, worldArticles)}
        </div>

        {/* Right Side: Trending Stories Panel (Takes 4/12) */}
        <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 space-y-4">
          <div className="border-print-thick pt-1.5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Trending Columns</h2>
          </div>
          <div className="space-y-4 divide-y divide-zinc-100">
            {trendingArticles.map((article, idx) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="group cursor-pointer flex gap-4 items-start pt-3 first:pt-0"
              >
                <div className="font-mono text-3xl font-black text-zinc-200 group-hover:text-zinc-400 transition leading-none">
                  0{idx + 1}
                </div>
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{article.category}</span>
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition mt-0.5">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-sans mt-1">
                    <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                    <span className="font-semibold text-zinc-700">{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 4: Entertainment, Marketing & PR News (Three columns) */}
      {isArtsPrVisible && (() => {
        // 1. VISUAL CARDS: Big images grid for editorial-spotlight, featured-card
        if (heroStyle === 'editorial-spotlight' || heroStyle === 'featured-card') {
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-zinc-200 pb-8">
              {[
                { title: "Arts & Entertainment", art: entertainmentArticles[0] },
                { title: "Marketing & Strategy", art: marketingArticles[0] },
                { title: "Press Releases & News", art: prnewsArticles[0] }
              ].map((col, idx) => {
                if (!col.art) return null;
                return (
                  <div key={idx} onClick={() => onSelectArticle(col.art.id)} className="group cursor-pointer bg-zinc-50 border border-zinc-200/50 rounded overflow-hidden p-4 flex flex-col justify-between hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                    <div>
                      <div className="text-[10px] text-[#6366f1] font-bold uppercase tracking-widest mb-2">{col.title}</div>
                      <div className="w-full aspect-[16/10] overflow-hidden rounded mb-3.5 relative bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={col.art.image} alt={col.art.title} className="w-full h-full object-cover brightness-95" />
                      </div>
                      <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                        {col.art.title}
                      </h3>
                      <p className="text-xs text-zinc-505 line-clamp-2 mt-2 leading-relaxed font-sans">{col.art.excerpt}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-150 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                      <span>Staff Writer</span>
                      <span>{col.art.readTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        }

        // 2. SMOOTH SLIDER TRACK: horizontal carousel for cover-story
        if (heroStyle === 'cover-story') {
          const allFlatArticles = [
            ...entertainmentArticles.slice(0, 2).map(a => ({ ...a, category: "Arts & Entertainment" })),
            ...marketingArticles.slice(0, 2).map(a => ({ ...a, category: "Marketing & Strategy" })),
            ...prnewsArticles.slice(0, 2).map(a => ({ ...a, category: "Press Releases & News" }))
          ];
          return (
            <div className="border-b border-zinc-200 pb-8 space-y-4">
              <div className="border-print-thick pt-1.5 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Culture & Spotlight Filmstrip</h2>
              </div>
              <div 
                className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {allFlatArticles.map((art, idx) => (
                  <div key={idx} onClick={() => onSelectArticle(art.id)} className="flex-shrink-0 w-[260px] snap-start bg-zinc-50 border border-zinc-200 rounded p-3 flex flex-col gap-3 group cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                    <div className="w-full aspect-[16/10] overflow-hidden rounded relative bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover brightness-95" />
                    </div>
                    <div>
                      <span className="text-[9px] text-red-700 font-bold uppercase tracking-widest block mb-1">{art.category}</span>
                      <h4 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug line-clamp-2 group-hover:text-zinc-650 transition">{art.title}</h4>
                      <span className="text-[10px] text-zinc-450 block mt-2 font-sans">{art.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
              <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          )
        }

        // 3. TYPOGRAPHY BROADSHEET: classic-broadsheet, hero-minimal
        if (heroStyle === 'classic-broadsheet' || heroStyle === 'hero-minimal') {
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-zinc-200 pb-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
              {[
                { title: "Arts & Entertainment", list: entertainmentArticles },
                { title: "Marketing & Strategy", list: marketingArticles },
                { title: "Press Releases & News", list: prnewsArticles }
              ].map((col, idx) => (
                <div key={idx} className={`space-y-5 ${idx > 0 ? 'md:pl-6' : ''} pt-4 md:pt-0`}>
                  <div className="border-b border-zinc-955 pb-1.5">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{col.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {col.list.map((art, aIdx) => (
                      <div key={aIdx} onClick={() => onSelectArticle(art.id)} className="group cursor-pointer flex gap-4 items-start py-1">
                        <span className="font-serif text-xl font-extrabold text-zinc-300 group-hover:text-zinc-550 transition-colors leading-none pt-0.5">
                          0{aIdx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                            "{art.title}"
                          </h4>
                          <p className="text-[11px] text-zinc-550 leading-relaxed font-serif italic mt-1.5 line-clamp-3">{art.excerpt}</p>
                          <span className="text-[9px] text-zinc-400 block mt-2">{art.readTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        }

        // 4. LIST HOVER LIFT (DEFAULT): hero-split, split-detail, hero-full
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-b border-zinc-200 pb-8">
            {/* Entertainment */}
            <div className="space-y-4">
              <div className="border-print-thick pt-1.5">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Arts & Entertainment</h2>
              </div>
              <div className="space-y-4">
                {entertainmentArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex gap-3 items-center py-1.5 border-b border-zinc-100 last:border-0 pb-2.5 last:pb-0 hover:bg-zinc-50/65 px-1.5 rounded transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <div className="flex-1">
                      <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                        {article.title}
                      </h3>
                      <div className="mt-1 text-[9px] text-zinc-400 flex justify-between font-sans">
                        <span>Staff Writer</span>
                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                      </div>
                    </div>
                    <div className="w-16 h-12 overflow-hidden rounded-sm bg-zinc-100 relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 absolute inset-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing */}
            <div className="space-y-4 md:border-l md:border-zinc-200 md:pl-6">
              <div className="border-print-thick pt-1.5">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Marketing & Strategy</h2>
              </div>
              <div className="space-y-4">
                {marketingArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex gap-3 items-center py-1.5 border-b border-zinc-100 last:border-0 pb-2.5 last:pb-0 hover:bg-zinc-50/65 px-1.5 rounded transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <div className="flex-1">
                      <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                        {article.title}
                      </h3>
                      <div className="mt-1 text-[9px] text-zinc-400 flex justify-between font-sans">
                        <span>Staff Writer</span>
                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                      </div>
                    </div>
                    <div className="w-16 h-12 overflow-hidden rounded-sm bg-zinc-100 relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 absolute inset-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PR News */}
            <div className="space-y-4 md:border-l md:border-zinc-200 md:pl-6">
              <div className="border-print-thick pt-1.5">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Press Releases & News</h2>
              </div>
              <div className="space-y-4">
                {prnewsArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex gap-3 items-center py-1.5 border-b border-zinc-100 last:border-0 pb-2.5 last:pb-0 hover:bg-zinc-50/65 px-1.5 rounded transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <div className="flex-1">
                      <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                        {article.title}
                      </h3>
                      <div className="mt-1 text-[9px] text-zinc-400 flex justify-between font-sans">
                        <span>Staff Writer</span>
                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                      </div>
                    </div>
                    <div className="w-16 h-12 overflow-hidden rounded-sm bg-zinc-100 relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 absolute inset-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Section 5: The Wire Feed (Split scrollable layout) */}
      {isLatestNewsVisible && (() => {
        // 1. VISUAL GRID: editorial-spotlight, featured-card
        if (heroStyle === 'editorial-spotlight' || heroStyle === 'featured-card') {
          const combined = remainingArticles.slice(0, 4)
          return (
            <div className="space-y-6">
              <div className="border-print-double pt-2.5">
                <h2 className="text-base font-black uppercase tracking-widest text-zinc-900 text-center">LATEST SPOTLIGHT FEED</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {combined.map((art, idx) => (
                  <div key={idx} onClick={() => onSelectArticle(art.id)} className="group cursor-pointer bg-zinc-50 border border-zinc-200/60 rounded-md overflow-hidden p-4 flex flex-col justify-between hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                    <div>
                      <div className="w-full aspect-[16/9] overflow-hidden rounded mb-3.5 relative bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover brightness-95" />
                      </div>
                      <span className="text-[9px] bg-zinc-950 text-white font-extrabold px-1.5 py-0.5 tracking-wider uppercase inline-block mb-2 rounded-sm">{art.category}</span>
                      <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition">{art.title}</h3>
                      <p className="text-xs text-zinc-600 line-clamp-2 mt-2 leading-relaxed">{art.excerpt}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-150 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                      <span>By <span className="text-zinc-500 font-medium">{art.author}</span> • {art.date}</span>
                      <span className="font-semibold text-zinc-700">{art.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        // 2. CINEMATIC FILMSTRIP CAROUSEL: cover-story
        if (heroStyle === 'cover-story') {
          const combined = remainingArticles.slice(0, 6)
          return (
            <div className="space-y-6">
              <div className="border-print-double pt-2.5">
                <h2 className="text-base font-black uppercase tracking-widest text-zinc-900 text-center font-serif">REAL-TIME STORIES TIMELINE</h2>
              </div>
              <div 
                className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {combined.map((art, idx) => (
                  <div key={idx} onClick={() => onSelectArticle(art.id)} className="flex-shrink-0 w-[280px] snap-start bg-zinc-50 border border-zinc-200 rounded p-3 flex flex-col gap-3 group cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                    <div className="w-full aspect-[16/10] overflow-hidden rounded relative bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover brightness-95" />
                    </div>
                    <div>
                      <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest block mb-1">{art.category}</span>
                      <h4 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug line-clamp-2 group-hover:text-zinc-650 transition">{art.title}</h4>
                      <div className="flex justify-between text-[10px] text-zinc-450 mt-3 font-sans border-t border-zinc-150 pt-2">
                        <span>{art.author}</span>
                        <span>{art.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          )
        }

        // 3. TYPOGRAPHICAL FEED: classic-broadsheet, hero-minimal
        if (heroStyle === 'classic-broadsheet' || heroStyle === 'hero-minimal') {
          const wireArticles = remainingArticles.slice(2, 6)
          const spotlightArticles = remainingArticles.slice(0, 2)
          return (
            <div className="space-y-6">
              <div className="border-print-double pt-2.5">
                <h2 className="text-base font-black uppercase tracking-widest text-zinc-900 text-center">LATEST NEWS COLUMN</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                <div className="space-y-5">
                  <div className="border-b border-zinc-200 pb-1"><h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Timeline Feed</h3></div>
                  {wireArticles.map((art, idx) => (
                    <div key={idx} onClick={() => onSelectArticle(art.id)} className="group cursor-pointer flex gap-4 items-start py-1">
                      <span className="font-serif text-lg font-extrabold text-zinc-300 group-hover:text-zinc-550 transition-colors leading-none pt-0.5">
                        0{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-editorial-title text-sm font-bold text-[#6366f1] leading-snug">
                          "{art.title}"
                        </h4>
                        <p className="text-[11px] text-zinc-550 leading-relaxed font-serif italic mt-1 line-clamp-2">{art.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="md:pl-6 space-y-5">
                  <div className="border-b border-zinc-200 pb-1"><h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Featured Story Feed</h3></div>
                  {spotlightArticles.map((art, idx) => (
                    <div key={idx} onClick={() => onSelectArticle(art.id)} className="group cursor-pointer flex gap-4 items-start py-1">
                      <span className="font-serif text-lg font-extrabold text-zinc-300 group-hover:text-zinc-550 transition-colors leading-none pt-0.5">
                        0{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug">
                          "{art.title}"
                        </h4>
                        <p className="text-[11px] text-zinc-550 leading-relaxed font-serif italic mt-1 line-clamp-2">{art.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        // 4. SPLIT TIMELINE & FEATURED (DEFAULT)
        return (
          <div className="space-y-6">
            <div className="border-print-double pt-2.5">
              <h2 className="text-base font-black uppercase tracking-widest text-zinc-900 text-center font-serif">LATEST NEWS</h2>
              <p className="text-[10px] text-zinc-400 text-center mt-0.5 font-mono">Real-time updates and breaking reports</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Timeline Feed */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border-b border-zinc-200 pb-1.5 flex justify-between items-center bg-white">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-red-650 animate-ping" />
                    LIVE UPDATES
                  </h3>
                </div>
                <div className="space-y-3.5">
                  {remainingArticles.slice(2, 17).map((article, idx) => (
                    <div
                      key={article.id}
                      onClick={() => onSelectArticle(article.id)}
                      className="group cursor-pointer border-l-2 border-zinc-200 hover:border-zinc-800 pl-4 py-2 hover:bg-zinc-50/55 rounded-r transition-all duration-200 flex gap-4 justify-between"
                    >
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-extrabold text-red-700 uppercase tracking-widest">{article.category}</span>
                          </div>
                          <h4 className="font-editorial-title text-sm sm:text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                            {article.title}
                          </h4>
                          <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 font-sans">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="mt-2.5 flex justify-between items-center text-[10px] text-zinc-400 font-sans font-medium">
                          <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                          <span className="font-semibold text-zinc-700">{article.readTime}</span>
                        </div>
                      </div>
                      <div className="w-20 h-16 sm:w-28 sm:h-20 overflow-hidden rounded bg-zinc-100 relative flex-shrink-0 self-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-102 transition duration-300 absolute inset-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured spotlights */}
              <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-zinc-200 lg:pl-6 lg:sticky lg:top-6 lg:self-start">
                <div className="border-b border-zinc-200 pb-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-semibold font-sans">FEATURED STORIES</h3>
                </div>
                <div className="space-y-6">
                  {remainingArticles.slice(0, 2).map((article) => (
                    <div
                      key={article.id}
                      onClick={() => onSelectArticle(article.id)}
                      className="group cursor-pointer flex flex-col justify-between py-4 border-b border-zinc-200 last:border-0 first:pt-0 bg-transparent"
                    >
                      <div>
                        <div className="overflow-hidden bg-zinc-100 rounded aspect-[16/9] mb-3.5 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0" />
                        </div>
                        <div className="flex items-center gap-2 mb-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-sans">
                          <span>{article.category}</span>
                        </div>
                        <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug font-bold">
                          {article.title}
                        </h3>
                        <p className="text-xs text-zinc-600 mt-2 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-150 flex justify-between items-center text-[10px] text-zinc-400 font-sans font-medium">
                        <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
                        <span className="font-semibold text-zinc-700">{article.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })()}

    </div>
  );
}
