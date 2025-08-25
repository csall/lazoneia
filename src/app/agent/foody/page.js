"use client";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function FoodyPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Foody",
        gradient: "from-yellow-900 to-amber-800",
        textColor: "text-white",
        headerGradient: "from-yellow-200 to-amber-300",
        botImage: "/foody-bot.svg",
        description: "Votre expert culinaire pour des recettes, conseils nutritionnels et astuces de cuisine."
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/foody"
      placeholder="Écrivez ou enregistrez vos questions culinaires ou nutritionnelles..."
      botImage="/foody-bot.svg"
      sendButtonLabel="Obtenir des conseils"
      colors={{
        gradientFrom: "from-yellow-900",
        gradientTo: "to-amber-800",
        textColor: "text-white",
        buttonGradientFrom: "from-yellow-500",
        buttonGradientTo: "to-amber-600",
        buttonHoverFrom: "hover:from-yellow-600",
        buttonHoverTo: "hover:to-amber-700",
        borderColor: "border-yellow-500/30",
        placeholderColor: "placeholder-yellow-300",
        responseBg: "bg-yellow-900/30",
        responseBorder: "border-yellow-700/30",
        ringColor: "ring-yellow-500",
        shadowColor: "shadow-yellow-500/50"
      }}
    />
  );
}
