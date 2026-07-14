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

/* All 42 languages — flag images (flagcdn) render correctly on every OS,
   unlike emoji flags which fall back to letter pairs on Windows. */
const LANGS_42 = [
  { code: "EN", cc: "us", name: "English" },
  { code: "HI", cc: "in", name: "हिंदी" },
  { code: "TE", cc: "in", name: "తెలుగు" },
  { code: "TA", cc: "in", name: "தமிழ்" },
  { code: "BN", cc: "bd", name: "বাংলা" },
  { code: "UR", cc: "pk", name: "اردو" },
  { code: "NE", cc: "np", name: "नेपाली" },
  { code: "SI", cc: "lk", name: "සිංහල" },
  { code: "KO", cc: "kr", name: "한국어" },
  { code: "JA", cc: "jp", name: "日本語" },
  { code: "ZH", cc: "cn", name: "中文" },
  { code: "TH", cc: "th", name: "ไทย" },
  { code: "VI", cc: "vn", name: "Tiếng Việt" },
  { code: "ID", cc: "id", name: "Bahasa Indonesia" },
  { code: "MS", cc: "my", name: "Bahasa Melayu" },
  { code: "TL", cc: "ph", name: "Filipino" },
  { code: "KM", cc: "kh", name: "ខ្មែរ" },
  { code: "MY", cc: "mm", name: "မြန်မာ" },
  { code: "ES", cc: "es", name: "Español" },
  { code: "PT", cc: "br", name: "Português" },
  { code: "FR", cc: "fr", name: "Français" },
  { code: "DE", cc: "de", name: "Deutsch" },
  { code: "IT", cc: "it", name: "Italiano" },
  { code: "NL", cc: "nl", name: "Nederlands" },
  { code: "PL", cc: "pl", name: "Polski" },
  { code: "SV", cc: "se", name: "Svenska" },
  { code: "NO", cc: "no", name: "Norsk" },
  { code: "DA", cc: "dk", name: "Dansk" },
  { code: "FI", cc: "fi", name: "Suomi" },
  { code: "EL", cc: "gr", name: "Ελληνικά" },
  { code: "CS", cc: "cz", name: "Čeština" },
  { code: "HU", cc: "hu", name: "Magyar" },
  { code: "RO", cc: "ro", name: "Română" },
  { code: "UK", cc: "ua", name: "Українська" },
  { code: "RU", cc: "ru", name: "Русский" },
  { code: "TR", cc: "tr", name: "Türkçe" },
  { code: "AR", cc: "sa", name: "العربية" },
  { code: "HE", cc: "il", name: "עברית" },
  { code: "FA", cc: "ir", name: "فارسی" },
  { code: "SW", cc: "ke", name: "Kiswahili" },
  { code: "AM", cc: "et", name: "አማርኛ" },
  { code: "AF", cc: "za", name: "Afrikaans" },
];

/* three concentric orbits: 8 + 14 + 20 = 42 */
const ORBITS = [
  { count: 8, r: 21 },
  { count: 14, r: 34 },
  { count: 20, r: 47 },
];

function SceneVideo() {
  return (
    <div data-cursor="PLAY" className="relative aspect-video w-full max-w-md rounded-2xl border border-line overflow-hidden bg-gradient-to-br from-ink to-[#0a1230]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gold/90 grid place-items-center shadow-[0_0_50px_rgba(79,139,255,0.6)]">
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
            <stop offset="0%" stopColor="rgba(79,139,255,0.3)" />
            <stop offset="100%" stopColor="rgba(79,139,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="150" fill="url(#faceg)" />
        {/* Wireframe head */}
        <g stroke="rgba(79,139,255,0.5)" fill="none" strokeWidth="0.6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={i} cx="200" cy="200" rx={100 + i * 4} ry={130 + i} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={100 + i * 25} y1="70" x2={100 + i * 25} y2="330" />
          ))}
        </g>
        {/* Eyes */}
        <ellipse cx="160" cy="180" rx="8" ry="3" fill="#4f8bff" />
        <ellipse cx="240" cy="180" rx="8" ry="3" fill="#4f8bff" />
        {/* Mouth animated */}
        <ellipse cx="200" cy="250" rx="30" ry="8" fill="none" stroke="#4f8bff" strokeWidth="1.5">
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
            <span key={i} className="flex-1 bg-gradient-to-t from-gold-soft to-gold rounded-sm shadow-[0_0_8px_rgba(79,139,255,0.5)]" style={{ height: `${25 + Math.abs(Math.cos(i * 0.35)) * 75}%`, animation: `waveform ${0.9 + (i % 6) * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.02}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SceneLanguages() {
  const [hover, setHover] = useState(null);
  let idx = 0;
  return (
    <div className="relative w-full max-w-md aspect-square">
      <div className="absolute inset-[3%] rounded-full border border-line" />
      <div className="absolute inset-[16%] rounded-full border border-line" />
      <div className="absolute inset-[29%] rounded-full border border-line" />
      <div className="absolute inset-[38%] rounded-full border border-gold/30 animate-orb-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-16">
          <div className="font-mono text-[10px] tracking-widest text-stone">
            {hover !== null ? LANGS_42[hover].code : "42 LANGUAGES"}
          </div>
          <div className="mt-1 font-display text-lg md:text-xl text-bone leading-tight">
            {hover !== null ? LANGS_42[hover].name : "One voice. Every tongue."}
          </div>
        </div>
      </div>
      {ORBITS.map((orbit, o) =>
        Array.from({ length: orbit.count }).map((_, k) => {
          const c = LANGS_42[idx++];
          // stagger each ring's starting angle so chips don't align in spokes
          const angle = (k / orbit.count) * Math.PI * 2 - Math.PI / 2 + o * 0.35;
          const x = 50 + Math.cos(angle) * orbit.r;
          const y = 50 + Math.sin(angle) * orbit.r;
          const i = idx - 1;
          return (
            <button
              key={c.code + c.cc}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              aria-label={c.name}
              className="chip-pop absolute flex items-center gap-1 rounded-full border border-line bg-ink/85 backdrop-blur px-1.5 py-0.5 font-mono text-[9px] hover:bg-gold hover:text-white hover:border-gold"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
            >
              <img
                src={`https://flagcdn.com/w20/${c.cc}.png`}
                alt=""
                width={14}
                height={10}
                loading="lazy"
                decoding="async"
                className="rounded-[2px] w-3.5 h-auto"
              />
              <span>{c.code}</span>
            </button>
          );
        }),
      )}
    </div>
  );
}

