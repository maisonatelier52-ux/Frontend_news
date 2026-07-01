"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article } from "./data/news";
import Header from "./components/Header";
import { StockTicker } from "./components/Widgets";
import LeadStory from "./components/LeadStory";
import NewsGrid from "./components/NewsGrid";
import ArticleReader from "./components/ArticleReader";

interface Comment {
  name: string;
  date: string;
  text: string;
}

const INITIAL_COMMENTS: Record<string, Comment[]> = {
  "1": [
    { name: "Arthur Pendelton, D.C.", date: "June 26, 2026", text: "This bipartisan agreement is long overdue. Upgrading rural grids is critical for agricultural tech integrations." },
    { name: "Sophia Martinez, Chicago", date: "June 26, 2026", text: "Excellent news, but I hope a significant chunk goes toward upgrading locks and dams in the Midwest." }
  ],
  "2": [
    { name: "Gary Reynolds, NY", date: "June 26, 2026", text: "The Fed is playing it safe, which is wise. Inflation is cooling, but retail costs are still quite high." }
  ],
  "3": [
    { name: "Dev_Architect", date: "June 25, 2026", text: "Enterprise custom models are a game changer. We shifted to a local 7B model and saw a massive drop in latency and cost." }
  ],
  "4": [
    { name: "Astro_Girl", date: "June 26, 2026", text: "Every time JWST releases findings like this, it makes me realize how much we have left to discover. Absolutely mind-blowing." }
  ],
  "5": [
    { name: "Marcus Brody, Boston", date: "June 25, 2026", text: "This is a great idea, but city planning regulations and suburban NIMBYism make it incredibly difficult to implement in the US." }
  ],
};

