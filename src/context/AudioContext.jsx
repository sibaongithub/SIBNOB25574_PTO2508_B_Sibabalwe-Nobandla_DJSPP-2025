import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioContext = createContext(null);

/** Key used to store listening progress in localStorage. */
const PROGRESS_KEY = "podcast-progress";

/**
 * The API only gives a placeholder audio file, so every episode plays this.
 * Kept in one place so it's easy to swap later.
 */
export const PLACEHOLDER_AUDIO = "https://podcast-api.netlify.app/placeholder-audio.mp3";

/**
 * Owns the single <audio> element for the whole app. Because this provider sits
 * above the router, audio keeps playing while the user moves between pages.
 * Also keeps a queue (so skip back/forward work) and saves listening progress.
 *
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export function AudioProvider({ children }) {
  const audioRef = useRef(null);

  const [queue, setQueue] = useState([]); // episodes lined up to play
  const [index, setIndex] = useState(-1); // which one is playing
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // listening progress per episode: { [episodeId]: { position, finished } }
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const track = index >= 0 && queue[index] ? queue[index] : null;

  // save progress whenever it changes
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  // warn before reloading while audio is playing
  useEffect(() => {
    const warn = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isPlaying]);

  /**
   * Loads an episode into the audio element and plays it, resuming from the
   * saved position if there is one.
   * @param {Object} episode
   * @returns {void}
   */
  function load(episode) {
    const audio = audioRef.current;
    if (!audio || !episode) return;

    audio.src = PLACEHOLDER_AUDIO;
    audio.load();

    const saved = progress[episode.episodeId];
    const startAt = saved && !saved.finished ? saved.position : 0;

    audio.oncanplay = () => {
      audio.currentTime = startAt || 0;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      audio.oncanplay = null;
    };
  }

  /**
   * Starts an episode. Pass the rest of the season as `list` so skip
   * forward/back can move through it.
   * @param {Object} episode - The episode to play.
   * @param {Object[]} [list] - The full list this episode belongs to.
   * @returns {void}
   */
  const playEpisode = (episode, list) => {
    // clicking the episode that's already loaded just toggles play/pause
    if (track && track.episodeId === episode.episodeId) {
      togglePlay();
      return;
    }

    const newQueue = list && list.length ? list : [episode];
    const newIndex = newQueue.findIndex((e) => e.episodeId === episode.episodeId);

    setQueue(newQueue);
    setIndex(newIndex >= 0 ? newIndex : 0);
    load(episode);
  };

  /** Plays if paused, pauses if playing. */
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  /** Plays the next episode in the queue, if there is one. */
  const playNext = () => {
    if (index < queue.length - 1) {
      const next = index + 1;
      setIndex(next);
      load(queue[next]);
    }
  };

  /**
   * Goes back to the start of the episode, or to the previous one if we're
   * already near the beginning (the way most players behave).
   */
  const playPrevious = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    if (index > 0) {
      const prev = index - 1;
      setIndex(prev);
      load(queue[prev]);
    }
  };

  /**
   * Jumps to a point in the episode.
   * @param {number} seconds
   * @returns {void}
   */
  const seek = (seconds) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = seconds;
    setCurrentTime(seconds);
  };

  /**
   * Skips forward or back by a number of seconds.
   * @param {number} amount - Use a negative number to go back.
   * @returns {void}
   */
  const skipBy = (amount) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.min(Math.max(0, audio.currentTime + amount), audio.duration || 0);
    audio.currentTime = next;
    setCurrentTime(next);
  };

  /**
   * Sets the volume (and unmutes).
   * @param {number} value - Between 0 and 1.
   * @returns {void}
   */
  const changeVolume = (value) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = value;
      audio.muted = false;
    }
    setVolume(value);
    setMuted(false);
  };

  /** Mutes or unmutes the player. */
  const toggleMute = () => {
    const audio = audioRef.current;
    const next = !muted;
    if (audio) audio.muted = next;
    setMuted(next);
  };

  /** Jumps to a specific episode in the queue. @param {number} i */
  const playFromQueue = (i) => {
    if (i >= 0 && i < queue.length) {
      setIndex(i);
      load(queue[i]);
    }
  };

  /** Stops playback and clears the player. */
  const closePlayer = () => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    setIsPlaying(false);
    setQueue([]);
    setIndex(-1);
  };

  /** Forgets all saved listening progress. */
  const resetProgress = () => setProgress({});

  /**
   * Looks up how far the user got in an episode.
   * @param {string} episodeId
   * @returns {{position: number, finished: boolean}|undefined}
   */
  const getProgress = (episodeId) => progress[episodeId];

  /** Keeps the UI in step with the audio and saves progress as it plays. */
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);

    if (track && audio.duration) {
      setProgress((prev) => ({
        ...prev,
        [track.episodeId]: {
          position: audio.currentTime,
          duration: audio.duration,
          finished: audio.currentTime >= audio.duration - 1,
        },
      }));
    }
  };

  /** When an episode finishes, mark it done and roll on to the next one. */
  const handleEnded = () => {
    if (track) {
      setProgress((prev) => ({
        ...prev,
        [track.episodeId]: { position: 0, duration, finished: true },
      }));
    }
    if (index < queue.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        track,
        queue,
        index,
        isPlaying,
        currentTime,
        duration,
        volume,
        muted,
        playEpisode,
        togglePlay,
        playNext,
        playPrevious,
        playFromQueue,
        seek,
        skipBy,
        changeVolume,
        toggleMute,
        closePlayer,
        getProgress,
        resetProgress,
        hasNext: index >= 0 && index < queue.length - 1,
        hasPrevious: index > 0,
      }}
    >
      {children}
      {/* the one audio element for the whole app */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </AudioContext.Provider>
  );
}

/**
 * Gives a component access to the audio player.
 * @returns {Object} The player state and controls.
 */
export function useAudio() {
  return useContext(AudioContext);
}
