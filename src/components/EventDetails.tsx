"use client";

const schedule = [
  { icon: "🚪", title: "Arrival", time: "6:00 - 6:30 PM", color: "from-gold/20 to-gold-light" },
  { icon: "🪄", title: "Magic Show", time: "7:00 - 8:00 PM", color: "from-crimson/10 to-crimson/5" },
  { icon: "🎬", title: "Movie Time", time: "8:00 - 9:00 PM", color: "from-navy/10 to-navy/5" },
];

const highlights = [
  {
    icon: "🎟️",
    title: "FREE Entry",
    desc: "Movie & magic show entry is completely free!",
  },
  {
    icon: "🍕",
    title: "Yummy Food",
    desc: "Pizza, pasta and other goodies on sale",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Parents Welcome",
    desc: "Stay and enjoy the evening with your kids",
  },
  {
    icon: "👕",
    title: "Cozy Pyjamas",
    desc: "Dress code: your comfiest PJs!",
  },
];

export default function EventDetails() {
  return (
    <section className="py-10 pb-14 px-5 bg-peach-light" id="details">
      <div className="max-w-2xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl text-navy font-bold mb-1">
            What&apos;s On
          </h2>
          <p className="text-navy-light/70 font-semibold text-sm">
            An evening packed with fun!
          </p>
        </div>

        {/* Timeline schedule - mobile first vertical layout */}
        <div className="relative mb-10">
          {/* Connecting line */}
          <div className="absolute left-[28px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-gold via-crimson to-navy rounded-full sm:hidden" />

          <div className="flex flex-col sm:flex-row gap-4">
            {schedule.map((item, i) => (
              <div key={item.title} className="flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-2 sm:flex-1 relative">
                {/* Circle indicator (mobile) */}
                <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl card-glow sm:w-16 sm:h-16 sm:rounded-2xl sm:text-3xl sm:mb-2">
                  {item.icon}
                </div>
                <div className="pt-1 sm:pt-0">
                  <h3 className="font-display text-navy font-bold text-base sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-navy-light font-bold text-sm text-opacity-80">
                    {item.time}
                  </p>
                </div>
                {/* Arrow between items (desktop) */}
                {i < schedule.length - 1 && (
                  <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-peach-dark text-lg z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 card-glow flex items-center gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">📍</span>
          <div>
            <h3 className="font-display text-navy font-bold text-sm sm:text-base">
              Location
            </h3>
            <p className="text-navy-light/70 text-xs sm:text-sm font-semibold">
              4 Dexter Rd, Northriding, Randburg, 2188
            </p>
          </div>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-2 gap-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-4 sm:p-5 card-glow group"
            >
              <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                {item.icon}
              </div>
              <h3 className="font-display text-navy font-bold text-sm sm:text-base mb-0.5">
                {item.title}
              </h3>
              <p className="text-navy-light/70 text-xs sm:text-sm font-semibold leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA arrow to register */}
        <div className="text-center mt-10">
          <a
            href="#register"
            className="inline-flex items-center gap-2 bg-crimson text-white font-display font-bold text-base sm:text-lg px-8 py-4 rounded-full btn-pulse hover:-translate-y-1 transition-transform active:scale-95"
          >
            Register Now — It&apos;s Free!
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
