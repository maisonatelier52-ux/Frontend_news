'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface MethodologySection {
  heading: string;
  content: string;
  listItems?: string[];
}

interface SourceMethodologyConfig {
  title?: string;
  subtitle?: string;
  leadParagraph?: string;
  sections?: MethodologySection[];
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

export default function SourceMethodologyPage() {
  const [config, setConfig] = useState<SourceMethodologyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMethodologySettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.sourceMethodology) {
            setConfig(data.sourceMethodology);
          }
        }
      } catch (err) {
        console.error('Failed to load source methodology settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMethodologySettings();
  }, []);

  const title = config?.title || 'Source Methodology';
  const subtitle = config?.subtitle || 'How we gather and verify information';
  const leadParagraph = config?.leadParagraph || 'The credibility of **Domain Name** rests on the reliability of our sources. We utilize strict standards for finding, vetting, and attributing information to ensure our coverage remains objective and factual.';
  
  const sections = config?.sections || [
    {
      heading: '1. Vetting Sources',
      content: 'Our reporters verify all primary sources of information. Whether we are interviewing government officials, academic researchers, corporate leads, or local community representatives, we crosscheck their credentials, motives, and secondary documentation to ensure their statements are trustworthy.',
      listItems: []
    },
    {
      heading: '2. Use of Anonymous Sources',
      content: 'Anonymous sources are used only as a last resort, when critical information cannot be obtained on-the-record, and the source faces personal, professional, or legal risk for sharing it. In these instances:',
      listItems: [
        'The source must be vetted and known to the reporter and an executive editor.',
        'We explain to the reader why the source remains anonymous.',
        'We strive to corroborate the information through other independent, on-the-record sources.'
      ]
    },
    {
      heading: '3. Fact-Checking and Verification',
      content: 'No claim is published as fact without verification. We require multiple independent sources to corroborate a news tip before running a story. Technical, financial, or scientific articles undergo internal review to ensure complex data points, trends, and regulations are accurately interpreted.',
      listItems: []
    },
    {
      heading: '4. Secondary Sources and Attribution',
      content: 'When referencing other news publications, magazines, or government releases, we always give clear attribution and link to the original work. We respect intellectual property and seek to give credit where credit is due.',
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
