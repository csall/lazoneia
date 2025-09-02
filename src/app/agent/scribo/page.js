"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";

import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";
import agents from "@/config/agents";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function ScriboPage() {
  const { theme } = useTheme();
  const agent = agents.find(a => a.name === "Scribo");
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
