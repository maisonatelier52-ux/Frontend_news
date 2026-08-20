"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { getArticleUrl } from "@/lib/site-url";

/* ─────────────────────────────────────────────
   ARTICLE CONSTANTS & BLOCKS
   ───────────────────────────────────────────── */
export const LORD_STANLEY_FINK_IMAGE_URL = "https://res.cloudinary.com/dcj2ovntc/image/upload/v1787207239/magazinegazette/lord-stanley-fink-takes-chair-seat-at-britannia.jpg";
export const LORD_STANLEY_FINK_LOCAL_IMAGE = "/images/lord-stanley-fink-britannia.jpg";

export const LORD_STANLEY_FINK_BLOCKS: any[] = [
  // Featured Photo
  {
    id: "b-main-image",
    type: "image",
    value: {
      url: LORD_STANLEY_FINK_IMAGE_URL,
      fallbackUrl: LORD_STANLEY_FINK_LOCAL_IMAGE,
      caption: "Lord Stanley Fink, Chairman of Britannia Global Markets"
    }
  },

  // Paragraph 1
  {
    id: "b-p1",
    type: "paragraph",
    value: "Britannia Global Markets has appointed Lord Stanley Fink as Chairman, adding one of the City of London’s most experienced financial-services figures to the board of the multi-asset brokerage."
  },

  // Paragraph 2 (with Companies House filing and Finance Magnates links)
  {
    id: "b-p2",
    type: "paragraph-custom-links",
    parts: [
      { text: "The appointment places a veteran of institutional finance alongside Britannia’s existing executive leadership at a time when the company is strengthening its position across derivatives broking, institutional services and prime brokerage. A " },
      {
        text: "Companies House filing",
        url: "https://find-and-update.company-information.service.gov.uk/officers/C2WG2nEoMtJzDp2TNAliEMbJ49Y/appointments",
        isExternal: true
      },
      { text: " records Lord Fink’s appointment as a director of Britannia Global Markets Limited on 13 August 2026. The chairmanship was subsequently reported by " },
      {
        text: "Finance Magnates",
        url: "https://www.financemagnates.com/executives/lord-stanley-fink-takes-chair-seat-at-britannia/",
        isExternal: true
      },
      { text: " and other financial-industry publications." }
    ]
  },

  // Paragraph 3
  {
    id: "b-p3",
    type: "paragraph",
    value: "Lord Fink is best known for his tenure as chief executive of Man Group from 2000 to 2007. During those years, the business became one of the world’s largest listed hedge-fund companies and a prominent FTSE 100 constituent. His later career included senior leadership at International Standard Asset Management, where he served as chief executive and subsequently chairman, as well as board-level experience involving Marex and eToro."
  },

  // Paragraph 4
  {
    id: "b-p4",
    type: "paragraph",
    value: "That record gives the appointment significance beyond a conventional board change. Britannia is gaining a chairman with experience of guiding a financial business through expansion, public-market visibility and changing conditions across global capital markets."
  },

  // Paragraph 5
  {
    id: "b-p5",
    type: "paragraph",
    value: "Steve Pettitt, Chief Executive Officer of Britannia Global Markets, described the appointment as part of the company’s effort to attract leadership capable of supporting its continued growth. Lord Fink, in turn, said he had been impressed by the firm’s development, the professionalism of its team and the reputation it was building in brokerage services."
  },

  // Subheading: A London firm with global reach
  {
    id: "b-sub-global-reach",
    type: "subheading",
    value: "A London firm with global reach"
  },

  // Paragraph 6 (with Britannia Global Markets link)
  {
    id: "b-p6",
    type: "paragraph-custom-links",
    parts: [
      {
        text: "Britannia Global Markets",
        url: "https://www.britannia.com/britannia-global-markets/",
        isExternal: true
      },
      { text: " describes itself as a multi-asset brokerage with global coverage and a presence in London spanning almost four decades. The firm provides access to major derivatives markets, with specialist capabilities across foreign exchange, commodities, base metals and financial derivatives." }
    ]
  },

  // Paragraph 7
  {
    id: "b-p7",
    type: "paragraph",
    value: "The company is authorised and regulated by the Financial Conduct Authority. Britannia also states that it is a member of the London Stock Exchange and FIA Europe, while its base-metals offering includes London Metal Exchange membership. Its international client base includes institutions, corporates, funds, physical hedgers, trading houses and high-net-worth clients."
  },

  // Paragraph 8
  {
    id: "b-p8",
    type: "paragraph",
    value: "Britannia’s development in recent years has included a broader prime-brokerage proposition and strategic investment in experienced personnel. Against that background, the appointment of Lord Fink provides a visible point of continuity between the firm’s established London heritage and its next stage of institutional growth."
  },

  // Subheading: Experience suited to a growth chapter
  {
    id: "b-sub-growth-chapter",
    type: "subheading",
    value: "Experience suited to a growth chapter"
  },

  // Paragraph 9
  {
    id: "b-p9",
    type: "paragraph",
    value: "A chair’s role is distinct from day-to-day executive management. At its most effective, it strengthens governance, challenges strategy constructively and helps ensure that ambition is supported by sound oversight. Lord Fink’s career makes him particularly familiar with those responsibilities in complex financial organisations."
  },

  // Paragraph 10
  {
    id: "b-p10",
    type: "paragraph",
    value: "His arrival also sends an encouraging message about Britannia’s ability to attract senior figures with deep experience in the City. In institutional finance, where reputation is built over years and decisions are measured against demanding standards, the quality of leadership matters."
  },

  // Paragraph 11
  {
    id: "b-p11",
    type: "paragraph",
    value: "For Britannia Global Markets, the appointment is therefore both a recognition of progress already made and a statement of intent. The company has added an internationally recognised financier to its board as it seeks to deepen client relationships, expand its institutional capabilities and build for the long term."
  },

  // Topics Section
  {
    id: "b-topics",
    type: "topics",
    title: "Topics",
    tags: [
      "Britannia Financial Group",
      "Lord Stanley Fink",
      "Julio Martín Herrera Velutini"
    ]
  }
];

