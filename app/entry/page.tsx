"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EntryPage() {
  const [authorized, setAuthorized] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [guards, setGuards] = useState<any[]>([]);
  const [gates, setGates] = useState<any[]>([]);

  const [form, setForm] = useState({
    person_type: "resident",
    card_number: "",
    visitor_id: "",
    guard_id: "",
    gate_id: "",
    purpose: "",
  });

  const router = useRouter();

  // 🔐 AUTH CHECK
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "guard") {
      alert("Access denied. Guard only.");
      router.push("/login");
    } else {
      setAuthorized(true);
      fetchLogs();
      fetchGuards();
      fetchGates();
    }
  }, []);

  // 📥 FETCH LOGS
  const fetchLogs = async () => {
    const res = await fetch("/api/entrylogs");
    const data = await res.json();
    setLogs(data);
  };

  // 📥 FETCH GUARDS
  const fetchGuards = async () => {
    const res = await fetch("/api/guards");
    const data = await res.json();
    setGuards(data);
  };

  // 📥 FETCH GATES
  const fetchGates = async () => {
    const res = await fetch("/api/gates");
    const data = await res.json();
    setGates(data);
  };

  // ➕ CREATE ENTRY
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/entrylogs", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    fetchLogs();

    setForm({
      person_type: "resident",
      card_number: "",
      visitor_id: "",
      guard_id: "",
      gate_id: "",
      purpose: "",
    });
  };

  // 🚪 EXIT
  const markExit = async (id: number) => {
    await fetch("/api/entrylogs", {
      method: "PUT",
      body: JSON.stringify({ log_id: id }),
    });

    fetchLogs();
  };

  if (!authorized) return null;

  const inputClass = "bg-gray-800 text-white border border-gray-700 placeholder-gray-400 p-2.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Entry Logs (Guard Only)
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-300 font-medium">Person Type</label>
              <select
                className={inputClass}
                value={form.person_type}
                onChange={(e) =>
                  setForm({ ...form, person_type: e.target.value })
                }
              >
                <option value="resident">Resident</option>
                <option value="visitor">Visitor</option>
              </select>
            </div>

            {/* RESIDENT */}
            {form.person_type === "resident" && (
              <div className="space-y-1">
                <label className="text-sm text-gray-300 font-medium">Card Number</label>
                <input
                  className={inputClass}
                  placeholder="Card Number"
                  value={form.card_number}
                  onChange={(e) =>
                    setForm({ ...form, card_number: e.target.value })
                  }
                />
              </div>
            )}

            {/* VISITOR */}
            {form.person_type === "visitor" && (
              <div className="space-y-1">
                <label className="text-sm text-gray-300 font-medium">Visitor ID</label>
                <input
                  className={inputClass}
                  placeholder="Visitor ID"
                  value={form.visitor_id}
                  onChange={(e) =>
                    setForm({ ...form, visitor_id: e.target.value })
                  }
                />
              </div>
            )}

            {/* GATE */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 font-medium">Gate</label>
              <select
                className={inputClass}
                value={form.gate_id}
                onChange={(e) =>
                  setForm({ ...form, gate_id: e.target.value })
                }
              >
                <option value="">Select Gate</option>
                {gates.map((g) => (
                  <option key={g.gate_id} value={g.gate_id}>
                    {g.gate_name}
                  </option>
                ))}
              </select>
            </div>

            {/* GUARD */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 font-medium">Guard</label>
              <select
                className={inputClass}
                value={form.guard_id}
                onChange={(e) =>
                  setForm({ ...form, guard_id: e.target.value })
                }
              >
                <option value="">Select Guard</option>
                {guards.map((g) => (
                  <option key={g.guard_id} value={g.guard_id}>
                    {g.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm text-gray-300 font-medium">Purpose</label>
              <input
                className={inputClass}
                placeholder="Purpose of Entry"
                value={form.purpose}
                onChange={(e) =>
                  setForm({ ...form, purpose: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Log Entry
            </button>
          </div>
        </form>

        {/* TABLE */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 text-white border-b border-gray-700">
                <tr>
                  <th className="p-4 font-medium">Time</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Guard</th>
                  <th className="p-4 font-medium">Purpose</th>
                  <th className="p-4 font-medium text-center">Exit</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {logs.map((l, index) => (
                  <tr key={l.log_id} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                    <td className="p-4 text-gray-300 whitespace-nowrap">{new Date(l.entry_time).toLocaleString()}</td>
                    <td className="p-4 text-gray-200 font-medium whitespace-nowrap">
                      {l.resident?.full_name ||
                        l.visitor?.full_name ||
                        "N/A"}
                    </td>
                    <td className="p-4 text-gray-300 capitalize whitespace-nowrap">{l.person_type}</td>
                    <td className="p-4 text-gray-300 whitespace-nowrap">{l.security_guard?.full_name}</td>
                    <td className="p-4 text-gray-300">{l.purpose}</td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {l.exit_time ? (
                        <span className="text-gray-400 text-sm">{new Date(l.exit_time).toLocaleString()}</span>
                      ) : (
                        <button
                          onClick={() => markExit(l.log_id)}
                          className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Exit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No entry logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}