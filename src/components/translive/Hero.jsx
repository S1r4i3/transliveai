import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReduced, splitWords } from "./motion";

const HELLOS = [
  { text: "Every language. One voice. Yours.", lang: "en" },
  { text: "हर भाषा। एक आवाज़। आपकी।", lang: "hi" },
  { text: "ప్రతి భాష. ఒక స్వరం. మీది.", lang: "te" },
  { text: "모든 언어. 하나의 목소리. 당신의.", lang: "ko" },
  { text: "すべての言語。ひとつの声。あなたの。", lang: "ja" },
  { text: "Todos los idiomas. Una voz. La tuya.", lang: "es" },
];

const CHIPS = ["EN", "हिं", "తె", "한", "ES", "FR"];

const TIMELINE = [
  { label: "Extracting speech", pct: 100, tone: "from-violet-400/80 to-blue-400/80" },
  { label: "Translating context", pct: 82, tone: "from-blue-400/80 to-cyan-400/80" },
  { label: "Cloning voice · lip-sync", pct: 46, tone: "from-cyan-400/80 to-cyan-300/80" },
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
  const revealedRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HELLOS.length), 3200);
    return () => clearInterval(t);
  }, []);

  /* Hide the supporting cast until the curtain opens */
  useEffect(() => {
    if (prefersReduced()) return;
    const root = rootRef.current;
    if (!root || revealedRef.current || window.__tvRevealed) return;
    gsap.set(root.querySelectorAll("[data-hero-fade], [data-hero-cta]"), {
      opacity: 0,
    });
    gsap.set(root.querySelector("[data-orb-parallax]"), { opacity: 0 });
  }, []);

  /* Word-by-word headline reveal — on curtain open and on each language cycle */
  useEffect(() => {
    const el = titleRef.current;
    const root = rootRef.current;
    if (!el || !root || prefersReduced()) return;

    const words = splitWords(el);
    gsap.set(words, { yPercent: 110 });

    const playWords = () =>
      gsap.to(words, {
        yPercent: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });

    const playEntrance = () => {
      revealedRef.current = true;
      const tl = gsap.timeline();
      tl.add(playWords(), 0)
        .fromTo(
          root.querySelectorAll("[data-hero-fade]"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 },
          0.3,
        )
        .fromTo(
          root.querySelectorAll("[data-hero-cta]"),
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          0.45,
        )
        .fromTo(
          root.querySelector("[data-orb-parallax]"),
          { opacity: 0, y: 60, rotationY: -10 },
          { opacity: 1, y: 0, rotationY: 0, duration: 1.2, ease: "power3.out" },
          0.35,
        );
    };

    if (revealedRef.current || window.__tvRevealed) {
      if (revealedRef.current) playWords();
      else playEntrance();
      return;
    }
    window.addEventListener("tv:reveal", playEntrance, { once: true });
    return () => window.removeEventListener("tv:reveal", playEntrance);
  }, [i]);

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
            "radial-gradient(ellipse 70% 55% at 30% 35%, rgba(139,92,246,0.08), transparent 70%), radial-gradient(ellipse 55% 45% at 75% 65%, rgba(6,182,212,0.06), transparent 70%)",
        }}
      />
      {/* Fractured glass accents in the corners */}
      <div className="glass-fracture w-[380px] h-[380px] -top-24 -right-20" aria-hidden />
      <div className="glass-fracture w-[280px] h-[280px] -bottom-16 -left-14 opacity-[0.05]" aria-hidden />
      {PARTICLES.map((p, k) => (
        <span
          key={k}
          aria-hidden
          className="hero-particle"
          style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: `${p.d}s` }}
        />
      ))}

      <div
        className="relative w-full max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-[1.05fr_1fr] gap-14 md:gap-10 items-center"
        style={{ perspective: "1100px" }}
      >
        {/* ---------------- Left: editorial headline ---------------- */}
        <div className="relative z-10 text-center md:text-left">
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

          <p data-hero-fade className="mt-6 max-w-xl mx-auto md:mx-0 text-base md:text-lg text-bone/60 leading-relaxed">
            Translate any video into 42 languages with lip-synced{" "}
            <span className="gold-text font-medium">AI voices</span> that sound like you.
            No dubbing studios. No subtitles. No excuses.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-3">
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

        {/* ------- Right: floating AI translation dashboard --------- */}
        <div
          data-orb-parallax
          className="relative z-10"
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
        >
          {/* Main ripple-glass dashboard */}
          <div className="glass-ripple floaty p-6 md:p-7">
            <span className="sweep-layer" aria-hidden />
            {/* Header: title + API status */}
            <div className="flex items-center justify-between">
              <div className="font-display text-lg tracking-tight text-bone">
                Translation Studio
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-bone/60">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                API · Operational
              </div>
            </div>

            {/* Language chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {CHIPS.map((c, k) => (
                <span
                  key={c}
                  className={`chip-pop rounded-full border px-3 py-1 text-xs font-mono ${
                    k === 0
                      ? "border-gold/60 bg-gold/15 text-gold"
                      : "border-line bg-glass text-bone/70"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Translation timeline */}
            <div className="mt-6 space-y-4">
              {TIMELINE.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-bone/55">
                    <span>{row.label}</span>
                    <span className="text-gold">{row.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-bone/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${row.tone}`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Audio waveform */}
            <div className="mt-6 flex items-end gap-0.5 h-10">
              {Array.from({ length: 44 }).map((_, k) => (
                <span
                  key={k}
                  className="flex-1 rounded-sm bg-gradient-to-t from-blue-400/70 to-cyan-300/80"
                  style={{
                    height: `${18 + Math.abs(Math.sin(k * 0.45)) * 82}%`,
                    animation: `waveform ${0.8 + (k % 5) * 0.18}s ease-in-out infinite`,
                    animationDelay: `${k * 0.03}s`,
                  }}
                />
              ))}
            </div>

            {/* Footer row: voice clone + latency */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line bg-glass px-4 py-3">
                <div className="font-mono text-[9px] tracking-widest uppercase text-stone">Voice clone</div>
                <div className="mt-1 font-display text-xl gold-text">98.2%</div>
              </div>
              <div className="rounded-xl border border-line bg-glass px-4 py-3">
                <div className="font-mono text-[9px] tracking-widest uppercase text-stone">Latency</div>
                <div className="mt-1 font-display text-xl text-bone">0.4s</div>
              </div>
            </div>
          </div>

          {/* Floating diamond widgets */}
          <div
            className="glass-diamond floaty hidden md:block absolute -top-8 -right-6 px-5 py-4"
            style={{ animationDelay: "1.6s" }}
          >
            <div className="font-mono text-[9px] tracking-widest uppercase text-stone">Languages</div>
            <div className="mt-1 font-display text-2xl gold-text">42</div>
          </div>
          <div
            className="glass-diamond floaty hidden md:block absolute -bottom-9 -left-8 px-5 py-4"
            style={{ animationDelay: "3.2s" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-bone/70">
                Lip-sync · live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div data-hero-fade className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  );
}
