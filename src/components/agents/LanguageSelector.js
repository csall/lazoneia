"use client";
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function LanguageSelector({
  languages = [],
  value,
  onChange,
  isLight,
  buttonClass="",
  listClass="",
  compact = true,
  autoSubmitLabel='Auto'
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const current = languages.find(l => l.value === value);

  const close = useCallback(()=> setOpen(false), []);
  const toggle = () => setOpen(o=>!o);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); btnRef.current?.focus(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = listRef.current?.querySelectorAll('[data-lang-item]');
        if (!items || !items.length) return;
        const idx = Array.from(items).findIndex(n => n.getAttribute('data-selected')==='true');
        let next = idx;
        if (e.key === 'ArrowDown') next = (idx + 1) % items.length; else next = (idx - 1 + items.length) % items.length;
        items[next]?.focus();
      }
    };
    const onClickOut = (e) => {
      if (!listRef.current || listRef.current.contains(e.target) || btnRef.current?.contains(e.target)) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOut);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClickOut); };
  }, [open, close]);

  const baseBtn = compact ? 'gap-1 px-2 py-1 h-7' : 'gap-1.5 px-2.5 py-1.5';

  return (
    <div className="relative inline-block text-[10px] font-medium">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className={`flex items-center rounded-md border ${baseBtn} leading-none select-none transition
          border-gray-300/70 dark:border-white/15 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 ${buttonClass}`}
      >
        <span className="flex items-center justify-center w-4 h-4 rounded overflow-hidden bg-white/20 ring-1 ring-black/5 dark:ring-white/10">
          <Image src={`https://flagcdn.com/${current?.flag || 'fr'}.svg`} alt={current?.label || 'Lang'} width={16} height={16} className="object-cover" unoptimized />
        </span>
        <span className="uppercase tracking-wide">{current?.label || 'LANG'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ml-0.5 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
      </button>
      {open && (
        <div
          ref={listRef}
          role="listbox"
          className={`absolute top-9 right-0 z-40 w-48 max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/15 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-2 flex flex-col gap-1 text-gray-800 dark:text-gray-100 text-[11px] ${listClass}`}
        >
          {languages.map((lang) => {
            const selected = lang.value === value;
            return (
              <button
                key={lang.value}
                data-lang-item
                data-selected={selected}
                onClick={() => { onChange?.(lang.value); close(); }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition border text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${selected ? 'bg-gradient-to-r from-indigo-500/25 to-violet-500/25 text-indigo-700 dark:text-indigo-300 border-indigo-400/40 shadow-sm' : 'border-transparent'}`}
              >
                <Image src={`https://flagcdn.com/${lang.flag}.svg`} alt={lang.label} width={18} height={18} className="rounded object-cover ring-1 ring-black/5 dark:ring-white/10" unoptimized />
                <span className="truncate">{lang.label}</span>
                {selected && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-auto text-indigo-600 dark:text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
