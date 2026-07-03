"use client";

import React from "react";
import { Article } from "../data/news";

interface LeadStoryProps {
  leadArticle: Article;
  secondaryArticles: Article[];
  subArticles?: Article[];
  onSelectArticle: (id: string) => void;
  settings?: Record<string, any>;
  designStyle?: string;
}

export default function LeadStory({
  leadArticle,
  secondaryArticles,
  subArticles = [],
  onSelectArticle,
  settings,
  designStyle,
}: LeadStoryProps) {
  if (!leadArticle) return null;

  const style = designStyle || settings?.designStyle || 'hero-split';

  const isBoxed = settings?.isBoxed === true || style === 'hero-boxed';
  const boxBgColor = typeof settings?.boxBgColor === 'string' ? settings.boxBgColor : '#f9fafb';
  const boxBorderColor = typeof settings?.boxBorderColor === 'string' ? settings.boxBorderColor : '#e5e7eb';
  const boxBorderThickness = typeof settings?.boxBorderThickness === 'string' ? settings.boxBorderThickness : '1px';
  const boxRounded = typeof settings?.boxRounded === 'string' ? settings.boxRounded : '8px';

  const boxedStyle: React.CSSProperties = isBoxed ? {
    backgroundColor: boxBgColor,
    border: boxBorderThickness === '0px' ? 'none' : `${boxBorderThickness} solid ${boxBorderColor}`,
    borderRadius: boxRounded,
    padding: '1.5rem',
  } : {};

  const titleText = typeof settings?.titleText === 'string' && settings.titleText !== ''
    ? settings.titleText
    : leadArticle.title;
  const titleColor = typeof settings?.titleColor === 'string' ? settings.titleColor : '#18181b';

  const excerptText = typeof settings?.excerptText === 'string' && settings.excerptText !== ''
    ? settings.excerptText
    : `${leadArticle.excerpt} ${leadArticle.content[0]}`;
  const excerptColor = typeof settings?.excerptColor === 'string' ? settings.excerptColor : '#4b5563';

  // Render Lead Story row according to selected style
  const renderLeadRow = () => {
    if (style === 'hero-minimal') {
      return (
        <div
          className="flex flex-col gap-4 cursor-pointer group w-full"
          onClick={() => onSelectArticle(leadArticle.id)}
        >
          {/* Text content only */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                  Lead Story
                </span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {leadArticle.category}
                </span>
              </div>
              <h2 className="font-editorial-title text-2xl sm:text-3.5xl lg:text-5xl font-extrabold leading-tight tracking-tight group-hover:text-zinc-700 transition" style={{ color: titleColor }}>
                {titleText}
              </h2>
              <p className="mt-3 text-sm leading-relaxed font-sans" style={{ color: excerptColor,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                {excerptText}
              </p>
            </div>
            <div className="mt-5 border-t border-zinc-150 pt-3 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
              <div>
                By <span className="font-semibold text-zinc-850">{leadArticle.author}</span>
                <span className="text-zinc-400"> • {leadArticle.date}</span>
              </div>
              <span className="font-semibold text-zinc-700">{leadArticle.readTime}</span>
            </div>
          </div>
        </div>
      );
    }

    if (style === 'hero-full') {
      return (
        <div
          className="flex flex-col gap-5 cursor-pointer group w-full items-stretch"
          onClick={() => onSelectArticle(leadArticle.id)}
        >
          {/* Large Image on Top — Taller aspect-ratio */}
          <div className="w-full overflow-hidden relative aspect-[16/9] min-h-[300px] sm:min-h-[380px] bg-zinc-100 rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leadArticle.image}
              alt={leadArticle.title}
              className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
            />
          </div>
          {/* Text content below */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                  Lead Story
                </span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {leadArticle.category}
                </span>
              </div>
              <h2 className="font-editorial-title text-2xl sm:text-3.5xl lg:text-4.5xl font-extrabold leading-tight tracking-tight group-hover:text-zinc-750 transition" style={{ color: titleColor }}>
                {titleText}
              </h2>
              <p className="mt-3 text-sm leading-relaxed font-sans line-clamp-3" style={{ color: excerptColor }}>
                {excerptText}
              </p>
            </div>
            <div className="mt-4 border-t border-zinc-150 pt-2.5 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
              <div>
                By <span className="font-semibold text-zinc-850">{leadArticle.author}</span>
                <span className="text-zinc-400"> • {leadArticle.date}</span>
              </div>
              <span className="font-semibold text-zinc-700">{leadArticle.readTime}</span>
            </div>
          </div>
        </div>
      );
    }

    if (style === 'hero-card-grid') {
      return (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full items-stretch">
          <div
            className="flex-1 flex flex-col justify-between cursor-pointer group"
            onClick={() => onSelectArticle(leadArticle.id)}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                  Lead Story
                </span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {leadArticle.category}
                </span>
              </div>
              <h2 className="font-editorial-title text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight group-hover:text-zinc-750 transition" style={{ color: titleColor }}>
                {titleText}
              </h2>
              <p className="mt-3 text-sm leading-relaxed font-sans line-clamp-4" style={{ color: excerptColor }}>
                {excerptText}
              </p>
            </div>
            <div className="mt-5 border-t border-zinc-150 pt-3 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
              <div>
                By <span className="font-semibold text-zinc-850">{leadArticle.author}</span>
                <span className="text-zinc-400"> • {leadArticle.date}</span>
              </div>
              <span className="font-semibold text-zinc-700">{leadArticle.readTime}</span>
            </div>
          </div>
          <div 
            className="flex-1 overflow-hidden relative aspect-[4/3] bg-zinc-100 rounded-sm cursor-pointer group"
            onClick={() => onSelectArticle(leadArticle.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leadArticle.image}
              alt={leadArticle.title}
              className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
            />
          </div>
        </div>
      );
    }

    // === NEW LAYOUT 1: Editorial Spotlight — headline + small image SAME ROW, excerpt below ===
    if (style === 'editorial-spotlight') {
      return (
        <div
          className="flex flex-col gap-3 cursor-pointer group w-full"
          onClick={() => onSelectArticle(leadArticle.id)}
        >
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">Lead Story</span>
            <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest">{leadArticle.category}</span>
          </div>
          {/* Headline only — NO image */}
          <div className="flex flex-row items-start">
            <h2
              className="flex-1 font-editorial-title text-2xl sm:text-3xl lg:text-3.5xl font-extrabold leading-tight tracking-tight group-hover:text-zinc-600 transition"
              style={{ color: titleColor }}
            >
              {titleText}
            </h2>
          </div>
          {/* Excerpt — full width below the row */}
          <p
            className="text-sm leading-relaxed font-sans"
            style={{
              color: excerptColor,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden"
            }}
          >
            {excerptText}
          </p>
          {/* Meta row */}
          <div className="border-t border-zinc-100 pt-2.5 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
            <span>By <span className="font-semibold text-zinc-700">{leadArticle.author}</span> • {leadArticle.date}</span>
            <span className="font-semibold text-zinc-600">{leadArticle.readTime}</span>
          </div>
        </div>
      );
    }

    // === NEW LAYOUT 2: Cover Story — full bleed image, text overlaid at bottom ===
    if (style === 'cover-story') {
      return (
        <div
          className="relative overflow-hidden rounded-sm cursor-pointer group w-full flex items-end border border-zinc-200 shadow-sm"
          style={{ minHeight: '420px' }}
          onClick={() => onSelectArticle(leadArticle.id)}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={leadArticle.image}
            alt={leadArticle.title}
            className="w-full h-full object-cover filter brightness-[0.65] group-hover:scale-101 transition duration-700 absolute inset-0 z-0"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          {/* Text overlaid at bottom */}
          <div className="relative z-20 p-6 md:p-8 w-full text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red-600 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                Lead Story
              </span>
              <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest">{leadArticle.category}</span>
            </div>
            <h2 className="font-editorial-title text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight group-hover:text-zinc-200 transition" style={{ color: '#ffffff' }}>
              {titleText}
            </h2>
            <p
              className="mt-3 text-xs sm:text-sm leading-relaxed font-sans text-zinc-300 max-w-2xl"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {excerptText}
            </p>
            <div className="mt-4 border-t border-white/20 pt-3 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
              <div>
                By <span className="font-semibold text-white">{leadArticle.author}</span>
                <span className="text-zinc-400"> • {leadArticle.date}</span>
              </div>
              <span className="font-semibold text-zinc-200">{leadArticle.readTime}</span>
            </div>
          </div>
        </div>
      );
    }

    // === NEW LAYOUT 3: Classic Broadsheet — big bold headline, no image, print style ===
    if (style === 'classic-broadsheet') {
      return (
        <div
          className="cursor-pointer group w-full border-t-4 border-zinc-900 pt-4"
          onClick={() => onSelectArticle(leadArticle.id)}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">Lead Story</span>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{leadArticle.category}</span>
            <div className="flex-1 border-b border-zinc-300" />
          </div>
          <h2 className="font-editorial-title text-3xl sm:text-4.5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight group-hover:text-zinc-600 transition" style={{ color: titleColor }}>
            {titleText}
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-200 pt-4">
            <p
              className="text-sm leading-relaxed font-sans"
              style={{
                color: excerptColor,
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {excerptText}
            </p>
            <div className="flex flex-col justify-between">
              <p className="text-xs text-zinc-400 font-sans leading-relaxed italic line-clamp-4">
                "{leadArticle.excerpt}"
              </p>
              <div className="mt-4 border-t border-zinc-200 pt-3 flex items-center justify-between text-[10px] text-zinc-500 font-sans">
                <span>By <span className="font-semibold text-zinc-700">{leadArticle.author}</span> • {leadArticle.date}</span>
                <span className="font-semibold text-zinc-600">{leadArticle.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // === NEW LAYOUT 4: Split Detail — LEFT image (40%), RIGHT: headline + full 5-line excerpt + meta ===
    if (style === 'split-detail') {
      return (
        <div
          className="flex flex-col md:flex-row gap-6 cursor-pointer group w-full items-stretch"
          onClick={() => onSelectArticle(leadArticle.id)}
        >
          {/* Image LEFT */}
          <div className="md:w-[42%] flex-shrink-0 overflow-hidden relative aspect-[4/3] md:aspect-auto min-h-[200px] bg-zinc-100 rounded-sm border border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leadArticle.image}
              alt={leadArticle.title}
              className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
            />
          </div>
          {/* Text RIGHT */}
          <div className="flex-1 flex flex-col justify-center border-l-4 border-red-700 pl-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">Lead Story</span>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{leadArticle.category}</span>
            </div>
            <h2 className="font-editorial-title text-xl sm:text-2.5xl lg:text-3xl font-extrabold leading-tight tracking-tight group-hover:text-red-700 transition" style={{ color: titleColor }}>
              {titleText}
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed font-sans"
              style={{
                color: excerptColor,
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {excerptText}
            </p>
            <div className="mt-4 border-t border-zinc-100 pt-3 flex items-center justify-between text-[10px] text-zinc-500 font-sans">
              <div>
                By <span className="font-semibold text-zinc-700">{leadArticle.author}</span>
                <span className="text-zinc-400"> • {leadArticle.date}</span>
              </div>
              <span className="font-semibold text-zinc-600">{leadArticle.readTime}</span>
            </div>
          </div>
        </div>
      );
    }

    // === NEW LAYOUT 5: Featured Card — boxed card with image RIGHT + headline only excerpt short ===
    if (style === 'featured-card') {
      return (
        <div
          className="flex flex-col md:grid md:grid-cols-12 gap-5 cursor-pointer group w-full bg-zinc-50/60 border border-zinc-200 rounded-xl p-5 shadow-sm overflow-hidden"
          onClick={() => onSelectArticle(leadArticle.id)}
        >
          {/* Text LEFT (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-zinc-900 text-white font-extrabold px-2.5 py-0.5 text-[9px] uppercase tracking-wider rounded-sm">
                  Lead Story
                </span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{leadArticle.category}</span>
              </div>
              <h2 className="font-editorial-title text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight group-hover:text-[#6366f1] transition" style={{ color: titleColor }}>
                {titleText}
              </h2>
              <p
                className="mt-3 text-xs leading-relaxed font-sans"
                style={{
                  color: excerptColor,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {excerptText}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-sans">
              <div>
                By <span className="font-semibold text-zinc-700">{leadArticle.author}</span>
                <span className="text-zinc-400"> • {leadArticle.date}</span>
              </div>
              <span className="font-semibold text-zinc-600">{leadArticle.readTime}</span>
            </div>
          </div>
          {/* Image RIGHT (5 cols) */}
          <div className="md:col-span-5 overflow-hidden relative aspect-[4/3] md:aspect-auto min-h-[160px] bg-zinc-100 rounded-lg border border-zinc-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leadArticle.image}
              alt={leadArticle.title}
              className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
            />
          </div>
        </div>
      );
    }

    // Default: 'hero-split' or 'hero-boxed'
    return (
      <div
        className="flex flex-col md:flex-row gap-6 cursor-pointer group items-stretch animate-fade-in"
        onClick={() => onSelectArticle(leadArticle.id)}
      >
        {/* Text content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="bg-red-700 text-white font-extrabold px-2 py-0.5 text-[9px] uppercase tracking-wider">
                Lead Story
              </span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                {leadArticle.category}
              </span>
              {leadArticle.isBreaking && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              )}
            </div>

            <h2 className="font-editorial-title text-2xl sm:text-3.5xl lg:text-4.5xl font-extrabold leading-tight tracking-tight group-hover:text-zinc-700 transition" style={{ color: titleColor }}>
              {titleText}
            </h2>

            <p
              className="mt-3 text-sm leading-relaxed font-sans"
              style={{
                color: excerptColor,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {excerptText}
            </p>
          </div>

          <div className="mt-5 border-t border-zinc-150 pt-3 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
            <div>
              By <span className="font-semibold text-zinc-850">{leadArticle.author}</span>
              <span className="text-zinc-400"> • {leadArticle.date}</span>
            </div>
            <span className="font-semibold text-zinc-700">{leadArticle.readTime}</span>
          </div>
        </div>

        {/* Large Image */}
        <div className="flex-1 overflow-hidden relative aspect-[3/2] md:aspect-auto min-h-[200px] md:min-h-0 bg-zinc-100 rounded-sm w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={leadArticle.image}
            alt={leadArticle.title}
            className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
          />
        </div>
      </div>
    );
  };

  // ─── Per-layout sub-article and right-column renderers ───────────────────────

  /** Right column: Breaking Updates with image thumbnail per article */
  const renderRightWithImages = (articles: Article[], limit = 3) => (
    <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-4">
      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-1">
        Breaking Updates
      </div>
      <div className="flex flex-col gap-4">
        {articles.slice(0, limit).map((article, idx) => (
          <div
            key={article.id}
            className="group cursor-pointer"
            onClick={() => onSelectArticle(article.id)}
          >
            {/* Image thumbnail */}
            <div className="w-full overflow-hidden relative aspect-[16/7] bg-zinc-100 rounded-sm mb-2 border border-zinc-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
              />
            </div>
            <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">{article.category}</span>
            <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition mt-0.5">
              {article.title}
            </h3>
            <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2 font-sans">{article.excerpt}</p>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
              <span>By <span className="font-medium text-zinc-500">{article.author}</span> • {article.date}</span>
              <span className="font-semibold text-zinc-600">{article.readTime}</span>
            </div>
            {idx < Math.min(limit, articles.length) - 1 && <div className="border-b border-zinc-200 mt-3" />}
          </div>
        ))}
      </div>
    </div>
  );

  /** Right column: Breaking Updates with image + extra article (4 total) */
  const renderRightWithImagesExtra = (articles: Article[], limit = 4) =>
    renderRightWithImages(articles, limit);

  /** Right column: standard text-only */
  const renderRightStandard = (articles: Article[]) => (
    <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-5 justify-between">
      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-1">
        Breaking Updates
      </div>
      <div className="flex-1 flex flex-col justify-between gap-4">
        {articles.map((article, idx) => (
          <div
            key={article.id}
            className="group cursor-pointer flex flex-col justify-between py-1.5 first:pt-0 last:pb-0"
            onClick={() => onSelectArticle(article.id)}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">{article.category}</span>
              </div>
              <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition">
                {article.title}
              </h3>
              <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2">{article.excerpt}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
              <span>By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}</span>
              <span className="font-semibold text-zinc-700">{article.readTime}</span>
            </div>
            {idx < articles.length - 1 && <div className="border-b border-zinc-200 mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Main layout return ────────────────────────────────────────────────────

  // EDITORIAL SPOTLIGHT: headline + image in same row lead, right column = horizontal image+headline cards
  if (style === 'editorial-spotlight') {
    return (
      <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none transition-all duration-300">
        <div style={boxedStyle}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col justify-start">
              {renderLeadRow()}
              <div className="border-t border-zinc-200 mt-4 pt-3" />
              {/* Sub-articles: same horizontal card style — small image + headline in one row */}
              <div className="flex flex-col gap-4 mt-3">
                {subArticles.slice(0, 4).map((article, idx) => (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex flex-row gap-3 items-start py-2 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 px-1 rounded transition-colors"
                  >
                    {/* Small thumbnail */}
                    <div className="w-20 sm:w-24 flex-shrink-0 overflow-hidden relative rounded-sm border border-zinc-200" style={{ aspectRatio: '4/3' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover absolute inset-0 filter brightness-95 group-hover:scale-101 transition duration-500"
                      />
                    </div>
                    {/* Text */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-0.5">{article.category}</div>
                      <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition">{article.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">{article.excerpt}</p>
                      <div className="mt-1 text-[10px] text-zinc-400 font-sans">By <span className="font-medium text-zinc-500">{article.author}</span> • {article.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Breaking Updates — text only, 5 articles, no images */}
            <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-4">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-1">Breaking Updates</div>
              <div className="flex flex-col gap-0">
                {secondaryArticles.slice(0, 5).map((article, idx) => (
                  <div
                    key={article.id}
                    className="group cursor-pointer py-3 border-b border-zinc-100 last:border-0"
                    onClick={() => onSelectArticle(article.id)}
                  >
                    <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">{article.category}</span>
                    <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition mt-0.5">{article.title}</h3>
                    <p className="mt-0.5 text-[11px] text-zinc-500 line-clamp-2 font-sans">{article.excerpt}</p>
                    <div className="mt-1 text-[10px] text-zinc-400 font-sans">{article.date} · {article.readTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // COVER STORY: full-width lead, right column with one extra (4 total)
  if (style === 'cover-story') {
    return (
      <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none transition-all duration-300">
        <div style={boxedStyle}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col justify-start">
              {renderLeadRow()}
              <div className="border-t border-zinc-200 mt-4 pt-3" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 mt-3">
                {subArticles.slice(0, 4).map((article) => (
                  <div key={article.id} onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex flex-col justify-start py-1 hover:bg-zinc-50/50 px-2 rounded transition-colors duration-150">
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">{article.category}</div>
                    <h3 className="font-editorial-title text-[13px] sm:text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition">{article.title}</h3>
                    <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">{article.excerpt}</p>
                    <div className="mt-2 text-[10px] text-zinc-400 font-sans">By <span className="font-medium text-zinc-500">{article.author}</span> • {article.date}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: 4 articles (extra one) */}
            {renderRightWithImagesExtra(secondaryArticles, 4)}
          </div>
        </div>
      </section>
    );
  }

  // CLASSIC BROADSHEET: no image lead, right side shows one extra news (no author/date/time)
  if (style === 'classic-broadsheet') {
    return (
      <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none transition-all duration-300">
        <div style={boxedStyle}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col justify-start">
              {renderLeadRow()}
              <div className="border-t border-zinc-200 mt-4 pt-3" />
               {/* Sub-articles: only 1 horizontal article with image left, details right */}
              <div className="mt-3">
                {subArticles.slice(0, 1).map((article) => (
                  <div key={article.id} onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex flex-col md:flex-row gap-5 items-stretch py-2 hover:bg-zinc-50/50 px-2 rounded transition-colors duration-150">
                    {/* Image left */}
                    <div className="md:w-[35%] flex-shrink-0 overflow-hidden relative aspect-[4/3] md:aspect-auto min-h-[160px] rounded-sm border border-zinc-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover absolute inset-0 filter brightness-95 group-hover:scale-101 transition duration-500"
                      />
                    </div>
                    {/* Text right */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">{article.category}</div>
                      <h3 className="font-editorial-title text-base sm:text-lg lg:text-xl font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">{article.title}</h3>
                      <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 line-clamp-3 leading-relaxed font-sans">{article.content?.[0] || article.excerpt}</p>
                      <div className="mt-2.5 text-[10px] text-zinc-400 font-sans">
                        By <span className="font-medium text-zinc-550">{article.author}</span> • {article.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: extra news (5 total), NO author/date/time */}
            <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-4">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-1">Breaking Updates</div>
              <div className="flex flex-col gap-4">
                {secondaryArticles.slice(0, 5).map((article, idx) => (
                  <div key={article.id} className="group cursor-pointer" onClick={() => onSelectArticle(article.id)}>
                    <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">{article.category}</span>
                    <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition mt-0.5">{article.title}</h3>
                    <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2 font-sans">{article.excerpt}</p>
                    {idx < 4 && <div className="border-b border-zinc-200 mt-3" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // SPLIT DETAIL: lead row spans full left, only 2 sub-articles (bigger headline, 4-line desc), right: 1 article, tall image
  if (style === 'split-detail') {
    return (
      <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none transition-all duration-300">
        <div style={boxedStyle}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col justify-start">
              {renderLeadRow()}
              <div className="border-t border-zinc-200 mt-4 pt-3" />
              {/* Only 2 sub-articles, bigger headline, 4-line description */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-3">
                {subArticles.slice(0, 2).map((article) => (
                  <div key={article.id} onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex flex-col justify-start py-1 hover:bg-zinc-50/50 px-2 rounded transition-colors duration-150">
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">{article.category}</div>
                    <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition">{article.title}</h3>
                    <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed font-sans"
                      style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {article.content?.[0] || article.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Breaking Updates — 1 article only, taller image, 5-line description */}
            <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-4">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-1">Breaking Updates</div>
              {secondaryArticles.slice(0, 1).map((article) => (
                <div
                  key={article.id}
                  className="group cursor-pointer"
                  onClick={() => onSelectArticle(article.id)}
                >
                  {/* Taller image */}
                  <div className="w-full overflow-hidden relative aspect-[16/9] bg-zinc-100 rounded-sm mb-3 border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
                    />
                  </div>
                  <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">{article.category}</span>
                  <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition mt-0.5">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-zinc-500 leading-relaxed font-sans"
                    style={{ display: '-webkit-box', WebkitLineClamp: 7, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                    {article.content?.[0] || article.excerpt}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                    <span>By <span className="font-medium text-zinc-500">{article.author}</span> • {article.date}</span>
                    <span className="font-semibold text-zinc-600">{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // FEATURED CARD: standard 4-grid sub-articles, standard right column
  if (style === 'featured-card') {
    return (
      <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none transition-all duration-300">
        <div style={boxedStyle}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col justify-start">
              {renderLeadRow()}
              <div className="border-t border-zinc-200 mt-4 pt-3" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 mt-3">
                {subArticles.slice(0, 4).map((article) => (
                  <div key={article.id} onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex flex-col justify-start py-1 hover:bg-zinc-50/50 px-2 rounded transition-colors duration-150">
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">{article.category}</div>
                    <h3 className="font-editorial-title text-[13px] sm:text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition">{article.title}</h3>
                    <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">{article.excerpt}</p>
                    <div className="mt-2 text-[10px] text-zinc-400 font-sans">By <span className="font-medium text-zinc-500">{article.author}</span> • {article.date}</div>
                  </div>
                ))}
              </div>
            </div>
            {renderRightStandard(secondaryArticles)}
          </div>
        </div>
      </section>
    );
  }

  // HERO MINIMAL (headline only): completely text-only design, NO images anywhere
  if (style === 'hero-minimal') {
    return (
      <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none transition-all duration-300">
        <div style={boxedStyle}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Main story + Sub-articles (no images) */}
            <div className="lg:col-span-8 flex flex-col justify-start">
              {renderLeadRow()}
              <div className="border-t border-zinc-200 mt-5 pt-4" />
              {/* Headline-only sub-articles grid (4 items) */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 mt-3">
                {subArticles.slice(0, 4).map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className="group cursor-pointer flex flex-col justify-start py-2 hover:bg-zinc-50/50 px-2.5 rounded transition-colors duration-150 border-l-2 border-zinc-200 hover:border-red-700 pl-3.5"
                  >
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">{article.category}</div>
                    <h3 className="font-editorial-title text-sm sm:text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">{article.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">{article.content?.[0] || article.excerpt}</p>
                    <div className="mt-2 text-[10px] text-zinc-400 font-sans">
                      By <span className="font-medium text-zinc-550">{article.author}</span> • {article.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right side: Breaking Updates — 5 items text-only, no images */}
            <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-4">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-1">Breaking Updates</div>
              <div className="flex flex-col gap-0">
                {secondaryArticles.slice(0, 5).map((article, idx) => (
                  <div
                    key={article.id}
                    className="group cursor-pointer py-3 border-b border-zinc-150 last:border-0"
                    onClick={() => onSelectArticle(article.id)}
                  >
                    <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">{article.category}</span>
                    <h3 className="font-editorial-title text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition mt-0.5">{article.title}</h3>
                    <p className="mt-0.5 text-[11px] text-zinc-550 line-clamp-2 font-sans">{article.content?.[0] || article.excerpt}</p>
                    <div className="mt-1.5 text-[10px] text-zinc-400 font-sans">{article.date} · {article.readTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // HERO FULL (wide banner + text): taller image, 1 breaking updates with taller image, 3 sub-articles spanning full-width below
  if (style === 'hero-full') {
    return (
      <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none transition-all duration-300">
        <div style={boxedStyle}>
          {/* Top Row: Lead Story (8 cols) + Breaking Updates (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col justify-start">
              {renderLeadRow()}
            </div>
            
            {/* Right: Breaking Updates — 2 articles. First is text-only, second is below with image + 5 lines description */}
            <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-5">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-1">Breaking Updates</div>
              
              {/* First article: text-only */}
              {secondaryArticles.slice(0, 1).map((article) => (
                <div
                  key={article.id}
                  className="group cursor-pointer"
                  onClick={() => onSelectArticle(article.id)}
                >
                  <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">{article.category}</span>
                  <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition mt-0.5">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-zinc-500 line-clamp-3 font-sans">
                    {article.excerpt}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                    <span>By <span className="font-medium text-zinc-500">{article.author}</span> • {article.date}</span>
                    <span className="font-semibold text-zinc-600">{article.readTime}</span>
                  </div>
                </div>
              ))}

              <div className="border-b border-zinc-200" />

              {/* Second article: with image + 5 lines description */}
              {secondaryArticles.slice(1, 2).map((article) => (
                <div
                  key={article.id}
                  className="group cursor-pointer"
                  onClick={() => onSelectArticle(article.id)}
                >
                  <div className="w-full overflow-hidden relative aspect-video bg-zinc-100 rounded-sm mb-3 border border-zinc-200 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
                    />
                  </div>
                  <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">{article.category}</span>
                  <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition mt-0.5">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-zinc-500 leading-relaxed font-sans"
                    style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                    {article.content?.[0] || article.excerpt}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                    <span>By <span className="font-medium text-zinc-500">{article.author}</span> • {article.date}</span>
                    <span className="font-semibold text-zinc-600">{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider line spanning full 12 cols */}
          <div className="border-t border-zinc-200 mt-6 pt-5" />

          {/* Bottom row: Sub-articles spanning the full 12 columns — 3 in one row (no border, no description) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-1">
            {subArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="group cursor-pointer flex flex-col justify-start py-2 hover:bg-zinc-50/50 px-2 rounded transition-colors duration-150"
              >
                <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">
                  {article.category}
                </div>
                <h3 className="font-editorial-title text-sm sm:text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-655 transition">
                  {article.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                  <span>By <span className="font-medium text-zinc-500">{article.author}</span> • {article.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // DEFAULT (hero-split, hero-boxed, hero-card-grid): full 4-grid + standard right column
  return (
    <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none transition-all duration-300">
      <div style={boxedStyle}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Side: The Main Lead Story + Sub-articles (Takes 8/12 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col justify-start">
            {renderLeadRow()}

            {/* Divider line below the lead story */}
            <div className="border-t border-zinc-200 mt-4 pt-3" />

            {/* Balanced design: 4 news headlines in a 2x2 row-column design (2 left, 2 right) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 mt-3">
              {subArticles.slice(0, 4).map((article) => (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="group cursor-pointer flex flex-col justify-start py-1 hover:bg-zinc-50/50 px-2 rounded transition-colors duration-150"
                >
                  <div>
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">
                      {article.category}
                    </div>
                    <h3 className="font-editorial-title text-[13px] sm:text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-655 transition">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-550 line-clamp-2 leading-relaxed font-sans">
                      {article.excerpt}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                      <span>
                        By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}
                      </span>
                      <span className="font-semibold text-zinc-700">{article.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Column of Secondary/Trending news (Takes 4/12 cols, divided by a vertical line) */}
          <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 flex flex-col gap-5 justify-between">
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-1">
              Breaking Updates
            </div>

            <div className="flex-1 flex flex-col justify-between gap-4">
              {secondaryArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="group cursor-pointer flex flex-col justify-between py-1.5 first:pt-0 last:pb-0"
                  onClick={() => onSelectArticle(article.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] text-red-700 font-extrabold uppercase tracking-widest">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 transition">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                    <span>
                      By <span className="text-zinc-500 font-medium">{article.author}</span> • {article.date}
                    </span>
                    <span className="font-semibold text-zinc-700">{article.readTime}</span>
                  </div>
                  {idx < secondaryArticles.length - 1 && (
                    <div className="border-b border-zinc-200 mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
