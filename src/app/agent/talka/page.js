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
