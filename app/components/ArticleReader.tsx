"use client";

import React, { useState } from "react";
import { Article } from "../data/news";

interface Comment {
  name: string;
  date: string;
  text: string;
}

interface ArticleReaderProps {
  article: Article;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  comments: Comment[];
  onAddComment: (id: string, name: string, text: string) => void;
  discussionTitle?: string;
  sharePerspectiveTitle?: string;
}

type FontSize = "sm" | "base" | "lg" | "xl";

export default function ArticleReader({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  comments,
  onAddComment,
  discussionTitle,
  sharePerspectiveTitle,
}: ArticleReaderProps) {
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [nameInput, setNameInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [showShareNotification, setShowShareNotification] = useState(false);

  if (!article) return null;

  const fontClasses: Record<FontSize, string> = {
    sm: "text-sm sm:text-base leading-relaxed text-zinc-800",
    base: "text-base sm:text-lg leading-relaxed text-zinc-800",
    lg: "text-lg sm:text-xl leading-relaxed text-zinc-800",
    xl: "text-xl sm:text-2xl leading-relaxed text-zinc-900",
  };

  const handleShare = () => {
    // Simulate share copying
    navigator.clipboard.writeText(window.location.href);
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 2500);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !commentInput.trim()) return;

    onAddComment(article.id, nameInput.trim(), commentInput.trim());
    setNameInput("");
    setCommentInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs select-none">
      {/* Background overlay click handler */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Reader Panel */}
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in overflow-y-auto">

        {/* Reader Top Action Bar (Stays pinned at top) */}
        <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 py-3.5 px-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-black transition cursor-pointer text-xs font-semibold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Edition</span>
          </button>

          {/* Reader Preferences & Actions */}
          <div className="flex items-center gap-4">
            {/* Font Sizer */}
            <div className="flex items-center gap-1 border border-zinc-200 rounded px-1.5 py-0.5 bg-zinc-50">
              <button
                onClick={() => setFontSize("sm")}
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded cursor-pointer ${fontSize === "sm" ? "bg-white text-black shadow-xs" : "text-zinc-400 hover:text-zinc-700"}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize("base")}
                className={`px-1.5 py-0.5 text-xs font-bold rounded cursor-pointer ${fontSize === "base" ? "bg-white text-black shadow-xs" : "text-zinc-400 hover:text-zinc-700"}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("lg")}
                className={`px-1.5 py-0.5 text-sm font-bold rounded cursor-pointer ${fontSize === "lg" ? "bg-white text-black shadow-xs" : "text-zinc-400 hover:text-zinc-700"}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize("xl")}
                className={`px-1.5 py-0.5 text-base font-bold rounded cursor-pointer ${fontSize === "xl" ? "bg-white text-black shadow-xs" : "text-zinc-400 hover:text-zinc-700"}`}
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className="text-zinc-500 hover:text-black transition cursor-pointer"
              title={isBookmarked ? "Remove from Reading List" : "Add to Reading List"}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Share link button */}
            <button
              onClick={handleShare}
              className="text-zinc-500 hover:text-black transition cursor-pointer relative"
              title="Copy Article Link"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Content Container (Scrollable) */}
        <div className="flex-1 py-8 px-6 sm:px-12 space-y-6">
          {/* Category Tag */}
          <div className="text-center">
            <span className="text-[10px] text-red-700 font-extrabold uppercase tracking-widest border border-zinc-200 px-2 py-0.5 rounded-[4px] bg-zinc-50">
              {article.category}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial-title text-2xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 leading-tight tracking-tight text-center">
            {article.title}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed text-center italic max-w-xl mx-auto font-serif">
            {article.excerpt}
          </p>

          {/* Author Credits Line */}
          <div className="border-y border-zinc-150 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-zinc-500 font-sans">
            <div>
              By <span className="font-bold text-zinc-800">{article.author}</span>
              <span className="text-zinc-400"> • {article.authorTitle}</span>
            </div>
            <div>
              Published <span className="font-bold text-zinc-700">{article.date}</span>
              <span className="mx-1.5">•</span>
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Photo */}
          <div className="relative aspect-[16/10] bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover filter brightness-95"
            />
          </div>
          <div className="text-[10px] text-zinc-400 font-mono text-right italic">
            Photo Credits: Unsplash Editorial Archives.
          </div>

          {/* Article Body Paragraphs */}
          <article className="mt-8 font-editorial-body space-y-6 border-b border-zinc-200 pb-8">
            {article.content.map((p, i) => (
              <p key={i} className={fontClasses[fontSize]}>
                {p}
              </p>
            ))}
          </article>

          {/* Comments Section */}
          <section className="space-y-6 pt-4">
            <h3 className="text-base font-editorial-title font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1.5">
              {discussionTitle || "Discussion"} ({comments.length})
            </h3>

            {/* List of comments */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No comments have been posted yet. Be the first to join the conversation.</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-sm">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1.5 font-mono">
                      <span className="font-bold text-zinc-800">{comment.name}</span>
                      <span>{comment.date}</span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed font-sans">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Comment Form */}
            <form onSubmit={handleSubmitComment} className="border border-zinc-200 p-4 bg-zinc-50/40 rounded-sm space-y-3">
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest">{sharePerspectiveTitle || "Share your perspective"}</h4>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Your Name / Signature"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-white border border-zinc-200 rounded px-3 py-1.5 text-xs text-zinc-800 w-full"
                  required
                />
                <textarea
                  placeholder="Add your comments here..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="bg-white border border-zinc-200 rounded px-3 py-2 text-xs text-zinc-800 w-full h-20 resize-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-zinc-900 text-white text-xs font-bold py-2 px-4 rounded hover:bg-zinc-850 transition cursor-pointer self-start"
                >
                  Submit Comment
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Footer info (At the bottom of the article reader drawer) */}
        <div className="bg-zinc-50 border-t border-zinc-200 py-4 px-6 text-center text-[10px] text-zinc-400 select-none font-mono">
          © {new Date().getFullYear()} The Domain Name. All rights reserved.
        </div>
      </div>
    </div>
  );
}
