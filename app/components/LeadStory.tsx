"use client";

import React from "react";
import { Article } from "../data/news";

interface LeadStoryProps {
  leadArticle: Article;
  secondaryArticles: Article[];
  subArticles?: Article[];
  onSelectArticle: (id: string) => void;
}

export default function LeadStory({
  leadArticle,
  secondaryArticles,
  subArticles = [],
  onSelectArticle,
}: LeadStoryProps) {
  if (!leadArticle) return null;

  return (
    <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: The Main Lead Story + Sub-articles (Takes 8/12 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col justify-start">

          {/* Main Hero Story Row (text on left, image on right) */}
          <div
            className="flex flex-col md:flex-row gap-6 cursor-pointer group items-stretch"
            onClick={() => onSelectArticle(leadArticle.id)}
          >
            {/* Text content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Category and Live tags */}
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

                {/* Title */}
                <h2 className="font-editorial-title text-2xl sm:text-3.5xl lg:text-4.5xl font-extrabold text-zinc-900 leading-tight tracking-tight group-hover:text-zinc-700 transition">
                  {leadArticle.title}
                </h2>

                {/* Excerpt */}
                <p
                  className="mt-3 text-sm text-zinc-650 leading-relaxed font-sans"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {leadArticle.excerpt} {leadArticle.content[0]}
                </p>
              </div>

              {/* Author Details and Read info */}
              <div className="mt-5 border-t border-zinc-150 pt-3 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
                <div>
                  By <span className="font-semibold text-zinc-800">{leadArticle.author}</span>
                  <span className="text-zinc-400"> • {leadArticle.authorTitle}</span>
                </div>
              </div>
            </div>

            {/* Large Image (aligns perfectly top-and-bottom with text layout on desktop) */}
            <div className="flex-1 overflow-hidden relative aspect-[3/2] md:aspect-auto min-h-[200px] md:min-h-0 bg-zinc-100 rounded-sm w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leadArticle.image}
                alt={leadArticle.title}
                className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 group-hover:brightness-100 transition-all duration-500 absolute inset-0"
              />
            </div>
          </div>

          {/* Divider line below the lead story (drawn closely to the content) */}
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
                  <h3 className="font-editorial-title text-[13px] sm:text-sm font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">
                    {article.excerpt}
                  </p>
                  <div className="mt-2 text-[10px] text-zinc-400 font-sans">
                    By {article.author}
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

                <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>By {article.author}</span>
                </div>
                {idx < secondaryArticles.length - 1 && (
                  <div className="border-b border-zinc-200 mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
