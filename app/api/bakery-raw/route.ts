import prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.menu.findMany({
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}