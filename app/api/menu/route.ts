// app/api/menu/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

// --- GET: Fetch live data as pure JSON ---
export async function GET() {
  try {
    const items = await prisma.menu.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(items, {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const file = formData.get("img") as File | null;

    let relativeImagePath = "/img/placeholder.jpg";

    if (file && file.size > 0 && file.name !== "undefined") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

   const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
const fileExtension = path.extname(file.name).toLowerCase();
const filename = `${uniqueSuffix}${fileExtension}`;

      const publicUploadsPath = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(publicUploadsPath, { recursive: true });

      const filePath = path.join(publicUploadsPath, filename);
      await fs.writeFile(filePath, buffer);

      relativeImagePath = `/uploads/${filename}`;
    }

    const newItem = await prisma.menu.create({
      data: { name, price, category, img: relativeImagePath },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}