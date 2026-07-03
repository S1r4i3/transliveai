import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "./motion";

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    kicker: "Scene 01 — Video Translation",
    title: "Words leave in English. Return in every tongue.",
    body: "Upload any video. Translive extracts speech, translates context, and re-voices your talent — frame-accurate.",
    stat: "Latency: 0.4s",
    lines: ["నమస్తే", "नमस्ते", "Hello", "안녕", "Bonjour", "Hola"],
  },
  {
    kicker: "Scene 02 — Lip-Sync AI",
    title: "Lips that speak languages they've never met.",
    body: "Our diffusion model retimes mouth shapes to match the new audio. No jarring cuts, no uncanny frames.",
    stat: "Voice similarity: 98.2%",
    lines: ["Ah", "अ", "అ", "あ", "아"],
  },
  {
    kicker: "Scene 03 — Vocal Remover",
    title: "Peel the voice off. Keep the record spinning.",
    body: "Separate vocals from instrumental in a single pass. Studio-grade stems, ready for the mix.",
    stat: "SDR: +14 dB",
    lines: ["♪", "♫", "♬", "♩"],
  },
  {
    kicker: "Scene 04 — 42 Languages",
    title: "A solar system of tongues, orbiting one voice.",
    body: "From Telugu to Turkish, we cover the languages your audience actually speaks — with native cadence.",
    stat: "Accents preserved: all of them",
    lines: ["EN", "हिं", "తె", "한국", "日本", "Es", "Fr", "Ar", "Pt"],
  },
];

const CHIPS = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "HI", name: "हिंदी", flag: "🇮🇳" },
  { code: "TE", name: "తెలుగు", flag: "🇮🇳" },
  { code: "KO", name: "한국어", flag: "🇰🇷" },
  { code: "JA", name: "日本語", flag: "🇯🇵" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "AR", name: "العربية", flag: "🇸🇦" },
  { code: "PT", name: "Português", flag: "🇧🇷" },
  { code: "DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "IT", name: "Italiano", flag: "🇮🇹" },
  { code: "TR", name: "Türkçe", flag: "🇹🇷" },
];

function SceneVideo() {
  return (
    <div data-cursor="PLAY" className="relative aspect-video w-full max-w-md rounded-2xl border border-line overflow-hidden bg-gradient-to-br from-ink to-[#eef2ff]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gold/90 grid place-items-center shadow-[0_0_50px_rgba(79,70,229,0.6)]">
          <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-ink ml-1" />
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex items-end gap-0.5 h-8">
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="flex-1 bg-gold/80 rounded-sm"
            style={{ height: `${20 + Math.abs(Math.sin(i * 0.5)) * 80}%`, animation: `waveform ${0.8 + (i % 5) * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.03}s` }}
          />
        ))}
      </div>
      <div className="absolute top-3 left-3 font-mono text-[10px] tracking-widest text-bone/60 uppercase">● REC 04:12</div>
    </div>
  );
}

function SceneFace() {
  return (
    <div className="relative w-full max-w-md aspect-square">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <radialGradient id="faceg" cx="50%" cy="45%">
            <stop offset="0%" stopColor="rgba(79,70,229,0.3)" />
            <stop offset="100%" stopColor="rgba(79,70,229,0)" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="150" fill="url(#faceg)" />
        {/* Wireframe head */}
        <g stroke="rgba(79,70,229,0.5)" fill="none" strokeWidth="0.6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={i} cx="200" cy="200" rx={100 + i * 4} ry={130 + i} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={100 + i * 25} y1="70" x2={100 + i * 25} y2="330" />
          ))}
        </g>
        {/* Eyes */}
        <ellipse cx="160" cy="180" rx="8" ry="3" fill="#4f46e5" />
        <ellipse cx="240" cy="180" rx="8" ry="3" fill="#4f46e5" />
        {/* Mouth animated */}
        <ellipse cx="200" cy="250" rx="30" ry="8" fill="none" stroke="#4f46e5" strokeWidth="1.5">
          <animate attributeName="ry" values="4;12;6;10;4" dur="1.6s" repeatCount="indefinite" />
        </ellipse>
      </svg>
      <div className="absolute inset-x-6 bottom-2 flex items-end gap-1 h-10">
        {Array.from({ length: 32 }).map((_, i) => (
          <span key={i} className="flex-1 bg-gold rounded-sm" style={{ height: `${30 + Math.abs(Math.sin(i * 0.8)) * 70}%`, animation: `waveform ${0.6 + (i % 4) * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.04}s` }} />
        ))}
      </div>
    </div>
  );
}

