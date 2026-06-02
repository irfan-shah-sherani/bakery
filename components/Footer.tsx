import React from "react";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import OverlayTop from "./overlaytop";

export default function Footer() {
  return (
    <footer className="relative w-full pt-20 md:pt-32 pb-10 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/bg-2.jpg" 
          alt="Coffee Beans Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>
      <div className="absolute bg-[#d2691e] opacity-10 z-[2] inset-0" />
      
      {/* Torn Paper Top Edge */}
      <OverlayTop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        {/* Main Grid Content (Now adjusted to 3 columns on desktop since newsletter is gone) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 text-white mb-16 md:mb-20">
          
          {/* Get In Touch */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#D99A5B]">Get In Touch</h4>
            <div className="space-y-3 text-gray-300 text-sm md:text-base">
              <p className="flex items-start gap-3">
                <MapPin className="text-[#D99A5B] shrink-0 mt-0.5" size={18} />
                123 Street, New York, USA
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-[#D99A5B] shrink-0" size={18} />
                +012 345 67890
              </p>
              <p className="flex items-center gap-3">
                <Mail className="text-[#D99A5B] shrink-0" size={18} />
                info@example.com
              </p>
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#D99A5B]">Follow Us</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Amet elitr vero magna sed ipsum sit kasd sea elitr lorem rebum
            </p>
            <div className="flex flex-wrap gap-2">
              {[FaTwitter, FaFacebook, FaLinkedin, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-white/50 flex items-center justify-center hover:bg-[#D99A5B] hover:border-[#D99A5B] transition-all rounded-sm">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Open Hours */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#D99A5B]">Open Hours</h4>
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

        </div> {/* <-- Properly closing the grid here */}

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-xs md:text-sm text-gray-400">
          <p>
            Copyright © <span className="text-[#D99A5B]">Your Site Name</span>. All Rights Reserved.
          </p>
          <p className="mt-1">
            Designed by <span className="text-[#D99A5B]">HTML Codex</span>
          </p>
        </div>
      </div> {/* <-- Properly closing the max-w-7xl wrapper here */}
      
      {/* Back to Top Arrow */}
      <button className="absolute bottom-5 right-5 md:bottom-10 md:right-10 w-9 h-9 md:w-10 md:h-10 bg-[#D99A5B] flex items-center justify-center text-[#2D241E] hover:bg-white transition-all shadow-lg rounded-sm">
        <span className="text-lg md:text-xl font-bold">^</span>
      </button>
    </footer>
  );
}