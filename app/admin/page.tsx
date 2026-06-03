"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { addBakeryItem, updateBakeryItem, deleteBakeryItem } from "@/actions/menu"; 
import { Plus, Trash2, AlertCircle, LogOut } from "lucide-react";
import Link from "next/link";

const categories = ["bread", "pastries", "cakes", "cookies", "donuts", "cupcakes", "muffins", "tarts"];

export default function AdminMenuPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  
  const [form, setForm] = useState<{ name: string; price: string; category: string; img: File | null }>({ 
    name: "", price: "", category: "bread", img: null 
  });

  useEffect(() => {
    fetch("/api/admin-config")
      .then((res) => res.json())
      .then((data) => {
        setAdminEmail(data.adminEmail || null);
      })
      .catch((error) => {
        console.error("Error fetching admin config:", error);
        setAdminEmail(null);
      });

    if (status === "authenticated") {
      fetch("/api/bakery-raw")
        .then((res) => res.json())
        .then((data) => {
          setItems(data);
          setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    if (form.img) {
      formData.append("img", form.img);
    }

    const result = await addBakeryItem(formData);
    
    if (result.success && result.data) {
      setItems([...items, result.data]);
      setForm({ name: "", price: "", category: "bread", img: null });
      
      const fileInput = document.getElementById("image-upload-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      alert(result.error || "Something went wrong creating the item.");
    }
  };

  // Enhanced Update handler that handles both name and price fields dynamically
  const handleUpdateField = async (id: number, field: "name" | "price", newValue: string) => {
    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;

    let updatedValue: string | number = newValue;
    
    if (field === "price") {
      const priceNum = parseFloat(newValue);
      if (isNaN(priceNum)) return;
      if (targetItem.price === priceNum) return; // Prevent useless API hits
      updatedValue = priceNum;
    } else {
      if (!newValue.trim() || targetItem.name === newValue) return;
    }

    const result = await updateBakeryItem(id, { ...targetItem, [field]: updatedValue });
    
    if (result.success) {
      setItems(items.map((i) => (i.id === id ? { ...i, [field]: updatedValue } : i)));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this item from the store?")) return;
    const result = await deleteBakeryItem(id); 
    if (result.success) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  if (loading || status === "loading" || adminEmail === undefined) {
  return (
    <div className="min-h-screen bg-[#1E1B18] text-neutral-400 flex items-center justify-center font-medium tracking-widest text-xs uppercase animate-pulse">
      Loading store inventory...
    </div>
  );
}

if (!adminEmail) {
  return (
    <div className="min-h-screen bg-[#1E1B18] text-white flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-4">
        <AlertCircle size={32} className="mx-auto text-amber-500 opacity-80" />
        <h1 className="text-lg font-bold tracking-tight">Configuration Required</h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Please add <code className="bg-neutral-900 px-1.5 py-0.5 rounded text-amber-400 font-mono text-xs">NEXT_PUBLIC_ADMIN_EMAIL</code> to your environment variables.
        </p>
      </div>
    </div>
  );
}

const userEmail = (session?.user as any)?.email;

// Combined Access Guard: Not logged in OR logged in with the wrong email
if (status === "unauthenticated" || userEmail !== adminEmail) {
  const isWrongEmail = status === "authenticated" && userEmail !== adminEmail;

  return (
    <div className="min-h-screen bg-[#1E1B18] text-white flex items-center justify-center p-6">
      <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
        <AlertCircle size={36} className="mx-auto text-red-400/90 mb-3" />
        
        <h1 className="text-xl font-bold tracking-tight text-neutral-100 mb-2">
          {isWrongEmail ? "Admin Access Only" : "Authentication Required"}
        </h1>
        
        <p className="text-sm text-neutral-400 mb-6 px-2">
          {isWrongEmail ? (
            <>
              Compiled access denied for <span className="text-neutral-200 font-medium break-all">{userEmail}</span>. Please sign in with an authorized administrator account.
            </>
          ) : (
            "You must be logged in as an administrator to access the dashboard inventory management."
          )}
        </p>

        <div className="flex flex-col gap-2">
          <Link 
            href="/login" 
            className="w-full bg-[#D99A5B] text-neutral-950 font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider hover:bg-[#c4894e] transition-colors text-center"
          >
            {isWrongEmail ? "Sign in with different account" : "Login Now"}
          </Link>
          
          <Link 
            href="/" 
            className="w-full bg-neutral-850 text-neutral-400 font-medium py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider hover:text-neutral-200 transition-colors text-center"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-[#1E1B18] text-neutral-100 p-4 sm:p-8 md:p-12 lg:p-24 pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto">
        
        {/* Responsive Header Wrapper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#D99A5B] tracking-tight uppercase">Bakery Inventory Panel</h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">Manage live items, prices, and categories on your store menu.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-start sm:self-auto">
            <div className="bg-neutral-900 px-3 py-2 rounded text-xs font-mono text-neutral-400 border border-neutral-800">
              Live Items: {items.length}
            </div>
            <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-2 rounded border border-neutral-800 max-w-[180px] sm:max-w-none truncate">
              {userEmail}
            </div>
            <Link href="/signout" className="p-2 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-900 transition-colors" title="Logout">
              <LogOut size={18} />
            </Link>
          </div>
        </div>

        {/* Form and Catalog Main Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          
          {/* Create Form Column */}
          <div className="lg:col-span-1">
            <form onSubmit={handleCreate} className="bg-neutral-900 p-5 md:p-6 rounded-lg border border-neutral-800 shadow-xl lg:sticky lg:top-28">
              <h2 className="text-base md:text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <Plus size={18} className="text-[#D99A5B]" /> Add New Pastry
              </h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-2">Item Name</label>
                  <input type="text" placeholder="e.g., Chocolate Croissant" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-neutral-800 rounded border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#D99A5B]" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-2">Price ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-3 bg-neutral-800 rounded border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#D99A5B]" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 bg-neutral-800 rounded border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#D99A5B]">
                    {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-2">Pastry Image File</label>
                  <input id="image-upload-input" type="file" accept="image/*" onChange={e => setForm({...form, img: e.target.files?.[0] || null})} className="w-full p-2.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-400 text-sm focus:outline-none focus:border-[#D99A5B] file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 cursor-pointer" />
                </div>
                <button type="submit" className="w-full bg-[#D99A5B] text-neutral-900 font-black py-3 rounded uppercase text-xs tracking-widest mt-2 hover:bg-amber-500 transition-colors">
                  Add Item to Menu
                </button>
              </div>
            </form>
          </div>

          {/* Catalog Records Column */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-xl overflow-hidden">
              <div className="p-4 md:p-5 border-b border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">Current Pastry Catalog</span>
                <span className="text-[10px] text-[#D99A5B] italic">Click text blocks or pricing inputs to edit live layout</span>
              </div>

              <div className="divide-y divide-neutral-800">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-850/50 transition-colors">
                    
                    {/* Item Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-12 h-12 md:w-14 md:h-14 object-cover rounded border border-neutral-700 bg-neutral-800 shrink-0" 
                        onError={(e) => { (e.target as HTMLImageElement).src = "/img/placeholder.jpg"; }} 
                      />
                      <div className="min-w-0 w-full">
                        {/* INPUT FOR LIVE NAME EDITING */}
                        <input 
                          type="text" 
                          defaultValue={item.name} 
                          onBlur={(e) => handleUpdateField(item.id, "name", e.target.value)}
                          className="bg-transparent font-bold text-white text-sm md:text-base border-b border-transparent hover:border-neutral-700 focus:border-[#D99A5B] focus:outline-none w-full py-0.5 truncate transition-all"
                          title="Click to edit item name"
                        />
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[9px] font-mono font-bold tracking-wider uppercase bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700">
                            {item.category}
                          </span>
                          <span className="text-xs text-neutral-500">ID: #{item.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Tools & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t border-neutral-800/60 sm:border-none pt-3 sm:pt-0">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-bold text-sm">$</span>
                        {/* INPUT FOR LIVE PRICE EDITING */}
                        <input 
                          type="number" 
                          step="0.01" 
                          defaultValue={item.price} 
                          onBlur={(e) => handleUpdateField(item.id, "price", e.target.value)} 
                          className="w-20 p-2 bg-neutral-800 text-center text-white rounded font-bold text-sm border border-neutral-700 focus:border-[#D99A5B] focus:outline-none" 
                        />
                      </div>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-2 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors"
                        aria-label="Delete item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>
                ))}
                {items.length === 0 && (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    Your bakery database is completely empty.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}