"use client";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function ReplyPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Reply",
        gradient: "from-blue-900 to-sky-800",
        textColor: "text-white",
        headerGradient: "from-blue-200 to-sky-200",
        botImage: "/reply-bot.svg",
        description: "Le génie des réponses parfaites. Suggère plusieurs options adaptées à chaque situation."
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/reply"
      placeholder="Collez ou enregistrez le message auquel vous voulez répondre..."
      botImage="/reply-bot.svg"
      tones={[
        { value: "pro", label: "Professionnel" },
        { value: "cool", label: "Décontracté" },
        { value: "humoristique", label: "Humoristique" },
        { value: "seduisant", label: "Séduisant" }
      ]}
      sendButtonLabel="faire une blague"
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
