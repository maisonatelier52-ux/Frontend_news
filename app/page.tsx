import type { Metadata } from "next";
import HomePageExperience from "./components/HomePageExperience";
import { fetchHomeArticles, fetchHomeLayout, fetchActiveAds } from "@/lib/homepage-data";
import { connectToDatabase } from "@/lib/db";
import { SiteSettingsModel } from "@/models/SiteSettings";
import { getArticleUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectToDatabase();
    const settings = await SiteSettingsModel.findOne({ key: 'site_settings' }).lean();
    const seo = (settings as any)?.seo || {};

    const title = seo.globalTitle || "Magazine Gazette | Latest Breaking News, Politics, Finance, Tech & World News";
    const description = seo.metaDescription || "Read independent, in-depth journalism on breaking news, politics, finance, business, technology, world affairs, and lifestyle stories on Magazine Gazette.";
    const keywords = seo.keywords || ["news", "breaking news", "politics news", "finance news", "technology news", "world news", "magazine gazette"];

    const logoImage = "https://www.magazinegazette.com/images/magazinegazette-logo.jpg";

    return {
      metadataBase: new URL("https://www.magazinegazette.com"),
      title,
      description,
      keywords,
      alternates: {
        canonical: 'https://www.magazinegazette.com/',
      },
      openGraph: {
        title,
        description,
        url: 'https://www.magazinegazette.com/',
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
  } catch (error) {
    console.error("Failed to generate home page metadata:", error);
    return {
      title: "Magazine Gazette | Latest Breaking News, Politics, Finance, Tech & World News",
      description: "Read independent, in-depth journalism on breaking news, politics, finance, business, technology, world affairs, and lifestyle stories on Magazine Gazette.",
    };
  }
}

export default async function Home() {
  // Fetch layout, news articles, and active ads in parallel on the server
  const [articles, layout, ads] = await Promise.all([
    fetchHomeArticles(),
    fetchHomeLayout(),
    fetchActiveAds()
  ]);

  // JSON-LD Structured Data for NewsMediaOrganization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "Magazine Gazette",
    "url": "https://magazinegazette.com",
    "logo": "https://magazinegazette.com/images/magazinegazette-logo.jpg",
    "sameAs": [
      "https://www.instagram.com/magazinegazette367/",
      "https://www.reddit.com/user/Magazinegazetter/",
      "https://medium.com/@magazinegazette367",
      "https://substack.com/@magazinegazettenews"
    ]
  };

  // JSON-LD Structured Data for WebSite Search
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Magazine Gazette",
    "url": "https://magazinegazette.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://magazinegazette.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // JSON-LD Structured Data for Home News Articles List
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": articles.slice(0, 10).map((art: any, idx: number) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": art.title,
        "description": art.excerpt,
        "url": `https://magazinegazette.com${getArticleUrl(art)}`,
        "image": art.image,
        "datePublished": art.date,
        "author": {
          "@type": "Person",
          "name": art.author
        }
      }
    }))
  };

  return (
    <>

      {/* SEO JSON-LD Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <HomePageExperience
        articlesOverride={articles}
        layoutSectionsOverride={layout}
        initialAds={ads}
      />
    </>
  );
}
