// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ChevronLeft, Trash2, CreditCard, ShoppingBag } from "lucide-react";
// import OverlayTop from "../../components/overlaytop";
// import OverlayBottom from "../../components/overlaybottom";

// // Mock data - In a real app, this comes from your Cart State/Context
// const initialCart = [
//   { id: 1, name: "Black Coffee", price: 5, qty: 2, img: "/img/menu-1.jpg" },
//   { id: 2, name: "Chocolete Coffee", price: 7, qty: 1, img: "/img/menu-2.jpg" },
// ];

// export default function Page() {
//   const [cart, setCart] = useState(initialCart);

//   const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
//   const tax = subtotal * 0.1; // 10% tax
//   const total = subtotal + tax;

//   const removeItem = (id: number) => {
//     setCart(cart.filter((item) => item.id !== id));
//   };

//   return (
//     <section className="relative min-h-screen bg-[#FFF8ED] py-24 px-4 md:px-10 overflow-hidden">
//       <OverlayTop />
//       <OverlayBottom />

//       <div className="max-w-6xl mx-auto relative z-10">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-12">
//           <Link href="/" className="flex items-center gap-2 text-[#2D241E] font-bold uppercase text-xs tracking-widest hover:text-[#D99A5B] transition-colors">
//             <ChevronLeft size={16} />
//             Back to Menu
//           </Link>
//           <h1 className="text-3xl md:text-5xl font-black text-[#2D241E] uppercase tracking-tighter">
//             Your Order
//           </h1>
//           <div className="w-20 hidden md:block"></div> {/* Spacer for symmetry */}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//           {/* 1. Item List */}
//           <div className="lg:col-span-2 space-y-6">
//             {cart.length > 0 ? (
//               cart.map((item) => (
//                 <div key={item.id} className="flex items-center gap-6 bg-white p-4 shadow-sm border border-gray-100">
//                   <div className="relative w-20 h-20 flex-shrink-0">
//                     <Image src={item.img} alt={item.name} fill className="object-cover" />
//                   </div>
//                   <div className="flex-grow">
//                     <h4 className="font-bold text-[#2D241E] uppercase text-lg">{item.name}</h4>
//                     <p className="text-[#7A6D63] text-sm">Quantity: {item.qty}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-black text-[#2D241E] text-xl">${item.price * item.qty}</p>
//                     <button 
//                       onClick={() => removeItem(item.id)}
//                       className="text-red-400 hover:text-red-600 mt-2 transition-colors"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-20 bg-white border border-dashed border-gray-300">
//                 <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
//                 <p className="text-[#7A6D63]">Your tray is empty.</p>
//               </div>
//             )}
//           </div>

//           {/* 2. Order Summary & Payment */}
//           <div className="space-y-8">
//             <div className="bg-[#2D241E] p-8 text-white shadow-2xl">
//               <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
//                 Summary
//               </h3>
//               <div className="space-y-4 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Subtotal</span>
//                   <span className="font-bold">${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Sales Tax (10%)</span>
//                   <span className="font-bold">${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-xl border-t border-white/10 pt-4 mt-4">
//                   <span className="font-black uppercase">Total</span>
//                   <span className="font-black text-[#D99A5B]">${total.toFixed(2)}</span>
//                 </div>
//               </div>

//               {/* Payment Method Selection */}
//               <div className="mt-10 space-y-4">
//                 <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Payment Method</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button className="border border-[#D99A5B] p-3 flex flex-col items-center gap-2 bg-[#D99A5B]/10">
//                     <CreditCard size={20} className="text-[#D99A5B]" />
//                     <span className="text-[10px] font-bold uppercase">Card</span>
//                   </button>
//                   <button className="border border-white/10 p-3 flex flex-col items-center gap-2 hover:border-[#D99A5B] transition-colors">
//                     <Image src="/img/paypal-icon.png" alt="Paypal" width={20} height={20} className="grayscale brightness-200" />
//                     <span className="text-[10px] font-bold uppercase">PayPal</span>
//                   </button>
//                 </div>
//               </div>

//               <button 
//                 disabled={cart.length === 0}
//                 className="w-full bg-[#D99A5B] hover:bg-white text-[#2D241E] font-black py-4 mt-8 uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Place Order
//               </button>
//             </div>

//             {/* Note */}
//             <div className="text-center">
//               <p className="text-[#7A6D63] text-xs leading-relaxed italic">
//                 By placing your order, you agree to our terms of service. Fresh beans take time; we appreciate your patience!
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }