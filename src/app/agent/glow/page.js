"use client";


import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";
import agents from "@/config/agents";

export default function GlowPage() {
  const agent = agents.find(a => a.name === "Glow");
  return (
    <AgentAudioWorkflow
      branding={agent.branding}
      endpoint={agent.endpoint}
      placeholder={agent.placeholder}
      botImage={agent.branding.botImage}
      sendButtonLabel={agent.sendButtonLabel}
      colors={agent.colors}
      tones={agent.tones}
      tagLine={agent.tagline}
    />
  );
}
