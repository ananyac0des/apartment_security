import prisma from "@/lib/prisma";

export async function GET() {
  // counts
  const [
    totalResidents,
    totalVisitors,
    totalGuards,
    totalApartments,
    occupiedApartments,
    vacantApartments,
    maintenanceApartments,
    totalIncidents,
    unresolvedIncidents,
  ] = await Promise.all([
    prisma.resident.count(),
    prisma.visitor.count(),
    prisma.security_guard.count(),
    prisma.apartment.count(),
    prisma.apartment.count({ where: { status: "occupied" } }),
    prisma.apartment.count({ where: { status: "vacant" } }),
    prisma.apartment.count({ where: { status: "maintenance" } }),
    prisma.incident.count(),
    prisma.incident.count({ where: { resolved: false } }),
  ]);

  // recent logs
  const recentLogs = await prisma.entry_log.findMany({
    include: {
      resident: true,
      visitor: true,
      security_guard: true,
    },
    orderBy: {
      entry_time: "desc",
    },
    take: 5,
  });

  return Response.json({
    totalResidents,
    totalVisitors,
    totalGuards,
    totalApartments,
    occupiedApartments,
    vacantApartments,
    maintenanceApartments,
    totalIncidents,
    unresolvedIncidents,
    recentLogs,
  });
}