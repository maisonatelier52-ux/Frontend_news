"use client";

import React, { useState, useEffect } from "react";

import { DynamicBreakingNewsTicker } from "./Widgets";

type SectionSettingValue = string | number | boolean | undefined;
type SectionSettings = Record<string, SectionSettingValue>;

interface HeaderLayoutSection {
  id: string;
  order?: number;
  isVisible?: boolean;
  settings?: SectionSettings;
}

interface CategoryApiItem {
  name: string;
  isVisible?: boolean;
  articles?: number;
}

function stringSetting(settings: SectionSettings | undefined, key: string, fallback: string) {
  const value = settings?.[key];
  return typeof value === "string" ? value : fallback;
}

function numberSetting(settings: SectionSettings | undefined, key: string, fallback: number) {
  const value = settings?.[key];
  return typeof value === "number" ? value : fallback;
}

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  bookmarkCount: number;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (val: boolean) => void;
  /** If provided, use these sections instead of fetching from API */
  overrideSections?: HeaderLayoutSection[];
  breakingArticleTitlesOverride?: string[];
}

export default function Header({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  bookmarkCount,
  showBookmarksOnly,
  setShowBookmarksOnly,
  overrideSections,
  breakingArticleTitlesOverride,
}: HeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [layoutSections, setLayoutSections] = useState<HeaderLayoutSection[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const data = (await catRes.json()) as CategoryApiItem[];
          const visibleCats = data
            .filter((c) => c.isVisible !== false && (c.articles || 0) > 0)
            .map((c) => c.name);
          setCategories(["All", ...visibleCats]);
        }

        if (!overrideSections) {
          const layoutRes = await fetch("/api/home-layout");
          if (layoutRes.ok) {
            const data = (await layoutRes.json()) as { sections?: HeaderLayoutSection[] };
            if (data && data.sections) {
              setLayoutSections(data.sections);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load header data:", err);
      }
    }
    if (overrideSections) {
      setLayoutSections(overrideSections);
    }
    loadData();
  }, [overrideSections]);

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

  const renderDateSection = (sec: HeaderLayoutSection) => {
    const dateBg = stringSetting(sec.settings, 'bgColor', '#ffffff');
    const dateCol = stringSetting(sec.settings, 'textColor', '#52525b');
    const dateAlign = stringSetting(sec.settings, 'alignment', 'spaced');
    const dateBorder = stringSetting(sec.settings, 'borderStyle', 'thin');
    const dateBorderCol = stringSetting(sec.settings, 'borderColor', '#e4e4e7');
    
    // Default to thin (1px) if not explicitly set. If set to 'none' or thickness is 0, then no border.
    const defaultThickness = dateBorder === 'thick' ? 3 : dateBorder === 'none' ? 0 : 1;
    const dateBorderThickness = numberSetting(sec.settings, 'borderThickness', defaultThickness);
    
    const dateBorderCss = dateBorderThickness === 0 
      ? 'none' 
      : `${dateBorderThickness}px solid ${dateBorderCol}`;

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

  const renderDomainHeader = (sec: HeaderLayoutSection) => {
    const isText = stringSetting(sec.settings, 'logoType', 'text') !== 'image';
    const alignment = stringSetting(sec.settings, 'alignment', 'center');
    const logoSize = stringSetting(sec.settings, 'logoSize', '72px');
    const logoColor = stringSetting(sec.settings, 'logoColor', '#000000');
    const logoImg = stringSetting(sec.settings, 'logoImage', '');
    const tagline = stringSetting(sec.settings, 'taglineText', 'Truth, Clarity, and Perspective - Independent Journalism');
    const tagSize = stringSetting(sec.settings, 'taglineSize', '12px');
    const tagColor = stringSetting(sec.settings, 'taglineColor', '#71717a');
    const bgColor = stringSetting(sec.settings, 'bgColor', '#ffffff');

    const alignClass = alignment === 'left' ? 'items-start text-left' : alignment === 'right' ? 'items-end text-right' : 'items-center text-center';

    return (
      <div 
        key="domain-header"
        className={`w-full flex flex-col pt-2 pb-4 md:pt-4 md:pb-6 border-b border-zinc-200 px-4 transition-all ${alignClass}`}
        style={{ backgroundColor: bgColor }}
      >
        {isText ? (
          <div className="flex flex-col items-center select-none w-full overflow-hidden">
            <h1 
              className="font-editorial-title font-extrabold tracking-tight cursor-pointer m-0 leading-none text-center select-none whitespace-nowrap w-full"
              style={{ 
                color: logoColor,
                fontSize: `clamp(28px, 7vw, ${logoSize})`,
              }}
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                setLocalSearch("");
                setShowBookmarksOnly(false);
              }}
            >
              DOMAIN NAME
            </h1>
            <p
              className="mt-2 font-sans font-bold uppercase tracking-widest text-center leading-tight select-none"
              style={{ fontSize: `clamp(8px, 1.5vw, ${tagSize})`, color: tagColor, letterSpacing: '0.15em' }}
            >
              {tagline}
            </p>
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


  const renderCategoryNav = (sec: HeaderLayoutSection) => {
    const bgColor = stringSetting(sec.settings, 'bgColor', '#ffffff');
    const alignment = stringSetting(sec.settings, 'alignment', 'center');
    const searchPlacement = stringSetting(sec.settings, 'searchPlacement', 'right');
    const activeDesign = stringSetting(sec.settings, 'activeLinkDesign', 'underline');
    const searchPlaceholder = stringSetting(sec.settings, 'searchPlaceholder', 'Search articles...');
    const searchBorderColor = stringSetting(sec.settings, 'searchBorderColor', '#e4e4e7');
    const searchBorderThickness = stringSetting(sec.settings, 'searchBorderThickness', '1px');

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
    ? layoutSections.filter((s) => headerIds.includes(s.id) && s.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [
        { id: "breaking-news", order: 0 },
        { id: "date-section", order: 1 },
        { id: "domain-header", order: 2 },
        { id: "category-nav", order: 3 }
      ];

  return (
    <header className="w-full bg-white select-none">
      {sortedHeaderSections.map((section) => {
        if (section.id === "breaking-news") {
          return (
            <DynamicBreakingNewsTicker
              key="breaking-news"
              settingsOverride={overrideSections ? section.settings : undefined}
              breakingArticleTitlesOverride={overrideSections ? breakingArticleTitlesOverride : undefined}
            />
          );
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
