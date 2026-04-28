"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EntryPage() {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "guard") {
      alert("Access denied. Guard only.");
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) return null;

  return (
    <div className="text-black p-6">
      <h1 className="text-2xl font-bold">Entry Logs (Guard Only)</h1>
      {/* your existing entry UI stays here */}
    </div>
  );
}