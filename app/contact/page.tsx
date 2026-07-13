'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';

interface Department {
  name: string;
  description: string;
  email: string;
}

interface ContactUsConfig {
  title?: string;
  subtitle?: string;
  introText?: string;
  deptHeading?: string;
  deptSubheading?: string;
  departments?: Department[];
}

export default function ContactPage() {
  const [config, setConfig] = useState<ContactUsConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContactSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.contactUs) {
            setConfig(data.contactUs);
          }
        }
      } catch (err) {
        console.error('Failed to load contact settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContactSettings();
  }, []);

  const title = config?.title || 'Contact Us';
  const subtitle = config?.subtitle || 'We believe that journalism should be a conversation, and we want to hear from you. Whether you have a question, feedback, or a story that needs to be told, our door is always open.';
  const introText = config?.introText || "Here's how to reach the right people on our team.";
  const deptHeading = config?.deptHeading || 'Department Contacts';
  const deptSubheading = config?.deptSubheading || 'To make sure your message gets to the right place quickly, please choose from the options below.';
  
  const departments = config?.departments || [
    {
      name: 'News Tips & Press Releases',
      description: 'Have a confidential tip or a story you think we should be covering? This is the best place to send it.',
      email: 'tips@domainname.com'
    },
    {
      name: 'To Report a Correction',
      description: 'If you believe one of our articles contains a factual error, please let our editors know. We take accuracy seriously.',
      email: 'corrections@domainname.com'
    },
    {
      name: 'General Questions & Feedback',
      description: 'Have a question about the site or want to share your thoughts on our work? We read everything.',
      email: 'contact@domainname.com'
    },
    {
      name: 'Advertising & Partnerships',
      description: 'If you\'re interested in advertising opportunities or other business partnerships, please contact our business desk.',
      email: 'partners@domainname.com'
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
    <StaticPageLayout title={title} subtitle="">
      <div className="space-y-8 py-2">
        
        {/* Page Subtitle Introduction sentence - Styled elegantly in serif italic */}
        <div className="pb-2">
          <p className="font-serif text-[18px] text-slate-700 leading-relaxed italic max-w-3xl m-0">
            {subtitle}
          </p>
        </div>

        {/* Departments Grid */}
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-extrabold text-slate-900 tracking-tight m-0">
              {deptHeading}
            </h2>
            <p className="text-[12px] text-slate-400 font-sans tracking-wide m-0">
              {deptSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 pt-4">
            {departments.map((item, idx) => (
              <div key={idx} className="space-y-2 border-b border-slate-100 pb-4">
                <h3 className="text-[15px] font-serif font-bold text-slate-900 m-0">
                  {item.name}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-500 font-sans m-0">
                  {item.description}
                </p>
                <div className="pt-0.5">
                  <a 
                    href={`mailto:${item.email}`} 
                    className="text-[13px] font-semibold text-slate-900 hover:text-black transition-colors duration-150 underline decoration-slate-200 hover:decoration-slate-800 underline-offset-4"
                  >
                    {item.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </StaticPageLayout>
  );
}
