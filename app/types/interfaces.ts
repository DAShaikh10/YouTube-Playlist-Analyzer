export interface IDictionary {
  metadata: {
    title: string;
    description: string;
    keywords: string;
  };
  page: {
    heading: string;
    description: string;
  };
  form: {
    placeholder: string;
    button: {
      default: string;
      loading: string;
    };
    tooltip: {
      analyze: string;
      emptyInput: string;
    };
  };
  report: {
    by: string;
    totalPlaylistLength: string;
    totalVideos: string;
    averageVideoLength: string;
    speed: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
    oops: string;
    unavailable: string;
    unknownPlaylist: string;
    unknownChannel: string;
  };
  languages: {
    [key: string]: string;
  };
}

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
