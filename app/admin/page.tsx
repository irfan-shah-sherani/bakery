"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { addBakeryItem, updateBakeryItem, deleteBakeryItem } from "@/actions/menu"; 
import { Plus, Trash2, Layers, AlertCircle, LogOut } from "lucide-react";
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
    // Get admin email from API
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

  const handleUpdatePrice = async (id: number, newPrice: string) => {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum)) return;

    const targetItem = items.find((i) => i.id === id);
    const result = await updateBakeryItem(id, { ...targetItem, price: priceNum });
    
    if (result.success) {
      setItems(items.map((i) => (i.id === id ? { ...i, price: priceNum } : i)));
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
      <div className="min-h-screen bg-[#1E1B18] text-white flex items-center justify-center font-bold tracking-widest">
        LOADING STORE INVENTORY...
      </div>
    );
  }

  // Check if user is not logged in
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#1E1B18] text-white flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-red-500/30 rounded-lg p-10 max-w-md text-center shadow-xl">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Access Denied</h1>
          <p className="text-neutral-400 mb-6">You must be logged in to access the admin panel.</p>
          <Link href="/login" className="inline-block bg-[#D99A5B] text-neutral-900 font-black py-3 px-8 rounded uppercase text-xs tracking-widest hover:bg-amber-500 transition-colors">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  // Check if admin email is configured
  if (!adminEmail) {
    return (
      <div className="min-h-screen bg-[#1E1B18] text-white flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-lg p-10 max-w-md text-center shadow-xl">
          <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
          <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Admin Not Configured</h1>
          <p className="text-neutral-400 mb-6">The admin email has not been set up yet. Please add <code className="bg-neutral-800 px-2 py-1 rounded text-[#D99A5B]">NEXT_PUBLIC_ADMIN_EMAIL</code> to your .env file.</p>
          <div className="bg-neutral-800 rounded p-4 text-left text-sm mb-6 border border-neutral-700">
            <p className="text-neutral-300 mb-2">Example .env setup:</p>
            <code className="text-[#D99A5B] font-mono text-xs">NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com</code>
          </div>
          <Link href="/" className="inline-block bg-neutral-700 text-white font-bold py-2 px-6 rounded uppercase text-xs tracking-widest hover:bg-neutral-600 transition-colors">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  // Check if user's email matches admin email
  const userEmail = (session?.user as any)?.email;
  if (userEmail !== adminEmail) {
    return (
      <div className="min-h-screen bg-[#1E1B18] text-white flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-red-500/30 rounded-lg p-10 max-w-md text-center shadow-xl">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Unauthorized</h1>
          <p className="text-neutral-400 mb-2">Your email: <span className="text-yellow-400 font-bold">{userEmail}</span></p>
          <p className="text-neutral-400 mb-6">You are not authorized to access the admin panel.</p>
          <Link href="/" className="inline-block bg-neutral-700 text-white font-bold py-2 px-6 rounded uppercase text-xs tracking-widest hover:bg-neutral-600 transition-colors">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1B18] text-neutral-100 p-6 md:p-24 pt-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#D99A5B] tracking-tight uppercase">Bakery Inventory Panel</h1>
            <p className="text-sm text-neutral-400 mt-1">Manage live items, prices, and categories on your store menu.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-neutral-800 px-4 py-2 rounded text-xs font-mono text-neutral-400 border border-neutral-750">
              Live Items: {items.length}
            </div>
            <div className="text-xs text-neutral-500 bg-neutral-800 px-3 py-2 rounded border border-neutral-700">
              {userEmail}
            </div>
            <Link href="/signout" className="p-2 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors" title="Logout">
              <LogOut size={18} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <form onSubmit={handleCreate} className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-xl sticky top-28">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
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
                  <input id="image-upload-input" type="file" accept="image/*" onChange={e => setForm({...form, img: e.target.files?.[0] || null})} className="w-full p-3 bg-neutral-800 rounded border border-neutral-700 text-neutral-400 text-sm focus:outline-none focus:border-[#D99A5B] file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 cursor-pointer" />
                </div>
                <button type="submit" className="w-full bg-[#D99A5B] text-neutral-900 font-black py-3 rounded uppercase text-xs tracking-widest mt-2 hover:bg-amber-500 transition-colors">
                  Add Item to Menu
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">Current Pastry Catalog</span>
                <span className="text-[10px] text-[#D99A5B] italic">Click price input box & step away to update instantly</span>
              </div>

              <div className="divide-y divide-neutral-800">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-850 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded border border-neutral-700 bg-neutral-800" onError={(e) => { (e.target as HTMLImageElement).src = "/img/placeholder.jpg"; }} />
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded flex items-center gap-1 border border-neutral-700">{item.category}</span>
                          <span className="text-xs text-neutral-500">ID: #{item.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-bold text-sm">$</span>
                        <input type="number" step="0.01" defaultValue={item.price} onBlur={(e) => handleUpdatePrice(item.id, e.target.value)} className="w-20 p-2 bg-neutral-800 text-center text-white rounded font-bold text-sm border border-neutral-700 focus:border-[#D99A5B] focus:outline-none" />
                      </div>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-800"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="p-12 text-center text-neutral-500 text-sm">Your bakery database is completely empty.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}