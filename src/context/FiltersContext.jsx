import { createContext, useContext, useEffect, useState } from "react";

const FiltersContext = createContext(null);

/**
 * Holds the landing page controls (search, genre, sort, page) in one place.
 * It sits above the router, so the view is preserved when the user opens a show
 * and comes back, and the header search can update it from any page.
 *
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export function FiltersProvider({ children }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // go back to page 1 whenever the search, genre or sort changes
  useEffect(() => {
    setPage(1);
  }, [search, genre, sort]);

  /** Clears the search, genre and sort back to their defaults. */
  const resetFilters = () => {
    setSearch("");
    setGenre("all");
    setSort("newest");
    setPage(1);
  };

  const anyFilterActive = search !== "" || genre !== "all" || sort !== "newest";

  return (
    <FiltersContext.Provider
      value={{
        search,
        setSearch,
        genre,
        setGenre,
        sort,
        setSort,
        page,
        setPage,
        resetFilters,
        anyFilterActive,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

/**
 * Gives a component access to the filter controls.
 * @returns {Object}
 */
export function useFilters() {
  return useContext(FiltersContext);
}
