import React from "react";
import Image from "next/image";
import { Truck, Coffee, Award, CalendarDays } from "lucide-react";

const services = [
  {
    title: "Fastest Door Delivery",
    image: "/img/service-6.jpg",
    icon: <Truck className="text-[#8B5E3C]" size={20} />,
  },
  {
    title: "Fresh Coffee Beans",
    image: "/img/service-5.jpg",
    icon: <Coffee className="text-[#8B5E3C]" size={20} />,
  },
  {
    title: "Best Quality Coffee",
    image: "/img/service-7.jpg",
    icon: <Award className="text-[#8B5E3C]" size={20} />,
  },
  {
    title: "Online Table Booking",
    image: "/img/service-8.jpg",
    icon: <CalendarDays className="text-[#8B5E3C]" size={20} />,
  },
];

export default function Services() {
  return (
    <section className="bg-[#FFF8ED] py-20 px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-[1px] h-16 bg-[#D99A5B] mb-6" />
        <span className="text-[#D99A5B] font-bold tracking-[0.3em] uppercase text-sm mb-4">
          Our Services
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-[#2D241E]">
          Fresh & Organic Beans
        </h2>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`flex flex-col md:flex-row items-center gap-6 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image Box */}
            <div className="relative w-full md:w-1/2 aspect-square">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Text Box */}
            <div className="w-full md:w-1/2 flex flex-col items-start gap-4 text-left">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D99A5B]">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#2D241E]">
                  {service.title}
                </h3>
              </div>
              <p className="text-[#7A6D63] text-sm leading-relaxed">
                Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}