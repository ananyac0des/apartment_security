import prisma from "@/lib/prisma";

export async function GET() {
  const guards = await prisma.security_guard.findMany();
  return Response.json(guards);
}