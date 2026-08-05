'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterLink {
  id: number;
  label: string;
  url: string;
  isVisible?: boolean;
}

interface FooterColumn {
  id: number;
  heading: string;
  isVisible?: boolean;
  links: FooterLink[];
}

interface FooterConfig {
  logoText?: string;
  description?: string;
  address?: string;
  copyright?: string;
  bgColor?: string;
  textColorPrimary?: string;
  textColorSecondary?: string;
  paddingY?: string;
  borderTopColor?: string;
  columns?: FooterColumn[];
  socials?: any[];
}

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('reddit')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-4.566 3.48a.333.333 0 0 0-.236.568c.708.707 1.84.957 2.052.957.21 0 1.344-.25 2.052-.957a.333.333 0 0 0-.471-.471c-.488.488-1.3.695-1.581.695-.282 0-1.094-.207-1.581-.695a.33.33 0 0 0-.235-.097z"/>
      </svg>
    );
  }
  if (p.includes('medium')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
      </svg>
    );
  }
  if (p.includes('substack')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
      </svg>
    );
  }
  if (p.includes('instagram')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    );
  }
  return <span className="font-bold text-xs">{platform.charAt(0)}</span>;
}

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig | null>(null);

  useEffect(() => {
    async function fetchFooterSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.footer) {
            setConfig(data.footer);
          }
        }
      } catch (err) {
        console.error('Failed to fetch footer settings:', err);
      }
    }
    fetchFooterSettings();
  }, []);

  const logoText = config?.logoText || 'Magazine Gazette';
  let description = 'A premium news publication delivering breaking news, expert analysis, and in-depth reporting on global markets, technology, and politics.';
  // Clean up any location mention dynamically
  description = description.replace(/[\s\.]*Headquartered in Washington,\s*D\.C\./i, '').trim();
  if (description && !description.endsWith('.')) {
    description = description + '.';
  }
  
  let copyright = config?.copyright || '© 2026 Magazine Gazette. All rights reserved.';
  // Clean up any garbled copyright symbol/spacing from DB encoding issues
  copyright = copyright.replace(/^[?\s]+/, '').trim();
  if (copyright.startsWith('2026')) {
    copyright = `© ${copyright}`;
  } else if (!copyright.startsWith('©')) {
    copyright = `© ${copyright}`;
  }
  // Ensure the brand name is present
  if (!copyright.includes('Magazine Gazette')) {
    copyright = `${copyright} Magazine Gazette. All rights reserved.`;
  }

  const defaultSocials = [
    { id: 1, platform: 'Reddit', url: 'https://www.reddit.com/user/Magazinegazetter/' },
    { id: 2, platform: 'Medium', url: 'https://medium.com/@magazinegazette367' },
    { id: 3, platform: 'Substack', url: 'https://substack.com/@magazinegazettenews' },
    { id: 4, platform: 'Instagram', url: 'https://www.instagram.com/magazinegazette367/' }
  ];

  const socialLinks = (config?.socials && config.socials.length > 0 && !config.socials.some((s: any) => s.url?.includes('newssite')))
    ? config.socials
    : defaultSocials;
  
  // Custom styling settings
  const bgColor = config?.bgColor || '#09090b';
  const textColorPrimary = config?.textColorPrimary || '#ffffff';
  const textColorSecondary = config?.textColorSecondary || '#a1a1aa';
  const borderTopColor = config?.borderTopColor || '#27272a';
  const paddingY = config?.paddingY || '40px';

  const columns = config?.columns || [
    {
      id: 1,
      heading: 'Categories',
      isVisible: true,
      links: [
        { id: 1, label: 'Business', url: '/business', isVisible: true },
        { id: 2, label: 'World', url: '/world', isVisible: true },
        { id: 3, label: 'Finance', url: '/finance', isVisible: true },
        { id: 4, label: 'Technology', url: '/technology', isVisible: true }
      ]
    },
    {
      id: 2,
      heading: '',
      isVisible: true,
      links: [
        { id: 1, label: 'Politics', url: '/politics', isVisible: true },
        { id: 2, label: 'Lifestyle', url: '/lifestyle', isVisible: true },
        { id: 3, label: 'Opinion', url: '/opinion', isVisible: true },
        { id: 4, label: 'Investigation', url: '/investigation', isVisible: true }
      ]
    },
    {
      id: 3,
      heading: 'Other Sections',
      isVisible: true,
      links: [
        { id: 1, label: 'About Us', url: '/about', isVisible: true },
        { id: 2, label: 'Contact Us', url: '/contact', isVisible: true },
        { id: 3, label: 'Our Team', url: '/our-team', isVisible: true },
        { id: 4, label: 'Privacy Policy', url: '/privacy', isVisible: true },
        { id: 5, label: 'Terms & Conditions', url: '/terms', isVisible: true },
        { id: 6, label: 'Correction Policy', url: '/correction-policy', isVisible: true }
      ]
    },
    {
      id: 4,
      heading: '',
      isVisible: true,
      links: [
        { id: 1, label: 'Source Methodology', url: '/source-methodology', isVisible: true },
        { id: 2, label: 'Advertising & Sponsored Policy', url: '/advertising-policy', isVisible: true },
        { id: 3, label: 'Ownership & Funding', url: '/ownership-funding', isVisible: true },
        { id: 4, label: 'Right of Reply Policy', url: '/right-of-reply-policy', isVisible: true },
        { id: 5, label: 'Legal Policy', url: '/legal-policy', isVisible: true }
      ]
    }
  ];

  return (
    <footer 
      style={{ backgroundColor: bgColor, color: textColorPrimary, paddingBottom: paddingY }}
      className="w-full select-none text-[13px] font-sans"
    >
      <div 
        style={{ borderTop: `1px solid ${borderTopColor}`, paddingTop: paddingY }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-10"
      >
        
        {/* Brand Information Block */}
        <div className="lg:col-span-3 space-y-3.5">
          <h4 style={{ color: textColorPrimary }} className="font-serif text-[17px] font-bold tracking-tight">
            {logoText}
          </h4>
          <p style={{ color: textColorSecondary }} className="text-[12px] leading-relaxed font-normal max-w-[240px]">
            {description}
          </p>
        </div>

        {/* Categories Block (Col 0 & Col 1 grouped) */}
        {columns[0] && columns[0].isVisible !== false && (
          <div className="lg:col-span-4 flex flex-col">
            <h5 
              style={{ color: textColorSecondary }}
              className="text-[10px] font-extrabold uppercase tracking-widest mb-4 font-sans"
            >
              {columns[0].heading || 'Categories'}
            </h5>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 text-[13px] font-medium">
              <div className="space-y-3 flex flex-col">
                {columns[0].links.map((link) => {
                  if (link.isVisible === false) return null;
                  return (
                    <Link 
                      key={link.id} 
                      href={link.url || '#'} 
                      style={{ color: textColorPrimary }}
                      className="hover:opacity-80 transition-opacity duration-150"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              {columns[1] && columns[1].isVisible !== false && (
                <div className="space-y-3 flex flex-col">
                  {columns[1].links.map((link) => {
                    if (link.isVisible === false) return null;
                    return (
                      <Link 
                        key={link.id} 
                        href={link.url || '#'} 
                        style={{ color: textColorPrimary }}
                        className="hover:opacity-80 transition-opacity duration-150"
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other Sections Block (Col 2 & Col 3 grouped) */}
        {columns[2] && columns[2].isVisible !== false && (
          <div className="lg:col-span-5 flex flex-col">
            <h5 
              style={{ color: textColorSecondary }}
              className="text-[10px] font-extrabold uppercase tracking-widest mb-4 font-sans"
            >
              {columns[2].heading || 'Other Sections'}
            </h5>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 text-[13px] font-medium">
              <div className="space-y-3 flex flex-col">
                {columns[2].links.map((link) => {
                  if (link.isVisible === false) return null;
                  return (
                    <Link 
                      key={link.id} 
                      href={link.url || '#'} 
                      style={{ color: textColorPrimary }}
                      className="hover:opacity-80 transition-opacity duration-150"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              {columns[3] && columns[3].isVisible !== false && (
                <div className="space-y-3 flex flex-col">
                  {columns[3].links.map((link) => {
                    if (link.isVisible === false) return null;
                    return (
                      <Link 
                        key={link.id} 
                        href={link.url || '#'} 
                        style={{ color: textColorPrimary }}
                        className="hover:opacity-80 transition-opacity duration-150"
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fallback for any extra columns (> 4) */}
        {columns.slice(4).map((col) => {
          if (col.isVisible === false) return null;
          return (
            <div key={col.id} className="lg:col-span-2">
              {col.heading && (
                <h5 
                  style={{ color: textColorSecondary }}
                  className="text-[10px] font-extrabold uppercase tracking-widest mb-4 font-sans"
                >
                  {col.heading}
                </h5>
              )}
              <div className="space-y-3 flex flex-col text-[13px] font-medium">
                {col.links.map((link) => {
                  if (link.isVisible === false) return null;
                  return (
                    <Link 
                      key={link.id} 
                      href={link.url || '#'} 
                      style={{ color: textColorPrimary }}
                      className="hover:opacity-80 transition-opacity duration-150"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div 
        style={{ borderTop: `1px solid ${borderTopColor}` }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]"
      >
        <div style={{ color: textColorSecondary }}>
          {copyright}
        </div>

        {/* Social Icons Bar (Right side end, opposite to all rights reserved) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {socialLinks.map((s: any) => (
            <a
              key={s.id || s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.platform}
              aria-label={s.platform}
              style={{ color: textColorSecondary }}
              className="hover:opacity-100 opacity-70 transition-all duration-200 hover:scale-110 p-1 flex items-center justify-center"
            >
              {getSocialIcon(s.platform)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
