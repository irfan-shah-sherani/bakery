"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Coffee, Lock, Mail } from "lucide-react";
import OverlayTop from "@/components/overlaytop";
import OverlayBottom from "@/components/overlaybottom";

export default function Page() {
  const router = useRouter();
  
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const result = await signIn("credentials", {
      redirect: false, 
      email,
      password,
    });

    if (result?.error) {
      
      if (result.error.includes("UNVERIFIED_ACCOUNT")) {
       
        router.push(`/verify-code?email=${encodeURIComponent(email)}`);
      } else {
       
        setError("Invalid email or password");
      }
    } else {
      
      router.push("/");
      router.refresh();
    }
  } catch (err) {
    setError("An unexpected error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-black/50 py-20 px-4 overflow-hidden">
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
              Welcome Back
            </h2>
            <p className="text-[#7A6D63] text-sm mt-2">
              Freshly brewed coffee is waiting for you.
            </p>
          </div>

          
          {error && (
            <div className="mb-6 p-3 text-xs font-bold uppercase tracking-wider text-center text-red-600 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

         
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#2D241E]">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6D63]">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8ED] border border-gray-200 focus:border-[#D99A5B] outline-none text-[#2D241E] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-[#2D241E]">
                  Password
                </label>
                <Link href="#" className="text-xs text-[#D99A5B] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6D63]">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8ED] border border-gray-100 focus:border-[#D99A5B] outline-none text-[#2D241E] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2D241E] hover:bg-black text-white font-black py-4 uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

  
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-[#7A6D63] text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#D99A5B] font-bold hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute right-10 bottom-10 hidden lg:block">
        <div className="w-[1px] h-32 bg-[#D99A5B]/30" />
      </div>
    </section>
  );
}