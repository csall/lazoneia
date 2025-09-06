"use client";
import { useEffect, useState } from 'react';

export default function Toast({ message, duration = 1600, onDone }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), duration - 250);
    const done = setTimeout(() => onDone?.(), duration);
    return () => { clearTimeout(hide); clearTimeout(done); };
  }, [duration, onDone]);

  if (!visible) return null;
  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[999] px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-md border border-white/20 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 text-gray-800 dark:text-gray-100 animate-[fadeIn_.25s_ease,fadeOut_.25s_ease_1.3s]"
      role="status"
      aria-live="polite"
    >
      {message}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 4px);} to { opacity: 1; transform: translate(-50%,0);} }
        @keyframes fadeOut { to { opacity: 0; transform: translate(-50%,2px);} }
      `}</style>
    </div>
  );
}
