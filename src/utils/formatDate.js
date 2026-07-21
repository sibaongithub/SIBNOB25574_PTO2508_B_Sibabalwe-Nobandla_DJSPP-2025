/**
 * Converts an ISO date string into a readable, localized date.
 * Example output: "November 3, 2022".
 *
 * @param {string} isoString - A valid ISO 8601 date string.
 * @returns {string} The formatted date.
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
