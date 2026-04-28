"use client";

import { useEffect, useState } from "react";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "high": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    default: return "bg-green-500/10 text-green-400 border-green-500/20";
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
    <div className="min-h-screen bg-[#0b1120] p-8 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Incidents</h1>

        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Report New Incident</h2>
          <form onSubmit={addIncident} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-400">Description</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Describe the incident..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">Severity</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
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
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">Guard on Duty</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
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

            <div className="md:col-span-4 mt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-blue-900/20">
                Report Incident
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Guard</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {incidents.map((i, index) => (
                  <tr key={i.incident_id} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"}>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {new Date(i.incident_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{i.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(i.severity)} capitalize`}>
                        {i.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{i.apartment?.unit_number || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{i.security_guard?.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {i.resolved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Resolved
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            resolveIncident(i.incident_id)
                          }
                          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-green-900/20"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                      No incidents reported.
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