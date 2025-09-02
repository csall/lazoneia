"use client";
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext({ theme:'light', toggle:()=>{}, setTheme:()=>{} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Init
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('theme');
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 640;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else {
      if (isMobile) setTheme('light'); else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, []);

  // Apply attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
