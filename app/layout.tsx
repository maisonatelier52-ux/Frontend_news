import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import { connectToDatabase } from "@/lib/db";
import { SiteSettingsModel } from "@/models/SiteSettings";
import VisitorTracker from "@/app/components/VisitorTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectToDatabase();
    const settings = await SiteSettingsModel.findOne({ key: 'site_settings' });
    if (settings?.seo) {
      return {
        title: settings.seo.globalTitle || "The Domain Name | US & World News, Analysis & Opinion",
        description: settings.seo.metaDescription || "Independent, in-depth journalism covering politics, business, technology, science, culture, and sports.",
      };
    }
  } catch (e) {
    console.error("Failed to load metadata dynamically:", e);
  }
  return {
    title: "The Domain Name | US & World News, Analysis & Opinion",
    description: "Independent, in-depth journalism covering politics, business, technology, science, culture, and sports.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let themeStyles = "";
  try {
    await connectToDatabase();
    const settings = await SiteSettingsModel.findOne({ key: 'site_settings' });
    if (settings && settings.theme) {
      const theme = settings.theme;
      const typography = theme.typography || {};
      
      const getFontFamily = (font: string) => {
        if (font === 'Lora') return 'var(--font-lora), Georgia, serif';
        if (font === 'Geist') return 'var(--font-geist-sans), ui-sans-serif, system-ui';
        if (font === 'Courier') return 'var(--font-geist-mono), monospace';
        return font || 'inherit';
      };

      const typographyStyles = Object.entries(typography).map(([key, value]: [string, any]) => {
        // Map camelCase to kebab-case selectors
        const selectorMap: Record<string, string> = {
          siteTitle: '.site-title',
          logoText: '.logo-text',
          navigationMenu: '.navigation-menu',
          categoryNavigation: '.category-navigation',
          categoryLabel: '.category-label',
          leadStoryCategory: '.lead-story-category',
          leadStoryTitle: '.lead-story-title',
          leadStoryDescription: '.lead-story-description',
          newsCardTitle: '.news-card-title',
          newsCardDescription: '.news-card-description',
          sidebarTitles: '.sidebar-titles',
          widgetTitles: '.widget-titles',
          footerTitles: '.footer-titles',
          footerText: '.footer-text',
          detailPageTitle: '.detail-page-title',
          detailPageDescription: '.detail-page-description',
          author: '.author-text',
          date: '.date-text',
          breadcrumb: '.breadcrumb-text',
          relatedNews: '.related-news-title',
          tags: '.tags-badge',
          buttons: '.btn-theme'
        };

        const className = selectorMap[key];
        if (!className || !value) return '';

        return `
          ${className} {
            font-family: ${getFontFamily(value.font)} !important;
            font-size: ${value.size} !important;
            font-weight: ${value.weight} !important;
            letter-spacing: ${value.spacing} !important;
            line-height: ${value.height} !important;
          }
        `;
      }).join('\n');

      themeStyles = `
        :root {
          --primary-color: ${theme.primaryColor || '#1e40af'};
          --secondary-color: ${theme.secondaryColor || '#0f172a'};
          --accent-color: ${theme.accentColor || '#dc2626'};
          --background-color: ${theme.backgroundColor || '#ffffff'};
          --border-color: ${theme.borderColor || '#e2e8f0'};
          --card-color: ${theme.cardColor || '#ffffff'};
          --button-color: ${theme.buttonColor || '#1e40af'};
          --button-text-color: ${theme.buttonTextColor || '#ffffff'};
          --hover-color: ${theme.hoverColor || '#1d4ed8'};
          --link-color: ${theme.linkColor || '#2563eb'};
          --border-radius: ${theme.borderRadius || '6px'};
          --container-width: ${theme.containerWidth || '1280px'};
        }
        body {
          background-color: var(--background-color) !important;
          color: var(--secondary-color) !important;
        }
        ${typographyStyles}
      `;
    }
  } catch (err) {
    console.error("Failed to load theme settings inside RootLayout:", err);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <head>
        {themeStyles && (
          <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-zinc-200">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
