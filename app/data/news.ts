import entertainmentData from "../../public/data/entertainment.json";
import financeData from "../../public/data/finance.json";
import marketingData from "../../public/data/marketing.json";
import prnewsData from "../../public/data/prnews.json";
import technologyData from "../../public/data/technology.json";
import usData from "../../public/data/us.json";
import worldData from "../../public/data/world.json";

export interface Article {
  id: string;
  slug: string;
  alternateSlugs?: string[];
  title: string;
  excerpt: string;
  content: string[];
  blocks?: any[];
  category: string;
  author: string;
  authorTitle: string;
  authorData?: {
    name: string;
    role?: string;
    bio?: string;
    email?: string;
    image?: string;
    slug?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    substack?: string;
    medium?: string;
  };
  date: string;
  readTime: string;
  image: string;
  imageAltText?: string;
  seoTitle?: string;
  seoMetaDescription?: string;
  keywords?: string;
  tags?: string;
  isLead?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  isOpinion?: boolean;
  commentsCount: number;
}

// Deterministic comments count based on string to prevent hydration mismatches
function getDeterministicComments(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 25) + 3;
}

// Helper to clean and parse date strings like "June. 24, 2026"
function parseDate(dateStr: string): Date {
  const cleaned = (dateStr || "").replace(/\./g, "");
  const parsed = Date.parse(cleaned);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }
  return new Date(0);
}

// Helper to map category identifiers to capitalized display names
const mapCategory = (cat: string): string => {
  const mapping: Record<string, string> = {
    us: "US",
    world: "World",
    finance: "Finance",
    technology: "Technology",
    entertainment: "Entertainment",
    marketing: "Marketing",
    prnews: "PR News",
    politics: "Politics",
    business: "Business",
    lifestyle: "Lifestyle",
    opinion: "Opinion",
    investigation: "Investigation",
  };
  return mapping[(cat || "").toLowerCase()] || cat;
};

// Convert plain description text (including optional ### headings) into structured blocks
function descriptionToBlocks(description: string, fallbackExcerpt: string): any[] {
  const raw = description || fallbackExcerpt || "";
  const chunks = raw
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    return [{ id: "b-0", type: "paragraph", value: fallbackExcerpt || "" }];
  }

  const blocks: any[] = [];
  chunks.forEach((chunk, idx) => {
    if (chunk.startsWith("### ") || chunk.startsWith("#### ")) {
      const lines = chunk.split("\n");
      const headingLine = lines[0].replace(/^#+\s*/, "").trim();
      blocks.push({
        id: `b-h-${idx}`,
        type: "subheading",
        value: headingLine,
      });
      const rest = lines.slice(1).join("\n").trim();
      if (rest) {
        blocks.push({
          id: `b-p-${idx}`,
          type: "paragraph",
          value: rest,
        });
      }
    } else {
      blocks.push({
        id: `b-p-${idx}`,
        type: "paragraph",
        value: chunk,
      });
    }
  });

  return blocks;
}

