import React from "react";
import Image from "next/image";

const reviews = [
  {
    name: "Client Name",
    profession: "Profession",
    image: "/img/testimonial-1.jpg",
    text: "Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum sanct clita",
  },
  {
    name: "Client Name",
    profession: "Profession",
    image: "/img/testimonial-2.jpg",
    text: "Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum sanct clita",
  },
  {
    name: "Client Name",
    profession: "Profession",
    image: "/img/testimonial-3.jpg",
    text: "Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum sanct clita",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#FFF8ED] py-20 px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-[1px] h-16 bg-[#D99A5B] mb-6" />
        <span className="text-[#D99A5B] font-bold tracking-[0.3em] uppercase text-sm mb-4">
          Testimonial
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-[#2D241E]">
          Our Clients Say
        </h2>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {reviews.map((review, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <h4 className="text-xl font-bold text-[#2D241E]">
                  {review.name}
                </h4>
                <p className="text-[#7A6D63] text-sm italic">
                  {review.profession}
                </p>
              </div>
            </div>
            <p className="text-[#7A6D63] text-base leading-relaxed text-left">
              {review.text}
            </p>
          </div>
        ))}
      </div>

      {/* Slider Indicators */}
      <div className="flex justify-center items-center gap-2 mt-12">
        <div className="w-4 h-4 rounded-full bg-[#D99A5B]/60" />
        <div className="w-4 h-4 rounded-full bg-[#D99A5B]/60" />
        <div className="w-4 h-4 rounded-full bg-[#D99A5B]" />
        <div className="w-10 h-4 rounded-full bg-[#2D241E]" />
      </div>
    </section>
  );
}