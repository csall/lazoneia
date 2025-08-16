"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              À propos de La Zone IA
            </h1>
            <p className="text-xl text-blue-100">
              Découvrez notre histoire et notre mission d&apos;innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold mb-4 text-blue-200">Notre Vision</h2>
              <p className="text-lg mb-4 text-blue-50">
                Chez La Zone IA, nous croyons que l&apos;intelligence artificielle devrait être accessible, 
                utile et amusante. Notre vision est de créer des agents IA qui ne sont pas seulement 
                technologiquement avancés mais aussi dotés de personnalités uniques.
              </p>
              <p className="text-lg text-blue-50">
                Nous combinons les dernières avancées en IA avec une approche centrée sur l&apos;humain 
                pour créer des assistants qui comprennent vraiment vos besoins et y répondent de 
                manière engageante.
              </p>
            </motion.div>
            <motion.div
              className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-md rounded-2xl border border-white/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8">
                  <Image
                    src="/punchy-bot.svg"
                    alt="Olivier l'humoriste"
                    width={100}
                    height={100}
                  />
                  <Image
                    src="/glow-bot.svg"
                    alt="Clara la séductrice"
                    width={100}
                    height={100}
                  />
                  <Image
                    src="/reply-bot.svg"
                    alt="Max l'analyste"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 p-8 rounded-3xl backdrop-blur-md shadow-lg border border-blue-500/20 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-semibold mb-6 text-center text-blue-200">Notre Équipe</h2>
            <p className="text-lg mb-6 text-blue-50">
              Fondée en 2023 par une équipe de passionnés d&apos;intelligence artificielle et 
              d&apos;expérience utilisateur, La Zone IA réunit des talents exceptionnels du monde 
              de la technologie, du design et de la psychologie cognitive.
            </p>
            <p className="text-lg text-blue-50">
              Notre équipe multidisciplinaire travaille sans relâche pour créer des agents IA qui 
              ne sont pas seulement intelligents, mais aussi empathiques et engageants. Nous croyons 
              que la technologie devrait se mettre au service de l&apos;humain et non l&apos;inverse.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-semibold mb-4 text-blue-200">Notre Technologie</h2>
            <p className="text-lg mb-4 text-blue-50">
              Nos agents IA sont construits sur des modèles de langage avancés, optimisés pour 
              comprendre le contexte, reconnaître les émotions et générer des réponses pertinentes 
              et engageantes.
            </p>
            <p className="text-lg mb-8 text-blue-50">
              Nous avons également développé des algorithmes propriétaires permettant à nos agents 
              d&apos;adopter des personnalités distinctes et cohérentes, rendant chaque interaction plus 
              humaine et mémorable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "IA Conversationnelle",
                  description: "Dialogues naturels et contextuels pour une expérience fluide"
                },
                {
                  title: "Reconnaissance d'Émotions",
                  description: "Nos agents peuvent détecter et répondre aux émotions humaines"
                },
                {
                  title: "Personnalisation Avancée",
                  description: "Adaptation des réponses au style et aux préférences de l'utilisateur"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="bg-blue-800/20 p-5 rounded-xl backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + (i * 0.1) }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-blue-200">{feature.title}</h3>
                  <p className="text-blue-50">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
