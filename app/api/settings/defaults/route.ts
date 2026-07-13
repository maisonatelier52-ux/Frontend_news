import { NextResponse } from 'next/server';

// Re-export the DEFAULT_SETTINGS from the settings route
// This is used by admin manager pages for "Reset to Original" functionality

const DEFAULT_ABOUT_US = {
  title: 'About Us',
  subtitle: 'Who We Are',
  leadParagraph: 'Domain Name is an independent digital news platform committed to delivering accurate, unbiased, and timely reporting across politics, business, technology, sports, and global affairs.',
  missionHeading: 'Our Mission',
  missionContent: 'Our mission is to provide trustworthy journalism that informs, empowers, and connects communities. We believe in the power of facts, the importance of context, and the value of diverse perspectives.',
  ownershipHeading: 'Independence & Ownership',
  ownershipContent: 'Domain Name operates independently and is not affiliated with any political party, corporation, or government entity. Our newsroom decisions are guided solely by journalistic integrity and public interest.',
  valuesHeading: 'Our Core Values',
  valuesItems: [
    { title: 'Accuracy', description: 'Every story undergoes rigorous fact-checking before publication.' },
    { title: 'Independence', description: 'Our editorial decisions are free from commercial or political influence.' },
    { title: 'Transparency', description: 'We are open about our sources, methods, and corrections.' },
    { title: 'Accountability', description: 'We hold power to account and correct our own mistakes promptly.' }
  ],
  historyHeading: 'Our History',
  historyContent: 'Founded in 2020, Domain Name began as a small team of journalists committed to filling gaps in local and national coverage. Since then, we have grown into a trusted platform serving readers across the globe.'
};

const DEFAULT_CONTACT_US = {
  title: 'Contact Us',
  subtitle: 'We Want to Hear From You',
  introText: 'Whether you have a story tip, a press inquiry, feedback on our coverage, or a general question — we are always open to hearing from our readers and the public.',
  deptHeading: 'Contact Our Departments',
  deptSubheading: 'Reach out to the right team for faster assistance.',
  departments: [
    { name: 'Editorial Team', description: 'For story tips, corrections, and general editorial inquiries.', email: 'editorial@domainname.com' },
    { name: 'Advertising', description: 'For ad placements, sponsorships, and commercial partnerships.', email: 'ads@domainname.com' },
    { name: 'Legal & Compliance', description: 'For legal notices, copyright issues, and compliance matters.', email: 'legal@domainname.com' },
    { name: 'Technical Support', description: 'For website issues, accessibility concerns, and technical bugs.', email: 'tech@domainname.com' }
  ]
};

const DEFAULT_PRIVACY_POLICY = {
  title: 'Privacy Policy',
  subtitle: 'How We Handle Your Data',
  leadParagraph: 'Your privacy matters to us. This policy explains what data we collect, how we use it, and what rights you have.',
  sections: [
    { heading: '1. Information We Collect', intro: 'We may collect the following types of information:', listItems: [{ title: 'Personal Information', description: 'Name, email address, and contact details when you register or subscribe.' }, { title: 'Usage Data', description: 'Pages visited, time spent, and navigation behavior through cookies and analytics tools.' }], body: '' },
    { heading: '2. How We Use Your Information', intro: '', listItems: [], body: 'We use collected information to deliver and improve our services, send newsletters, and analyze site performance. We do not sell your personal data to third parties.' },
    { heading: '3. Cookies', intro: '', listItems: [], body: 'We use cookies to enhance user experience, remember preferences, and gather analytics. You may disable cookies in your browser settings, though this may affect site functionality.' },
    { heading: '4. Your Rights', intro: 'Depending on your jurisdiction, you may have the right to:', listItems: [{ title: 'Access', description: 'Request a copy of your personal data.' }, { title: 'Correction', description: 'Request correction of inaccurate data.' }, { title: 'Deletion', description: 'Request deletion of your data.' }], body: '' },
    { heading: '5. Contact', intro: '', listItems: [], body: 'For privacy-related inquiries, please contact our Data Protection Officer at privacy@domainname.com.' }
  ]
};

