"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import AgentCard from "./AgentCard";

const AgentDisplay = ({ filter, favorites, toggleFavorite }) => {
  const [agents, setAgents] = useState([
    { id: 1, name: "Max", role: "marketing", description: "Assistant spécialisé dans le marketing digital et la stratégie de contenu." },
    { id: 2, name: "Clara", role: "communication", description: "Experte en communication d'entreprise et relations publiques." },
    { id: 3, name: "Olivier", role: "marketing", description: "Spécialiste en analyse de marché et tendances marketing." },
    { id: 4, name: "Glow", role: "communication", description: "Assistant de communication visuelle et identité de marque." },
    { id: 5, name: "Scribo", role: "marketing", description: "Rédacteur de contenu marketing et copywriting." },
    { id: 6, name: "Pitchy", role: "communication", description: "Expert en présentation et pitch commercial." },
    { id: 7, name: "Punchy", role: "marketing", description: "Spécialiste des campagnes marketing à fort impact." },
    { id: 8, name: "Lingo", role: "communication", description: "Assistant multilingue pour la communication internationale." },
    { id: 9, name: "Reply", role: "communication", description: "Expert en gestion de la communication client et service." },
    { id: 10, name: "Charm", role: "marketing", description: "Spécialiste en marketing d'influence et relations." }
  ]);

  const [filteredAgents, setFilteredAgents] = useState(agents);

  // Filtrer les agents en fonction du filtre sélectionné
  useEffect(() => {
    let filtered = [];
    
    if (filter === "all") {
      filtered = agents;
    } else if (filter === "favorites") {
      filtered = agents.filter(agent => favorites.includes(agent.id));
    } else {
      filtered = agents.filter(agent => agent.role === filter);
    }
    
    setFilteredAgents(filtered);
  }, [filter, favorites, agents]);

  // Animation des conteneurs
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {filteredAgents.length === 0 ? (
        <motion.div 
          className="w-full flex flex-col items-center justify-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="mb-6 mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30"
              animate={{ 
                scale: [1, 1.05, 1],
                borderColor: ["rgba(99, 102, 241, 0.3)", "rgba(168, 85, 247, 0.4)", "rgba(99, 102, 241, 0.3)"]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <svg className="w-12 h-12 text-indigo-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold text-gray-200 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Aucun agent trouvé
            </motion.h3>
            <motion.p 
              className="text-gray-400 max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {filter === "favorites" ? 
                "Vous n'avez pas encore ajouté d'agents à vos favoris. Cliquez sur l'étoile d'un agent pour l'ajouter." :
                "Aucun agent ne correspond au filtre sélectionné. Essayez un autre filtre."}
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3"
          variants={containerVariants}
        >
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isFavorite={favorites.includes(agent.id)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AgentDisplay;
