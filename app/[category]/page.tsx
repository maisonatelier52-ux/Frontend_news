"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Article } from "../data/news";
import Header from "../components/Header";
import { StockTicker } from "../components/Widgets";
import ArticleReader from "../components/ArticleReader";

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

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams<{ category: string }>();
  const rawCategory = params?.category ?? "";

  // Normalize URL slug → canonical display category name (case-insensitive)
  const CATEGORY_MAP: Record<string, string> = {
    "us": "US",
    "world": "World",
    "finance": "Finance",
    "technology": "Technology",
    "entertainment": "Entertainment",
    "marketing": "Marketing",
    "pr news": "PR News",
    "pr-news": "PR News",
    "prnews": "PR News",
  };
  const slugDecoded = decodeURIComponent(rawCategory).toLowerCase();
  const decodedCategory = CATEGORY_MAP[slugDecoded] ?? decodeURIComponent(rawCategory);

  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles and trending fallbacks
  useEffect(() => {
    async function loadArticles() {
      if (!decodedCategory) return;
      try {
        setLoading(true);
        // Load articles for current category
        const res = await fetch(`/api/news?activeOnly=true&category=${decodedCategory}`);
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

        // Load trending articles (from other categories as fallback)
        const trendingRes = await fetch("/api/news?activeOnly=true");
        if (trendingRes.ok) {
          const trendData = await trendingRes.json();
          const mappedTrend = trendData
            .filter((art: any) => art.category !== decodedCategory)
            .slice(0, 7)
            .map((art: any) => {
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
          setTrendingArticles(mappedTrend);
        }
      } catch (err) {
        console.error("Failed to load category articles:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [decodedCategory]);

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  // Comments State
  const [comments, setComments] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Reset transient UI state whenever the category route changes
  useEffect(() => {
    setSearchQuery("");
    setShowBookmarksOnly(false);
    setSelectedArticleId(null);
  }, [decodedCategory]);

  // Load persisted state from localStorage on mount
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

  // Navigation router push handler
  const handleCategoryChange = (cat: string) => {
    if (cat === "All") {
      router.push("/");
    } else {
      router.push(`/${cat}`);
    }
  };

  // Filter Articles for this Category Page
  const filteredArticles = articles.filter((article) => {
    // Bookmark filter
    if (showBookmarksOnly && !bookmarkedIds.includes(article.id)) {
      return false;
    }
    // Category filter
    if (article.category !== decodedCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchExcerpt = article.excerpt.toLowerCase().includes(q);
      const matchAuthor = article.author.toLowerCase().includes(q);
      return matchTitle || matchExcerpt || matchAuthor;
    }
    return true;
  });

  // Calculate dynamic comments count helpers
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

  const selectedArticle = articles.find((a) => a.id === selectedArticleId);
  const activeArticleWithStats = selectedArticle ? {
    ...selectedArticle,
    commentsCount: getCommentsCount(selectedArticle),
  } : null;

  // Split Category Layout Data
  const hasArticles = articlesWithDynamicStats.length > 0;
  const heroArticle = hasArticles ? articlesWithDynamicStats[0] : null;
  const remainingArticles = hasArticles ? articlesWithDynamicStats.slice(1) : [];

  // Left column: first 7 remaining articles in a scrollable list
  // Sidebar: items beyond position 7 from same category, or trending fallback
  const leftListArticles = remainingArticles.slice(0, 7);
  const extraArticles = remainingArticles.slice(7);
  const hasExtraArticles = extraArticles.length > 0;
  const sidebarArticles = (hasExtraArticles
    ? extraArticles
    : trendingArticles).slice(0, 7);
  const sidebarTitle = hasExtraArticles
    ? `More in ${decodedCategory}`
    : "Trending Coverage";

  // One-line editorial tagline per category
  const categoryTaglines: Record<string, string> = {
    "US": "Covering American politics, policy, and national affairs.",
    "World": "Global dispatches from correspondents across every continent.",
    "Finance": "Markets, economics, and the forces shaping global capital.",
    "Technology": "The intersection of innovation, AI, and the digital future.",
    "Entertainment": "Arts, culture, film, music, and the stories behind the spotlight.",
    "Marketing": "Strategy, brand, and the science of reaching modern audiences.",
    "PR News": "Official statements, press releases, and institutional announcements.",
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-zinc-200 border-t-zinc-950 rounded-full animate-spin"></div>
          <div className="text-xs text-zinc-500 font-serif tracking-widest uppercase">
            Loading {decodedCategory}...
          </div>
        </div>
      </div>
    );
  }

  const tagline = categoryTaglines[decodedCategory] ?? `In-depth reporting on ${decodedCategory}.`;

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">

      {/* 1. Live Stocks Ticker */}
      <StockTicker />

      {/* 2. Main Editorial Header */}
      <Header
        activeCategory={decodedCategory}
        setActiveCategory={handleCategoryChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarkCount={bookmarkedIds.length}
        showBookmarksOnly={showBookmarksOnly}
        setShowBookmarksOnly={setShowBookmarksOnly}
      />

      {/* Main Content Body */}
      <main className="flex-grow">

        {searchQuery !== "" || showBookmarksOnly ? (
          /* Custom Filtered view (search or bookmarks view) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 select-none">
            <div className="border-b border-zinc-950 pb-2 mb-6 flex justify-between items-end">
              <h2 className="text-xl font-editorial-title font-bold text-zinc-900 uppercase tracking-wide">
                {showBookmarksOnly
                  ? `Bookmarks in ${decodedCategory}`
                  : `Search in ${decodedCategory}: "${searchQuery}"`}
              </h2>
              <span className="text-xs text-zinc-400 font-mono font-semibold">{articlesWithDynamicStats.length} Articles</span>
            </div>

            {articlesWithDynamicStats.length === 0 ? (
              <div className="w-full text-center py-16 px-4">
                <p className="text-sm text-zinc-500 font-medium">No matching articles found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articlesWithDynamicStats.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticleId(article.id)}
                    className="group cursor-pointer border border-zinc-250 p-4 rounded-sm flex flex-col justify-between hover:border-zinc-400 transition animate-fade-in"
                  >
                    <div>
                      <div className="overflow-hidden bg-zinc-100 rounded-sm aspect-[16/9] mb-3 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-300 absolute inset-0"
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-1.5 text-[10px] text-red-700 font-extrabold uppercase tracking-widest">
                        <span>{article.category}</span>
                      </div>
                      <h3 className="font-editorial-title text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-xs text-zinc-650 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                      <span>By {article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Redesigned Premium Category Layout */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 select-none animate-fade-in">
            {/* Category Page Title */}
            <div className="border-b border-zinc-200 pb-5 mb-8 flex flex-col justify-start items-start gap-1.5">
              <h1 className="text-3.5xl sm:text-4.5xl font-editorial-title font-extrabold text-zinc-950 uppercase tracking-tight leading-none">
                {decodedCategory}
              </h1>
              <p className="text-sm text-zinc-500 italic font-serif mt-1">
                {tagline}
              </p>
            </div>

            {!hasArticles ? (
              <div className="w-full text-center py-16 px-4">
                <p className="text-sm text-zinc-500 font-medium">No articles published in this category yet.</p>
              </div>
            ) : (
              <>
                {/* Hero Feature Story */}
                {heroArticle && (
                  <div
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 cursor-pointer group mb-10 pb-10 border-b border-zinc-200"
                    onClick={() => setSelectedArticleId(heroArticle.id)}
                  >
                    {/* Hero Image (Left 7 Cols) */}
                    <div className="lg:col-span-7 overflow-hidden relative aspect-[16/10] bg-zinc-100 rounded-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroArticle.image}
                        alt={heroArticle.title}
                        className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition duration-500 absolute inset-0"
                      />
                    </div>

                    {/* Hero Text content (Right 5 Cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between py-1">
                      <div>
                        <span className="text-[10px] text-red-700 font-extrabold uppercase tracking-widest mb-2.5 block">
                          Latest in {decodedCategory}
                        </span>
                        <h2 className="font-editorial-title text-2xl sm:text-3.5xl font-extrabold text-zinc-900 leading-tight tracking-tight group-hover:text-zinc-700 transition">
                          {heroArticle.title}
                        </h2>
                        <p className="mt-3 text-sm text-zinc-650 leading-relaxed font-sans line-clamp-[13]">
                          {heroArticle.excerpt} {heroArticle.content[0]}
                        </p>
                      </div>
                      <div className="mt-6 border-t border-zinc-100 pt-3 flex items-center justify-between text-[11px] text-zinc-400 font-sans">
                        <span>By <span className="font-semibold text-zinc-700">{heroArticle.author}</span></span>
                        <span>{heroArticle.date}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-grid of remaining articles & sidebar */}
                {remainingArticles.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
                    {/* Left Column: flows naturally with page scroll (8/12) */}
                    <div className="lg:col-span-8">
                      <div className="space-y-0">
                        {leftListArticles.map((article, idx) => (
                          <div
                            key={article.id}
                            onClick={() => setSelectedArticleId(article.id)}
                            className={`group cursor-pointer flex gap-6 justify-between items-start py-5 ${idx < leftListArticles.length - 1 ? "border-b border-zinc-150" : ""
                              }`}
                          >
                            <div className="flex-1 min-w-0">
                              <h3 className="font-editorial-title text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-zinc-650 transition">
                                {article.title}
                              </h3>
                              <p className="mt-1.5 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                                {article.excerpt}
                              </p>
                              <div className="mt-2.5 text-[10px] text-zinc-400 font-sans">
                                By {article.author} &bull; {article.date}
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

                    {/* Right Column: Sticky sidebar — sticks while left scrolls (4/12) */}
                    <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-8 lg:sticky lg:top-6 lg:self-start">
                      <div className="border-b border-zinc-200 pb-1.5 mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{sidebarTitle}</h3>
                      </div>

                      <div className="divide-y divide-zinc-100">
                        {sidebarArticles.map((article) => (
                          <div
                            key={article.id}
                            onClick={() => setSelectedArticleId(article.id)}
                            className="group cursor-pointer py-3 first:pt-0"
                          >
                            <h4 className="font-editorial-title text-sm font-bold text-zinc-900 group-hover:text-zinc-650 transition leading-snug">
                              {article.title}
                            </h4>
                            <div className="mt-1 text-[10px] text-zinc-400">
                              By {article.author}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </main>

      {/* 3. Newsletter Subscription section */}
      <section className="bg-zinc-50 border-t border-zinc-250 py-10 px-4 select-none">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="font-editorial-title text-xl sm:text-2xl font-bold text-zinc-900">
            Subscribe to The Domain Name
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
              ✓ Subscribed successfully! Welcome to the Dom.
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
              The Domain Name
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
                <button onClick={() => { handleCategoryChange("US"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  U.S. News & Politics
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Finance"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Finance & Markets
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Technology"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Technology & Science
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("World"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  World Affairs
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Marketing"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Marketing & Strategy
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategoryChange("Entertainment"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
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
                <button onClick={() => { handleCategoryChange("PR News"); setShowBookmarksOnly(false); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Press Releases & News
                </button>
              </li>

            </ul>
          </div>

          {/* Col 4: Operations & Contact */}


        </div>

        {/* Lower Legal Bar */}
        <div className="max-w-7xl mx-auto border-t border-zinc-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-zinc-400 font-mono">
          <div>
            © {new Date().getFullYear()} The Domain Name. All rights reserved.
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
