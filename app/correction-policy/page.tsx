'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface PolicySection {
  heading: string;
  content: string;
  listItems?: string[];
}

interface CorrectionPolicyConfig {
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

export default function CorrectionPolicyPage() {
  const [config, setConfig] = useState<CorrectionPolicyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCorrectionSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.correctionPolicy) {
            setConfig(data.correctionPolicy);
          }
        }
      } catch (err) {
        console.error('Failed to load correction settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCorrectionSettings();
  }, []);

  const title = config?.title || 'Correction Policy';
  const subtitle = config?.subtitle || 'Commitment to Accuracy and Integrity';
  const leadParagraph = config?.leadParagraph || 'At **Domain Name**, our primary goal is to provide accurate, fair, and comprehensive coverage. However, when we make a mistake, we are committed to correcting the record promptly and transparently.';
  
  const sections = config?.sections || [
    {
      heading: 'Our Standards',
      content: 'We aim to maintain the highest levels of accuracy. If a report contains a factual error or leaves a misleading impression, we will publish a correction. Small typos or spelling mistakes that do not change the meaning of the article are typically corrected quietly without a formal note, but substantive errors of fact require a clear correction notice.',
      listItems: []
    },
    {
      heading: 'How We Correct Articles',
      content: 'When an error is corrected, we update the body of the article online and append a clear italicized note at the bottom of the page. This note specifies:',
      listItems: [
        'The date and time the correction was applied.',
        'The specific fact that was originally incorrect.',
        'The corrected information.'
      ]
    },
    {
      heading: 'Reporting a Correction',
      content: 'If you spot a factual error in any of our articles, please report it immediately to our editors at **corrections@domainname.com**.\n\nPlease include:',
      listItems: [
        'The URL of the article.',
        'The headline and publication date.',
        'The specific sentence or paragraph containing the error.',
        'Supporting evidence or documentation for the correct information, where possible.'
      ]
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
