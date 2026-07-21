import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import SeasonNav from "../components/SeasonNav.jsx";
import { fetchShow } from "../api/fetchShow.js";
import { formatDate } from "../utils/formatDate.js";
import { genres as genreList } from "../data.js";

/**
 * Turns a show's genres into titles. The show endpoint may return them as
 * names or as ids, so this handles both.
 * @param {(string|number)[]} showGenres
 * @returns {string[]}
 */
function genreTitles(showGenres) {
  if (!showGenres) return [];
  return showGenres
    .map((g) => (typeof g === "number" ? (genreList.find((x) => x.id === g) || {}).title : g))
    .filter(Boolean);
}

/**
 * The detail page for one show (route: /show/:id).
 * Fetches by the id in the URL and handles loading, error and empty states.
 *
 * @returns {JSX.Element}
 */
export default function ShowPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchShow(id, setShow, setError, setLoading);
    window.scrollTo({ top: 0 });
  }, [id]);

  const totalEpisodes = show?.seasons
    ? show.seasons.reduce((sum, s) => sum + (s.episodes ? s.episodes.length : 0), 0)
    : 0;

  const description = show?.description || "";
  const isLong = description.length > 320;
  const shownDescription = isLong && !expanded ? description.slice(0, 320) + "…" : description;

  return (
    <>
      <Header showBackButton />
      <main className="max-w-[1100px] mx-auto px-5 sm:px-8 py-7 pb-32">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500 dark:text-gray-400">
            <div className="spinner"></div>
            <p>Loading show…</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Something went wrong
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We couldn't load this show: {error}
            </p>
            <Link
              to="/"
              className="mt-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm hover:opacity-80 transition"
            >
              Back to home
            </Link>
          </div>
        )}

        {!loading && !error && !show && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Show not found</p>
            <Link
              to="/"
              className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm hover:opacity-80 transition"
            >
              Back to home
            </Link>
          </div>
        )}

        {!loading && !error && show && (
          <>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6 sm:p-8 mb-10">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative w-full sm:w-64 h-64 flex-shrink-0 rounded-xl overflow-hidden bg-[#9aa1ac] flex items-center justify-center text-white font-medium">
                  Podcast Cover Image
                  {show.image && (
                    <img
                      src={show.image}
                      alt={`${show.title} cover`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {show.title}
                  </h1>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                    {shownDescription}
                  </p>
                  {isLong && (
                    <button
                      onClick={() => setExpanded((v) => !v)}
                      className="text-sm font-medium text-gray-900 dark:text-gray-100 underline underline-offset-2 mb-5 hover:opacity-70 transition"
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Genres</p>
                      <div className="flex flex-wrap gap-2">
                        {genreTitles(show.genres).length ? (
                          genreTitles(show.genres).map((title) => (
                            <span
                              key={title}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-3.5 py-1 rounded-full"
                            >
                              {title}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">Not listed</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Last Updated</p>
                      <p className="text-gray-800 dark:text-gray-200">{formatDate(show.updated)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Total Seasons</p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {show.seasons ? show.seasons.length : 0} Seasons
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Total Episodes</p>
                      <p className="text-gray-800 dark:text-gray-200">{totalEpisodes} Episodes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <SeasonNav seasons={show.seasons} showId={id} showTitle={show.title} />
          </>
        )}
      </main>
    </>
  );
}
