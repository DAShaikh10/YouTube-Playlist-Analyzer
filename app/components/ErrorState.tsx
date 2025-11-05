export default function ErrorState({
  message,
  langDictionary,
}: {
  message: string;
  langDictionary: Record<string, any>;
}) {
  return (
    <div className="bg-red-500/20 border border-red-500 text-red-600 px-4 py-3 rounded-lg text-center animate-fade-in">
      <p>
        <span className="font-bold">{langDictionary.report.oops}</span>{" "}
        {message}
      </p>
    </div>
  );
}
