"use client";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function NewSlyPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Newsly",
        gradient: "from-red-900 to-orange-800",
        textColor: "text-white",
        headerGradient: "from-red-200 to-orange-300",
        botImage: "/newsly-bot.svg",
        description: "Votre nouvel expert en actualités et informations fiables"
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/newsly"
      placeholder="Écrivez ou enregistrez vos questions..."
      botImage="/newsly-bot.svg"
      sendButtonLabel="Obtenir des actus"
      colors={{
        gradientFrom: "from-red-900",
        gradientTo: "to-orange-800",
        textColor: "text-white",
        buttonGradientFrom: "from-red-500",
        buttonGradientTo: "to-orange-600",
        buttonHoverFrom: "hover:from-red-600",
        buttonHoverTo: "hover:to-orange-700",
        borderColor: "border-red-500/30",
        placeholderColor: "placeholder-red-300",
        responseBg: "bg-red-900/30",
        responseBorder: "border-red-700/30",
        ringColor: "ring-red-500",
        shadowColor: "shadow-red-500/50"
      }}
    />
  );
}
