"use client";

import { useEffect, useState } from "react";
import { RegistrationData } from "./RegistrationForm";

interface Props {
  data: RegistrationData;
}

function Confetti() {
  const colors = ["#C0392B", "#F39C12", "#1B2A4A", "#E74C3C", "#F5DEB3", "#2D4470"];
  const pieces = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    shape: Math.random() > 0.5 ? "circle" : "square",
  }));

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </>
  );
}

export default function TicketSection({ data }: Props) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen py-12 px-5 bg-peach-light" id="ticketSection">
      {showConfetti && <Confetti />}

      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <div className="no-print text-center mb-10 animate-bounce-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-navy font-bold mb-2">
            You&apos;re All Set!
          </h2>
          <p className="text-navy-light/70 font-semibold text-sm max-w-sm mx-auto">
            Here are your tickets. Print them out or screenshot them for the big night!
          </p>
        </div>

        {/* Tickets */}
        <div className="space-y-8">
          {data.children.map((child, index) => (
            <div
              key={index}
              className="ticket-card ticket-golden animate-fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.2}s`, opacity: 0 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* Ticket top band */}
                <div className="bg-gradient-to-r from-navy via-navy-light to-navy px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-white font-bold text-lg sm:text-xl leading-tight">
                      Shishu Movie Night
                    </div>
                    <div className="text-gold text-xs font-bold tracking-[2px] uppercase">
                      BAPS Hindu Mandir
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-gold text-2xl sm:text-3xl font-bold leading-none">
                      10
                    </div>
                    <div className="font-display text-white/80 text-xs font-bold tracking-wider">
                      APR
                    </div>
                  </div>
                </div>

                {/* Perforated line */}
                <div className="relative h-6 bg-peach-light/50">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-peach-light" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-peach-light" />
                  <div className="absolute inset-x-4 top-1/2 border-t-2 border-dashed border-peach-dark" />
                </div>

                {/* Ticket body */}
                <div className="px-6 pb-6 pt-2">
                  {/* Main info */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
                    <div>
                      <div className="text-[0.6rem] font-extrabold text-crimson/70 tracking-[2px] uppercase mb-1">
                        Child&apos;s Name
                      </div>
                      <div className="font-display text-navy font-bold text-base sm:text-lg">
                        {child.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-extrabold text-crimson/70 tracking-[2px] uppercase mb-1">
                        Age
                      </div>
                      <div className="font-display text-navy font-bold text-base sm:text-lg">
                        {child.age} years old
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-extrabold text-crimson/70 tracking-[2px] uppercase mb-1">
                        Guardian
                      </div>
                      <div className="font-bold text-navy text-sm">
                        {data.parentName}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-extrabold text-crimson/70 tracking-[2px] uppercase mb-1">
                        Contact
                      </div>
                      <div className="font-bold text-navy text-sm">
                        {data.parentPhone}
                      </div>
                    </div>
                  </div>

                  {/* Schedule strip */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {[
                      { icon: "🚪", text: "Arrival 6PM" },
                      { icon: "🪄", text: "Magic 7PM" },
                      { icon: "🎬", text: "Movie 8PM" },
                    ].map((item) => (
                      <span
                        key={item.text}
                        className="inline-flex items-center gap-1.5 bg-peach-light px-3 py-1.5 rounded-full text-xs font-bold text-navy/70"
                      >
                        {item.icon} {item.text}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1.5 bg-peach-light px-3 py-1.5 rounded-full text-xs font-bold text-navy/70">
                      👕 Cozy PJs!
                    </span>
                  </div>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-peach-dark">
                    <div>
                      <div className="text-[0.6rem] font-extrabold text-navy/30 tracking-[2px] uppercase">
                        Ticket ID
                      </div>
                      <div className="font-mono text-navy/50 text-xs font-bold tracking-wider">
                        {data.registrationId}-{index + 1}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-crimson font-bold text-sm tracking-wide">
                        ADMIT ONE
                      </span>
                      <span className="text-2xl">🍿</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="no-print mt-10 space-y-3">
          <button
            onClick={() => window.print()}
            className="w-full py-4 bg-navy text-white rounded-2xl font-display font-bold text-base sm:text-lg hover:-translate-y-1 transition-all active:scale-[0.98] cursor-pointer"
            style={{ boxShadow: "0 6px 25px rgba(27,42,74,0.3)" }}
          >
            🖨️ Print Tickets
          </button>
          <button
            onClick={() => location.reload()}
            className="w-full py-4 bg-white text-navy border-2 border-navy/20 rounded-2xl font-display font-bold text-base hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer hover:border-navy/40"
          >
            Register Another Family
          </button>
        </div>
      </div>
    </section>
  );
}
