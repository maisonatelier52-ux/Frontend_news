'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import StaticPageLayout from '@/app/components/StaticPageLayout';
import Link from 'next/link';

interface SocialLinks {
  twitter?: string;
  quora?: string;
  reddit?: string;
  medium?: string;
  substack?: string;
}

interface AuthorProfile {
  _id: string;
  name: string;
  slug: string;
  gender: string;
  role: string;
  email: string;
  category: string;
  bio: string;
  profileImage?: string;
  socialLinks: SocialLinks;
  articlesCount: number;
  articles: Article[];
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  excerpt?: string;
  featuredImage?: string;
}

const categoryColors: Record<string, string> = {
  Politics: '#3b82f6',
  Technology: '#8b5cf6',
  Business: '#f59e0b',
  World: '#10b981',
  Sports: '#ef4444',
  Entertainment: '#ec4899',
  Science: '#06b6d4',
  Health: '#84cc16',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AuthorProfilePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [latestArticlesHeading, setLatestArticlesHeading] = useState('Latest Articles');

  useEffect(() => {
    if (!slug) return;
    async function fetchAuthor() {
      try {
        const [authorRes, settingsRes] = await Promise.all([
          fetch(`/api/authors/slug/${slug}`),
          fetch('/api/settings'),
        ]);
        if (authorRes.status === 404) { setNotFound(true); return; }
        if (authorRes.ok) {
          const data = await authorRes.json();
          setAuthor(data);
        }
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings?.ourTeam?.latestArticlesHeading) {
            setLatestArticlesHeading(settings.ourTeam.latestArticlesHeading);
          }
        }
      } catch (err) {
        console.error('Failed to load author:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthor();
  }, [slug]);

  const socialIcons: Record<string, React.ReactNode> = {
    twitter: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
      </svg>
    ),
    quora: <span className="font-serif font-black text-[15px] leading-none">Q</span>,
    reddit: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="10" cy="10" r="8"/><circle cx="10" cy="8" r="1"/><path d="M7 11c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5"/><circle cx="7" cy="11" r="0.5"/><circle cx="13" cy="11" r="0.5"/>
      </svg>
    ),
    medium: <span className="font-mono font-black text-[14px] leading-none">M</span>,
    substack: <span className="font-sans font-black text-[14px] leading-none">S</span>,
  };

  if (loading) {
    return (
      <StaticPageLayout title="">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-semibold">Loading author profile...</p>
        </div>
      </StaticPageLayout>
    );
  }

  if (notFound || !author) {
    return (
      <StaticPageLayout title="Author Not Found">
        <div className="flex flex-col items-center justify-center min-h-[30vh] gap-4 text-center">
          <div className="text-6xl">✍️</div>
          <p className="text-slate-500 max-w-sm">We couldn't find an author with this profile link. They may have been removed or the URL is incorrect.</p>
          <Link href="/our-team" className="mt-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800 transition">
            ← Our Team
          </Link>
        </div>
      </StaticPageLayout>
    );
  }

  const catColor = categoryColors[author.category] || '#6366f1';

  return (
    <StaticPageLayout title="">
      {/* Hero Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm mb-8 overflow-hidden">
        <div className="px-6 py-10 md:px-10">
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            {/* Avatar */}
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center font-extrabold text-5xl uppercase text-white shrink-0 shadow-lg overflow-hidden"
              style={{ background: imgError || !author.profileImage ? catColor : undefined }}
            >
              {author.profileImage && !imgError ? (
                <img
                  src={author.profileImage}
                  alt={author.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                author.name.charAt(0)
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left space-y-3 flex-grow">
              <div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-2">
                  <span
                    className="text-[11px] text-white font-extrabold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: catColor }}
                  >
                    {author.category}
                  </span>
                  {author.role && (
                    <span className="text-[11px] text-slate-500 font-bold px-2.5 py-1 rounded-full bg-slate-100">
                      {author.role}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif leading-tight">
                  {author.name}
                </h1>
                <p className="text-slate-400 text-sm font-mono mt-1">/{author.slug}</p>
              </div>

              <p className="text-slate-600 text-[15px] leading-relaxed max-w-xl">
                {author.bio}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 justify-center sm:justify-start pt-1">
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-extrabold text-slate-900">{author.articlesCount}</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Articles</div>
                </div>
              </div>

              {/* Social Links */}
              {author.socialLinks && Object.values(author.socialLinks).some(Boolean) && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                  {Object.entries(author.socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold transition-all capitalize"
                      >
                        {socialIcons[platform]}
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
          <span>{latestArticlesHeading}</span>
          {author.articles.length > 0 && (
            <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              {author.articles.length}
            </span>
          )}
        </h2>

        {author.articles.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-white">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-slate-400 text-sm font-semibold">No articles published yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {author.articles.map((article) => (
              <Link
                key={article._id}
                href={`/article/${article.slug}`}
                className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-md transition-all group"
              >
                {/* Article thumbnail */}
                {article.featuredImage && (
                  <div className="w-20 h-16 md:w-24 md:h-18 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex-grow min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: categoryColors[article.category] || '#6366f1' }}
                    >
                      {article.category}
                    </span>
                    {article.publishedAt && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {timeAgo(article.publishedAt)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[14px] font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 hidden sm:block">
                      {article.excerpt}
                    </p>
                  )}
                </div>

                <div className="flex items-center shrink-0 text-slate-300 group-hover:text-indigo-500 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StaticPageLayout>
  );
}
