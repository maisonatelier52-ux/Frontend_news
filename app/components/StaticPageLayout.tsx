'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

interface StaticPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function StaticPageLayout({ title, subtitle, children }: StaticPageLayoutProps) {
  const router = useRouter();
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('domain_bookmarks');
      if (saved) {
        setBookmarkCount(JSON.parse(saved).length);
      }
    } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Header */}
      <Header
        activeCategory=""
        setActiveCategory={(cat) => router.push(`/?category=${encodeURIComponent(cat)}`)}
        searchQuery=""
        setSearchQuery={(query) => router.push(`/?search=${encodeURIComponent(query)}`)}
        bookmarkCount={bookmarkCount}
        showBookmarksOnly={false}
        setShowBookmarksOnly={(val) => {
          if (val) router.push('/?bookmarks=true');
        }}
      />

      {/* Main content area */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-6 sm:px-8 py-16 animate-[admin-fade-in_0.3s_ease_both]">
        <article className="max-w-none">
          <header className="mb-10 pb-6 border-b border-slate-200">
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[14px] text-slate-500 font-medium font-sans mt-2.5 uppercase tracking-wider">
                {subtitle}
              </p>
            )}
          </header>
          
          <div className="font-sans text-[15px] leading-relaxed text-slate-600 space-y-6 static-page-content">
            {children}
          </div>
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
