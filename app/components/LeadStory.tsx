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
              <p className="mt-3 text-sm leading-relaxed font-sans" style={{ color: excerptColor }}>
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
          {/* Large Image on Top */}
          <div className="w-full overflow-hidden relative aspect-[21/9] min-h-[220px] bg-zinc-100 rounded-sm">
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
