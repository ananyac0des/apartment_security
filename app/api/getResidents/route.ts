import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.resident.findMany();
  return Response.json(data);
}