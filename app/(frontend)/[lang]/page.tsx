import Base from "@/components/Base";

import { getDictionary } from "@/app/dictionaries/dictionaries";

import type { Locale } from "@/types/types";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <main className="container mx-auto px-4 py-4 md:py-12 flex flex-col items-center justify-center min-h-screen">
      <Base lang={lang} langDictionary={dictionary} />
    </main>
  );
}