const IRAN_DEPORTATION_BLOCKS = [
  {
    id: "b-p1",
    type: "paragraph",
    value:
      "A planned deportation flight that would have removed a group of Iranian nationals from the United States was abruptly cancelled at the final hour after attorneys intervened, according to legal representatives who say their clients were given no warning and were already aboard or en route to the aircraft. The dramatic last-minute halt has drawn fresh attention to the Trump administration's aggressive immigration enforcement posture and reignited legal battles over whether Iranians facing removal are receiving adequate due process protections given the absence of diplomatic relations between Washington and Tehran.",
  },
  {
    id: "b-h2",
    type: "subheading",
    value: "Emergency Court Intervention Halts the Flight",
  },
  {
    id: "b-p2",
    type: "paragraph",
    value:
      "According to attorneys involved in the case, their clients — some of whom had lived in the United States for years — were picked up by Immigration and Customs Enforcement (ICE) agents in coordinated raids and transported to staging facilities in preparation for deportation. Legal representatives say they were given little to no advance notice of the removal plans and scrambled to file emergency motions in federal court to prevent what they described as unlawful deportations. The intervention succeeded in halting the flight, but attorneys warn the reprieves may be temporary as federal immigration authorities continue to pursue removal orders aggressively.",
  },
  {
    id: "b-h3",
    type: "subheading",
    value: "No Deportation Treaty and Diplomatic Void Complicate Removals",
  },
  {
    id: "b-p3",
    type: "paragraph",
    value:
      "The episode comes amid heightened diplomatic tensions between the United States and Iran, with the two countries lacking formal diplomatic ties and no active repatriation agreement in place. Critics and legal experts argue that deporting individuals to a country with which the U.S. has no bilateral deportation treaty and where returnees may face serious human rights risks raises profound legal and ethical questions. Human rights organizations have documented cases of Iranian nationals who faced imprisonment, persecution, or other serious harm upon return to Iran, particularly those who are perceived as politically dissident.",
  },
  {
    id: "b-h4",
    type: "subheading",
    value: "Third-Country Routes and Transparency Concerns",
  },
  {
    id: "b-p4",
    type: "paragraph",
    value:
      "Immigration attorneys said they believe the administration has been attempting to use third-country deportation routes — sending individuals to intermediary nations before onward transfer to Iran — in order to circumvent legal challenges. This approach, lawyers argue, lacks transparency and further limits the ability of detainees and their representatives to mount timely legal challenges. Several advocacy groups have filed federal lawsuits seeking broader injunctions to protect Iranian nationals from expedited removal while legal proceedings are pending.",
  },
  {
    id: "b-h5",
    type: "subheading",
    value: "Administration Defends Enforcement as Lawful and Necessary",
  },
  {
    id: "b-p5",
    type: "paragraph",
    value:
      "The White House and Department of Homeland Security have not publicly confirmed the specifics of the cancelled flight but have consistently maintained that the administration is committed to enforcing immigration laws and removing individuals without legal status to their home countries. DHS officials have argued that deportation flights are a lawful and necessary enforcement tool. The administration has also framed its hardline immigration enforcement as essential to national security, often citing Iran's designation as a state sponsor of terrorism as justification for prioritizing the removal of Iranian nationals.",
  },
  {
    id: "b-h6",
    type: "subheading",
    value: "Federal Courts Step In to Protect Detainees",
  },
  {
    id: "b-p6",
    type: "paragraph",
    value:
      "Federal judges in multiple jurisdictions have issued temporary restraining orders and emergency stays blocking deportations in several related cases, responding to arguments from attorneys who contend that their clients face credible risks of persecution. Courts have scrutinized whether individuals are being given sufficient opportunity to apply for asylum, withholding of removal, or protection under the Convention Against Torture before being placed on deportation flights. Legal advocates emphasize that constitutional due process guarantees apply to all individuals in U.S. custody regardless of immigration status or nationality.",
  },
  {
    id: "b-h7",
    type: "subheading",
    value: "Iranian American Communities Express Fear and Outrage",
  },
  {
    id: "b-p7",
    type: "paragraph",
    value:
      "Community organizations serving Iranian American communities across the country have expressed alarm at the escalating pace of enforcement actions. Representatives say their members are living in fear and uncertainty, with some individuals who have green cards or pending legal applications also caught up in enforcement sweeps. They argue that broad enforcement operations are creating a climate of terror that extends beyond those with final removal orders and threatens the safety of an entire diaspora community that has contributed significantly to American society.",
  },
  {
    id: "b-h8",
    type: "subheading",
    value: "Broader Geopolitical Implications",
  },
  {
    id: "b-p8",
    type: "paragraph",
    value:
      "With no functioning U.S. embassy in Iran and Iranian assets frozen under decades of sanctions, the mechanics of large-scale deportations to Iran are inherently complicated. Iran has historically been reluctant to accept deportees from the United States, and negotiations over third-country transit arrangements have faced significant obstacles. Some analysts suggest that high-profile deportation efforts may be partly symbolic — intended to signal toughness on immigration enforcement — but warn that the humanitarian and legal consequences for the individuals involved are very real. As legal battles continue, families and attorneys say the uncertainty is devastating for communities with deep roots in the United States.",
  },
];

// Combine all imports into a single flat list
const rawDataList = [
  ...usData.map((item) => ({ ...item, sourceCategory: "US" })),
  ...worldData.map((item) => ({ ...item, sourceCategory: "World" })),
  ...financeData.map((item) => ({ ...item, sourceCategory: "Finance" })),
  ...technologyData.map((item) => ({ ...item, sourceCategory: "Technology" })),
  ...entertainmentData.map((item) => ({ ...item, sourceCategory: "Entertainment" })),
  ...marketingData.map((item) => ({ ...item, sourceCategory: "Marketing" })),
  ...prnewsData.map((item) => ({ ...item, sourceCategory: "PR News" })),
];

