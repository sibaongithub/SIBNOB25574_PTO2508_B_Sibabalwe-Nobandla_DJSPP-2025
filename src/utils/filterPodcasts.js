/**
 * Pure functions for searching, filtering and sorting the podcast list.
 * They take a list plus options and return a new list (no mutation), so they
 * are easy to combine and predictable.
 */

/**
 * Keeps podcasts whose title contains the search text (case-insensitive).
 * @param {Object[]} list
 * @param {string} text
 * @returns {Object[]}
 */
export function searchByTitle(list, text) {
  const query = text.trim().toLowerCase();
  if (!query) return list;
  return list.filter((podcast) => podcast.title.toLowerCase().includes(query));
}

/**
 * Keeps podcasts that belong to the given genre id. "all" means no filtering.
 * @param {Object[]} list
 * @param {string} genre - A genre id as a string, or "all".
 * @returns {Object[]}
 */
export function filterByGenre(list, genre) {
  if (genre === "all") return list;
  const id = Number(genre);
  return list.filter((podcast) => podcast.genres.includes(id));
}

/**
 * Returns a sorted copy of the list.
 * @param {Object[]} list
 * @param {"newest"|"popular"|"title-az"|"title-za"} sort
 * @returns {Object[]}
 */
export function sortPodcasts(list, sort) {
  const copy = [...list];
  if (sort === "title-az") return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "title-za") return copy.sort((a, b) => b.title.localeCompare(a.title));
  // most seasons first (carried over from the first version of the app)
  if (sort === "popular") return copy.sort((a, b) => b.seasons - a.seasons);
  // default: newest first by last updated date
  return copy.sort((a, b) => new Date(b.updated) - new Date(a.updated));
}

/**
 * Applies search, then genre filter, then sort, in one call.
 * @param {Object[]} list
 * @param {{ search: string, genre: string, sort: string }} options
 * @returns {Object[]}
 */
export function getVisiblePodcasts(list, { search, genre, sort }) {
  const searched = searchByTitle(list, search);
  const filtered = filterByGenre(searched, genre);
  return sortPodcasts(filtered, sort);
}
