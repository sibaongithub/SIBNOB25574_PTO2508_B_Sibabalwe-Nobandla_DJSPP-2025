import { useFavourites } from "../context/FavouritesContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

/**
 * A heart button that favourites or unfavourites an episode.
 * The heart is filled and red when the episode is saved.
 *
 * @param {Object} props
 * @param {Object} props.episode - The episode details to save.
 * @param {string} [props.className] - Extra classes for positioning.
 * @returns {JSX.Element}
 */
export default function FavouriteButton({ episode, className = "" }) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const { showToast } = useToast();
  const saved = isFavourite(episode.episodeId);

  return (
    <button
      onClick={(e) => {
        // don't let the click also follow the surrounding link
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite(episode);
        showToast(saved ? "Removed from favourites" : "Added to favourites");
      }}
      aria-label={saved ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={saved}
      title={saved ? "Remove from favourites" : "Add to favourites"}
      className={`transition hover:scale-110 active:scale-95 ${
        saved ? "text-red-500" : "text-gray-400 dark:text-gray-500 hover:text-red-400"
      } ${className}`}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.7z"
        />
      </svg>
    </button>
  );
}
