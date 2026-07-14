import { useEffect, useRef, useState } from "react";

const WORDS = [
  "Translive", "isn't", "just", "a", "translator.",
  { text: "It's", flicker: false },
  "your",
  { text: "voice,", flicker: ["voz,", "आवाज़,", "スワミ,", "voice,"] },
  "in",
  { text: "every", flicker: false },
  { text: "language.", flicker: ["idioma.", "भाषा।", "언어.", "language."] },
];

export function Manifesto() {
  const secRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = secRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const p = Math.max(0, Math.min(1, (vh - rect.top) / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = WORDS.flat();

  return (
    <section ref={secRef} className="relative py-32 md:py-48 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-10">
          § 01 — Manifesto
        </div>
        <h2 data-no-fill className="font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.03em]">
          {words.map((w, i) => {
            const text = typeof w === "string" ? w : w.text;
            const flicker = typeof w === "object" && Array.isArray(w.flicker) ? w.flicker : null;
            const threshold = (i + 1) / (words.length + 2);
            const lit = progress > threshold;
            const flickIdx = flicker ? Math.min(flicker.length - 1, Math.floor(progress * flicker.length * 2) % flicker.length) : 0;
            return (
              <span
                key={i}
                className="inline-block mr-3 transition-colors duration-500"
                style={{
                  color: lit ? "transparent" : "rgba(255,255,255,0.16)",
                  backgroundImage: lit ? "linear-gradient(120deg,#ffffff 0%,#4f8bff 60%,#00d4ff 100%)" : "none",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                {flicker && !lit ? flicker[flickIdx] : text}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
