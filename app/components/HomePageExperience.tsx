"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article } from "../data/news";
import Header, { HeaderLayoutSection } from "./Header";
import LeadStory from "./LeadStory";
import NewsGrid from "./NewsGrid";
import ArticleReader from "./ArticleReader";
import { useSubscription } from "../hooks/useSubscription";
import Footer from "./Footer";
import NewsletterSubscription from "./NewsletterSubscription";
import { AdHomepageMiddle, AdFooterBanner, AdStickyBottom } from "./AdPlacements";

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
  initialAds?: any[];
  previewMode?: boolean;
}

interface NewsApiBlock {
  type: string;
  value: string;
}

interface NewsApiArticle {
  _id: string;
  slug?: string;
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
  initialAds,
  previewMode = false,
}: HomePageExperienceProps = {}) {
  const router = useRouter();
  const { isSubscribed, setSubscribed } = useSubscription();
  const [isFadingOut, setIsFadingOut] = useState(false);
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

  const [ads, setAds] = useState<any[]>(initialAds || []);
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
    window.addEventListener("domain_ad_dismissed", syncClosedAds);
    return () => {
      window.removeEventListener("storage", syncClosedAds);
      window.removeEventListener("domain_ad_dismissed", syncClosedAds);
    };
  }, []);

  useEffect(() => {
    if (initialAds) return;
    async function loadAds() {
      try {
        const res = await fetch("/api/advertisements");
        if (res.ok) {
          const data = await res.json();
          setAds(data.filter((ad: any) => ad.status === "active"));
        }
      } catch (err) {
        console.error("Failed to load ads in home:", err);
      }
    }
    loadAds();
  }, [initialAds]);

  const visibleAds = ads.filter((ad: any) => !closedAdIds.includes(ad._id));
  const homepageMiddleAd = visibleAds.find((ad: any) => ad.position === "Homepage Middle");
  const footerBannerAds = visibleAds.filter((ad: any) => ad.position === "Footer Banner");
  const stickyBottomAd = visibleAds.find((ad: any) => ad.position === "Sticky Bottom");

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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("search");
      const bookmarks = params.get("bookmarks");
      if (search) {
        setSearchQuery(search);
      }
      if (bookmarks === "true") {
        setShowBookmarksOnly(true);
      }
    }
  }, []);

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
              slug: art.slug || art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || art._id,
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

  const handleSelectArticle = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article) {
      router.push(`/article/${article.slug}`);
    }
  };

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getSavedBookmarks);
  // Comments State
  const [comments, setComments] = useState<Record<string, Comment[]>>(getSavedComments);

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
    slug: "",
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
        </div>
      </div>
    );
  }

  const handleCloseAd = (id: string) => {
    const nextClosed = [...closedAdIds, id];
    setClosedAdIds(nextClosed);
    try {
      localStorage.setItem("domain_closed_ads", JSON.stringify(nextClosed));
    } catch (e) {}
    window.dispatchEvent(new Event("domain_ad_dismissed"));
  };

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

        {articles.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center select-none">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-4xl text-zinc-300">📰</div>
              <h2 className="font-serif text-2xl font-bold text-zinc-900">No Articles Found</h2>
              <p className="text-sm text-zinc-500 leading-relaxed font-sans">
                There are currently no articles published on the home page. Please check back later or log in to the admin panel to add new articles.
              </p>
            </div>
          </div>
        ) : activeCategory === "All" && searchQuery === "" && !showBookmarksOnly ? (
          <>
            <LeadStory
              leadArticle={leadArticleWithStats}
              secondaryArticles={breakingArticlesWithStats}
              subArticles={leadSubArticlesWithStats}
              onSelectArticle={handleSelectArticle}
              settings={leadSection?.settings}
              designStyle={leadSection?.designStyle}
            />
            <AdHomepageMiddle ad={homepageMiddleAd} />
            <NewsGrid
              articles={articlesWithDynamicStats}
              onSelectArticle={handleSelectArticle}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              showBookmarksOnly={showBookmarksOnly}
              sections={sections}
            />
          </>
        ) : (
          /* Render search result grids directly */
          <NewsGrid
            articles={articlesWithDynamicStats}
            onSelectArticle={handleSelectArticle}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            showBookmarksOnly={showBookmarksOnly}
            sections={sections}
          />
        )}

      </main>

      {/* 3. Newsletter Subscription section */}
      <NewsletterSubscription previewMode={previewMode} />

      {/* 4. Main Editorial Footer */}
      <Footer />

      {/* Footer Banner Ads */}
      <AdFooterBanner ads={footerBannerAds} onClose={handleCloseAd} />

      {/* Sticky Bottom Ad */}
      <AdStickyBottom ad={stickyBottomAd} onClose={handleCloseAd} />

    </div>
  );
}
