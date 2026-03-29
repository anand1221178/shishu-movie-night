"use client";

import { useEffect, useRef, useState } from "react";
import { RegistrationData, getAge, formatDob } from "./RegistrationForm";

interface Props {
  data: RegistrationData;
}

function Confetti() {
  const [pieces, setPieces] = useState<
    { id: number; left: number; color: string; delay: number; duration: number; size: number; rotation: number; shape: string }[]
  >([]);

  useEffect(() => {
    const colors = ["#C0392B", "#F39C12", "#1B2A4A", "#E74C3C", "#F5DEB3", "#2D4470"];
    setPieces(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
        shape: Math.random() > 0.5 ? "circle" : "square",
      }))
    );
  }, []);

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
  const [downloading, setDownloading] = useState(false);
  const ticketRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF("landscape", "mm", "a5");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < ticketRefs.current.length; i++) {
        const el = ticketRefs.current[i];
        if (!el) continue;

        if (i > 0) pdf.addPage();

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#FFFFFF",
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Fit to page with padding
        const padding = 8;
        const availW = pageWidth - padding * 2;
        const availH = pageHeight - padding * 2;
        const ratio = Math.min(availW / imgWidth, availH / imgHeight);
        const w = imgWidth * ratio;
        const h = imgHeight * ratio;
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;

        pdf.addImage(imgData, "PNG", x, y, w, h);
      }

      const firstName = data.children[0]?.name.split(" ")[0] || "Family";
      pdf.save(`Shishu-Movie-Night-Tickets-${firstName}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF download failed. Please try again or use a screenshot.");
    }
    setDownloading(false);
  };

  // Primary contact for ticket display
  const contactName = data.mumName || data.dadName;
  const contactPhone = data.mumPhone || data.dadPhone;

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
            Download your tickets as a PDF and bring them along on the big night!
          </p>
        </div>

        {/* Tickets */}
        <div className="space-y-8">
          {data.children.map((child, index) => {
            const isBoy = child.gender === "Boy";
            const bandGradient = isBoy
              ? "bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800"
              : "bg-gradient-to-r from-pink-700 via-pink-500 to-pink-700";
            const accentColor = isBoy ? "text-blue-300" : "text-pink-300";
            const pillBg = isBoy ? "bg-blue-50" : "bg-pink-50";
            const borderColor = isBoy
              ? "border-blue-200"
              : "border-pink-200";
            const ticketBg = isBoy ? "bg-blue-50/30" : "bg-pink-50/30";

            return (
            <div
              key={index}
              ref={(el) => { ticketRefs.current[index] = el; }}
              className={`ticket-card ticket-golden`}
            >
              <div className={`rounded-2xl overflow-hidden ${ticketBg}`} style={{ backgroundColor: isBoy ? "#f0f7ff" : "#fff0f5" }}>
                {/* Ticket top band */}
                <div className={`${bandGradient} px-6 py-4 flex items-center justify-between`}>
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
                <div className={`relative h-6 ${isBoy ? "bg-blue-50/80" : "bg-pink-50/80"}`}>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-peach-light" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-peach-light" />
                  <div className={`absolute inset-x-4 top-1/2 border-t-2 border-dashed ${borderColor}`} />
                </div>

                {/* Ticket body */}
                <div className="px-6 pb-6 pt-2">
                  {/* Main info */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
                    <div>
                      <div className={`text-[0.6rem] font-extrabold tracking-[2px] uppercase mb-1 ${accentColor.replace("text-blue-300", "text-blue-500").replace("text-pink-300", "text-pink-500")}`}>
                        Child&apos;s Name
                      </div>
                      <div className="font-display text-navy font-bold text-base sm:text-lg">
                        {child.name}
                      </div>
                    </div>
                    <div>
                      <div className={`text-[0.6rem] font-extrabold tracking-[2px] uppercase mb-1 ${isBoy ? "text-blue-500" : "text-pink-500"}`}>
                        Date of Birth
                      </div>
                      <div className="font-display text-navy font-bold text-base sm:text-lg">
                        {child.dob ? formatDob(child.dob) : "—"}
                      </div>
                      <div className="text-navy/50 text-xs font-bold">
                        {child.dob ? `${getAge(child.dob)} years old` : ""}
                      </div>
                    </div>
                    <div>
                      <div className={`text-[0.6rem] font-extrabold tracking-[2px] uppercase mb-1 ${isBoy ? "text-blue-500" : "text-pink-500"}`}>
                        Guardian
                      </div>
                      <div className="font-bold text-navy text-sm">
                        {contactName}
                      </div>
                    </div>
                    <div>
                      <div className={`text-[0.6rem] font-extrabold tracking-[2px] uppercase mb-1 ${isBoy ? "text-blue-500" : "text-pink-500"}`}>
                        Contact
                      </div>
                      <div className="font-bold text-navy text-sm">
                        {contactPhone}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className={`flex items-center gap-2 ${pillBg} px-4 py-2.5 rounded-xl mb-4 ${borderColor} border`}>
                    <span className="text-base">📍</span>
                    <span className="text-xs font-bold text-navy/70">
                      4 Dexter Rd, Northriding, Randburg, 2188
                    </span>
                  </div>

                  {/* Schedule strip */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {[
                      { icon: "🚪", text: "Arrival 6PM" },
                      { icon: "🪄", text: "Magic 7PM" },
                      { icon: "🎬", text: "Movie 8PM" },
                      { icon: "👕", text: "Cozy PJs!" },
                    ].map((item) => (
                      <span
                        key={item.text}
                        className={`inline-flex items-center gap-1.5 ${pillBg} px-3 py-1.5 rounded-full text-xs font-bold text-navy/70`}
                      >
                        {item.icon} {item.text}
                      </span>
                    ))}
                  </div>

                  {/* Bottom bar */}
                  <div className={`flex items-center justify-between pt-4 border-t-2 border-dashed ${borderColor}`}>
                    <div>
                      <div className="text-[0.6rem] font-extrabold text-navy/30 tracking-[2px] uppercase">
                        Ticket ID
                      </div>
                      <div className="font-mono text-navy/50 text-xs font-bold tracking-wider">
                        {data.registrationId}-{index + 1}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-display font-bold text-sm tracking-wide ${isBoy ? "text-blue-600" : "text-pink-600"}`}>
                        ADMIT ONE
                      </span>
                      <span className="text-2xl">🍿</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );})}
        </div>

        {/* Action buttons */}
        <div className="no-print mt-10 space-y-3">
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="w-full py-4 bg-navy text-white rounded-2xl font-display font-bold text-base sm:text-lg hover:-translate-y-1 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ boxShadow: "0 6px 25px rgba(27,42,74,0.3)" }}
          >
            {downloading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating PDF...
              </span>
            ) : (
              "📥 Download Tickets as PDF"
            )}
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
