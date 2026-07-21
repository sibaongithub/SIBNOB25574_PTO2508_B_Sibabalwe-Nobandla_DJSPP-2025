/**
 * Pure helpers for the favourites page, kept out of the component so the logic
 * is easy to follow and test.
 */

/**
 * Builds the unique id for an episode. Episode numbers repeat across shows,
 * so the show and season are part of the id.
 *
 * @param {string} showId
 * @param {number} seasonNumber
 * @param {number} episodeNumber
 * @returns {string}
 */
export function makeEpisodeId(showId, seasonNumber, episodeNumber) {
  return `${showId}-s${seasonNumber}-e${episodeNumber}`;
}

/**
 * Sorts favourites by when they were added or by title.
 *
 * @param {Object[]} list
 * @param {"newest"|"oldest"|"title-az"|"title-za"} sort
 * @returns {Object[]} A new sorted array.
 */
export function sortFavourites(list, sort) {
  const copy = [...list];
  if (sort === "title-az") return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "title-za") return copy.sort((a, b) => b.title.localeCompare(a.title));
  if (sort === "oldest") return copy.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
  return copy.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)); // newest
}

/**
 * Keeps only the favourites from one show. "all" keeps everything.
 *
 * @param {Object[]} list
 * @param {string} showTitle
 * @returns {Object[]}
 */
export function filterFavouritesByShow(list, showTitle) {
  if (showTitle === "all") return list;
  return list.filter((f) => f.showTitle === showTitle);
}

/**
 * Groups favourites under their show title, keeping the order they arrive in.
 *
 * @param {Object[]} list
 * @returns {Object<string, Object[]>}
 */
export function groupByShow(list) {
  return list.reduce((groups, episode) => {
    const key = episode.showTitle;
    if (!groups[key]) groups[key] = [];
    groups[key].push(episode);
    return groups;
  }, {});
}

/**
 * Filters, sorts and groups in one call, the way the favourites page needs it.
 *
 * @param {Object[]} list
 * @param {{sort: string, showTitle: string}} options
 * @returns {Object<string, Object[]>}
 */
export function getGroupedFavourites(list, { sort, showTitle }) {
  return groupByShow(sortFavourites(filterFavouritesByShow(list, showTitle), sort));
}
