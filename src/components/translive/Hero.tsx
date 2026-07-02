import { useEffect, useState } from "react";
import { Orb } from "./Orb";

const HELLOS = [
  { text: "Every language. One voice. Yours.", lang: "en" },
  { text: "हर भाषा। एक आवाज़। आपकी।", lang: "hi" },
  { text: "ప్రతి భాష. ఒక స్వరం. మీది.", lang: "te" },
  { text: "모든 언어. 하나의 목소리. 당신의.", lang: "ko" },
  { text: "すべての言語。ひとつの声。あなたの。", lang: "ja" },
  { text: "Todos los idiomas. Una voz. La tuya.", lang: "es" },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HELLOS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Backdrop gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,168,83,0.08), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,168,83,0.05), transparent 70%)",
        }}
      />

      {/* Corner labels */}
      <div className="absolute top-24 left-6 md:left-10 font-mono text-[10px] tracking-[0.2em] text-stone uppercase">
        <div>Translive / v2.4</div>
        <div className="mt-1">42 languages · 0.4s latency</div>
      </div>
      <div className="absolute top-24 right-6 md:right-10 font-mono text-[10px] tracking-[0.2em] text-stone uppercase text-right">
        <div>Est. 2024 · Bengaluru</div>
        <div className="mt-1">Champagne edition</div>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-10 grid place-items-center">
        {/* Orb centered behind text */}
        <div data-orb-parallax className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ willChange: "transform" }}>
          <div className="hidden md:block">
            <Orb size={640} intensity={3} />
          </div>
          <div className="md:hidden">
            <Orb size={320} intensity={2} />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-glass px-3 py-1.5 text-xs font-mono tracking-widest uppercase text-bone/70 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            AI Video & Audio Translation
          </div>

          <h1 className="mt-8 font-display text-[clamp(2.5rem,7vw,5.75rem)] leading-[0.95] tracking-[-0.04em]">
            <span className="block text-bone/95" key={HELLOS[i].lang} lang={HELLOS[i].lang} style={{ animation: "fade-in 0.6s ease-out" }}>
              {HELLOS[i].text}
            </span>
          </h1>

          <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-bone/60 leading-relaxed">
            Translate any video into 42 languages with lip-synced voices that sound
            like <em className="not-italic text-gold">you</em>. No dubbing studios. No subtitles. No excuses.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#cta"
              data-cursor="START"
              className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-ink shadow-[0_0_40px_rgba(212,168,83,0.4)] hover:shadow-[0_0_70px_rgba(212,168,83,0.65)] transition-shadow"
            >
              Start translating free
              <span aria-hidden>→</span>
            </a>
            <a
              href="#demo"
              data-cursor="PLAY"
              className="magnetic-btn inline-flex items-center gap-2 rounded-full border border-line bg-glass px-6 py-3.5 text-sm text-bone/90 hover:bg-bone/5 backdrop-blur"
            >
              <span className="w-2 h-2 rounded-full bg-bone" /> Watch demo
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
