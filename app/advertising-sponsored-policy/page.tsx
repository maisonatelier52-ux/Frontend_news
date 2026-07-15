'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface PolicySection {
  heading: string;
  content: string;
  listItems?: string[];
}

interface AdvertisingPolicyConfig {
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

export default function AdvertisingPolicyPage() {
  const [config, setConfig] = useState<AdvertisingPolicyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdvertisingSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.advertisingPolicy) {
            setConfig(data.advertisingPolicy);
          }
        }
      } catch (err) {
        console.error('Failed to load advertising settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdvertisingSettings();
  }, []);

  const title = config?.title || 'Advertising & Sponsored Policy';
  const subtitle = config?.subtitle || 'Separation of editorial and commercial activities';
  const leadParagraph = config?.leadParagraph || 'At **Domain Name**, we value the trust of our readers. To maintain that trust, we enforce a strict separation between our newsroom and our commercial operations.';
  
  const sections = config?.sections || [
    {
      heading: 'Editorial Independence',
      content: 'Our advertisers and sponsors have no influence over our editorial decisions, topics, or reporting. The stories we publish are selected, reported, and edited solely by our independent newsroom staff. No advertiser can request to pull, edit, or influence any article.',
      listItems: []
    },
    {
      heading: 'Sponsored Content',
      content: 'When we publish content paid for or sponsored by commercial partners, we label it clearly. Sponsored articles, native ads, or paid partnership stories will always carry a distinct label (such as "Sponsored Content" or "Paid Partnership") in a contrasting style to separate them from our standard editorial reporting.',
      listItems: []
    },
    {
      heading: 'Advertising Standards',
      content: 'We hold all advertisements on our site to strict guidelines. We do not accept advertisements that are:',
      listItems: [
        'Misleading, fraudulent, or factually false.',
        'Hate speech, offensive, or promoting violence.',
        'Malware, phishing links, or posing security risks to our users.',
        'Political propaganda or undisclosed lobbying campaigns.'
      ]
    },
    {
      heading: 'Ad Slots Booking',
      content: 'If you are interested in booking ad slots (such as our Header Banner, Sidebar slots, or custom placements), please contact our advertising desk at **ads@domainname.com**.',
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
