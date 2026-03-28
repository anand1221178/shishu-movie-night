"use client";

import { useEffect, useState } from "react";

function Stars() {
  const [stars, setStars] = useState<
    { left: number; top: number; delay: number; duration: number; size: number }[]
  >([]);

  useEffect(() => {
    // Generate stars only on the client to avoid hydration mismatch
    setStars(
      Array.from({ length: 20 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        size: 2 + Math.random() * 3,
      }))
    );
  }, []);

  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        />
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy min-h-[85vh] flex items-center justify-center px-6 py-20 text-center overflow-hidden">
      {/* Starfield background dots - deterministic positions to avoid hydration mismatch */}
      <Stars />

      {/* Large floating emojis */}
      <span className="absolute top-[12%] left-[5%] text-4xl sm:text-5xl animate-float opacity-50">
        🍿
      </span>
      <span
        className="absolute top-[8%] right-[6%] text-3xl sm:text-4xl animate-float-slow opacity-40"
        style={{ animationDelay: "1s" }}
      >
        ⭐
      </span>
      <span
        className="absolute bottom-[22%] right-[5%] text-4xl sm:text-5xl animate-float opacity-50"
        style={{ animationDelay: "2.5s" }}
      >
        🎬
      </span>
      <span
        className="absolute bottom-[15%] left-[8%] text-3xl sm:text-4xl animate-float-slow opacity-40"
        style={{ animationDelay: "3.5s" }}
      >
        🎥
      </span>
      <span
        className="absolute top-[45%] right-[15%] text-2xl sm:text-3xl animate-float opacity-30"
        style={{ animationDelay: "4s" }}
      >
        🌟
      </span>

      {/* Main content */}
      <div className="relative z-10 max-w-lg mx-auto">
        <p className="text-peach/90 text-sm sm:text-base font-semibold tracking-[3px] uppercase mb-4 animate-fade-in-up">
          BAPS Hindu Mandir invites you to
        </p>

        <h1
          className="font-display text-white text-[3.2rem] sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-3 animate-fade-in-up"
          style={{ animationDelay: "0.15s", textShadow: "4px 4px 0 rgba(0,0,0,0.25)" }}
        >
          Shishu
        </h1>
        <h1
          className="font-display text-crimson-light text-[2.8rem] sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.3s", textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}
        >
          Movie Night
        </h1>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <span
            className="inline-block bg-crimson text-white px-8 py-3.5 rounded-full text-lg sm:text-xl font-display font-bold tracking-wide"
            style={{ boxShadow: "0 6px 25px rgba(192,57,43,0.5)" }}
          >
            Friday 10 April
          </span>
        </div>

        {/* Scroll hint */}
        <div
          className="mt-12 animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          <a
            href="#details"
            className="inline-flex flex-col items-center gap-1 text-peach/60 hover:text-peach transition-colors"
          >
            <span className="text-xs font-semibold tracking-widest uppercase">
              See Details
            </span>
            <svg
              className="w-5 h-5 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Curved bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-16 sm:h-20" preserveAspectRatio="none">
          <path
            fill="var(--color-peach-light)"
            d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
