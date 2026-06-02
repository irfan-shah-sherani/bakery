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

export async function createOrder(payload: OrderPayload, session: Session | null) {
  try {
    // Validate required fields
    if (!payload.name || !payload.email || !payload.phone || !payload.address) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // If user is logged in, update their profile with address/phone
    if (session?.user) {
      const user = session.user as any;
      await prisma.user.update({
        where: { email: user.email },
        data: {
          phone: payload.phone,
          address: payload.address,
        },
      });
    }

    console.log("Order created:", { orderId, ...payload });

    return {
      success: true,
      message: "Order placed successfully!",
      orderId,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: "Failed to create order",
    };
  }
}
    //   email     String
    //   phone     String
    //   address   String
    //   items     Json
    //   total     Float
    //   status    String   @default("pending")
    //   createdAt DateTime @default(now())
    // }

//     console.log("Order created:", payload);

//     return {
//       success: true,
//       message: "Order placed successfully!",
//     };
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return {
//       success: false,
//       message: "Failed to create order",
//     };
//   }
// }
