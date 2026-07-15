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
    "us": "US",
    "world": "World",
    "finance": "Finance",
    "technology": "Technology",
    "entertainment": "Entertainment",
    "marketing": "Marketing",
    "pr news": "PR News",
    "pr-news": "PR News",
    "prnews": "PR News",
  };
  const slugDecoded = decodedCategory.toLowerCase();
  const normalizedCategory = CATEGORY_MAP[slugDecoded] || decodedCategory;

  // One-line editorial tagline per category
  const categoryTaglines: Record<string, string> = {
    "US": "Covering American politics, policy, and national affairs.",
    "World": "Global dispatches from correspondents across every continent.",
    "Finance": "Markets, economics, and the forces shaping global capital.",
    "Technology": "The intersection of innovation, AI, and the digital future.",
    "Entertainment": "Arts, culture, film, music, and the stories behind the spotlight.",
    "Marketing": "Strategy, brand, and the science of reaching modern audiences.",
    "PR News": "Official statements, press releases, and institutional announcements.",
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
