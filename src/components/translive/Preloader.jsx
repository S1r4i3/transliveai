import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReduced } from "./motion";
import { MicGlyph } from "./Logo";

/* The brand name itself cycles through languages */
const NAMES = [
  { text: "Translive", lang: "en" },
  { text: "ट्रांसलाइव", lang: "hi" },
  { text: "ట్రాన్స్‌లైవ్", lang: "te" },
  { text: "트랜스라이브", lang: "ko" },
  { text: "トランスライブ", lang: "ja" },
  { text: "Транслайв", lang: "ru" },
  { text: "ترانسلايف", lang: "ar" },
];

function fireReveal() {
  window.__tvRevealed = true;
  window.dispatchEvent(new CustomEvent("tv:reveal"));
}

export function Preloader() {
  const [done, setDone] = useState(false);
  const [nameIdx, setNameIdx] = useState(0);
  const topRef = useRef(null);
  const botRef = useRef(null);
  const contentRef = useRef(null);
  const barRef = useRef(null);
  const fillRef = useRef(null);
  const dotRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    if (prefersReduced()) {
      fireReveal();
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";
    const cycle = setInterval(
      () => setNameIdx((i) => (i + 1) % NAMES.length),
      420,
    );

    const counter = { v: 0 };
    const barWidth = () => barRef.current?.offsetWidth ?? 0;

    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    });

    tl.to(counter, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = counter.v / 100;
        if (pctRef.current)
          pctRef.current.textContent = `${String(Math.floor(counter.v)).padStart(3, "0")}%`;
        if (fillRef.current)
          fillRef.current.style.transform = `scaleX(${p})`;
        if (dotRef.current)
          dotRef.current.style.transform = `translateX(${p * barWidth()}px)`;
      },
    })
      // brief hold at 100%
      .to(contentRef.current, { opacity: 0, scale: 0.98, duration: 0.35, ease: "power2.out" }, "+=0.25")
      // curtain reveal: two panels split away
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

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-6"
      >
        {/* ambient aurora behind the mark */}
        <div className="aurora" />

        {/* Translive — cycling languages — + neon mic */}
        <div className="relative flex items-center gap-4 md:gap-5">
          <span
            key={NAMES[nameIdx].lang}
            lang={NAMES[nameIdx].lang}
            className="tv-name-in font-display font-bold tracking-tight text-bone text-[clamp(2.4rem,7vw,4.2rem)] leading-none"
          >
            {NAMES[nameIdx].text}
          </span>
          <span className="mic-breathe">
            <MicGlyph height={60} />
          </span>
        </div>

        {/* Tagline */}
        <div className="mt-5 font-display italic text-sm md:text-base tracking-wide text-stone">
          Real Time Translation — <span className="gold-text not-italic font-medium">Real World Impact</span>
        </div>

        {/* Loader */}
        <div className="mt-12 w-72 md:w-[420px]">
          <div ref={barRef} className="relative h-1.5 rounded-full bg-bone/10">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div ref={fillRef} className="tv-loader-fill" style={{ transform: "scaleX(0)" }} />
            </div>
            <div ref={dotRef} className="tv-loader-dot" />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-stone">
            <span>Calibrating voices</span>
            <span ref={pctRef}>000%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
