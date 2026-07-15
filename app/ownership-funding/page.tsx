'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface PolicySection {
  heading: string;
  content: string;
  listItems?: string[];
}

interface OwnershipFundingConfig {
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

export default function OwnershipFundingPage() {
  const [config, setConfig] = useState<OwnershipFundingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOwnershipSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.ownershipFunding) {
            setConfig(data.ownershipFunding);
          }
        }
      } catch (err) {
        console.error('Failed to load ownership settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOwnershipSettings();
  }, []);

  const title = config?.title || 'Ownership & Funding';
  const subtitle = config?.subtitle || 'Editorial Independence through Transparent Revenue';
  const leadParagraph = config?.leadParagraph || 'At **Magazine Gazette**, we believe transparency about our owners and financial resources is critical to establishing trust with our readers.';
  
  const sections = config?.sections || [
    {
      heading: 'Ownership Structure',
      content: 'Magazine Gazette is owned and operated by an independent, employee-owned cooperative. This means our editors, writers, designers, and developers hold equity in the publication. Our board is elected democratically by staff, ensuring that our corporate structure aligns with our editorial mission to serve public interests, rather than private shareholders or venture capital funds.',
      listItems: []
    },
    {
      heading: 'Funding Sources',
      content: 'To ensure we remain independent and financially stable, our revenue model is diversified. We are funded through:',
      listItems: [
        '**Reader Subscriptions:** Direct reader support via digital subscriptions is our largest and most valued funding source. This directly funds our reporting and investigations.',
        '**Digital Advertising:** We display banner ads and sponsored articles. Advertising policies are managed strictly under our Advertising Policy guidelines.',
        '**Grants and Philanthropy:** We accept philanthropic donations or media grants from non-partisan organizations dedicated to supporting independent journalism. These donations carry no editorial influence.'
      ]
    },
    {
      heading: 'Financial Disclosures',
      content: 'We pledge to publish an annual transparency report summarizing our revenue distributions, staff compensation, and external funding sources. For specific investor relations, corporate inquiries, or grant partnership questions, please email **info@magazinegazette.com**.',
      listItems: []
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        {/* <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" /> */}
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
