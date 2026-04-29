"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    const [form, setForm] = useState({
        resident_id: "",
        apartment_id: "",
        issue_type: "",
        description: "",
    });

    const fetchRequests = async () => {
        const role = localStorage.getItem("role");
        const resident_id = localStorage.getItem("resident_id");

        if (role === "guard") {
            router.push("/login");
            return;
        }

        if (role) setUserRole(role);

        const res = await fetch("/api/maintenance");
        let data = await res.json();

        if (role === "resident" && resident_id) {
            data = data.filter((r: any) => r.resident_id === Number(resident_id));
        }

        setRequests(data);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const role = localStorage.getItem("role");
        const resident_id = localStorage.getItem("resident_id");

        let submitForm = { ...form };
        if (role === "resident" && resident_id) {
            submitForm.resident_id = resident_id;
        }

        await fetch("/api/maintenance", {
            method: "POST",
            body: JSON.stringify(submitForm),
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

    if (userRole === "guard") return null;

    return (
        <div className="min-h-screen bg-[#0f172a] p-6 text-gray-200">
            <div className="bg-[#111827] rounded-xl p-6 shadow-lg max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Maintenance Requests</h1>

                <form onSubmit={handleSubmit} className="mb-8 space-y-4 border-b border-gray-700 pb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">New Request</h2>

                    <div className="flex flex-col md:flex-row gap-4">
                        {userRole !== "resident" && (
                            <div className="w-full space-y-1">
                                <label className="text-sm text-gray-300 font-medium">Resident ID</label>
                                <input
                                    type="number"
                                    className="bg-gray-800 text-white border border-gray-700 placeholder-gray-400 p-2.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. 101"
                                    value={form.resident_id}
                                    onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                                    required={userRole !== "resident"}
                                />
                            </div>
                        )}
                        <div className="w-full space-y-1">
                            <label className="text-sm text-gray-300 font-medium">Apartment ID</label>
                            <input
                                type="number"
                                className="bg-gray-800 text-white border border-gray-700 placeholder-gray-400 p-2.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. 201"
                                value={form.apartment_id}
                                onChange={(e) => setForm({ ...form, apartment_id: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-300 font-medium">Issue Type</label>
                        <input
                            className="bg-gray-800 text-white border border-gray-700 placeholder-gray-400 p-2.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Plumbing, Electrical"
                            value={form.issue_type}
                            onChange={(e) => setForm({ ...form, issue_type: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-300 font-medium">Description</label>
                        <textarea
                            className="bg-gray-800 text-white border border-gray-700 placeholder-gray-400 p-2.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe the issue in detail..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            rows={3}
                        />
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                            Submit Request
                        </button>
                    </div>
                </form>

                <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-4 font-medium border-b border-gray-700">ID</th>
                                <th className="p-4 font-medium border-b border-gray-700">Resident</th>
                                <th className="p-4 font-medium border-b border-gray-700">Apartment Unit</th>
                                <th className="p-4 font-medium border-b border-gray-700">Issue Type</th>
                                <th className="p-4 font-medium border-b border-gray-700">Description</th>
                                <th className="p-4 font-medium border-b border-gray-700 text-center">Status</th>
                                {userRole === "admin" && (
                                    <th className="p-4 font-medium border-b border-gray-700 text-center">Action</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {requests.map((r, index) => (
                                <tr key={r.request_id} className={`${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700/50 transition-colors`}>
                                    <td className="p-4 text-gray-200">{r.request_id}</td>
                                    <td className="p-4 text-gray-200">{r.resident?.full_name || "N/A"}</td>
                                    <td className="p-4 text-gray-200">{r.apartment?.unit_number || "N/A"}</td>
                                    <td className="p-4 text-gray-200">{r.issue_type}</td>
                                    <td className="p-4 text-gray-200">{r.description}</td>
                                    <td className="p-4 text-center capitalize font-medium">
                                        <span className={`px-3 py-1 rounded-full text-xs tracking-wide ${
                                            r.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                            r.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                                            'bg-red-500/20 text-red-400 border border-red-500/20'
                                        }`}>
                                            {r.status?.replace("_", " ") || "Pending"}
                                        </span>
                                    </td>
                                    {userRole === "admin" && (
                                        <td className="p-4 text-center">
                                            {r.status !== "completed" && (
                                                <button
                                                    onClick={() => changeStatus(r.request_id, r.status)}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                                >
                                                    {r.status === "pending" ? "Mark In Progress" : "Mark Completed"}
                                                </button>
                                            )}
                                            {r.status === "completed" && (
                                                <span className="text-gray-500 text-sm font-medium">Done</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={userRole === "admin" ? 7 : 6} className="p-8 text-center text-gray-500 bg-gray-900">
                                        No maintenance requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
