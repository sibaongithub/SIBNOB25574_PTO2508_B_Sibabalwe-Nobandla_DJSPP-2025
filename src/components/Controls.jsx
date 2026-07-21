/**
 * The controls toolbar: search box, genre filter and sort dropdown.
 * App owns the values and passes the change handlers in.
 *
 * @param {Object} props
 * @param {string} props.search - Current search text.
 * @param {(value: string) => void} props.onSearch - Updates the search text.
 * @param {string} props.genre - Selected genre id (or "all").
 * @param {(value: string) => void} props.onGenre - Updates the genre.
 * @param {string} props.sort - Current sort option.
 * @param {(value: string) => void} props.onSort - Updates the sort.
 * @param {Object[]} props.genres - The genre list for the dropdown.
 * @returns {JSX.Element}
 */
export default function Controls({ search, onSearch, genre, onGenre, sort, onSort, genres }) {
  const field =
    "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-[15px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-7">
      <div className="relative flex-1 max-w-md">
        <svg
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search podcasts…"
          className={`w-full pl-9 pr-3 py-2 ${field}`}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300">Filter by:</span>

        <select
          value={genre}
          onChange={(e) => onGenre(e.target.value)}
          className={`px-3.5 py-2 cursor-pointer ${field}`}
        >
          <option value="all">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className={`px-3.5 py-2 cursor-pointer ${field}`}
        >
          <option value="newest">Recently Updated</option>
          <option value="popular">Most Popular</option>
          <option value="title-az">Title A–Z</option>
          <option value="title-za">Title Z–A</option>
        </select>
      </div>
    </div>
  );
}
