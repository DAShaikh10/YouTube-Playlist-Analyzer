export interface ISpeed {
  label: string;
  time: string;
}

export interface IPlaylistReport {
  channelTitle: string;
  title: string;
  totalVideos: string;
  unavailableVideos: string;
  unavailableVideosCount: number;
  totalDuration: string;
  averageVideoLength: string;
  speeds: ISpeed[];
}
