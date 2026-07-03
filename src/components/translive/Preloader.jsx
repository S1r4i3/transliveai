import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReduced } from "./motion";
import { Logo } from "./Logo";

const PHRASES = ["Translating", "अनुवाद हो रहा है", "అనువదిస్తోంది", "번역 중", "Traduciendo"];

function fireReveal() {
  window.__tvRevealed = true;
  window.dispatchEvent(new CustomEvent("tv:reveal"));
}

export function Preloader() {
  const [done, setDone] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const topRef = useRef(null);
  const botRef = useRef(null);
  const contentRef = useRef(null);
  const barRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    if (prefersReduced()) {
      // No theatrics: reveal immediately.
      fireReveal();
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";
    const cycle = setInterval(
      () => setPhraseIdx((i) => (i + 1) % PHRASES.length),
      400,
    );

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    });

    tl.to(counter, {
      v: 100,
      duration: 1.8,
      ease: "power1.inOut",
      onUpdate: () => {
        if (pctRef.current)
          pctRef.current.textContent = `${String(Math.floor(counter.v)).padStart(3, "0")}%`;
        if (barRef.current)
          barRef.current.style.transform = `scaleX(${counter.v / 100})`;
      },
    })
      // brief hold at 100%
      .to(contentRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, "+=0.2")
      // curtain reveal: two panels split away, power4.inOut, 1s
      .add(() => {
        clearInterval(cycle);
        fireReveal();
        document.body.style.overflow = "";
      })
      .to(topRef.current, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "<")
      .to(botRef.current, { yPercent: 100, duration: 1, ease: "power4.inOut" }, "<");

    return () => {
      clearInterval(cycle);
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none" aria-hidden>
      {/* Curtain panels */}
      <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div ref={botRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <div className="mb-8">
          <Logo size={30} tagline />
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl md:text-3xl tracking-tight text-bone/90">
            {PHRASES[phraseIdx]}…
          </span>
        </div>
        <div className="mt-8 h-px w-64 md:w-96 bg-bone/10 overflow-hidden">
          <div
            ref={barRef}
            className="h-full w-full bg-gradient-to-r from-gold-soft via-gold to-bone origin-left"
            style={{ transform: "scaleX(0)", willChange: "transform" }}
          />
        </div>
        <div ref={pctRef} className="mt-4 font-mono text-xs tracking-widest text-stone">
          000%
        </div>
      </div>
    </div>
  );
}
