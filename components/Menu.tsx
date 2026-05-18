"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag, Plus } from "lucide-react";
import CartDrawer from "./CartDrawer";

const categories = ["all", "bread", "pastries", "cakes", "cookies", "donuts", "cupcakes", "muffins", "tarts"];

interface BakeryItem {
  id: number; 
  name: string;
  price: number;
  category: string;
  img: string;
}

export default function EnhancedBakeryMenu({ initialItems = [] }: { initialItems?: BakeryItem[] }) {
  const [filter, setFilter] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<{ id: number; qty: number; name: string; price: number; img: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fallback cleanup in case initialItems is null or undefined
  const safeItems = Array.isArray(initialItems) ? initialItems : [];

  const filteredItems = safeItems.filter(item => {
    const itemCategory = (item.category || "").toLowerCase().trim();
    return filter === "all" || itemCategory === filter.toLowerCase();
  });

  // Debug: Log items after they're calculated
  React.useEffect(() => {
    console.log("🔍 Menu component mounted");
    console.log("📦 Received initialItems:", initialItems);
    console.log("📊 Safe items count:", safeItems.length);
    console.log("🎯 Filtered items count:", filteredItems.length);
  }, [safeItems, filteredItems]);

  const addToCart = (product: BakeryItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#FFFBFA] py-20 px-4 md:px-10 relative overflow-hidden">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-[1px] h-12 bg-[#D99A5B] mb-4" />
        <h2 className="text-4xl md:text-5xl font-black text-[#2D241E] mb-8 uppercase tracking-tighter">
          Artisan Bakery Menu
        </h2>

        <div className="flex flex-wrap justify-center gap-3 max-w-5xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 uppercase tracking-widest text-[10px] font-bold transition-all border ${
                filter === cat
                  ? "bg-[#2D241E] text-white border-[#2D241E] shadow-md"
                  : "bg-white text-[#2D241E] border-[#2D241E]/20 hover:border-[#D99A5B]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative group/slider">
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-25px] top-1/2 -translate-y-1/2 z-30 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover/slider:opacity-100 transition-opacity hidden md:block border border-[#D99A5B]/20 hover:bg-[#D99A5B] hover:text-white"
        >
          <ChevronLeft />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 no-scrollbar snap-x snap-mandatory pb-10 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {filteredItems.map((item, index) => (
            <div key={item.id} className="min-w-full md:min-w-[calc(33.333%-22px)] snap-start">
              
              <div className="group bg-white p-6 rounded-sm shadow-sm border border-transparent hover:border-[#D99A5B] transition-all duration-300 h-full flex flex-col">
                <div className="relative w-full aspect-square mb-6 overflow-hidden bg-[#F9F4F0]">
                  <Image
                    src={item.img || "/img/placeholder.jpg"}
                    alt={item.name || "Bakery Item"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-w-768px) 100vw, 33vw"
                    priority={index < 3} 
                    unoptimized // Prevents Next.js image optimizer from failing on uppercase string tags
                  />
                  <div className="absolute top-4 right-4 bg-[#D99A5B] text-[#2D241E] font-black px-3 py-1 rounded-sm text-lg shadow-md">
                    ${Number(item.price || 0).toFixed(2)} 
                  </div>
                </div>

                <div className="text-center flex flex-col flex-grow">
                  <h4 className="text-xl font-bold text-[#2D241E] mb-2 uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[#7A6D63] text-sm mb-6 line-clamp-2 italic">
                    Masterfully crafted with premium ingredients for the perfect flavor.
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-auto w-full bg-[#FFFBFA] border border-[#D99A5B] text-[#D99A5B] py-3 flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest hover:bg-[#D99A5B] hover:text-white transition-all"
                  >
                    <Plus size={16} /> Add to Box
                  </button>
                </div>
              </div>

            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="w-full text-center py-20 text-[#7A6D63] font-medium tracking-wide">
              Check back later for fresh batches!
            </div>
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-30 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover/slider:opacity-100 transition-opacity hidden md:block border border-[#D99A5B]/20 hover:bg-[#D99A5B] hover:text-white"
        >
          <ChevronRight />
        </button>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-10 right-10 z-50">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#2D241E] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-110 transition-transform active:scale-95"
          >
            <ShoppingBag size={24} />
            <span className="font-bold bg-[#D99A5B] w-6 h-6 rounded-full flex items-center justify-center text-xs text-[#2D241E]">
              {totalItems}
            </span>
          </button>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />
    </section>
  );
}