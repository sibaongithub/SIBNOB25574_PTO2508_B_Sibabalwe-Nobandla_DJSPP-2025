import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

/**
 * Shows short confirmation messages ("Added to favourites") in the corner.
 * Each toast clears itself after a few seconds.
 *
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Shows a message.
   * @param {string} message
   * @returns {void}
   */
  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* the messages themselves, stacked above the audio player */}
      <div className="fixed bottom-24 right-5 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm px-4 py-2.5 rounded-lg shadow-lg animate-toast"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Lets a component show a toast message.
 * @returns {{showToast: (message: string) => void}}
 */
export function useToast() {
  return useContext(ToastContext);
}
