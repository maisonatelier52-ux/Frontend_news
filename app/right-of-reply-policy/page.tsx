'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface PolicySection {
  heading: string;
  content: string;
  listItems?: string[];
}

interface RightOfReplyConfig {
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

export default function RightOfReplyPage() {
  const [config, setConfig] = useState<RightOfReplyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReplySettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.rightOfReplyPolicy) {
            setConfig(data.rightOfReplyPolicy);
          }
        }
      } catch (err) {
        console.error('Failed to load reply settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReplySettings();
  }, []);

  const title = config?.title || 'Right of Reply Policy';
  const subtitle = config?.subtitle || 'Opportunity for fair response';
  const leadParagraph = config?.leadParagraph || 'At **Magazine Gazette**, we strive to be fair. In keeping with this principle, we recognize that individuals and organizations have a right of reply if they are the subject of critical or investigative reporting.';
  
  const sections = config?.sections || [
    {
      heading: 'Our Standards for Fair Reporting',
      content: 'Before publishing articles that contain critical allegations, accusations of wrongdoing, or controversial statements about an individual or organization, our reporters make a good-faith effort to contact the subject and seek their comments. We allow a reasonable window of time for them to respond and explain their position, which we will represent fairly within the article.',
      listItems: []
    },
    {
      heading: 'Post-Publication Right of Reply',
      content: 'If an individual or organization is mentioned critically in a published story and was not contacted prior to publication, or has new facts to clarify the record, they may request a right of reply.\n\nTo submit a reply request:',
      listItems: [
        'Email the editorial team at **letters@magazinegazette.com**.',
        'State the specific article title and URL.',
        'Outline the specific allegations you wish to reply to, and provide the facts supporting your response.'
      ]
    },
    {
      heading: 'Editorial Discretion',
      content: 'While we promise to review all requests and offer a fair platform for rebuttal (either by adding comments to the article, publishing a follow-up piece, or running a letter to the editor), we maintain ultimate editorial discretion over how the response is structured, in accordance with our news values and truth standards.',
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
