import type { Metadata } from "next";
import CategoryPageExperience from "../components/CategoryPageExperience";
import { fetchCategoryLayout, fetchCategoryArticles, fetchTrendingArticles } from "@/lib/category-data";
import { fetchActiveAds } from "@/lib/homepage-data";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_MAP: Record<string, string> = {
  "business": "Business",
  "world": "World",
  "finance": "Finance",
  "technology": "Technology",
  "politics": "Politics",
  "lifestyle": "Lifestyle",
  "opinion": "Opinion",
  "investigation": "Investigation"
};

const CATEGORY_TAGLINES: Record<string, string> = {
  "Business": "Markets, corporate updates, and strategic industry developments.",
  "World": "Global dispatches from correspondents across every continent.",
  "Finance": "Personal finance, banking, economics, and investment strategies.",
  "Technology": "The intersection of innovation, AI, and the digital future.",
  "Politics": "National policy, political dynamics, and legislative updates.",
  "Lifestyle": "Culture, travel, food, wellness, and contemporary living.",
  "Opinion": "Analysis, commentary, and editorial perspectives from our columnists.",
  "Investigation": "In-depth investigative reports, exposes, and deep-dive journalism."
};

function getCategoryInfo(rawCategory: string) {
  const decodedCategory = decodeURIComponent(rawCategory);
  const slugDecoded = decodedCategory.toLowerCase();
  const normalizedCategory = CATEGORY_MAP[slugDecoded] || (decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1));
  const tagline = CATEGORY_TAGLINES[normalizedCategory] || `In-depth reporting on ${normalizedCategory}.`;
  return { decodedCategory, normalizedCategory, tagline };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const { normalizedCategory, tagline } = getCategoryInfo(rawCategory);

  const title = `${normalizedCategory} News, Analysis & Reports | Magazine Gazette`;
  const description = `${tagline} Read breaking ${normalizedCategory.toLowerCase()} news, expert commentary, and in-depth journalism on Magazine Gazette.`;
  const keywords = [
    `${normalizedCategory.toLowerCase()} news`,
    `latest ${normalizedCategory.toLowerCase()} news`,
    `${normalizedCategory.toLowerCase()} updates`,
    `${normalizedCategory.toLowerCase()} reports`,
    "magazine gazette",
    "breaking news"
  ];

  const logoImage = "https://www.magazinegazette.com/images/magazinegazette-logo.jpg";

  return {
    metadataBase: new URL("https://www.magazinegazette.com"),
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://www.magazinegazette.com/${rawCategory}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.magazinegazette.com/${rawCategory}`,
      siteName: 'Magazine Gazette',
      type: 'website',
      locale: 'en_US',
      images: [{ url: logoImage, alt: 'Magazine Gazette Logo' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [logoImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: rawCategory } = await params;
  const { normalizedCategory, tagline } = getCategoryInfo(rawCategory);

  // Fetch layout, category articles, trending articles, and ads in parallel
  const [layout, articles, trendingArticles, ads] = await Promise.all([
    fetchCategoryLayout(),
    fetchCategoryArticles(normalizedCategory),
    fetchTrendingArticles(normalizedCategory),
    fetchActiveAds(),
  ]);

  // JSON-LD BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://magazinegazette.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": normalizedCategory,
        "item": `https://magazinegazette.com/${rawCategory}`
      }
    ]
  };

  // JSON-LD CollectionPage Schema
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${normalizedCategory} News | Magazine Gazette`,
    "description": tagline,
    "url": `https://magazinegazette.com/${rawCategory}`,
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "Magazine Gazette",
      "url": "https://magazinegazette.com",
      "logo": "https://magazinegazette.com/images/magazinegazette-logo.jpg"
    }
  };

  // JSON-LD ItemList Schema of News Articles
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${normalizedCategory} News Articles`,
    "itemListElement": articles.slice(0, 10).map((art: any, idx: number) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": art.title,
        "description": art.excerpt,
        "url": `https://magazinegazette.com/article/${art.slug}`,
        "image": art.image,
        "datePublished": art.date,
        "author": {
          "@type": "Person",
          "name": art.author
        },
        "publisher": {
          "@type": "NewsMediaOrganization",
          "name": "Magazine Gazette",
          "url": "https://magazinegazette.com"
        }
      }
    }))
  };

  return (
    <>
      {/* SEO JSON-LD Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <CategoryPageExperience
        decodedCategory={normalizedCategory}
        tagline={tagline}
        layout={layout}
        articles={articles}
        trendingArticles={trendingArticles}
        initialAds={ads}
      />
    </>
  );
}
