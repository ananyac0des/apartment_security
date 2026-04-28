import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.apartment.findMany();
  return Response.json(data);
}