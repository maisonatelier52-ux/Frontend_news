"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Article, NEWS_ARTICLES } from "@/app/data/news";
import Header from "@/app/components/Header";
import { useSubscription } from "@/app/hooks/useSubscription";
import Footer from "@/app/components/Footer";

interface Comment {
  name: string;
  date: string;
  text: string;
}

type FontSize = "sm" | "base" | "lg" | "xl";

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;
  const { isSubscribed, email: subscriberEmail, setSubscribed } = useSubscription();

  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [dbComments, setDbComments] = useState<any[]>([]);
  const [commentSuccessMsg, setCommentSuccessMsg] = useState("");
  const [commentErrorMsg, setCommentErrorMsg] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  
  // Author Dynamic Profile State
  const [authorDetails, setAuthorDetails] = useState<any>(null);
  const [showAuthorPanel, setShowAuthorPanel] = useState(false);
  const [authorArticles, setAuthorArticles] = useState<any[]>([]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterEmail2, setNewsletterEmail2] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterLoading2, setNewsletterLoading2] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [newsletterMsg2, setNewsletterMsg2] = useState("");
  const [newsletterErr, setNewsletterErr] = useState("");
  const [newsletterErr2, setNewsletterErr2] = useState("");

  // Dynamic Detail Page Layout settings
  const [detailLayout, setDetailLayout] = useState<any>({
    designStyle: "classic-sidebar",
    colorTheme: "crimson",
    fontSizeDefault: "base",
    showShareBar: true,
    shareBarPosition: "bottom",
    authorCardStyle: "signature",
    showComments: true
  });
  const designStyle = detailLayout.designStyle === "classic-sidebar" ? "original" : detailLayout.designStyle;
  const [ads, setAds] = useState<any[]>([]);
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
    async function loadAds() {
      try {
        const res = await fetch("/api/advertisements");
        if (res.ok) {
          const data = await res.json();
          setAds(data.filter((ad: any) => ad.status === "active"));
        }
      } catch (err) {
        console.error("Failed to load advertisements:", err);
      }
    }
    loadAds();
  }, []);

  useEffect(() => {
    async function loadDetailLayout() {
      try {
        const res = await fetch("/api/detail-layout");
        if (res.ok) {
          const data = await res.json();
          setDetailLayout(data);
          if (data.fontSizeDefault) {
            setFontSize(data.fontSizeDefault);
          }
        }
      } catch (err) {
        console.error("Failed to load detail layout configurations:", err);
      }
    }
    loadDetailLayout();
  }, []);

  // Load bookmarks and comments on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("domain_bookmarks") || localStorage.getItem("domain _bookmarks");
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }

      // Database comments are loaded dynamically via fetchDbComments hook below
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }
  }, []);

  // Fetch article data
  useEffect(() => {
    if (!slug) return;

    async function fetchArticle() {
      try {
        setLoading(true);
        const res = await fetch(`/api/news?activeOnly=true&slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            const art = data[0];
            setArticle({
              id: art._id,
              slug: art.slug,
              title: art.title,
              excerpt: art.excerpt || "",
              blocks: art.blocks || [{ id: "fallback-p", type: "paragraph", value: art.excerpt || "" }],
              category: art.category,
              author: art.author,
              authorTitle: "Staff Reporter",
              date: new Date(art.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              readTime: art.readTime || "5 mins",
              image: art.featuredImage || "/article-placeholder.jpg",
              imageAltText: art.imageAltText || art.title,
              commentsCount: Math.floor(Math.random() * 25) + 3,
            });
            return;
          }
        }
        
        // Fallback to static mock articles
        const mockMatch = NEWS_ARTICLES.find((a) => a.slug === slug);
        if (mockMatch) {
          // Convert array of string paragraphs to block layout
          const blocks = mockMatch.content.map((p, index) => ({
            id: `mock-block-${index}`,
            type: "paragraph",
            value: p
          }));
          setArticle({
            ...mockMatch,
            blocks
          });
        }
      } catch (err) {
        console.error("Fetch article details error:", err);
        const mockMatch = NEWS_ARTICLES.find((a) => a.slug === slug);
        if (mockMatch) {
          const blocks = mockMatch.content.map((p, index) => ({
            id: `mock-block-${index}`,
            type: "paragraph",
            value: p
          }));
          setArticle({
            ...mockMatch,
            blocks
          });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  // Fetch database comments for the current article
  const fetchDbComments = async () => {
    if (!article || !article.id) return;
    try {
      const res = await fetch(`/api/comments?articleId=${article.id}`);
      if (res.ok) {
        const data = await res.json();
        setDbComments(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch comments from DB:", err);
    }
  };

  useEffect(() => {
    fetchDbComments();
  }, [article]);

  // Load trending articles for sidebar
  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch("/api/news?activeOnly=true");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.slice(0, 8).map((art: any) => ({
            id: art._id,
            slug: art.slug,
            title: art.title,
            category: art.category,
          }));
          setTrendingArticles(mapped);
        } else {
          setTrendingArticles(NEWS_ARTICLES.slice(0, 8));
        }
      } catch {
        setTrendingArticles(NEWS_ARTICLES.slice(0, 8));
      }
    }
    loadTrending();
  }, []);

  // Fetch author details dynamically based on author's name
  useEffect(() => {
    if (!article) return;
    async function fetchAuthorInfo() {
      try {
        const res = await fetch("/api/authors");
        if (res.ok) {
          const authors = await res.json();
          const match = authors.find(
            (auth: any) => auth.name.toLowerCase() === article.author.toLowerCase()
          );
          if (match) {
            setAuthorDetails(match);
          }
        }
      } catch (err) {
        console.error("Fetch author info error:", err);
      }
    }
    fetchAuthorInfo();
  }, [article]);

  // Fetch other articles by the same author for profile panel
  useEffect(() => {
    if (!authorDetails) return;
    async function loadAuthorArticles() {
      try {
        const res = await fetch(`/api/news?activeOnly=true`);
        if (res.ok) {
          const data = await res.json();
          const match = data.filter(
            (art: any) => art.author.toLowerCase() === authorDetails.name.toLowerCase()
          );
          setAuthorArticles(match);
        }
      } catch (err) {
        console.error("Failed to load author articles:", err);
      }
    }
    loadAuthorArticles();
  }, [authorDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="h-4 bg-zinc-200 w-24 rounded mx-auto" />
          <div className="h-10 bg-zinc-200 w-3/4 rounded mx-auto" />
          <div className="h-4 bg-zinc-200 w-1/2 rounded mx-auto" />
          <div className="h-[400px] bg-zinc-100 rounded" />
          <div className="space-y-3">
            <div className="h-4 bg-zinc-200 rounded" />
            <div className="h-4 bg-zinc-200 rounded" />
            <div className="h-4 bg-zinc-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center select-none">
        <h2 className="font-editorial-title text-3xl font-bold text-zinc-900">Article Not Found</h2>
        <p className="text-zinc-550 text-sm max-w-sm">We couldn't locate the article you were looking for. It may have been deleted or moved.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-zinc-900 text-white text-xs font-bold py-2 px-5 rounded cursor-pointer hover:bg-zinc-800 transition"
        >
          Back to Homepage
        </button>
      </div>
    );
  }

  const handleToggleBookmark = () => {
    let next: string[];
    if (bookmarkedIds.includes(article.id)) {
      next = bookmarkedIds.filter((bId) => bId !== article.id);
    } else {
      next = [...bookmarkedIds, article.id];
    }
    setBookmarkedIds(next);
    try {
      localStorage.setItem("domain_bookmarks", JSON.stringify(next));
      localStorage.setItem("domain _bookmarks", JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2500);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubscribed) {
      setCommentErrorMsg("Only subscribed users can comment. Please subscribe first.");
      return;
    }
    if (!nameInput.trim() || !commentInput.trim()) return;

    setCommentSubmitting(true);
    setCommentSuccessMsg("");
    setCommentErrorMsg("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          articleTitle: article.title,
          name: nameInput.trim(),
          email: subscriberEmail,
          text: commentInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCommentSuccessMsg(data.message || "Thank you for sharing your valuable perspective. To maintain a thoughtful and respectful community, your comment has been submitted for review and will appear once approved.");
        setNameInput("");
        setCommentInput("");
        setTimeout(() => setCommentSuccessMsg(""), 6000);
      } else {
        setCommentErrorMsg(data.error || "Failed to submit comment.");
      }
    } catch (err) {
      console.error("Submit comment error:", err);
      setCommentErrorMsg("Failed to submit comment. Please check your connection and try again.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const articleComments = dbComments;

  // Custom Editorial Block Renderer
  const renderBlock = (block: any, index: number) => {
    const fontClasses: Record<FontSize, string> = {
      sm: "text-sm sm:text-base leading-relaxed text-zinc-800 font-serif",
      base: "text-base sm:text-lg leading-relaxed text-zinc-800 font-serif",
      lg: "text-lg sm:text-xl leading-relaxed text-zinc-900 font-serif",
      xl: "text-xl sm:text-2xl leading-relaxed text-zinc-900 font-serif",
    };

    switch (block.type) {
      case "paragraph": {
        const text = block.value || "";
        if (index === 0) {
          const firstLetter = text.charAt(0);
          const rest = text.slice(1);
          if (designStyle === "minimal-focus") {
            return (
              <p key={block.id || index} className={fontClasses[fontSize]}>
                <span className="float-left text-5xl md:text-6xl font-black font-serif mr-3 mt-1.5 text-zinc-900 border border-zinc-900 px-3 py-1 bg-zinc-50 shadow-2xs leading-[0.85] select-none">
                  {firstLetter}
                </span>
                {rest}
              </p>
            );
          }
          return (
            <p key={block.id || index} className={fontClasses[fontSize]}>
              <span className="float-left text-5xl md:text-6xl font-bold font-serif mr-2 mt-1.5 text-zinc-900 leading-[0.8] select-none">
                {firstLetter}
              </span>
              {rest}
            </p>
          );
        }
        return (
          <p key={block.id || index} className={fontClasses[fontSize]}>
            {text}
          </p>
        );
      }

      case "subheading":
        return (
          <h3 key={block.id || index} className="font-editorial-title text-xl sm:text-2xl font-bold text-zinc-900 pt-6 pb-2">
            {block.value}
          </h3>
        );

      case "pullquote":
        return (
          <blockquote key={block.id || index} className="border-l-4 border-zinc-900 pl-6 py-2 my-8 font-serif italic text-zinc-800 text-lg sm:text-xl max-w-xl mx-auto">
            <p className="leading-relaxed">“{block.value.quote}”</p>
            {block.value.author && (
              <cite className="block text-xs font-bold text-zinc-500 font-sans uppercase tracking-widest mt-2.5 not-italic">
                — {block.value.author}
              </cite>
            )}
          </blockquote>
        );

      case "image":
        return (
          <figure key={block.id || index} className="my-8 space-y-2">
            <div className="relative aspect-[16/10] bg-zinc-50 rounded-sm overflow-hidden border border-zinc-200 shadow-xs">
              <img src={block.value.url} alt={block.value.caption || "Image"} className="w-full h-full object-cover" />
            </div>
            {block.value.caption && (
              <figcaption className="text-[11px] text-zinc-500 text-center font-sans leading-relaxed italic">
                {block.value.caption}
              </figcaption>
            )}
          </figure>
        );

      case "at-glance":
        return (
          <div key={block.id || index} className={`my-8 bg-zinc-50 rounded-sm p-6 max-w-xl mx-auto space-y-4 shadow-3xs ${designStyle === "minimal-focus" ? "border-2 border-dashed border-zinc-300 bg-stone-50/60" : "border border-zinc-200"}`}>
            <div className="border-b border-zinc-200 pb-3">
              <h4 className="font-editorial-title text-base font-extrabold text-zinc-900 tracking-tight">
                {block.value.title || "At a Glance"}
              </h4>
              {block.value.subtitle && (
                <p className="text-[10px] text-zinc-400 font-sans font-bold uppercase tracking-wider mt-1">
                  {block.value.subtitle}
                </p>
              )}
            </div>
            <div className="divide-y divide-zinc-200/60 text-xs">
              {block.value.rows?.map((row: any, rIndex: number) => (
                <div key={rIndex} className="py-2.5 flex justify-between items-start gap-4">
                  <span className="font-bold text-zinc-800 font-sans shrink-0 uppercase tracking-wider text-[9px]">
                    {row.label}
                  </span>
                  <span className="text-zinc-650 text-right leading-relaxed font-sans">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div key={block.id || index} className={`my-8 bg-white rounded-sm p-6 space-y-5 shadow-3xs ${designStyle === "minimal-focus" ? "border-2 border-dashed border-zinc-300" : "border border-zinc-250"}`}>
            <h4 className="font-editorial-title text-base font-extrabold text-zinc-900 border-b border-zinc-200 pb-2.5 tracking-tight">
              {block.value.title || "Frequently Asked Questions"}
            </h4>
            <div className="space-y-4">
              {block.value.items?.map((qa: any, qIndex: number) => (
                <div key={qIndex} className="space-y-2 border-b border-zinc-100 last:border-b-0 pb-3 last:pb-0">
                  <h5 className="text-sm font-bold text-zinc-900 flex items-start gap-2 leading-snug">
                    <span className="text-zinc-400 select-none font-mono">Q:</span>
                    {qa.question}
                  </h5>
                  <p className="text-xs text-zinc-655 leading-relaxed pl-5 font-sans bg-zinc-50 p-3 border-l-2 border-zinc-900 rounded-r-xs">
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Dynamic color theme class mappings
  const themeAccentClasses: Record<string, string> = {
    crimson: "text-red-750",
    indigo: "text-indigo-650",
    emerald: "text-emerald-700",
    slate: "text-slate-800",
    amber: "text-amber-600",
    ocean: "text-sky-700",
  };

  const themeBgClasses: Record<string, string> = {
    crimson: "bg-red-750",
    indigo: "bg-indigo-650",
    emerald: "bg-emerald-700",
    slate: "bg-slate-800",
    amber: "bg-amber-600",
    ocean: "bg-sky-700",
  };

  const themeBorderClasses: Record<string, string> = {
    crimson: "border-red-750",
    indigo: "border-indigo-650",
    emerald: "border-emerald-700",
    slate: "border-slate-800",
    amber: "border-amber-600",
    ocean: "border-sky-700",
  };

  const themeHoverTextClasses: Record<string, string> = {
    crimson: "hover:text-red-750",
    indigo: "hover:text-indigo-650",
    emerald: "hover:text-emerald-700",
    slate: "hover:text-slate-800",
    amber: "hover:text-amber-600",
    ocean: "hover:text-sky-700",
  };

  const themeHoverBorderClasses: Record<string, string> = {
    crimson: "hover:border-red-750",
    indigo: "hover:border-indigo-650",
    emerald: "hover:border-emerald-700",
    slate: "hover:border-slate-800",
    amber: "hover:border-amber-600",
    ocean: "hover:border-sky-700",
  };

  const accentColorClass = themeAccentClasses[detailLayout.colorTheme] || "text-red-750";
  const accentBgClass = themeBgClasses[detailLayout.colorTheme] || "bg-red-750";
  const accentBorderClass = themeBorderClasses[detailLayout.colorTheme] || "border-red-750";
  const accentHoverTextClass = themeHoverTextClasses[detailLayout.colorTheme] || "hover:text-red-700";
  const accentHoverBorderClass = themeHoverBorderClasses[detailLayout.colorTheme] || "hover:border-red-750";

  const parseAdSize = (sizeStr: string, fallbackW = 300, fallbackH = 250) => {
    const parts = (sizeStr || "").split(/[x×]/);
    const w = parseInt(parts[0]) || fallbackW;
    const h = parseInt(parts[1]) || fallbackH;
    return { w, h };
  };

  const visibleAds = ads.filter((ad: any) => !closedAdIds.includes(ad._id));
  const detailPageBelowSubscriptionAd = visibleAds.find((ad: any) => ad.position === "Detail Page Below Subscription");
  const footerBannerAds = visibleAds.filter((ad: any) => ad.position === "Footer Banner");
  const stickyBottomAd = visibleAds.find((ad: any) => ad.position === "Sticky Bottom");

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Editorial Header */}
      <Header
        activeCategory={article.category}
        setActiveCategory={(cat) => {
          if (cat === "All") {
            router.push("/");
          } else {
            router.push(`/${cat}`);
          }
        }}
        searchQuery=""
        setSearchQuery={(query) => {
          router.push(`/?search=${encodeURIComponent(query)}`);
        }}
        bookmarkCount={bookmarkedIds.length}
        showBookmarksOnly={false}
        setShowBookmarksOnly={(val) => {
          if (val) {
            router.push("/?bookmarks=true");
          }
        }}
      />

      {/* Main Grid Content - Same padding constraints as Homepage */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Magazine Cover Hero Header */}
        {designStyle === "magazine-hero" && (
          <div className="mb-10 space-y-6 text-left max-w-5xl mx-auto animate-[admin-fade-in_0.3s_ease-out]">
            {/* Category tag */}
            <div className="flex items-center select-none">
              <span className={`text-[10px] ${accentColorClass} font-extrabold uppercase tracking-widest border border-zinc-200 px-3 py-1 rounded-[4px] bg-zinc-50`}>
                {article.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="font-editorial-title text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 leading-tight tracking-tight">
              {article.title}
            </h1>

            {/* Excerpt / Subtitle */}
            <p className="text-zinc-550 text-base sm:text-lg leading-relaxed italic font-serif border-l-2 border-zinc-300 pl-4 py-1">
              {article.excerpt}
            </p>

            {/* Print style Info Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center border-y border-zinc-200 py-3.5 text-xs text-zinc-550 select-none">
              <div className="font-medium">
                By{" "}
                <button
                  onClick={() => setShowAuthorPanel(true)}
                  className={`font-bold text-zinc-800 ${accentHoverTextClass} underline underline-offset-2 transition cursor-pointer`}
                  title="View Author Profile"
                >
                  {article.author}
                </button>
                <span className="text-zinc-400"> • {authorDetails?.role || "Staff Reporter"}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Published {article.date}</span>
                <span className="text-zinc-300">•</span>
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Huge Featured Photo */}
            <div className="relative aspect-[21/9] bg-zinc-50 rounded-xs overflow-hidden border border-zinc-200 shadow-xs">
              <img
                src={article.image}
                alt={article.imageAltText || article.title}
                className="w-full h-full object-cover filter brightness-95"
              />
            </div>
            <div className="text-[10px] text-zinc-400 font-mono text-right italic select-none">
              {article.imageAltText || article.title || "Photo Credits: Unsplash Editorial Archives."}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12">
          
          {/* Main Reading Column */}
          <div className={`
            ${(designStyle === "full-width" || designStyle === "minimal-focus") ? "lg:col-span-12 max-w-3xl mx-auto w-full" : "lg:col-span-8"}
            ${designStyle === "left-sidebar" ? "lg:order-2" : ""}
            ${designStyle === "minimal-focus" ? "border-t-4 border-b-4 border-double border-zinc-950 bg-stone-50/30 p-5 sm:p-8 shadow-xs text-left animate-[admin-fade-in_0.3s_ease-out]" : ""}
            space-y-6
          `}>
               {designStyle !== "magazine-hero" && (
              <>
                {/* Category tag */}
                {designStyle === "minimal-focus" ? (
                  <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-405 select-none pt-0.5">
                    <div className="h-[1px] flex-grow bg-zinc-200" />
                    <span className={accentColorClass}>{article.category}</span>
                    <div className="h-[1px] flex-grow bg-zinc-200" />
                  </div>
                ) : (
                  <div className="flex items-center select-none text-left">
                    <span className={`text-[10px] ${accentColorClass} font-extrabold uppercase tracking-widest border border-zinc-200 px-3 py-1 rounded-[4px] bg-zinc-50`}>
                      {article.category}
                    </span>
                  </div>
                )}

                {/* Headline style */}
                <div className={designStyle === "minimal-focus" ? "pt-2 text-center" : "pt-0.5 text-left"}>
                  <h1 className={designStyle === "minimal-focus" ? "font-editorial-title text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 leading-tight tracking-tight px-2" : "font-editorial-title text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 leading-tight tracking-tight"}>
                    {article.title}
                  </h1>
                </div>

                {/* Excerpt / Subtitle */}
                {designStyle === "minimal-focus" ? (
                  <p className="text-center text-zinc-555 text-base sm:text-lg leading-relaxed italic font-serif max-w-2xl mx-auto border-none pl-0 pt-2">
                    {article.excerpt}
                  </p>
                ) : (
                  <p className="text-zinc-555 text-base sm:text-lg leading-relaxed italic font-serif border-l-2 border-zinc-300 pl-4 py-1 text-left">
                    {article.excerpt}
                  </p>
                )}

                {/* Print style Info Bar */}
                {designStyle === "minimal-focus" ? (
                  <div className="flex flex-wrap justify-center items-center gap-4 border-y border-zinc-250 py-3 text-xs text-zinc-500 font-medium select-none">
                    <div>
                      By{" "}
                      <button
                        onClick={() => setShowAuthorPanel(true)}
                        className={`font-bold text-zinc-800 ${accentHoverTextClass} underline underline-offset-2 transition cursor-pointer`}
                      >
                        {article.author}
                      </button>
                      <span className="text-zinc-400"> • {authorDetails?.role || "Staff Reporter"}</span>
                    </div>
                    <span className="text-zinc-300 select-none">•</span>
                    <div>Published {article.date}</div>
                    <span className="text-zinc-300 select-none">•</span>
                    <div>{article.readTime}</div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center border-y border-zinc-200 py-3.5 text-xs text-zinc-500 select-none">
                    <div className="font-medium">
                      By{" "}
                      <button
                        onClick={() => setShowAuthorPanel(true)}
                        className={`font-bold text-zinc-800 ${accentHoverTextClass} underline underline-offset-2 transition cursor-pointer`}
                        title="View Author Profile"
                      >
                        {article.author}
                      </button>
                      <span className="text-zinc-400"> • {authorDetails?.role || "Staff Reporter"}</span>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span>Published {article.date}</span>
                        <span className="text-zinc-300">•</span>
                        <span>{article.readTime}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Bookmark Button */}
                        <button
                          onClick={handleToggleBookmark}
                          className="text-zinc-500 hover:text-black transition cursor-pointer"
                          title={bookmarkedIds.includes(article.id) ? "Remove Bookmark" : "Bookmark Article"}
                        >
                          <svg className="w-4.5 h-4.5" fill={bookmarkedIds.includes(article.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>

                        {/* Share Link */}
                        <button
                          onClick={handleShare}
                          className="text-zinc-500 hover:text-black transition cursor-pointer relative"
                          title="Copy Article Link"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318m0 0a3 3 0 10-4.243-4.243m4.243 4.243L13.32 12.35m0 0l4.636 2.318m0 0a3 3 0 11-4.243 4.243m4.243-4.243L13.32 12.35M6 16a3 3 0 100-6 3 3 0 000 6z" />
                          </svg>
                          {showShareNotification && (
                            <span className="absolute bottom-7 right-0 bg-zinc-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded whitespace-nowrap shadow-md">
                              Link copied!
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Featured Photo */}
                <div className="relative aspect-[16/10] bg-zinc-50 rounded-xs overflow-hidden border border-zinc-200 shadow-xs">
                  <img
                    src={article.image}
                    alt={article.imageAltText || article.title}
                    className="w-full h-full object-cover filter brightness-95"
                  />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono text-right italic select-none">
                  {article.imageAltText || article.title || "Photo Credits: Unsplash Editorial Archives."}
                </div>
              </>
            )}

            {/* Sticky Share Bar Option */}
            {detailLayout.showShareBar && detailLayout.shareBarPosition === "sticky-left" && (
              <div className="hidden xl:flex flex-col fixed left-10 top-40 bg-white border border-zinc-200 rounded-2xl p-2 gap-1 shadow-md z-30">
                {/* Copy Link */}
                <button onClick={handleShare} className={`p-2.5 rounded-xl text-zinc-500 ${accentHoverTextClass} hover:bg-zinc-50 transition cursor-pointer`} title="Copy Link">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </button>
                <div className="h-px bg-zinc-100 mx-2" />
                {/* WhatsApp */}
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent((article?.title || '') + '\n' + (typeof window !== 'undefined' ? window.location.href : ''))}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl text-zinc-500 hover:text-green-600 hover:bg-green-50 transition" title="Share on WhatsApp">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                {/* Twitter / X */}
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article?.title || '')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl text-zinc-500 hover:text-black hover:bg-zinc-50 transition" title="Share on X">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* Facebook */}
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl text-zinc-500 hover:text-blue-600 hover:bg-blue-50 transition" title="Share on Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            )}

            {/* Dynamic Article Blocks Rendering */}
            <article className="mt-8 font-editorial-body space-y-6 pb-2 text-left">
              {article.blocks?.map((block: any, idx: number) => renderBlock(block, idx))}
            </article>
            {/* Share options */}
            {detailLayout.showShareBar && detailLayout.shareBarPosition === "bottom" && (
              <div className="py-3.5 border-b border-zinc-200 select-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                      Share this story
                    </span>
                    <div className="h-[1px] w-8 bg-zinc-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent((article.title) + '\n' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border border-zinc-200 text-zinc-500 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition"
                      title="Share on WhatsApp"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>

                    {/* Reddit */}
                    <a
                      href={`https://reddit.com/submit?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border border-zinc-200 text-zinc-500 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition"
                      title="Share on Reddit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.excerpt || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border border-zinc-200 text-zinc-500 hover:text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition"
                      title="Share on LinkedIn"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border border-zinc-200 text-zinc-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition"
                      title="Share on Facebook"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>

                    {/* Twitter / X */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border border-zinc-200 text-zinc-500 hover:text-black hover:border-zinc-800 hover:bg-zinc-50 transition"
                      title="Share on X"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>

                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border border-zinc-200 text-zinc-500 hover:text-sky-500 hover:border-sky-400 hover:bg-sky-50 transition"
                      title="Share on Telegram"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>

                    {/* Copy Link Button */}
                    <button
                      onClick={handleShare}
                      className={`p-2.5 rounded-full border border-zinc-200 text-zinc-500 ${accentHoverTextClass} ${accentHoverBorderClass} transition cursor-pointer relative`}
                      title="Copy Article Link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      {showShareNotification && (
                        <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded whitespace-nowrap shadow-md z-20">
                          Link copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Author Card style selection */}
            {detailLayout.authorCardStyle === "signature" && (
              <div className="my-12 p-6 sm:p-8 bg-zinc-50 border border-zinc-200 rounded-lg shadow-3xs flex flex-col gap-4 select-none relative overflow-hidden animate-[admin-fade-in_0.3s_ease-out]">
                {/* Decorative top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${accentBgClass}`} />
                
                {/* Top Row: Avatar, Name, Label, and Badge */}
                <div className="flex items-center justify-between w-full gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {authorDetails?.profileImage ? (
                        <img
                          src={authorDetails.profileImage}
                          alt={article.author}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-md cursor-pointer hover:scale-105 transition duration-300"
                          onClick={() => setShowAuthorPanel(true)}
                        />
                      ) : (
                        <div 
                          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-50 ${accentColorClass} flex items-center justify-center font-bold border-2 border-white shadow-md cursor-pointer hover:scale-105 transition text-lg sm:text-xl`}
                          onClick={() => setShowAuthorPanel(true)}
                        >
                          {article.author.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    {/* Name and Label */}
                    <div className="text-left">
                      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${accentColorClass} block leading-none mb-1`}>
                        Journalist Profile
                      </span>
                      <h4 className="text-sm sm:text-lg font-serif font-black text-zinc-900 tracking-tight leading-tight">
                        {article.author}
                      </h4>
                    </div>
                  </div>
                  
                  {/* Badge role */}
                  <span className="shrink-0 text-[8px] sm:text-[10px] px-2 sm:px-3 py-1 bg-zinc-900 text-white font-extrabold uppercase tracking-widest rounded-sm shadow-3xs">
                    {authorDetails?.role || "Staff Reporter"}
                  </span>
                </div>

                {/* Bio description */}
                <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans italic text-left border-t border-zinc-200/40 pt-3">
                  “{authorDetails?.bio ||
                    "A veteran journalist dedicated to in-depth research, reporting on critical affairs, and providing objective coverage of domestic and international issues."}”
                </p>

                {/* Bottom row: links */}
                <div className="flex flex-wrap items-center justify-start gap-2 pt-2 border-t border-zinc-200/60 text-xs text-zinc-550 font-medium">
                  {authorDetails?.email && (
                    <a href={`mailto:${authorDetails.email}`} className={`hover:${accentColorClass} transition duration-200 flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded-sm shadow-3xs hover:shadow-2xs text-[10px] sm:text-xs`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{authorDetails.email}</span>
                    </a>
                  )}
                  {authorDetails?.websiteUrl && (
                    <a href={authorDetails.websiteUrl} target="_blank" rel="noopener noreferrer" className={`hover:${accentColorClass} transition duration-200 flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded-sm shadow-3xs hover:shadow-2xs text-[10px] sm:text-xs`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span>Website</span>
                    </a>
                  )}
                  {authorDetails?.socialLinks?.twitter && (
                    <a href={authorDetails.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={`hover:${accentColorClass} transition duration-200 flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded-sm shadow-3xs hover:shadow-2xs text-[10px] sm:text-xs`}>
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span>Twitter</span>
                    </a>
                  )}
                  <button
                    onClick={() => setShowAuthorPanel(true)}
                    className="ml-auto shrink-0 flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-md hover:bg-zinc-700 transition cursor-pointer"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    View Full Profile →
                  </button>
                </div>
              </div>
            )}

            {detailLayout.authorCardStyle === "classic" && (
              <div className="my-10 border border-zinc-200 bg-white p-5 select-none rounded shadow-3xs text-left animate-[admin-fade-in_0.3s_ease-out]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center font-bold text-zinc-700">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{article.author}</h4>
                    <span className="text-[10px] text-zinc-500 font-medium">{authorDetails?.role || "Staff Reporter"}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans mt-3">
                  {authorDetails?.bio || "A veteran journalist dedicated to in-depth research, reporting on critical affairs, and providing objective coverage of domestic and international issues."}
                </p>
              </div>
            )}

            {detailLayout.authorCardStyle === "minimal" && (
              <div className="my-8 py-4 border-t border-b border-zinc-250/60 flex items-center justify-between text-xs text-zinc-650 select-none text-left animate-[admin-fade-in_0.3s_ease-out]">
                <div>
                  Written by <span className="font-bold text-zinc-900">{article.author}</span> ({authorDetails?.role || "Staff Reporter"})
                </div>
                <button
                  onClick={() => setShowAuthorPanel(true)}
                  className={`font-bold hover:underline cursor-pointer ${accentColorClass}`}
                >
                  Contact Author
                </button>
              </div>
            )}

            {/* Comments and Discussion Area */}
            {detailLayout.showComments && (
              <section className="space-y-6 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                    {detailLayout.discussionTitle?.trim() || "DISCUSSION"} <span className="text-zinc-400 font-normal">({dbComments.length})</span>
                  </h3>
                  <div className="text-xs text-zinc-400 font-medium">
                    Sort by: <span className="text-zinc-700 font-semibold">Newest ↓</span>
                  </div>
                </div>

                {/* Comment Cards */}
                <div className="space-y-3">
                  {dbComments.length === 0 ? (
                    <div className="bg-zinc-50 rounded-xl p-6 text-center">
                      <div className="text-2xl mb-2">💬</div>
                      <p className="text-sm text-zinc-500 font-medium">No comments yet.</p>
                      <p className="text-xs text-zinc-400 mt-1">Be the first to join the conversation.</p>
                    </div>
                  ) : (
                    dbComments.map((comment) => (
                      <div key={comment._id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 select-none">
                              {comment.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-zinc-900">{comment.name}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">Member</span>
                              </div>
                              <p className="text-sm text-zinc-700 leading-relaxed mt-1.5">{comment.text}</p>
                              <button className="mt-2 flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 font-semibold transition cursor-pointer">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                Reply
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-400 whitespace-nowrap shrink-0 pt-0.5">
                            {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} •{" "}
                            {new Date(comment.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Comment Form */}
                <form onSubmit={handleSubmitComment} className="bg-zinc-50 rounded-2xl p-5 space-y-4">
                  {/* Form header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{detailLayout.sharePerspectiveTitle?.trim() || "Share Your Perspective"}</h4>
                      <p className="text-xs text-zinc-400">Join the conversation and let us know your thoughts.</p>
                    </div>
                  </div>

                  {/* Subscription warning */}
                  {!isSubscribed && (
                    <div className="border border-amber-200 bg-amber-50 p-3 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                      <span className="text-sm">⚠️</span>
                      <span><strong>Only subscribed readers can comment.</strong> Please subscribe to join the discussion.</span>
                    </div>
                  )}

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-350" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        disabled={!isSubscribed || commentSubmitting}
                        className="bg-white rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-zinc-800 w-full focus:outline-none focus:ring-2 focus:ring-zinc-300 transition disabled:opacity-50 border-0 shadow-sm"
                        required
                      />
                    </div>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-350" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        disabled={!isSubscribed || commentSubmitting}
                        className="bg-white rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-zinc-800 w-full focus:outline-none focus:ring-2 focus:ring-zinc-300 transition disabled:opacity-50 border-0 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Textarea with char counter */}
                  <div className="relative">
                    <svg className="absolute left-3 top-3 w-4 h-4 text-zinc-350" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    <textarea
                      placeholder="Write your comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value.slice(0, 1000))}
                      disabled={!isSubscribed || commentSubmitting}
                      className="bg-white rounded-lg pl-9 pr-3.5 py-3 text-sm text-zinc-800 w-full h-28 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 transition disabled:opacity-50 border-0 shadow-sm"
                      required
                    />
                    <span className="absolute bottom-2.5 right-3 text-[10px] text-zinc-350 font-mono">{commentInput.length}/1000</span>
                  </div>

                  {commentSuccessMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs font-medium text-emerald-700">
                      ✓ {commentSuccessMsg}
                    </div>
                  )}
                  {commentErrorMsg && (
                    <p className="text-xs font-semibold text-red-600">✕ {commentErrorMsg}</p>
                  )}

                  {/* Footer row */}
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={!isSubscribed || commentSubmitting}
                      className="bg-zinc-900 text-white text-xs font-extrabold uppercase tracking-wider py-2.5 px-5 rounded-lg cursor-pointer hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {commentSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Preserved Sidebar Sections for Full Width & Minimal Focus Layouts */}
            {(designStyle === "full-width" || designStyle === "minimal-focus") && (
              <div className="border-t border-zinc-200 pt-8 mt-8 space-y-8 text-left">
                {/* Trending Stories */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider border-b-2 border-zinc-900 pb-2 text-left">
                    {detailLayout.trendingStoriesTitle?.trim() || "Trending Stories"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trendingArticles
                      .filter((a) => a.id !== article.id)
                      .slice(0, 3)
                      .map((trend, index) => (
                        <div
                          key={trend.id}
                          onClick={() => router.push(`/article/${trend.slug}`)}
                          className="flex items-start gap-4 group cursor-pointer"
                        >
                          <span className={`font-serif text-3xl font-normal text-zinc-300 group-hover:${accentColorClass} transition duration-300 leading-none select-none`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                              {trend.category}
                            </span>
                            <h5 className={`text-xs sm:text-sm font-bold text-zinc-900 leading-snug font-serif group-hover:${accentColorClass} transition duration-300`}>
                              {trend.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Newsletter Box */}
                {(!isSubscribed || isFadingOut) && (
                  <div
                    style={{
                      transition: 'all 1200ms cubic-bezier(0.25, 1, 0.5, 1)',
                      opacity: isFadingOut ? 0 : 1,
                      transform: isFadingOut ? 'translateY(-35px) scale(0.97)' : 'translateY(0) scale(1)',
                      maxHeight: isFadingOut ? '0px' : '450px',
                      paddingTop: isFadingOut ? '0px' : undefined,
                      paddingBottom: isFadingOut ? '0px' : undefined,
                      marginTop: isFadingOut ? '0px' : undefined,
                      marginBottom: isFadingOut ? '0px' : undefined,
                      overflow: 'hidden',
                      filter: isFadingOut ? 'blur(4px)' : 'none',
                    }}
                    className={`p-6 rounded-sm space-y-4 shadow-xs text-left max-w-xl mx-auto w-full ${designStyle === "minimal-focus" ? "bg-stone-50 border-2 border-double border-zinc-800 text-zinc-900" : "bg-zinc-900 text-white"}`}
                  >
                    <div className="space-y-1">
                      <h4 className={`text-[9px] font-bold uppercase tracking-widest ${designStyle === "minimal-focus" ? "text-zinc-500" : "text-zinc-400"}`}>The Dispatch</h4>
                      <p className="text-base font-serif font-bold leading-tight">Stay informed with weekly analysis</p>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${designStyle === "minimal-focus" ? "text-zinc-605" : "text-zinc-400"}`}>
                      Join our newsletter list to receive investigative reports directly in your inbox.
                    </p>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newsletterEmail.trim() || newsletterLoading) return;
                        setNewsletterLoading(true); setNewsletterMsg(""); setNewsletterErr("");
                        const [res] = await Promise.all([
                          fetch("/api/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletterEmail.trim() }) }),
                          new Promise((r) => setTimeout(r, 2000)),
                        ]);
                        const data = await (res as Response).json();
                        setNewsletterLoading(false);
                        if ((res as Response).ok || data.success) {
                          const emailVal = newsletterEmail.trim();
                          setNewsletterMsg(data.message || "Subscribed successfully!");
                          setNewsletterEmail("");
                          setTimeout(() => {
                            setIsFadingOut(true);
                          }, 2500);
                          setTimeout(() => {
                            setNewsletterMsg("");
                            setSubscribed(true, emailVal);
                            setIsFadingOut(false);
                          }, 3700);
                        } else {
                          setNewsletterErr(data.error || "Failed to subscribe.");
                          setTimeout(() => setNewsletterErr(""), 5000);
                        }
                      }}
                      className="space-y-2.5"
                    >
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        disabled={newsletterLoading}
                        className={`text-xs rounded p-2.5 w-full disabled:opacity-60 ${designStyle === "minimal-focus" ? "bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-650 focus:outline-none" : "bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"}`}
                        required
                      />
                      <button
                        type="submit"
                        disabled={newsletterLoading}
                        className={`w-full text-xs font-bold py-2 rounded transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${designStyle === "minimal-focus" ? "bg-zinc-900 hover:bg-zinc-800 text-white" : "bg-white hover:bg-zinc-105 text-black"}`}
                      >
                        {newsletterLoading ? (<>{/* <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" /> */}<span>Saving...</span></>) : "Subscribe"}
                      </button>
                      {newsletterMsg && <p className="text-xs font-semibold text-emerald-400">✓ {newsletterMsg}</p>}
                      {newsletterErr && <p className="text-xs font-semibold text-red-400">✕ {newsletterErr}</p>}
                    </form>
                  </div>
                )}
                {detailPageBelowSubscriptionAd && (
                  <div className="w-full mt-6 flex flex-col items-center select-none">
                    <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">Advertisement</span>
                    {(() => {
                      const { w, h } = parseAdSize(detailPageBelowSubscriptionAd.size, 728, 90);
                      return (
                        <div className="relative overflow-hidden border border-zinc-200 shadow-3xs max-w-full" style={{ width: `${w}px`, height: `${h}px` }}>
                          <img src={detailPageBelowSubscriptionAd.imageUrl} alt={detailPageBelowSubscriptionAd.name} className="w-full h-full object-cover" />
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          {(designStyle !== "full-width" && designStyle !== "minimal-focus") && (
            <div className={`
              lg:col-span-4 space-y-8 lg:sticky lg:top-8 lg:self-start h-fit border-t lg:border-t-0 lg:border-l border-zinc-200 pt-8 lg:pt-0 lg:pl-8
              ${designStyle === "left-sidebar" ? "lg:order-1" : ""}
            `}>
              {/* Trending Stories */}
              <div className="space-y-6">
                <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider border-b-2 border-zinc-900 pb-2">
                  {detailLayout.trendingStoriesTitle?.trim() || "Trending Stories"}
                </h4>
                <div className="space-y-5">
                  {trendingArticles
                    .filter((a) => a.id !== article.id)
                    .slice(0, 6)
                    .map((trend, index) => (
                      <div
                        key={trend.id}
                        onClick={() => router.push(`/article/${trend.slug}`)}
                        className="flex items-start gap-4 group cursor-pointer"
                      >
                        <span className={`font-serif text-3xl font-normal text-zinc-300 group-hover:${accentColorClass} transition duration-300 leading-none select-none`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                            {trend.category}
                          </span>
                          <h5 className={`text-xs sm:text-sm font-bold text-zinc-900 leading-snug font-serif group-hover:${accentColorClass} transition duration-300`}>
                            {trend.title}
                          </h5>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Newsletter Dispatch box */}
              {(!isSubscribed || isFadingOut) && (
                <div
                  style={{
                    transition: 'all 1200ms cubic-bezier(0.25, 1, 0.5, 1)',
                    opacity: isFadingOut ? 0 : 1,
                    transform: isFadingOut ? 'translateY(-35px) scale(0.97)' : 'translateY(0) scale(1)',
                    maxHeight: isFadingOut ? '0px' : '450px',
                    paddingTop: isFadingOut ? '0px' : undefined,
                    paddingBottom: isFadingOut ? '0px' : undefined,
                    marginTop: isFadingOut ? '0px' : undefined,
                    marginBottom: isFadingOut ? '0px' : undefined,
                    overflow: 'hidden',
                    filter: isFadingOut ? 'blur(4px)' : 'none',
                  }}
                  className="bg-zinc-900 text-white p-6 rounded-sm space-y-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">The Dispatch</h4>
                    <p className="text-base font-serif font-bold leading-tight">Stay informed with weekly analysis</p>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Join our newsletter list to receive investigative reports directly in your inbox.
                  </p>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newsletterEmail2.trim() || newsletterLoading2) return;
                      setNewsletterLoading2(true); setNewsletterMsg2(""); setNewsletterErr2("");
                      const [res] = await Promise.all([
                        fetch("/api/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletterEmail2.trim() }) }),
                        new Promise((r) => setTimeout(r, 2000)),
                      ]);
                      const data = await (res as Response).json();
                      setNewsletterLoading2(false);
                      if ((res as Response).ok || data.success) {
                        const emailVal = newsletterEmail2.trim();
                        setNewsletterMsg2(data.message || "Subscribed successfully!");
                        setNewsletterEmail2("");
                        setTimeout(() => {
                          setIsFadingOut(true);
                        }, 2500);
                        setTimeout(() => {
                          setNewsletterMsg2("");
                          setSubscribed(true, emailVal);
                          setIsFadingOut(false);
                        }, 3700);
                      } else {
                        setNewsletterErr2(data.error || "Failed to subscribe.");
                        setTimeout(() => setNewsletterErr2(""), 5000);
                      }
                    }}
                    className="space-y-2.5"
                  >
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={newsletterEmail2}
                      onChange={(e) => setNewsletterEmail2(e.target.value)}
                      disabled={newsletterLoading2}
                      className="bg-zinc-800 border border-zinc-700 text-xs rounded p-2.5 w-full text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none disabled:opacity-60"
                      required
                    />
                    <button
                      type="submit"
                      disabled={newsletterLoading2}
                      className="w-full bg-white text-black text-xs font-bold py-2 rounded hover:bg-zinc-100 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {newsletterLoading2 ? (<>{/* <span className="w-3 h-3 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" /> */}<span>Saving...</span></>) : "Subscribe"}
                    </button>
                    {newsletterMsg2 && <p className="text-xs font-semibold text-emerald-400">✓ {newsletterMsg2}</p>}
                    {newsletterErr2 && <p className="text-xs font-semibold text-red-400">✕ {newsletterErr2}</p>}
                  </form>
                </div>
              )}

              {/* Detail Page Below Subscription Ad */}
              {detailPageBelowSubscriptionAd && (
                <div className="w-full flex flex-col items-center border-t border-zinc-150 pt-6">
                  <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">Advertisement</span>
                  {(() => {
                    const { w, h } = parseAdSize(detailPageBelowSubscriptionAd.size, 300, 250);
                    return (
                      <div className="relative overflow-hidden border border-zinc-200 shadow-3xs max-w-full" style={{ width: `${w}px`, height: `${h}px` }}>
                        <img src={detailPageBelowSubscriptionAd.imageUrl} alt={detailPageBelowSubscriptionAd.name} className="w-full h-full object-cover" />
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

      </div>
    </main>

      {footerBannerAds.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 select-none border-t border-zinc-150 pt-6">
          <div className="relative bg-zinc-50/50 p-3 rounded border border-zinc-200 flex flex-col items-center justify-center animate-[admin-fade-in_0.3s_ease-out]">
            <button
              onClick={() => {
                const adToClose = footerBannerAds[0];
                if (adToClose) {
                  const nextClosed = [...closedAdIds, adToClose._id];
                  setClosedAdIds(nextClosed);
                  try {
                    localStorage.setItem("domain_closed_ads", JSON.stringify(nextClosed));
                  } catch (e) {}
                  window.dispatchEvent(new Event("domain_ad_dismissed"));
                }
              }}
              className="absolute top-2 right-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer transition z-10"
              title="Close Ad"
            >
              ✕
            </button>
            <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">Advertisement</span>
            
            {/* Mobile Footer Banner */}
            {(() => {
              const mobileAd = footerBannerAds.find(a => a.size.includes("320")) || footerBannerAds[0];
              if (!mobileAd) return null;
              const { w, h } = parseAdSize(mobileAd.size, 320, 50);
              return (
                <div 
                  className="md:hidden relative overflow-hidden border border-zinc-200 shadow-3xs bg-white" 
                  style={{ width: `${w}px`, height: `${h}px` }}
                >
                  <img src={mobileAd.imageUrl} alt={mobileAd.name} className="w-full h-full object-cover" />
                </div>
              );
            })()}

            {/* Desktop/Tablet Footer Banner */}
            {(() => {
              const desktopAd = footerBannerAds.find(a => a.size.includes("728")) || footerBannerAds.find(a => a.size.includes("300")) || footerBannerAds[0];
              if (!desktopAd) return null;
              const { w, h } = parseAdSize(desktopAd.size, 728, 90);
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
        </div>
      )}

      {/* Editorial Footer */}
      <Footer />

      {/* Dynamic Slide-out Author Profile Panel */}
      {showAuthorPanel && authorDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs select-none">
          <div className="absolute inset-0 -z-10" onClick={() => setShowAuthorPanel(false)} />
          
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in overflow-y-auto">
            {/* Header (Pinned Action Bar) */}
            <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 py-4 px-6 flex items-center justify-between">
              <h3 className="font-editorial-title font-black text-base tracking-tight uppercase">
                Journalist Profile
              </h3>
              <button
                onClick={() => setShowAuthorPanel(false)}
                className="text-zinc-400 hover:text-black font-semibold text-xs transition cursor-pointer flex items-center gap-1"
              >
                <span>Close</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Content */}
            <div className="flex-grow p-6 sm:p-8 space-y-6">
              
              {/* Profile Card Top */}
              <div className="flex flex-col items-center text-center space-y-3">
                {authorDetails.profileImage ? (
                  <img
                    src={authorDetails.profileImage}
                    alt={authorDetails.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-zinc-300 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-550 border-2 border-zinc-300 shadow-md text-3xl">
                    {authorDetails.name.charAt(0)}
                  </div>
                )}
                
                <div>
                  <h2 className="font-editorial-title text-2xl font-black text-zinc-900 leading-snug">
                    {authorDetails.name}
                  </h2>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest mt-1">
                    {authorDetails.role} • {authorDetails.category} Beat
                  </p>
                </div>
              </div>

              {/* Biography Section */}
              <div className="space-y-2 border-t border-zinc-150 pt-4">
                <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
                  Biography
                </h4>
                <p className="text-xs text-zinc-650 leading-relaxed font-sans">
                  {authorDetails.bio}
                </p>
              </div>

              {/* Contact/Email details */}
              <div className="space-y-1 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 p-3 rounded-xs font-mono">
                <div>
                  <span className="font-bold text-zinc-700">Email Contact:</span>{" "}
                  <a href={`mailto:${authorDetails.email}`} className="text-blue-700 hover:underline">
                    {authorDetails.email}
                  </a>
                </div>
                <div>
                  <span className="font-bold text-zinc-700">Gender:</span>{" "}
                  <span className="capitalize">{authorDetails.gender}</span>
                </div>
              </div>

              {/* Social Channels list */}
              {authorDetails.socialLinks && Object.values(authorDetails.socialLinks).some(Boolean) && (
                <div className="space-y-2 border-t border-zinc-150 pt-4">
                  <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
                    Social Networks
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {authorDetails.socialLinks.twitter && (
                      <a
                        href={authorDetails.socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-zinc-900 text-white text-[10px] px-2.5 py-1.5 rounded-sm hover:bg-zinc-800 transition font-mono"
                      >
                        Twitter/X
                      </a>
                    )}
                    {authorDetails.socialLinks.quora && (
                      <a
                        href={authorDetails.socialLinks.quora}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-800 text-white text-[10px] px-2.5 py-1.5 rounded-sm hover:bg-red-750 transition font-mono"
                      >
                        Quora
                      </a>
                    )}
                    {authorDetails.socialLinks.medium && (
                      <a
                        href={authorDetails.socialLinks.medium}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-zinc-800 text-white text-[10px] px-2.5 py-1.5 rounded-sm hover:bg-zinc-700 transition font-mono"
                      >
                        Medium
                      </a>
                    )}
                    {authorDetails.socialLinks.substack && (
                      <a
                        href={authorDetails.socialLinks.substack}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-amber-700 text-white text-[10px] px-2.5 py-1.5 rounded-sm hover:bg-amber-600 transition font-mono"
                      >
                        Substack
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Other stories published list */}
              <div className="space-y-3 border-t border-zinc-150 pt-4">
                <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
                  Published Coverage ({authorArticles.length})
                </h4>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                  {authorArticles.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">No other articles available.</p>
                  ) : (
                    authorArticles.map((art) => (
                      <div
                        key={art._id}
                        onClick={() => {
                          setShowAuthorPanel(false);
                          router.push(`/article/${art.slug}`);
                        }}
                        className="p-3 bg-zinc-50 border border-zinc-205/60 hover:border-zinc-400 rounded-sm cursor-pointer transition flex justify-between gap-3 items-center group"
                      >
                        <div>
                          <span className="text-[8px] font-extrabold text-red-700 uppercase tracking-wider">
                            {art.category}
                          </span>
                          <h5 className="text-xs font-bold text-zinc-850 group-hover:text-red-700 leading-snug mt-0.5">
                            {art.title}
                          </h5>
                        </div>
                        <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 transition shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-zinc-50 border-t border-zinc-200 py-3 px-6 text-center text-[9px] text-zinc-400 font-mono">
              © {new Date().getFullYear()} The Domain Name. Staff Bio Database.
            </div>
          </div>
        </div>
      )}
      {stickyBottomAd && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end pointer-events-none pb-2 select-none">
          <div className="relative bg-zinc-100/95 border border-zinc-300 p-1.5 shadow-lg rounded-none flex flex-col items-center pointer-events-auto">
            <button 
              onClick={() => {
                const nextClosed = [...closedAdIds, stickyBottomAd._id];
                setClosedAdIds(nextClosed);
                try {
                  localStorage.setItem("domain_closed_ads", JSON.stringify(nextClosed));
                } catch (e) {}
                window.dispatchEvent(new Event("domain_ad_dismissed"));
              }} 
              className="absolute -top-2 -right-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-bold border border-zinc-200 cursor-pointer shadow-md transition"
              title="Close Ad"
            >
              ✕
            </button>
            <span className="text-[8px] text-zinc-400 font-mono tracking-widest uppercase mb-0.5 leading-none">Advertisement</span>
            {(() => {
              const { w, h } = parseAdSize(stickyBottomAd.size, 320, 50);
              return (
                <div className="relative overflow-hidden border border-zinc-200 bg-white" style={{ width: `${w}px`, height: `${h}px` }}>
                  <img src={stickyBottomAd.imageUrl} alt={stickyBottomAd.name} className="w-full h-full object-cover" />
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
