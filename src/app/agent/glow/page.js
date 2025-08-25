"use client";

import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function GlowPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Glow",
        gradient: "from-pink-900 to-rose-800",
        textColor: "text-white",
        headerGradient: "from-pink-200 to-rose-200",
        botImage: "/glow-bot.svg",
        description: "Le maître des mots qui font chavirer. Propose des réponses séduisantes adaptées à votre style.",
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/glow"
      placeholder="Écrivez ou enregistrez votre message..."
      sendButtonLabel="séduire"
      tones={[
        { value: "gentleman", label: "Gentleman" },
        { value: "joueur", label: "Joueur" },
        { value: "mystérieux", label: "Mystérieux" },
      ]}
      colors={{
        gradientFrom: "from-pink-900",
        gradientTo: "to-rose-800",
        textColor: "text-white",
        buttonGradientFrom: "from-pink-500",
        buttonGradientTo: "to-rose-600",
        buttonHoverFrom: "hover:from-pink-600",
        buttonHoverTo: "hover:to-rose-700",
        borderColor: "border-pink-500/30",
        placeholderColor: "placeholder-pink-300",
        responseBg: "bg-pink-900/30",
        responseBorder: "border-pink-700/30",
        ringColor: "ring-pink-500",
        shadowColor: "shadow-pink-500/50",
      }}
    />
  );
}
