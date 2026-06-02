"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { X, Trash2, Plus, Minus, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function CartDrawer({ isOpen, onClose, cart, setCart }: Props) {
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, display: "block", duration: 0.3 });
      gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, display: "none", duration: 0.3 });
      gsap.to(drawerRef.current, { x: "100%", duration: 0.5, ease: "power3.in" });
    }
  }, [isOpen]);

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      {/* Dark Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] hidden opacity-0"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#FFFBFA] z-[70] shadow-2xl translate-x-full flex flex-col"
      >
        {/* Header */}
        <div className="p-8 flex justify-between items-center border-b border-[#D99A5B]/10">
          <div>
            <h2 className="text-2xl font-black text-[#2D241E] uppercase tracking-tighter">Your Bakery Box</h2>
            <p className="text-[#D99A5B] text-xs font-bold uppercase tracking-[0.2em] mt-1">Freshly Picked</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#2D241E] hover:rotate-90 transition-transform duration-300">
            <X size={28} />
          </button>
        </div>

        {/* Centered Items Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#FFFBFA]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBasket size={48} className="text-[#D99A5B]/30" />
              <p className="text-[#7A6D63] font-medium italic">Your box is currently empty.<br />Fill it with something sweet!</p>
            </div>
          ) : (
            cart.map((item) => (
              /* Mini-Card Design */
              <div key={item.id} className="bg-white border border-[#D99A5B]/10 rounded-xl p-4 shadow-sm flex items-center gap-4 group hover:border-[#D99A5B]/40 transition-colors">
                {/* Image Section */}
                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F9F4F0]">
                  <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Info Section */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[#2D241E] text-sm uppercase leading-tight">{item.name}</h4>
                    <button
                      onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                      className="text-red-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-[#D99A5B] font-black text-base mt-1">${(item.price * item.qty).toFixed(2)}</p>

                  {/* Styled Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-[#FFFBFA] border border-[#D99A5B]/20 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1 text-[#2D241E] hover:text-[#D99A5B] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-black text-[#2D241E] min-w-[30px] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 text-[#2D241E] hover:text-[#D99A5B] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-8 bg-white border-t border-[#D99A5B]/10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#7A6D63] font-bold text-xs uppercase tracking-widest">Subtotal</span>
            <span className="text-[#7A6D63] font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-[#2D241E] font-black text-sm uppercase tracking-widest">Total Amount</span>
            <span className="text-3xl font-black text-[#D99A5B]">${totalPrice.toFixed(2)}</span>
          </div>

          <Link href={`/checkout?cart=${encodeURIComponent(JSON.stringify(cart))}`}>
            <button className="w-full bg-[#2D241E] text-white font-bold py-5 rounded-xl uppercase tracking-[0.2em] text-xs hover:bg-[#D99A5B] transition-all duration-500 shadow-xl active:scale-[0.98]">
              Complete My Order
            </button>
          </Link>

          <p className="text-center text-[10px] text-[#7A6D63] mt-4 uppercase tracking-widest font-bold opacity-60">
            Secure Artisan Checkout
          </p>
        </div>
      </div>
    </>
  );
}