// Map raw JSON to Article type
export const NEWS_ARTICLES: Article[] = rawDataList
  .map((item: any, index) => {
    const categoryName = mapCategory(item.category || item.sourceCategory);
    const titleSlug =
      item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `article-${index + 1}`;
    const canonicalSlug = titleSlug;
    const alternateSlugs =
      item.slug && item.slug !== canonicalSlug ? [item.slug] : [];

    // Split the description into paragraphs by newlines, or use it as single paragraph
    const contentParagraphs = item.description
      ? item.description
          .split("\n\n")
          .map((p: string) => p.trim())
          .filter((p: string) => p !== "")
      : [item.shortdescription];

    const isIranDeportation =
      canonicalSlug ===
        "deportation-flight-of-iranians-from-us-scuttled-at-last-minute-attorney-says" ||
      item.slug === "deportation-flight-iranians-us-scuttled-last-minute-attorney";

    const isTrumpQatariIran =
      canonicalSlug ===
        "trump-declares-conflict-with-iran-is-militarily-effectively-over-following-high-level-talks-with-qatari-prime-minister" ||
      item.slug ===
        "trump-declares-conflict-with-iran-is-militarily-effectively-over-following-high-level-talks-with-qatari-prime-minister";

    const blocks = isIranDeportation
      ? IRAN_DEPORTATION_BLOCKS
      : descriptionToBlocks(item.description, item.shortdescription);

    return {
      id: String(index + 1),
      slug: canonicalSlug,
      alternateSlugs: isIranDeportation
        ? [
            "deportation-flight-iranians-us-scuttled-last-minute-attorney",
            "deportation-flight-of-iranians-from-us-scuttled-at-last-minute-attorney-says",
          ]
        : isTrumpQatariIran
          ? [
              "trump-after-meeting-with-qatari-pm-says-he-believes-war-with-iran-is-militarily-effectively-over",
              "trump-qatari-pm-iran-war-militarily-effectively-over",
              "trump-declares-conflict-with-iran-is-militarily-effectively-over-following-high-level-talks-with-qatari-prime-minister",
            ]
          : alternateSlugs,
      title: item.title,
      excerpt: item.shortdescription || item.description || "",
      content: contentParagraphs,
      blocks,
      category: categoryName,
      author: item.author?.name || "Staff Reporter",
      authorTitle: item.author?.role || "Editorial Desk",
      authorData: item.author
        ? {
            name: item.author.name || "Staff Reporter",
            role: item.author.role || "Editorial Desk",
            bio: item.author.bio || "",
            image:
              item.author.name === "Sarah Johnson"
                ? "https://res.cloudinary.com/dcj2ovntc/image/upload/v1785752147/magazinegazette/sarah-johnson.webp"
                : item.author.image || "",
            slug: item.author.slug || "",
            email: item.author.email || "",
            twitter: item.author.twitter || "",
            facebook: item.author.facebook || "",
            instagram: item.author.instagram || "",
            substack: item.author.substack || "",
            medium: item.author.medium || "",
          }
        : undefined,
      date: item.date,
      readTime:
        Math.max(1, Math.round((item.description || "").split(" ").length / 220)) +
        " min read",
      image: item.image,
      isLead: isTrumpQatariIran,
      isBreaking: isTrumpQatariIran || isIranDeportation,
      isTrending: isTrumpQatariIran || isIranDeportation,
      commentsCount: getDeterministicComments(canonicalSlug),
    };
  })
  // Sort from latest to oldest based on date field
  .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

