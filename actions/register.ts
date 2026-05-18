"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { randomInt } from "crypto";

export async function registerUser(formData: FormData) { 

  console.log("Received registration data:", {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") ? "Provided" : "Not provided"
  });
     
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
 
  if (!email || !password || !name) {
    return { error: "Missing required fields" };
  }

  try {

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 12);

    const code = randomInt(100000, 999999).toString();

    await prisma.$transaction(async (tx) => {

      await tx.user.create({
        data: { name, email, password: hashedPassword }
      });

      await tx.otp.deleteMany({ where: { email } });

      await tx.otp.create({
        data: {
          email,
          code,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      });
    });

    console.log(`Verification code for ${email}: ${code}`); 
    
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong. Please try again." };
  } 

  redirect(`/otp?email=${encodeURIComponent(email)}`);
}