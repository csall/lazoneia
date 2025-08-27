"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";
import { motion } from "framer-motion";
import LingoWaveBackground from "../../components/LingoWaveBackground";

import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";
import agents from "@/config/agents";

export default function LingoPage() {
  const agent = agents.find(a => a.name === "Lingo");
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