export const TRUMP_SOCIAL_MEDIA_STATIC_ARTICLE: Article = {
  id: "6aec297dc734c12dc106e9a6",
  slug: "trump-admin-social-media-posts-election-criticized-inflammatory",
  alternateSlugs: [
    "trump-administrations-social-media-posts-ahead-of-elections-criticized-for-being-inflammatory",
  ],
  title:
    "Trump Administration's Social Media Posts Ahead of Elections Criticized for Being Inflammatory",
  excerpt:
    "Critics and watchdog groups have raised alarm over a series of social media posts by Trump administration officials in the lead-up to elections, calling the messaging divisive, misleading, and an abuse of government platforms to influence voters.",
  content: [
    "In the weeks and days leading up to the November elections, a wave of social media posts from Trump administration officials and affiliated government accounts has sparked intense criticism from political analysts, civil society organizations, and opposition lawmakers. Critics argue that the content — ranging from unverified claims about voter fraud to pointed attacks on Democratic candidates — crosses ethical and legal lines separating government communication from partisan electioneering.",
    "Watchdog groups tracking social media activity from federal officials say the administration has ramped up the frequency and intensity of its posts in the final stretch before Election Day. Posts shared on platforms including X (formerly Twitter), Truth Social, and Facebook have included unsubstantiated allegations of ballot-rigging, fear-based rhetoric targeting immigrant communities, and direct calls to action urging supporters to 'fight back' against what officials described as a 'rigged system.'",
    "Democratic leaders and several nonpartisan civic organizations have formally called on the Office of Special Counsel (OSC) to investigate the posts and hold officials accountable.",
    "White House communications staff pushed back against the criticism, defending the social media activity as lawful political expression protected under the First Amendment.",
  ],
  blocks: [
    {
      id: "b-p1",
      type: "paragraph",
      value:
        "In the weeks and days leading up to the November elections, a wave of social media posts from Trump administration officials and affiliated government accounts has sparked intense criticism from political analysts, civil society organizations, and opposition lawmakers. Critics argue that the content — ranging from unverified claims about voter fraud to pointed attacks on Democratic candidates — crosses ethical and legal lines separating government communication from partisan electioneering.",
    },
    {
      id: "b-h2",
      type: "subheading",
      value: "A Pattern of Divisive Messaging",
    },
    {
      id: "b-p2",
      type: "paragraph",
      value:
        "Watchdog groups tracking social media activity from federal officials say the administration has ramped up the frequency and intensity of its posts in the final stretch before Election Day. Posts shared on platforms including X (formerly Twitter), Truth Social, and Facebook have included unsubstantiated allegations of ballot-rigging, fear-based rhetoric targeting immigrant communities, and direct calls to action urging supporters to 'fight back' against what officials described as a 'rigged system.' Experts in election law say some of these posts may violate the Hatch Act, which restricts federal employees from engaging in partisan political activity while on duty or using government resources.",
    },
    {
      id: "b-h3",
      type: "subheading",
      value: "Opposition and Civic Groups Sound the Alarm",
    },
    {
      id: "b-p3",
      type: "paragraph",
      value:
        "Democratic leaders and several nonpartisan civic organizations have formally called on the Office of Special Counsel (OSC) to investigate the posts and hold officials accountable. Senate Minority Leader and House Democrats issued a joint statement condemning the messaging as 'deliberate attempts to stoke fear, undermine confidence in democratic institutions, and suppress voter participation through intimidation.' The American Civil Liberties Union (ACLU) separately warned that certain posts could have a chilling effect on minority voters who already face systemic barriers to civic participation.",
    },
    {
      id: "b-h4",
      type: "subheading",
      value: "Administration Defends Posts as 'Protected Political Speech'",
    },
    {
      id: "b-p4",
      type: "paragraph",
      value:
        "White House communications staff pushed back against the criticism, defending the social media activity as lawful political expression protected under the First Amendment. Spokespersons argued that the posts reflected the administration's duty to inform Americans about alleged threats to election integrity and that characterizing factual concerns as 'inflammatory' was itself a form of political bias. The administration maintained that all officials were acting within their personal capacities and not in their official government roles when making such posts — a distinction critics have rejected as thin and implausible given the use of verified government-affiliated accounts.",
    },
    {
      id: "b-h5",
      type: "subheading",
      value: "Election Experts Warn of Real-World Consequences",
    },
    {
      id: "b-p5",
      type: "paragraph",
      value:
        "Political scientists and election security researchers have warned that inflammatory rhetoric from high-profile government officials carries disproportionate weight compared to ordinary partisan speech. Studies have shown that statements from authority figures can amplify misinformation rapidly, discourage voter turnout, and in some cases inspire confrontation at polling places. Election administrators in several battleground states have already reported increased threats and harassment in what officials say is a climate of heightened tension. Security protocols at key polling locations have been elevated in response to credible threat reports.",
    },
    {
      id: "b-h6",
      type: "subheading",
      value: "Social Media Platforms Face Pressure to Act",
    },
    {
      id: "b-p6",
      type: "paragraph",
      value:
        "Major social media platforms are under renewed scrutiny over their handling of inflammatory election-related content from public officials. Under Elon Musk's ownership, X has significantly relaxed its content moderation policies, allowing posts that previously would have been labeled or removed to remain visible. Meta has similarly faced criticism for inconsistent enforcement of its election integrity policies. Digital rights advocates argue that platforms bear a responsibility to apply their community standards uniformly regardless of a user's political affiliation or government status. As of publication, several posts from administration-affiliated accounts remained live and had accumulated millions of views and thousands of reshares.",
    },
    {
      id: "b-h7",
      type: "subheading",
      value: "Historical Context: Social Media and American Elections",
    },
    {
      id: "b-p7",
      type: "paragraph",
      value:
        "The controversy is not without precedent. The Trump administration faced similar criticism during the 2020 election cycle, when officials used social media aggressively to cast doubt on mail-in voting and promote unverified claims of electoral fraud. Those efforts culminated in the events of January 6, 2021, which many analysts directly tied to the sustained online misinformation campaign. The current pre-election period has reignited fears that history may repeat itself, with critics urging federal agencies, the courts, and civil society to draw clearer boundaries around the use of digital platforms in electoral politics.",
    },
    {
      id: "b-h8",
      type: "subheading",
      value: "Calls for Greater Accountability",
    },
    {
      id: "b-p8",
      type: "paragraph",
      value:
        "Legal scholars and former government ethics officials have called for a comprehensive review of how the Hatch Act and related statutes are applied in the digital age. Many note that existing rules were written before social media existed and have struggled to keep pace with the speed and reach of modern political communication. Proposals include clearer guidelines on what constitutes partisan political activity online, mandatory disclosures when government officials use personal accounts to discuss election-related matters, and stronger enforcement mechanisms for violations. As Election Day approaches, the debate over the administration's social media conduct underscores deeper tensions between free speech, government accountability, and the health of American democracy.",
    },
  ],
  category: "Politics",
  author: "Sarah Johnson",
  authorTitle: "Senior Political & Global Affairs Correspondent",
  authorData: {
    name: "Sarah Johnson",
    role: "Senior Political & Global Affairs Correspondent",
    bio: "Senior political correspondent with over a decade of experience covering Washington and international relations.",
    image:
      "https://res.cloudinary.com/dcj2ovntc/image/upload/v1785752147/magazinegazette/sarah-johnson.webp",
    slug: "sarah-johnson",
    email: "sarah@newssite.com",
  },
  date: "November 5, 2026",
  readTime: "6 min read",
  image:
    "https://res.cloudinary.com/dcj2ovntc/image/upload/v1793862011/magazinegazette/trump-admin-social-media-election-inflammatory-posts.jpg",
  imageAltText:
    "Trump administration official speaking at a press briefing ahead of elections",
  seoTitle:
    "Trump Administration Social Media Posts Ahead of Elections Criticized for Being Inflammatory",
  seoMetaDescription:
    "Critics and watchdog groups raise alarm over Trump administration social media posts before elections, citing divisive rhetoric, Hatch Act concerns, and threats to election integrity.",
  keywords:
    "Trump, social media, elections, inflammatory, Hatch Act, election integrity, voter fraud, misinformation",
  tags: "Trump Administration, Social Media, Elections, Politics, Hatch Act, Election Integrity",
  isLead: false,
  isBreaking: true,
  isTrending: false,
  commentsCount: 19,
};

