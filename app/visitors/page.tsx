"use client";

import { useEffect, useState } from "react";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);

  const fetchVisitors = async () => {
    const res = await fetch("/api/visitors");
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

  const getStatus = (v: any) => {
    const isBlocked = v.blacklist?.some((b: any) => b.is_active);

    if (isBlocked) return "Blocked";
    if (v.approved) return "Approved";
    return "Pending";
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-8 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Visitors</h1>

        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {visitors.map((v, index) => {
                  const isBlocked = v.blacklist?.some(
                    (b: any) => b.is_active
                  );

                  return (
                    <tr key={v.visitor_id} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"}>
                      <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{v.visitor_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">{v.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{v.phone}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatus(v) === "Approved" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                            Approved
                          </span>
                        )}
                        {getStatus(v) === "Pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                            Pending
                          </span>
                        )}
                        {getStatus(v) === "Blocked" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-500/10 text-red-400 border-red-500/20">
                            Blocked
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          {!v.approved && (
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
                    </tr>
                  );
                })}
                {visitors.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
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