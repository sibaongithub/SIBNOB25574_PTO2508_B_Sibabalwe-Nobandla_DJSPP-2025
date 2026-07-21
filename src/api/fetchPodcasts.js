const API_URL = "https://podcast-api.netlify.app/";

/**
 * Fetches the podcast list from the API and updates the App's state.
 * Sets the data on success, the message on failure, and always stops loading.
 *
 * @param {(data: Object[]) => void} setPodcasts - Stores the fetched podcasts.
 * @param {(message: string) => void} setError - Stores an error message.
 * @param {(value: boolean) => void} setLoading - Toggles the loading state.
 * @returns {void}
 */
export function fetchPodcasts(setPodcasts, setError, setLoading) {
  fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      return res.json();
    })
    .then((data) => setPodcasts(data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}
