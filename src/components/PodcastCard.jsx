import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate.js";
import { useFavourites } from "../context/FavouritesContext.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { useNavigate } from "react-router-dom";

/**
 * A podcast preview card that links to the show's detail page.
 * If any episode of the show is favourited, a heart badge appears on the cover.
 *
 * @param {Object} props
 * @param {Object} props.podcast - The podcast to display.
 * @param {Object[]} props.genres - The genre list, used to map ids to titles.
 * @returns {JSX.Element}
 */
export default function PodcastCard({ podcast, genres }) {
  const { favourites } = useFavourites();
  const { setGenre } = useFilters();
  const navigate = useNavigate();

  // how many episodes of this show the user has saved
  const savedCount = favourites.filter((f) => f.showId === podcast.id).length;

  // tapping a genre tag filters the landing page by that genre
  const genreTags = podcast.genres.map((id) => {
    const match = genres.find((genre) => genre.id === id);
    return (
      <button
        key={id}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setGenre(String(id));
          navigate("/");
        }}
        title={`Show all ${match ? match.title : "these"} podcasts`}
        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[0.78rem] px-2.5 py-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      >
        {match ? match.title : `Unknown (${id})`}
      </button>
    );
  });

  return (
    <Link
      to={`/show/${podcast.id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-2xl"
    >
      <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-lg hover:-translate-y-1 h-full">
        <div className="p-4 pb-0">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#9aa1ac] flex items-center justify-center text-gray-50 font-medium">
            <span>Podcast Cover</span>
            {podcast.image && (
              <img
                src={podcast.image}
                alt={podcast.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}

            {/* shows the user has saved episodes from */}
            {savedCount > 0 && (
              <span
                title={`${savedCount} favourited episode${savedCount === 1 ? "" : "s"}`}
                className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-red-500 rounded-full w-7 h-7 flex items-center justify-center shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.7z" />
                </svg>
              </span>
            )}
          </div>
        </div>

        <div className="p-4 pt-3">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-snug mb-2">
            {podcast.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {podcast.seasons} season{podcast.seasons === 1 ? "" : "s"}
          </div>

          <div className="flex flex-wrap gap-2 mb-3.5">{genreTags}</div>

          <p className="text-sm text-gray-400 dark:text-gray-500">
            Updated {formatDate(podcast.updated)}
          </p>
        </div>
      </article>
    </Link>
  );
}
