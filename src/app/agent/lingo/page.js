"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";
import { motion } from "framer-motion";
import LingoWaveBackground from "../../components/LingoWaveBackground";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function LingoPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Lingo",
        description: "Le globe-trotteur des langues. Traduit tout en conservant le ton voulu.",
        botImage: "/lingo-bot.svg",
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/lingo"
      placeholder="Entrez votre texte à traduire..."
      defaultLang="anglais"
      tones={[
        { label: "Professionnel", value: "pro" },
        { label: "Amical", value: "amical" },
        { label: "Séduisant", value: "seduisant" },
        { label: "Humoristique", value: "humoristique" },
      ]}
      colors={{
        gradientFrom: "from-amber-900",
        gradientTo: "to-yellow-800",
        textColor: "text-white",
        buttonGradientFrom: "from-amber-500",
        buttonGradientTo: "to-yellow-600",
        buttonHoverFrom: "hover:from-amber-600",
        buttonHoverTo: "hover:to-yellow-700",
        borderColor: "border-amber-500/30",
        placeholderColor: "placeholder-amber-300",
        responseBg: "bg-amber-900/30",
        responseBorder: "border-amber-700/30",
      }}
    />
  );
}
