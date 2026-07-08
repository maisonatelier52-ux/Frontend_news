"use client";

import React, { useState, useEffect } from "react";

import { DynamicBreakingNewsTicker } from "./Widgets";

type SectionSettingValue = string | number | boolean | undefined;
type SectionSettings = Record<string, SectionSettingValue>;

export interface HeaderLayoutSection {
  id: string;
  order?: number;
  isVisible?: boolean;
  limit?: number;
  designStyle?: string;
  categorySource?: string;
  colorTheme?: string;
  title?: string;
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
  const [headerAds, setHeaderAds] = useState<any[]>([]);
  const [closedAdIds, setClosedAdIds] = useState<string[]>([]);

  useEffect(() => {
    function syncClosedAds() {
      try {
        const closed = localStorage.getItem("domain_closed_ads");
        if (closed) {
          setClosedAdIds(JSON.parse(closed));
        }
      } catch (e) {}
    }
    syncClosedAds();
    window.addEventListener("storage", syncClosedAds);
    // Listen for custom events too for intra-page navigation updates
    window.addEventListener("domain_ad_dismissed", syncClosedAds);
    return () => {
      window.removeEventListener("storage", syncClosedAds);
      window.removeEventListener("domain_ad_dismissed", syncClosedAds);
    };
  }, []);

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

