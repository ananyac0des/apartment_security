import prisma from "@/lib/prisma";

// GET all visitors + blacklist info
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const resident_id = searchParams.get("resident_id");

  const visitors = await prisma.visitor.findMany({
    where: resident_id ? { resident_id: Number(resident_id) } : undefined,
    include: {
      blacklist: true,
    },
    orderBy: { visitor_id: "asc" },
  });

  return Response.json(visitors);
}

// CREATE visitor
export async function POST(req: Request) {
  const body = await req.json();

  const v = await prisma.visitor.create({
    data: {
      full_name: body.full_name,
      phone: body.phone || null,
      id_proof_type: body.id_proof_type || null,
      id_proof_number: body.id_proof_number || null,
      resident_id: body.resident_id ? Number(body.resident_id) : undefined,
      status: "pending", // default approved = false
    },
  });

  return Response.json(v);
}

// UPDATE: approve / block / unblock
export async function PUT(req: Request) {
  const body = await req.json();

  // block
  if (body.action === "block") {
    const blk = await prisma.blacklist.create({
      data: {
        visitor_id: Number(body.visitor_id),
        reason: body.reason || "Blocked by guard",
        blacklisted_on: new Date(),
        is_active: true,
      },
    });
    return Response.json(blk);
  }

  // unblock (deactivate latest active blacklist)
  if (body.action === "unblock") {
    const latest = await prisma.blacklist.findFirst({
      where: {
        visitor_id: Number(body.visitor_id),
        is_active: true,
      },
      orderBy: { blacklist_id: "desc" },
    });

    if (latest) {
      const upd = await prisma.blacklist.update({
        where: { blacklist_id: latest.blacklist_id },
        data: { is_active: false },
      });
      return Response.json(upd);
    }

    return Response.json({ message: "No active block" });
  }

  // approve flag (soft-approval stored as no-active-blacklist)
  return Response.json({ message: "No-op" });
}