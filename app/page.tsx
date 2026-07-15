import HomePageExperience from "./components/HomePageExperience";
import { fetchHomeArticles, fetchHomeLayout, fetchActiveAds } from "@/lib/homepage-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch layout, news articles, and active ads in parallel on the server
  const [articles, layout, ads] = await Promise.all([
    fetchHomeArticles(),
    fetchHomeLayout(),
    fetchActiveAds()
  ]);

  return (
    <HomePageExperience
      articlesOverride={articles}
      layoutSectionsOverride={layout}
      initialAds={ads}
    />
  );
}
