import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "./motion";

gsap.registerPlugin(ScrollTrigger);

/* Count-up when 50% in viewport — 1.2s, power1.out */
function CountUp({ end, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const render = () => {
      el.textContent = obj.v.toFixed(decimals) + suffix;
    };
    if (prefersReduced()) {
      obj.v = end;
      render();
      return;
    }
    render();
    const tween = gsap.to(obj, {
      v: end,
      duration: 1.2,
      ease: "power1.out",
      onUpdate: render,
      scrollTrigger: { trigger: el, start: "50% bottom", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [end, decimals, suffix]);
  return <span ref={ref}>{(0).toFixed(decimals) + suffix}</span>;
}

const STATS = [
  { label: "Latency", value: 0.4, decimals: 1, suffix: "s", note: "end-to-end, per minute of video" },
  { label: "Voice similarity", value: 98.2, decimals: 1, suffix: "%", note: "measured against source speaker" },
  { label: "Languages", value: 42, decimals: 0, suffix: "", note: "with native cadence & accent" },
  { label: "Subtitles needed", value: 0, decimals: 0, suffix: "", note: "we dub, we don't caption" },
];

export function Stats() {
  return (
    <section className="relative py-20 md:py-28 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-10">§ Datasheet</div>
        <div
          data-reveal-stagger
          className="glass-bar grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 px-8 py-10 md:px-12"
          style={{ "--bar-r": "28px" }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-mono text-[10px] tracking-widest text-stone uppercase">{s.label}</div>
              <div className="mt-3 font-display text-4xl md:text-6xl tracking-tight gold-text">
                <CountUp end={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs text-bone/50">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BADGES = [
  { label: "Sounds like you", size: "col-span-2 row-span-2", accent: true },
  { label: "No subtitles required" },
  { label: "Dubbing, retired" },
  { label: "One take. Every language." },
  { label: "Runs at 0.4s" },
  { label: "Native accents", accent: true },
  { label: "42 tongues" },
  { label: "Studio-grade stems" },
];

export function Badges() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ 04 — What people call us</div>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
          Bumper stickers we <span className="gold-text">actually earned.</span>
        </h2>
        <div data-reveal-stagger className="mt-14 grid grid-cols-2 md:grid-cols-4 auto-rows-[130px] md:auto-rows-[180px] gap-3 md:gap-4">
          {BADGES.map((b, i) => (
            <div
              key={i}
              className={`${b.size ?? ""} lift-card relative rounded-2xl border flex items-center justify-center p-6 text-center overflow-hidden ${
                b.accent
                  ? "border-gold/40 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent"
                  : "border-line bg-glass"
              }`}
            >
              <span className={`font-display text-lg md:text-2xl leading-tight tracking-tight ${b.accent ? "text-gold" : "text-bone/90"}`}>
                {b.label}
              </span>
              <span className="absolute top-3 left-3 font-mono text-[9px] tracking-widest text-stone">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  { q: "I watched my own video in Korean and understood myself for the first time.", who: "Anaya R.", role: "Creator · 2.1M subs" },
  { q: "We shipped a Spanish course in a weekend. The old process took a quarter.", who: "Diego Márquez", role: "Head of Learning, Rincón" },
  { q: "The lip-sync is uncanny — in the good way. My mother thought I'd learned Telugu.", who: "Rohan Iyer", role: "Filmmaker" },
  { q: "Cut our dubbing budget by 94%. The remaining 6% is coffee.", who: "Priya Nair", role: "COO, Mint Studios" },
  { q: "Translive is the first AI dub that keeps my breath, my pauses, my whole cadence.", who: "Ken Yamamoto", role: "Podcaster" },
];

/* Auto-scrolling loop · drag to override · momentum on release ·
   cards tilt 2° in the drag direction, elastic snap back */
export function Testimonials() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    if (prefersReduced()) {
      // Fall back to a plain, natively scrollable strip.
      viewport.style.overflowX = "auto";
      return;
    }

    let half = track.scrollWidth / 2;
    const onResize = () => {
      half = track.scrollWidth / 2;
    };
    window.addEventListener("resize", onResize);

    const setX = gsap.quickSetter(track, "x", "px");
    const cards = Array.from(track.children);
    const cardRots = cards.map((c) =>
      gsap.quickTo(c, "rotation", { duration: 0.4, ease: "power2.out" }),
    );
    const clampRot = gsap.utils.clamp(-2, 2);

    const AUTO = -42; // px/s — ~35s feel for the loop
    let x = 0;
    let vx = 0; // momentum, px/s
    let dragging = false;
    let lastX = 0;
    let lastT = 0;

    const tick = (_t, dtMs) => {
      const dt = Math.min(0.05, dtMs / 1000);
      if (!dragging) {
        vx += (0 - vx) * Math.min(1, dt * 2.2); // momentum decay
        x += (AUTO + vx) * dt;
      }
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      setX(x);
    };
    gsap.ticker.add(tick);

    const onDown = (e) => {
      dragging = true;
      vx = 0;
      lastX = e.clientX;
      lastT = performance.now();
      viewport.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastT) / 1000;
      x += dx;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      setX(x);
      vx = gsap.utils.clamp(-1600, 1600, dx / dt);
      const tilt = clampRot(vx / 400);
      cardRots.forEach((f) => f(tilt));
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      gsap.to(cards, { rotation: 0, duration: 0.9, ease: "elastic.out(1,0.45)" });
    };
    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const loop = [...REVIEWS, ...REVIEWS];

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ 05 — Reviews</div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
              Creators who <span className="gold-text">retired their subtitle track.</span>
            </h2>
          </div>
        </div>
      </div>
      <div
        ref={viewportRef}
        data-cursor="DRAG"
        className="relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      >
        <div
          ref={trackRef}
          className="flex gap-5 w-max px-6 md:px-10 py-6"
          style={{ willChange: "transform" }}
        >
          {loop.map((r, i) => (
            <figure key={i} className="glass-panel min-w-[320px] md:min-w-[440px] p-8" style={{ willChange: "transform" }}>
              <div className="flex gap-1 text-gold" aria-hidden>
                {Array.from({ length: 5 }).map((_, k) => <span key={k}>★</span>)}
              </div>
              <blockquote className="mt-5 font-display text-xl md:text-2xl leading-snug text-bone/95">
                "{r.q}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-line">
                <div className="font-medium text-bone">{r.who}</div>
                <div className="text-xs text-bone/50 mt-0.5">{r.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