export const US_FUTURES_STATIC_ARTICLE: Article = {
  id: "6ae5c2019c4b110012a34b01",
  slug: "us-futures-fall-amazon-intel-alphabet-weigh-wall-street",
  title:
    "US Futures Fall as Amazon, Intel and Alphabet Weigh on Wall Street",
  excerpt:
    "Wall Street futures tumbled in pre-market trade as disappointing guidance from Amazon, soaring AI expenditures at Alphabet, and steep foundry losses at Intel triggered a sell-off across mega-cap technology shares.",
  content: [
    "U.S. stock index futures dropped sharply in early morning trade on Friday, as underwhelming forward guidance and escalating capital expenditures from market stalwarts Amazon, Alphabet, and Intel soured investor sentiment across Wall Street. Futures tied to the tech-heavy Nasdaq 100 retreated 1.2%, while S&P 500 futures fell 0.8% and Dow Jones Industrial Average futures shed over 190 points.",
    "The retreat follows a record-breaking streak earlier in the month, underscoring growing vulnerability among mega-cap technology firms whose stratospheric valuations leave razor-thin margins for error.",
    "Amazon shares sank more than 5% in pre-market dealings after the e-commerce and cloud computing giant delivered a cautious holiday-quarter operating profit forecast.",
    "Alphabet also faced intense downward pressure, shedding 3.4% as investors parsed the Google parent company’s surging capital expenditure forecast.",
    "Semiconductor pioneer Intel bore the brunt of the pre-bell sell-off, tumbling over 7% following quarterly metrics that highlighted lingering headwinds in its contract manufacturing division.",
  ],
  blocks: [
    {
      id: "block-uf-1",
      type: "subheading",
      value: "Tech Mega-Caps Drag Pre-Market Futures Lower",
    },
    {
      id: "block-uf-2",
      type: "paragraph",
      value:
        "U.S. stock index futures dropped sharply in early morning trade on Friday, as underwhelming forward guidance and escalating capital expenditures from market stalwarts Amazon, Alphabet, and Intel soured investor sentiment across Wall Street. Futures tied to the tech-heavy Nasdaq 100 retreated 1.2%, while S&P 500 futures fell 0.8% and Dow Jones Industrial Average futures shed over 190 points.",
    },
    {
      id: "block-uf-3",
      type: "paragraph",
      value:
        "The retreat follows a record-breaking streak earlier in the month, underscoring growing vulnerability among mega-cap technology firms whose stratospheric valuations leave razor-thin margins for error. Traders on the floor of the New York Stock Exchange and across global electronic desks reported heavy pre-market selling as institutional funds rebalanced toward defensive sectors and government debt.",
    },
    {
      id: "block-uf-4",
      type: "subheading",
      value: "Amazon and Alphabet: AI Capex Surge Prompts Wall Street Scrutiny",
    },
    {
      id: "block-uf-5",
      type: "paragraph",
      value:
        "Amazon shares sank more than 5% in pre-market dealings after the e-commerce and cloud computing giant delivered a cautious holiday-quarter operating profit forecast. Despite solid consumer retail figures, executives signaled intensified spending on generative artificial intelligence infrastructure for Amazon Web Services (AWS), dampening near-term operating margin projections.",
    },
    {
      id: "block-uf-6",
      type: "paragraph",
      value:
        "Alphabet also faced intense downward pressure, shedding 3.4% as investors parsed the Google parent company’s surging capital expenditure forecast. While search advertising and YouTube revenue remained healthy, Alphabet’s multi-billion-dollar commitment to cutting-edge server clusters and custom silicon raised questions over the timeframe required to translate massive infrastructure outlays into accelerating net cash flows.",
    },
    {
      id: "block-uf-7",
      type: "pullquote",
      value: {
        quote:
          "Wall Street has entered a phase of heightened accountability for artificial intelligence spending. Markets are no longer cheering capex announcements unconditionally; investors now demand unambiguous evidence of immediate margin conversion.",
        author:
          "Julian Thorne, Chief Equity Strategist at Horizon Wealth Management",
      },
    },
    {
      id: "block-uf-8",
      type: "subheading",
      value: "Intel Slides on Restructuring and Foundry Losses",
    },
    {
      id: "block-uf-9",
      type: "paragraph",
      value:
        "Semiconductor pioneer Intel bore the brunt of the pre-bell sell-off, tumbling over 7% following quarterly metrics that highlighted lingering headwinds in its contract manufacturing division. While PC processor sales stabilized modestly, the company’s Intel Foundry unit posted substantial operating losses as it builds out domestic fabrication plants in Ohio and Germany.",
    },
    {
      id: "block-uf-10",
      type: "paragraph",
      value:
        "Analysts pointed to relentless competition from Nvidia and AMD in the high-margin enterprise data center space, where traditional x86 server chips continue to concede budget allocations to specialized accelerated computing architectures. Intel’s cautious revenue guidance reinforced investor fears that the chipmaker’s extensive multi-year turnaround remains arduous and cash-intensive.",
    },
    {
      id: "block-uf-11",
      type: "subheading",
      value: "Bond Yields Steady as Key Labor Data Approaches",
    },
    {
      id: "block-uf-12",
      type: "paragraph",
      value:
        "Treasury yields offered little relief to equity markets, with the benchmark 10-year U.S. Treasury note holding firm around 4.28%. Traders remained reluctant to make aggressive rate bets ahead of upcoming monthly Non-Farm Payrolls and wage growth data, which will provide pivotal guidance for the Federal Reserve’s upcoming interest rate deliberations.",
    },
    {
      id: "block-uf-13",
      type: "paragraph",
      value:
        "With corporate earnings season reaching its most congested stretch, market participants anticipate elevated intraday volatility. Analysts noted that while broader macroeconomic fundamentals remain solid, index performance will increasingly depend on whether corporate guidance can justify premium price-to-earnings multiples amidst shifting tech dynamics.",
    },
  ],
  category: "Business",
  author: "Marcus Bennett",
  authorTitle: "Senior Investigative Correspondent",
  authorData: {
    name: "Marcus Bennett",
    role: "Senior Investigative Correspondent",
    bio: "Marcus Bennett is an investigative journalist focused on corporate accountability, financial misconduct, government oversight, regulatory affairs, and matters of public interest. His reporting draws on public records, data, and extensive research to uncover complex stories and provide readers with clear, fact-based investigations.",
    slug: "marcus-bennett",
  },
  date: "October 30, 2026",
  readTime: "4 min read",
  image: "/images/us-futures-fall-amazon-intel-alphabet-wall-street.webp",
  imageAltText:
    "Stock market financial traders monitoring terminals and stock price graphs on Wall Street",
  seoTitle:
    "US Futures Fall: Amazon, Alphabet, Intel Slump Shakes Wall Street",
  seoMetaDescription:
    "US stock futures slid as Amazon, Alphabet, and Intel weighed on market sentiment with rising AI expenditures and cautious quarterly guidance.",
  keywords:
    "US futures, Wall Street, stock market, Amazon earnings, Alphabet stock, Intel slump, Nasdaq 100, S&P 500, tech stocks, AI capex, financial markets",
  tags: "Business, Markets, Wall Street, Tech, Stocks, Finance",
  isLead: true,
  isBreaking: false,
  isTrending: true,
  commentsCount: 16,
};

