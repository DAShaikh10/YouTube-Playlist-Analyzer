import Time from "@/components/Time";

export default function PlaybackSpeedCard({
  label,
  time,
}: {
  label: string;
  time: string;
}) {
  return (
    <div className="bg-white/10 p-4 rounded-lg text-center h-full">
      <p className="font-bold text-lg text-pink-300">{label}</p>
      <p className="text-sm text-white/80 mt-2 whitespace-nowrap">
        <Time timeString={time} />
      </p>
    </div>
  );
}
