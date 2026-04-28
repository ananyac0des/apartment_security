import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const { id } = await context.params;

  const deleted = await prisma.resident.delete({
    where: {
      resident_id: Number(id),
    },
  });

  return Response.json(deleted);
}