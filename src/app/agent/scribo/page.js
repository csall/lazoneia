"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";

export default function ScriboPage() {
  return (
    <AgentAudioWorkflow
      branding={{
        name: "Scribo",
        gradient: "from-green-900 to-teal-800",
        textColor: "text-white",
        headerGradient: "from-green-200 to-teal-200",
        botImage: "/scribo-bot.svg",
        description: "L'assistant d'écriture créatif. Transforme vos idées en textes captivants."
      }}
      endpoint="https://cheikh06000.app.n8n.cloud/webhook/scribo"
      placeholder="Écrivez ou enregistrez une idée à développer..."
      botImage="/scribo-bot.svg"
      tones={[
        { value: "narratif", label: "Narratif" },
        { value: "persuasif", label: "Persuasif" },
        { value: "poetique", label: "Poétique" }
      ]}
      sendButtonLabel="Améliorer"
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
        ringColor: "ring-teal-300/60",
        shadowColor: "shadow-teal-400/40"
      }}
    />
  );
}
