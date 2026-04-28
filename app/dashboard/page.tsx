"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  if (!data) {
    return (
      <div className="p-6 text-black text-lg">Loading dashboard...</div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6 text-black">
        Dashboard
      </h1>

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
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-black">
        Recent Entry Logs
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-300 text-black">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Guard</th>
              <th className="p-3">Purpose</th>
            </tr>
          </thead>

          <tbody>
            {data.recentLogs.map((log: any) => (
              <tr
                key={log.log_id}
                className="border-t hover:bg-gray-100"
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
function Card({ title, value }: any) {
  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 text-center">
      <h3 className="text-black font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-blue-600">
        {value}
      </p>
    </div>
  );
}