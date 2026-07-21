import { useMemo, useState } from "react";
import EpisodeCard from "./EpisodeCard.jsx";

/**
 * Builds the details the player and favourites need for one episode.
 *
 * @param {Object} episode - The raw episode from the API.
 * @param {number} i - Its position in the season.
 * @param {Object} season - The season it belongs to.
 * @param {number} seasonNumber
 * @param {string} showId
 * @param {string} showTitle
 * @returns {Object}
 */
function toDetails(episode, i, season, seasonNumber, showId, showTitle) {
  const episodeNumber = episode.episode ?? i + 1;
  return {
    episodeId: `${showId}-s${seasonNumber}-e${episodeNumber}`,
    title: episode.title,
    description: episode.description,
    showId,
    showTitle,
    seasonNumber,
    seasonTitle: season.title,
    episodeNumber,
    image: season.image,
  };
}

/**
 * Season navigation. Every season is listed as a row you can expand or collapse,
 * and the dropdown jumps straight to one. Only open seasons render their
 * episodes, so the page stays manageable.
 *
 * @param {Object} props
 * @param {Object[]} props.seasons - The show's seasons.
 * @param {string} props.showId - The show's id.
 * @param {string} props.showTitle - The show's title.
 * @returns {JSX.Element}
 */
export default function SeasonNav({ seasons, showId, showTitle }) {
  // the first season starts open
  const [openSeasons, setOpenSeasons] = useState(() => new Set([0]));

  // work out each season's episode details once
  const seasonData = useMemo(() => {
    if (!seasons) return [];
    return seasons.map((season, i) => {
      const seasonNumber = season.season ?? i + 1;
      const episodes = season.episodes || [];
      return {
        season,
        seasonNumber,
        episodes,
        queue: episodes.map((e, j) => toDetails(e, j, season, seasonNumber, showId, showTitle)),
      };
    });
  }, [seasons, showId, showTitle]);

  if (!seasons || seasons.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-10">
        No seasons available for this show.
      </p>
    );
  }

  /**
   * Opens or closes one season.
   * @param {number} index
   */
  function toggleSeason(index) {
    setOpenSeasons((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  /**
   * Jumps to a season from the dropdown: opens it and scrolls it into view.
   * @param {number} index
   */
  function jumpToSeason(index) {
    setOpenSeasons((current) => new Set(current).add(index));
    const el = document.getElementById(`season-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const allOpen = openSeasons.size === seasons.length;

  return (
    <section>
      {/* heading + expand all + jump dropdown */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Seasons
          <span className="ml-2 text-sm font-normal text-gray-400">({seasons.length})</span>
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenSeasons(allOpen ? new Set() : new Set(seasons.map((_, i) => i)))}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>

          <select
            onChange={(e) => jumpToSeason(Number(e.target.value))}
            defaultValue=""
            aria-label="Jump to a season"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3.5 py-2 text-[15px] text-gray-800 dark:text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Jump to season…
            </option>
            {seasonData.map((s, i) => (
              <option key={i} value={i}>
                {s.season.title || `Season ${s.seasonNumber}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* one expandable row per season */}
      <div className="space-y-4">
        {seasonData.map(({ season, seasonNumber, episodes, queue }, i) => {
          const isOpen = openSeasons.has(i);
          return (
            <div
              key={i}
              id={`season-${i}`}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden scroll-mt-20"
            >
              {/* the row you click to expand or collapse */}
              <button
                onClick={() => toggleSeason(i)}
                aria-expanded={isOpen}
                aria-controls={`season-panel-${i}`}
                className="w-full flex gap-5 items-center p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#9aa1ac] flex items-center justify-center text-white text-xs font-medium text-center px-1">
                  Season {seasonNumber}
                  {season.image && (
                    <img
                      src={season.image}
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {season.title || `Season ${seasonNumber}`}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {episodes.length} episode{episodes.length === 1 ? "" : "s"}
                  </p>
                </div>

                {/* chevron turns when the season is open */}
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* the episodes, only rendered when the season is open */}
              {isOpen && (
                <div
                  id={`season-panel-${i}`}
                  className="px-5 pb-5 pt-4 space-y-3 border-t border-gray-100 dark:border-gray-700"
                >
                  {episodes.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                      No episodes listed for this season.
                    </p>
                  ) : (
                    episodes.map((episode, j) => (
                      <EpisodeCard
                        key={queue[j].episodeId}
                        details={queue[j]}
                        description={episode.description}
                        queue={queue}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
