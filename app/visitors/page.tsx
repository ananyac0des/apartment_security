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
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Visitors</h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {visitors.map((v) => {
            const isBlocked = v.blacklist?.some(
              (b: any) => b.is_active
            );

            return (
              <tr key={v.visitor_id} className="border-t">
                <td>{v.visitor_id}</td>
                <td>{v.full_name}</td>
                <td>{v.phone}</td>

                <td>
                  {getStatus(v) === "Approved" && (
                    <span className="text-green-600 font-semibold">
                      Approved
                    </span>
                  )}
                  {getStatus(v) === "Pending" && (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                  {getStatus(v) === "Blocked" && (
                    <span className="text-red-600 font-semibold">
                      Blocked
                    </span>
                  )}
                </td>

                <td className="space-x-2">
                  {!v.approved && (
                    <button
                      onClick={() =>
                        handleAction(v.visitor_id, "approve")
                      }
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}

                  {!isBlocked ? (
                    <button
                      onClick={() =>
                        handleAction(v.visitor_id, "block")
                      }
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleAction(v.visitor_id, "unblock")
                      }
                      className="bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}