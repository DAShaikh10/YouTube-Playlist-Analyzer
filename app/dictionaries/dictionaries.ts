import "server-only";

import type { Locale } from "@/types/types";

const dictionaries: Record<Locale, () => Promise<any>> = {
  en: () =>
    import("@/app/dictionaries/en.json").then((module) => module.default),
  de: () =>
    import("@/app/dictionaries/de.json").then((module) => module.default),
  es: () =>
    import("@/app/dictionaries/es.json").then((module) => module.default),
  fr: () =>
    import("@/app/dictionaries/fr.json").then((module) => module.default),
  hi: () =>
    import("@/app/dictionaries/hi.json").then((module) => module.default),
  mr: () =>
    import("@/app/dictionaries/mr.json").then((module) => module.default),
  nl: () =>
    import("@/app/dictionaries/nl.json").then((module) => module.default),
  ru: () =>
    import("@/app/dictionaries/ru.json").then((module) => module.default),
  zh: () =>
    import("@/app/dictionaries/zh.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
