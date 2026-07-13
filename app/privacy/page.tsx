'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface ListItem {
  title: string;
  description: string;
}

interface PrivacySection {
  heading: string;
  intro?: string;
  listItems?: ListItem[];
  body?: string;
}

interface PrivacyPolicyConfig {
  title?: string;
  subtitle?: string;
  leadParagraph?: string;
  sections?: PrivacySection[];
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

export default function PrivacyPage() {
  const [config, setConfig] = useState<PrivacyPolicyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrivacySettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.privacyPolicy) {
            setConfig(data.privacyPolicy);
          }
        }
      } catch (err) {
        console.error('Failed to load privacy settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrivacySettings();
  }, []);

  const title = config?.title || 'Privacy Policy';
  const subtitle = config?.subtitle || 'Last Updated: July 13, 2026';
  const leadParagraph = config?.leadParagraph || 'At **Domain Name**, we take the privacy of our visitors and users very seriously. This policy describes how we collect, store, share, and protect your information when you interact with our websites and applications.';
  
  const sections = config?.sections || [
    {
      heading: '1. Information We Collect',
      intro: 'When you browse our news portal or sign up for newsletters, we gather details to provide a better browsing experience:',
      listItems: [
        { title: 'Visitor Analytics Logs', description: 'We log standard visitor access parameters including IP address, geographic location, URL path, referrer site, and browser user agent to compute site statistics.' },
        { title: 'Subscription Information', description: 'If you subscribe to our newsletter or premium updates, we store your email address safely in our database.' },
        { title: 'Interaction Details', description: 'If you leave comments on articles, we store your name, email, and the comment text.' }
      ],
      body: ''
    },
    {
      heading: '2. How We Use Information',
      intro: '',
      listItems: [],
      body: 'We use the collected logs to analyze server workloads, calculate popular categories, compile general traffic map trends, and secure our systems. If you sign up for newsletter features, we use your email to send updates. We do not sell your personal information.'
    },
    {
      heading: '3. Cookies and Tracking Tech',
      intro: '',
      listItems: [],
      body: 'We use temporary cookies to track visitor sessions, maintain user bookmarks locally, and save user settings (such as dark mode preferences). You can disable cookies in your browser settings, though some layout functions might require cookies to work properly.'
    },
    {
      heading: '4. Information Security',
      intro: '',
      listItems: [],
      body: 'We implement robust security measures to protect stored information. Database storage is protected via TLS certificates, secure authentication tokens, and strict access controls. No transmission method over the internet is 100% secure, and we cannot guarantee complete security, but we follow standard industry practices.'
    },
    {
      heading: '5. Your Data Rights',
      intro: '',
      listItems: [],
      body: 'Depending on your jurisdiction (such as under the GDPR or CCPA), you may have the right to inspect, edit, or delete the personal details we hold about you. For any such data requests, please write to our Data Privacy Desk at **info@domainname.com**.'
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
          
          {sec.intro && (
            <p className="text-[15px] text-slate-600 leading-relaxed">
              {parseMarkdown(sec.intro)}
            </p>
          )}

          {sec.listItems && sec.listItems.length > 0 && (
            <ul className="list-disc pl-5 space-y-2 text-slate-600 text-[15px] leading-relaxed">
              {sec.listItems.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <strong className="font-bold text-slate-900">{item.title}:</strong> {item.description}
                </li>
              ))}
            </ul>
          )}

          {sec.body && (
            <p className="text-[15px] text-slate-600 leading-relaxed">
              {parseMarkdown(sec.body)}
            </p>
          )}
        </div>
      ))}
    </StaticPageLayout>
  );
}