export default function Home() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [layoutSections, setLayoutSections] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(["All"]);
  const [localSearch, setLocalSearch] = useState("");

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  // Comments State
  const [comments, setComments] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/news?activeOnly=true");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((art: any) => {
            const paragraphs = art.blocks
              ? art.blocks.filter((b: any) => b.type === 'paragraph').map((b: any) => b.value)
              : [art.excerpt || ''];

            return {
              id: art._id,
              title: art.title,
              excerpt: art.excerpt || '',
              content: paragraphs.length > 0 ? paragraphs : [art.excerpt || ''],
              category: art.category,
              author: art.author,
              authorTitle: 'Staff Reporter',
              date: new Date(art.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              readTime: art.readTime || '5 mins',
              image: art.featuredImage || '/article-placeholder.jpg',
              isLead: art.options?.featuredArticle || false,
              isBreaking: art.options?.breakingNews || false,
              isTrending: art.options?.featuredArticle || false,
              commentsCount: Math.floor(Math.random() * 25) + 3
            };
          });
          setArticles(mapped);
        }
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  // Fetch home layout and categories
  useEffect(() => {
    async function loadLayoutData() {
      try {
        const layoutRes = await fetch("/api/home-layout");
        if (layoutRes.ok) {
          const data = await layoutRes.json();
          setLayoutSections(data.sections || []);
        }

        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const data = await catRes.json();
          const visibleCats = data
            .filter((c: any) => c.isVisible !== false && c.articles > 0)
            .map((c: any) => c.name);
          setCategoriesList(["All", ...visibleCats]);
        }
      } catch (err) {
        console.error("Failed to load layout data:", err);
      }
    }
    loadLayoutData();
  }, []);

  const handleCategoryChange = (cat: string) => {
    if (cat === "All") {
      setActiveCategory("All");
      setShowBookmarksOnly(false);
      router.push("/");
    } else {
      router.push(`/${cat}`);
    }
  };

  // Load state from localStorage on mount safely
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("domain _bookmarks");
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }

      const savedComments = localStorage.getItem("domain _comments");
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Sync bookmarks with localStorage
  const handleToggleBookmark = (id: string) => {
    let next: string[];
    if (bookmarkedIds.includes(id)) {
      next = bookmarkedIds.filter((bId) => bId !== id);
    } else {
      next = [...bookmarkedIds, id];
    }
    setBookmarkedIds(next);
    try {
      localStorage.setItem("domain _bookmarks", JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Add Comment handler
  const handleAddComment = (id: string, name: string, text: string) => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const newComment: Comment = { name, date: formatted, text };
    const updated = {
      ...comments,
      [id]: [newComment, ...(comments[id] || [])],
    };

    setComments(updated);
    try {
      localStorage.setItem("domain _comments", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSubmitted(false), 5000);
  };

  // Filter Articles
  const filteredArticles = articles.filter((article) => {
    // Bookmark filter
    if (showBookmarksOnly && !bookmarkedIds.includes(article.id)) {
      return false;
    }
    // Category filter
    if (activeCategory !== "All" && article.category !== activeCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchExcerpt = article.excerpt.toLowerCase().includes(q);
      const matchAuthor = article.author.toLowerCase().includes(q);
      const matchCategory = article.category.toLowerCase().includes(q);
      return matchTitle || matchExcerpt || matchAuthor || matchCategory;
    }
    return true;
  });

  // Highlight Articles for home view
  const leadArticle = articles.find((a) => a.isLead) || articles[0];

  // Secondary / Breaking news list for the Lead component
  const breakingArticles = leadArticle ? articles.filter((a) => a.isBreaking && a.id !== leadArticle.id).slice(0, 3) : [];

  // Sub-articles for the bottom of the lead story left-column
  const leadSubArticles = leadArticle ? articles
    .filter((a) => a.id !== leadArticle.id && !breakingArticles.some((b) => b.id === a.id))
    .slice(0, 4) : [];

  // Selected article for reader modal
  const selectedArticle = articles.find((a) => a.id === selectedArticleId);

  // Calculate dynamic comments count
  const getComments = (articleId: string) => {
    return comments[articleId] || [];
  };

  const getCommentsCount = (article: Article) => {
    const list = comments[article.id];
    return list ? list.length : article.commentsCount;
  };

  // Map articles to include dynamic comment counts
  const articlesWithDynamicStats = filteredArticles.map((art) => ({
    ...art,
    commentsCount: getCommentsCount(art),
  }));

  const activeArticleWithStats = selectedArticle ? {
    ...selectedArticle,
    commentsCount: getCommentsCount(selectedArticle),
  } : null;

  const leadArticleWithStats = leadArticle ? {
    ...leadArticle,
    commentsCount: getCommentsCount(leadArticle),
  } : {
    id: "",
    title: "",
    excerpt: "",
    content: [],
    category: "",
    author: "",
    authorTitle: "",
    date: "",
    readTime: "",
    image: "",
    commentsCount: 0
  };

  const breakingArticlesWithStats = breakingArticles.map((art) => ({
    ...art,
    commentsCount: getCommentsCount(art),
  }));

  const leadSubArticlesWithStats = leadSubArticles.map((art) => ({
    ...art,
    commentsCount: getCommentsCount(art),
  }));

  // Dynamic layout rendering components
  const renderBreakingNewsSection = (section: any) => {
    const isScrolling = section.settings?.isScrolling !== false;
    const bgColor = section.settings?.bgColor || '#09090b';
    const textColor = section.settings?.textColor || '#ffffff';
    const customText = section.settings?.customText || '';

    const breakingList = articles.filter(a => a.isBreaking);
    const alertText = customText || (breakingList.length > 0
      ? breakingList.map(a => `🚨 ${a.title}`).join('   •   ')
      : `📢 Federal Reserve Rates Hold • New Infrastructure Funding Active • Tech Shares Surge`);

    return (
      <div 
        key={section.id} 
        className="w-full overflow-hidden py-2 border-b border-zinc-800 text-[11px] font-mono select-none flex items-center"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="bg-red-750 text-white font-bold px-3 py-0.5 uppercase tracking-wider text-[9px] mr-4 flex-shrink-0 animate-pulse animate-[pulse_1.5s_infinite]">
          BREAKING NEWS
        </div>
        {isScrolling ? (
          <div className="relative w-full overflow-hidden flex items-center">
            {React.createElement('marquee', { className: 'cursor-default flex-1 font-medium' }, alertText)}
          </div>
        ) : (
          <div className="flex-grow font-semibold truncate px-2 select-text">{alertText}</div>
        )}
      </div>
    );
  };

  const renderDomainHeaderSection = (section: any) => {
    const isText = section.settings?.logoType !== 'image';
    const alignment = section.settings?.alignment || 'center';
    const logoSize = section.settings?.logoSize || '72px';
    const logoColor = section.settings?.logoColor || '#000000';
    const logoImg = section.settings?.logoImage || '';
    const tagline = section.settings?.taglineText || 'Truth, Clarity, and Perspective • Independent Journalism';
    const tagSize = section.settings?.taglineSize || '12px';
    const tagColor = section.settings?.taglineColor || '#71717a';
    const bgColor = section.settings?.bgColor || '#ffffff';

    const alignClass = alignment === 'left' ? 'items-start text-left' : alignment === 'right' ? 'items-end text-right' : 'items-center text-center';

    return (
      <div 
        key={section.id} 
        className={`w-full flex flex-col justify-center py-6 border-b border-zinc-205 px-4 select-none ${alignClass}`}
        style={{ backgroundColor: bgColor }}
      >
        {isText ? (
          <h1
            className="font-editorial-title font-extrabold tracking-tighter uppercase cursor-pointer m-0 leading-tight"
            onClick={() => handleCategoryChange("All")}
            style={{ fontSize: logoSize, color: logoColor }}
          >
            DOMAIN NAME
          </h1>
        ) : (
          <img
            src={logoImg || '/logo-placeholder.png'}
            alt="Logo"
            className="h-12 object-contain"
            style={{ maxHeight: logoSize }}
          />
        )}
        <p 
          className="mt-2 uppercase tracking-widest font-bold font-mono m-0"
          style={{ fontSize: tagSize, color: tagColor }}
        >
          {tagline}
        </p>
      </div>
    );
  };

  const renderCategoryNavSection = (section: any) => {
    const bgColor = section.settings?.bgColor || '#ffffff';
    const alignment = section.settings?.alignment || 'center';
    const activeDesign = section.settings?.activeLinkDesign || 'underline';
    const searchPlacement = section.settings?.searchPlacement || 'right';
    const searchPlaceholder = section.settings?.searchPlaceholder || 'Search articles...';
    const searchBorderColor = section.settings?.searchBorderColor || '#e4e4e7';
    const searchBorderThickness = section.settings?.searchBorderThickness || '1px';

    const alignClass = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center';

    return (
      <div 
        key={section.id} 
        className="w-full border-b border-zinc-400 py-2 sticky top-0 z-30 shadow-sm select-none"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 gap-3 md:gap-0">
          <nav className={`flex items-center flex-nowrap md:flex-wrap gap-0 overflow-x-auto no-scrollbar w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0 ${alignClass} flex-1`}>
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat && !showBookmarksOnly;
              let btnClass = `py-2 px-3.5 text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer `;
              
              if (isActive) {
                if (activeDesign === 'capsule') {
                  btnClass += `bg-zinc-905 text-white rounded-full px-4 py-1.5`;
                } else {
                  btnClass += `text-black border-b-2 border-black font-semibold`;
                }
              } else {
                btnClass += `text-zinc-650 hover:text-black`;
              }

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={btnClass}
                >
                  {cat}
                </button>
              );
            })}
          </nav>
          
          {searchPlacement !== 'hidden' && (
            <div className={`flex items-center justify-end gap-4 w-full md:w-auto ${searchPlacement === 'left' ? 'order-first' : 'order-last'}`}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-[200px] md:w-44 lg:w-56">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-zinc-50 rounded py-1 pl-3 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white transition-all outline-none"
                  style={{ borderColor: searchBorderColor, borderWidth: searchBorderThickness, borderStyle: 'solid' }}
                />
                <button type="submit" className="absolute right-2 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFirstHeroSection = (section: any) => {
    const theme = COLOR_THEMES[section.colorTheme] || COLOR_THEMES.indigo;
    const badgeStyle = `${theme.bg} ${theme.text} ${theme.border} border`;
    const borderStyle = section.settings?.borderColor ? `3px solid ${section.settings.borderColor}` : '';
    const customBg = section.settings?.bgColor || '';

    if (section.designStyle === 'hero-full') {
      return (
        <section key={section.id} className="max-w-7xl mx-auto py-8 px-4 border-b border-zinc-200" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
          <div
            onClick={() => setSelectedArticleId(leadArticleWithStats.id)}
            className="group cursor-pointer bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm hover:shadow transition flex flex-col md:flex-row gap-6 p-6"
          >
            <div className="md:w-3/5 aspect-video bg-zinc-100 rounded-2xl overflow-hidden relative">
              <img
                src={leadArticleWithStats.image}
                alt={leadArticleWithStats.title}
                className="object-cover w-full h-full group-hover:scale-[1.01] transition duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/95 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                {leadArticleWithStats.category}
              </div>
            </div>
            <div className="md:w-2/5 flex flex-col justify-between py-2">
              <div className="space-y-4">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono ${badgeStyle}`}>
                  {section.title}
                </span>
                <h2 className="font-editorial-title font-extrabold text-2xl md:text-4xl text-zinc-955 leading-tight transition" style={{ color: section.settings?.logoColor || '' }}>
                  {leadArticleWithStats.title}
                </h2>
                <p className="text-zinc-650 text-sm leading-relaxed">
                  {leadArticleWithStats.excerpt}
                </p>
              </div>
              <div className="text-xs text-zinc-400 font-mono font-bold uppercase tracking-wider mt-4">
                By {leadArticleWithStats.author} · {leadArticleWithStats.readTime}
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (section.designStyle === 'hero-minimal') {
      return (
        <section key={section.id} className="max-w-7xl mx-auto py-8 px-4 border-b border-zinc-200" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
          <div className="p-6 bg-zinc-50/50 border border-zinc-200 rounded-3xl text-center max-w-4xl mx-auto">
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${badgeStyle}`}>
              {section.title}
            </span>
            <h2
              onClick={() => setSelectedArticleId(leadArticleWithStats.id)}
              className="font-editorial-title font-extrabold text-2xl md:text-4xl text-zinc-950 mt-4 leading-snug hover:text-indigo-650 transition cursor-pointer"
            >
              "{leadArticleWithStats.title}"
            </h2>
            <p className="text-zinc-600 text-sm max-w-2xl mx-auto mt-3 leading-relaxed">
              {leadArticleWithStats.excerpt}
            </p>
            <div className="text-[11px] text-zinc-450 font-mono font-bold uppercase mt-4">
              Written by {leadArticleWithStats.author} · {leadArticleWithStats.readTime}
            </div>
          </div>
        </section>
      );
    }

    // Default hero-split
    return (
      <section key={section.id} style={{ borderTop: borderStyle, backgroundColor: customBg }}>
        <LeadStory
          leadArticle={leadArticleWithStats}
          secondaryArticles={breakingArticlesWithStats}
          subArticles={leadSubArticlesWithStats}
          onSelectArticle={setSelectedArticleId}
        />
      </section>
    );
  };

  const renderOpinionSection = (section: any) => {
    const borderStyle = section.settings?.borderColor ? `3px solid ${section.settings.borderColor}` : '';
    const customBg = section.settings?.bgColor || '';

    if (section.designStyle === 'quote') {
      return (
        <div key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200 select-none" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
          <div className="p-8 bg-[#fafaf8] border border-zinc-250/75 rounded-3xl text-center max-w-3xl mx-auto relative overflow-hidden">
            <span className="text-[60px] text-zinc-300 font-serif leading-none absolute top-2 left-6">“</span>
            <p className="text-base sm:text-lg italic text-zinc-700 leading-relaxed px-6 relative z-10">
              "The Grid Lock: Why rural grid upgrades will shape the digital agriculture boom over the next decade. Standard infrastructure yields multi-decade returns."
            </p>
            <cite className="text-xs font-bold text-zinc-800 not-italic uppercase tracking-widest block mt-4 font-mono">
              — Arthur Pendelton, D.C.
            </cite>
          </div>
        </div>
      );
    }

    if (section.designStyle === 'list') {
      return (
        <div key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200 select-none" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
          <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-zinc-900 border-l-3 border-zinc-900 pl-3 mb-6">
            {section.title}
          </h3>
          <div className="flex flex-col gap-4">
            <div className="p-4 border border-zinc-150 rounded-2xl bg-white flex justify-between items-center shadow-xs">
              <span className="text-sm font-semibold text-zinc-700">"Monetary Policy Balancing Act for Modern Startups"</span>
              <span className="text-xs font-bold text-zinc-450 uppercase font-mono">— Emily Davis</span>
            </div>
            <div className="p-4 border border-zinc-150 rounded-2xl bg-white flex justify-between items-center shadow-xs">
              <span className="text-sm font-semibold text-zinc-700">"Software Efficiency is the True Scaling Frontier of AI Models"</span>
              <span className="text-xs font-bold text-zinc-450 uppercase font-mono">— Michael Chen</span>
            </div>
          </div>
        </div>
      );
    }

    // Default columns
    return (
      <div key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200 bg-zinc-50/40 rounded-3xl my-6 select-none" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-[#0f172a] border-l-3 border-[#0f172a] pl-3">
            {section.title}
          </h3>
          <span className="text-[10px] text-zinc-450 font-extrabold uppercase tracking-widest font-mono">Perspectives</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-zinc-200 rounded-2xl bg-white flex flex-col justify-between h-44 shadow-sm hover:shadow transition">
            <blockquote className="text-[13px] italic text-zinc-650 leading-relaxed">
              "The Grid Lock: Why rural grid upgrades will shape the digital agriculture boom over the next decade. Standard infrastructure yields multi-decade returns."
            </blockquote>
            <cite className="text-[11px] font-bold text-zinc-800 not-italic uppercase tracking-widest block mt-4">— Arthur Pendelton, D.C.</cite>
          </div>
          <div className="p-6 border border-zinc-200 rounded-2xl bg-white flex flex-col justify-between h-44 shadow-sm hover:shadow transition">
            <blockquote className="text-[13px] italic text-zinc-650 leading-relaxed">
              "Market Safety vs Innovation: The balancing act of monetary guidelines in high-tech startups. Higher yields could trigger venture cooling."
            </blockquote>
            <cite className="text-[11px] font-bold text-zinc-800 not-italic uppercase tracking-widest block mt-4">— Emily Davis, London</cite>
          </div>
          <div className="p-6 border border-zinc-200 rounded-2xl bg-white flex flex-col justify-between h-44 shadow-sm hover:shadow transition">
            <blockquote className="text-[13px] italic text-zinc-650 leading-relaxed">
              "Beyond GPU scarcity: Software efficiency and compiler improvements are emerging as the true scaling frontier of AI models in enterprise."
            </blockquote>
            <cite className="text-[11px] font-bold text-zinc-800 not-italic uppercase tracking-widest block mt-4">— Michael Chen, Tech Analyst</cite>
          </div>
        </div>
      </div>
    );
  };

  const renderCategorySection = (section: any) => {
    const sourceCats = section.categorySource.split(',').map((s: string) => s.trim());
    const sectionArticles = articlesWithDynamicStats
      .filter(a => sourceCats.includes('All') ? true : sourceCats.includes(a.category))
      .slice(0, section.limit);

    if (sectionArticles.length === 0) return null;

    const theme = COLOR_THEMES[section.colorTheme] || COLOR_THEMES.indigo;
    const badgeStyle = `${theme.bg} ${theme.text} ${theme.border} border`;
    const hoverColor = theme.hoverText;
    const borderStyle = section.settings?.borderColor ? `3px solid ${section.settings.borderColor}` : '';
    const customBg = section.settings?.bgColor || '';

    if (section.designStyle === 'magazine') {
      return (
        <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200 animate-[admin-fade-in_0.3s_ease]" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-zinc-900 border-l-3 border-zinc-950 pl-3">
              {section.title}
            </h3>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider font-mono">
              {sourceCats.join(' · ')}
            </span>
          </div>
          <div className="flex flex-col gap-6">
            {sectionArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className="group cursor-pointer flex flex-col md:flex-row gap-5 p-4 border border-zinc-150 rounded-2xl hover:shadow shadow-xs transition bg-white"
              >
                <div className="w-full md:w-48 aspect-video md:aspect-auto md:h-32 bg-zinc-150 rounded-xl overflow-hidden shrink-0 relative">
                  <img src={article.image} alt={article.title} className="object-cover w-full h-full" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div className="space-y-2">
                    <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${badgeStyle}`}>
                      {article.category}
                    </span>
                    <h4 className={`font-editorial-title font-bold text-lg text-zinc-900 leading-snug transition ${hoverColor}`}>
                      {article.title}
                    </h4>
                    <p className="text-zinc-550 text-xs leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider mt-3">
                    By {article.author} · {article.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (section.designStyle === 'list') {
      return (
        <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200 animate-[admin-fade-in_0.3s_ease]" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-zinc-900 border-l-3 border-zinc-950 pl-3">
              {section.title}
            </h3>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider font-mono">
              {sourceCats.join(' · ')}
            </span>
          </div>
          <div className="flex flex-col border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-200 bg-white">
            {sectionArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className={`p-4 px-6 hover:bg-zinc-50/50 cursor-pointer flex justify-between items-center gap-4 transition group`}
              >
                <div className="space-y-1">
                  <span className={`text-[8px] font-extrabold px-1.5 py-0.25 rounded uppercase tracking-widest font-mono mr-2.5 ${badgeStyle}`}>
                    {article.category}
                  </span>
                  <span className={`text-sm font-semibold text-zinc-800 transition ${hoverColor}`}>
                    {article.title}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono whitespace-nowrap">{article.readTime}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // Default grid
    return (
      <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-zinc-900 border-l-3 border-zinc-950 pl-3">
            {section.title}
          </h3>
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider font-mono">
            {sourceCats.join(' · ')}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sectionArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticleId(article.id)}
              className="group cursor-pointer flex flex-col justify-between border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-md transition bg-white shadow-xs p-3.5"
            >
              <div className="space-y-3">
                <div className="aspect-video w-full bg-zinc-100 rounded-xl overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="object-cover w-full h-full group-hover:scale-[1.03] transition duration-300"
                  />
                  <div className={`absolute top-2 left-2 text-[9.5px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider ${badgeStyle}`}>
                    {article.category}
                  </div>
                </div>
                <h4 className={`font-editorial-title font-bold text-[15px] text-zinc-900 leading-snug transition ${hoverColor}`}>
                  {article.title}
                </h4>
                <p className="text-zinc-550 text-[11.5px] leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-bold">
                <span>By {article.author}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderTrendingSection = (section: any) => {
    const trendingArticles = articlesWithDynamicStats.slice(0, section.limit);
    if (trendingArticles.length === 0) return null;

    const theme = COLOR_THEMES[section.colorTheme] || COLOR_THEMES.indigo;
    const hoverColor = theme.hoverText;
    const borderStyle = section.settings?.borderColor ? `3px solid ${section.settings.borderColor}` : '';
    const customBg = section.settings?.bgColor || '';

    return (
      <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
        <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-zinc-900 mb-6 border-l-3 border-zinc-950 pl-3">
          {section.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingArticles.map((article, idx) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticleId(article.id)}
              className="group cursor-pointer flex gap-4 items-start p-4 bg-zinc-50/40 hover:bg-zinc-50 border border-zinc-200/50 rounded-2xl transition"
            >
              <span className="text-[28px] font-serif font-extrabold text-indigo-500 font-mono leading-none">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="space-y-1">
                <h4 className={`font-editorial-title text-[14px] font-bold text-zinc-800 leading-snug transition ${hoverColor}`}>
                  {article.title}
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-bold">
                  {article.category} · {article.readTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCombinedSpotlight = (section: any) => {
    const sourceCats = section.categorySource.split(',').map((s: string) => s.trim());
    const spotlightArticles = articlesWithDynamicStats
      .filter(a => sourceCats.includes('All') ? true : sourceCats.includes(a.category))
      .slice(0, section.limit);

    if (spotlightArticles.length === 0) return null;

    const theme = COLOR_THEMES[section.colorTheme] || COLOR_THEMES.indigo;
    const hoverColor = theme.hoverText;
    const accentBg = theme.bg;
    const accentText = theme.text;
    const borderStyle = section.settings?.borderColor ? `3px solid ${section.settings.borderColor}` : '';
    const customBg = section.settings?.bgColor || '';

    return (
      <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200 bg-[#fbfbfa]/60 rounded-3xl my-6" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-zinc-900 border-l-3 border-zinc-950 pl-3">
            {section.title}
          </h3>
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full select-none tracking-widest uppercase font-mono ${accentBg} ${accentText}`}>
            Spotlight Feed
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlightArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticleId(article.id)}
              className="group cursor-pointer bg-white border border-zinc-200/70 p-5 rounded-2xl hover:shadow shadow-xs transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className={`text-[9.5px] font-extrabold uppercase tracking-widest font-mono ${accentText}`}>
                  {article.category}
                </span>
                <h4 className={`font-editorial-title font-bold text-[14px] text-zinc-900 leading-snug transition ${hoverColor}`}>
                  {article.title}
                </h4>
                <p className="text-[11.5px] text-zinc-550 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-mono font-bold uppercase">
                <span>By {article.author}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderLatestNewsSection = (section: any) => {
    const latestArticles = articlesWithDynamicStats.slice(0, section.limit);
    if (latestArticles.length === 0) return null;

    const theme = COLOR_THEMES[section.colorTheme] || COLOR_THEMES.indigo;
    const hoverColor = theme.hoverText;
    const borderStyle = section.settings?.borderColor ? `3px solid ${section.settings.borderColor}` : '';
    const customBg = section.settings?.bgColor || '';

    return (
      <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200" style={{ borderTop: borderStyle, backgroundColor: customBg }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-zinc-900 border-l-3 border-zinc-950 pl-3">
            {section.title}
          </h3>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono">
            Latest Chronicles
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {latestArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticleId(article.id)}
              className="group cursor-pointer flex gap-4 p-4 border border-zinc-150 rounded-2xl hover:shadow-sm transition bg-white shadow-xs"
            >
              <div className="w-20 h-20 bg-zinc-100 rounded-xl overflow-hidden shrink-0 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className={`font-editorial-title font-bold text-[14px] text-zinc-900 leading-snug transition ${hoverColor}`}>
                    {article.title}
                  </h4>
                  <p className="text-zinc-550 text-[11.5px] leading-relaxed line-clamp-1 m-0">
                    {article.excerpt}
                  </p>
                </div>
                <div className="text-[9.5px] text-zinc-400 font-bold font-mono uppercase mt-2">
                  {article.category} · By {article.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setShowBookmarksOnly(false);
  };

  const isFrontPage = activeCategory === "All" && searchQuery === "" && !showBookmarksOnly;
  const hasCustomLayout = isFrontPage && layoutSections.length > 0;

  // Render COLOR_THEMES lookup maps
  const COLOR_THEMES: Record<string, any> = {
    indigo: { text: 'text-indigo-650', bg: 'bg-indigo-50', border: 'border-indigo-200', btn: 'bg-[#6366f1]', hoverText: 'hover:text-indigo-650' },
    zinc: { text: 'text-zinc-800', bg: 'bg-zinc-150', border: 'border-zinc-300', btn: 'bg-zinc-800', hoverText: 'hover:text-zinc-900' },
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-250', btn: 'bg-emerald-600', hoverText: 'hover:text-emerald-700' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-250', btn: 'bg-amber-600', hoverText: 'hover:text-amber-700' },
    crimson: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-250', btn: 'bg-rose-600', hoverText: 'hover:text-rose-700' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-zinc-200 border-t-zinc-950 rounded-full animate-spin"></div>
          <div className="text-xs text-zinc-500 font-serif tracking-widest uppercase">
            Loading The Domain Name...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">

      {/* Render default ticker and header only if we don't have custom layout active */}
      {!hasCustomLayout && (
        <>
          <StockTicker />
          <Header
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            bookmarkCount={bookmarkedIds.length}
            showBookmarksOnly={showBookmarksOnly}
            setShowBookmarksOnly={setShowBookmarksOnly}
          />
        </>
      )}

      {/* Main Content Body */}
      <main className="flex-grow">
        {hasCustomLayout ? (
          // Render sorted sections dynamically
          layoutSections
            .filter(s => s.isVisible)
            .sort((a, b) => a.order - b.order)
            .map(section => {
              switch (section.id) {
                case 'breaking-news':
                  return renderBreakingNewsSection(section)
                
                case 'date-section':
                  const dateBg = section.settings?.bgColor || '#f8fafc';
                  const dateCol = section.settings?.textColor || '#64748b';
                  const dateAlign = section.settings?.alignment || 'spaced';
                  const dateAlignClass = dateAlign === 'left' ? 'justify-start gap-4' : dateAlign === 'center' ? 'justify-center gap-6' : dateAlign === 'right' ? 'justify-end gap-4' : 'justify-between';
                  return (
                    <div 
                      key="date-section" 
                      className={`w-full border-b border-zinc-200 py-2 px-4 sm:px-6 text-xs flex select-none tracking-wide font-mono uppercase transition-all ${dateAlignClass}`}
                      style={{ backgroundColor: dateBg, color: dateCol }}
                    >
                      <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                      <span>Washington, D.C.</span>
                    </div>
                  )
                
                case 'domain-header':
                  return renderDomainHeaderSection(section)
                
                case 'category-nav':
                  return renderCategoryNavSection(section)
                
                case 'first-hero':
                  return renderFirstHeroSection(section)
                
                case 'opinion-column':
                  return renderOpinionSection(section)
                
                case 'trending-columns':
                  return renderTrendingSection(section)
                
                case 'arts-marketing-pr':
                  return renderCombinedSpotlight(section)
                
                case 'latest-news':
                  return renderLatestNewsSection(section)
                
                default:
                  // Handles standard category sections: us-politics, finance-markets, technology-section, world-affairs
                  return renderCategorySection(section)
              }
            })
        ) : (
          <NewsGrid
            articles={articlesWithDynamicStats}
            onSelectArticle={setSelectedArticleId}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            showBookmarksOnly={showBookmarksOnly}
          />
        )}
      </main>

      {/* 3. Newsletter Subscription section */}
      <section className="bg-zinc-50 border-t border-zinc-250 py-10 px-4 select-none">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="font-editorial-title text-xl sm:text-2xl font-bold text-zinc-900">
            Subscribe to DOMAIN NAME
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            Join 240,000+ readers. Get curated briefs, breaking news alerts, and deep-dive investigations sent directly to your inbox every morning.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-white border border-zinc-250 px-4 py-2 text-xs rounded-sm w-full focus:border-zinc-500"
              required
            />
            <button
              type="submit"
              className="bg-zinc-950 text-white text-xs font-bold py-2.5 px-6 rounded-sm hover:bg-zinc-800 transition cursor-pointer flex-shrink-0"
            >
              Sign Up
            </button>
          </form>

          {newsletterSubmitted && (
            <p className="text-xs font-semibold text-emerald-600 animate-pulse">
              ✓ Subscribed successfully! Welcome to DOMAIN NAME.
            </p>
          )}
        </div>
      </section>

      {/* 4. Main Editorial Footer */}
      <footer className="bg-white border-t border-zinc-300 py-10 px-4 sm:px-6 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Col 1: About */}
          <div className="space-y-3">
            <h4 className="font-editorial-title text-lg font-extrabold text-zinc-900 tracking-tight">
              DOMAIN NAME
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
              An independent, employee-owned publication covering national policy, international affairs, global markets, technology, and arts. Headquartered in Washington, D.C.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-3.5">
              Categories
            </h5>
            <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-600 font-medium">
              <li>
                <button onClick={() => { handleCategoryChange("US"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer">
                  U.S. News & Politics
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Finance"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer">
                  Finance & Markets
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Technology"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer">
                  Technology & Science
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("World"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer">
                  World Affairs
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Marketing"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer">
                  Marketing & Strategy
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Entertainment"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer">
                  Arts & Entertainment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: More Divisions */}
          <div>
            <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-3.5">
              Other Sections
            </h5>
            <ul className="space-y-2 text-xs text-zinc-600 font-medium">
              <li>
                <button onClick={() => { handleCategoryChange("PR News"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer">
                  Press Releases & News
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Legal Bar */}
        <div className="max-w-7xl mx-auto border-t border-zinc-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-zinc-400 font-mono">
          <div>
            © {new Date().getFullYear()} DOMAIN NAME. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span>•</span>
            <span className="cursor-pointer hover:underline">Terms of Service</span>
            <span>•</span>
            <span className="cursor-pointer hover:underline">Ethics Guidelines</span>
          </div>
        </div>
      </footer>

      {/* 5. Immersive Article Reader Drawer (Opened if active selection exists) */}
      {activeArticleWithStats && (
        <ArticleReader
          article={activeArticleWithStats}
          onClose={() => setSelectedArticleId(null)}
          isBookmarked={bookmarkedIds.includes(activeArticleWithStats.id)}
          onToggleBookmark={handleToggleBookmark}
          comments={getComments(activeArticleWithStats.id)}
          onAddComment={handleAddComment}
        />
      )}

    </div>
  );
}
