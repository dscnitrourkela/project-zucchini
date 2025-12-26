import React, { JSX } from "react";

// Paths to assets in the public folder
const background = "/sponsors/background.jpg";
const logo = ""; // Add logo path here if available

export default function SponsorsPage(): JSX.Element {
  const navItems = [
    { label: "Home", active: false },
    { label: "About", active: false },
    { label: "Events", active: false },
    { label: "FAQs", active: false },
    { label: "Sponsors", active: true },
  ];

  const countdownData = [
    { value: "35", label: "DAYS" },
    { value: "02", label: "HOURS" },
    { value: "12", label: "MINUTES" },
  ];

  const platinumSponsors = [
    { id: 1, row: 1, col: 1, hasBorder: true },
    { id: 2, row: 1, col: 2, hasBorder: true },
    { id: 3, row: 1, col: 3, hasBorder: true },
    { id: 4, row: 2, col: 1, hasBorder: true },
    { id: 5, row: 2, col: 2, hasBorder: false },
    { id: 6, row: 2, col: 3, hasBorder: true },
  ];

  return (
    <div className="bg-[#010005] overflow-hidden w-full min-h-screen relative text-white font-sans">
      {/* Background with Masks */}
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        alt="Carnival Background"
        src={background}
      />

      {/* Dark Overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* Header / Navbar */}
      <header className="flex w-full items-center justify-between absolute top-0 left-0 px-20 py-10 z-50">
        <nav className="flex items-center gap-10" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={`#${item.label.toLowerCase()}`}
              className={`text-xl transition-all hover:text-white ${
                item.active ? "font-bold text-white border-b-2 border-white pb-1" : "text-white/50"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-12">
          {/* Countdown timer */}
          <div className="flex items-center gap-6 text-center" role="timer">
            {countdownData.map((item, index) => (
              <React.Fragment key={item.label}>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold tracking-wider">{item.value}</span>
                  <span className="text-xs font-light tracking-widest opacity-70 uppercase mt-1">
                    {item.label}
                  </span>
                </div>
                {index < countdownData.length - 1 && (
                  <span className="text-2xl font-light opacity-50 self-start mt-1">:</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Audio Visualizer Icon Placeholder */}
          <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex gap-1 items-end h-4">
              <div className="w-0.5 h-3 bg-white animate-pulse" />
              <div
                className="w-0.5 h-4 bg-white animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-0.5 h-2 bg-white animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
              <div
                className="w-0.5 h-4 bg-white animate-pulse"
                style={{ animationDelay: "0.1s" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-40 pb-20">
        {/* Title Sponsors */}
        <section className="flex flex-col items-center gap-8 mb-32">
          <h2 className="text-xl font-bold tracking-[0.3em] uppercase opacity-80">
            TITLE SPONSORS
          </h2>

          <div className="flex items-center gap-8">
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-white/40 to-white/60" />
            <div className="w-64 h-24 bg-white/5 backdrop-blur-md border border-white/20 relative group overflow-hidden">
              {/* Animated Gradient Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-40 blur-sm pointer-events-none" />
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                <span className="text-white/20 text-xs italic">Logo Placeholder</span>
              </div>
            </div>
            <div className="h-px w-40 bg-gradient-to-l from-transparent via-white/40 to-white/60" />
          </div>
        </section>

        {/* Platinum Sponsors */}
        <section className="flex flex-col items-center gap-12">
          <h2 className="text-xl font-bold tracking-[0.3em] uppercase opacity-80">
            PLATINUM SPONSORS
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {platinumSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className={`w-52 h-20 bg-white/5 backdrop-blur-sm border transition-all hover:scale-105 hover:bg-white/10 flex items-center justify-center ${
                  sponsor.hasBorder
                    ? "border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    : "border-transparent opacity-40"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <span className="text-white/10 text-[10px] uppercase tracking-widest italic">
                  Logo
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Audio Icon / Additional decoration */}
      <div className="fixed bottom-10 right-10 z-50">
        {/* You can add more social icons or decorations here */}
      </div>
    </div>
  );
}