const DEFAULT_TERMS = {
  title: 'Terms and Conditions',
  subtitle: 'Please Read Before Using Our Services',
  leadParagraph: 'By accessing or using Domain Name, you agree to be bound by these Terms and Conditions. Please read them carefully.',
  sections: [
    { heading: '1. Acceptance of Terms', content: 'By accessing this website, you confirm that you are at least 18 years of age and agree to comply with and be bound by these Terms and Conditions.', listItems: [] },
    { heading: '2. Intellectual Property', content: 'All content published on Domain Name — including articles, images, graphics, and multimedia — is the intellectual property of Domain Name or its respective content providers and is protected by applicable copyright law.', listItems: [] },
    { heading: '3. User Conduct', content: 'You agree not to use our platform for any unlawful, abusive, or harmful activities including but not limited to distributing spam, engaging in data scraping without permission, or attempting to breach our security systems.', listItems: [] },
    { heading: '4. Disclaimer of Warranties', content: 'Domain Name provides its services on an "as is" and "as available" basis without warranties of any kind. We do not guarantee the accuracy, completeness, or timeliness of any information published on our platform.', listItems: [] },
    { heading: '5. Limitation of Liability', content: 'To the fullest extent permitted by law, Domain Name shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or related to your use of the platform.', listItems: [] },
    { heading: '6. Changes to Terms', content: 'Domain Name reserves the right to modify these Terms and Conditions at any time. Continued use of the platform following any changes constitutes your acceptance of the revised terms.', listItems: [] }
  ]
};

const DEFAULT_CORRECTION_POLICY = {
  title: 'Correction Policy',
  subtitle: 'Our Commitment to Accuracy',
  leadParagraph: 'Domain Name is committed to publishing accurate, fair, and truthful journalism. When errors occur, we correct them promptly and transparently.',
  sections: [
    { heading: 'How We Handle Errors', content: 'All factual errors reported by readers or identified internally are reviewed by our editorial team within 24 hours. Confirmed errors are corrected in the original article with a visible correction notice.', listItems: [] },
    { heading: 'Types of Corrections', content: 'We distinguish between minor corrections (spelling, grammar) and substantive corrections (factual inaccuracies, misattributed quotes). Substantive corrections are clearly labeled at the top of the article.', listItems: [] },
    { heading: 'Reporting an Error', content: 'If you believe you have found an error in any of our published content, please contact our editorial desk at corrections@domainname.com with the article link and a description of the error.', listItems: [] }
  ]
};

const DEFAULT_SOURCE_METHODOLOGY = {
  title: 'Source & Methodology',
  subtitle: 'How We Report and Verify',
  leadParagraph: 'Transparency in sourcing and methodology is a cornerstone of credible journalism. This page explains how we gather, verify, and attribute information in our reporting.',
  sections: [
    { heading: 'Primary Sources', content: 'We prioritize primary sources including official documents, government data, court records, and direct interviews with parties involved in a story.', listItems: [] },
    { heading: 'Source Verification', content: 'All claims from sources are cross-checked with at least two independent sources before publication. Anonymous sources are only used when there is no viable alternative and when the information is deemed of significant public interest.', listItems: [] },
    { heading: 'Data & Statistics', content: 'Statistical data cited in our articles is sourced from recognized institutions such as government agencies, peer-reviewed publications, and established research organizations. We link to original data wherever possible.', listItems: [] },
    { heading: 'Corrections to Methodology', content: 'If our methodology is found to be flawed in a significant way, we will publish a note explaining the issue and how we corrected it.', listItems: [] }
  ]
};

const DEFAULT_ADVERTISING_POLICY = {
  title: 'Advertising & Sponsored Content Policy',
  subtitle: 'Our Standards for Advertising',
  leadParagraph: 'Domain Name accepts advertising and sponsored content under strict editorial guidelines to ensure our journalism remains independent and our readers\' trust is maintained.',
  sections: [
    { heading: 'Editorial Independence', content: 'Advertising relationships do not influence our editorial decisions. Advertisers have no input into story selection, framing, or publication timing.', listItems: [] },
    { heading: 'Sponsored Content Disclosure', content: 'Any content that has been paid for or sponsored is clearly labeled as "Sponsored Content," "Advertisement," or "Paid Partnership" at the top of the article or section.', listItems: [] },
    { heading: 'Ad Slots Booking', content: 'If you are interested in booking ad slots (such as our Header Banner, Sidebar slots, or custom placements), please contact our advertising desk at ads@domainname.com.', listItems: [] }
  ]
};

const DEFAULT_OWNERSHIP_FUNDING = {
  title: 'Ownership & Funding',
  subtitle: 'Transparency in Who We Are and How We Operate',
  leadParagraph: 'Domain Name is committed to full transparency regarding our ownership structure, funding sources, and financial relationships that could affect our journalism.',
  sections: [
    { heading: 'Ownership Structure', content: 'Domain Name is an independently owned digital media company. It is not affiliated with any political party, government entity, or large corporate conglomerate.', listItems: [] },
    { heading: 'Revenue Sources', content: 'Our primary sources of revenue include digital advertising, branded content partnerships, reader subscriptions, and event sponsorships. We do not accept funding that compromises editorial independence.', listItems: [] },
    { heading: 'Financial Disclosures', content: 'We pledge to publish an annual transparency report summarizing our revenue distributions, staff compensation, and external funding sources.', listItems: [] }
  ]
};

