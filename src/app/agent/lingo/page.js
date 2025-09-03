"use client";
import agents from "@/config/agents";
import TransactionalAgentWorkflow from "@/components/agents/TransactionalAgentWorkflow";


export default function LingoPage() {
    const agent = agents.find(a => a.color === "lingo");
  if (!agent) return null;
  return <TransactionalAgentWorkflow agent={agent} />;
}
