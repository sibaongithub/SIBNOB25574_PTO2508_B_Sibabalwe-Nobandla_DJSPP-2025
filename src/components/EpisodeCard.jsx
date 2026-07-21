import FavouriteButton from "./FavouriteButton.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import { formatTime } from "../utils/formatTime.js";

/**
 * Shortens a description so the rows stay tidy.
 * @param {string} text
 * @param {number} [max=150]
 * @returns {string}
 */
function shorten(text, max = 150) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

/**
 * One episode row: thumbnail, title, short description, play button, heart,
 * and a progress bar if the user has already listened to part of it.
 *
 * @param {Object} props
 * @param {Object} props.details - The episode details used by the player.
 * @param {string} props.description - The episode description.
 * @param {Object[]} props.queue - The season's episodes, so skip works.
 * @returns {JSX.Element}
 */
export default function EpisodeCard({ details, description, queue }) {
  const { playEpisode, getProgress, track, isPlaying } = useAudio();

  const saved = getProgress(details.episodeId);
  const isCurrent = track && track.episodeId === details.episodeId;
  const playedPercent =
    saved && saved.duration ? Math.min(100, (saved.position / saved.duration) * 100) : 0;

  return (
    <div
      className={`flex gap-4 rounded-xl p-4 border transition ${
        isCurrent
          ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500"
          : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      {/* thumbnail */}
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-[#9aa1ac] flex items-center justify-center text-white text-xs font-semibold">
        S{details.seasonNumber}
        {details.image && (
          <img
            src={details.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Episode {details.episodeNumber}: {details.title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
          {shorten(description)}
        </p>

        {/* listening progress */}
        {saved && (
          <div className="flex items-center gap-2">
            {saved.finished ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
                Finished
              </span>
            ) : (
              <>
                <div className="h-1 w-24 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 dark:bg-gray-100" style={{ width: `${playedPercent}%` }} />
                </div>
                <span className="text-xs text-gray-400">{formatTime(saved.position)} in</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* actions */}
      <div className="flex flex-col items-end justify-between gap-2">
        <FavouriteButton episode={details} />
        <button
          onClick={() => playEpisode(details, queue)}
          aria-label={isCurrent && isPlaying ? "Pause episode" : "Play episode"}
          className="flex items-center gap-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm px-3 py-1.5 rounded-md hover:opacity-80 active:scale-95 transition"
        >
          {isCurrent && isPlaying ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          {isCurrent && isPlaying ? "Pause" : saved && !saved.finished ? "Resume" : "Play"}
        </button>
      </div>
    </div>
  );
}