function SceneVocal() {
  return (
    <div className="relative w-full max-w-md space-y-6">
      <div>
        <div className="font-mono text-[10px] tracking-widest text-stone uppercase mb-2">Vocals — dissolving</div>
        <div className="flex items-end gap-0.5 h-16 opacity-30">
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="flex-1 bg-bone rounded-sm" style={{ height: `${20 + Math.abs(Math.sin(i * 0.4 + 1)) * 80}%` }} />
          ))}
        </div>
      </div>
      <div className="h-px bg-gold/50" />
      <div>
        <div className="font-mono text-[10px] tracking-widest text-gold uppercase mb-2">Instrumental — retained</div>
        <div className="flex items-end gap-0.5 h-20">
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="flex-1 bg-gradient-to-t from-gold-soft to-gold rounded-sm shadow-[0_0_8px_rgba(79,70,229,0.5)]" style={{ height: `${25 + Math.abs(Math.cos(i * 0.35)) * 75}%`, animation: `waveform ${0.9 + (i % 6) * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.02}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SceneLanguages() {
  const [hover, setHover] = useState(null);
  return (
    <div className="relative w-full max-w-md aspect-square">
      <div className="absolute inset-0 rounded-full border border-line" />
      <div className="absolute inset-[15%] rounded-full border border-line" />
      <div className="absolute inset-[30%] rounded-full border border-gold/30 animate-orb-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-[10px] tracking-widest text-stone">HEADLINE</div>
          <div className="mt-1 font-display text-xl text-bone">
            {hover !== null ? CHIPS[hover].name : "One voice. Every tongue."}
          </div>
        </div>
      </div>
      {CHIPS.map((c, i) => {
        const angle = (i / CHIPS.length) * Math.PI * 2 - Math.PI / 2;
        const r = 46;
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        return (
          <button
            key={c.code}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="chip-pop absolute flex items-center gap-1.5 rounded-full border border-line bg-ink/80 backdrop-blur px-2.5 py-1 text-xs font-mono hover:bg-gold hover:text-ink hover:border-gold"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
          >
            <span>{c.flag}</span>
            <span>{c.code}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Scenes() {
  const wrapRef = useRef(null);
  const ghostRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ghost = ghostRef.current;
    if (!wrap) return;
    const reduce = prefersReduced();
    const desktop = window.matchMedia("(min-width: 768px)").matches;

    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray("[data-scene]", wrap);

      scenes.forEach((scene) => {
        const copy = scene.querySelectorAll("[data-scene-copy] > *");
        const visual = scene.querySelector("[data-scene-visual]");

        if (reduce || !desktop) {
          // Simple fades instead of pinned scrub.
          gsap.from([...Array.from(copy), visual].filter(Boolean), {
            opacity: 0,
            y: reduce ? 0 : 24,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: scene, start: "top 75%", once: true },
          });
          return;
        }

        // Pinned, scrub-linked scene: reversing scroll reverses everything.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          copy,
          { y: 90, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, ease: "none", duration: 0.35 },
          0,
        )
          .fromTo(
            visual,
            { y: 140, rotation: 6, scale: 0.85, opacity: 0 },
            { y: 0, rotation: 0, scale: 1, opacity: 1, ease: "none", duration: 0.45 },
            0,
          )
          .to({}, { duration: 0.3 }) // hold while pinned
          .to(copy, { y: -40, opacity: 0.4, ease: "none", duration: 0.25 })
          .to(
            visual,
            { y: -60, scale: 1.04, opacity: 0.5, ease: "none", duration: 0.25 },
            "<",
          );
      });

      /* Orb ghost: transitions position, scale, color between scenes */
      if (ghost && desktop && !reduce) {
        const shift = () => window.innerWidth * 0.28;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(ghost, { opacity: 0.85, scale: 1, ease: "none", duration: 0.06 })
          .to(ghost, { x: () => shift(), scale: 1.3, ease: "none", duration: 0.22 })
          .to(ghost, { filter: "hue-rotate(-30deg)", ease: "none", duration: 0.22 }, "<")
          .to(ghost, { x: () => -shift(), scale: 0.75, ease: "none", duration: 0.24 })
          .to(ghost, { filter: "hue-rotate(35deg)", ease: "none", duration: 0.24 }, "<")
          .to(ghost, { x: () => shift(), scale: 1.15, ease: "none", duration: 0.24 })
          .to(ghost, { filter: "hue-rotate(-70deg)", ease: "none", duration: 0.24 }, "<")
          .to(ghost, { x: 0, scale: 0.9, ease: "none", duration: 0.18 })
          .to(ghost, { filter: "hue-rotate(0deg)", ease: "none", duration: 0.18 }, "<")
          .to(ghost, { opacity: 0, ease: "none", duration: 0.06 });
      }
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" className="relative py-24 md:py-32 px-6 md:px-10">
      {/* Orb ghost — fixed, travels between scenes on the master timeline */}
      <div
        ref={ghostRef}
        aria-hidden
        className="hidden md:block fixed left-1/2 top-1/2 w-44 h-44 -ml-22 -mt-22 rounded-full pointer-events-none z-0 blur-2xl"
        style={{
          opacity: 0,
          willChange: "transform, opacity, filter",
          background:
            "radial-gradient(circle at 38% 35%, rgba(165,180,252,0.9), rgba(79,70,229,0.55) 45%, rgba(139,92,246,0.18) 75%, transparent 100%)",
        }}
      />
      <div ref={wrapRef} className="relative z-10 max-w-[1400px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ 02 — Product</div>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
          Four models. <span className="gold-text">One orb.</span> Every workflow you needed dubbing for.
        </h2>

        <div className="mt-20 space-y-32 md:space-y-0 md:mt-8">
          {SCENES.map((s, idx) => {
            const visual = idx === 0 ? <SceneVideo /> : idx === 1 ? <SceneFace /> : idx === 2 ? <SceneVocal /> : <SceneLanguages />;
            const flip = idx % 2 === 1;
            return (
              <div key={idx} data-scene className="md:min-h-screen md:flex md:items-center">
                <div className={`grid md:grid-cols-2 gap-10 md:gap-20 items-center w-full ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div data-scene-copy>
                    <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold mb-4">{s.kicker}</div>
                    <h3 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight">{s.title}</h3>
                    <p className="mt-5 max-w-md text-bone/60 leading-relaxed">{s.body}</p>
                    <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 font-mono text-xs text-gold">
                      <span className="w-1 h-1 rounded-full bg-gold" />
                      {s.stat}
                    </div>
                  </div>
                  <div data-scene-visual className="flex items-center justify-center" style={{ willChange: "transform" }}>
                    {visual}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
