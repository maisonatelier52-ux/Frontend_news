'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface TermsSection {
  heading: string;
  content: string;
  listItems?: string[];
}

interface TermsConditionsConfig {
  title?: string;
  subtitle?: string;
  leadParagraph?: string;
  introParagraph?: string;
  sections?: TermsSection[];
}

function parseMarkdown(text: string) {
  if (!text) return '';
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-bold text-slate-900">{part}</strong>;
    }
    return part;
  });
}

export default function TermsPage() {
  const [config, setConfig] = useState<TermsConditionsConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTermsSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.termsAndConditions) {
            setConfig(data.termsAndConditions);
          }
        }
      } catch (err) {
        console.error('Failed to load terms settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTermsSettings();
  }, []);

  const title = config?.title || 'Terms and Conditions';
  const subtitle = config?.subtitle || 'Last Updated: July 13, 2026';
  const leadParagraph = config?.leadParagraph || 'Welcome to **Domain Name**. These terms and conditions outline the rules and regulations for the use of our website and services.';
  const introParagraph = config?.introParagraph || 'By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Domain Name if you do not agree to all of the terms and conditions stated on this page.';
  
  const sections = config?.sections || [
    {
      heading: '1. Intellectual Property Rights',
      content: 'Unless otherwise stated, Domain Name and/or its licensors own the intellectual property rights for all material on this site. All intellectual property rights are reserved. You may view and/or print pages from the website for your own personal use, subject to restrictions set in these terms and conditions.\n\nYou must not:',
      listItems: [
        'Republish material from this site without explicit credits or permission.',
        'Sell, rent, or sub-license material from the website.',
        'Reproduce, duplicate, or copy content for commercial use.'
      ]
    },
    {
      heading: '2. User-Generated Comments',
      content: 'Certain parts of this website offer the opportunity for users to post opinions, feedback, and comments. Comments represent the views of the person who posts them, not of Domain Name. We reserve the right to monitor all comments and remove any which we consider inappropriate, offensive, or in breach of these terms.',
      listItems: []
    },
    {
      heading: '3. Linkage to Our Content',
      content: 'Publications, news agencies, and educational institutions may link to our home page or articles, provided that the link is not misleading, does not falsely imply sponsorship or endorsement, and fits within the context of the linking party’s site.',
      listItems: []
    },
    {
      heading: '4. Limitation of Liability',
      content: 'The materials on this website are provided "as is". While we strive for accuracy, Domain Name makes no warranties, expressed or implied, and hereby disclaims all other warranties, including without limitation, implied warranties or conditions of merchantability or fitness for a particular purpose.',
      listItems: []
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <StaticPageLayout title={title} subtitle={subtitle}>
      <p className="font-serif text-lg text-slate-800 leading-relaxed font-medium mb-6">
        {parseMarkdown(leadParagraph)}
      </p>

      <p className="text-[15px] text-slate-650 leading-relaxed mb-6">
        {parseMarkdown(introParagraph)}
      </p>

      {sections.map((sec, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">{sec.heading}</h2>
          
          <p className="text-[15px] text-slate-650 leading-relaxed whitespace-pre-line">
            {parseMarkdown(sec.content)}
          </p>

          {sec.listItems && sec.listItems.length > 0 && (
            <ul className="list-disc pl-5 space-y-2 text-slate-600 text-[15px] leading-relaxed">
              {sec.listItems.map((item, itemIdx) => (
                <li key={itemIdx}>
                  {parseMarkdown(item)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </StaticPageLayout>
  );
}
