"use server";

import prisma from "@/lib/prisma";
import { Session } from "next-auth";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
}

export interface OrderPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
}

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

function validateAddress(address: string): boolean {
  return address.trim().length >= 10 && address.trim().length <= 500;
}

export async function createOrder(payload: OrderPayload, session: Session | null) {
  try {
    // Validate all required fields
    if (!payload.name?.trim() || !payload.email?.trim() || !payload.phone?.trim() || !payload.address?.trim()) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    // Validate name
    if (!validateName(payload.name)) {
      return {
        success: false,
        message: "Name must be 2-100 characters",
      };
    }

    // Validate email
    if (!validateEmail(payload.email)) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }

    // Validate phone
    if (!validatePhone(payload.phone)) {
      return {
        success: false,
        message: "Phone must contain at least 10 digits",
      };
    }

    // Validate address
    if (!validateAddress(payload.address)) {
      return {
        success: false,
        message: "Address must be 10-500 characters",
      };
    }

    // Validate items
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return {
        success: false,
        message: "Cart cannot be empty",
      };
    }

    const totalQty = payload.items.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty > 20) {
      return {
        success: false,
        message: "Maximum 20 items per order",
      };
    }

    // Validate total
    if (payload.total <= 0) {
      return {
        success: false,
        message: "Invalid order total",
      };
    }

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // If user is logged in, update their profile with address/phone
    if (session?.user) {
      const user = session.user as any;
      try {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            phone: payload.phone,
            address: payload.address,
          },
        });
      } catch (error) {
        console.warn("Could not update user profile:", error);
      }
    }

    console.log("✅ Order created successfully:", { orderId, items: payload.items.length, total: payload.total });

    return {
      success: true,
      message: "Order placed successfully!",
      orderId,
    };
  } catch (error) {
    console.error(" Error creating order:", error);
    return {
      success: false,
      message: "Failed to create order. Please try again.",
    };
  }
}
