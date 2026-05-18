"use server";

import  prisma  from "@/lib/prisma";

export async function submitOffer(email: string) {
  console.log("Email received:", email);
//   try {
//     const product = await prisma.user.create({
//       \\
//     });
//     console.log("Product created:", product);
//     return { success: true, product };
//   } catch (error) {
//     console.error("Database Error:", error);
//     return { success: false, error: "Failed to create product" };
//   }
}
