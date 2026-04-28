import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const newResident = await prisma.resident.create({
    data: {
      full_name: body.full_name,
      phone: body.phone,
      email: body.email,
      apartment_id: Number(body.apartment_id),
    },
  });

  return NextResponse.json(newResident);
}