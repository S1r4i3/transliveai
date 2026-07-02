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
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / 1800) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    const cycle = setInterval(() => setPhraseIdx((i) => (i + 1) % PHRASES.length), 220);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(cycle);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink transition-opacity duration-500"
      style={{ opacity: progress >= 100 ? 0 : 1 }}
      aria-hidden
    >
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl md:text-3xl tracking-tight text-bone/90">
          {PHRASES[phraseIdx]}…
        </span>
      </div>
      <div className="mt-8 h-px w-64 md:w-96 bg-bone/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-soft via-gold to-bone"
          style={{ width: `${progress}%`, transition: "width 60ms linear" }}
        />
      </div>
      <div className="mt-4 font-mono text-xs tracking-widest text-stone">
        {String(Math.floor(progress)).padStart(3, "0")}%
      </div>
    </div>
  );
}
