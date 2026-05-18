import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import OverlayTop from "./overlaytop";
import OverlayBottom from "./overlaybottom";

export default function ReservationSection() {
  return (
    <section className="relative w-full h-3xl py-24 md:py-32 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/bg-2.jpg" 
          alt="Coffee Beans Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Torn Paper Components */}
      <OverlayTop />
      <OverlayBottom />
    <div className=" absolute bg-[#d2691e] opacity-14   z-2 inset-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Offer Text */}
        <div className="text-white space-y-6">
          <h2 className="text-5xl md:text-7xl font-bold text-[#D99A5B]">
            30% OFF
          </h2>
          <h3 className="text-3xl md:text-4xl font-black">
            For Online Reservation
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md">
            Lorem justo clita erat lorem labore ea, justo dolor lorem ipsum ut sed eos, ipsum et dolor kasd sit ea justo. Erat justo sed sed diam. Ea et erat ut sed diam sea.
          </p>
          <ul className="space-y-3">
            {["Lorem ipsum dolor sit amet", "Lorem ipsum dolor sit amet", "Lorem ipsum dolor sit amet"].map((text, i) => (
              <li key={i} className="flex items-center gap-3 font-bold">
                <Check className="text-[#D99A5B]" size={20} strokeWidth={3} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Booking Form */}
        <div className="bg-[#2D241E]/80 p-8 md:p-12 text-center">
          <h3 className="text-3xl font-black text-white mb-8">Book Your Table</h3>
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full bg-transparent border border-gray-500 p-3 text-white placeholder-gray-400 outline-none focus:border-[#D99A5B]"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-transparent border border-gray-500 p-3 text-white placeholder-gray-400 outline-none focus:border-[#D99A5B]"
            />
            <input 
              type="date" 
              className="w-full bg-transparent border border-gray-500 p-3 text-white placeholder-gray-400 outline-none focus:border-[#D99A5B]"
            />
            <input 
              type="time" 
              className="w-full bg-transparent border border-gray-500 p-3 text-white placeholder-gray-400 outline-none focus:border-[#D99A5B]"
            />
            <select className="w-full bg-transparent border border-gray-500 p-3 text-gray-400 outline-none focus:border-[#D99A5B]">
              <option>Person</option>
              <option>1 Person</option>
              <option>2 Persons</option>
              <option>4+ Persons</option>
            </select>
            <button className="w-full bg-[#D99A5B] hover:bg-[#c4854a] text-[#2D241E] font-black py-4 transition-colors uppercase tracking-widest">
              Book Now
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}