import type { Metadata } from "next";
import { fetchArticleBySlug, fetchHomeArticles, fetchDetailLayout, fetchActiveAds } from "@/lib/homepage-data";
import DetailPageExperience from "@/app/components/DetailPageExperience";
import { getBaseUrl, getFullImageUrl, getArticleUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

interface ArticleDetailPageProps {
  params: Promise<{ category: string; slug: string }>;
}

import JulioHerreraVelutiniArticle from "@/app/components/JulioHerreraVelutiniArticle";
import LordStanleyFinkArticle from "@/app/components/LordStanleyFinkArticle";

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Magazine Gazette",
      description: "The requested news article could not be found on Magazine Gazette.",
    };
  }

  const baseUrl = getBaseUrl();
  const title = article.seoTitle && article.seoTitle.trim()
    ? article.seoTitle.trim()
    : `${article.title} | Magazine Gazette`;

  const description = (article.seoMetaDescription && article.seoMetaDescription.trim())
    ? article.seoMetaDescription.trim()
    : (article.excerpt || (article.content && article.content[0]) || article.title);

  let keywords: string[] = [];
  if (article.keywords) {
    keywords = typeof article.keywords === 'string'
      ? article.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : article.keywords;
  } else {
    keywords = [
      article.category,
      typeof article.author === 'object' ? article.author?.name : article.author,
      "news",
      "breaking news",
      "magazine gazette",
      ...(article.title ? article.title.split(" ").slice(0, 5) : [])
    ].filter(Boolean);
  }

  const rawImage = article.image || article.featuredImage;
  const ogImage = getFullImageUrl(rawImage);
  const articleUrl = `${baseUrl}${getArticleUrl(article)}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: 'Magazine Gazette',
      type: 'article',
      publishedTime: article.isoDate || article.date,
      authors: [typeof article.author === 'object' ? article.author?.name : (article.author || 'Magazine Gazette Staff')],
      images: [
        {
          url: ogImage,
          alt: article.imageAltText || article.title,
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { category, slug } = await params;

  // Fetch article, trending articles, layout, and ads in parallel on the server
  const [article, allArticles, layout] = await Promise.all([
    fetchArticleBySlug(slug),
    fetchHomeArticles(),
    fetchDetailLayout(),
  ]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center select-none">
        <h2 className="font-editorial-title text-3xl font-bold text-zinc-900">Article Not Found</h2>
        <p className="text-zinc-550 text-sm max-w-sm">We couldn't locate the article you were looking for. It may have been deleted or moved.</p>
        <a
          href="/"
          className="bg-zinc-900 text-white text-xs font-bold py-2 px-5 rounded cursor-pointer hover:bg-zinc-800 transition"
        >
          Back to Homepage
        </a>
      </div>
    );
  }

  // JSON-LD NewsArticle Schema
  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://magazinegazette.com${getArticleUrl(article)}`
    },
    "headline": article.title,
    "description": article.excerpt,
    "image": [article.image],
    "datePublished": article.isoDate || article.date,
    "dateModified": article.isoDate || article.date,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "Magazine Gazette",
      "url": "https://magazinegazette.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://magazinegazette.com/images/magazinegazette-logo.jpg"
      }
    },
    "articleSection": article.category
  };

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
        "name": article.category,
        "item": `https://magazinegazette.com/${article.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://magazinegazette.com${getArticleUrl(article)}`
      }
    ]
  };

  const trendingArticlesFiltered = allArticles.filter(
    (a: any) =>
      a.slug !== article.slug &&
      a._id !== article._id &&
      a.id !== article.id &&
      a.title?.trim().toLowerCase() !== article.title?.trim().toLowerCase()
  );

  const finalTrendingArticles = trendingArticlesFiltered.length > 0 
    ? trendingArticlesFiltered 
    : allArticles.filter((a: any) => a.slug !== article.slug);

  const isJulioArticle = slug === "julio-herrera-velutini-paterfamilias-house-of-herrera";
  const isLordStanleyArticle =
    slug === "lord-stanley-fink-chairman-britannia-global-markets" ||
    slug === "lord-stanley-fink-takes-chair-seat-at-britannia";

  return (
    <>
      {/* SEO JSON-LD Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {isJulioArticle ? (
        <JulioHerreraVelutiniArticle
          layout={layout}
          article={article}
          trendingArticles={finalTrendingArticles}
        />
      ) : isLordStanleyArticle ? (
        <LordStanleyFinkArticle
          layout={layout}
          article={article}
          trendingArticles={finalTrendingArticles}
        />
      ) : (
        <DetailPageExperience
          layout={layout}
          article={article}
          trendingArticles={finalTrendingArticles}
        />
      )}
    </>
  );
}
