import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "./motion";
import { Logo } from "./Logo";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 200;

export function Closing() {
  const secRef = useRef(null);
  const layerRef = useRef(null);
  const orbRef = useRef(null);
  const btnRef = useRef(null);
  const headRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const layer = layerRef.current;
    const orb = orbRef.current;
    const btn = btnRef.current;
    const head = headRef.current;
    if (!sec || !layer || !orb || !btn || !head) return;
    if (prefersReduced()) return;

    // Stable per-particle randomness (survives ScrollTrigger refreshes)
    const seeds = Array.from({ length: PARTICLE_COUNT }, () => ({
      a0: Math.random() * Math.PI * 2,
      r0: Math.sqrt(Math.random()),
      a1: Math.random() * Math.PI * 2,
      r1: 60 + Math.random() * 110,
      squash: 0.35 + Math.random() * 0.4,
      delay: Math.random() * 0.25,
      size: 2 + Math.random() * 2,
    }));

    const particles = seeds.map((s) => {
      const p = document.createElement("span");
      p.className = "tv-particle";
      p.style.width = `${s.size}px`;
      p.style.height = `${s.size}px`;
      layer.appendChild(p);
      return p;
    });

    const rel = (el) => {
      const lr = layer.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - lr.left, y: r.top + r.height / 2 - lr.top };
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top 75%",
          end: "center 45%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // The orb dissolves…
      tl.to(orb, { opacity: 0, scale: 0.55, ease: "none", duration: 0.7 }, 0.1);

      // …into particles that drift toward and settle around the CTA
      particles.forEach((p, i) => {
        const s = seeds[i];
        tl.fromTo(
          p,
          {
            x: () => {
              const o = rel(orb);
              const rad = orb.offsetWidth / 2;
              return o.x + Math.cos(s.a0) * rad * s.r0;
            },
            y: () => {
              const o = rel(orb);
              const rad = orb.offsetWidth / 2;
              return o.y + Math.sin(s.a0) * rad * s.r0;
            },
            opacity: 0,
          },
          {
            x: () => {
              const b = rel(btn);
              return b.x + Math.cos(s.a1) * s.r1;
            },
            y: () => {
              const b = rel(btn);
              return b.y + Math.sin(s.a1) * s.r1 * s.squash;
            },
            opacity: 0.85,
            ease: "none",
            duration: 0.75 - s.delay,
          },
          s.delay,
        );
      });

      // Closing headline: scale 0.95 → 1, letter-spacing tightens
      tl.fromTo(
        head,
        { scale: 0.95, letterSpacing: "0.01em" },
        { scale: 1, letterSpacing: "-0.04em", ease: "none", duration: 0.9 },
        0,
      );
    }, sec);

    return () => {
      ctx.revert();
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <section ref={secRef} id="cta" className="relative py-32 md:py-48 px-6 md:px-10 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 42% 60%, rgba(79,139,255,0.1), transparent 70%), radial-gradient(ellipse 50% 35% at 62% 45%, rgba(139,92,246,0.08), transparent 70%)",
        }}
      />
      {/* Fractured glass accent */}
      <div className="glass-fracture w-[420px] h-[420px] top-8 right-[-60px]" aria-hidden />
      {/* Particle layer */}
      <div ref={layerRef} aria-hidden className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1200px] mx-auto text-center">
        {/* The orb that dissolves */}
        <div
          ref={orbRef}
          aria-hidden
          className="mx-auto mb-12 w-28 h-28 rounded-full"
          style={{
            willChange: "transform, opacity",
            background:
              "radial-gradient(circle at 38% 32%, rgba(110,231,255,0.95), rgba(79,139,255,0.5) 45%, rgba(139,92,246,0.15) 78%, transparent 100%)",
            boxShadow: "0 0 60px rgba(79,139,255,0.3)",
          }}
        />
        <h2
          ref={headRef}
          className="font-display text-[clamp(2.5rem,9vw,7rem)] leading-[0.95] tracking-[-0.04em]"
          style={{ willChange: "transform" }}
        >
          One video.
          <br />
          Every language.
          <br />
          <span className="gold-text">Zero excuses.</span>
        </h2>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <a
            ref={btnRef}
            href="#"
            className="magnetic-btn iridescent btn-primary inline-flex items-center gap-3 px-8 py-4 text-base font-medium"
          >
            Start translating free
            <span aria-hidden data-arrow>→</span>
            <span className="drop-shadow" aria-hidden />
          </a>
          <a
            href="#pricing"
            className="magnetic-btn iridescent inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            View pricing
            <span className="drop-shadow" aria-hidden />
          </a>
        </div>
        <div className="mt-8 font-mono text-xs tracking-widest text-stone uppercase">
          No credit card · 60 free minutes · Cancel anytime
        </div>
      </div>
    </section>
  );
}

const LOCALES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "te", label: "తెలుగు" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "es", label: "Español" },
];

export function Footer() {
  const [locale, setLocale] = useState("en");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <footer className="relative border-t border-line bg-ink/30 backdrop-blur-2xl px-6 md:px-10 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 md:gap-10">
          <div>
            <Logo size={24} tagline />
            <p className="mt-4 text-sm text-bone/60 max-w-sm leading-relaxed">
              Get updates in your language. Product news, new voices, and the occasional dad joke — dubbed.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSent(true);
              }}
              className="mt-5 flex items-center gap-2 rounded-full border border-line bg-glass p-1 pl-4 max-w-md"
            >
              <input
                type="email"
                required
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm text-bone placeholder:text-bone/40 outline-none py-2"
              />
              <button className="iridescent btn-primary px-4 py-2 text-xs font-medium">
                {sent ? "✓ Subscribed" : "Subscribe"}
                <span className="drop-shadow" aria-hidden />
              </button>
            </form>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-stone mb-4">Product</div>
            <ul className="space-y-2.5 text-sm text-bone/70">
              <li><a href="#features" className="hover:text-bone">Video Translation</a></li>
              <li><a href="#features" className="hover:text-bone">Lip-Sync AI</a></li>
              <li><a href="#features" className="hover:text-bone">Vocal Remover</a></li>
              <li><a href="#pricing" className="hover:text-bone">Pricing</a></li>
              <li><a href="#engine" className="hover:text-bone">API Docs</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-stone mb-4">Company</div>
            <ul className="space-y-2.5 text-sm text-bone/70">
              <li><a href="#" className="hover:text-bone">About</a></li>
              <li><a href="#" className="hover:text-bone">Careers</a></li>
              <li><a href="#" className="hover:text-bone">Blog</a></li>
              <li><a href="#" className="hover:text-bone">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-stone mb-4">Legal</div>
            <ul className="space-y-2.5 text-sm text-bone/70">
              <li><a href="#" className="hover:text-bone">Privacy</a></li>
              <li><a href="#" className="hover:text-bone">Terms</a></li>
              <li><a href="#" className="hover:text-bone">Data policy</a></li>
              <li><a href="#" className="hover:text-bone">Model card</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-xs text-bone/50">
            <span>© 2026 Translive Labs. Bengaluru.</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Made with 42 tongues.</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-mono text-[10px] tracking-widest uppercase text-stone">Language</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="rounded-full border border-line bg-glass px-3 py-1.5 text-sm text-bone/90 outline-none focus:border-gold"
            >
              {LOCALES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 ml-2">
              {["X", "IG", "YT", "IN"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 grid place-items-center rounded-full border border-line text-[10px] tracking-widest text-bone/70 hover:border-gold hover:text-gold transition">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
