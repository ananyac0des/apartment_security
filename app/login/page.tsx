"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState("resident");
  const [id, setId] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!id) {
      alert("Enter ID");
      return;
    }

    // store session
    localStorage.setItem("role", role);
    localStorage.setItem("userId", id);

    // redirect
    if (role === "guard") {
      router.push("/entry");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
        <h2 className="mb-1 text-2xl font-bold">Secure Login</h2>
        <p className="mb-4 text-sm text-slate-400">
          Enter your role and ID to continue.
        </p>

        <select
          className="mb-3 w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-slate-100 outline-none focus:border-sky-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="resident">Resident</option>
          <option value="guard">Guard</option>
        </select>

        <input
          className="mb-3 w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-slate-100 outline-none focus:border-sky-500"
          placeholder="Enter ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-md bg-sky-600 py-2 font-semibold text-white transition hover:bg-sky-500"
        >
          Login
        </button>
      </div>
    </div>
  );
}