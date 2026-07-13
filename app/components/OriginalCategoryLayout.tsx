"use client";

/**
 * OriginalCategoryLayout
 *
 * This is the SINGLE SOURCE OF TRUTH for the "Original Editorial Layout".
 * It is used by:
 *   1. app/[category]/page.tsx  — the live public category page
 *   2. app/components/CategoryPageExperience.tsx — admin panel preview
 *
 * Any visual change made here will automatically be reflected in both places.
 */

import React from "react";

export interface OriginalArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  commentsCount?: number;
}

interface OriginalCategoryLayoutProps {
  /** Canonical category name, e.g. "US", "Technology" */
  decodedCategory: string;
  /** Hero article (articles[0]) */
  heroArticle: OriginalArticle | null;
  /** Spotlight articles (articles[1..3]) */
  spotlightArticles: OriginalArticle[];
  /** Main list articles (articles[4..10]) */
  leftListArticles: OriginalArticle[];
  /** Sidebar articles — trending or extra */
  sidebarArticles: OriginalArticle[];
  /** Sidebar section title */
  sidebarTitle: string;
  /** Whether to show the sidebar column */
  isVisibleSidebar: boolean;
  /** Whether to show the spotlight digest row */
  isVisibleSpotlight: boolean;
  /** Called when user clicks any article */
  onArticleClick: (id: string) => void;
  /** Custom label for 'Latest in {Category}' (optional) */
  latestInLabel?: string;
  /** Custom label for '{Category} SPOTLIGHT DIGEST' (optional) */
  spotlightDigestLabel?: string;
}

export default function OriginalCategoryLayout({
  decodedCategory,
  heroArticle,
  spotlightArticles,
  leftListArticles,
  sidebarArticles,
  sidebarTitle,
  isVisibleSidebar,
  isVisibleSpotlight,
  onArticleClick,
  latestInLabel,
  spotlightDigestLabel,
}: OriginalCategoryLayoutProps) {
  return (
    <>
      {/* ── Hero Feature Story ────────────────────────────────────────── */}
      {heroArticle && (
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 cursor-pointer group mb-10 pb-10 border-b border-zinc-200"
          onClick={() => onArticleClick(heroArticle.id)}
        >
          {/* Left: large image (7/12) */}
          <div className="lg:col-span-7 overflow-hidden relative aspect-[16/10] bg-zinc-100 rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroArticle.image}
              alt={heroArticle.title}
              className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
            />
          </div>

          {/* Right: text (5/12) */}
          <div className="lg:col-span-5 flex flex-col justify-between py-1">
            <div>
              <span className="text-[10px] text-red-700 font-extrabold uppercase tracking-widest mb-2.5 block">
                {latestInLabel?.trim() || `Latest in ${decodedCategory}`}
              </span>
              <h2 className="font-editorial-title text-2xl sm:text-3.5xl font-extrabold text-zinc-900 leading-tight tracking-tight group-hover:text-zinc-700 transition">
                {heroArticle.title}
              </h2>
              <p className="mt-3 text-sm text-zinc-650 leading-relaxed font-sans line-clamp-[13]">
                {heroArticle.excerpt}
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-3 flex items-center justify-between text-[11px] text-zinc-400 font-sans">
              <span>
                By{" "}
                <span className="font-semibold text-zinc-700">
                  {heroArticle.author}
                </span>{" "}
                • {heroArticle.date}
              </span>
              <span className="font-semibold text-zinc-700">
                {heroArticle.readTime}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Spotlight Digest Row ─────────────────────────────────────── */}
      {isVisibleSpotlight && spotlightArticles.length > 0 && (
        <div className="mb-10 border-t border-b border-zinc-200/70 py-8">
          <div className="mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 font-sans text-red-700">
              &bull; {spotlightDigestLabel?.trim() || `${decodedCategory.toUpperCase()} SPOTLIGHT DIGEST`}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlightArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onArticleClick(article.id)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden rounded-sm aspect-[16/9] mb-3 bg-zinc-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0"
                    />
                  </div>
                  <h4 className="font-editorial-title text-base font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1.5 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <span className="text-[10px] text-zinc-400 mt-3 font-sans block">
                  {article.author} &bull; {article.readTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Article List + Sidebar ───────────────────────────────────── */}
      {leftListArticles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start border-t border-zinc-200 pt-6">
          {/* Main list */}
          <div className={isVisibleSidebar ? "lg:col-span-8" : "lg:col-span-12"}>
            <div className="space-y-0">
              {leftListArticles.map((article, idx) => (
                <div
                  key={article.id}
                  onClick={() => onArticleClick(article.id)}
                  className={`group cursor-pointer flex gap-6 justify-between items-start py-5 ${
                    idx < leftListArticles.length - 1 ? "border-b border-zinc-150" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="mt-2.5 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                      <span>
                        By{" "}
                        <span className="text-zinc-550 font-medium">
                          {article.author}
                        </span>{" "}
                        &bull; {article.date}
                      </span>
                      <span className="font-semibold text-zinc-700">
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="w-24 sm:w-32 overflow-hidden rounded-sm aspect-[4/3] bg-zinc-100 flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          {isVisibleSidebar && sidebarArticles.length > 0 && (
            <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-8 lg:sticky lg:top-6 lg:self-start">
              <div className="border-b border-zinc-200 pb-1.5 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {sidebarTitle}
                </h3>
              </div>
              <div className="divide-y divide-zinc-100">
                {sidebarArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onArticleClick(article.id)}
                    className="group cursor-pointer py-3 first:pt-0"
                  >
                    <h4 className="font-editorial-title text-sm font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                      {article.title}
                    </h4>
                    <div className="mt-1 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                      <span>
                        By{" "}
                        <span className="text-zinc-550 font-medium">
                          {article.author}
                        </span>{" "}
                        • {article.date}
                      </span>
                      <span className="font-semibold text-zinc-700">
                        {article.readTime}
                      </span>
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
}
