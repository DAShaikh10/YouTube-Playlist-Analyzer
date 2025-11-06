import { Duration } from "luxon";
import { NextRequest } from "next/server";

import {
  API_ENDPOINT_REQUEST_PARAM_MAP,
  HTTP_STATUS_CODES,
  ID_PARAM,
  LOCALE_PARAM,
  NUMERAL_LOCALES,
  URL_PARAM,
  YOUTUBE_API_KEY_FIELD,
} from "@/constants/apiConstants";
import {
  YOUTUBE_API_BASE_URL,
  YOUTUBE_API_KEY,
  YOUTUBE_BATCH_SIZE,
  YOUTUBE_API_LIST_QUERY_PARAM,
  YOUTUBE_PLAYLIST_ITEMS_ENDPOINT,
  SHORT_CACHE_DURATION_IN_SECONDS,
  THRESHOLD_IN_MS,
  LONGER_CACHE_DURATION_IN_SECONDS,
  DEFAULT_LOCALE,
  LOCALES,
} from "@/constants/appsettingConstants";
import { getDictionary } from "@/app/dictionaries/dictionaries";

import type {
  ValidationResult,
  YouTubeApiResponse,
  YouTubeApiRequestParams,
  YouTubeResource,
  Locale,
} from "@/types/types";
import { IDictionary } from "@/app/types/interfaces";

/**
 * Validates the incoming request and extracts the playlist ID.
 * @param {NextRequest} request - The NextRequest object.
 * @returns {ValidationResult} - A validation result object.
 */
export function validate(request: NextRequest): ValidationResult {
  const searchParams = request.nextUrl.searchParams;

  let playlistId = searchParams.get(ID_PARAM);
  const playlistUrl = searchParams.get(URL_PARAM);

  if (!playlistId && !playlistUrl)
    return {
      isValid: false,
      error: `Missing required query parameter: either '${ID_PARAM}' or '${URL_PARAM}' must be provided.`,
    };

  if (playlistUrl) {
    try {
      const url = new URL(playlistUrl);
      playlistId = url.searchParams.get(YOUTUBE_API_LIST_QUERY_PARAM);

      if (!playlistId) {
        return {
          isValid: false,
          error: "URL does not contain a valid playlist ID.",
        };
      }
    } catch (error) {
      console.error(
        `Error parsing playlistUrl: ${playlistUrl}. Error: ${error}`
      );
      return { isValid: false, error: "Invalid URL format provided." };
    }
  }

  let locale;
  const localeParam = searchParams.get(LOCALE_PARAM) ?? DEFAULT_LOCALE;
  if (LOCALES.includes(localeParam)) {
    locale = localeParam;
  } else {
    locale = DEFAULT_LOCALE;
  }

  return {
    isValid: true,
    id: playlistId?.trim(),
    lang: locale as Locale,
  };
}

/**
 * Builds the YouTube API request URL with necessary parameters.
 * @param {string} endpoint - The API endpoint (e.g., 'videos', 'playlists').
 * @param {string} id - The resource ID or comma-separated list of IDs.
 * @param {Locale} [lang] - Optional language code (e.g., 'de', 'es') for the 'hl' parameter.
 * @param {string} [nextPageToken] - Optional token for pagination.
 * @returns {URL} The constructed URL object.
 */
export function buildYouTubeApiRequestUrl(
  endpoint: string,
  id: string,
  lang?: Locale,
  nextPageToken?: string
): URL {
  const queryParams: Partial<YouTubeApiRequestParams> = {
    ...API_ENDPOINT_REQUEST_PARAM_MAP[endpoint],
  };

  if (endpoint === YOUTUBE_PLAYLIST_ITEMS_ENDPOINT) {
    queryParams.playlistId = id;
    if (nextPageToken) queryParams.pageToken = nextPageToken;
  } else {
    queryParams.id = id;
  }

  // Add host language parameter if provided.
  // It is not expected for all playlists to have very good localization,
  // as it depends on the author of the playlist and not youtube.
  if (lang) {
    queryParams.hl = lang;
  }

  const url = new URL(endpoint, YOUTUBE_API_BASE_URL);
  url.search = buildSearchParamsObject(queryParams).toString();

  return url;
}

/**
 * Unpacks the JSON response from the YouTube API.
 * @param {Response} response - The fetch Response object.
 * @returns The API data or an error message string.
 */
