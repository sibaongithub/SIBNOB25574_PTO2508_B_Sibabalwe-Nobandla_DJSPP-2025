import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SettingsMenu from "./SettingsMenu.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { useFavourites } from "../context/FavouritesContext.jsx";

/**
 * The top navigation bar: logo, page links, a search box that works from any
 * page, a favourites shortcut with a count, and the settings menu.
 * On a show page it also shows a back button.
 *
 * @param {Object} props
 * @param {boolean} [props.showBackButton=false] - Whether to show the back arrow.
 * @returns {JSX.Element}
 */
export default function Header({ showBackButton = false }) {
  const { search, setSearch } = useFilters();
  const { favourites } = useFavourites();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);

  // focus the search box as soon as it opens
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  /**
   * Types into the search box. Searching always sends the user to the
   * landing page, since that's where the results are shown.
   * @param {string} value
   */
  function handleSearch(value) {
    setSearch(value);
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-gray-900 dark:text-white font-semibold"
      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors";

  const iconBtn =
    "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors";

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
        {/* left: back + logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {showBackButton && (
            <Link
              to="/"
              aria-label="Back to home"
              className="w-9 h-9 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center hover:opacity-80 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100"
          >
            <svg
              className="w-7 h-7 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 20.662V19a5 5 0 0 1 10 0v1.662" />
            </svg>
            <span className="hidden xs:inline sm:inline">PodcastApp</span>
          </Link>
        </div>

        {/* middle: page links (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-[15px]">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/favourites" className={linkClass}>
            Favourites
          </NavLink>
        </nav>

        {/* right: search, favourites, settings */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* search: expands into an input */}
          {searchOpen ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onBlur={() => !search && setSearchOpen(false)}
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                placeholder="Search podcasts…"
                className="w-40 sm:w-64 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className={iconBtn}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}

          {/* favourites shortcut with a count badge */}
          <Link to="/favourites" aria-label="Favourites" className={`${iconBtn} relative`}>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill={favourites.length ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.7z"
              />
            </svg>
            {favourites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {favourites.length}
              </span>
            )}
          </Link>

          <ThemeToggle />

          <SettingsMenu />

          {/* mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className={`${iconBtn} md:hidden`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col gap-3 bg-white dark:bg-gray-900">
          <NavLink to="/" className={linkClass} end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/favourites" className={linkClass} onClick={() => setMenuOpen(false)}>
            Favourites
          </NavLink>
        </nav>
      )}
    </header>
  );
}
