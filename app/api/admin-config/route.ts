import { NextResponse } from "next/server";

export async function GET() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || null;
  return NextResponse.json({ adminEmail });
}
