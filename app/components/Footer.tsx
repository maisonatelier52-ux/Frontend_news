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
  const description = config?.description || config?.address || 'An independent, employee-owned publication covering national policy, international affairs, global markets, technology, and arts. Headquartered in Washington, D.C.';
  const copyright = config?.copyright || '© 2026 Magazine Gazette. All rights reserved.';
  
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
        { id: 1, label: 'U.S. News & Politics', url: '/Politics', isVisible: true },
        { id: 2, label: 'Technology & Science', url: '/Technology', isVisible: true },
        { id: 3, label: 'Marketing & Strategy', url: '/Business', isVisible: true }
      ]
    },
    {
      id: 2,
      heading: '',
      isVisible: true,
      links: [
        { id: 1, label: 'Finance & Markets', url: '/Business', isVisible: true },
        { id: 2, label: 'World Affairs', url: '/World', isVisible: true },
        { id: 3, label: 'Arts & Entertainment', url: '/Entertainment', isVisible: true }
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
      className="px-6 sm:px-8 w-full select-none text-[13px] font-sans"
    >
      <div 
        style={{ borderTop: `1px solid ${borderTopColor}`, paddingTop: paddingY }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-10"
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

        {/* Dynamic Columns */}
        {columns.map((col, idx) => {
          if (col.isVisible === false) return null;
          const spanClass = idx === 3 ? "lg:col-span-3" : "lg:col-span-2";
          const headingText = col.heading || "";
          
          return (
            <div key={col.id} className={spanClass}>
              {headingText ? (
                <h5 
                  style={{ color: textColorSecondary }}
                  className="text-[10px] font-extrabold uppercase tracking-widest mb-4 font-sans"
                >
                  {headingText}
                </h5>
              ) : (
                <h5 className="text-[10px] uppercase text-transparent mb-4 font-sans select-none hidden lg:block">
                  &nbsp;
                </h5>
              )}
              <div 
                className="space-y-3 flex flex-col text-[13px] font-medium"
              >
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
        className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]"
      >
        <div style={{ color: textColorSecondary }}>
          {copyright}
        </div>
      </div>
    </footer>
  );
}