export async function unpackYouTubeApiResponse(response: Response) {
  const data: YouTubeApiResponse = await response.json();
  if ("error" in data) return data.error.message;
  return {
    items: data.items,
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Fetches all pages of a YouTube API endpoint that supports pagination.
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} id - The ID of the resource (e.g., playlist ID).
 * @param {number} [cacheLifetime] - Optional cache revalidation period in seconds.
 * @param {Locale} [lang] - Optional language code for the 'hl' parameter.
 * @returns An object containing accumulated items or an error message.
 */
export async function callYouTubeApi(
  endpoint: string,
  id: string,
  cacheLifetime?: number,
  lang?: Locale
) {
  let accumulatedItems: YouTubeResource[] = [];
  let nextPageToken: string | undefined = undefined;

  const fetchOptions = cacheLifetime
    ? { next: { revalidate: cacheLifetime } }
    : { cache: "no-store" as RequestCache };

  do {
    const url = buildYouTubeApiRequestUrl(endpoint, id, lang, nextPageToken);
    const response = await fetch(url.toString(), fetchOptions);
    const result = await unpackYouTubeApiResponse(response);

    if (typeof result === "string") {
      return { items: [], message: result, status: response.status };
    }

    if (result.items) {
      accumulatedItems = [...accumulatedItems, ...result.items];
    }
    nextPageToken = result.nextPageToken;
  } while (nextPageToken);

  return { items: accumulatedItems, status: HTTP_STATUS_CODES.OK };
}

/**
 * Fetches data for a large number of IDs by splitting them into batches.
 * @param {string} endpoint - The API endpoint to call.
 * @param {string[]} ids - An array of resource IDs.
 * @param {number} cacheLifetime - The cache revalidation period in seconds.
 * @param {Locale} [lang] - Optional language code for the 'hl' parameter.
 * @returns An object containing all items and any errors encountered.
 */
export async function makeBatchRequests(
  endpoint: string,
  ids: string[],
  cacheLifetime: number,
  lang?: Locale
) {
  const idChunks: string[][] = [];
  for (let i = 0; i < ids.length; i += YOUTUBE_BATCH_SIZE) {
    idChunks.push(ids.slice(i, i + YOUTUBE_BATCH_SIZE));
  }

  const requestPromises = idChunks.map((chunk) => {
    const idString = chunk.join(",");
    return callYouTubeApi(endpoint, idString, cacheLifetime, lang);
  });

  const chunkResults = await Promise.all(requestPromises);

  const allItems: YouTubeResource[] = [];
  const errors: { message: string; status: number }[] = [];

  for (const result of chunkResults) {
    if (result.message) {
      errors.push({ message: result.message, status: result.status });
    } else {
      allItems.push(...result.items);
    }
  }

  return { items: allItems, errors };
}

/**
 * Gets the correct plural form for a unit.
 * @param {number} value - The number to check.
 * @param {string} unitString - The dictionary string (e.g., "day | days").
 * @param {string} lang - The locale (e.g., "en", "de").
 * @returns {string} The correct plural form.
 */
function getPlural(value: number, unitString: string, lang: string): string {
  const parts = unitString.split(" | ");
  const rule = new Intl.PluralRules(lang).select(value);
  return rule === "one" ? parts[0] : parts[1] || parts[0];
}

/**
 * Formats a Luxon Duration object into a human-readable string.
 * @param {Duration} duration - The Luxon Duration object.
 * @param {Intl.NumberFormat} numberFormatter - The formatter for the current locale.
 * @param {IDictionary} dictionary - The language dictionary.
 * @param {Locale} lang - The locale (e.g., "en", "de").
 * @returns {string} The formatted time string.
 */
function formatDuration(
  duration: Duration,
  numberFormatter: Intl.NumberFormat,
  dictionary: IDictionary,
  lang: Locale
): string {
  const units = dictionary.report;

  // Define the "zero" string using the formatter and plural rules for accuracy.
  const zeroSeconds = `${numberFormatter.format(0)} ${getPlural(
    0,
    units.second,
    lang
  )}`;

  if (!duration || !duration.isValid || duration.as("seconds") <= 0) {
    return zeroSeconds;
  }

  const parts = duration
    .shiftTo("days", "hours", "minutes", "seconds")
    .toObject();
  const readableParts: string[] = [];

  if (parts.days && parts.days > 0) {
    readableParts.push(
      `${numberFormatter.format(parts.days)} ${getPlural(
        parts.days,
        units.day,
        lang
      )}`
    );
  }
  if (parts.hours && parts.hours > 0) {
    readableParts.push(
      `${numberFormatter.format(parts.hours)} ${getPlural(
        parts.hours,
        units.hour,
        lang
      )}`
    );
  }
  if (parts.minutes && parts.minutes > 0) {
    readableParts.push(
      `${numberFormatter.format(parts.minutes)} ${getPlural(
        parts.minutes,
        units.minute,
        lang
      )}`
    );
  }
  if (
    duration.as("seconds") < 60 ||
    (parts.seconds && parts.seconds > 0 && readableParts.length > 0)
  ) {
    const roundedSeconds = Math.round(parts.seconds || 0);
    if (roundedSeconds > 0) {
      readableParts.push(
        `${numberFormatter.format(roundedSeconds)} ${getPlural(
          roundedSeconds,
          units.second,
          lang
        )}`
      );
    }
  }

  return readableParts.join(" ") || zeroSeconds;
}

/**
 * Calculates the cache lifetime based on the playlist's publication date.
 * @param {string} [publishedAt] - The ISO 8601 date string.
 * @returns {number} The cache lifetime in seconds.
 */
export function getCacheLifetime(publishedAt?: string): number {
  if (!publishedAt) return SHORT_CACHE_DURATION_IN_SECONDS;

  const publishedDate = new Date(publishedAt).getTime();
  const now = new Date().getTime();

  if (now - publishedDate < THRESHOLD_IN_MS) {
    return SHORT_CACHE_DURATION_IN_SECONDS;
  }

  return LONGER_CACHE_DURATION_IN_SECONDS;
}

/**
 * Assembles the final response object with all calculated playlist stats.
 * @param {number | undefined} itemCount - The total number of items from the API.
 * @param {YouTubeResource[]} playlists - The array of playlist resources.
 * @param {YouTubeResource[]} videos - The array of video resources.
 * @param {Locale} lang - The locale (e.g., "en", "de").
 * @returns The final report object.
 */
export async function buildPlaylistDurationResponse(
  itemCount: number | undefined,
  playlists: YouTubeResource[],
  videos: YouTubeResource[],
  lang: Locale
) {
  const playlist = playlists[0];

  // `lang` validation is already done in `validate` function.
  const numberFormatter = new Intl.NumberFormat(NUMERAL_LOCALES[lang]);
  const dictionary = await getDictionary(lang);
  const speedTemplate = dictionary.report.speed;

  let totalDuration = Duration.fromMillis(0);
  videos.forEach((video) => {
    const duration = Duration.fromISO(video.contentDetails?.duration || "PT0S");
    if (duration.as("seconds") > 0) {
      totalDuration = totalDuration.plus(duration);
    }
  });

  const totalVideos = videos.length;
  const averageSeconds =
    totalVideos > 0 ? totalDuration.as("seconds") / totalVideos : 0;
  const totalSeconds = totalDuration.as("seconds");

  const averageVideoLength = formatDuration(
    Duration.fromObject({ seconds: averageSeconds }),
    numberFormatter,
    dictionary,
    lang
  );

  const speeds = [1.25, 1.5, 1.75, 2.0].map((speed) => ({
    label: speedTemplate.replace("{speed}", numberFormatter.format(speed)),
    time: formatDuration(
      Duration.fromObject({ seconds: totalSeconds / speed }),
      numberFormatter,
      dictionary,
      lang
    ),
  }));

  // Assemble the final report.
  const unavailableVideosCount: number = itemCount
    ? Math.max(0, itemCount - totalVideos)
    : 0;
  return {
    channelTitle:
      playlist.snippet?.channelTitle || dictionary.report.unknownChannel,
    title: playlist.snippet?.title || dictionary.report.unknownPlaylist,
    totalVideos: numberFormatter.format(totalVideos),
    unavailableVideosCount,
    unavailableVideos: numberFormatter.format(unavailableVideosCount),
    totalDuration: formatDuration(
      totalDuration,
      numberFormatter,
      dictionary,
      lang
    ),
    averageVideoLength,
    speeds,
  };
}

/**
 * Builds a URLSearchParams object from a parameters object.
 * @param {Partial<YouTubeApiRequestParams>} params - An object of query parameters.
 * @returns {URLSearchParams} A URLSearchParams object.
 */
function buildSearchParamsObject(
  params: Partial<YouTubeApiRequestParams>
): URLSearchParams {
  const stringParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== null)
  );

  stringParams[YOUTUBE_API_KEY_FIELD] = YOUTUBE_API_KEY;
  return new URLSearchParams(stringParams as Record<string, string>);
}
