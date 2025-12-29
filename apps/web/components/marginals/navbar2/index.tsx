"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/config/marginals";
import { heroImages } from "@/config/hero";
import GradientUnderline from "./gradient";

// --- Sub-Component: Countdown Timer ---
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-02-07T00:00:00");
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-start gap-4 text-white font-berry">
      {/* Helper to render time blocks */}
      {[
        { val: timeLeft.days, label: "DAYS" },
        { val: ":", label: "" },
        { val: timeLeft.hours, label: "HOURS" },
        { val: ":", label: "" },
        { val: timeLeft.minutes, label: "MINUTES" },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <span className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none">
            {typeof item.val === "number" ? item.val.toString().padStart(2, "0") : item.val}
          </span>
          {item.label && (
            <span className="text-[10px] md:text-xs font-bold mt-1 tracking-wider">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Sub-Component: Music Visualizer ---
function MusicVisualizer() {
  return (
    <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
      <Image
        fill
        alt="Music Visualizer Background"
        className="object-contain"
        src={heroImages.ellipse}
      />
      <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`visualizer-bar bar-${i} w-[3px] bg-white/80`} />
        ))}
      </div>
    </div>
  );
}

// --- Main Header Component ---
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseMenu = () => setIsClosing(true);

  const toggleMenu = () => {
    if (isMenuOpen) handleCloseMenu();
    else setIsMenuOpen(true);
  };

  return (
    // 1. STICKY WRAPPER
    <header className="fixed top-0 z-50 w-full px-6 py-4 transition-all duration-300">
      {/* Container for Desktop Layout */}
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        {/* LEFT: Desktop Nav / Mobile Menu Button */}
        <div className="flex items-center">
          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white relative w-8 h-8 focus:outline-none z-50"
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isMenuOpen && !isClosing
                  ? "opacity-0 rotate-90 scale-50"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            >
              <Menu size={32} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isMenuOpen && !isClosing
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-50"
              }`}
            >
              <X size={32} />
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex gap-8 lg:gap-12 text-white font-inria">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative group text-base lg:text-lg xl:text-xl tracking-wide"
              >
                {item.label}
                <div className="absolute left-0 -bottom-2 h-[3px] w-0 transition-all duration-300 group-hover:w-full overflow-hidden">
                  <GradientUnderline className="w-full h-full" />
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* CENTER/RIGHT: Timer & Visualizer Group */}
        <div className="flex items-center gap-6 md:gap-12">
          {/* Timer - Hidden on very small screens if needed, or styled smaller */}
          <div className="hidden md:block">
            <CountdownTimer />
          </div>

          <div className="hidden md:block">
            <MusicVisualizer />
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center md:hidden"
          style={{
            animation: isClosing
              ? "slideFadeOut 0.3s ease-in forwards"
              : "slideFadeIn 0.3s ease-out forwards",
          }}
          onAnimationEnd={() => {
            if (isClosing) {
              setIsMenuOpen(false);
              setIsClosing(false);
            }
          }}
        >
          <nav className="flex flex-col gap-8 text-white text-2xl text-center font-inria">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="cursor-pointer relative group"
                onClick={handleCloseMenu}
              >
                {item.label}
                <div className="absolute left-0 -bottom-2 h-[3px] w-0 transition-all duration-300 group-hover:w-full overflow-hidden">
                  <GradientUnderline className="w-full h-full" />
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
