import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

export default function About() {
  return (
    <section className="relative bg-[#FFF8ED] py-20 px-4 md:px-10 overflow-hidden">
      {/* Top Header Part */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-[2px] h-16 bg-orange-400 mb-6" />
        <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-sm mb-2">
          About Us
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-[#2D241E]">
          Serving Since 1950
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        
        {/* Left Column: Our Story */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-[#2D241E]">Our Story</h3>
          <p className="text-[#554940] font-semibold leading-relaxed">
            Eos kasd eos dolor vero vero, lorem stet diam rebum. Ipsum amet sed vero dolor sea
          </p>
          <p className="text-[#7A6D63] text-sm leading-loose">
            Takimata sed vero vero no sit sed, justo clita duo no duo amet et, nonumy kasd sed dolor eos diam lorem eirmod. Amet sit amet amet no. Est nonumy sed labore eirmod sit magna. Erat at est justo sit ut. Labor diam sed ipsum et eirmod
          </p>
          <button className="bg-[#2D241E] text-white px-8 py-3 font-bold hover:bg-black transition-colors">
            Learn More
          </button>
        </div>

        {/* Center Column: Coffee Splash Image */}
        <div className="relative flex justify-center z-10 lg:-mt-24">
          <div className="relative w-[300px] h-[450px] md:w-[400px] md:h-[600px]">
            <Image
              src="/img/about.png" // Replace with your coffee splash image path
              alt="Coffee Splash"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Column: Our Vision */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-[#2D241E]">Our Vision</h3>
          <p className="text-[#7A6D63] text-sm leading-loose">
            Invidunt lorem justo sanctus clita. Erat lorem labore ea, justo dolor lorem ipsum ut sed eos, ipsum et dolor kasd sit ea justo. Erat justo sed sed diam. Ea et erat ut sed diam sea ipsum est dolor
          </p>
          
          <ul className="space-y-4">
            {[1, 2, 3].map((item) => (
              <li key={item} className="flex items-center gap-3 text-[#2D241E] font-bold">
                <Check className="text-orange-500" size={20} strokeWidth={3} />
                Lorem ipsum dolor sit amet
              </li>
            ))}
          </ul>

          <button className="bg-[#D99A5B] text-white px-8 py-3 font-bold hover:bg-[#c4854a] transition-colors">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}