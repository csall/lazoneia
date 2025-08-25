"use client";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function PunchyPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Punchy",
        gradient: "from-indigo-900 to-violet-800",
        textColor: "text-white",
        headerGradient: "from-indigo-200 to-violet-200",
        botImage: "/punchy-bot.svg",
        description: "L'ami qui trouve toujours la blague qui tombe juste. Transforme une phrase banale en punchline."
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/punchy"
      placeholder="Écrivez ou enregistrez une phrase banale à transformer..."
      botImage="/punchy-bot.svg"
      sendButtonLabel="faire une blague"
      colors={{
        gradientFrom: "from-indigo-900",
        gradientTo: "to-violet-800",
        textColor: "text-white",
        buttonGradientFrom: "from-indigo-500",
        buttonGradientTo: "to-violet-600",
        buttonHoverFrom: "hover:from-indigo-600",
        buttonHoverTo: "hover:to-violet-700",
        borderColor: "border-indigo-500/30",
        placeholderColor: "placeholder-indigo-300",
        responseBg: "bg-indigo-900/30",
        responseBorder: "border-indigo-700/30",
        ringColor: "ring-indigo-500",
        shadowColor: "shadow-indigo-500/50"
      }}
    />
  );
}
