"use client";

import React, { useState, useEffect } from "react";

import { DynamicBreakingNewsTicker } from "./Widgets";

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  bookmarkCount: number;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (val: boolean) => void;
}

export default function Header({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  bookmarkCount,
  showBookmarksOnly,
  setShowBookmarksOnly,
}: HeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [layoutSections, setLayoutSections] = useState<any[]>([]);

  useEffect(() => {
    async function loadCatsAndLayout() {
      try {
        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const data = await catRes.json();
          const visibleCats = data
            .filter((c: any) => c.isVisible !== false && c.articles > 0)
            .map((c: any) => c.name);
          setCategories(["All", ...visibleCats]);
        }

        const layoutRes = await fetch("/api/home-layout");
        if (layoutRes.ok) {
          const data = await layoutRes.json();
          if (data && data.sections) {
            setLayoutSections(data.sections);
          }
        }
      } catch (err) {
        console.error("Failed to load header data:", err);
      }
    }
    loadCatsAndLayout();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setShowBookmarksOnly(false);
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearchQuery("");
  };

  // Get current date string in US style
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  const renderDateSection = (sec: any) => {
    const dateBg = sec?.settings?.bgColor || '#ffffff';
    const dateCol = sec?.settings?.textColor || '#52525b';
    const dateAlign = sec?.settings?.alignment || 'spaced';
    const dateBorder = sec?.settings?.borderStyle || 'none';
    const dateBorderCol = sec?.settings?.borderColor || '#e4e4e7';
    const dateBorderCss = dateBorder === 'thin' ? `1px solid ${dateBorderCol}` : dateBorder === 'thick' ? `3px solid ${dateBorderCol}` : `1px solid #e4e4e7`;

    const dateAlignClass = dateAlign === 'left' ? 'justify-start gap-4' : dateAlign === 'center' ? 'justify-center gap-6' : dateAlign === 'right' ? 'justify-end gap-4' : 'justify-between';

    return (
      <div 
        key="date-section"
        className={`w-full py-2 px-4 sm:px-6 text-xs text-zinc-600 flex items-center transition-all ${dateAlignClass}`}
        style={{ backgroundColor: dateBg, color: dateCol, borderBottom: dateBorderCss }}
      >
        <span className="flex items-center gap-1.5 font-sans font-medium">
          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate}
        </span>
        {dateAlign === 'spaced' && (
          <span className="font-sans font-semibold text-zinc-500 text-[11px]">
            Washington, D.C.
          </span>
        )}
      </div>
    );
  };

  const renderDomainHeader = (sec: any) => {
    const isText = sec?.settings?.logoType !== 'image';
    const alignment = sec?.settings?.alignment || 'center';
    const logoSize = sec?.settings?.logoSize || '72px';
    const logoColor = sec?.settings?.logoColor || '#000000';
    const logoImg = sec?.settings?.logoImage || '';
    const tagline = sec?.settings?.taglineText || 'Truth, Clarity, and Perspective • Independent Journalism';
    const tagSize = sec?.settings?.taglineSize || '12px';
    const tagColor = sec?.settings?.taglineColor || '#71717a';
    const bgColor = sec?.settings?.bgColor || '#ffffff';

    const alignClass = alignment === 'left' ? 'items-start text-left' : alignment === 'right' ? 'items-end text-right' : 'items-center text-center';

    return (
      <div 
        key="domain-header"
        className={`w-full flex flex-col pt-2 pb-4 md:pt-4 md:pb-6 border-b border-zinc-200 px-4 transition-all ${alignClass}`}
        style={{ backgroundColor: bgColor }}
      >
        {isText ? (
          <div className="flex flex-col items-center select-none w-full">
            <h1 
              className="font-editorial-title font-extrabold tracking-tight cursor-pointer m-0 leading-none relative flex justify-center text-center select-none"
              style={{ fontSize: logoSize, color: logoColor }}
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                setLocalSearch("");
                setShowBookmarksOnly(false);
              }}
            >
              <span>D</span>
              <span className="relative inline-flex justify-center select-none">
                <span>OMAIN NAM</span>
                <span 
                  className="absolute top-full left-0 right-0 flex justify-between select-none pointer-events-none whitespace-nowrap"
                  style={{ transform: 'translateY(4px)' }}
                >
                  {tagline.toUpperCase().split('').map((char: string, i: number) => (
                    <span key={i} style={{ fontSize: tagSize, color: tagColor }} className="font-sans font-bold uppercase leading-none tracking-normal">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
              </span>
              <span>E</span>
            </h1>
            <div style={{ height: `calc(${tagSize} + 8px)` }} />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img 
              src={logoImg} 
              alt="Logo" 
              className="object-contain cursor-pointer max-h-16"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                setLocalSearch("");
                setShowBookmarksOnly(false);
              }}
            />
            <p 
              className="mt-1 text-[8px] sm:text-xs text-zinc-500 uppercase tracking-widest text-center m-0 font-sans"
              style={{ fontSize: tagSize, color: tagColor }}
            >
              {tagline}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderCategoryNav = (sec: any) => {
    const bgColor = sec?.settings?.bgColor || '#ffffff';
    const alignment = sec?.settings?.alignment || 'center';
    const searchPlacement = sec?.settings?.searchPlacement || 'right';
    const activeDesign = sec?.settings?.activeLinkDesign || 'underline';
    const searchPlaceholder = sec?.settings?.searchPlaceholder || 'Search articles...';
    const searchBorderColor = sec?.settings?.searchBorderColor || '#e4e4e7';
    const searchBorderThickness = sec?.settings?.searchBorderThickness || '1px';

    const alignClass = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center';

    return (
      <div 
        key="category-nav"
        className="w-full border-b border-zinc-400 py-1.5 md:py-0 transition-all"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 gap-3 md:gap-0">
          <nav className={`flex items-center gap-0 overflow-x-auto no-scrollbar w-full md:w-auto flex-1 ${alignClass}`}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowBookmarksOnly(false);
                }}
                className={`py-2 px-3 text-xs md:text-sm font-medium transition-all hover:bg-zinc-50 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat && !showBookmarksOnly
                    ? activeDesign === 'underline'
                      ? "text-black border-b-2 border-black font-semibold"
                      : "bg-zinc-950 text-white px-3 py-1 rounded font-semibold"
                    : "text-zinc-600 hover:text-black font-medium"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {searchPlacement !== 'hidden' && (
            <div className={`relative flex items-center w-full max-w-[200px] md:w-44 shrink-0 ${searchPlacement === 'left' ? 'order-first' : 'order-last'}`}>
              <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded py-1 pl-3 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-500 transition-all"
                  style={{ borderColor: searchBorderColor, borderWidth: searchBorderThickness, borderStyle: 'solid' }}
                />
                <button
                  type="submit"
                  className="absolute right-2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {localSearch && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-7 text-zinc-300 hover:text-zinc-650 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  const headerIds = ["breaking-news", "date-section", "domain-header", "category-nav"];
  
  const sortedHeaderSections = layoutSections.length > 0
    ? layoutSections.filter((s: any) => headerIds.includes(s.id) && s.isVisible !== false).sort((a: any, b: any) => a.order - b.order)
    : [
        { id: "breaking-news", order: 0 },
        { id: "date-section", order: 1 },
        { id: "domain-header", order: 2 },
        { id: "category-nav", order: 3 }
      ];

  return (
    <header className="w-full bg-white select-none">
      {sortedHeaderSections.map((section: any) => {
        if (section.id === "breaking-news") {
          return <DynamicBreakingNewsTicker key="breaking-news" />;
        }
        if (section.id === "date-section") {
          return renderDateSection(section);
        }
        if (section.id === "domain-header") {
          return renderDomainHeader(section);
        }
        if (section.id === "category-nav") {
          return renderCategoryNav(section);
        }
        return null;
      })}
    </header>
  );
}
