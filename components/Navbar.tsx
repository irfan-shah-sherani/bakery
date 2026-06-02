"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between text-white px-8 py-2 bg-transparent">
      <div className="relative text-white font-black text-2xl tracking-tighter w-24 h-24">
        <Image src="/img/logo.png" alt="Logo" fill className="object-contain" />
      </div>
      <div className="hidden md:flex gap-8  uppercase text-sm font-bold tracking-widest bg-black/50 px-8 py-4 ">
        <Link href="/" className="hover:text-[#B79D6F] transition-colors">Home</Link>
        <Link href="/contact" className="hover:text-[#B79D6F] transition-colors">contact</Link>
        <Link href="/services" className="hover:text-[#B79D6F] transition-colors">Services</Link>
        <Link href="/menu" className="hover:text-[#B79D6F] transition-colors">Menu</Link>
        <Link href="/login" className="hover:text-[#B79D6F] transition-colors border-l pl-8 border-white/20">
          {status === "authenticated" ? session.user?.name : "Login"}
        </Link>
      </div>
    </nav>
  );
}