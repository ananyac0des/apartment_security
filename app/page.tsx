"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Resident = {
  resident_id: number;
  full_name: string;
  phone?: string | null;
  email?: string | null;
};

export default function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "resident") {
      alert("Access denied. Resident only.");
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;

    const loadResidents = async () => {
      try {
        const res = await fetch("/api/getResidents", { cache: "no-store" });
        const data = await res.json();
        setResidents(Array.isArray(data) ? data : []);
      } catch {
        setResidents([]);
      } finally {
        setLoading(false);
      }
    };

    loadResidents();
  }, [authorized]);

  if (!authorized) return null;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h1 className="text-3xl font-bold text-white">Resident Registry</h1>
      <p className="mt-1 text-sm text-slate-400">
        Review active resident records connected from backend APIs.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Residents" value={residents.length} />
        <StatCard label="Source" value="MySQL via Prisma API" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/80 text-slate-200">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3 text-slate-300" colSpan={4}>
                  Loading residents...
                </td>
              </tr>
            ) : residents.length ? (
              residents.map((resident) => (
                <tr key={resident.resident_id} className="border-t border-slate-800">
                  <td className="p-3 text-slate-300">{resident.resident_id}</td>
                  <td className="p-3 text-white">{resident.full_name}</td>
                  <td className="p-3 text-slate-300">{resident.phone ?? "-"}</td>
                  <td className="p-3 text-slate-300">{resident.email ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-rose-300" colSpan={4}>
                  No residents loaded. Check backend or database connectivity.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-sky-300">{value}</p>
    </div>
  );
}