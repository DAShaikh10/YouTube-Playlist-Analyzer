import {
  YOUTUBE_MAX_RESULTS,
  YOUTUBE_PLAYLIST_FIELDS,
  YOUTUBE_PLAYLIST_ITEM_FIELDS,
  YOUTUBE_PLAYLIST_ITEM_PARTS,
  YOUTUBE_PLAYLIST_ITEMS_ENDPOINT,
  YOUTUBE_PLAYLIST_PARTS,
  YOUTUBE_PLAYLISTS_ENDPOINT,
  YOUTUBE_VIDEO_FIELDS,
  YOUTUBE_VIDEO_PARTS,
  YOUTUBE_VIDEOS_ENDPOINT,
} from "@/constants/appsettingConstants";
import { YouTubeApiRequestParams } from "@/types/types";

export const ID_PARAM = "id";
export const LOCALE_PARAM = "l";
export const URL_PARAM = "url";
export const YOUTUBE_API_KEY_FIELD = "key";

export const API_ENDPOINT_REQUEST_PARAM_MAP: Record<
  string,
  Partial<YouTubeApiRequestParams>
> = {
  [YOUTUBE_PLAYLISTS_ENDPOINT]: {
    fields: YOUTUBE_PLAYLIST_FIELDS,
    part: YOUTUBE_PLAYLIST_PARTS,
  },
  [YOUTUBE_PLAYLIST_ITEMS_ENDPOINT]: {
    fields: YOUTUBE_PLAYLIST_ITEM_FIELDS,
    maxResults: YOUTUBE_MAX_RESULTS,
    part: YOUTUBE_PLAYLIST_ITEM_PARTS,
  },
  [YOUTUBE_VIDEOS_ENDPOINT]: {
    fields: YOUTUBE_VIDEO_FIELDS,
    part: YOUTUBE_VIDEO_PARTS,
  },
};

export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const NUMERAL_LOCALES = {
  de: "de",
  en: "en",
  es: "es",
  fr: "fr",
  hi: "hi-IN-u-nu-deva", // Hindi with Devanagari numerals
  mr: "mr-IN-u-nu-deva", // Marathi with Devanagari numerals
  nl: "nl",
  ru: "ru",
  zh: "zh",
} as const;
