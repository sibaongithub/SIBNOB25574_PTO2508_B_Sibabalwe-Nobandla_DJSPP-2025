const BASE_URL = "https://podcast-api.netlify.app/id/";

/**
 * Fetches one show (with its seasons and episodes) by id and updates state.
 *
 * @param {string} id - The show id from the route.
 * @param {(show: Object) => void} setShow - Stores the fetched show.
 * @param {(message: string) => void} setError - Stores an error message.
 * @param {(value: boolean) => void} setLoading - Toggles the loading state.
 * @returns {void}
 */
export function fetchShow(id, setShow, setError, setLoading) {
  setLoading(true);
  setError(null);
  fetch(BASE_URL + id)
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      return res.json();
    })
    .then((data) => setShow(data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}
