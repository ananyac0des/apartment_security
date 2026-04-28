import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.incident.findMany({
    include: {
      security_guard: true,
      apartment: {
        select: {
          unit_number: true,
        },
      },
    },
    orderBy: { incident_date: "desc" },
  });

  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const inc = await prisma.incident.create({
    data: {
      incident_date: new Date(),
      description: body.description,
      severity: body.severity,
      reported_by: Number(body.guard_id),
      apartment_id: body.apartment_id
        ? Number(body.apartment_id)
        : null,
      resolved: false,
    },
  });

  return Response.json(inc);
}

export async function PUT(req: Request) {
  const body = await req.json();

  const upd = await prisma.incident.update({
    where: { incident_id: Number(body.id) },
    data: { resolved: true },
  });

  return Response.json(upd);
}