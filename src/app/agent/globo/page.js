"use client";

import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";
import { useTheme } from "@/components/theme/ThemeProvider";
import agents from "@/config/agents";

export default function GloboPage() {
  const { theme } = useTheme();
  const agent = agents.find(a => a.name === "Globo");
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
