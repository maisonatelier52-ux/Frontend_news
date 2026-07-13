import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { SiteSettingsModel } from '@/models/SiteSettings';

const DEFAULT_SETTINGS = {
  key: 'site_settings',
  theme: {
    mode: 'light',
    primaryColor: '#1e40af', // Brand Blue
    secondaryColor: '#0f172a', // Dark Slate
    accentColor: '#dc2626', // Crimson Alert
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    cardColor: '#ffffff',
    buttonColor: '#1e40af',
    buttonTextColor: '#ffffff',
    hoverColor: '#1d4ed8',
    linkColor: '#2563eb',
    borderRadius: '6px',
    containerWidth: '1280px',
    typography: {
      siteTitle: { font: 'Lora', size: '2.25rem', weight: '700', spacing: '-0.02em', height: '1.2' },
      logoText: { font: 'Lora', size: '2.5rem', weight: '800', spacing: '-0.03em', height: '1.1' },
      navigationMenu: { font: 'Geist', size: '0.875rem', weight: '600', spacing: '0em', height: '1.5' },
      categoryNavigation: { font: 'Geist', size: '0.875rem', weight: '500', spacing: '0em', height: '1.5' },
      categoryLabel: { font: 'Geist', size: '0.75rem', weight: '700', spacing: '0.05em', height: '1.2' },
      leadStoryCategory: { font: 'Geist', size: '0.75rem', weight: '700', spacing: '0.05em', height: '1.2' },
      leadStoryTitle: { font: 'Lora', size: '2rem', weight: '800', spacing: '-0.02em', height: '1.3' },
      leadStoryDescription: { font: 'Geist', size: '0.95rem', weight: '400', spacing: '0em', height: '1.6' },
      newsCardTitle: { font: 'Lora', size: '1.25rem', weight: '700', spacing: '-0.01em', height: '1.35' },
      newsCardDescription: { font: 'Geist', size: '0.875rem', weight: '400', spacing: '0em', height: '1.5' },
      sidebarTitles: { font: 'Lora', size: '1.125rem', weight: '700', spacing: '0em', height: '1.3' },
      widgetTitles: { font: 'Geist', size: '0.75rem', weight: '800', spacing: '0.06em', height: '1.2' },
      footerTitles: { font: 'Lora', size: '1.25rem', weight: '700', spacing: '0em', height: '1.4' },
      footerText: { font: 'Geist', size: '0.8125rem', weight: '400', spacing: '0em', height: '1.5' },
      detailPageTitle: { font: 'Lora', size: '2.5rem', weight: '800', spacing: '-0.02em', height: '1.2' },
      detailPageDescription: { font: 'Geist', size: '1.1rem', weight: '400', spacing: '0em', height: '1.6' },
      author: { font: 'Geist', size: '0.875rem', weight: '600', spacing: '0em', height: '1.4' },
      date: { font: 'Geist', size: '0.8125rem', weight: '400', spacing: '0em', height: '1.4' },
      breadcrumb: { font: 'Geist', size: '0.8125rem', weight: '400', spacing: '0em', height: '1.4' },
      relatedNews: { font: 'Lora', size: '1.125rem', weight: '700', spacing: '0.01em', height: '1.3' },
      tags: { font: 'Geist', size: '0.75rem', weight: '500', spacing: '0em', height: '1.2' },
      buttons: { font: 'Geist', size: '0.875rem', weight: '600', spacing: '0em', height: '1.5' }
    }
  },
  header: {
    layout: 'classic',
    sticky: true,
    announcementBar: true,
    announcementText: '🚨 Breaking: Landmark climate policies approved by world leaders.',
    breakingNewsTicker: true,
    searchBar: true,
    socialIcons: true,
    weatherWidget: true,
    languageSelector: true,
    dateTime: true,
    liveTvButton: true
  },
  footer: {
    layout: 'three-columns',
    columns: [
      {
        id: 1,
        heading: 'Company',
        links: [
          { id: 1, label: 'About Us', url: '/about' },
          { id: 2, label: 'Careers', url: '/careers' },
          { id: 3, label: 'Contact', url: '/contact' },
          { id: 4, label: 'Advertise', url: '/advertise' }
        ]
      },
      {
        id: 2,
        heading: 'News Rooms',
        links: [
          { id: 1, label: 'Politics', url: '/Politics' },
          { id: 2, label: 'Technology', url: '/Technology' },
          { id: 3, label: 'Business', url: '/Business' },
          { id: 4, label: 'World', url: '/World' }
        ]
      },
      {
        id: 3,
        heading: 'Policies & Help',
        links: [
          { id: 1, label: 'Privacy Policy', url: '/privacy' },
          { id: 2, label: 'Terms of Service', url: '/terms' },
          { id: 3, label: 'Ethics Guidelines', url: '/ethics' },
          { id: 4, label: 'Sitemap', url: '/sitemap.xml' }
        ]
      }
    ],
    socials: [
      { id: 1, platform: 'Twitter/X', icon: '𝕏', url: 'https://twitter.com/newssite' },
      { id: 2, platform: 'Facebook', icon: 'f', url: 'https://facebook.com/newssite' },
      { id: 3, platform: 'Instagram', icon: '📸', url: 'https://instagram.com/newssite' },
      { id: 4, platform: 'YouTube', icon: '▶', url: 'https://youtube.com/@newssite' }
    ],
    copyright: '© 2026 The Domain Name. All rights reserved.',
    address: 'An independent, employee-owned publication covering national policy, international affairs, global markets, technology, and arts. Headquartered in Washington, D.C.',
    phone: '',
    email: '',
    newsletter: false,
    logoText: 'The Domain Name',
    bgColor: '#ffffff',
    textColor: '#4b5563',
    paddingY: '40px',
    borderTopColor: '#e2e8f0'
  },
  navigation: {
    links: [
      { id: 1, label: 'Home', url: '/' },
      { id: 2, label: 'Politics', url: '/Politics' },
      { id: 3, label: 'Technology', url: '/Technology' },
      { id: 4, label: 'Business', url: '/Business' },
      { id: 5, label: 'World', url: '/World' },
      { id: 6, label: 'Sports', url: '/Sports' },
      { id: 7, label: 'Entertainment', url: '/Entertainment' }
    ]
  },
  seo: {
    globalTitle: 'The Domain Name | US & World News, Analysis & Opinion',
    metaDescription: 'Independent, in-depth journalism covering politics, business, technology, science, culture, and sports.',
    openGraphImage: '/images/og-default.jpg',
    twitterCard: 'summary_large_image',
    robotsText: 'User-agent: *\nDisallow: /admin\nAllow: /',
    sitemapEnabled: true,
    googleAnalytics: 'G-XXXXXXXXXX',
    articleSchema: true,
    breadcrumbSchema: true
  },
  security: {
    twoFactorEnabled: false,
    maxLoginAttempts: 5,
    sessionLimitMinutes: 60,
    ipWhitelist: ''
  },
  aboutUs: {
    title: 'About Us',
    subtitle: 'Independent, Truthful Journalism',
    leadParagraph: 'Welcome to **Domain Name**, an independent, employee-owned news publication dedicated to providing comprehensive coverage of national policies, international affairs, global markets, technology breakthroughs, and cultural trends.',
    missionHeading: 'Our Mission',
    missionContent: 'At Domain Name, we believe that access to clear, unbiased, and accurate news is a fundamental cornerstone of a free society. Our mission is to cut through the noise and deliver journalism characterized by integrity, clarity, and depth. We write for readers who want to understand not just what happened, but why it happened and what it means for the future.',
    ownershipHeading: 'Independent Ownership',
    ownershipContent: 'As an employee-owned publication, our primary responsibility is to our readers—not to corporate conglomerates, hedge funds, or political entities. This independence guarantees our editorial team the freedom to cover critical stories objectively, hold institutions accountable, and pursue investigative reports without corporate or partisan pressure.',
    valuesHeading: 'Our Values',
    valuesItems: [
      { title: 'Accuracy First', description: 'We check facts rigorously and verify all details before publishing.' },
      { title: 'Fairness and Objectivity', description: 'We strive to represent multiple viewpoints fairly and avoid sensationalism.' },
      { title: 'Transparency', description: 'We openly share our sources, methodologies, and corrections.' },
      { title: 'Accountability', description: 'We hold ourselves to the highest standards of professional ethics and responsibility.' }
    ],
    historyHeading: 'Our History',
    historyContent: 'Established in 2026, Domain Name was founded by a coalition of veteran journalists, designers, and developers who recognized the need for a modern, independent digital publication built on classical journalistic values. Since our inception, we have grown into a trusted news source read by thousands of people globally.'
  },
  contactUs: {
    title: 'Contact Us',
    subtitle: 'We believe that journalism should be a conversation, and we want to hear from you. Whether you have a question, feedback, or a story that needs to be told, our door is always open.',
    introText: "Here's how to reach the right people on our team.",
    deptHeading: 'Department Contacts',
    deptSubheading: 'To make sure your message gets to the right place quickly, please choose from the options below.',
    departments: [
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
    ]
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    subtitle: 'Last Updated: July 13, 2026',
    leadParagraph: 'At **Domain Name**, we take the privacy of our visitors and users very seriously. This policy describes how we collect, store, share, and protect your information when you interact with our websites and applications.',
    sections: [
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
    ]
  },
  termsAndConditions: {
    title: 'Terms and Conditions',
    subtitle: 'Last Updated: July 13, 2026',
    leadParagraph: 'Welcome to **Domain Name**. These terms and conditions outline the rules and regulations for the use of our website and services.',
    introParagraph: 'By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Domain Name if you do not agree to all of the terms and conditions stated on this page.',
    sections: [
      {
        heading: '1. Intellectual Property Rights',
        content: 'Unless otherwise stated, Domain Name and/or its licensors own the intellectual property rights for all material on this site. All intellectual property rights are reserved. You may view and/or print pages from the website for your own personal use, subject to restrictions set in these terms and conditions.\n\nYou must not:',
        listItems: [
          'Republish material from this site without explicit credits or permission.',
          'Sell, rent, or sub-license material from the website.',
          'Reproduce, duplicate, or copy content for commercial use.'
        ]
      },
      {
        heading: '2. User-Generated Comments',
        content: 'Certain parts of this website offer the opportunity for users to post opinions, feedback, and comments. Comments represent the views of the person who posts them, not of Domain Name. We reserve the right to monitor all comments and remove any which we consider inappropriate, offensive, or in breach of these terms.',
        listItems: []
      },
      {
        heading: '3. Linkage to Our Content',
        content: 'Publications, news agencies, and educational institutions may link to our home page or articles, provided that the link is not misleading, does not falsely imply sponsorship or endorsement, and fits within the context of the linking party’s site.',
        listItems: []
      },
      {
        heading: '4. Limitation of Liability',
        content: 'The materials on this website are provided "as is". While we strive for accuracy, Domain Name makes no warranties, expressed or implied, and hereby disclaims all other warranties, including without limitation, implied warranties or conditions of merchantability or fitness for a particular purpose.',
        listItems: []
      }
    ]
  },
  correctionPolicy: {
    title: 'Correction Policy',
    subtitle: 'Commitment to Accuracy and Integrity',
    leadParagraph: 'At **Domain Name**, our primary goal is to provide accurate, fair, and comprehensive coverage. However, when we make a mistake, we are committed to correcting the record promptly and transparently.',
    sections: [
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
    ]
  },
  sourceMethodology: {
    title: 'Source Methodology',
    subtitle: 'How we gather and verify information',
    leadParagraph: 'The credibility of **Domain Name** rests on the reliability of our sources. We utilize strict standards for finding, vetting, and attributing information to ensure our coverage remains objective and factual.',
    sections: [
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
    ]
  },
  advertisingPolicy: {
    title: 'Advertising & Sponsored Policy',
    subtitle: 'Separation of editorial and commercial activities',
    leadParagraph: 'At **Domain Name**, we value the trust of our readers. To maintain that trust, we enforce a strict separation between our newsroom and our commercial operations.',
    sections: [
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
    ]
  },
  ownershipFunding: {
    title: 'Ownership & Funding',
    subtitle: 'Editorial Independence through Transparent Revenue',
    leadParagraph: 'At **Domain Name**, we believe transparency about our owners and financial resources is critical to establishing trust with our readers.',
    sections: [
      {
        heading: 'Ownership Structure',
        content: 'Domain Name is owned and operated by an independent, employee-owned cooperative. This means our editors, writers, designers, and developers hold equity in the publication. Our board is elected democratically by staff, ensuring that our corporate structure aligns with our editorial mission to serve public interests, rather than private shareholders or venture capital funds.',
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
        content: 'We pledge to publish an annual transparency report summarizing our revenue distributions, staff compensation, and external funding sources. For specific investor relations, corporate inquiries, or grant partnership questions, please email **info@domainname.com**.',
        listItems: []
      }
    ]
  },
  rightOfReplyPolicy: {
    title: 'Right of Reply Policy',
    subtitle: 'Opportunity for fair response',
    leadParagraph: 'At **Domain Name**, we strive to be fair. In keeping with this principle, we recognize that individuals and organizations have a right of reply if they are the subject of critical or investigative reporting.',
    sections: [
      {
        heading: 'Our Standards for Fair Reporting',
        content: 'Before publishing articles that contain critical allegations, accusations of wrongdoing, or controversial statements about an individual or organization, our reporters make a good-faith effort to contact the subject and seek their comments. We allow a reasonable window of time for them to respond and explain their position, which we will represent fairly within the article.',
        listItems: []
      },
      {
        heading: 'Post-Publication Right of Reply',
        content: 'If an individual or organization is mentioned critically in a published story and was not contacted prior to publication, or has new facts to clarify the record, they may request a right of reply.\n\nTo submit a reply request:',
        listItems: [
          'Email the editorial team at **letters@domainname.com**.',
          'State the specific article title and URL.',
          'Outline the specific allegations you wish to reply to, and provide the facts supporting your response.'
        ]
      },
      {
        heading: 'Editorial Discretion',
        content: 'While we promise to review all requests and offer a fair platform for rebuttal (either by adding comments to the article, publishing a follow-up piece, or running a letter to the editor), we maintain ultimate editorial discretion over how the response is structured, in accordance with our news values and truth standards.',
        listItems: []
      }
    ]
  },
  legalPolicy: {
    title: 'Legal Policy',
    subtitle: 'Governing Laws and Disclaimers',
    leadParagraph: 'This document contains the legal disclosures and policy guidelines governing your use of the **Domain Name** website and digital services.',
    sections: [
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
    ]
  },
  ourTeam: {
    pageTitle: 'Our Team',
    pageSubtitle: 'The journalists behind Domain Name',
    pageIntro: 'Our newsroom is staffed by award-winning journalists, experienced analysts, and dedicated correspondents committed to local coverage and global perspectives. Meet the core members of the Domain Name editorial board.',
    latestArticlesHeading: 'Latest Articles',
    members: [
      {
        name: 'Sarah Johnson',
        role: 'Senior Political Correspondent',
        category: 'Politics',
        bio: 'Senior political correspondent with over a decade of experience covering Washington and international relations.',
        profileImage: '/authors/sarah-johnson.webp',
        visible: true
      },
      {
        name: 'Michael Chen',
        role: 'Technology Analyst',
        category: 'Technology',
        bio: 'Tech analyst, developer, and former software engineering lead covering artificial intelligence, Silicon Valley, and consumer tech.',
        profileImage: '/authors/michael-chen.webp',
        visible: true
      },
      {
        name: 'Emily Davis',
        role: 'Financial Journalist',
        category: 'Business',
        bio: 'Financial journalist reporting on corporate earnings, global markets, monetary policies, and entrepreneurship.',
        profileImage: '/authors/emily-davis.webp',
        visible: true
      },
      {
        name: 'Lisa Park',
        role: 'Sports Reporter',
        category: 'Sports',
        bio: 'Sports reporter and former college athlete covering major leagues, tournament championships, and athlete profiles.',
        profileImage: '/authors/lisa-park.webp',
        visible: true
      }
    ]
  }
};

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettingsModel.findOne({ key: 'site_settings' });
    
    if (!settings) {
      settings = await SiteSettingsModel.create(DEFAULT_SETTINGS);
    }
    
    return NextResponse.json(settings);
  } catch (err: any) {
    console.error('Fetch settings error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    let settings = await SiteSettingsModel.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = new SiteSettingsModel({ key: 'site_settings' });
    }

    if (body.theme) settings.theme = body.theme;
    if (body.header) settings.header = body.header;
    if (body.footer) settings.footer = body.footer;
    if (body.navigation) settings.navigation = body.navigation;
    if (body.seo) settings.seo = body.seo;
    if (body.security) settings.security = body.security;
    if (body.notifications) settings.notifications = body.notifications;
    if (body.aboutUs) settings.aboutUs = body.aboutUs;
    if (body.contactUs) settings.contactUs = body.contactUs;
    if (body.privacyPolicy) settings.privacyPolicy = body.privacyPolicy;
    if (body.termsAndConditions) settings.termsAndConditions = body.termsAndConditions;
    if (body.correctionPolicy) settings.correctionPolicy = body.correctionPolicy;
    if (body.sourceMethodology) settings.sourceMethodology = body.sourceMethodology;
    if (body.advertisingPolicy) settings.advertisingPolicy = body.advertisingPolicy;
    if (body.ownershipFunding) settings.ownershipFunding = body.ownershipFunding;
    if (body.rightOfReplyPolicy) settings.rightOfReplyPolicy = body.rightOfReplyPolicy;
    if (body.legalPolicy) settings.legalPolicy = body.legalPolicy;
    if (body.ourTeam) settings.ourTeam = body.ourTeam;

    await settings.save();
    return NextResponse.json(settings);
  } catch (err: any) {
    console.error('Update settings error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    await connectToDatabase();
    const settings = await SiteSettingsModel.findOneAndUpdate(
      { key: 'site_settings' },
      { $set: DEFAULT_SETTINGS },
      { upsert: true, new: true }
    );
    return NextResponse.json(settings);
  } catch (err: any) {
    console.error('Reset settings error:', err);
    return NextResponse.json({ error: err.message || 'Failed to reset settings' }, { status: 500 });
  }
}
