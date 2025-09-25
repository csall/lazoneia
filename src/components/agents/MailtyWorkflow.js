"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MailtyWorkflow() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/mailty/inbox");
  }, [router]);
  return null;
}
