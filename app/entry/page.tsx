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

  return (
    <div className="text-black p-6">
      <h1 className="text-2xl font-bold mb-4">
        Entry Logs (Guard Only)
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">

        <select
          className="border p-2 w-full"
          value={form.person_type}
          onChange={(e) =>
            setForm({ ...form, person_type: e.target.value })
          }
        >
          <option value="resident">Resident</option>
          <option value="visitor">Visitor</option>
        </select>

        {/* RESIDENT */}
        {form.person_type === "resident" && (
          <input
            className="border p-2 w-full"
            placeholder="Card Number"
            value={form.card_number}
            onChange={(e) =>
              setForm({ ...form, card_number: e.target.value })
            }
          />
        )}

        {/* VISITOR */}
        {form.person_type === "visitor" && (
          <input
            className="border p-2 w-full"
            placeholder="Visitor ID"
            value={form.visitor_id}
            onChange={(e) =>
              setForm({ ...form, visitor_id: e.target.value })
            }
          />
        )}

        {/* GATE */}
        <select
          className="border p-2 w-full"
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

        {/* GUARD */}
        <select
          className="border p-2 w-full"
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

        <input
          className="border p-2 w-full"
          placeholder="Purpose"
          value={form.purpose}
          onChange={(e) =>
            setForm({ ...form, purpose: e.target.value })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Log Entry
        </button>
      </form>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Time</th>
            <th>Name</th>
            <th>Type</th>
            <th>Guard</th>
            <th>Purpose</th>
            <th>Exit</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((l) => (
            <tr key={l.log_id} className="border-t">
              <td>{new Date(l.entry_time).toLocaleString()}</td>
              <td>
                {l.resident?.full_name ||
                  l.visitor?.full_name ||
                  "N/A"}
              </td>
              <td>{l.person_type}</td>
              <td>{l.security_guard?.full_name}</td>
              <td>{l.purpose}</td>
              <td>
                {l.exit_time ? (
                  new Date(l.exit_time).toLocaleString()
                ) : (
                  <button
                    onClick={() => markExit(l.log_id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Exit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}