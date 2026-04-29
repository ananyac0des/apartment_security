"use client";

import { useEffect, useState } from "react";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  });

  const fetchVisitors = async () => {
    const role = localStorage.getItem("role");
    const resident_id = localStorage.getItem("resident_id");

    if (role) setUserRole(role);

    let url = "/api/visitors";

    if (role === "resident" && resident_id) {
      url = `/api/visitors?resident_id=${resident_id}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setVisitors(data);
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleAction = async (id: number, action: string) => {
    await fetch("/api/visitors", {
      method: "PUT",
      body: JSON.stringify({
        visitor_id: id,
        action,
      }),
    });

    fetchVisitors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resident_id = localStorage.getItem("resident_id");

    await fetch("/api/visitors", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        resident_id: resident_id ? Number(resident_id) : undefined,
      }),
    });

    setForm({ full_name: "", phone: "" });
    fetchVisitors();
  };

  const getStatus = (v: any) => {
    const isBlocked = v.blacklist?.some((b: any) => b.is_active);

    if (isBlocked) return "Blocked";
    if (v.status === "approved" || v.approved) return "Approved";
    return "Pending";
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-8 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Visitors</h1>

        {userRole === "resident" && (
          <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">New Visitor Request</h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full space-y-1">
                <label className="text-sm text-gray-300 font-medium">Full Name</label>
                <input
                  className="bg-gray-800 text-white border border-gray-700 placeholder-gray-400 p-2.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Visitor Name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="w-full space-y-1">
                <label className="text-sm text-gray-300 font-medium">Phone</label>
                <input
                  className="bg-gray-800 text-white border border-gray-700 placeholder-gray-400 p-2.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                Submit Request
              </button>
            </div>
          </form>
        )}

        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  {userRole !== "resident" && (
                    <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {visitors.map((v, index) => {
                  const isBlocked = v.blacklist?.some(
                    (b: any) => b.is_active
                  );
                  const status = getStatus(v);

                  return (
                    <tr key={v.visitor_id} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"}>
                      <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{v.visitor_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">{v.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{v.phone}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {status === "Approved" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                            Approved
                          </span>
                        )}
                        {status === "Pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                            Pending
                          </span>
                        )}
                        {status === "Blocked" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-500/10 text-red-400 border-red-500/20">
                            Blocked
                          </span>
                        )}
                      </td>

                      {userRole !== "resident" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            {status !== "Approved" && (
                              <button
                                onClick={() =>
                                  handleAction(v.visitor_id, "approve")
                                }
                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-green-900/20"
                              >
                                Approve
                              </button>
                            )}

                            {!isBlocked ? (
                              <button
                                onClick={() =>
                                  handleAction(v.visitor_id, "block")
                                }
                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-red-900/20"
                              >
                                Block
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleAction(v.visitor_id, "unblock")
                                }
                                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-gray-900/20"
                              >
                                Unblock
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {visitors.length === 0 && (
                  <tr>
                    <td colSpan={userRole === "resident" ? 4 : 5} className="px-6 py-8 text-center text-gray-500 text-sm">
                      No visitors found.
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