"use client";
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

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
  const [isMobile, setIsMobile] = useState(false);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const current = languages.find(l => l.value === value);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const close = useCallback(()=> setOpen(false), []);
  const toggle = () => setOpen(o=>!o);

  // Detect mobile viewport (simple breakpoint < 640px)
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Empêche le scroll arrière-plan sur mobile quand ouvert
  useEffect(() => {
    if (!isMobile) return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open, isMobile]);

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
      if (isMobile) return; // mobile uses dedicated overlay backdrop
      if (!listRef.current || listRef.current.contains(e.target) || btnRef.current?.contains(e.target)) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOut);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClickOut); };
  }, [open, close, isMobile]);

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
          {mounted && (
            <Image src={`https://flagcdn.com/${current?.flag || 'fr'}.svg`} alt={current?.label || 'Lang'} width={16} height={16} className="object-cover" unoptimized />
          )}
        </span>
        <span className="uppercase tracking-wide">{mounted ? (current?.label || 'LANG') : '––'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ml-0.5 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
      </button>
      {open && !isMobile && (
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
          {open && isMobile && mounted && createPortal(
            <div className="fixed inset-0 z-[80]">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={close} />
              <div className="absolute left-1/2 top-3 -translate-x-1/2 w-[94%] sm:w-[86%] max-w-[520px] max-h-[68vh] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/15 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl flex flex-col animate-[fade-in_.25s_ease]" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/70 dark:border-white/10">
                  <h2 className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Langue</h2>
                  <button onClick={close} aria-label="Fermer" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60">
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='w-4 h-4' stroke='currentColor' strokeWidth='2' fill='none' strokeLinecap='round' strokeLinejoin='round'><path d='M18 6 6 18'/><path d='M6 6l12 12'/></svg>
                  </button>
                </div>
                <div ref={listRef} className="p-3 overflow-y-auto grid grid-cols-4 gap-2">
                  {languages.map(lang => {
                    const selected = lang.value === value;
                    return (
                      <button
                        key={lang.value}
                        data-lang-item
                        data-selected={selected}
                        onClick={() => { onChange?.(lang.value); close(); }}
                        className={`flex flex-col items-center gap-1 px-1.5 py-1.5 rounded-md border text-[10px] font-medium transition active:scale-[0.95] ${selected ? 'bg-gradient-to-br from-indigo-500/25 to-violet-500/25 text-indigo-700 dark:text-indigo-300 border-indigo-400/40 shadow-sm' : 'border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10'}`}
                      >
                        <Image src={`https://flagcdn.com/${lang.flag}.svg`} alt={lang.label} width={28} height={28} className="rounded object-cover w-7 h-7" unoptimized />
                        <span className="truncate w-full text-center leading-tight">{lang.label}</span>
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-300" />}
                      </button>
                    );
                  })}
                  {!languages.length && (
                    <div className='col-span-4 text-center text-xs text-gray-500 dark:text-gray-400 py-6'>Aucune langue</div>
                  )}
                </div>
              </div>
            </div>, document.body)
          }
    </div>
  );
}
