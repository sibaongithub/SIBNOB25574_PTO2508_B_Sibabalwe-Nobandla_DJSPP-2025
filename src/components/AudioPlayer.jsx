import { useEffect, useState } from "react";
import { useAudio } from "../context/AudioContext.jsx";
import { formatTime } from "../utils/formatTime.js";

/**
 * The player bar fixed to the bottom of every page.
 * Has play/pause, skip back/forward, a seek bar, volume, and a queue list.
 * It stays hidden until the user starts an episode.
 *
 * @returns {JSX.Element|null}
 */
export default function AudioPlayer() {
  const {
    track,
    queue,
    index,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    togglePlay,
    playNext,
    playPrevious,
    playFromQueue,
    seek,
    skipBy,
    changeVolume,
    toggleMute,
    closePlayer,
    hasNext,
    hasPrevious,
  } = useAudio();

  const [showQueue, setShowQueue] = useState(false);

  // keyboard shortcuts: space play/pause, arrows seek, m mute
  useEffect(() => {
    function onKey(e) {
      // ignore while the user is typing in a field
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!track) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        skipBy(15);
      } else if (e.code === "ArrowLeft") {
        skipBy(-15);
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [track, togglePlay, skipBy, toggleMute]);

  if (!track) return null;

  const percent = duration ? (currentTime / duration) * 100 : 0;
  const iconBtn =
    "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <>
      {/* queue panel */}
      {showQueue && (
        <div className="fixed bottom-[88px] right-3 sm:right-8 z-50 w-80 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Up next ({queue.length})
            </p>
            <button
              onClick={() => setShowQueue(false)}
              aria-label="Close queue"
              className={iconBtn}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="py-1">
            {queue.map((item, i) => (
              <li key={item.episodeId}>
                <button
                  onClick={() => playFromQueue(i)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    i === index
                      ? "text-gray-900 dark:text-white font-semibold"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <span className="w-4 flex-shrink-0 text-xs text-gray-400">
                    {i === index && isPlaying ? "▶" : i + 1}
                  </span>
                  <span className="truncate">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        {/* thin progress line across the very top of the bar */}
        <div className="h-0.5 bg-gray-200 dark:bg-gray-700">
          <div className="h-full bg-gray-900 dark:bg-gray-100" style={{ width: `${percent}%` }} />
        </div>

        <div className="max-w-[1400px] mx-auto px-3 sm:px-8 py-2.5 flex items-center gap-3 sm:gap-4">
          {/* cover + titles */}
          <div className="flex items-center gap-3 min-w-0 w-32 sm:w-60 flex-shrink-0">
            <div className="relative w-11 h-11 flex-shrink-0 rounded-md overflow-hidden bg-[#9aa1ac] flex items-center justify-center text-[10px] text-white">
              Cover
              {track.image && (
                <img
                  src={track.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {track.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.showTitle}</p>
            </div>
          </div>

          {/* transport controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={playPrevious}
              disabled={!hasPrevious && currentTime < 3}
              aria-label="Previous episode"
              className={`${iconBtn} hidden sm:block`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>

            <button onClick={() => skipBy(-15)} aria-label="Back 15 seconds" className={iconBtn}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 4 6 8l5 4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h7a5 5 0 1 1 0 10H9" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-11 h-11 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center hover:opacity-80 transition flex-shrink-0"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button onClick={() => skipBy(15)} aria-label="Forward 15 seconds" className={iconBtn}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m13 4 5 4-5 4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h-7a5 5 0 1 0 0 10h4" />
              </svg>
            </button>

            <button
              onClick={playNext}
              disabled={!hasNext}
              aria-label="Next episode"
              className={`${iconBtn} hidden sm:block`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
              </svg>
            </button>
          </div>

          {/* seek bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums w-9 text-right hidden sm:block">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              step="1"
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              className="flex-1 h-1 accent-gray-900 dark:accent-gray-100 cursor-pointer"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums w-9 hidden sm:block">
              {formatTime(duration)}
            </span>
          </div>

          {/* volume */}
          <div className="hidden md:flex items-center gap-2 w-28 flex-shrink-0">
            <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className={iconBtn}>
              {muted || volume === 0 ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path strokeLinecap="round" d="m16 9 5 6m0-6-5 6" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5a5 5 0 0 1 0 7" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="flex-1 h-1 accent-gray-900 dark:accent-gray-100 cursor-pointer"
            />
          </div>

          {/* queue + close */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setShowQueue((v) => !v)}
              aria-label="Show queue"
              aria-expanded={showQueue}
              className={iconBtn}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </button>
            <button onClick={closePlayer} aria-label="Close player" className={`${iconBtn} hidden sm:block`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
