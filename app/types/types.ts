export type ContentDetails = {
  duration: string;
  itemCount: number;
  nextPageToken: string;
  videoId: string;
};

export type Locale =
  | "de"
  | "en"
  | "es"
  | "fr"
  | "hi"
  | "mr"
  | "nl"
  | "ru"
  | "zh";

export type PlaylistDetailsResponse = {
  channelTitle: string;
};

export type PrivacyStatus = "public" | "private";

export type ApiResponse = {
  channelTitle: string;
  description: string;
  title: string;
};

export type Snippet = {
  channelTitle: string;
  description: string;
  publishedAt: string;
  title: string;
};

export type ValidationResult = {
  error?: string;
  id?: null | string;
  lang?: Locale;
  isValid: boolean;
};

export type VideoStatus = {
  privacyStatus: PrivacyStatus;
};

export type YouTubeApiRequestParams = {
  fields: string;
  hl?: string;
  id: string;
  maxResults: number;
  pageToken: string;
  part: string;
  playlistId: string;
};

export type YouTubeApiErrorResponse = {
  error: {
    message: string;
  };
};

export type YouTubeApiResponse =
  | YouTubeApiSuccessResponse
  | YouTubeApiErrorResponse;

export type YouTubeApiSuccessResponse = {
  items: YouTubeResource[];
  nextPageToken?: string;
};

export type YouTubeResource = {
  snippet?: Partial<Snippet>;
  contentDetails?: Partial<ContentDetails>;
  status?: PrivacyStatus;
};
