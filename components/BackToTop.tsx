"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function BackToTop() {
  const btnRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isVisible = window.scrollY > 100;
      if (isVisible !== visible) {
        setVisible(isVisible);
        // Animate button visibility
        gsap.to(btnRef.current, {
          opacity: isVisible ? 1 : 0,
          display: isVisible ? "block" : "none",
          duration: 0.3
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  const scrollToTop = () => {
    gsap.to(window, { scrollTo: 0, duration: 1, ease: "power2.inOut" });
  };

  return (
    <button 
      ref={btnRef}
      onClick={scrollToTop}
      className="btn btn-lg btn-primary btn-lg-square back-to-top"
      style={{ opacity: 0, display: "none" }}
    >
      <i className="fa fa-angle-double-up"></i>
    </button>
  );
}