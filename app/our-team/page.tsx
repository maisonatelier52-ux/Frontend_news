'use client';

import React, { useState, useEffect } from 'react';
import StaticPageLayout from '@/app/components/StaticPageLayout';
import Link from 'next/link';

interface TeamMember {
  name: string;
  slug?: string;
  role: string;
  category: string;
  bio: string;
  profileImage: string;
  visible: boolean;
}

function nameToSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const categoryColors: Record<string, string> = {
  Politics: '#3b82f6',
  Technology: '#8b5cf6',
  Business: '#f59e0b',
  World: '#10b981',
  Sports: '#ef4444',
  Entertainment: '#ec4899',
  Science: '#06b6d4',
  Health: '#84cc16',
};

export default function OurTeamPage() {
  const [pageTitle, setPageTitle] = useState('Our Team');
  const [pageSubtitle, setPageSubtitle] = useState('The journalists behind Magazine Gazette');
  const [pageIntro, setPageIntro] = useState('Our newsroom is staffed by award-winning journalists, experienced analysts, and dedicated correspondents committed to local coverage and global perspectives. Meet the core members of the Magazine Gazette editorial board.');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.ourTeam) {
            const t = data.ourTeam;
            if (t.pageTitle) setPageTitle(t.pageTitle);
            if (t.pageSubtitle) setPageSubtitle(t.pageSubtitle);
            if (t.pageIntro) setPageIntro(t.pageIntro);
            if (t.members) setMembers(t.members);
          }
        }
      } catch (err) {
        console.error('Failed to load team settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  const visibleMembers = members.filter(m => m.visible);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        {/* <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" /> */}
      </div>
    );
  }

  return (
    <StaticPageLayout title={pageTitle} subtitle={pageSubtitle}>
      <p className="font-serif text-lg text-slate-800 leading-relaxed font-medium mb-10">
        {pageIntro}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {visibleMembers.map((member, idx) => (
          <div key={idx} className="flex gap-4 items-start bg-slate-50 border border-slate-150 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-200 transition-all">
            <div className="w-14 h-14 rounded-full bg-[#1e1b4b] text-white flex items-center justify-center font-bold text-xl uppercase shrink-0 overflow-hidden">
              {member.profileImage && !imgErrors[idx] ? (
                <img
                  src={member.profileImage}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
                />
              ) : (
                member.name.charAt(0)
              )}
            </div>
            <div className="space-y-1.5 min-w-0 flex-grow">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                <span
                  className="text-[10.5px] font-bold uppercase font-sans tracking-wide block"
                  style={{ color: categoryColors[member.category] || '#1e40af' }}
                >
                  {member.category}{member.role ? ` · ${member.role}` : ''}
                </span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-slate-500 font-sans">
                {member.bio}
              </p>
              <Link
                href={`/author/${member.slug || nameToSlug(member.name)}`}
                className="inline-flex items-center gap-1 text-[11.5px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
              >
                View Profile
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        ))}

        {visibleMembers.length === 0 && (
          <div className="col-span-2 text-center text-slate-400 py-12 text-sm italic">
            Team members will appear here once added from the admin panel.
          </div>
        )}
      </div>
    </StaticPageLayout>
  );
}
