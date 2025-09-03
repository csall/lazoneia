"use client";
import agents from "@/config/agents";
import TransactionalAgentWorkflow from "@/components/agents/TransactionalAgentWorkflow";

export default function ScriboPage() {
  const agent = agents.find(a => a.color === "scribo");
  if (!agent) return null;
  return <TransactionalAgentWorkflow agent={agent} />;
}
