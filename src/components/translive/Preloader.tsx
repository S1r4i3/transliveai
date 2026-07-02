import { useEffect, useState } from "react";

const PHRASES = [
  "Translating",
  "अनुवाद हो रहा है",
  "అనువదిస్తోంది",
  "번역 중",
  "翻訳中",
  "Traduciendo",
  "Traduction",
  "Übersetzen",
  "جارِ الترجمة",
];

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phase, setPhase] = useState<"load" | "curtain" | "done">("load");

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / 1800) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => setPhase("curtain"), 250);
        setTimeout(() => setPhase("done"), 250 + 1000);
      }
    };
    raf = requestAnimationFrame(tick);
    const cycle = setInterval(() => setPhraseIdx((i) => (i + 1) % PHRASES.length), 400);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(cycle);
    };
  }, []);

  if (phase === "done") return null;

  const curtain = phase === "curtain";
  const curtainEase = "cubic-bezier(0.77,0,0.175,1)";

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none" aria-hidden>
      {/* Top curtain panel */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        style={{
          transform: curtain ? "translateY(-100%)" : "translateY(0)",
          transition: `transform 1s ${curtainEase}`,
        }}
      />
      {/* Bottom curtain panel */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
        style={{
          transform: curtain ? "translateY(100%)" : "translateY(0)",
          transition: `transform 1s ${curtainEase}`,
        }}
      />
      {/* Content overlay (fades before curtain splits) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: curtain ? 0 : 1,
          transition: "opacity .3s ease-out",
        }}
      >
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl md:text-3xl tracking-tight text-bone/90">
            {PHRASES[phraseIdx]}…
          </span>
        </div>
        <div className="mt-8 h-px w-64 md:w-96 bg-bone/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-soft via-gold to-bone origin-left"
            style={{ transform: `scaleX(${progress / 100})`, transition: "transform 60ms linear", width: "100%" }}
          />
        </div>
        <div className="mt-4 font-mono text-xs tracking-widest text-stone">
          {String(Math.floor(progress)).padStart(3, "0")}%
        </div>
      </div>
    </div>
  );
}
