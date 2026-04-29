"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccessCardsPage() {
    const [cards, setCards] = useState<any[]>([]);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        card_number: "",
        resident_id: "",
        issued_date: "",
        expiry_date: "",
    });

    const fetchCards = async () => {
        const res = await fetch("/api/access-card");
        const data = await res.json();
        setCards(data);
    };

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            router.push("/login");
        } else {
            setIsAuthorized(true);
            fetchCards();
        }
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await fetch("/api/access-card", {
            method: "POST",
            body: JSON.stringify({
                ...form,
                is_active: true,
            }),
        });

        setForm({
            card_number: "",
            resident_id: "",
            issued_date: "",
            expiry_date: "",
        });

        fetchCards();
    };

    const toggleStatus = async (id: number) => {
        await fetch("/api/access-card", {
            method: "PUT",
            body: JSON.stringify({ card_id: id }),
        });

        fetchCards();
    };

    if (!isAuthorized) return null;

    return (
        <div className="text-black p-6">
            <h1 className="text-2xl font-bold mb-4">Access Card Management</h1>

            <form onSubmit={handleSubmit} className="space-y-3 mb-6 bg-gray-50 p-4 rounded border">
                <h2 className="text-lg font-semibold">Assign New Card</h2>

                <input
                    className="border p-2 w-full"
                    placeholder="Card Number"
                    value={form.card_number}
                    onChange={(e) => setForm({ ...form, card_number: e.target.value })}
                    required
                />

                <input
                    type="number"
                    className="border p-2 w-full"
                    placeholder="Resident ID"
                    value={form.resident_id}
                    onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                    required
                />

                <div className="flex gap-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Issued Date</label>
                        <input
                            type="date"
                            className="border p-2 w-full"
                            value={form.issued_date}
                            onChange={(e) => setForm({ ...form, issued_date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            className="border p-2 w-full"
                            value={form.expiry_date}
                            onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
                    Assign Card
                </button>
            </form>

            <table className="w-full border bg-white">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 border text-left">Card Number</th>
                        <th className="p-3 border text-left">Resident</th>
                        <th className="p-3 border text-left">Expiry Date</th>
                        <th className="p-3 border text-center">Status</th>
                        <th className="p-3 border text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {cards.map((c) => (
                        <tr key={c.card_id} className="border-t">
                            <td className="p-3 border">{c.card_number}</td>
                            <td className="p-3 border">{c.resident?.full_name || "N/A"}</td>
                            <td className="p-3 border">{new Date(c.expiry_date).toLocaleDateString()}</td>
                            <td className="p-3 border font-bold text-center">
                                {c.is_active ? (
                                    <span className="text-green-600">Active</span>
                                ) : (
                                    <span className="text-red-600">Inactive</span>
                                )}
                            </td>
                            <td className="p-3 border text-center">
                                <button
                                    onClick={() => toggleStatus(c.card_id)}
                                    className={`px-3 py-1 rounded text-white text-sm font-medium ${c.is_active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                        }`}
                                >
                                    {c.is_active ? "Deactivate" : "Activate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {cards.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                No access cards found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
