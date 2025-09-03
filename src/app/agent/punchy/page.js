"use client";

import agents from "@/config/agents";
import TransactionalAgentWorkflow from "@/components/agents/TransactionalAgentWorkflow";


export default function PunchyPage() {
  const agent = agents.find(a => a.color === "punchy");
  if (!agent) return null;
  return <TransactionalAgentWorkflow agent={agent} />;
}
