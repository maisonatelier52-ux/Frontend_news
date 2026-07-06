import entertainmentData from "../../public/data/entertainment.json";
import financeData from "../../public/data/finance.json";
import marketingData from "../../public/data/marketing.json";
import prnewsData from "../../public/data/prnews.json";
import technologyData from "../../public/data/technology.json";
import usData from "../../public/data/us.json";
import worldData from "../../public/data/world.json";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  authorTitle: string;
  date: string;
  readTime: string;
  image: string;
  isLead?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  isOpinion?: boolean;
  commentsCount: number;
}

// Helper to clean and parse date strings like "June. 24, 2026"
function parseDate(dateStr: string): Date {
  const cleaned = dateStr.replace(/\./g, "");
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
  };
  return mapping[cat.toLowerCase()] || cat;
};

// Combine all imports into a single flat list
const rawDataList = [
  ...usData.map(item => ({ ...item, sourceCategory: "US" })),
  ...worldData.map(item => ({ ...item, sourceCategory: "World" })),
  ...financeData.map(item => ({ ...item, sourceCategory: "Finance" })),
  ...technologyData.map(item => ({ ...item, sourceCategory: "Technology" })),
  ...entertainmentData.map(item => ({ ...item, sourceCategory: "Entertainment" })),
  ...marketingData.map(item => ({ ...item, sourceCategory: "Marketing" })),
  ...prnewsData.map(item => ({ ...item, sourceCategory: "PR News" })),
];

// Map raw JSON to Article type
export const NEWS_ARTICLES: Article[] = rawDataList
  .map((item, index) => {
    const categoryName = mapCategory(item.category || item.sourceCategory);
    
    // Split the description into paragraphs by newlines, or use it as single paragraph
    const contentParagraphs = item.description
      ? item.description.split("\n\n").map(p => p.trim()).filter(p => p !== "")
      : [item.shortdescription];

    return {
      id: String(index + 1),
      title: item.title,
      excerpt: item.description || item.shortdescription || "",
      content: contentParagraphs,
      category: categoryName,
      author: item.author?.name || "Staff Reporter",
      authorTitle: item.author?.role || "Editorial Desk",
      date: item.date,
      readTime: Math.max(1, Math.round((item.description || "").split(" ").length / 220)) + " min read",
      image: item.image,
      isLead: false,
      isBreaking: false,
      isTrending: false,
      commentsCount: Math.floor(Math.random() * 25) + 3
    };
  })
  // Sort from latest to oldest based on date field
  .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

// Assign flags dynamically based on the sorted order:
if (NEWS_ARTICLES.length > 0) {
  // Latest article is the Lead
  NEWS_ARTICLES[0].isLead = true;
  NEWS_ARTICLES[0].isTrending = true;
}

// Assign breaking / trending status to some items
NEWS_ARTICLES.forEach((art, idx) => {
  if (idx > 0 && idx < 4) {
    art.isBreaking = true;
  }
  if (idx < 5) {
    art.isTrending = true;
  }
});
