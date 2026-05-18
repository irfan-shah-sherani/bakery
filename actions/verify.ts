"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function verifyCode(email: string, inputCode: string) {
 
  const record = await prisma.otp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" } 
  });

  if (!record || record.code !== inputCode) {
    return { error: "Invalid code" };
  }

  if (new Date() > record.expiresAt) {
    return { error: "Code expired. Please request a new one." };
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { isVerified: true }
      }),
      
      prisma.otp.deleteMany({
        where: { email }
      })
    ]);
  } catch (error) {
    console.error("Verification transaction failed:", error);
    return { error: "Something went wrong during verification." };
  }


  redirect("/");
}