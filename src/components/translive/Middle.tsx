import { useEffect, useRef, useState } from "react";

function CountUp({ end, decimals = 0, suffix = "" }: { end: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            const start = performance.now();
            const dur = 1400;
            const step = (t: number) => {
              const p = Math.min(1, (t - start) / dur);
              setVal(end * (1 - Math.pow(1 - p, 3)));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

const STATS = [
  { label: "Latency", value: 0.4, decimals: 1, suffix: "s", note: "end-to-end, per minute of video" },
  { label: "Voice similarity", value: 98.2, decimals: 1, suffix: "%", note: "measured against source speaker" },
  { label: "Languages", value: 42, decimals: 0, suffix: "", note: "with native cadence & accent" },
  { label: "Subtitles needed", value: 0, decimals: 0, suffix: "", note: "we dub, we don't caption" },
];

export function Stats() {
  return (
    <section className="relative py-20 md:py-28 px-6 md:px-10 border-y border-line bg-ink/60">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-10">§ Datasheet</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
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
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 auto-rows-[130px] md:auto-rows-[180px] gap-3 md:gap-4">
          {BADGES.map((b, i) => (
            <div
              key={i}
              className={`${b.size ?? ""} relative rounded-2xl border flex items-center justify-center p-6 text-center overflow-hidden transition hover:scale-[1.02] ${
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

export function Testimonials() {
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
        <div className="relative -mx-6 md:-mx-10" data-cursor="DRAG">
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 md:px-10 pb-6 no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {REVIEWS.map((r, i) => (
              <figure key={i} className="glass-panel min-w-[320px] md:min-w-[440px] p-8 snap-start">
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
      </div>
    </section>
  );
}
