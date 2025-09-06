"use client";
export default function ToneSelect({ tones = [], value, onChange, isLight }) {
  if (!tones.length) return null;
  return (
    <label className="relative inline-block" title="Sélection du ton">
      <span className="sr-only">Ton</span>
      <select
        value={value}
        onChange={(e)=>onChange?.(e.target.value)}
        className={`appearance-none pr-6 pl-2.5 py-1.5 rounded-md text-[10px] font-medium border bg-white/70 dark:bg-white/10 border-gray-300/70 dark:border-white/15 hover:bg-white/90 dark:hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${isLight ? 'focus-visible:ring-offset-2 focus-visible:ring-offset-white' : 'focus-visible:ring-offset-0'} cursor-pointer`}
      >
        {tones.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
    </label>
  );
}
