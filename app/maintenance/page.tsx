"use client";

import { useEffect, useState } from "react";

export default function MaintenancePage() {
    const [requests, setRequests] = useState<any[]>([]);

    const [form, setForm] = useState({
        resident_id: "",
        apartment_id: "",
        issue_type: "",
        description: "",
    });

    const fetchRequests = async () => {
        const res = await fetch("/api/maintenance");
        const data = await res.json();
        setRequests(data);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch("/api/maintenance", {
            method: "POST",
            body: JSON.stringify(form),
        });

        setForm({
            resident_id: "",
            apartment_id: "",
            issue_type: "",
            description: "",
        });

        fetchRequests();
    };

    const changeStatus = async (id: number, currentStatus: string) => {
        let nextStatus = "pending";
        if (currentStatus === "pending") nextStatus = "in_progress";
        else if (currentStatus === "in_progress") nextStatus = "completed";
        else return; // already completed

        await fetch("/api/maintenance", {
            method: "PUT",
            body: JSON.stringify({
                request_id: id,
                status: nextStatus,
            }),
        });

        fetchRequests();
    };

    return (
        <div className="p-6 text-black">
            <h1 className="text-2xl font-bold mb-4">Maintenance Requests</h1>

            <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 border rounded space-y-3">
                <h2 className="text-lg font-semibold">New Request</h2>

                <div className="flex gap-4">
                    <input
                        type="number"
                        className="border p-2 w-full"
                        placeholder="Resident ID"
                        value={form.resident_id}
                        onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        className="border p-2 w-full"
                        placeholder="Apartment ID"
                        value={form.apartment_id}
                        onChange={(e) => setForm({ ...form, apartment_id: e.target.value })}
                        required
                    />
                </div>

                <input
                    className="border p-2 w-full"
                    placeholder="Issue Type (e.g., Plumbing, Electrical)"
                    value={form.issue_type}
                    onChange={(e) => setForm({ ...form, issue_type: e.target.value })}
                    required
                />

                <textarea
                    className="border p-2 w-full"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    rows={3}
                />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Submit Request
                </button>
            </form>

            <table className="w-full border bg-white">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border text-left">ID</th>
                        <th className="p-2 border text-left">Resident</th>
                        <th className="p-2 border text-left">Apartment Unit</th>
                        <th className="p-2 border text-left">Issue Type</th>
                        <th className="p-2 border text-left">Description</th>
                        <th className="p-2 border text-center">Status</th>
                        <th className="p-2 border text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => (
                        <tr key={r.request_id} className="border-t">
                            <td className="p-2 border">{r.request_id}</td>
                            <td className="p-2 border">{r.resident?.full_name || "N/A"}</td>
                            <td className="p-2 border">{r.apartment?.unit_number || "N/A"}</td>
                            <td className="p-2 border">{r.issue_type}</td>
                            <td className="p-2 border">{r.description}</td>
                            <td className="p-2 border text-center capitalize font-semibold">
                                <span className={`px-2 py-1 rounded text-sm ${r.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        r.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {r.status?.replace("_", " ") || "Pending"}
                                </span>
                            </td>
                            <td className="p-2 border text-center">
                                {r.status !== "completed" && (
                                    <button
                                        onClick={() => changeStatus(r.request_id, r.status)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        {r.status === "pending" ? "Mark In Progress" : "Mark Completed"}
                                    </button>
                                )}
                                {r.status === "completed" && (
                                    <span className="text-gray-500 text-sm">Done</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-4 text-center text-gray-500">
                                No maintenance requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
