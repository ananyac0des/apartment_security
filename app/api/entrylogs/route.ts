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
  let resident_id = null;
  let visitor_id = body.visitor_id ? Number(body.visitor_id) : null;

  if (body.person_type === "resident") {
    if (!body.card_number) {
      return Response.json({ error: "card_number is required for residents" }, { status: 400 });
    }

    const card = await prisma.access_card.findUnique({
      where: { card_number: body.card_number },
    });

    if (!card) {
      return Response.json({ error: "Access card not found" }, { status: 404 });
    }

    if (!card.is_active) {
      return Response.json({ error: "Access card is inactive" }, { status: 403 });
    }

    if (new Date() > card.expiry_date) {
      return Response.json({ error: "Access card is expired" }, { status: 403 });
    }

    resident_id = card.resident_id;
  } else if (body.person_type === "visitor") {
    if (body.approved !== true) {
      return Response.json({ error: "Visitor entry must be approved" }, { status: 403 });
    }

    if (visitor_id) {
      const blacklistEntry = await prisma.blacklist.findFirst({
        where: {
          visitor_id: visitor_id,
          is_active: true,
        },
      });

      if (blacklistEntry) {
        return Response.json({ error: "Visitor is blacklisted" }, { status: 403 });
      }
    }
  }

  const newLog = await prisma.entry_log.create({
    data: {
      entry_time: new Date(),
      person_type: body.person_type,
      resident_id: resident_id,
      visitor_id: visitor_id,
      guard_id: Number(body.guard_id),
      purpose: body.purpose,
    },
  });

  if (body.gate_id) {
    await prisma.gate_log.create({
      data: {
        gate_id: Number(body.gate_id),
        log_id: newLog.log_id,
        action: "entry",
      },
    });
  }

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
