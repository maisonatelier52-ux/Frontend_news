"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Article, NEWS_ARTICLES } from "@/app/data/news";
import Header from "@/app/components/Header";

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

  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [nameInput, setNameInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  
  // Author Dynamic Profile State
  const [authorDetails, setAuthorDetails] = useState<any>(null);
  const [showAuthorPanel, setShowAuthorPanel] = useState(false);
  const [authorArticles, setAuthorArticles] = useState<any[]>([]);

  // Load bookmarks and comments on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("domain_bookmarks") || localStorage.getItem("domain _bookmarks");
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }

      const savedComments = localStorage.getItem("domain_comments") || localStorage.getItem("domain _comments");
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      } else {
        const initialComments: Record<string, Comment[]> = {
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
        setComments(initialComments);
      }
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

  // Load trending articles for sidebar
  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch("/api/news?activeOnly=true");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.slice(0, 5).map((art: any) => ({
            id: art._id,
            slug: art.slug,
            title: art.title,
            category: art.category,
          }));
          setTrendingArticles(mapped);
        } else {
          setTrendingArticles(NEWS_ARTICLES.slice(0, 5));
        }
      } catch {
        setTrendingArticles(NEWS_ARTICLES.slice(0, 5));
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

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !commentInput.trim()) return;

    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const newComment = { name: nameInput.trim(), date: dateStr, text: commentInput.trim() };
    const updated = {
      ...comments,
      [article.id]: [newComment, ...(comments[article.id] || [])],
    };
    setComments(updated);
    setNameInput("");
    setCommentInput("");
    try {
      localStorage.setItem("domain_comments", JSON.stringify(updated));
      localStorage.setItem("domain _comments", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save comments to localStorage", e);
    }
  };

  const articleComments = comments[article.id] || [];

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
          <div key={block.id || index} className="my-8 bg-zinc-50 border border-zinc-200 rounded-sm p-6 max-w-xl mx-auto space-y-4 shadow-3xs">
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
                  <span className="text-zinc-600 text-right leading-relaxed font-sans">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div key={block.id || index} className="my-8 bg-white border border-zinc-250 rounded-sm p-6 space-y-5 shadow-3xs">
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
                  <p className="text-xs text-zinc-600 leading-relaxed pl-5 font-sans bg-zinc-50 p-3 border-l-2 border-zinc-900 rounded-r-xs">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12">
          
          {/* Main Reading Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Category tag */}
            <div className="flex items-center select-none">
              <span className="text-[10px] text-red-750 font-extrabold uppercase tracking-widest border border-zinc-200 px-3 py-1 rounded-[4px] bg-zinc-50">
                {article.category}
              </span>
            </div>

            {/* Headline style */}
            <div className="pt-0.5">
              <h1 className="font-editorial-title text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 leading-tight tracking-tight">
                {article.title}
              </h1>
            </div>

            {/* Excerpt / Subtitle */}
            <p className="text-zinc-550 text-base sm:text-lg leading-relaxed italic font-serif border-l-2 border-zinc-300 pl-4 py-1">
              {article.excerpt}
            </p>

            {/* Print style Info Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center border-y border-zinc-200 py-3.5 text-xs text-zinc-500 select-none">
              <div className="font-medium">
                By{" "}
                <button
                  onClick={() => setShowAuthorPanel(true)}
                  className="font-bold text-zinc-800 hover:text-red-700 underline underline-offset-2 transition cursor-pointer"
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

            {/* Dynamic Article Blocks Rendering */}
            <article className="mt-8 font-editorial-body space-y-6 pb-2">
              {article.blocks?.map((block: any, idx: number) => renderBlock(block, idx))}
            </article>

            {/* Share options */}
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
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:text-green-600 hover:border-green-600 hover:bg-green-50/30 transition shadow-3xs"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.905-6.99C16.558 1.876 14.077.843 11.44.842c-5.44 0-9.865 4.42-9.869 9.864-.001 1.748.47 3.447 1.365 4.972L1.87 22.13l6.777-1.776zm13.435-5.265c-.29-.145-1.713-.847-1.978-.942-.266-.097-.459-.145-.653.145-.193.29-.748.942-.917 1.137-.17.194-.339.218-.629.073-.29-.145-1.223-.45-2.33-1.439-.86-.767-1.44-1.714-1.61-2.004-.17-.29-.018-.446.127-.59.13-.13.29-.339.435-.508.145-.17.193-.29.29-.483.097-.193.048-.363-.024-.508-.073-.145-.653-1.573-.895-2.153-.235-.568-.475-.49-.653-.49-.17 0-.363-.012-.556-.012-.193 0-.507.073-.772.363-.266.29-1.014.99-1.014 2.415 0 1.425 1.038 2.8 1.183 2.993.145.193 2.043 3.118 4.949 4.372.69.298 1.23.477 1.65.612.693.22 1.325.19 1.822.115.556-.085 1.713-.699 1.954-1.378.24-.678.24-1.258.17-1.378-.073-.12-.266-.193-.556-.339z"/>
                    </svg>
                  </a>
                  
                  {/* Reddit */}
                  <a
                    href={`https://reddit.com/submit?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:text-orange-600 hover:border-orange-600 hover:bg-orange-50/30 transition shadow-3xs"
                    title="Share on Reddit"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.24-1.72l1.37-4.3 3.82.84c.06 1.17 1.03 2.1 2.22 2.1 1.24 0 2.25-1.01 2.25-2.25S19.99 2 18.75 2c-.93 0-1.73.57-2.07 1.38l-4.14-.9c-.27-.06-.54.1-.62.36L10.3 7.8C7.81 7.84 5.49 8.5 3.8 9.5c-.56-.76-1.46-1.24-2.42-1.24-1.65 0-3 1.35-3 3 0 1.21.73 2.24 1.77 2.69-.05.26-.07.52-.07.78 0 4.14 4.8 7.5 10.74 7.5s10.74-3.36 10.74-7.5c0-.26-.02-.52-.07-.78 1.04-.45 1.77-1.48 1.77-2.69zM9 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm9.5-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3.5 3.5c-1.37 1.37-4.13 1.37-5.5 0-.19-.19-.19-.51 0-.7.19-.19.51-.19.7 0 .97.97 3.12.97 4.1 0 .19-.19.51-.19.7 0 .19.19.19.51 0 .7z"/>
                    </svg>
                  </a>

                  {/* Substack */}
                  <a
                    href={`https://substack.com/signup?referrer=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:text-orange-700 hover:border-orange-700 hover:bg-orange-50/20 transition shadow-3xs"
                    title="Share on Substack"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                    </svg>
                  </a>

                  {/* Medium */}
                  <a
                    href={`https://medium.com/sharing?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-950 hover:bg-zinc-50 transition shadow-3xs"
                    title="Share on Medium"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zm3.04 0c0 3.2-1.12 5.8-2.5 5.8s-2.5-2.6-2.5-5.8 1.12-5.8 2.5-5.8 2.5 2.6 2.5 5.8z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:text-pink-600 hover:border-pink-600 hover:bg-pink-50/30 transition shadow-3xs cursor-pointer"
                    title="Share on Instagram (Copies Link)"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                    </svg>
                  </button>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/30 transition shadow-3xs"
                    title="Share on Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:text-black hover:border-black hover:bg-zinc-50 transition shadow-3xs"
                    title="Share on X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  {/* Copy Link Button */}
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50 transition shadow-3xs cursor-pointer relative"
                    title="Copy Article Link"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M8 9a3 3 0 00-3 3v4a3 3 0 003 3h3a3 3 0 003-3v-4a3 3 0 00-3-3H8z" />
                      <path d="M16 15a3 3 0 003-3V8a3 3 0 00-3-3h-3a3 3 0 00-3 3v4a3 3 0 003 3h3z" />
                    </svg>
                    {showShareNotification && (
                      <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded whitespace-nowrap shadow-md z-20">
                        Link copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Super Designed Author Bio Section */}
            <div className="my-12 p-6 sm:p-8 bg-zinc-50 border border-zinc-200 rounded-lg shadow-3xs flex flex-col sm:flex-row items-center sm:items-start gap-6 select-none relative overflow-hidden">
              {/* Decorative top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-750" />
              
              {/* Left side: Avatar */}
              <div className="relative shrink-0 group">
                {authorDetails?.profileImage ? (
                  <img
                    src={authorDetails.profileImage}
                    alt={article.author}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md cursor-pointer group-hover:scale-105 transition duration-300"
                    onClick={() => setShowAuthorPanel(true)}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 text-red-750 flex items-center justify-center font-bold border-2 border-white shadow-md cursor-pointer group-hover:scale-105 transition text-2xl"
                    onClick={() => setShowAuthorPanel(true)}
                  >
                    {article.author.charAt(0)}
                  </div>
                )}
              </div>

              {/* Right side: Author Info */}
              <div className="space-y-4 flex-grow text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-750 block">
                      Journalist Profile
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-black text-zinc-900 tracking-tight">
                      {article.author}
                    </h4>
                  </div>
                  
                  {/* Badge role */}
                  <span className="self-center sm:self-start inline-block text-[10px] px-3 py-1 bg-zinc-900 text-white font-extrabold uppercase tracking-widest rounded-sm shadow-3xs">
                    {authorDetails?.role || "Staff Reporter"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans italic">
                  “{authorDetails?.bio ||
                    "A veteran journalist dedicated to in-depth research, reporting on critical affairs, and providing objective coverage of domestic and international issues."}”
                </p>

                {/* Bottom row: links */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 border-t border-zinc-200/60 text-xs text-zinc-550 font-medium">
                  {authorDetails?.email && (
                    <a href={`mailto:${authorDetails.email}`} className="hover:text-red-750 transition duration-200 flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-sm shadow-3xs hover:shadow-2xs">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{authorDetails.email}</span>
                    </a>
                  )}
                  {authorDetails?.websiteUrl && (
                    <a href={authorDetails.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-750 transition duration-200 flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-sm shadow-3xs hover:shadow-2xs">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span>Website</span>
                    </a>
                  )}
                  {authorDetails?.socialLinks?.twitter && (
                    <a href={authorDetails.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-red-750 transition duration-200 flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-sm shadow-3xs hover:shadow-2xs">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span>Twitter</span>
                    </a>
                  )}
                  <span className="text-zinc-300 hidden sm:inline select-none">•</span>
                  <button
                    onClick={() => setShowAuthorPanel(true)}
                    className="text-red-750 hover:underline font-bold transition duration-200 cursor-pointer"
                  >
                    View Full Profile & Contact
                  </button>
                </div>
              </div>
            </div>

            {/* Comments and Discussion Area */}
            <section className="space-y-6 pt-4">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2">
                Discussion ({articleComments.length})
              </h3>

              {/* List of comments */}
              <div className="space-y-4">
                {articleComments.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic font-mono">No comments have been posted yet. Be the first to join the conversation.</p>
                ) : (
                  articleComments.map((comment, index) => (
                    <div key={index} className="bg-zinc-50/50 border border-zinc-200 p-4 rounded-xs transition hover:shadow-2xs">
                      <div className="flex justify-between items-center text-[10.5px] text-zinc-500 mb-1.5 font-mono">
                        <span className="font-bold text-zinc-800">{comment.name}</span>
                        <span>{comment.date}</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed font-sans">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Comment Form */}
              <form onSubmit={handleSubmitComment} className="border border-zinc-200 p-5 bg-zinc-50/40 rounded-xs space-y-4">
                <h4 className="text-xs font-bold text-zinc-850 uppercase tracking-widest">Share your perspective</h4>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name / Signature"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-white border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-zinc-800 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                    required
                  />
                  <textarea
                    placeholder="Add your comments here..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="bg-white border border-zinc-200 rounded px-3.5 py-3 text-xs text-zinc-800 w-full h-24 resize-none focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-zinc-900 text-white text-xs font-bold py-2.5 px-5 rounded cursor-pointer hover:bg-zinc-800 transition btn-3d-indigo self-start"
                  >
                    Submit Comment
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8 lg:self-start h-fit border-t lg:border-t-0 lg:border-l border-zinc-200 pt-8 lg:pt-0 lg:pl-8">
            
            {/* Trending Stories */}
            <div className="space-y-6">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider border-b-2 border-zinc-900 pb-2">
                Trending Stories
              </h4>
              <div className="space-y-5">
                {trendingArticles
                  .filter((a) => a.id !== article.id)
                  .slice(0, 4)
                  .map((trend, index) => (
                    <div
                      key={trend.id}
                      onClick={() => router.push(`/article/${trend.slug}`)}
                      className="flex items-start gap-4 group cursor-pointer"
                    >
                      <span className="font-serif text-3xl font-normal text-zinc-300 group-hover:text-red-750 transition duration-300 leading-none select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                          {trend.category}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug font-serif group-hover:text-red-750 transition duration-300">
                          {trend.title}
                        </h5>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Newsletter Dispatch box */}
            <div className="bg-zinc-900 text-white p-6 rounded-sm space-y-4 shadow-xs">
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">The Dispatch</h4>
                <p className="text-base font-serif font-bold leading-tight">Stay informed with weekly analysis</p>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Join our newsletter list to receive investigative reports directly in your inbox.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-2.5">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="bg-zinc-800 border border-zinc-700 text-xs rounded p-2.5 w-full text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-white text-black text-xs font-bold py-2 rounded hover:bg-zinc-100 transition cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>

        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="bg-white border-t border-zinc-300 py-10 px-4 sm:px-6 select-none mt-16">
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
            <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-650 font-medium">
              <li>
                <button onClick={() => { router.push("/US"); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  U.S. News & Politics
                </button>
              </li>
              <li>
                <button onClick={() => { router.push("/Finance"); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Finance & Markets
                </button>
              </li>
              <li>
                <button onClick={() => { router.push("/Technology"); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Technology & Science
                </button>
              </li>
              <li>
                <button onClick={() => { router.push("/World"); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  World Affairs
                </button>
              </li>
              <li>
                <button onClick={() => { router.push("/Marketing"); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Marketing & Strategy
                </button>
              </li>
              <li>
                <button onClick={() => { router.push("/Entertainment"); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Arts & Entertainment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Other Sections */}
          <div>
            <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-3.5">
              Other Sections
            </h5>
            <ul className="space-y-2 text-xs text-zinc-650 font-medium">
              <li>
                <button onClick={() => { router.push("/PR News"); window.scrollTo(0, 0); }} className="hover:text-zinc-950 transition cursor-pointer text-left">
                  Press Releases & News
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Operational contact placeholder */}

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
    </div>
  );
}
