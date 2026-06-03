"use client";

import React, { useState, Suspense } from "react"; // Added Suspense
import Image from "next/image";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { Coffee, ShieldCheck, ArrowLeft, RefreshCcw } from "lucide-react";
import OverlayTop from "@/components/overlaytop";
import OverlayBottom from "@/components/overlaybottom";
import { verifyCode } from "@/actions/verify";

// 1. Move your UI form and query string processing into a sub-component
function OtpFormContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await verifyCode(email, code);

    if (result?.error) {
      setError(result.error);
    }

    console.log("Verifying code for:", email, "Code:", code);
  };

  return (
    <div className="relative z-10 w-full max-w-md bg-white shadow-2xl overflow-hidden border border-gray-100">
      <div className="h-2 w-full bg-[#D99A5B]" />

      <div className="p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-[#2D241E] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="text-[#D99A5B]" size={32} />
          </div>
          <h2 className="text-3xl font-black text-[#2D241E] uppercase tracking-tighter">
            Verify It&apos;s You
          </h2>
          <p className="text-[#7A6D63] text-sm mt-2">
            Sent to: <span className="font-bold text-[#2D241E]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full text-center text-4xl font-black tracking-[0.5em] py-4 bg-[#FFF8ED] border-2 border-dashed border-[#D99A5B]/30 focus:border-[#D99A5B] focus:border-solid outline-none text-[#2D241E] transition-all placeholder:text-gray-300"
              required
            />

            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#2D241E] hover:bg-black text-white font-black py-4 uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
            >
              Verify Account
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-xs text-[#7A6D63] uppercase tracking-widest font-bold">
            Didn&apos;t get the code?
          </p>
          <button
            type="button"
            className="group flex items-center gap-2 text-[#D99A5B] font-black text-sm hover:text-[#2D241E] transition-colors"
          >
            <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            RESEND NEW CODE
          </button>
        </div>

        <div className="mt-10 text-center border-t border-gray-100 pt-6">
          <Link href="/register" className="text-[#7A6D63] text-xs flex items-center justify-center gap-2 hover:underline">
            <ArrowLeft size={14} />
            USE A DIFFERENT EMAIL
          </Link>
        </div>
      </div>
    </div>
  );
}

// 2. The main page component acts as the global layout and isolates searchParams via Suspense
export default function page() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-black/50 py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <Image src="/img/bg.jpg" alt="Texture" fill className="object-cover" />
      </div>

      <OverlayTop />
      <OverlayBottom />

      {/* Wrapping the inner form inside Suspense fixes the Next.js static compilation error */}
      <Suspense fallback={
        <div className="relative z-10 w-full max-w-md bg-white p-12 text-center shadow-2xl border border-gray-100 font-bold text-[#2D241E]">
          Loading validation module...
        </div>
      }>
        <OtpFormContent />
      </Suspense>
    </section>
  );
}