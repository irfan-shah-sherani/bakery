"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Lock, Mail, User, ArrowRight } from "lucide-react";
import OverlayTop from "@/components/overlaytop";
import OverlayBottom from "@/components/overlaybottom";
import { registerUser } from "@/actions/register";

export default function Page() {
  // Manage dynamic UI state handlers
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await registerUser(formData);
      
      // If the Server Action returns an error object, capture and render it
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Form handling execution failure:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-black/50 py-20 px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <Image
          src="/img/bg.jpg"
          alt="Texture"
          fill
          className="object-cover"
        />
      </div>

      <OverlayTop />
      <OverlayBottom />

      <div className="relative z-10 w-full max-w-md bg-white shadow-2xl overflow-hidden border border-gray-100">
        <div className="h-2 w-full bg-[#D99A5B]" />

        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-[#2D241E] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Coffee className="text-[#D99A5B]" size={32} />
            </div>
            <h2 className="text-3xl font-black text-[#2D241E] uppercase tracking-tighter">
              Join the Club
            </h2>
            <p className="text-[#7A6D63] text-sm mt-2">
              Create an account and start earning bean points.
            </p>
          </div>

          {/* Render error notification alert when registration encounters problems */}
          {error && (
            <div className="mb-6 p-3 text-xs font-bold uppercase tracking-wider text-center text-red-600 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#2D241E]">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6D63]">
                  <User size={18} />
                </span>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8ED] border border-gray-200 focus:border-[#D99A5B] outline-none text-[#2D241E] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#2D241E]">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6D63]">
                  <Mail size={18} />
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8ED] border border-gray-100 focus:border-[#D99A5B] outline-none text-[#2D241E] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#2D241E]">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6D63]">
                  <Lock size={18} />
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8ED] border border-gray-100 focus:border-[#D99A5B] outline-none text-[#2D241E] transition-all"
                  required
                />
              </div>
            </div>

            <p className="text-[10px] text-[#7A6D63] text-center leading-tight">
              By clicking Sign Up, you agree to our Terms of Service and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2D241E] hover:bg-black text-white font-black py-4 uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              <ArrowRight size={18} className="text-[#D99A5B]" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-[#7A6D63] text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#D99A5B] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute left-10 bottom-10 hidden lg:block">
        <div className="w-[1px] h-32 bg-[#D99A5B]/30" />
      </div>
    </section>
  );
}