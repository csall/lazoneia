"use client";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function PsycoPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Psyco",
        gradient: "from-blue-900 to-sky-800",
        textColor: "text-white",
        headerGradient: "from-blue-200 to-sky-300",
        botImage: "/psyco-bot.svg",
        description: "Votre psychologue virtuel pour un soutien émotionnel et des conseils personnalisés."
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/psyco"
      placeholder="Écrivez ou enregistrez vos préoccupations ou questions..."
      botImage="/psyco-bot.svg"
      sendButtonLabel="Obtenir des conseils"
      colors={{
        gradientFrom: "from-blue-900",
        gradientTo: "to-sky-800",
        textColor: "text-white",
        buttonGradientFrom: "from-blue-500",
        buttonGradientTo: "to-sky-600",
        buttonHoverFrom: "hover:from-blue-600",
        buttonHoverTo: "hover:to-sky-700",
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
