"use client";

import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          // Map to names, only include visible in navigation
          const visibleCats = data
            .filter((c: any) => c.isVisible !== false && c.showInNav !== false)
            .map((c: any) => c.name);
          setCategories(["All", ...visibleCats]);
        }
      } catch (err) {
        console.error("Failed to load header categories:", err);
      }
    }
    loadCats();
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

  return (
    <header className="w-full bg-white select-none">
      {/* Top Banner — date left on mobile, row on sm+ */}
      <div className="w-full border-b border-zinc-200 py-2 px-4 sm:px-6 text-xs text-zinc-600 flex flex-row sm:flex-row justify-start sm:justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Main Branding Logo — smaller on mobile */}
      <div className="w-full flex flex-col items-center justify-center pt-2 pb-4 md:pt-4 md:pb-8 border-b border-zinc-200 px-4">
        <h1
          className="font-editorial-title text-2xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-black cursor-pointer text-center"
          onClick={() => {
            setActiveCategory("All");
            setSearchQuery("");
            setLocalSearch("");
            setShowBookmarksOnly(false);
          }}
        >
          DOMAIN NAME
        </h1>
        <p className="mt-1 text-[8px] sm:text-xs text-zinc-500 uppercase tracking-widest text-center">
          Truth, Clarity, and Perspective <span className="mx-1">•</span> Independent Journalism
        </p>
      </div>

      {/* Navigation and Search Bar */}
      <div className="w-full border-b border-zinc-400 py-1.5 md:py-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 gap-3 md:gap-0">
          {/* Categories — horizontal scroll on mobile with hidden scrollbar */}
          <nav className="flex items-center flex-nowrap md:flex-wrap justify-start md:justify-center gap-0 overflow-x-auto no-scrollbar w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowBookmarksOnly(false);
                }}
                className={`py-2 px-3 text-xs md:text-sm font-medium transition-all hover:bg-zinc-50 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeCategory === cat && !showBookmarksOnly
                  ? "text-black border-b-2 border-black font-semibold"
                  : "text-zinc-600 hover:text-black"
                  }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Search Input & Bookmarks shortcut */}
          <div className="flex items-center justify-end gap-4 w-full md:w-auto">
            {/* Search form */}
            <form className="relative flex items-center w-full max-w-[200px] md:w-44 lg:w-56">
              <input
                type="text"
                placeholder="Search articles..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded py-1 pl-3 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-500 transition-all"
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
                  className="absolute right-7 text-zinc-300 hover:text-zinc-600 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
