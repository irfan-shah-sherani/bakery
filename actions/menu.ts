"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";

// Path set specifically to ./data/menu.json in your root directory
const jsonFilePath = path.join(process.cwd(), "data", "menu.json");

// Helper function to sync DB data into the JSON file
async function syncDbToJson() {
  const latestDbItems = await prisma.menu.findMany({
    orderBy: { id: "asc" },
  });

  // Ensure directory exists dynamically just in case
  await fs.mkdir(path.dirname(jsonFilePath), { recursive: true });

  // Overwrite the local json file with fresh data
  await fs.writeFile(
    jsonFilePath,
    JSON.stringify(latestDbItems, null, 2),
    "utf-8",
  );
}

// --- 1. USER-FACING FETCH (Strictly reads from ./data/menu.json) ---
export async function getJsonBakeryMenu() {
  try {
    const fileData = await fs.readFile(jsonFilePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading data/menu.json:", error);
    return [];
  }
}

// --- 2. ADMIN ACTIONS (Saves to DB + Overwrites JSON File) ---

export async function addBakeryItem(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const file = formData.get("img") as File | null;

    let relativeImagePath = "/img/placeholder.jpg";

    if (file && file.size > 0 && file.name !== "undefined") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExtension = path.extname(file.name);
      const filename = `${uniqueSuffix}${fileExtension}`;

      const publicUploadsPath = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(publicUploadsPath, { recursive: true });

      const filePath = path.join(publicUploadsPath, filename);
      await fs.writeFile(filePath, buffer);

      relativeImagePath = `/uploads/${filename}`;
    }

    // 1. Save to Database
    const item = await prisma.menu.create({
      data: { name, price, category, img: relativeImagePath },
    });

    // 2. Instantly update ./data/menu.json
    await syncDbToJson();

    revalidatePath("/menu");
    return { success: true, data: item };
  } catch (error) {
    console.error("Error adding item:", error);
    return { success: false, error: "Failed to add item" };
  }
}

export async function updateBakeryItem(
  id: number,
  data: { name: string; price: number; category: string; img: string },
) {
  try {
    const { id: _, ...cleanUpdateData } = data as any;

    // 1. Update Database
    const item = await prisma.menu.update({
      where: { id: Number(id) },
      data: cleanUpdateData,
    });

    // 2. Instantly update ./data/menu.json
    await syncDbToJson();

    revalidatePath("/menu");
    return { success: true, data: item };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteBakeryItem(id: number) {
  try {
    // 1. Find the item first
    const item = await prisma.menu.findUnique({
      where: { id: Number(id) },
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    // 2. Delete image from /public/uploads
    if (
      item.img &&
      item.img.startsWith("/uploads/") &&
      item.img !== "/img/placeholder.jpg"
    ) {
      const imagePath = path.join(process.cwd(), "public", item.img);

      try {
        await fs.unlink(imagePath);
      } catch (fileError) {
        console.error("Error deleting image file:", fileError);
      }
    }

    // 3. Delete item from Database
    await prisma.menu.delete({
      where: { id: Number(id) },
    });
    
    // 4. Sync DB to JSON
    await syncDbToJson();

    revalidatePath("/menu");

    return { success: true };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}