export const LORD_STANLEY_FINK_ARTICLE_DATA = {
  id: "6a869e4960319e5ae33d238a",
  slug: "lord-stanley-fink-chairman-britannia-global-markets",
  title: "Lord Stanley Fink Appointed Chairman of Britannia Global Markets",
  subtitle: "The former Man Group chief executive and veteran City financier joins the London-based multi-asset brokerage as it advances its institutional and prime-brokerage ambitions.",
  category: "Business",
  subCategory: "Executive Appointments",
  author: "Editorial Desk",
  authorTitle: "Financial Markets Desk",
  date: "August 20, 2026",
  formattedDate: "August 20, 2026",
  readTime: "4 min read",
  image: LORD_STANLEY_FINK_IMAGE_URL,
  featuredImage: LORD_STANLEY_FINK_IMAGE_URL,
  imageAltText: "Lord Stanley Fink, Chairman of Britannia Global Markets",
  hideTopFeaturedImage: true,
  hideAuthorSection: false,
  excerpt: "The former Man Group chief executive and veteran City financier joins the London-based multi-asset brokerage as it advances its institutional and prime-brokerage ambitions.",
  blocks: LORD_STANLEY_FINK_BLOCKS,
  seoTitle: "Lord Stanley Fink Named Chairman of Britannia Global Markets",
  seoMetaDescription: "Lord Stanley Fink has been appointed Chairman of Britannia Global Markets, bringing decades of City leadership to the FCA regulated brokerage.",
  primaryKeyword: "Lord Stanley Fink Britannia Global Markets",
  secondaryKeywords: "Britannia chairman, Britannia Global Markets leadership, Stanley Fink Man Group",
  keywords: [
    "Britannia Financial Group",
    "Lord Stanley Fink",
    "Julio Martín Herrera Velutini",
    "Britannia Global Markets",
    "Executive Appointments"
  ],
  tags: "Britannia Financial Group, Lord Stanley Fink, Julio Martín Herrera Velutini",
};

