"use client";

import { useEffect, useState } from "react";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitors(data));
  }, []);

  return (
    <div className="text-black p-6">
      <h1 className="text-2xl font-bold mb-4">Visitors</h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {visitors.map((v) => (
            <tr key={v.visitor_id} className="border-t">
              <td>{v.visitor_id}</td>
              <td>{v.full_name}</td>
              <td>{v.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}