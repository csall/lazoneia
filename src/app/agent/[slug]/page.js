import agents from "@/config/agents";
import AgentAudioWorkflow from "@/components/agents/AgentAudioWorkflow";
import TransactionalAgentWorkflow from "@/components/agents/TransactionalAgentWorkflow";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.color }));
}

export default function AgentPage({ params }) {
  const { slug } = params;
  const agent = agents.find((a) => a.color === slug);
  if (!agent) return notFound();
  if (agent.type === "transactionnel") {
    return <TransactionalAgentWorkflow agent={agent} />;
  }
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
    />
  );
}