const DEFAULT_RIGHT_OF_REPLY = {
  title: 'Right of Reply Policy',
  subtitle: 'Your Right to Respond',
  leadParagraph: 'Domain Name upholds the journalistic principle that individuals, organizations, or groups directly referenced in our reporting have the right to provide a response.',
  sections: [
    { heading: 'Who Is Eligible', content: 'Any individual, company, or organization that is named in or directly affected by our reporting may submit a request for a right of reply.', listItems: [] },
    { heading: 'How to Submit a Reply', content: 'To submit a right of reply, please email reply@domainname.com with the article title, publication date, the specific claims you wish to address, and your response.', listItems: [] },
    { heading: 'Review Process', content: 'All right of reply submissions are reviewed by our editorial team within 5 business days. We reserve the right to edit submissions for length and clarity while preserving their essential meaning.', listItems: [] }
  ]
};

const DEFAULT_LEGAL_POLICY = {
  title: 'Legal Policy',
  subtitle: 'Terms, Disclaimers, and Legal Notices',
  leadParagraph: 'This legal policy governs your use of Domain Name and outlines our disclaimers, intellectual property rights, and governing jurisdiction.',
  sections: [
    { heading: '1. Copyright Notice', content: 'All content on Domain Name is protected by copyright law. Reproduction or distribution without written permission is prohibited.', listItems: [] },
    { heading: '2. Defamation & Libel', content: 'Domain Name is committed to responsible journalism. If you believe content published on our platform is defamatory, contact legal@domainname.com immediately.', listItems: [] },
    { heading: '3. Disclaimer of Endorsements', content: 'Reference to any commercial products, services, or trade names does not constitute endorsement by Domain Name.', listItems: [] },
    { heading: '4. Governing Law and Jurisdiction', content: 'Any disputes arising out of or in connection with the use of Domain Name shall be governed by the laws of the District of Columbia, United States.', listItems: [] }
  ]
};

const DEFAULT_OUR_TEAM = {
  pageTitle: 'Our Team',
  pageSubtitle: 'The journalists behind Domain Name',
  pageIntro: 'Our newsroom is staffed by award-winning journalists, experienced analysts, and dedicated correspondents committed to local coverage and global perspectives.',
  latestArticlesHeading: 'Latest Articles',
  members: [
    { name: 'Sarah Johnson', role: 'Senior Political Correspondent', category: 'Politics', bio: 'Senior political correspondent with over a decade of experience covering Washington and international relations.', profileImage: '/authors/sarah-johnson.webp', visible: true },
    { name: 'Michael Chen', role: 'Technology Analyst', category: 'Technology', bio: 'Tech analyst, developer, and former software engineering lead covering artificial intelligence, Silicon Valley, and consumer tech.', profileImage: '/authors/michael-chen.webp', visible: true },
    { name: 'Emily Davis', role: 'Financial Journalist', category: 'Business', bio: 'Financial journalist reporting on corporate earnings, global markets, monetary policies, and entrepreneurship.', profileImage: '/authors/emily-davis.webp', visible: true },
    { name: 'Lisa Park', role: 'Sports Reporter', category: 'Sports', bio: 'Sports reporter and former college athlete covering major leagues, tournament championships, and athlete profiles.', profileImage: '/authors/lisa-park.webp', visible: true }
  ]
};

export const DEFAULTS: Record<string, unknown> = {
  aboutUs: DEFAULT_ABOUT_US,
  contactUs: DEFAULT_CONTACT_US,
  privacyPolicy: DEFAULT_PRIVACY_POLICY,
  termsAndConditions: DEFAULT_TERMS,
  correctionPolicy: DEFAULT_CORRECTION_POLICY,
  sourceMethodology: DEFAULT_SOURCE_METHODOLOGY,
  advertisingPolicy: DEFAULT_ADVERTISING_POLICY,
  ownershipFunding: DEFAULT_OWNERSHIP_FUNDING,
  rightOfReplyPolicy: DEFAULT_RIGHT_OF_REPLY,
  legalPolicy: DEFAULT_LEGAL_POLICY,
  ourTeam: DEFAULT_OUR_TEAM,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (key && DEFAULTS[key] !== undefined) {
    return Response.json({ [key]: DEFAULTS[key] });
  }
  return Response.json(DEFAULTS);
}