        try {
          const adsRes = await fetch("/api/advertisements");
          if (adsRes.ok) {
            const adsData = await adsRes.json();
            const activeHeaderAds = adsData.filter((a: any) => a.position === "Header Banner" && a.status === "active");
            setHeaderAds(activeHeaderAds);
          }
        } catch (adErr) {
          console.error("Failed to load header ad:", adErr);
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

    const showDate = sec.settings?.showDate !== false;
    const showLocation = sec.settings?.showLocation !== false;
    const customLocationText = stringSetting(sec.settings, 'customLocationText', 'Washington, D.C.');
    const customExtraText = stringSetting(sec.settings, 'customExtraText', '');
    const extraTextPlacement = stringSetting(sec.settings, 'extraTextPlacement', 'right');

    const getBadgeStyle = (
      prefix: string,
      defaultStyle: 'plain' | 'box',
      defaultBgColor: string,
      defaultTextColor: string,
      defaultBorderColor: string
    ) => {
      const style = stringSetting(sec.settings, `${prefix}Style`, defaultStyle);
      if (style === 'plain') {
        return {
          className: "font-sans font-medium",
          style: {}
        };
      }
      
      const bg = stringSetting(sec.settings, `${prefix}BoxBg`, defaultBgColor);
      const text = stringSetting(sec.settings, `${prefix}BoxText`, defaultTextColor);
      const borderCol = stringSetting(sec.settings, `${prefix}BoxBorderColor`, defaultBorderColor);
      const thick = numberSetting(sec.settings, `${prefix}BoxBorderThickness`, 1);
      
      return {
        className: "font-sans font-bold text-[10px] px-2.5 py-0.5 rounded tracking-wide transition-all",
        style: {
          backgroundColor: bg,
          color: text,
          border: thick === 0 ? 'none' : `${thick}px solid ${borderCol}`
        }
      };
    };

    const dateBadge = getBadgeStyle('date', 'plain', '#f3f4f6', '#1f2937', '#e5e7eb');
    const locationBadge = getBadgeStyle('location', 'plain', '#f3f4f6', '#1f2937', '#e5e7eb');
    const extraBadge = getBadgeStyle('extra', 'box', '#e0e7ff', '#4f46e5', '#c7d2fe');

    // Render components
    const dateElement = showDate && (
      <span 
        className={`flex items-center gap-1.5 ${dateBadge.className}`}
        style={dateBadge.style}
      >
        <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: dateBadge.style.color }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formattedDate}
      </span>
    );

    const locationElement = showLocation && (
      <span 
        className={locationBadge.className}
        style={locationBadge.style}
      >
        {customLocationText}
      </span>
    );

    const extraElement = customExtraText && (
      <span 
        className={extraBadge.className}
        style={extraBadge.style}
      >
        {customExtraText}
      </span>
    );

    if (dateAlign === 'spaced') {
      return (
        <div 
          key="date-section"
          className="w-full py-2 px-4 sm:px-6 text-xs flex items-center justify-between transition-all"
          style={{ backgroundColor: dateBg, color: dateCol, borderBottom: dateBorderCss }}
        >
          <div className="flex items-center gap-3">
            {dateElement}
            {extraTextPlacement === 'left' && extraElement}
          </div>
          <div className="flex items-center gap-3">
            {extraTextPlacement === 'right' && extraElement}
            {locationElement}
          </div>
        </div>
      );
    }

    // Left, Center, or Right alignment
    const dateAlignClass = dateAlign === 'center'
      ? 'justify-center gap-6'
      : dateAlign === 'right'
        ? 'justify-end gap-4'
        : 'justify-start gap-4';

    return (
      <div 
        key="date-section"
        className={`w-full py-2 px-4 sm:px-6 text-xs flex items-center transition-all ${dateAlignClass}`}
        style={{ backgroundColor: dateBg, color: dateCol, borderBottom: dateBorderCss }}
      >
        {extraTextPlacement === 'left' && extraElement}
        {dateElement}
        {locationElement}
        {extraTextPlacement === 'right' && extraElement}
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

    // Custom style settings
    const textColor = stringSetting(sec.settings, 'textColor', '#4b5563');
    const activeColor = stringSetting(sec.settings, 'activeColor', activeDesign === 'underline' ? '#000000' : '#ffffff');
    const activeBgColor = stringSetting(sec.settings, 'activeBgColor', '#000000');
    
    const navBorder = stringSetting(sec.settings, 'navBorder', 'thin');
    const navBorderColor = stringSetting(sec.settings, 'navBorderColor', '#e4e4e7');
    
    const alignClass = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center';

    let borderStyleCss = {};
    if (navBorder === 'thin') {
      borderStyleCss = { borderBottom: `1px solid ${navBorderColor}` };
    } else if (navBorder === 'thick') {
      borderStyleCss = { borderBottom: `3px solid ${navBorderColor}` };
    } else {
      borderStyleCss = { borderBottom: 'none' };
    }

    return (
      <div 
        key="category-nav"
        className="w-full py-1.5 md:py-0 transition-all font-sans"
        style={{ backgroundColor: bgColor, ...borderStyleCss }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 gap-3 md:gap-0">
          <nav className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto flex-1 py-1 ${alignClass}`}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat && !showBookmarksOnly;
              let itemClass = "py-2 px-3 text-xs md:text-sm font-medium transition-all hover:bg-zinc-50 cursor-pointer whitespace-nowrap flex-shrink-0";
              let itemStyle: React.CSSProperties = { color: textColor };

              if (isActive) {
                if (activeDesign === 'underline') {
                  itemClass = "py-2 px-3 text-xs md:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap flex-shrink-0";
                  itemStyle = { color: activeColor, borderBottomColor: activeColor };
                } else if (activeDesign === 'capsule') {
                  itemClass = "px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0";
                  itemStyle = { color: activeColor, backgroundColor: activeBgColor };
                } else if (activeDesign === 'box') {
                  itemClass = "px-3 py-1.5 rounded-none text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 font-bold";
                  itemStyle = { color: activeColor, backgroundColor: activeBgColor };
                }
              }

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowBookmarksOnly(false);
                  }}
                  className={itemClass}
                  style={itemStyle}
                >
                  {cat}
                </button>
              );
            })}
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
  
  const sortedHeaderSections: HeaderLayoutSection[] = layoutSections.length > 0
    ? layoutSections.filter((s) => headerIds.includes(s.id) && s.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [
        { id: "breaking-news", order: 0 },
        { id: "date-section", order: 1 },
        { id: "domain-header", order: 2 },
        { id: "category-nav", order: 3 }
      ] as HeaderLayoutSection[];

  const visibleHeaderAds = headerAds.filter((ad: any) => !closedAdIds.includes(ad._id));

  return (
    <header className="w-full bg-white select-none">
      {visibleHeaderAds.length > 0 && (
        <div className="relative w-full bg-zinc-50 border-b border-zinc-200 py-3.5 flex flex-col items-center justify-center select-none animate-[admin-fade-in_0.3s_ease-out]">
          <button
            onClick={() => {
              const adToClose = visibleHeaderAds[0];
              if (adToClose) {
                const nextClosed = [...closedAdIds, adToClose._id];
                setClosedAdIds(nextClosed);
                try {
                  localStorage.setItem("domain_closed_ads", JSON.stringify(nextClosed));
                } catch (e) {}
                window.dispatchEvent(new Event("domain_ad_dismissed"));
              }
            }}
            className="absolute top-2 right-4 bg-zinc-200 hover:bg-zinc-300 text-zinc-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer transition z-10"
            title="Close Ad"
          >
            ✕
          </button>
          <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">Advertisement</span>
          
          {/* Mobile Viewport Ad (under 768px) - Shows mobile scale 320x50 vacation ad */}
          {(() => {
            const mobileAd = visibleHeaderAds.find(a => a.size.includes("320")) || visibleHeaderAds[0];
            if (!mobileAd) return null;
            const parts = mobileAd.size.split(/[x×]/);
            const w = parseInt(parts[0]) || 320;
            const h = parseInt(parts[1]) || 50;
            return (
              <div 
                className="md:hidden relative overflow-hidden border border-zinc-200 shadow-3xs bg-white" 
                style={{ width: `${w}px`, height: `${h}px` }}
              >
                <img src={mobileAd.imageUrl} alt={mobileAd.name} className="w-full h-full object-cover" />
              </div>
            );
          })()}

          {/* Desktop/Tablet Viewport Ad (768px and above) - Shows desktop scale 728x90 */}
          {(() => {
            const desktopAd = visibleHeaderAds.find(a => a.size.includes("728")) || visibleHeaderAds.find(a => a.size.includes("300")) || visibleHeaderAds[0];
            if (!desktopAd) return null;
            const parts = desktopAd.size.split(/[x×]/);
            const w = parseInt(parts[0]) || 728;
            const h = parseInt(parts[1]) || 90;
            return (
              <div 
                className="hidden md:block relative overflow-hidden border border-zinc-200 shadow-3xs bg-white" 
                style={{ width: `${w}px`, height: `${h}px` }}
              >
                <img src={desktopAd.imageUrl} alt={desktopAd.name} className="w-full h-full object-cover" />
              </div>
            );
          })()}
        </div>
      )}
      {sortedHeaderSections.map((section) => {
        if (section.id === "breaking-news") {
          return (
            <DynamicBreakingNewsTicker
              key="breaking-news"
              settingsOverride={overrideSections ? section.settings : undefined}
              breakingArticleTitlesOverride={overrideSections ? breakingArticleTitlesOverride : undefined}
              limitOverride={overrideSections ? section.limit : undefined}
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
