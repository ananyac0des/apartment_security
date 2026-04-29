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

    if (role === "resident") {
      localStorage.setItem("resident_id", id);
    }

    // redirect
    if (role === "admin") {
      router.push("/");
    } else if (role === "guard") {
      router.push("/entry");
    } else {
      router.push("/visitors");
    }

    // Ensure Next.js refreshes the router state
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-800 bg-[#111827] p-8 shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold text-center text-white">Secure Login</h2>
        <p className="mb-6 text-sm text-center text-gray-400">
          Enter your role and ID to continue
        </p>

        <div className="space-y-4">
          <div>
            <select
              className="w-full rounded border border-gray-700 bg-gray-800 p-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="resident">Resident</option>
              <option value="guard">Guard</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <input
              className="w-full rounded border border-gray-700 bg-gray-800 p-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              placeholder="Enter ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="mt-2 w-full rounded bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500 shadow-md"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}