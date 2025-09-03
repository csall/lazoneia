"use client";

import agents from "@/config/agents";
import TransactionalAgentWorkflow from "@/components/agents/TransactionalAgentWorkflow";


export default function ReplyPage() {
   const agent = agents.find(a => a.color === "reply");
  if (!agent) return null;
  return <TransactionalAgentWorkflow agent={agent} />;
}