export function Scenes() {
  const wrapRef = useRef(null);
  const ghostRef = useRef(null);
  const ballRef = useRef(null);
  const ringRef = useRef(null);
  const sceneNumRef = useRef(null);
  const nudgeRef = useRef(null);

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
        const ball = ballRef.current;
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
          .to(ball, { filter: "hue-rotate(-30deg)", ease: "none", duration: 0.22 }, "<")
          .to(ghost, { x: () => -shift(), scale: 0.75, ease: "none", duration: 0.24 })
          .to(ball, { filter: "hue-rotate(35deg)", ease: "none", duration: 0.24 }, "<")
          .to(ghost, { x: () => shift(), scale: 1.15, ease: "none", duration: 0.24 })
          .to(ball, { filter: "hue-rotate(-70deg)", ease: "none", duration: 0.24 }, "<")
          .to(ghost, { x: 0, scale: 0.9, ease: "none", duration: 0.18 })
          .to(ball, { filter: "hue-rotate(0deg)", ease: "none", duration: 0.18 }, "<")
          .to(ghost, { opacity: 0, ease: "none", duration: 0.06 });

        /* --- keep-scrolling cues ------------------------------------ */
        const ring = ringRef.current;
        const num = sceneNumRef.current;
        const nudge = nudgeRef.current;
        const C = 2 * Math.PI * 48; // ring circumference (r=48 in a 100 viewBox)
        if (ring) {
          ring.style.strokeDasharray = `${C}`;
          ring.style.strokeDashoffset = `${C}`;
        }

        // velocity squash & stretch on the ball
        const syTo = gsap.quickTo(ball, "scaleY", { duration: 0.3, ease: "power2.out" });
        const sxTo = gsap.quickTo(ball, "scaleX", { duration: 0.3, ease: "power2.out" });
        let settle = null;

        // idle "keep scrolling" nudge
        let active = false;
        let idleTimer = null;
        let nudgeShown = false;
        if (nudge) gsap.set(nudge, { y: 10 });
        const showNudge = () => {
          if (!nudge) return;
          nudgeShown = true;
          gsap.to(nudge, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", overwrite: "auto" });
        };
        const hideNudge = () => {
          if (!nudge || !nudgeShown) return;
          nudgeShown = false;
          gsap.to(nudge, { opacity: 0, y: 10, duration: 0.25, ease: "power2.out", overwrite: "auto" });
        };
        const resetIdle = () => {
          hideNudge();
          clearTimeout(idleTimer);
          if (active) idleTimer = setTimeout(showNudge, 2500);
        };

        ScrollTrigger.create({
          trigger: wrap,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            active = self.isActive;
            if (active) resetIdle();
            else {
              clearTimeout(idleTimer);
              hideNudge();
            }
          },
          onUpdate: (self) => {
            // progress ring + scene counter
            const p = self.progress;
            if (ring) ring.style.strokeDashoffset = `${C * (1 - p)}`;
            if (num) {
              const n = Math.min(4, Math.floor(p * 4) + 1);
              num.textContent = `0${n} / 04`;
            }
            // squash & stretch with scroll velocity
            const v = Math.abs(self.getVelocity());
            const s = gsap.utils.clamp(1, 1.25, 1 + v / 5000);
            syTo(s);
            sxTo(1 - (s - 1) * 0.5);
            settle?.kill();
            settle = gsap.delayedCall(0.15, () => {
              syTo(1);
              sxTo(1);
            });
            // any scroll counts as activity
            resetIdle();
          },
        });
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
        className="hidden md:block fixed left-1/2 top-1/2 w-44 h-44 -ml-22 -mt-22 pointer-events-none z-0"
        style={{ opacity: 0, willChange: "transform, opacity" }}
      >
        {/* the ball (blurred; squashes & stretches with scroll velocity) */}
        <div
          ref={ballRef}
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            willChange: "transform, filter",
            background:
              "radial-gradient(circle at 38% 35%, rgba(110,231,255,0.9), rgba(79,139,255,0.55) 45%, rgba(139,92,246,0.18) 75%, transparent 100%)",
          }}
        />
        {/* crisp progress ring — fills as the scenes play */}
        <svg className="absolute -inset-2" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="scene-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="55%" stopColor="#4f8bff" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#scene-ring)"
            strokeWidth="1.6"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        {/* scene counter */}
        <div
          ref={sceneNumRef}
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-stone"
        >
          01 / 04
        </div>
      </div>

      {/* idle nudge — appears only if the user stalls inside the pinned scenes */}
      <div
        ref={nudgeRef}
        aria-hidden
        className="hidden md:inline-flex fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none glass-bar items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase text-stone"
        style={{ opacity: 0, willChange: "transform, opacity" }}
      >
        Keep scrolling <span className="nudge-bob text-gold">↓</span>
      </div>

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
