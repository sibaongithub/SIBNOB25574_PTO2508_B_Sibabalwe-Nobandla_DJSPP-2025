import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ShowPage from "./pages/ShowPage.jsx";
import FavouritesPage from "./pages/FavouritesPage.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";
import Header from "./components/Header.jsx";

/**
 * Shown when a URL doesn't match any route.
 * @returns {JSX.Element}
 */
function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-[1400px] mx-auto px-5 py-24 text-center">
        <p className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">404</p>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          We couldn't find that page.
        </p>
        <Link
          to="/"
          className="inline-block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-2.5 rounded-lg hover:opacity-80 transition"
        >
          Back to home
        </Link>
      </main>
    </>
  );
}

/**
 * App - the routes plus the player, which sits outside the routes so audio
 * keeps playing while the user moves around.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/show/:id" element={<ShowPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AudioPlayer />
    </div>
  );
}
