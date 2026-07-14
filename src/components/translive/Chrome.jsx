import { useEffect, useState } from "react";
import { prefersReduced } from "./motion";
import { Logo } from "./Logo";
import { setSoundEnabled } from "./sound";

/* Custom cursor: dot + trailing ring (0.15 lerp).
   Ring → 60px with label over [data-cursor] targets (PLAY / DRAG),
   shrinks & brightens over buttons/links. Hidden on touch devices
   and under prefers-reduced-motion. */
export function useCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReduced()) return;

    document.body.classList.add("tv-cursor-on");
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "tv-cursor-dot";
    ring.className = "tv-cursor-ring";
    document.body.append(dot, ring);
    Object.assign(dot.style, {
      position: "fixed", top: "0", left: "0", width: "6px", height: "6px",
      background: "#4f8bff", borderRadius: "9999px", pointerEvents: "none",
      zIndex: "9999", transform: "translate(-50%,-50%)", transition: "opacity .2s",
      willChange: "transform",
    });
    Object.assign(ring.style, {
      position: "fixed", top: "0", left: "0", width: "36px", height: "36px",
      border: "1px solid rgba(79,139,255,0.6)", borderRadius: "9999px",
      pointerEvents: "none", zIndex: "9998",
      transform: "translate(-50%,-50%)",
      transition: "width .25s, height .25s, background .25s, border-color .25s, opacity .2s",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono, monospace)", fontSize: "10px", color: "#050816",
      letterSpacing: "0.1em", willChange: "transform",
    });

    // Movement is transform-only (never top/left) to stay compositor-friendly.
    let x = 0, y = 0, rx = 0, ry = 0;
    let rafId = 0;
    let mode = "default";
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    };
    const loop = () => {
      const dx = x - rx, dy = y - ry;
      rx += dx * 0.15; ry += dy * 0.15; // 0.15 lerp trail
      // velocity stretch: the ring elongates along its direction of travel
      let stretch = "";
      if (mode === "default") {
        const speed = Math.hypot(dx, dy);
        const k = Math.min(0.3, speed / 900);
        if (k > 0.02) {
          const ang = Math.atan2(dy, dx);
          stretch = ` rotate(${ang}rad) scale(${1 + k}, ${1 - k * 0.5}) rotate(${-ang}rad)`;
        }
      }
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)${stretch}`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    // click ripple ring
    const onDown = (e) => {
      const rip = document.createElement("div");
      rip.className = "cursor-rip";
      rip.style.left = `${e.clientX}px`;
      rip.style.top = `${e.clientY}px`;
      document.body.appendChild(rip);
      setTimeout(() => rip.remove(), 550);
    };
    window.addEventListener("pointerdown", onDown);

    const setMode = (next, label = "") => {
      mode = next;
      ring.textContent = mode === "label" ? label : "";
      if (mode === "label") {
        // 60px, filled, shows PLAY / DRAG
        ring.style.width = "60px"; ring.style.height = "60px";
        ring.style.background = "#4f8bff"; ring.style.borderColor = "#4f8bff";
      } else if (mode === "button") {
        // shrinks and brightens
        ring.style.width = "20px"; ring.style.height = "20px";
        ring.style.background = "rgba(79,139,255,0.2)";
        ring.style.borderColor = "#6ee7ff";
      } else {
        ring.style.width = "36px"; ring.style.height = "36px";
        ring.style.background = "transparent";
        ring.style.borderColor = "rgba(79,139,255,0.6)";
      }
    };
    const onOver = (e) => {
      const t = e.target;
      const labelled = t?.closest?.("[data-cursor]");
      if (labelled?.dataset.cursor) {
        setMode("label", labelled.dataset.cursor);
        return;
      }
      if (t?.closest?.("a, button, [role='button'], select, input, textarea")) {
        setMode("button");
        return;
      }
      setMode("default");
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      dot.remove(); ring.remove();
      document.body.classList.remove("tv-cursor-on");
    };
  }, []);
}

/* Ambient sound toggle — off by default, remembers the choice */
function SoundToggle() {
  const [on, setOn] = useState(false);
  const toggle = () => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
  };
  return (
    <button
      onClick={toggle}
      aria-label={on ? "Mute ambient sound" : "Enable ambient sound"}
      aria-pressed={on}
      title={on ? "Sound on" : "Sound off"}
      className={`w-9 h-9 grid place-items-center rounded-full border transition-colors ${
        on ? "border-gold/60 text-gold" : "border-line text-bone/50 hover:text-bone/80"
      }`}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 5 6 9H3v6h3l5 4z" />
        {on ? (
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        ) : (
          <path d="M16 9l5 6M21 9l-5 6" />
        )}
      </svg>
    </button>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 px-4 md:px-8 pt-3"
        style={{ willChange: "transform" }}
      >
        <div
          className="glass-bar mx-auto max-w-[1200px] px-5 md:px-7 h-14 md:h-16 flex items-center justify-between"
          style={{
            background: scrolled ? "rgba(10,17,40,0.6)" : "rgba(255,255,255,0.05)",
            backdropFilter: scrolled
              ? "blur(38px) saturate(180%)"
              : "blur(24px) saturate(150%)",
            boxShadow: scrolled
              ? "0 14px 40px rgba(0,0,0,0.5), 0 0 36px rgba(79,139,255,0.14), inset 0 1px 0 rgba(255,255,255,0.18)"
              : "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
            transition:
              "background 0.4s ease-out, backdrop-filter 0.4s ease-out, box-shadow 0.4s ease-out",
          }}
        >
          <a href="#top" className="flex items-center group">
            <Logo size={20} />
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-bone/70">
            <a href="#features" className="nav-link hover:text-bone transition">Product</a>
            <a href="#demo" className="nav-link hover:text-bone transition">Demo</a>
            <a href="#pricing" className="nav-link hover:text-bone transition">Pricing</a>
            <a href="#engine" className="nav-link hover:text-bone transition">Engine</a>
          </nav>
          <div className="flex items-center gap-3">
            <SoundToggle />
            <a href="#demo" className="hidden md:inline-flex text-sm text-bone/70 hover:text-bone">Sign in</a>
            <a
              href="#cta"
              className="magnetic-btn iridescent btn-primary hidden min-[400px]:inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-sm font-medium"
            >
              Start free
              <span aria-hidden data-arrow>→</span>
              <span className="drop-shadow" aria-hidden />
            </a>
            <button
              className="md:hidden w-9 h-9 grid place-items-center rounded-full border border-line"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              <span className="text-lg">{open ? "×" : "☰"}</span>
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-lg md:hidden pt-24 px-8">
          <nav className="flex flex-col gap-6 text-3xl font-display">
            {[["Product", "#features"], ["Demo", "#demo"], ["Pricing", "#pricing"], ["Engine", "#engine"]].map(([l, href]) => (
              <a
                key={l}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-line pb-4"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
