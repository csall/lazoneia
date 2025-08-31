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
    <div className="w-full overflow-x-auto scrollbar-hide mb-4 sm:mb-8 relative z-50 px-2 sm:px-0">
      <div className="inline-flex flex-nowrap gap-1 sm:gap-2 py-1 sm:py-2 items-center bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-blue-400/20"
        style={{
          minHeight: '36px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}>
              {filters.map((cat, idx) => (
                <motion.button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  whileHover={{ scale: 1.12, rotate: 2, boxShadow: "0 0 24px #6366f1, 0 0 6px #3b82f6" }}
                  whileTap={{ scale: 0.95, rotate: -2 }}
                  initial={{ opacity: 0, x: 32 * idx }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * idx }}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-sm sm:text-base font-bold transition-colors flex items-center gap-1 sm:gap-2 border-2 snap-center mx-0.5 sm:mx-1 min-w-[60px] sm:min-w-[90px] focus:outline-none focus:ring-2 focus:ring-blue-400 relative overflow-hidden
                    ${filter === cat.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400 shadow-2xl'
                      : 'bg-white/10 text-blue-200 border-transparent hover:bg-blue-700/20'}
                    `}
                  style={{ cursor: 'pointer', touchAction: 'manipulation' }}
                >
                  {/* Shine animation on active */}
                  {filter === cat.value && (
                    <motion.div
                      className="absolute left-0 top-0 w-full h-full pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.5, 0.2], x: [0, 40, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 100%)" }}
                    />
                  )}
                  <span className="drop-shadow-lg whitespace-nowrap relative z-10 text-xs sm:text-sm">{cat.label}</span>
                  <span className="bg-blue-700/30 text-blue-100 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shadow-md relative z-10">
                    {cat.count}
                  </span>
                  {/* Glowing underline for active filter */}
                  {filter === cat.value && (
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-2/3 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 blur-md"
                      initial={{ opacity: 0, scaleX: 0.5 }}
                      animate={{ opacity: [0.7, 1, 0.7], scaleX: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
                )
        }
