"use client";
import { useState, useEffect, useRef } from 'react';

// Simple persistent state hook with JSON serialization and optional TTL.
export function usePersistentState(key, initialValue, { ttl } = {}) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return initialValue;
      const parsed = JSON.parse(raw);
      if (ttl && parsed && parsed._ts && Date.now() - parsed._ts > ttl) {
        window.localStorage.removeItem(key);
        return initialValue;
      }
      return parsed?.data ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try {
      const payload = ttl ? { _ts: Date.now(), data: value } : { data: value };
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [key, value, ttl]);

  return [value, setValue];
}
