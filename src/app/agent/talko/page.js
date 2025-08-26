"use client";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function talkoPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "talko",
        gradient: "from-purple-900 to-magenta-800",
        textColor: "text-white",
        headerGradient: "from-purple-200 to-magenta-300",
        botImage: "/talko-bot.svg",
        description: "Ton compagnon de discussion sans limites : que tu aies envie de rire, de réfléchir, de rêver ou juste de parler, il est toujours là pour t’écouter et te répondre. Avec lui, aucune question n’est trop folle et aucun sujet n’est interdit."
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/talko"
      placeholder="Écrivez ou enregistrez vos questions..."
      botImage="/talko-bot.svg"
      sendButtonLabel="Discuter"
      colors={{
        gradientFrom: "from-purple-900",
        gradientTo: "to-magenta-800",
        textColor: "text-white",
        buttonGradientFrom: "from-purple-500",
        buttonGradientTo: "to-magenta-600",
        buttonHoverFrom: "hover:from-purple-600",
        buttonHoverTo: "hover:to-magenta-700",
        borderColor: "border-purple-500/30",
        placeholderColor: "placeholder-purple-300",
        responseBg: "bg-purple-900/30",
        responseBorder: "border-purple-700/30",
        ringColor: "ring-purple-500",
        shadowColor: "shadow-purple-500/50"
      }}
    />
  );
}
