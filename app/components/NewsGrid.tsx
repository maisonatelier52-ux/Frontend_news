"use client";

import React from "react";
import { Article } from "../data/news";

interface NewsGridProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
  activeCategory: string;
  searchQuery: string;
  showBookmarksOnly: boolean;
}

export default function NewsGrid({
  articles,
  onSelectArticle,
  activeCategory,
  searchQuery,
  showBookmarksOnly,
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

  const usArticles = getSectionArticles("US", 3);
  const worldArticles = getSectionArticles("World", 3);
  const financeArticles = getSectionArticles("Finance", 3);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10 select-none">
      
      {/* Section 1: U.S. News & Finance (Multi-column list) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-zinc-200 pb-8">
        {/* U.S. News */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border-print-thick pt-1.5 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">U.S. News & Politics</h2>
          </div>
          <div className="space-y-4">
            {usArticles.map((article, idx) => (
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
                  <div className="mt-2 text-[10px] text-zinc-400 font-sans">
                    By {article.author} • {article.date}
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

        {/* Finance */}
        <div className="lg:col-span-6 lg:border-l lg:border-zinc-200 lg:pl-8 space-y-4">
          <div className="border-print-thick pt-1.5 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Finance & Markets</h2>
          </div>
          <div className="space-y-4">
            {financeArticles.map((article, idx) => (
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
                  <div className="mt-2 text-[10px] text-zinc-400 font-sans">
                    By {article.author} • {article.date}
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
      </div>

      {/* Section 2: Opinion columns (Text-only print-style layout) */}
      <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
        <div className="border-b border-zinc-800 pb-1.5 mb-6 text-center">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900">Opinion & Columns</h2>
          <p className="text-[10px] text-zinc-400 mt-0.5">Letters, Ideas, and Analytical Commentary</p>
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
      </div>

      {/* Section 3: Tech & Science (Split Layout with Sidebar Trending) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
        
        {/* Left Side: Tech and Science (Takes 8/12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Technology */}
          <div className="space-y-4">
            <div className="border-print-thick pt-1.5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Technology & AI</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {techArticles.map((article) => (
                <div 
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="group cursor-pointer space-y-2"
                >
                  <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/10] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0" />
                  </div>
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition">
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* World Affairs */}
          <div className="space-y-4">
            <div className="border-print-thick pt-1.5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">World Affairs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {worldArticles.map((article) => (
                <div 
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="group cursor-pointer space-y-2"
                >
                  <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/10] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0" />
                  </div>
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

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
                  <span className="text-[10px] text-zinc-400">By {article.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 4: Entertainment, Marketing & PR News (Three columns) */}
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
                className="group cursor-pointer flex gap-3 items-center py-0.5"
              >
                <div className="flex-1">
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
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
                className="group cursor-pointer flex gap-3 items-center py-0.5"
              >
                <div className="flex-1">
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
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
                className="group cursor-pointer flex gap-3 items-center py-0.5"
              >
                <div className="flex-1">
                  <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
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

      {/* Section 5: The Wire Feed (Split scrollable layout) */}
      <div className="space-y-6">
        <div className="border-print-double pt-2.5">
          <h2 className="text-base font-black uppercase tracking-widest text-zinc-900 text-center">LATEST NEWS</h2>
          <p className="text-[10px] text-zinc-400 text-center mt-0.5 font-mono">Real-time updates and breaking reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: Real-time timeline feed (Takes 7/12 cols, no scrolling) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border-b border-zinc-200 pb-1.5 flex justify-between items-center bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-650 animate-ping" />
                LIVE UPDATES
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono font-semibold">Latest updates ({remainingArticles.slice(2, 17).length})</span>
            </div>

            <div className="space-y-3.5">
              {remainingArticles.slice(2, 17).map((article, idx) => {
                return (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer border-l-2 border-zinc-200 hover:border-zinc-800 pl-4 py-2 hover:bg-zinc-50/55 rounded-r transition-all duration-200 animate-fade-in flex gap-4 justify-between"
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
                      <div className="mt-2.5 flex justify-between items-center text-[9px] text-zinc-400 font-mono">
                        <span>By {article.author}</span>
                      </div>
                    </div>
                    <div className="w-20 h-16 sm:w-28 sm:h-20 overflow-hidden rounded bg-zinc-100 relative flex-shrink-0 self-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover brightness-95 group-hover:scale-102 transition duration-300 absolute inset-0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Static Featured Spotlights with Images (Takes 5/12 cols, sticky to avoid empty space) */}
          <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-zinc-200 lg:pl-6 lg:sticky lg:top-6 lg:self-start">
            <div className="border-b border-zinc-200 pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">FEATURED STORIES</h3>
            </div>

            <div className="space-y-6">
              {remainingArticles.slice(0, 2).map((article) => (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="group cursor-pointer flex flex-col justify-between py-4 border-b border-zinc-200 last:border-0 first:pt-0 bg-transparent editorial-hover animate-fade-in"
                >
                  <div>
                    {/* Large image for featured wire cards */}
                    <div className="overflow-hidden bg-zinc-100 rounded aspect-[16/9] mb-3.5 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                      <span>{article.category}</span>
                      {article.isBreaking && (
                        <span className="bg-red-50 text-red-600 border border-red-200 px-1 py-0.2 rounded text-[8px]">
                          Breaking
                        </span>
                      )}
                    </div>
                    <h3 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-150 flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                    <span>By {article.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
