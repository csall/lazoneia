"use client";

import Link from "next/link";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import AOS from "aos";
import "aos/dist/aos.css";
import Lottie from "lottie-react";

// Import JSON Lottie depuis assets
import botMarketing from "../assets/lotties/bot-marketing.json";
import botSupport from "../assets/lotties/bot-support.json";
import botData from "../assets/lotties/bot-data.json";

// Particles uniquement côté client
const ParticlesBackground = dynamic(() => import("../components/ParticlesBackground"), { ssr: false });

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const agents = [
    { name: "Agent Marketing", description: "Boostez vos ventes grâce à l’automatisation marketing.", animationData: botMarketing },
    { name: "Agent Support", description: "Répondez automatiquement à vos clients 24/7.", animationData: botSupport },
    { name: "Agent Data", description: "Analysez vos données et prenez de meilleures décisions.", animationData: botData },
  ];

  return (
    <main className="relative bg-gradient-to-r from-blue-800 to-purple-600 text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <ParticlesBackground />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-3xl px-4" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Vos assistants IA, toujours à l'écoute
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Automatisez, optimisez et propulsez votre business avec nos agents IA intelligents.
          </p>
          <Link
            href="#agents"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition shadow-lg hover:scale-105"
          >
            Découvrez nos agents
          </Link>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-24 bg-gradient-to-r from-purple-50 to-blue-50 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6" data-aos="fade-up">
          Nos agents IA
        </h2>
        <p className="mb-12 max-w-2xl mx-auto text-gray-700" data-aos="fade-up" data-aos-delay="200">
          Chaque agent est conçu pour résoudre un problème précis et automatiser vos processus.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {agents.map((agent, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl shadow-lg hover:shadow-cyan-500/50 transition transform hover:-translate-y-2 hover:scale-105 w-72"
              data-aos="zoom-in"
              data-aos-delay={i * 200}
            >
              <div className="h-40 flex items-center justify-center mb-4">
                <Lottie animationData={agent.animationData} loop={true} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{agent.name}</h3>
              <p className="text-gray-400 mb-4">{agent.description}</p>
              <Link
                href="/agents"
                className="block bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition hover:scale-105"
              >
                En savoir plus
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6" data-aos="fade-up">
          Contactez-nous
        </h2>
        <p className="mb-6 max-w-xl mx-auto text-gray-700" data-aos="fade-up" data-aos-delay="200">
          Posez vos questions ou demandez une démonstration personnalisée.
        </p>
        <Link
          href="/contact"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition shadow-lg hover:scale-105"
          data-aos="zoom-in"
        >
          Envoyer un message
        </Link>
      </section>
    </main>
  );
}
