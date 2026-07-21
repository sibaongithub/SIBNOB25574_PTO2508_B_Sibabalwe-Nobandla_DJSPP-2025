import { createContext, useContext, useEffect, useState } from "react";

const FavouritesContext = createContext(null);

/** Key used to store favourites in localStorage. */
const STORAGE_KEY = "podcast-favourites";

/**
 * Holds the user's favourite episodes and keeps them in localStorage so they
 * survive a refresh.
 *
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // save whenever the list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  /**
   * Checks whether an episode is already favourited.
   * @param {string} episodeId
   * @returns {boolean}
   */
  const isFavourite = (episodeId) => favourites.some((f) => f.episodeId === episodeId);

  /**
   * Adds an episode to favourites, or removes it if it's already there.
   * Stores the show/season details so the favourites page can show them.
   * @param {Object} episode - The episode details to save.
   * @returns {void}
   */
  const toggleFavourite = (episode) => {
    setFavourites((current) => {
      const exists = current.some((f) => f.episodeId === episode.episodeId);
      if (exists) return current.filter((f) => f.episodeId !== episode.episodeId);
      return [...current, { ...episode, addedAt: new Date().toISOString() }];
    });
  };

  /** Removes every favourite. */
  const clearFavourites = () => setFavourites([]);

  return (
    <FavouritesContext.Provider
      value={{ favourites, isFavourite, toggleFavourite, clearFavourites }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

/**
 * Gives a component access to the favourites list and its actions.
 * @returns {{favourites: Object[], isFavourite: Function, toggleFavourite: Function, clearFavourites: Function}}
 */
export function useFavourites() {
  return useContext(FavouritesContext);
}
