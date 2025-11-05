import Time from "@/components/Time";

export default function StatCard({
  label,
  value,
  className = "",
  isNumeric = false,
}: {
  label: string;
  value: string;
  className?: string;
  isNumeric?: boolean;
}) {
  return (
    <div
      className={`bg-white/5 p-3 rounded-lg h-full flex flex-col items-center justify-center text-center ${className}`}
    >
      <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="text-lg md:text-xl font-bold whitespace-nowrap">
        {isNumeric ? value : <Time timeString={value} />}
      </div>
    </div>
  );
}
