"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { randomInt } from "crypto";

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 6;
}

function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("🔍 Registration attempt for:", email);

  // Validation
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return { error: "All fields are required" };
  }

  if (!validateName(name)) {
    return { error: "Name must be 2-100 characters" };
  }

  if (!validateEmail(email)) {
    return { error: "Invalid email format" };
  }

  if (!validatePassword(password)) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email already registered. Please login instead." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP code
    const code = randomInt(100000, 999999).toString();

    // Create user and OTP in transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
        }
      });

      await tx.otp.deleteMany({ where: { email: email.toLowerCase().trim() } });

      await tx.otp.create({
        data: {
          email: email.toLowerCase().trim(),
          code,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      });
    });

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
      await fetch(`${baseUrl}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Verify Your Email - Bakery App',
          type: 'otp',
          payload: { code }
        })
      });
    } catch (emailError) {
      console.warn("⚠️ Email sending failed, but account created:", emailError);
    }

    console.log(`✅ User registered successfully. OTP code: ${code}`);

  } catch (error) {
    console.error("❌ Registration error:", error);
    return { error: "Registration failed. Please try again." };
  }

  redirect(`/otp?email=${encodeURIComponent(email)}`);
}