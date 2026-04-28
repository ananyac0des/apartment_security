import prisma from "@/lib/prisma";

export async function GET() {
    const requests = await prisma.maintenance_request.findMany({
        include: {
            resident: {
                select: {
                    full_name: true,
                },
            },
            apartment: {
                select: {
                    unit_number: true,
                },
            },
        },
    });

    return Response.json(requests);
}

export async function POST(req: Request) {
    const body = await req.json();

    const newRequest = await prisma.maintenance_request.create({
        data: {
            resident_id: Number(body.resident_id),
            apartment_id: Number(body.apartment_id),
            issue_type: body.issue_type,
            description: body.description,
            status: "pending",
        },
    });

    return Response.json(newRequest);
}

export async function PUT(req: Request) {
    const body = await req.json();

    const allowedStatuses = ["pending", "in_progress", "completed"];
    if (!allowedStatuses.includes(body.status)) {
        return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    let dataToUpdate: any = { status: body.status };

    if (body.status === "completed") {
        dataToUpdate.resolved_date = new Date();
    } else {
        dataToUpdate.resolved_date = null;
    }

    const updatedRequest = await prisma.maintenance_request.update({
        where: { request_id: Number(body.request_id) },
        data: dataToUpdate,
    });

    return Response.json(updatedRequest);
}
