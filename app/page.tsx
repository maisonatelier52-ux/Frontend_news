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
  const renderCategorySection = (section: any) => {
    const sourceCats = section.categorySource.split(',').map((s: string) => s.trim());
    const sectionArticles = articlesWithDynamicStats
      .filter(a => sourceCats.includes('All') ? true : sourceCats.includes(a.category))
      .slice(0, section.limit);

    if (sectionArticles.length === 0) return null;

    return (
      <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200">
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
                  <div className="absolute top-2 left-2 bg-white/90 text-black text-[9.5px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>
                <h4 className="font-editorial-title font-bold text-[15px] text-zinc-900 leading-snug group-hover:text-indigo-650 transition">
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

    return (
      <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200">
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
                <h4 className="font-editorial-title text-[14px] font-bold text-zinc-800 leading-snug group-hover:text-indigo-650 transition">
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

    return (
      <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200 bg-[#fbfbfa]/60 rounded-3xl my-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-editorial-title text-2xl font-bold tracking-tight text-zinc-900 border-l-3 border-zinc-950 pl-3">
            {section.title}
          </h3>
          <span className="text-[10px] bg-[#6366f1]/10 text-[#6366f1] font-extrabold px-2.5 py-0.5 rounded-full select-none tracking-widest uppercase font-mono">
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
                <span className="text-[9.5px] text-indigo-650 font-extrabold uppercase tracking-widest font-mono">
                  {article.category}
                </span>
                <h4 className="font-editorial-title font-bold text-[14px] text-zinc-900 leading-snug group-hover:text-indigo-650 transition">
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

    return (
      <section key={section.id} className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200">
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
                  <h4 className="font-editorial-title font-bold text-[14px] text-zinc-900 leading-snug group-hover:text-indigo-650 transition">
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
                  return <StockTicker key="breaking-news" />
                
                case 'date-section':
                  return (
                    <div key="date-section" className="w-full border-b border-zinc-200 py-2 px-4 sm:px-6 text-xs text-zinc-600 flex justify-between select-none tracking-wide font-mono uppercase bg-zinc-50/50">
                      <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                      <span>Washington, D.C.</span>
                    </div>
                  )
                
                case 'domain-header':
                  return (
                    <div key="domain-header" className="w-full flex flex-col items-center justify-center pt-4 pb-6 md:pt-6 md:pb-10 border-b border-zinc-200 px-4 select-none">
                      <h1
                        className="font-editorial-title text-3xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-black cursor-pointer text-center uppercase"
                        onClick={() => handleCategoryChange("All")}
                      >
                        DOMAIN NAME
                      </h1>
                      <p className="mt-2 text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest text-center font-bold font-mono">
                        Truth, Clarity, and Perspective <span className="mx-1.5 text-zinc-350">•</span> Independent Journalism
                      </p>
                    </div>
                  )
                
                case 'category-nav':
                  return (
                    <div key="category-nav" className="w-full border-b border-zinc-400 py-2 bg-white sticky top-0 z-30 shadow-sm select-none">
                      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 gap-3 md:gap-0">
                        <nav className="flex items-center flex-nowrap md:flex-wrap justify-start md:justify-center gap-0 overflow-x-auto no-scrollbar w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
                          {categoriesList.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => handleCategoryChange(cat)}
                              className={`py-2 px-3.5 text-xs md:text-sm font-bold transition-all hover:bg-zinc-50 cursor-pointer whitespace-nowrap ${
                                activeCategory === cat && !showBookmarksOnly
                                  ? "text-black border-b-2 border-black font-semibold"
                                  : "text-zinc-650 hover:text-black"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </nav>
                        <div className="flex items-center justify-end gap-4 w-full md:w-auto">
                          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-[200px] md:w-44 lg:w-56">
                            <input
                              type="text"
                              placeholder="Search articles..."
                              value={localSearch}
                              onChange={(e) => setLocalSearch(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded py-1 pl-3 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-500 transition-all"
                            />
                            <button type="submit" className="absolute right-2 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )
                
                case 'first-hero':
                  return (
                    <LeadStory
                      key="first-hero"
                      leadArticle={leadArticleWithStats}
                      secondaryArticles={breakingArticlesWithStats}
                      subArticles={leadSubArticlesWithStats}
                      onSelectArticle={setSelectedArticleId}
                    />
                  )
                
                case 'opinion-column':
                  return (
                    <div key="opinion-column" className="max-w-7xl mx-auto py-10 px-4 border-b border-zinc-200 bg-zinc-50/40 rounded-3xl my-6 select-none">
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
                  )
                
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
