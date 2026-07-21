import { useMemo } from "react";
import Header from "../components/Header.jsx";
import Carousel from "../components/Carousel.jsx";
import Controls from "../components/Controls.jsx";
import PodcastGrid from "../components/PodcastGrid.jsx";
import Pagination from "../components/Pagination.jsx";
import { getVisiblePodcasts } from "../utils/filterPodcasts.js";
import { usePodcasts } from "../context/PodcastsContext.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { genres } from "../data.js";

/** How many podcasts to show per page. */
const PAGE_SIZE = 8;

/**
 * The landing page: recommended carousel, search/filter/sort, grid, pagination.
 * State comes from the contexts, so it survives navigating to a show and back.
 *
 * @returns {JSX.Element}
 */
export default function HomePage() {
  const { podcasts, loading, error, retry } = usePodcasts();
  const { search, setSearch, genre, setGenre, sort, setSort, page, setPage, resetFilters, anyFilterActive } =
    useFilters();

  const visible = useMemo(
    () => getVisiblePodcasts(podcasts, { search, genre, sort }),
    [podcasts, search, genre, sort]
  );

  // the carousel shows the most recently updated shows
  const recommended = useMemo(
    () => [...podcasts].sort((a, b) => new Date(b.updated) - new Date(a.updated)).slice(0, 12),
    [podcasts]
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /** Moves to a page and scrolls back to the top of the list. */
  function goToPage(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Header />
      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-7 pb-32">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500 dark:text-gray-400">
            <div className="spinner"></div>
            <p>Loading podcasts…</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Something went wrong
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We couldn't load the podcasts: {error}
            </p>
            <button
              onClick={retry}
              className="mt-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm hover:opacity-80 transition"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <Carousel podcasts={recommended} genres={genres} />

            <Controls
              search={search}
              onSearch={setSearch}
              genre={genre}
              onGenre={setGenre}
              sort={sort}
              onSort={setSort}
              genres={genres}
            />

            {/* how many results, and a way to clear the filters */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
              <p>
                {visible.length} show{visible.length === 1 ? "" : "s"}
                {anyFilterActive ? " found" : ""}
              </p>
              {anyFilterActive && (
                <button
                  onClick={resetFilters}
                  className="hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition"
                >
                  Clear filters
                </button>
              )}
            </div>

            <PodcastGrid podcasts={pageItems} genres={genres} onClearFilters={resetFilters} />
            <Pagination currentPage={safePage} pageCount={pageCount} onPageChange={goToPage} />
          </>
        )}
      </main>
    </>
  );
}
