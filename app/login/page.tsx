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
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <div className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <select
          className="border p-2 w-full mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="resident">Resident</option>
          <option value="guard">Guard</option>
        </select>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Enter ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}