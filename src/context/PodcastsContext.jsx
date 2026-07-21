import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchPodcasts } from "../api/fetchPodcasts.js";

const PodcastsContext = createContext(null);

/**
 * Fetches the podcast list once and shares it with the whole app.
 * Also exposes a retry, so the error state can offer a "Try again" button.
 *
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export function PodcastsProvider({ children }) {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPodcasts(setPodcasts, setError, setLoading);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PodcastsContext.Provider value={{ podcasts, loading, error, retry: load }}>
      {children}
    </PodcastsContext.Provider>
  );
}

/**
 * Gives a component access to the podcast list.
 * @returns {{podcasts: Object[], loading: boolean, error: string|null, retry: () => void}}
 */
export function usePodcasts() {
  return useContext(PodcastsContext);
}
