"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

import { IDictionary } from "@/types/interfaces";

import type { Locale } from "@/types/types";

const LANGUAGE_ICON_MAP: Record<Locale, { src: string; alt: string }> = {
  en: { src: "en", alt: "English flag" },
  es: { src: "es", alt: "Spanish flag" },
  de: { src: "de", alt: "German flag" },
  fr: { src: "fr", alt: "French flag" },
  hi: { src: "ind", alt: "Indian flag" },
  mr: { src: "ind", alt: "Indian flag" },
  nl: { src: "nl", alt: "Dutch flag" },
  ru: { src: "ru", alt: "Russian flag" },
  zh: { src: "zh", alt: "Chinese flag" },
};

export default function LanguageSwitcher({
  currentLocale,
  langDictionary,
  locales,
}: {
  currentLocale: Locale;
  langDictionary: IDictionary;
  locales: Locale[];
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const currentLocaleDetails = LANGUAGE_ICON_MAP[currentLocale];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [switcherRef]);

  const sortedLocales = useMemo(() => {
    return locales
      .filter((loc) => loc !== currentLocale)
      .map((loc) => ({
        key: loc,
        name: langDictionary.languages[loc] || loc.toUpperCase(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [locales, langDictionary, currentLocale]);

  const getPathForLocale = useCallback(
    (locale: Locale) => {
      if (!pathname) return `/${locale}`;
      const segments = pathname.split("/");
      segments[1] = locale;
      return segments.join("/");
    },
    [pathname]
  );

  return (
    <div className="relative" ref={switcherRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-lg bg-black/10 p-2 text-sm font-medium text-white/80 backdrop-blur-lg transition-colors hover:bg-black/20"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Image
          src={`/${currentLocaleDetails.src}.webp`}
          alt={currentLocaleDetails.alt}
          width={38}
          height={26}
          className="rounded-sm h-auto w-auto"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-10 w-auto min-w-max rounded-lg bg-black/20 shadow-lg backdrop-blur-lg">
          <ul className="flex flex-col p-1" role="menu">
            {sortedLocales.map((locale) => {
              const selectedLocale = LANGUAGE_ICON_MAP[locale.key];

              return (
                <li key={locale.key} role="none">
                  <Link
                    href={getPathForLocale(locale.key)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                  >
                    <Image
                      src={`/${selectedLocale.src}.webp`}
                      alt={selectedLocale.alt}
                      width={30}
                      height={23}
                      className="rounded-xs h-auto w-auto"
                    />
                    {locale.name.toUpperCase()}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
