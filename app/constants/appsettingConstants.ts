export const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE!;
export const LOCALES = process.env.LOCALES!.split(",");
export const LONGER_CACHE_DURATION_IN_SECONDS = Number(
  process.env.LONGER_CACHE_DURATION_IN_SECONDS
);
export const SHORT_CACHE_DURATION_IN_SECONDS = Number(
  process.env.SHORT_CACHE_DURATION_IN_SECONDS
);
export const THRESHOLD_IN_MS = Number(process.env.THRESHOLD_IN_MS);
export const YOUTUBE_API_BASE_URL = process.env.API_BASE_URL!;
export const YOUTUBE_API_KEY = process.env.API_KEY!;
export const YOUTUBE_BATCH_SIZE = Number(process.env.BATCH_SIZE);
export const YOUTUBE_API_LIST_QUERY_PARAM = process.env.LIST_QUERY_PARAM!;
export const YOUTUBE_MAX_RESULTS = Number(process.env.MAX_RESULTS);
export const YOUTUBE_PLAYLIST_ITEM_FIELDS = process.env.PLAYLIST_ITEM_FIELDS!;
export const YOUTUBE_PLAYLIST_ITEM_PARTS = process.env.PLAYLIST_ITEM_PARTS!;
export const YOUTUBE_PLAYLIST_FIELDS = process.env.PLAYLIST_FIELDS!;
export const YOUTUBE_PLAYLIST_PARTS = process.env.PLAYLIST_PARTS!;
export const YOUTUBE_PLAYLISTS_ENDPOINT = process.env.PLAYLISTS_ENDPOINT!;
export const YOUTUBE_PLAYLIST_ITEMS_ENDPOINT =
  process.env.PLAYLIST_ITEMS_ENDPOINT!;
export const YOUTUBE_VIDEO_FIELDS = process.env.VIDEO_FIELDS!;
export const YOUTUBE_VIDEO_PARTS = process.env.VIDEO_PARTS!;
export const YOUTUBE_VIDEOS_ENDPOINT = process.env.VIDEOS_ENDPOINT!;
