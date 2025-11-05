import Time from "@/components/Time";
import StatCard from "@/components/StatCard";
import PlaybackSpeedCard from "@/components/PlaybackSpeedCard";

import { IPlaylistReport } from "@/types/interfaces";

export default function Report({
  report,
  langDictionary,
}: {
  report: IPlaylistReport;
  langDictionary: Record<string, any>;
}) {
  return (
    <div className="bg-black/20 backdrop-blur-xl p-5 md:p-6 rounded-xl shadow-2xl animate-fade-in w-full flex flex-col gap-3">
      {/* Playlist Title & Channel */}
      <div className="border-b border-white/20 pb-3 text-center">
        <h2 className="text-xl md:text-2xl font-bold leading-tight">
          {report.title}
        </h2>
        <p className="text-white/70 text-sm mt-1">
          {langDictionary.report.by} {report.channelTitle}
        </p>
      </div>

      {/* Row 1: Total Playlist Length */}
      <div className="bg-white/5 p-4 rounded-lg text-center">
        <p className="text-sm text-white/60 uppercase tracking-wider">
          {langDictionary.report.totalPlaylistLength}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-pink-400">
          <Time timeString={report.totalDuration} />
        </p>
      </div>

      {/* Row 2: Videos & Avg Length */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-[30%]">
          <StatCard
            label={langDictionary.report.totalVideos}
            value={report.totalVideos.toString()}
            isNumeric={true}
          />
        </div>
        <div className="w-full sm:flex-1">
          <StatCard
            label={langDictionary.report.averageVideoLength}
            value={report.averageVideoLength}
          />
        </div>
        {report.unavailableVideosCount > 0 && (
          <div className="w-full sm:w-auto">
            <StatCard
              label={langDictionary.report.unavailable}
              value={report.unavailableVideos.toString()}
              className="bg-yellow-500/10 text-yellow-300"
              isNumeric={true}
            />
          </div>
        )}
      </div>

      {/* Rows 3 & 4: Speeds */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-1/2">
            <PlaybackSpeedCard
              label={report.speeds[0].label}
              time={report.speeds[0].time}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <PlaybackSpeedCard
              label={report.speeds[1].label}
              time={report.speeds[1].time}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-1/2">
            <PlaybackSpeedCard
              label={report.speeds[2].label}
              time={report.speeds[2].time}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <PlaybackSpeedCard
              label={report.speeds[3].label}
              time={report.speeds[3].time}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
