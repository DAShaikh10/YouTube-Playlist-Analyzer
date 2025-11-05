import { Inter } from "next/font/google";

import { getDictionary } from "./dictionaries";
import { SideFooter } from "@/components/SideFooter";
import { LOCALES } from "@/constants/appsettingConstants";

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
    authors: [{ name: "DAShaikh10" }],
    creator: "DAShaikh10",
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

  return (
    <html lang={lang}>
      <body
        className={`${inter.className} bg-linear-to-br from-indigo-500 via-purple-500 to-blue-100 text-white min-h-screen antialiased`}
      >
        {children}
        <SideFooter />
      </body>
    </html>
  );
}
