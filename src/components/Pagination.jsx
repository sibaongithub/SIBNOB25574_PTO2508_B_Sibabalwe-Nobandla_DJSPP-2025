/**
 * Page navigation: Previous / numbered pages / Next.
 * Renders nothing when there is only one page.
 *
 * @param {Object} props
 * @param {number} props.currentPage - The active page (1-based).
 * @param {number} props.pageCount - Total number of pages.
 * @param {(page: number) => void} props.onPageChange - Called with the new page.
 * @returns {JSX.Element|null}
 */
export default function Pagination({ currentPage, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const base =
    "min-w-9 h-9 px-3 rounded-lg border text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed";
  const normal =
    "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700";
  const active = "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100 text-white dark:text-gray-900";

  return (
    <nav className="flex items-center justify-center flex-wrap gap-2 mt-10" aria-label="Pagination">
      <button
        className={`${base} ${normal}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`${base} ${page === currentPage ? active : normal}`}
        >
          {page}
        </button>
      ))}

      <button
        className={`${base} ${normal}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        Next
      </button>
    </nav>
  );
}
