import React from "react";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import OverlayTop from "./overlaytop";

export default function Footer() {
  return (
    <footer className="relative w-full pt-32 pb-10 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute h-[102vh] inset-0 z-0">
        <Image
          src="/img/bg-2.jpg" 
          alt="Coffee Beans Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>
    <div className=" absolute bg-[#d2691e] opacity-14   z-2 inset-0" />
      {/* Torn Paper Top Edge */}
      <OverlayTop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-white mb-20">
          
          {/* Get In Touch */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold uppercase tracking-widest">Get In Touch</h4>
            <div className="space-y-4 text-gray-300">
              <p className="flex items-start gap-3">
                <MapPin className="text-[#D99A5B] shrink-0" size={20} />
                123 Street, New York, USA
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-[#D99A5B] shrink-0" size={20} />
                +012 345 67890
              </p>
              <p className="flex items-center gap-3">
                <Mail className="text-[#D99A5B] shrink-0" size={20} />
                info@example.com
              </p>
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold uppercase tracking-widest">Follow Us</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Amet elitr vero magna sed ipsum sit kasd sea elitr lorem rebum
            </p>
            <div className="flex gap-2">
              {[FaTwitter, FaFacebook, FaLinkedin, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-white flex items-center justify-center hover:bg-[#D99A5B] hover:border-[#D99A5B] transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Open Hours */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold uppercase tracking-widest">Open Hours</h4>
            <div className="space-y-4 text-gray-300 text-sm">
              <div>
                <p className="uppercase font-bold text-white mb-1">Monday - Friday</p>
                <p>8.00 AM - 8.00 PM</p>
              </div>
              <div>
                <p className="uppercase font-bold text-white mb-1">Saturday - Sunday</p>
                <p>2.00 PM - 8.00 PM</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold uppercase tracking-widest">Newsletter</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Amet elitr vero magna sed ipsum sit kasd sea elitr lorem rebum
            </p>
            {/* <div className="flex bg-white p-1">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full px-3 py-2 text-gray-800 outline-none"
              />
              <button className="bg-[#D99A5B] text-[#2D241E] font-bold px-4 py-2 hover:bg-[#c4854a] transition-colors whitespace-nowrap">
                Sign Up
              </button>
            </div> */}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 pt-10 text-center text-sm text-gray-400">
          <p>
            Copyright © <span className="text-[#D99A5B]">Your Site Name</span>. All Rights Reserved.
          </p>
          <p className="mt-2">
            Designed by <span className="text-[#D99A5B]">HTML Codex</span>
          </p>
        </div>
      </div>
      
      {/* Back to Top Arrow */}
      <button className="absolute bottom-10 right-10 w-10 h-10 bg-[#D99A5B] flex items-center justify-center text-[#2D241E] hover:bg-white transition-all shadow-lg">
        <span className="text-xl font-bold">^</span>
      </button>
    </footer>
  );
}