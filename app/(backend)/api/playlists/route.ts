import { NextRequest, NextResponse } from "next/server";

import { HTTP_STATUS_CODES } from "@/constants/apiConstants";
import {
  YOUTUBE_PLAYLISTS_ENDPOINT,
  YOUTUBE_PLAYLIST_ITEMS_ENDPOINT,
  YOUTUBE_VIDEOS_ENDPOINT,
} from "@/constants/appsettingConstants";

import {
  buildPlaylistDurationResponse,
  callYouTubeApi,
  getCacheLifetime,
  makeBatchRequests,
  validate,
} from "./helper";

/**
 * Endpoint: /api/playlists
 * @param request - NextRequest - Query parameters: id (string) or url (string) - ID or URL of the YouTube playlist.
 * @returns - NextResponse - JSON response containing the playlist duration report or an error message.
 */
export async function GET(request: NextRequest) {
  try {
    // Validation.
    const validationResult = validate(request);
    if (validationResult.isValid === false) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: HTTP_STATUS_CODES.BAD_REQUEST }
      );
    }

    // Fetch requested playlist details.
    const playlistApiResponse = await callYouTubeApi(
      YOUTUBE_PLAYLISTS_ENDPOINT,
      validationResult.id!,
      undefined,
      validationResult.lang!
    );

    if (playlistApiResponse.message) {
      return NextResponse.json(
        { error: playlistApiResponse.message },
        { status: playlistApiResponse.status }
      );
    }

    // Unpack playlist request response.
    const playlist = playlistApiResponse.items[0];

    // Retrieve the total playlist items count. This count includes the hidden \ unavailable videos.
    const itemCount = playlist?.contentDetails?.itemCount;
    const publishedAt = playlist?.snippet?.publishedAt;

    // Determine the cache lifetime based on the playlist's age.
    const cacheLifetime = getCacheLifetime(publishedAt);

    // Fetch requested playlist's items (Video IDs).
    const playlistItemsApiResponse = await callYouTubeApi(
      YOUTUBE_PLAYLIST_ITEMS_ENDPOINT,
      validationResult.id!,
      cacheLifetime,
      validationResult.lang!
    );
    if (playlistItemsApiResponse.message) {
      return NextResponse.json(
        { error: playlistItemsApiResponse.message },
        { status: playlistItemsApiResponse.status }
      );
    }

    // Fetch details for all videos in the playlist in batches.
    const videoIds = playlistItemsApiResponse.items
      .map((item) => item.contentDetails?.videoId)
      .filter((id): id is string => !!id);
    const videosRequestResponse = await makeBatchRequests(
      YOUTUBE_VIDEOS_ENDPOINT,
      videoIds,
      cacheLifetime,
      validationResult.lang!
    );

    if (videosRequestResponse.errors.length) {
      return NextResponse.json(
        { errors: videosRequestResponse.errors },
        { status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR }
      );
    }

    const report = await buildPlaylistDurationResponse(
      itemCount,
      playlistApiResponse.items,
      videosRequestResponse.items,
      validationResult.lang!
    );

    return NextResponse.json(report);
  } catch (error) {
    console.error(`API Failure: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
