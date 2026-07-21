# 🎧 PodcastApp — DJS Portfolio Piece

## Overview
The finished version of the podcast app built through the DJS course. Browse,
search, filter and sort podcasts; open a show to read its details and work
through its seasons and episodes; favourite the episodes you like; and listen
with a global player that keeps playing as you move around the app. It also has
light and dark mode and remembers where you got to in each episode.

**Live demo:** _(add your Vercel link here after deploying)_

---

## Features

### 🔊 Global audio player
- Fixed to the bottom of the screen on every page, and **keeps playing while you
  navigate** — the `<audio>` element lives in `AudioContext`, above the router,
  so it is never unmounted.
- Play / pause, **skip to next / previous episode**, **jump back or forward 15
  seconds**, a draggable seek bar, elapsed and total time.
- **Volume slider and mute**, plus a **queue panel** listing what's coming up so
  you can jump straight to any episode in the season.
- A thin progress line runs along the top of the bar.
- **Warns you before reloading** the page while audio is playing.

### ❤️ Favourites
- Heart button on every episode — filled red when saved, with a toast to confirm.
- Saved in **localStorage**, so favourites survive a refresh.
- A **Favourites page** listing saved episodes **grouped by show**, each showing
  its season and episode number and the **date it was added**.
- **Sort** by Newest / Oldest added or Title A–Z / Z–A, plus a **per-show filter**.
- **Play all** queues up a whole show's favourites.
- The header heart shows a **live count**, and shows with saved episodes get a
  heart badge on their card.

### 🎠 Recommended shows carousel
- A horizontally scrollable row at the top of the landing page.
- Arrow buttons that **loop** around at either end; swipe works on touch devices.
- Each item shows the cover, title and genre tags, and links to the show page.

### 🌗 Theme toggle
- Sun / moon button in the header (also in the settings menu).
- Saved in **localStorage** and applied across every page and component.
- Follows your system preference on a first visit.

### ⚙️ Settings menu
- Switch theme, **reset listening history**, or **clear all favourites** — both
  destructive actions ask for confirmation first.

### ⏱ Listening progress (stretch goal)
- Remembers how far you got in each episode and **resumes from there** (the play
  button even changes to "Resume").
- Marks episodes **✓ Finished** once played to the end, and auto-plays the next.
- Shows a progress bar and how far in you were.

### 📚 Season navigation
- **Every season is listed** with its cover and episode count, and each one
  **expands and collapses** on click (with **Expand all / Collapse all**).
- A **"Jump to season"** dropdown opens a season and scrolls straight to it.
- Only open seasons render their episodes, so long shows stay manageable.

### Carried over from earlier stages
- Search (works from the header on any page), genre filter, **sorting by
  Recently Updated, Most Popular, Title A–Z and Title Z–A**, and pagination —
  all working together without resetting each other.
- **Genre tags are clickable** anywhere they appear and filter the landing page.
- **Keyboard shortcuts** while something is playing: space to play/pause,
  left/right arrows to jump 15 seconds, `m` to mute.
- Show detail pages on their own routes, with the season navigation above.
- Loading, error (with **Try again**), empty and **404** states throughout.
- Responsive from mobile to desktop, with a mobile menu.

---

## Tech Used
- **React** — functional components with `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`
- **React Context** — theme, favourites, audio, podcasts, filters, toasts
- **React Router** — routing and dynamic show pages
- **localStorage** — favourites, theme and listening progress
- **Tailwind CSS** (CDN, `darkMode: "class"`)
- **Vite** — dev server and build

---

## Project Structure
```
portfolio/
├── index.html          Tailwind config, favicon, social meta tags
├── vercel.json         SPA fallback so /show/123 works on a direct load
├── public/favicon.svg
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx        wraps the app in the providers + router
    ├── App.jsx         routes (home, show, favourites, 404) + the player
    ├── data.js         genre list
    ├── index.css       base styles, spinner, toast animation
    ├── api/            fetchPodcasts.js, fetchShow.js
    ├── context/        ThemeContext, ToastContext, FavouritesContext,
    │                   AudioContext, PodcastsContext, FiltersContext
    ├── pages/          HomePage, ShowPage, FavouritesPage
    ├── components/     Header, SettingsMenu, ThemeToggle, Carousel, Controls,
    │                   PodcastCard, PodcastGrid, Pagination, SeasonNav,
    │                   EpisodeCard, FavouriteButton, AudioPlayer
    └── utils/          formatDate.js, formatTime.js, filterPodcasts.js,
                        favourites.js
```

---

## How to Run Locally
1. Open the `portfolio` folder in your terminal.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the address Vite prints (usually `http://localhost:5173`).

Build for production with `npm run build`, preview it with `npm run preview`.

---

## Deploying to Vercel
1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com) choose **Add New → Project** and import the repo.
3. Vercel detects Vite automatically (build `npm run build`, output `dist`) → **Deploy**.
4. `vercel.json` is included, so direct links like `/show/10716` load correctly
   instead of returning a 404.
5. Add a custom domain under **Settings → Domains** if you want one.

---

## How Key Features Work (for the panel review)
- **Audio persistence** — one `<audio>` element is rendered inside
  `AudioProvider`, which sits above `<BrowserRouter>`. Changing route re-renders
  the pages but never unmounts the provider, so playback continues.
- **The queue** — pressing play on an episode passes the whole season's episode
  list to `playEpisode`, so next/previous and auto-play-next work.
- **Favourites** — `FavouritesContext` keeps an array and writes it to
  `localStorage` in a `useEffect`. Each episode gets a unique id
  (`showId-s{season}-e{episode}`), because episode numbers repeat across shows.
  The sorting and grouping live in `utils/favourites.js` as pure functions.
- **Theme** — `ThemeContext` toggles a `dark` class on `<html>`; Tailwind's
  `darkMode: "class"` makes every `dark:` class respond.
- **State preservation** — search / genre / sort / page live in `FiltersContext`,
  above the router, so returning from a show restores the exact view. It's also
  why the header search box works from any page.

---

## Known Limitations
- The API provides a **placeholder audio file**, so every episode plays the same
  short track. The player logic is real; only the audio source is shared.
- Episode duration and per-episode air dates aren't in the API, so they aren't
  shown on the episode rows.
