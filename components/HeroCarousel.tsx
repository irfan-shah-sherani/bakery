"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OverlayBottom from "./overlaybottom";
import Overlaytop from "./overlaytop";

const slides = [
  { id: 1, image: "/img/carousel-3.jpg", subtext: "We Have Been Serving", title: "COFFEE", since: "* SINCE 1950 *" },
  { id: 2, image: "/img/carousel-4.jpg", subtext: "Freshly Baked Daily", title: "PASTRIES", since: "* TRADITIONAL RECIPES *" },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const animateSlide = (direction: "in" | "out", callback?: () => void) => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      opacity: direction === "in" ? 1 : 0,
      y: direction === "in" ? 0 : 20,
      duration: 0.8,
      ease: "power2.out",
      onComplete: callback,
    });
  };

  const nextSlide = () => {
    animateSlide("out", () => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      animateSlide("in");
    });
  };

  const prevSlide = () => {
    animateSlide("out", () => {
      setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      animateSlide("in");
    });
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="relative h-screen  w-full  overflow-hidden">
      {/* Background Images */}
      <div className=" absolute bg-[#d2691e] opacity-14   z-2 inset-0" />
      <Overlaytop />
      <div className=" z-1">
        <Image
          src={slides[currentIndex].image}
          alt="Background"
          fill
          className="object-cover blur-4"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-all">
        <ChevronLeft size={48} strokeWidth={1} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-all">
        <ChevronRight size={48} strokeWidth={1} />
      </button>

      {/* Center Content */}
      <div ref={contentRef} className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white px-4">
        <p className="mb-2 text-lg font-medium tracking-wide text-orange-400 uppercase">{slides[currentIndex].subtext}</p>
        <h1 className="mb-4 text-7xl font-black tracking-tighter md:text-9xl uppercase">{slides[currentIndex].title}</h1>
        <p className="text-xl font-semibold tracking-widest text-gray-200">{slides[currentIndex].since}</p>
      </div>

      <OverlayBottom />
    </section>
  );
} 

