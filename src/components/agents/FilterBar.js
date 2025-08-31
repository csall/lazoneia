import { motion } from "framer-motion";

export default function FilterBar({ filter, setFilter, agents, favorites }) {
  const allCount = agents.length;
  const favoritesCount = agents.filter(a => favorites.includes(a.name)).length;
  const marketingCount = agents.filter(a => a.category === "marketing").length;
  const communicationCount = agents.filter(a => a.category === "communication").length;
  const filters = [
    { value: "all", label: "Tous", count: allCount },
    { value: "favorites", label: "Favoris", count: favoritesCount },
    { value: "marketing", label: "Marketing", count: marketingCount },
    { value: "communication", label: "Communication", count: communicationCount },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide mb-6 sm:mb-8 relative z-50">
      <div className="inline-flex flex-nowrap gap-2 py-2 items-center bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-blue-400/20"
        style={{
          minHeight: '44px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}>
        {filters.map((cat, idx) => (
          <motion.button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            whileHover={{ scale: 1.08, boxShadow: "0 0 16px #3b82f6" }}
            initial={{ opacity: 0, x: 40 * idx }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * idx }}
            className={`px-2 py-1 rounded-full text-sm font-semibold transition-colors flex items-center gap-1 border-2 snap-center mx-0.5 min-w-[64px] sm:min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400
              ${filter === cat.value
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400 shadow-xl'
                : 'bg-white/10 text-blue-200 border-transparent hover:bg-blue-700/20'}
              `}
            style={{ cursor: 'pointer', touchAction: 'manipulation' }}
          >
            <span className="drop-shadow-lg whitespace-nowrap">{cat.label}</span>
            <span className="bg-blue-700/30 text-blue-100 px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
              {cat.count}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
