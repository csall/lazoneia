"use client";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function GloboPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Globo",
        gradient: "from-blue-900 to-cyan-800",
        textColor: "text-white",
        headerGradient: "from-blue-200 to-cyan-300",
        botImage: "/globo-bot.svg",
        description: "Votre expert en organisation de voyages pour des itinéraires personnalisés, conseils et astuces."
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/globo"
      placeholder="Écrivez ou enregistrez vos questions sur vos voyages..."
      botImage="/globo-bot.svg"
      sendButtonLabel="Obtenir des conseils"
      colors={{
        gradientFrom: "from-blue-900",
        gradientTo: "to-cyan-800",
        textColor: "text-white",
        buttonGradientFrom: "from-blue-500",
        buttonGradientTo: "to-cyan-600",
        buttonHoverFrom: "hover:from-blue-600",
        buttonHoverTo: "hover:to-cyan-700",
        borderColor: "border-blue-500/30",
        placeholderColor: "placeholder-blue-300",
        responseBg: "bg-blue-900/30",
        responseBorder: "border-blue-700/30",
        ringColor: "ring-blue-500",
        shadowColor: "shadow-blue-500/50"
      }}
    />
  );
}
