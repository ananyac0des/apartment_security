"use client";

import { useEffect, useState } from "react";

type DashboardLog = {
  log_id: number;
  entry_time: string;
  person_type: string;
  purpose: string;
  resident?: { full_name?: string | null } | null;
  visitor?: { full_name?: string | null } | null;
  security_guard?: { full_name?: string | null } | null;
};

type DashboardData = {
  totalResidents: number;
  totalVisitors: number;
  totalGuards: number;
  totalApartments: number;
  occupiedApartments: number;
  vacantApartments: number;
  maintenanceApartments: number;
  totalIncidents: number;
  unresolvedIncidents: number;
  recentLogs: DashboardLog[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend request failed");
        }
        return res.json();
      })
      .then((d) => setData(d))
      .catch(() => setError("Unable to load dashboard data from backend."));
  }, []);

  if (!data) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-lg text-slate-200">
        {error || "Loading dashboard..."}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-100">
      <h1 className="mb-6 text-3xl font-bold text-white">Security Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card title="Residents" value={data.totalResidents} />
        <Card title="Visitors" value={data.totalVisitors} />
        <Card title="Guards" value={data.totalGuards} />
        <Card title="Apartments" value={data.totalApartments} />
        <Card title="Occupied" value={data.occupiedApartments} />
        <Card title="Vacant" value={data.vacantApartments} />
        <Card title="Maintenance" value={data.maintenanceApartments} />
        <Card title="Incidents" value={data.totalIncidents} />
        <Card title="Unresolved" value={data.unresolvedIncidents} />
      </div>

      {/* LOGS */}
      <h2 className="mt-10 mb-4 text-2xl font-semibold text-white">
        Recent Entry Logs
      </h2>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-slate-100">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Guard</th>
              <th className="p-3">Purpose</th>
            </tr>
          </thead>

          <tbody>
            {data.recentLogs.map((log) => (
              <tr
                key={log.log_id}
                className="border-t border-slate-800 hover:bg-slate-900/80"
              >
                <td className="p-3">
                  {new Date(log.entry_time).toLocaleString()}
                </td>

                <td className="p-3">
                  {log.resident?.full_name ||
                    log.visitor?.full_name ||
                    "N/A"}
                </td>

                <td className="p-3 capitalize">
                  {log.person_type}
                </td>

                <td className="p-3">
                  {log.security_guard?.full_name || "N/A"}
                </td>

                <td className="p-3">{log.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// CARD COMPONENT
function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 text-center">
      <h3 className="font-medium text-slate-200">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-sky-300">
        {value}
      </p>
    </div>
  );
}