import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { FavouritesProvider } from "./context/FavouritesContext.jsx";
import { AudioProvider } from "./context/AudioContext.jsx";
import { PodcastsProvider } from "./context/PodcastsContext.jsx";
import { FiltersProvider } from "./context/FiltersContext.jsx";
import "./index.css";

// the providers sit above the router so their state survives navigation
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <FavouritesProvider>
          <AudioProvider>
            <PodcastsProvider>
              <FiltersProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </FiltersProvider>
            </PodcastsProvider>
          </AudioProvider>
        </FavouritesProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);
