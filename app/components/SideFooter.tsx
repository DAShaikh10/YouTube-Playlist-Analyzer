import Image from "next/image";

export function SideFooter() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="group flex flex-col items-end gap-3">
        <a
          href="https://github.com/DAShaikh10/YouTube-Playlist-Analyzer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-white/90 text-gray-800 rounded-full shadow-lg transition-all duration-300 ease-in-out w-12 h-12 group-hover:w-46"
        >
          <div className="min-w-12 flex items-center justify-center">
            <Image
              src="/github.svg"
              alt="DAShaikh10@Github"
              width={24}
              height={24}
            />
          </div>
          <span className="whitespace-nowrap overflow-hidden font-semibold pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            @DAShaikh10
          </span>
        </a>
      </div>
    </div>
  );
}
