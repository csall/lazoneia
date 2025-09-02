"use client";

import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";
import agents from "@/config/agents";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function FoodyPage() {
  const { theme } = useTheme();
  const agent = agents.find(a => a.name === "Foody");
  return (
    <AgentAudioWorkflow
      branding={agent.branding}
      endpoint={agent.endpoint}
      placeholder={agent.placeholder}
      botImage={agent.branding.botImage}
      sendButtonLabel={agent.sendButtonLabel}
      colors={agent.colors}
      tones={agent.tones}
      tagline={agent.tagline}
      theme={theme}
    />
  );
}
