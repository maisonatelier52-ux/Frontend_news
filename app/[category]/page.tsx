import CategoryPageExperience from "../components/CategoryPageExperience";
import { fetchCategoryLayout, fetchCategoryArticles, fetchTrendingArticles } from "@/lib/category-data";
import { fetchActiveAds } from "@/lib/homepage-data";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: rawCategory } = await params;
  const decodedCategory = decodeURIComponent(rawCategory);

  // Normalize URL slug → canonical display category name (case-insensitive)
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
  const slugDecoded = decodedCategory.toLowerCase();
  const normalizedCategory = CATEGORY_MAP[slugDecoded] || (decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1));

  // One-line editorial tagline per category
  const categoryTaglines: Record<string, string> = {
    "Business": "Markets, corporate updates, and strategic industry developments.",
    "World": "Global dispatches from correspondents across every continent.",
    "Finance": "Personal finance, banking, economics, and investment strategies.",
    "Technology": "The intersection of innovation, AI, and the digital future.",
    "Politics": "National policy, political dynamics, and legislative updates.",
    "Lifestyle": "Culture, travel, food, wellness, and contemporary living.",
    "Opinion": "Analysis, commentary, and editorial perspectives from our columnists.",
    "Investigation": "In-depth investigative reports, exposes, and deep-dive journalism."
  };
  const tagline = categoryTaglines[normalizedCategory] || `In-depth reporting on ${normalizedCategory}.`;

  // Fetch layout, category articles, trending articles, and ads in parallel
  const [layout, articles, trendingArticles, ads] = await Promise.all([
    fetchCategoryLayout(),
    fetchCategoryArticles(normalizedCategory),
    fetchTrendingArticles(normalizedCategory),
    fetchActiveAds(),
  ]);

  return (
    <CategoryPageExperience
      decodedCategory={normalizedCategory}
      tagline={tagline}
      layout={layout}
      articles={articles}
      trendingArticles={trendingArticles}
      initialAds={ads}
    />
  );
}