export const EUROPE_ECONOMY_STATIC_ARTICLE: Article = {
  id: "6ae5c2019c4b110012a34b02",
  slug: "europes-economy-brushes-off-energy-shock-iran-war-moderate-growth-q3",
  title:
    "Europe’s Economy Brushes Off Energy Shock From Iran War, Shows Moderate Growth in Q3",
  excerpt:
    "Despite geopolitical tensions and oil market turbulence from the Iran conflict, the eurozone demonstrated remarkable resilience in the third quarter, posting 0.4% GDP growth supported by domestic consumption and strong services.",
  content: [
    "Europe’s economy expanded at a moderate pace in the third quarter, brushing aside intense fears that the military conflict involving Iran and escalating tensions in the Middle East would plunge the eurozone into a fresh bout of stagflation. According to preliminary data released by Eurostat, gross domestic product across the 20-nation currency bloc rose by 0.4% quarter-on-quarter, comfortably outpacing analyst estimates of 0.2%.",
    "The unexpected durability was anchored by steady household consumption, sustained employment levels, and continued resilience in the service sector.",
    "A critical pillar underpinning the region’s economic insulation has been the sweeping structural overhaul of its energy procurement over the past three years.",
  ],
  blocks: [
    {
      id: "block-ee-1",
      type: "subheading",
      value: "Resilient Momentum Defies Stagflation Fears",
    },
    {
      id: "block-ee-2",
      type: "paragraph",
      value:
        "Europe’s economy expanded at a moderate pace in the third quarter, brushing aside intense fears that the military conflict involving Iran and escalating tensions in the Middle East would plunge the eurozone into a fresh bout of stagflation. According to preliminary data released by Eurostat, gross domestic product across the 20-nation currency bloc rose by 0.4% quarter-on-quarter, comfortably outpacing analyst estimates of 0.2% and building on solid momentum from earlier in the year.",
    },
    {
      id: "block-ee-3",
      type: "paragraph",
      value:
        "The unexpected durability was anchored by steady household consumption, sustained employment levels, and continued resilience in the service sector. While the outbreak of hostilities in the Persian Gulf triggered sharp volatility in benchmark Brent crude prices and raised questions over maritime passage through the Strait of Hormuz, European manufacturers and logistics networks managed to adapt without facing the catastrophic supply halts witnessed in prior geopolitical crises.",
    },
    {
      id: "block-ee-4",
      type: "subheading",
      value: "Energy Diversification Softens Market Impact",
    },
    {
      id: "block-ee-5",
      type: "paragraph",
      value:
        "A critical pillar underpinning the region’s economic insulation has been the sweeping structural overhaul of its energy procurement over the past three years. European gas storage facilities entered the autumn season filled to more than 95% of capacity, providing a decisive buffer against sudden wholesale price spikes. Long-term supply contracts with liquefied natural gas (LNG) suppliers in the United States and Qatar, coupled with expanded pipeline capacity from Norway and North Africa, prevented acute shortages.",
    },
    {
      id: "block-ee-6",
      type: "paragraph",
      value:
        "“The systemic vulnerabilities that defined Europe’s energy calculus only a few years ago have diminished significantly,” noted Christian Keller, head of economic research at Barclays. “While higher crude prices exert a drag on consumer real purchasing power, European industry is no longer caught flat-footed by sudden geopolitical flare-ups in oil-producing regions.”",
    },
    {
      id: "block-ee-7",
      type: "pullquote",
      value: {
        quote:
          "The European economy has proved far more adaptable than skeptics anticipated, absorbing geopolitical shocks through diversified energy architecture and persistent domestic demand.",
        author: "European Central Bank Economic Bulletin",
      },
    },
    {
      id: "block-ee-8",
      type: "subheading",
      value: "ECB Monitors Inflation Pressures in Frankfurt",
    },
    {
      id: "block-ee-9",
      type: "paragraph",
      value:
        "At the European Central Bank’s towering headquarters in Frankfurt, policymakers are examining the third-quarter figures with cautious satisfaction alongside measured vigilance. While the headline growth figure diminishes immediate recession anxieties, central bank officials remain attentive to secondary inflationary risks stemming from shipping surcharges, elevated maritime insurance rates, and persistent wage growth.",
    },
    {
      id: "block-ee-10",
      type: "paragraph",
      value:
        "ECB President Christine Lagarde and the Governing Council have emphasized that future monetary policy adjustments will stay strictly data-dependent. With headline inflation hovering near the ECB’s 2% target, the resilience in growth provides the central bank room to recalibrate interest rates without fear of inducing an acute economic downturn.",
    },
  ],
  category: "Business",
  author: "Emily Davis",
  authorTitle: "Senior Business & Finance Writer",
  authorData: {
    name: "Emily Davis",
    role: "Senior Business & Finance Writer",
    bio: "Emily Davis is a business and financial journalist covering corporate earnings, global markets, monetary policy, entrepreneurship, and major developments shaping the global economy. She provides clear, research-driven reporting and analysis to help readers understand complex financial and business trends.",
    slug: "emily-davis",
  },
  date: "October 30, 2026",
  readTime: "5 min read",
  image: "/images/europe-economy-brushes-off-energy-shock-iran-war-ecb.webp",
  imageAltText:
    "European Central Bank headquarters sign and tower in Frankfurt Germany under clear blue skies",
  seoTitle:
    "Europe Economy Q3 Growth: Eurozone Brushes Off Iran War Energy Shock",
  seoMetaDescription:
    "The European economy grew at a moderate 0.4% pace in Q3, brushing off energy shocks and Middle East conflict risks backed by diversified supplies and steady consumer spending.",
  keywords:
    "Europe economy, Eurozone GDP, Q3 growth, ECB, European Central Bank, Iran war, energy shock, oil prices, inflation, monetary policy",
  tags: "Business, Europe, Economy, ECB, Energy, Finance",
  isLead: false,
  isBreaking: false,
  isTrending: true,
  commentsCount: 12,
};

