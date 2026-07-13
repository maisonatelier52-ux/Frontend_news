'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterConfig {
  logoText?: string;
  address?: string;
  copyright?: string;
  bgColor?: string;
  textColor?: string;
  paddingY?: string;
  borderTopColor?: string;
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

  const logoText = config?.logoText || 'The Domain Name';
  const address = config?.address || 'An independent, employee-owned publication covering national policy, international affairs, global markets, technology, and arts. Headquartered in Washington, D.C.';
  const copyright = config?.copyright || '© 2026 The Domain Name. All rights reserved.';
  
  // Use dark-themed defaults if not configured (matching sign up button bg)
  const bgColor = config?.bgColor || '#09090b';
  const textColor = config?.textColor || '#d4d4d8';
  const borderTopColor = config?.borderTopColor || '#27272a';
  const paddingY = config?.paddingY || '40px';

  return (
    <footer 
      style={{ backgroundColor: bgColor, color: textColor, paddingBottom: paddingY }}
      className="px-6 sm:px-8 w-full select-none text-[13px] font-sans"
    >
      <div 
        style={{ borderTop: `1px solid ${borderTopColor}`, paddingTop: paddingY }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-10"
      >
        
        {/* Brand Information Block */}
        <div className="lg:col-span-3 space-y-3.5">
          <h4 className="font-serif text-[17px] font-bold text-white tracking-tight">
            {logoText}
          </h4>
          <p className="text-[12px] leading-relaxed text-zinc-400 font-normal max-w-[240px]">
            {address}
          </p>
        </div>

        {/* Categories Col 1 */}
        <div className="lg:col-span-2">
          <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-4 font-sans">
            Categories
          </h5>
          <div className="space-y-3 flex flex-col text-[13px] font-medium text-zinc-300">
            <Link href="/Politics" className="hover:text-white transition-colors duration-150">
              U.S. News & Politics
            </Link>
            <Link href="/Technology" className="hover:text-white transition-colors duration-150">
              Technology & Science
            </Link>
            <Link href="/Business" className="hover:text-white transition-colors duration-150">
              Marketing & Strategy
            </Link>
          </div>
        </div>

        {/* Categories Col 2 */}
        <div className="lg:col-span-2">
          <h5 className="text-[10px] uppercase text-transparent mb-4 font-sans select-none hidden lg:block">
            _
          </h5>
          <div className="space-y-3 flex flex-col text-[13px] font-medium text-zinc-300">
            <Link href="/Business" className="hover:text-white transition-colors duration-150">
              Finance & Markets
            </Link>
            <Link href="/World" className="hover:text-white transition-colors duration-150">
              World Affairs
            </Link>
            <Link href="/Entertainment" className="hover:text-white transition-colors duration-150">
              Arts & Entertainment
            </Link>
          </div>
        </div>

        {/* Other Sections Col 1 */}
        <div className="lg:col-span-2">
          <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-4 font-sans">
            Other Sections
          </h5>
          <div className="space-y-3 flex flex-col text-[13px] font-medium text-zinc-300">
            <Link href="/about" className="hover:text-white transition-colors duration-150">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors duration-150">
              Contact Us
            </Link>
            <Link href="/our-team" className="hover:text-white transition-colors duration-150">
              Our Team
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors duration-150">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-150">
              Terms & Conditions
            </Link>
            <Link href="/correction-policy" className="hover:text-white transition-colors duration-150">
              Correction Policy
            </Link>
          </div>
        </div>

        {/* Other Sections Col 2 */}
        <div className="lg:col-span-3">
          <h5 className="text-[10px] uppercase text-transparent mb-4 font-sans select-none hidden lg:block">
            _
          </h5>
          <div className="space-y-3 flex flex-col text-[13px] font-medium text-zinc-300">
            <Link href="/source-methodology" className="hover:text-white transition-colors duration-150">
              Source Methodology
            </Link>
            <Link href="/advertising-policy" className="hover:text-white transition-colors duration-150">
              Advertising & Sponsored Policy
            </Link>
            <Link href="/ownership-funding" className="hover:text-white transition-colors duration-150">
              Ownership & Funding
            </Link>
            <Link href="/right-of-reply-policy" className="hover:text-white transition-colors duration-150">
              Right of Reply Policy
            </Link>
            <Link href="/legal-policy" className="hover:text-white transition-colors duration-150">
              Legal Policy
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto border-t border-zinc-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
        <div>
          {copyright}
        </div>
      </div>
    </footer>
  );
}
