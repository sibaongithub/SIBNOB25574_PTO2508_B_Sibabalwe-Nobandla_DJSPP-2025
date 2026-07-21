import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import FavouriteButton from "../components/FavouriteButton.jsx";
import { useFavourites } from "../context/FavouritesContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { formatDate } from "../utils/formatDate.js";
import { getGroupedFavourites } from "../utils/favourites.js";

/**
 * The favourites page. Lists saved episodes grouped by show, with sorting,
 * a per-show filter, and a play button that queues up the whole group.
 *
 * @returns {JSX.Element}
 */
export default function FavouritesPage() {
  const { favourites, clearFavourites } = useFavourites();
  const { playEpisode, track, isPlaying } = useAudio();
  const { showToast } = useToast();

  const [sort, setSort] = useState("newest");
  const [showFilter, setShowFilter] = useState("all");

  // shows that have favourites, for the dropdown
  const showTitles = useMemo(
    () => [...new Set(favourites.map((f) => f.showTitle))].sort(),
    [favourites]
  );

  // filter, sort, then group by show title
  const grouped = useMemo(
    () => getGroupedFavourites(favourites, { sort, showTitle: showFilter }),
    [favourites, sort, showFilter]
  );

  const groupNames = Object.keys(grouped);
  const shownCount = groupNames.reduce((n, key) => n + grouped[key].length, 0);

  /** Removes every favourite, after asking first. */
  function handleClearAll() {
    if (window.confirm(`Remove all ${favourites.length} favourites? This can't be undone.`)) {
      clearFavourites();
      showToast("Favourites cleared");
    }
  }

  const field =
    "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3.5 py-2 text-[15px] text-gray-800 dark:text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 sm:px-8 py-7 pb-32">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Favourite Episodes
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-7">
          {favourites.length === 0
            ? "Your saved episodes from all shows"
            : `${favourites.length} saved episode${favourites.length === 1 ? "" : "s"} from ${showTitles.length} show${showTitles.length === 1 ? "" : "s"}`}
        </p>

        {favourites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <svg
              className="w-12 h-12 text-gray-300 dark:text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.7z"
              />
            </svg>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              No favourites yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Open a show and tap the heart on an episode to save it here.
            </p>
            <Link
              to="/"
              className="mt-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm hover:opacity-80 transition"
            >
              Browse podcasts
            </Link>
          </div>
        ) : (
          <>
            {/* sorting + filter */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={field} aria-label="Sort favourites">
                <option value="newest">Newest Added</option>
                <option value="oldest">Oldest Added</option>
                <option value="title-az">Title A–Z</option>
                <option value="title-za">Title Z–A</option>
              </select>

              <select
                value={showFilter}
                onChange={(e) => setShowFilter(e.target.value)}
                className={field}
                aria-label="Filter by show"
              >
                <option value="all">All Shows</option>
                {showTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>

              <button
                onClick={handleClearAll}
                className="ml-auto text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
              >
                Clear all
              </button>
            </div>

            {shownCount === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                No favourites from that show.
              </p>
            )}

            {/* one block per show */}
            {groupNames.map((showTitle) => {
              const episodes = grouped[showTitle];
              return (
                <section key={showTitle} className="mb-10">
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                      {episodes[0].showId ? (
                        <Link to={`/show/${episodes[0].showId}`} className="hover:underline">
                          {showTitle}
                        </Link>
                      ) : (
                        showTitle
                      )}
                      <span className="text-sm font-normal text-gray-400">
                        ({episodes.length} episode{episodes.length === 1 ? "" : "s"})
                      </span>
                    </h2>
                    <button
                      onClick={() => {
                        playEpisode(episodes[0], episodes);
                        showToast(`Playing ${showTitle}`);
                      }}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition"
                    >
                      Play all
                    </button>
                  </div>

                  <div className="space-y-3">
                    {episodes.map((episode) => {
                      const isCurrent = track && track.episodeId === episode.episodeId;
                      return (
                        <div
                          key={episode.episodeId}
                          className={`flex gap-4 border rounded-xl p-4 transition ${
                            isCurrent
                              ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500"
                              : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                          }`}
                        >
                          <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-[#9aa1ac] flex items-center justify-center text-[10px] text-white">
                            Cover
                            {episode.image && (
                              <img
                                src={episode.image}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              Episode {episode.episodeNumber}: {episode.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Season {episode.seasonNumber} • Episode {episode.episodeNumber}
                            </p>
                            {episode.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                                {episode.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Added on {formatDate(episode.addedAt)}
                            </p>
                          </div>

                          <div className="flex flex-col items-end justify-between gap-2">
                            <FavouriteButton episode={episode} />
                            <button
                              onClick={() => playEpisode(episode, episodes)}
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
                              {isCurrent && isPlaying ? "Pause" : "Play"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>
    </>
  );
}
