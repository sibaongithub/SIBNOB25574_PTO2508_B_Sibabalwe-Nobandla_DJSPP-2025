import { useRef } from "react";
import { Link } from "react-router-dom";

/**
 * A horizontally scrollable row of recommended shows.
 * The arrows scroll one "page" at a time and loop around at the ends.
 *
 * @param {Object} props
 * @param {Object[]} props.podcasts - The shows to display.
 * @param {Object[]} props.genres - The genre list, for the tags.
 * @returns {JSX.Element|null}
 */
export default function Carousel({ podcasts, genres }) {
  const trackRef = useRef(null);

  if (!podcasts || podcasts.length === 0) return null;

  /**
   * Scrolls the row left or right, looping to the other end when it runs out.
   * @param {"left"|"right"} direction
   * @returns {void}
   */
  function scroll(direction) {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    const atStart = el.scrollLeft <= 10;

    if (direction === "right") {
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    } else {
      el.scrollTo({ left: atStart ? el.scrollWidth : el.scrollLeft - step, behavior: "smooth" });
    }
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recommended Shows</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* the scrolling row (also swipeable on touch devices) */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x"
        style={{ scrollbarWidth: "thin" }}
        tabIndex={0}
        aria-label="Recommended shows"
      >
        {podcasts.map((podcast) => (
          <Link
            key={podcast.id}
            to={`/show/${podcast.id}`}
            className="snap-start flex-shrink-0 w-52 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition p-3"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#9aa1ac] flex items-center justify-center text-white text-sm font-medium mb-3">
              Podcast Cover
              {podcast.image && (
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2 line-clamp-1">
              {podcast.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {podcast.genres.slice(0, 2).map((id) => {
                const match = genres.find((g) => g.id === id);
                return match ? (
                  <span
                    key={id}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[0.7rem] px-2 py-0.5 rounded"
                  >
                    {match.title}
                  </span>
                ) : null;
              })}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