/* ─────────────────────────────────────────────
   FONT SHORTHANDS
   ───────────────────────────────────────────── */
const pf: React.CSSProperties = { fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" };
const lr: React.CSSProperties = { fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, sans-serif" };

/* ─────────────────────────────────────────────
   SCROLL-REVEAL HOOK
   ───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const anim: React.CSSProperties = {
    opacity: v ? 1 : 0,
    transform: v ? "translateY(0)" : "translateY(12px)",
    transition: "opacity 0.6s ease, transform 0.6s ease",
  };
  return { ref, anim };
}

/* ─────────────────────────────────────────────
   RENDERER FOR ARTICLE BLOCKS
   ───────────────────────────────────────────── */
function Block({ block }: { block: any }) {
  const { ref, anim } = useReveal();

  /* MAIN ARTICLE PHOTO */
  if (block.type === "image") {
    const val = block.value || {};
    return (
      <div ref={ref} style={anim} className="my-5 w-full">
        <figure className="relative">
          <div className="relative w-full overflow-hidden bg-zinc-100 rounded-sm border border-zinc-200/80 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={val.url || LORD_STANLEY_FINK_IMAGE_URL}
              alt={val.caption || "Lord Stanley Fink, Chairman of Britannia Global Markets"}
              onError={(e: any) => {
                if (val.fallbackUrl && e.target.src !== val.fallbackUrl) {
                  e.target.src = val.fallbackUrl;
                }
              }}
              className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
          {val.caption && (
            <figcaption className="text-[11.5px] font-sans text-zinc-500 tracking-wide mt-2 text-left">
              {val.caption}
            </figcaption>
          )}
        </figure>
      </div>
    );
  }

  /* PARAGRAPH */
  if (block.type === "paragraph") {
    return (
      <div ref={ref} style={anim} className="my-3.5">
        <p className="text-[14.5px] sm:text-[15px] leading-[1.72] text-zinc-800 font-sans tracking-[0.005em]">
          {block.value}
        </p>
      </div>
    );
  }

  /* PARAGRAPH WITH EMBEDDED CUSTOM LINKS */
  if (block.type === "paragraph-custom-links") {
    return (
      <div ref={ref} style={anim} className="my-3.5">
        <p className="text-[14.5px] sm:text-[15px] leading-[1.72] text-zinc-800 font-sans tracking-[0.005em]">
          {block.parts?.map((part: any, idx: number) => {
            if (part.url) {
              return (
                <a
                  key={idx}
                  href={part.url}
                  target={part.isExternal ? "_blank" : undefined}
                  rel={part.isExternal ? "noopener noreferrer" : undefined}
                  className="text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
                >
                  {part.text}
                </a>
              );
            }
            return <span key={idx}>{part.text}</span>;
          })}
        </p>
      </div>
    );
  }

  /* SUBHEADING */
  if (block.type === "subheading" || block.type === "header") {
    return (
      <div ref={ref} style={anim} className="mt-7 mb-3">
        <div className="border-l-[2.5px] border-zinc-900 pl-3.5 py-0.5">
          <h2
            style={pf}
            className="text-[1.3rem] sm:text-[1.5rem] font-bold text-zinc-900 leading-[1.25] tracking-[-0.015em]"
          >
            {block.value}
          </h2>
        </div>
      </div>
    );
  }

  /* TOPICS FOOTER */
  if (block.type === "topics") {
    return (
      <div ref={ref} style={anim} className="mt-8 pt-4 border-t border-zinc-200 select-none">
        <h3 className="text-[14px] font-bold font-sans text-zinc-900 mb-3">
          {block.title || "Topics"}
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          {block.tags?.map((tag: string, idx: number) => (
            <div key={idx} className="flex items-center gap-1.5 text-[12.5px] font-sans text-zinc-700 cursor-default">
              <svg className="w-4 h-4 text-zinc-500 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="font-medium">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
interface Props {
  layout?: any;
  article?: any;
  trendingArticles?: any[];
  isPreview?: boolean;
}

export default function LordStanleyFinkArticle({
  article,
  trendingArticles = [],
  isPreview = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const base = {
    ...LORD_STANLEY_FINK_ARTICLE_DATA,
    ...(article || {}),
    title: LORD_STANLEY_FINK_ARTICLE_DATA.title,
    subtitle: LORD_STANLEY_FINK_ARTICLE_DATA.subtitle,
    excerpt: LORD_STANLEY_FINK_ARTICLE_DATA.excerpt,
    blocks: LORD_STANLEY_FINK_BLOCKS,
  };

  // Distinct sets for Trending sidebar (limit 6) and More News section (no overlapping articles)
  const trendingList = trendingArticles.slice(0, 6);
  const trendingIds = new Set(
    trendingList.map((a: any) => a.slug || a._id || a.id || a.title)
  );
  const distinctMoreNews = trendingArticles.filter(
    (a: any) => !trendingIds.has(a.slug || a._id || a.id || a.title)
  );
  const moreNewsList = distinctMoreNews.length > 0
    ? distinctMoreNews.slice(0, 4)
    : trendingArticles.slice(6, 10);

  // Load comments
  useEffect(() => {
    async function loadComments() {
      if (isPreview || !base?.id) return;
      try {
        const res = await fetch(`/api/comments?articleId=${base.id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (e) {
        console.error("Failed to load comments", e);
      }
    }
    loadComments();
  }, [base?.id, isPreview]);

  // Comment submission handler
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess("");

    if (!nameInput.trim() || !emailInput.trim() || !commentInput.trim()) {
      setCommentError("Please fill out all required fields.");
      return;
    }

    setIsSubmittingComment(true);

    try {
      if (isPreview) {
        const fakeComment = {
          name: nameInput.trim(),
          text: commentInput.trim(),
          createdAt: new Date().toISOString(),
        };
        setComments((prev) => [fakeComment, ...prev]);
        setCommentSuccess("Your comment has been submitted successfully!");
        setCommentInput("");
        setIsSubmittingComment(false);
        return;
      }

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: base.id,
          name: nameInput.trim(),
          email: emailInput.trim(),
          text: commentInput.trim(),
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentSuccess("Your comment has been published!");
        setCommentInput("");
      } else {
        const errData = await res.json();
        setCommentError(errData.message || "Failed to submit comment. Please try again.");
      }
    } catch (e) {
      setCommentError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const copy = useCallback(() => {
    const u = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(u).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const enc = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const te = encodeURIComponent(base.title);

  const authorName = "Editorial Desk";
  const authorTitle = "Financial Markets Desk";
  const authorBio = "Reporting on executive appointments, global brokerage markets, capital allocation, and regulatory developments.";

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      {/* ── Site Header ─────────────────────────────────────────────── */}
      <Header
        activeCategory={base.category}
        setActiveCategory={(c: string) => {
          window.location.href = c === "All" ? "/" : `/${encodeURIComponent(c.toLowerCase())}`;
        }}
        searchQuery=""
        setSearchQuery={(q: string) => {
          if (q) window.location.href = `/?search=${encodeURIComponent(q)}`;
        }}
        bookmarkCount={0}
        showBookmarksOnly={false}
        setShowBookmarksOnly={() => {}}
      />

      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* ══ UNIFIED GRID (Article Column + Vertical Divider + Sticky Trending Sidebar) ════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 xl:gap-x-14 pt-6 sm:pt-8 pb-16">
          {/* ── Main Article Column ─────────────────────────────────── */}
          <main className="lg:col-span-8 xl:col-span-7">
            {/* HERO HEADER */}
            <header className="max-w-[680px] pb-5 sm:pb-6">
              {/* Meta row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 text-[10.5px] font-sans font-semibold uppercase tracking-[0.16em] text-zinc-600 mb-4 select-none">
                <span>
                  {base.category || "Business"}&ensp;/&ensp;{base.subCategory || "Executive Appointments"}
                </span>
                <span>
                  {base.date || base.formattedDate || "August 20, 2026"}&ensp;·&ensp;{base.readTime || "4 min read"}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{ ...pf, animation: "art-hero-in 0.85s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}
                className="text-[1.85rem] sm:text-[2.35rem] md:text-[2.75rem] font-bold text-zinc-950 leading-[1.15] tracking-[-0.025em] mb-4"
              >
                {base.title}
              </h1>

              {/* Excerpt */}
              {(base.excerpt || base.subtitle) && (
                <p className="text-[15px] sm:text-[16px] text-zinc-600 leading-[1.55] font-sans font-normal mb-5">
                  {base.excerpt || base.subtitle}
                </p>
              )}

              {/* Separator */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 h-[1.5px] bg-zinc-300" />
                <div className="flex items-center gap-[6px]">
                  <span className="w-[4px] h-[4px] rounded-full bg-zinc-500 inline-block" />
                  <span className="w-[4px] h-[4px] rounded-full bg-zinc-500 inline-block" />
                  <span className="w-[4px] h-[4px] rounded-full bg-zinc-500 inline-block" />
                </div>
                <div className="flex-1 h-[1.5px] bg-zinc-300" />
              </div>
            </header>

            {/* BODY BLOCKS */}
            <div className="max-w-[700px]">
              {LORD_STANLEY_FINK_BLOCKS.map((b: any, i: number) => (
                <Block key={b.id || i} block={b} />
              ))}

              {/* End of article dots marker */}
              <div className="flex items-center justify-center gap-2.5 mt-10 mb-8 select-none">
                <span className="w-[4px] h-[4px] rounded-full bg-zinc-300 inline-block" />
                <span className="w-[4px] h-[4px] rounded-full bg-zinc-300 inline-block" />
                <span className="w-[4px] h-[4px] rounded-full bg-zinc-300 inline-block" />
              </div>

              {/* Author Profile Section */}
              <div className="my-8 py-4 border-y border-zinc-150 flex flex-col gap-1">
                <h4 className="font-sans text-sm font-bold text-zinc-950">
                  {authorName}
                </h4>
                <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                  {authorBio}
                </p>
              </div>

              {/* Share Bar */}
              <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-zinc-200">
                <span className="text-[11px] font-sans font-bold uppercase tracking-[0.16em] text-zinc-600 select-none">
                  Share Story
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    {
                      label: "WhatsApp",
                      href: `https://api.whatsapp.com/send?text=${te}%20${enc}`,
                      icon: (
                        <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                      ),
                    },
                    {
                      label: "X",
                      href: `https://twitter.com/intent/tweet?url=${enc}&text=${te}`,
                      icon: (
                        <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                    },
                    {
                      label: "LinkedIn",
                      href: `https://www.linkedin.com/shareArticle?mini=true&url=${enc}&title=${te}`,
                      icon: (
                        <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      ),
                    },
                    {
                      label: "Facebook",
                      href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
                      icon: (
                        <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                    },
                  ].map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      className="w-8 h-8 rounded-full border border-zinc-200 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-all duration-200"
                    >
                      {icon}
                    </a>
                  ))}
                  {/* Copy Link button */}
                  <div className="relative">
                    <button
                      onClick={copy}
                      title="Copy link"
                      className="w-8 h-8 rounded-full border border-zinc-200 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    >
                      <svg className="w-[14px] h-[14px] fill-none stroke-current" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                    {copied && (
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-sans py-1.5 px-3 rounded whitespace-nowrap shadow-lg pointer-events-none">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Discussion & Comments Section */}
              <section className="space-y-6 pt-8">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2 text-left">
                  Discussion ({comments.length})
                </h3>

                {/* List of comments */}
                <div className="space-y-4">
                  {comments.length === 0 && (
                    <div className="text-xs text-zinc-500 italic">
                      No comments yet. Be the first to share your perspective.
                    </div>
                  )}
                  {comments.map((comment, index) => (
                    <div
                      key={comment._id || index}
                      className="bg-zinc-50/60 border border-zinc-200 p-4 rounded-xs transition hover:shadow-2xs text-left"
                    >
                      <div className="flex justify-between items-center text-[10.5px] text-zinc-500 mb-1.5 font-mono">
                        <span className="font-bold text-zinc-800">{comment.name}</span>
                        <span>
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : comment.date}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-750 leading-relaxed font-sans">{comment.text}</p>
                    </div>
                  ))}
                </div>

                {/* Submit Comment Form */}
                <form
                  onSubmit={handleCommentSubmit}
                  className="border border-zinc-200 p-5 bg-zinc-50/40 rounded-xs space-y-4"
                >
                  <h4 className="text-xs font-bold text-zinc-850 uppercase tracking-widest text-left">
                    Share your perspective
                  </h4>

                  {commentError && (
                    <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded border border-red-100 text-left">
                      {commentError}
                    </div>
                  )}
                  {commentSuccess && (
                    <div className="bg-emerald-50 text-emerald-700 text-[11px] p-3 rounded border border-emerald-100 text-left">
                      {commentSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name / Signature"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-white border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-zinc-800 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                      required
                      disabled={isSubmittingComment}
                    />
                    <input
                      type="email"
                      placeholder="Subscriber Email Address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-white border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-zinc-800 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                      required
                      disabled={isSubmittingComment}
                    />
                  </div>
                  <textarea
                    placeholder="Add your comments here..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="bg-white border border-zinc-200 rounded px-3.5 py-3 text-xs text-zinc-800 w-full h-24 resize-none focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                    required
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className={`text-white text-xs font-bold py-2.5 px-5 rounded transition font-sans ${
                      isSubmittingComment
                        ? "bg-zinc-400 cursor-not-allowed"
                        : "bg-zinc-900 cursor-pointer hover:bg-zinc-800"
                    }`}
                  >
                    {isSubmittingComment ? "Submitting..." : "Submit Comment"}
                  </button>
                </form>
              </section>
            </div>
          </main>

          {/* ── Trending Sidebar with Thin Separation Line ─────────────────── */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-5 lg:border-l lg:border-zinc-200 lg:pl-10 xl:pl-12">
            <div className="sticky top-6">
              {trendingList.length > 0 && (
                <div>
                  <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-zinc-600 mb-5 select-none">
                    Trending
                  </p>
                  <div className="space-y-px">
                    {trendingList.map((a: any, i: number) => (
                      <a
                        key={a._id || a.slug || i}
                        href={`/${(a.category || "news").toLowerCase()}/${a.slug}`}
                        className="group flex items-start gap-4 py-4 border-b border-zinc-100 last:border-0 cursor-pointer"
                      >
                        <span className="text-[10.5px] font-sans text-zinc-400 tabular-nums mt-0.5 shrink-0 select-none w-4 font-semibold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-sans font-medium text-zinc-800 leading-[1.5] line-clamp-3 group-hover:text-zinc-950 transition-colors duration-200">
                            {a.title}
                          </p>
                          <p className="text-[10px] font-sans text-zinc-400 mt-1 uppercase tracking-wide">
                            {a.category}
                          </p>
                        </div>
                        {a.image && (
                          <div className="w-[52px] h-[52px] shrink-0 overflow-hidden bg-zinc-100 rounded-sm">
                            <img
                              src={a.image}
                              alt={a.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ── More News Section ───────────────────────────────────────── */}
      {moreNewsList.length > 0 && (
        <div className="w-full border-t border-zinc-200 py-10 bg-zinc-50/50">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-wide mb-6">
              More News
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreNewsList.map((art: any, index: number) => (
                <Link
                  key={art._id || art.id || index}
                  href={getArticleUrl(art)}
                  className="group flex flex-col gap-3 cursor-pointer"
                >
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-sm bg-zinc-100">
                    <img
                      src={art.image || art.featuredImage || "/images/magazinegazette-logo.jpg"}
                      alt={art.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      {art.category || "News"}
                    </span>
                    <h4 className="text-xs font-semibold text-zinc-800 leading-snug group-hover:underline line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
