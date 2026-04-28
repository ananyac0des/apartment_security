"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "online" | "offline";

export default function ConnectivityStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let mounted = true;

    const checkBackend = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!mounted) return;
        setStatus(res.ok ? "online" : "offline");
      } catch {
        if (!mounted) return;
        setStatus("offline");
      }
    };

    checkBackend();
    const timer = setInterval(checkBackend, 30000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const styleMap: Record<Status, string> = {
    checking: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    online: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
    offline: "bg-rose-500/20 text-rose-200 border-rose-400/30",
  };

  const labelMap: Record<Status, string> = {
    checking: "Checking connection...",
    online: "Backend connected",
    offline: "Backend unreachable",
  };

  return (
    <div
      className={`rounded-md border px-3 py-2 text-xs font-semibold ${styleMap[status]}`}
      title="Frontend to backend connectivity status"
    >
      {labelMap[status]}
    </div>
  );
}
