"use client";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function FitzyPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Fitzy",
        gradient: "from-green-900 to-teal-800",
        textColor: "text-white",
        headerGradient: "from-green-200 to-teal-200",
        botImage: "/fitzy-bot.svg",
        description: "Votre coach personnel pour le sport et le bien-être. Transforme vos objectifs en actions concrètes."
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/fitzy"
      placeholder="Écrivez ou enregistrez vos objectifs ou questions..."
      botImage="/fitzy-bot.svg"
      sendButtonLabel="Obtenir des conseils"
      colors={{
        gradientFrom: "from-green-900",
        gradientTo: "to-teal-800",
        textColor: "text-white",
        buttonGradientFrom: "from-green-500",
        buttonGradientTo: "to-teal-600",
        buttonHoverFrom: "hover:from-green-600",
        buttonHoverTo: "hover:to-teal-700",
        borderColor: "border-green-500/30",
        placeholderColor: "placeholder-green-300",
        responseBg: "bg-green-900/30",
        responseBorder: "border-green-700/30",
        ringColor: "ring-green-500",
        shadowColor: "shadow-green-500/50"
      }}
    />
  );
}
