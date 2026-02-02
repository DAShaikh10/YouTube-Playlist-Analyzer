import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import SideFooter from "@/components/SideFooter";
import LanguageSwitcher from "@/components/LanguageSwitcher";

import { getDictionary } from "@/app/dictionaries/dictionaries";
import { ANALYTICS_ID, LOCALES } from "@/constants/appsettingConstants";

import type { Metadata } from "next";
import type { Locale } from "@/types/types";

import "../globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

// SEO.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const langDictionary = await getDictionary(lang);

  return {
    title: langDictionary.metadata.title,
    description: langDictionary.metadata.description,
    keywords: langDictionary.metadata.keywords,
    // Provide a metadata base so Next generates absolute URLs for alternates/hreflang.
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        es: "/es",
        de: "/de",
        fr: "/fr",
        hi: "/hi",
        mr: "/mr",
        nl: "/nl",
        ru: "/ru",
        zh: "/zh",
      },
    },
    authors: [{ name: "DAShaikh10" }],
    creator: "DAShaikh10",
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "zawkBiCIcbKTz3D7CptSmUNmrc1vwymqerj1Hf6j9w4",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: (typeof LOCALES)[number] }>;
}) {
  const { lang } = await params;
  const langDictionary = await getDictionary(lang as Locale);

  return (
    <html lang={lang}>
      <body
        className={`${inter.className} bg-linear-to-br from-indigo-500 via-purple-500 to-blue-100 text-white min-h-screen antialiased`}
      >
        <div className="absolute right-4 top-4 z-50 animate-fade-in">
          <LanguageSwitcher
            currentLocale={lang as Locale}
            langDictionary={langDictionary}
            locales={LOCALES as Locale[]}
          />
        </div>
        {children}
        <SideFooter />
        <GoogleAnalytics gaId={ANALYTICS_ID} />
      </body>
    </html>
  );
}
