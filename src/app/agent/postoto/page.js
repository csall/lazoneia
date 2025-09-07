"use client";

import agents from "@/config/agents";
import PostotoWorkflow from "@/components/agents/PostotoWorkflow";

export default function PostotoPage() {
  const agent = agents.find(a => a.color === "postoto");
  if (!agent) return null;
  return <PostotoWorkflow agent={agent} />;
}
