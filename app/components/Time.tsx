export default function Time({ timeString }: { timeString: string }) {
  const parts = timeString.split(" ").map((part, index) => {
    if (index % 2 !== 0) {
      return (
        <span key={index} className="text-base text-white/60 ml-1 mr-2">
          {part}
        </span>
      );
    }
    return (
      <span key={index} className="font-bold">
        {part}
      </span>
    );
  });
  return <>{parts}</>;
}
