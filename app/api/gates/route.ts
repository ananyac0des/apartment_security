import prisma from "@/lib/prisma";

// GET all gates
export async function GET() {
    const gates = await prisma.gate.findMany({
        where: {
            is_active: true,
        },
        select: {
            gate_id: true,
            gate_name: true,
        },
    });

    return Response.json(gates);
}