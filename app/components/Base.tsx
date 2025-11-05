"use client";

import { useState } from "react";

import Report from "@/components/Report";
import ErrorState from "@/components/ErrorState";
import LoadingSpinner from "@/components/LoadingSpinner";

import { IPlaylistReport } from "@/types/interfaces";

import type { Locale } from "@/types/types";

export default function Base({
  lang,
  langDictionary,
}: {
  lang: Locale;
  langDictionary: Record<string, any>;
}) {
  const [userInput, setUserInput] = useState("");
  const [report, setReport] = useState<IPlaylistReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessfulUrl, setLastSuccessfulUrl] = useState<string | null>(
    null
  );
  const [cachedReport, setCachedReport] = useState<IPlaylistReport | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userInput === lastSuccessfulUrl && cachedReport) {
      setError(null);
      setReport(cachedReport);
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    let queryParamKey = "id";
    try {
      // Simple check to see if the input is likely a URL.
      // A more robust regex could be used, but this is efficient.
      if (userInput.startsWith("http") || userInput.includes("www.")) {
        new URL(userInput);
        queryParamKey = "url";
      }
    } catch {
      // If it's not a valid URL, we assume it's an ID.
      queryParamKey = "id";
    }

    try {
      const response = await fetch(
        `/api/playlists?${queryParamKey}=${encodeURIComponent(
          userInput
        )}&l=${lang}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred");
      }

      setReport(data);
      setLastSuccessfulUrl(userInput);
      setCachedReport(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasReport = !!report || isLoading || !!error;
  let tooltipText = langDictionary.form.tooltip.analyze;
  if (!userInput) {
    tooltipText = langDictionary.form.tooltip.emptyInput;
  }

  return (
    <div
      className={`w-full max-w-3xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
        hasReport ? "mt-0 mb-0" : "mt-0 mb-8"
      }`}
    >
      <div
        className={`animate-fade-in text-center mb-8 transition-all duration-500 ease-in-out ${
          hasReport ? "scale-90 opacity-80 -translate-y-4" : ""
        }`}
      >
        <h1
          className={`font-bold tracking-tight text-white drop-shadow-lg transition-all duration-500 ease-in-out ${
            hasReport ? "text-2xl md:text-3xl" : "text-4xl md:text-6xl"
          }`}
        >
          {langDictionary.page.heading}
        </h1>
        <p
          className={`mt-2 text-white/80 max-w-2xl mx-auto transition-all duration-500 ease-in-out ${
            hasReport ? "text-sm md:text-base" : "text-lg md:text-xl"
          }`}
        >
          {langDictionary.page.description} 📈
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`w-full bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-2xl transition-all duration-500 ease-in-out ${
          hasReport ? "mb-4 md:mb-6" : "mb-8"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            required
            className="grow bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-pink-400 focus:outline-none transition duration-300"
            value={userInput}
            type="text"
            placeholder={langDictionary.form.placeholder}
            onChange={(event) => setUserInput(event.target.value)}
          />
          <div className="relative group flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !userInput}
              className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400/50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              {isLoading
                ? langDictionary.form.button.loading
                : langDictionary.form.button.default}
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-gray-900/80 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {tooltipText}
              <svg
                className="absolute text-gray-900/80 h-2 w-full left-0 top-full"
                viewBox="0 0 255 255"
              >
                <polygon
                  className="fill-current"
                  points="0,0 127.5,127.5 255,0"
                />
              </svg>
            </span>
          </div>
        </div>
      </form>

      <div className="w-full">
        {isLoading && <LoadingSpinner />}
        {error && (
          <ErrorState message={error} langDictionary={langDictionary} />
        )}
        {report && <Report report={report} langDictionary={langDictionary} />}
      </div>
    </div>
  );
}
