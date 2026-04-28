import prisma from "@/lib/prisma";

// GET logs
export async function GET() {
  const logs = await prisma.entry_log.findMany({
    include: {
      resident: true,
      visitor: true,
      security_guard: true,
    },
    orderBy: {
      entry_time: "desc",
    },
    take: 50,
  });

  return Response.json(logs);
}

// CREATE entry
export async function POST(req: Request) {
  const body = await req.json();

  const newLog = await prisma.entry_log.create({
    data: {
      entry_time: new Date(),
      person_type: body.person_type,
      resident_id: body.resident_id
        ? Number(body.resident_id)
        : null,
      visitor_id: body.visitor_id
        ? Number(body.visitor_id)
        : null,
      guard_id: Number(body.guard_id),
      purpose: body.purpose,
    },
  });

  return Response.json(newLog);
}

// UPDATE (EXIT LOG)
export async function PUT(req: Request) {
  const body = await req.json();

  const updated = await prisma.entry_log.update({
    where: {
      log_id: Number(body.log_id),
    },
    data: {
      exit_time: new Date(),
    },
  });

  return Response.json(updated);
}