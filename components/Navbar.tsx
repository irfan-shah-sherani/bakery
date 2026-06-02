"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react"; // Imported for mobile menu toggle

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Reusable Nav Links to prevent repeating code
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
    { name: "Services", href: "/services" },
    { name: "Menu", href: "/menu" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between text-white px-4 md:px-8 py-2 bg-transparent">
      {/* Logo Container */}
      <div className="relative text-white font-black text-2xl tracking-tighter w-16 h-16 md:w-24 md:h-24">
        <Image src="/img/logo.png" alt="Logo" fill className="object-contain" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 uppercase text-sm font-bold tracking-widest bg-black/50 px-8 py-4 backdrop-blur-sm rounded-sm">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-[#B79D6F] transition-colors">
            {link.name}
          </Link>
        ))}
        <Link href="/login" className="hover:text-[#B79D6F] transition-colors border-l pl-8 border-white/20">
          {status === "authenticated" ? session?.user?.name : "Login"}
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu} 
        className="md:hidden z-50 p-2 text-white bg-black/40 hover:bg-black/60 transition-colors rounded-md"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Drawer Overlay */}
      <div 
        className={`fixed inset-x-0 top-0 bg-black/95 backdrop-blur-md pt-24 pb-8 px-6 transition-all duration-300 ease-in-out md:hidden flex flex-col gap-6 text-center uppercase text-base font-bold tracking-widest border-b border-white/10 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            onClick={() => setIsOpen(false)} // Close menu on click
            className="hover:text-[#B79D6F] py-2 transition-colors border-b border-white/5"
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="/login" 
          onClick={() => setIsOpen(false)}
          className="text-[#B79D6F] py-2 mt-2"
        >
          {status === "authenticated" ? session?.user?.name : "Login"}
        </Link>
      </div>
    </nav>
  );
}