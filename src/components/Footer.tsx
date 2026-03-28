"use client";

export default function Footer() {
  return (
    <footer className="no-print bg-navy py-8 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-2xl mb-3">🙏</div>
        <p className="text-peach/80 font-semibold text-sm mb-1">
          BAPS Swaminarayan Sanstha
        </p>
        <a
          href="https://www.baps.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold font-bold text-sm hover:underline"
        >
          www.BAPS.org
        </a>
      </div>
    </footer>
  );
}
