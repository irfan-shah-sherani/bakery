"use client";

import { submitOffer } from "@/actions/offer";


import Image from "next/image";
import OverlayBottom from "./overlaybottom";
import OverlayTop from "./overlaytop";
import { useState } from "react";

export default function Offer() {

  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await submitOffer(email);
    console.log("Offer submission result:", result);
    setEmail("");
  }

  return (
    <section className="relative w-full py-24 md:py-48 overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/bg-2.jpg" 
          alt="Coffee Beans Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* --- TOP TORN PAPER EDGE --- */}
      <OverlayTop />
    <div className=" absolute bg-[#d2691e] opacity-14   z-2 inset-0" />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl md:text-7xl font-bold text-[#D99A5B] mb-4">50% OFF</h2>
        <h3 className="text-2xl md:text-4xl font-black text-white mb-4">Sunday Special Offer</h3>
        <p className="text-gray-200 text-sm md:text-base font-medium mb-10 tracking-wide">
          Only for Sunday from 1st Jan to 30th Jan 2045
        </p>

        <div className="flex w-full max-w-md bg-white p-1">
          <form onSubmit={handleSubmit} className="flex w-full">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-4 py-3 outline-none text-gray-700"
          />
          <button type="submit" className="bg-[#D99A5B] hover:bg-[#c4854a] text-[#2D241E] font-bold px-8 py-3 transition-colors">
            Sign Up
          </button>
          </form>
        </div>
      </div>

      {/* --- BOTTOM TORN PAPER EDGE --- */}
      <OverlayBottom />
    </section>
  );
}