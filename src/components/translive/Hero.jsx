import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useHeroAnimation } from "./hooks";

/* Code-split: canvas scenes ship in their own chunks and never block
   first paint of the hero content. */
const NeuralField = lazy(() =>
  import("./NeuralField").then((m) => ({ default: m.NeuralField })),
);
const RealEarth = lazy(() =>
  import("./RealEarth").then((m) => ({ default: m.RealEarth })),
);

const HELLOS = [
  { text: "Every language. One voice. Yours.", lang: "en" },
  { text: "हर भाषा। एक आवाज़। आपकी।", lang: "hi" },
  { text: "ప్రతి భాష. ఒక స్వరం. మీది.", lang: "te" },
  { text: "모든 언어. 하나의 목소리. 당신의.", lang: "ko" },
  { text: "すべての言語。ひとつの声。あなたの。", lang: "ja" },
  { text: "Todos los idiomas. Una voz. La tuya.", lang: "es" },
];

/* Deterministic particle field (no SSR/hydration mismatch) */
const PARTICLES = [
  { l: "6%", t: "18%", s: 5, d: 0 }, { l: "14%", t: "72%", s: 3, d: 1.2 },
  { l: "24%", t: "34%", s: 4, d: 2.4 }, { l: "38%", t: "82%", s: 3, d: 0.8 },
  { l: "47%", t: "12%", s: 5, d: 3.1 }, { l: "58%", t: "64%", s: 3, d: 1.7 },
  { l: "66%", t: "26%", s: 4, d: 2.9 }, { l: "76%", t: "78%", s: 5, d: 0.4 },
  { l: "84%", t: "38%", s: 3, d: 3.6 }, { l: "92%", t: "58%", s: 4, d: 1.5 },
  { l: "30%", t: "56%", s: 2, d: 4.2 }, { l: "70%", t: "10%", s: 3, d: 2.2 },
];

export function Hero() {
  const [i, setI] = useState(0);
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HELLOS.length), 3200);
    return () => clearInterval(t);
  }, []);

  /* Master entrance timeline + per-cycle word reveal (see hooks.js) */
  useHeroAnimation(rootRef, titleRef, i);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16"
    >
      {/* Cinematic backdrop: aurora, rays, particles, cursor-shifted glow */}
      <div className="aurora" aria-hidden />
      <div className="light-rays" aria-hidden />
      <div
        data-glow-parallax
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          willChange: "transform",
          background:
            "radial-gradient(ellipse 70% 55% at 30% 35%, rgba(139,92,246,0.14), transparent 70%), radial-gradient(ellipse 55% 45% at 75% 65%, rgba(0,212,255,0.1), transparent 70%)",
        }}
      />
      {/* Fractured glass accents in the corners */}
      <div className="glass-fracture w-[380px] h-[380px] -top-24 -right-20" aria-hidden />
      <div className="glass-fracture w-[280px] h-[280px] -bottom-16 -left-14 opacity-[0.05]" aria-hidden />
      {/* AI neural field — nodes, synapses, drifting glyphs, cursor-reactive */}
      <Suspense fallback={null}>
        <NeuralField />
      </Suspense>
      {PARTICLES.map((p, k) => (
        <span
          key={k}
          aria-hidden
          className="hero-particle"
          style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: `${p.d}s` }}
        />
      ))}

      <div
        className="relative w-full max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-10 items-center"
        style={{ perspective: "1100px" }}
      >
        {/* ---------------- Left: editorial headline ---------------- */}
        <div className="relative z-10 text-center lg:text-left">
          <div data-hero-fade className="inline-flex items-center gap-2 glass-bar px-4 py-1.5 text-xs font-mono tracking-widest uppercase text-bone/70">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            AI Video & Audio Translation
          </div>

          <h1 className="mt-8 font-display text-[clamp(2.6rem,5.6vw,4.9rem)] leading-[0.98] tracking-[-0.04em]">
            <span
              ref={titleRef}
              key={HELLOS[i].lang}
              lang={HELLOS[i].lang}
              className="block text-bone/95"
            >
              {HELLOS[i].text}
            </span>
          </h1>

          <p data-hero-fade className="mt-6 max-w-xl mx-auto lg:mx-0 text-base md:text-lg text-bone/60 leading-relaxed">
            Translate any video into 42 languages with lip-synced{" "}
            <span className="gold-text font-medium">AI voices</span> that sound like you.
            No dubbing studios. No subtitles. No excuses.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a
              data-hero-cta
              href="#cta"
              className="magnetic-btn iridescent btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium"
            >
              Start translating free
              <span aria-hidden data-arrow>→</span>
              <span className="drop-shadow" aria-hidden />
            </a>
            <a
              data-hero-cta
              href="#demo"
              data-cursor="PLAY"
              className="magnetic-btn iridescent inline-flex items-center gap-2 px-6 py-3.5 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-bone" /> Watch demo
              <span className="drop-shadow" aria-hidden />
            </a>
          </div>

          <div data-hero-fade className="mt-10 font-mono text-[10px] tracking-[0.25em] uppercase text-stone">
            42 languages · 0.4s latency · Est. 2024 · Bengaluru
          </div>
        </div>

        {/* ------- Right: floating AI translation orb --------------- */}
        <div
          data-orb-parallax
          className="relative z-10 w-full max-w-xl mx-auto lg:max-w-none lg:mx-0"
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
        >
          <div className="floaty">
            <Suspense fallback={null}>
              <RealEarth />
            </Suspense>
          </div>

          {/* Floating glass widgets around the orb */}
          
        </div>
      </div>

      {/* Scroll cue (desktop only — overlaps stacked content on mobile) */}
      <div data-hero-fade className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-stone">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  );
}
