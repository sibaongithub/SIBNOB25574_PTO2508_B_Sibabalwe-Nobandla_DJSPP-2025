import PodcastCard from "./PodcastCard.jsx";

/**
 * The responsive grid of podcast cards. Shows a helpful message when empty.
 *
 * @param {Object} props
 * @param {Object[]} props.podcasts - The podcasts to render.
 * @param {Object[]} props.genres - The genre list, passed to each card.
 * @param {() => void} [props.onClearFilters] - Offered in the empty state.
 * @returns {JSX.Element}
 */
export default function PodcastGrid({ podcasts, genres, onClearFilters }) {
  if (podcasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
        <svg
          className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">No podcasts found</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try a different search or genre.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm hover:opacity-80 transition"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} genres={genres} />
      ))}
    </div>
  );
}