export const LORD_STANLEY_STATIC_ARTICLE: Article = {
  id: "6a869e4960319e5ae33d238a",
  slug: "lord-stanley-fink-chairman-britannia-global-markets",
  alternateSlugs: ["lord-stanley-fink-takes-chair-seat-at-britannia"],
  title: "Lord Stanley Fink Appointed Chairman of Britannia Global Markets",
  excerpt:
    "The former Man Group chief executive and veteran City financier joins the London-based multi-asset brokerage as it advances its institutional and prime-brokerage ambitions.",
  content: [
    "Britannia Global Markets has appointed Lord Stanley Fink as Chairman, adding one of the City of London’s most experienced financial-services figures to the board of the multi-asset brokerage.",
    "Lord Fink is best known for his tenure as chief executive of Man Group from 2000 to 2007. During those years, the business became one of the world’s largest listed hedge-fund companies and a prominent FTSE 100 constituent.",
  ],
  category: "Business",
  author: "Editorial Desk",
  authorTitle: "Financial Markets Desk",
  date: "August 20, 2026",
  readTime: "4 min read",
  image:
    "https://res.cloudinary.com/dcj2ovntc/image/upload/v1787207239/magazinegazette/lord-stanley-fink-takes-chair-seat-at-britannia.jpg",
  isLead: false,
  isBreaking: false,
  isTrending: false,
  commentsCount: 11,
};

