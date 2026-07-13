'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface PolicySection {
  heading: string;
  content: string;
  listItems?: string[];
}

interface LegalPolicyConfig {
  title?: string;
  subtitle?: string;
  leadParagraph?: string;
  sections?: PolicySection[];
}

function parseMarkdown(text: string) {
  if (!text) return '';
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      if (part.includes('@')) {
        return (
          <a key={i} href={`mailto:${part}`} className="text-indigo-650 hover:underline">
            {part}
          </a>
        );
      }
      return <strong key={i} className="font-bold text-slate-900">{part}</strong>;
    }
    return part;
  });
}

export default function LegalPolicyPage() {
  const [config, setConfig] = useState<LegalPolicyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLegalSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.legalPolicy) {
            setConfig(data.legalPolicy);
          }
        }
      } catch (err) {
        console.error('Failed to load legal settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLegalSettings();
  }, []);

  const title = config?.title || 'Legal Policy';
  const subtitle = config?.subtitle || 'Governing Laws and Disclaimers';
  const leadParagraph = config?.leadParagraph || 'This document contains the legal disclosures and policy guidelines governing your use of the **Domain Name** website and digital services.';
  
  const sections = config?.sections || [
    {
      heading: '1. No Legal or Professional Advice',
      content: 'The news, analysis, articles, and reviews published on Domain Name are for general informational and educational purposes only. They do not constitute financial, legal, medical, or other professional advice. Readers should consult with qualified professionals before making any decisions based on the content found on this site.',
      listItems: []
    },
    {
      heading: '2. Copyright and Trademark Notice',
      content: 'All contents of this site, including text, graphics, logos, layouts, icons, and software, are the exclusive property of Domain Name and are protected by international copyright laws. Any unauthorized distribution, reproduction, or modification of the site materials is strictly prohibited and will be prosecuted to the fullest extent of the law.',
      listItems: []
    },
    {
      heading: '3. Disclaimer of Endorsements',
      content: 'Reference to any commercial products, services, processes, trade names, or corporate trademarks in our articles does not constitute or imply endorsement, sponsorship, or recommendation by Domain Name.',
      listItems: []
    },
    {
      heading: '4. Governing Law and Jurisdiction',
      content: 'Any disputes, claims, or legal proceedings arising out of or in connection with the use of Domain Name shall be governed by and construed in accordance with the laws of the District of Columbia, United States, without regard to its conflict of law provisions.',
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

      {sections.map((sec, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">{sec.heading}</h2>
          
          <p className="text-[15px] text-slate-655 leading-relaxed whitespace-pre-line">
            {parseMarkdown(sec.content)}
          </p>

          {sec.listItems && sec.listItems.length > 0 && (
            <ul className="list-disc pl-5 space-y-2 text-slate-655 text-[15px] leading-relaxed">
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
