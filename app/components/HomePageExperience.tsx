"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article } from "../data/news";
import Header, { HeaderLayoutSection } from "./Header";
import LeadStory from "./LeadStory";
import NewsGrid from "./NewsGrid";
import ArticleReader from "./ArticleReader";

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

interface HomePageExperienceProps {
  articlesOverride?: Article[];
  layoutSectionsOverride?: HeaderLayoutSection[];
  previewMode?: boolean;
}

interface NewsApiBlock {
  type: string;
  value: string;
}

interface NewsApiArticle {
  _id: string;
  title: string;
  excerpt?: string;
  blocks?: NewsApiBlock[];
  category: string;
  author: string;
  date: string;
  readTime?: string;
  featuredImage?: string;
  options?: {
    featuredArticle?: boolean;
    breakingNews?: boolean;
  };
}

function getSavedBookmarks() {
  if (typeof window === "undefined") return [];
  try {
    const savedBookmarks = localStorage.getItem("domain _bookmarks");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  } catch {
    return [];
  }
}

function getSavedComments() {
  if (typeof window === "undefined") return INITIAL_COMMENTS;
  try {
    const savedComments = localStorage.getItem("domain _comments");
    return savedComments ? JSON.parse(savedComments) : INITIAL_COMMENTS;
  } catch {
    return INITIAL_COMMENTS;
  }
}

export default function HomePageExperience({
  articlesOverride,
  layoutSectionsOverride,
  previewMode = false,
}: HomePageExperienceProps = {}) {
  const router = useRouter();
  // When no override is given (live homepage), load layout from API
  const [loadedSections, setLoadedSections] = useState<any[]>([]);
  const sections = (layoutSectionsOverride || loadedSections) as any[];
  const leadSection = sections.find((s: any) => s.id === 'first-hero');
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [loadedArticles, setLoadedArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(!articlesOverride);
  const articles = articlesOverride || loadedArticles;
  const loading = articlesOverride ? false : articlesLoading;

  // Load layout sections from API when not in admin preview mode
  useEffect(() => {
    if (layoutSectionsOverride) return; // admin preview supplies its own sections
    async function loadLayout() {
      try {
        const res = await fetch('/api/home-layout');
        if (res.ok) {
          const data = await res.json();
          if (data.sections && Array.isArray(data.sections)) {
            const sorted = [...data.sections].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
            setLoadedSections(sorted);
          }
        }
      } catch (err) {
        console.error('Failed to load layout:', err);
      }
    }
    loadLayout();
  }, [layoutSectionsOverride]);

  useEffect(() => {
    if (articlesOverride) {
      return;
    }

    async function loadArticles() {
      try {
        const res = await fetch("/api/news?activeOnly=true");
        if (res.ok) {
          const data = (await res.json()) as NewsApiArticle[];
          const mapped = data.map((art) => {
            const paragraphs = art.blocks
              ? art.blocks.filter((b) => b.type === 'paragraph').map((b) => b.value)
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
          setLoadedArticles(mapped);
        }
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setArticlesLoading(false);
      }
    }
    loadArticles();
  }, [articlesOverride]);

  const handleCategoryChange = (cat: string) => {
    if (cat === "All") {
      setActiveCategory("All");
      setShowBookmarksOnly(false);
      if (!previewMode) router.push("/");
    } else {
      setActiveCategory(cat);
      setShowBookmarksOnly(false);
      if (!previewMode) router.push(`/${cat}`);
    }
  };

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getSavedBookmarks);
  // Comments State
  const [comments, setComments] = useState<Record<string, Comment[]>>(getSavedComments);
  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

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

    // Dynamic update count inside articles if needed, but we draw dynamically from comments list
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
  const breakingArticleTitles = articles
    .filter((article) => article.isBreaking)
    .map((article) => article.title);

  // Secondary / Breaking news list for the Lead component
  // First pull all genuinely breaking articles, then pad with other recent articles to reach 6
  const strictBreaking = leadArticle
    ? articles.filter((a) => a.isBreaking && a.id !== leadArticle.id)
    : [];
  const fillerArticles = leadArticle
    ? articles.filter((a) => !a.isBreaking && a.id !== leadArticle.id)
    : [];
  // Combine: breaking first, then fillers to reach up to 6
  const breakingArticles = [...strictBreaking, ...fillerArticles].slice(0, 6);

  // Sub-articles for the bottom of the lead story left-column
  const leadSubArticles = leadArticle ? articles
    .filter((a) => a.id !== leadArticle.id && !breakingArticles.some((b) => b.id === a.id))
    .slice(0, 6) : [];

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

      {/* 2. Main Editorial Header */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarkCount={bookmarkedIds.length}
        showBookmarksOnly={showBookmarksOnly}
        setShowBookmarksOnly={setShowBookmarksOnly}
        overrideSections={layoutSectionsOverride}
        breakingArticleTitlesOverride={layoutSectionsOverride ? breakingArticleTitles : undefined}
      />

      {/* Main Content Body */}
      <main className="flex-grow">

        {/* Render Hero layout only if on front-page, no query, and no bookmark filter */}
        {activeCategory === "All" && searchQuery === "" && !showBookmarksOnly ? (
          <>
            <LeadStory
              leadArticle={leadArticleWithStats}
              secondaryArticles={breakingArticlesWithStats}
              subArticles={leadSubArticlesWithStats}
              onSelectArticle={setSelectedArticleId}
              settings={leadSection?.settings}
              designStyle={leadSection?.designStyle}
            />
            <NewsGrid
              articles={articlesWithDynamicStats}
              onSelectArticle={setSelectedArticleId}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              showBookmarksOnly={showBookmarksOnly}
            />
          </>
        ) : (
          /* Render search result grids directly */
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
              ✓ Subscribed successfully! Welcome to the Domain Name.
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
