'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface ValueItem {
  title: string;
  description: string;
}

interface AboutUsConfig {
  title?: string;
  subtitle?: string;
  leadParagraph?: string;
  missionHeading?: string;
  missionContent?: string;
  ownershipHeading?: string;
  ownershipContent?: string;
  valuesHeading?: string;
  valuesItems?: ValueItem[];
  historyHeading?: string;
  historyContent?: string;
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

export default function AboutPage() {
  const [config, setConfig] = useState<AboutUsConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAboutSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.aboutUs) {
            setConfig(data.aboutUs);
          }
        }
      } catch (err) {
        console.error('Failed to load about us settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAboutSettings();
  }, []);

  const title = config?.title || 'About Us';
  const subtitle = config?.subtitle || 'Independent, Truthful Journalism';
  const leadParagraph = config?.leadParagraph || 'Welcome to **Magazine Gazette**, an independent, employee-owned news publication dedicated to providing comprehensive coverage of national policies, international affairs, global markets, technology breakthroughs, and cultural trends.';
  
  const missionHeading = config?.missionHeading || 'Our Mission';
  const missionContent = config?.missionContent || 'At Magazine Gazette, we believe that access to clear, unbiased, and accurate news is a fundamental cornerstone of a free society. Our mission is to cut through the noise and deliver journalism characterized by integrity, clarity, and depth. We write for readers who want to understand not just what happened, but why it happened and what it means for the future.';
  
  const ownershipHeading = config?.ownershipHeading || 'Independent Ownership';
  const ownershipContent = config?.ownershipContent || 'As an employee-owned publication, our primary responsibility is to our readers—not to corporate conglomerates, hedge funds, or political entities. This independence guarantees our editorial team the freedom to cover critical stories objectively, hold institutions accountable, and pursue investigative reports without corporate or partisan pressure.';
  
  const valuesHeading = config?.valuesHeading || 'Our Values';
  const valuesItems = config?.valuesItems || [
    { title: 'Accuracy First', description: 'We check facts rigorously and verify all details before publishing.' },
    { title: 'Fairness and Objectivity', description: 'We strive to represent multiple viewpoints fairly and avoid sensationalism.' },
    { title: 'Transparency', description: 'We openly share our sources, methodologies, and corrections.' },
    { title: 'Accountability', description: 'We hold ourselves to the highest standards of professional ethics and responsibility.' }
  ];
  
  const historyHeading = config?.historyHeading || 'Our History';
  const historyContent = config?.historyContent || 'Established in 2026, Magazine Gazette was founded by a coalition of veteran journalists, designers, and developers who recognized the need for a modern, independent digital publication built on classical journalistic values. Since our inception, we have grown into a trusted news source read by thousands of people globally.';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        {/* <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" /> */}
      </div>
    );
  }

  return (
    <StaticPageLayout title={title} subtitle={subtitle}>
      <p className="font-serif text-lg text-slate-800 leading-relaxed mb-6 font-medium">
        {parseMarkdown(leadParagraph)}
      </p>
      
      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">{missionHeading}</h2>
      <p className="text-[15px] text-slate-600 leading-relaxed">
        {parseMarkdown(missionContent)}
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">{ownershipHeading}</h2>
      <p className="text-[15px] text-slate-600 leading-relaxed">
        {parseMarkdown(ownershipContent)}
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">{valuesHeading}</h2>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-slate-600 leading-relaxed">
        {valuesItems.map((item, idx) => (
          <li key={idx}>
            <strong className="font-bold text-slate-900">{item.title}:</strong> {item.description}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">{historyHeading}</h2>
      <p className="text-[15px] text-slate-600 leading-relaxed">
        {parseMarkdown(historyContent)}
      </p>
    </StaticPageLayout>
  );
}
