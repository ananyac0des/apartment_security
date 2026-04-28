"use client";

import { useEffect, useState } from "react";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "text-red-600";
    case "high": return "text-orange-600";
    case "medium": return "text-yellow-600";
    default: return "text-green-600";
  }
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [guards, setGuards] = useState<any[]>([]);

  const [form, setForm] = useState({
    description: "",
    severity: "low",
    guard_id: "",
    apartment_id: "",
  });

  const fetchData = async () => {
    const [i, g] = await Promise.all([
      fetch("/api/incidents").then((r) => r.json()),
      fetch("/api/guards").then((r) => r.json()),
    ]);

    setIncidents(i);
    setGuards(g);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addIncident = async (e: any) => {
    e.preventDefault();

    await fetch("/api/incidents", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({
      description: "",
      severity: "low",
      guard_id: "",
      apartment_id: "",
    });

    fetchData();
  };

  const resolveIncident = async (id: number) => {
    await fetch("/api/incidents", {
      method: "PUT",
      body: JSON.stringify({ id }),
    });

    fetchData();
  };

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4">Incidents</h1>

      <form onSubmit={addIncident} className="space-y-2 mb-6">
        <input
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          className="border p-2 w-full"
          value={form.severity}
          onChange={(e) =>
            setForm({ ...form, severity: e.target.value })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

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

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Report Incident
        </button>
      </form>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Unit</th>
            <th>Guard</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((i) => (
            <tr key={i.incident_id} className="border-t">
              <td>
                {new Date(i.incident_date).toLocaleString()}
              </td>
              <td>{i.description}</td>
              <td className={`font-bold capitalize ${getSeverityColor(i.severity)}`}>
                {i.severity}
              </td>
              <td>{i.apartment?.unit_number || "N/A"}</td>
              <td>{i.security_guard?.full_name}</td>
              <td>
                {i.resolved ? (
                  <span className="text-green-600 font-bold">Resolved</span>
                ) : (
                  <button
                    onClick={() =>
                      resolveIncident(i.incident_id)
                    }
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Resolve
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