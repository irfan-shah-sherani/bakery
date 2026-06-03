"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MapPin, User, Mail, Phone, ShoppingBag } from "lucide-react";
import OverlayTop from "@/components/overlaytop";
import OverlayBottom from "@/components/overlaybottom";
import { createOrder } from "@/actions/order";

interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
    img: string;
}

interface OrderData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderData, setOrderData] = useState<OrderData>({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    // Parse cart from URL
    useEffect(() => {
        const cartParam = searchParams.get("cart");
        if (cartParam) {
            try {
                setCart(JSON.parse(decodeURIComponent(cartParam)));
            } catch (error) {
                console.error("Error parsing cart:", error);
            }
        }

        // Pre-fill user data if logged in
        if (session?.user) {
            const user = session.user as any;
            setOrderData((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
            }));
        }

        setIsLoading(false);
    }, [searchParams, session]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setOrderData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * 0.02;
    const total = subtotal + tax;

    // Validation utilities
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ""));
    };

    const validateName = (name: string): boolean => {
        return name.trim().length >= 2 && name.trim().length <= 100;
    };

    const validateAddress = (address: string): boolean => {
        return address.trim().length >= 10 && address.trim().length <= 500;
    };

    const handleConfirmOrder = async () => {
        // Validate name
        if (!orderData.name) {
            alert("❌ Please enter your full name");
            return;
        }
        if (!validateName(orderData.name)) {
            alert("❌ Name must be 2-100 characters");
            return;
        }

        // Validate email
        if (!orderData.email) {
            alert("❌ Please enter your email");
            return;
        }
        if (!validateEmail(orderData.email)) {
            alert("❌ Please enter a valid email address");
            return;
        }

        // Validate phone
        if (!orderData.phone) {
            alert("❌ Please enter your phone number");
            return;
        }
        if (!validatePhone(orderData.phone)) {
            alert("❌ Please enter a valid phone number (at least 10 digits)");
            return;
        }

        // Validate address
        if (!orderData.address) {
            alert("❌ Please enter your delivery address");
            return;
        }
        if (!validateAddress(orderData.address)) {
            alert("❌ Address must be 10-500 characters");
            return;
        }

        // Validate cart
        if (cart.length === 0) {
            alert("❌ Your cart is empty");
            return;
        }

        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        if (totalItems > 20) {
            alert("❌ Maximum 20 items per order");
            return;
        }

        setIsSubmitting(true);

        try {
            // First, create the order
            const result = await createOrder(
                {
                    ...orderData,
                    items: cart,
                    total,
                },
                session as any
            );

            if (!result.success) {
                alert(result.message);
                setIsSubmitting(false);
                return;
            }

            // Format items for email
            const itemsHtml = cart
                .map(
                    (item) => `
                <tr style="border-bottom: 1px solid #e4e4e7;">
                  <td style="padding: 12px; text-align: left;">${item.name}</td>
                  <td style="padding: 12px; text-align: center;">x${item.qty}</td>
                  <td style="padding: 12px; text-align: right;">$${(item.price * item.qty).toFixed(2)}</td>
                </tr>
              `
                )
                .join("");

            // Send confirmation email
            const emailResponse = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: orderData.email,
                    subject: `Order Confirmed #${result.orderId}`,
                    type: "order",
                    payload: {
                        customerName: orderData.name,
                        orderId: result.orderId,
                        totalAmount: total.toFixed(2),
                        itemsHtml,
                        address: orderData.address,
                        phone: orderData.phone,
                        itemsCount: cart.length,
                    },
                }),
            });

            const message = `Your order #${result.orderId} has been confirmed! Total: $${total.toFixed(2)}. Thank you for ordering from UniBakery!`;

            try {
                const response = await fetch("/api/send-sms", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ recipient: orderData.phone, message: message }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.warn("SMS sending failed:", data.error);
                } else {    
                    console.log("SMS sent successfully, SID:", data.sid);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }


            if (!emailResponse.ok) {
                console.warn("Email sending failed, but order was created");
            }

            alert("Order placed successfully! Check your email for confirmation.");
            window.location.href = "/";
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="relative min-h-screen bg-[#FFF8ED] py-24 px-4 md:px-10 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin">
                        <ShoppingBag size={48} className="text-[#D99A5B]" />
                    </div>
                    <p className="text-[#2D241E] mt-4 font-bold">Loading checkout...</p>
                </div>
            </section>
        );
    }

    if (cart.length === 0) {
        return (
            <section className="relative min-h-screen bg-[#FFF8ED] py-24 px-4 md:px-10 overflow-hidden">
                <OverlayTop />
                <OverlayBottom />
                <div className="max-w-6xl mx-auto relative z-10 text-center py-20">
                    <ShoppingBag size={64} className="mx-auto text-[#D99A5B]/30 mb-6" />
                    <h2 className="text-3xl font-black text-[#2D241E] mb-4 uppercase">Your cart is empty</h2>
                    <p className="text-[#7A6D63] mb-8">Add some delicious items before checking out!</p>
                    <Link href="/" className="inline-block bg-[#2D241E] text-white px-8 py-3 rounded-lg font-bold uppercase hover:bg-[#D99A5B] transition-colors">
                        Back to Menu
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen bg-[#FFF8ED] py-24 px-4 md:px-10 overflow-hidden">
            <OverlayTop />
            <OverlayBottom />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[#2D241E] font-bold uppercase text-xs tracking-widest hover:text-[#D99A5B] transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Back
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black text-[#2D241E] uppercase tracking-tighter">
                        Order Checkout
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: User Details & Address */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* User Information Section */}
                        <div className="bg-white p-8 shadow-lg rounded-xl border border-[#D99A5B]/10">
                            <div className="flex items-center gap-3 mb-6">
                                <User size={24} className="text-[#D99A5B]" />
                                <h2 className="text-2xl font-black text-[#2D241E] uppercase tracking-tighter">Your Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-[#7A6D63] tracking-widest mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={orderData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-[#D99A5B]/20 rounded-lg focus:border-[#D99A5B] focus:outline-none focus:ring-2 focus:ring-[#D99A5B]/20 transition-colors bg-[#FFFBFA]"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-[#7A6D63] tracking-widest mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={orderData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 border border-[#D99A5B]/20 rounded-lg focus:border-[#D99A5B] focus:outline-none focus:ring-2 focus:ring-[#D99A5B]/20 transition-colors bg-[#FFFBFA]"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-[#7A6D63] tracking-widest mb-2">
                                        <Phone size={14} className="inline mr-2" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={orderData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full px-4 py-3 border border-[#D99A5B]/20 rounded-lg focus:border-[#D99A5B] focus:outline-none focus:ring-2 focus:ring-[#D99A5B]/20 transition-colors bg-[#FFFBFA]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="bg-white p-8 shadow-lg rounded-xl border border-[#D99A5B]/10">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin size={24} className="text-[#D99A5B]" />
                                <h2 className="text-2xl font-black text-[#2D241E] uppercase tracking-tighter">Delivery Address</h2>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-[#7A6D63] tracking-widest mb-2">
                                    Full Address *
                                </label>
                                <textarea
                                    name="address"
                                    value={orderData.address}
                                    onChange={handleInputChange}
                                    placeholder="123 Main Street, Apartment 4B, City, State, ZIP Code"
                                    rows={4}
                                    className="w-full px-4 py-3 border border-[#D99A5B]/20 rounded-lg focus:border-[#D99A5B] focus:outline-none focus:ring-2 focus:ring-[#D99A5B]/20 transition-colors resize-none bg-[#FFFBFA]"
                                />
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-8 shadow-lg rounded-xl border border-[#D99A5B]/10">
                            <h2 className="text-2xl font-black text-[#2D241E] uppercase tracking-tighter mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-[#D99A5B]/10 last:border-0">
                                        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                                            <Image src={item.img} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-[#2D241E] uppercase">{item.name}</h4>
                                            <p className="text-[#7A6D63] text-sm">Qty: {item.qty}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-[#2D241E] text-lg">${(item.price * item.qty).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-[#2D241E] text-white p-8 rounded-xl shadow-2xl">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                                Order Summary
                            </h3>

                            <div className="space-y-4 text-sm mb-8">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Subtotal</span>
                                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Tax (2%)</span>
                                    <span className="font-bold">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl border-t border-white/10 pt-4 mt-4">
                                    <span className="font-black uppercase">Total</span>
                                    <span className="font-black text-[#D99A5B]">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmOrder}
                                disabled={isSubmitting}
                                className="w-full bg-[#D99A5B] text-[#2D241E] font-black py-4 rounded-lg uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-500 shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Processing..." : "Confirm Order"}
                            </button>

                            <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">
                                ✓ Secure & Encrypted Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section> 
    );
}