export const JULIO_STATIC_ARTICLE: Article = {
  id: "689073c9db655938fae1f741",
  slug: "julio-herrera-velutini-paterfamilias-house-of-herrera",
  title: "Paterfamilias: What It Means to Lead the House of Herrera",
  excerpt:
    "For Julio Herrera Velutini, leading a historic financial family is not simply a matter of possessing its assets. It means carrying its obligations, protecting its institutions and preparing a new generation to inherit responsibility alongside wealth.",
  content: [
    "For Julio Herrera Velutini, leading a historic financial family is not simply a matter of possessing its assets. It means carrying its obligations, protecting its institutions and preparing a new generation to inherit responsibility alongside wealth.",
    "A family fortune can be divided on paper. A family legacy cannot.",
    "It lives in institutions, relationships, archives, estates, trusts, habits and expectations. It survives through the promises one generation makes—and the obligations another generation is expected to honour.",
  ],
  category: "Business",
  author: "Emily Davis",
  authorTitle: "Senior Financial & Markets Correspondent",
  date: "August 20, 2026",
  readTime: "10 min read",
  image:
    "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444470/magazinegazette/julio-herrera-velutini-paterfamilias-house-of-herrera.jpg",
  isLead: false,
  isBreaking: false,
  isTrending: false,
  commentsCount: 14,
};

// Merge key featured and breaking DB articles and sort newest-first so latest news stays on top
NEWS_ARTICLES.push(
  TRUMP_SOCIAL_MEDIA_STATIC_ARTICLE,
  US_FUTURES_STATIC_ARTICLE,
  EUROPE_ECONOMY_STATIC_ARTICLE,
  LORD_STANLEY_STATIC_ARTICLE,
  JULIO_STATIC_ARTICLE
);
NEWS_ARTICLES.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
NEWS_ARTICLES.forEach((art, idx) => {
  art.isLead = idx === 0;
  if (idx < 6) {
    art.isBreaking = true;
    art.isTrending = true;
  }
});
