import { useEffect, useRef, useState } from "react";

export function useCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "tv-cursor-dot";
    ring.className = "tv-cursor-ring";
    document.body.append(dot, ring);
    Object.assign(dot.style, {
      position: "fixed", top: "0", left: "0", width: "6px", height: "6px",
      background: "#d4a853", borderRadius: "9999px", pointerEvents: "none",
      zIndex: "9999", transform: "translate(-50%,-50%)", transition: "opacity .2s",
      mixBlendMode: "difference",
    } as CSSStyleDeclaration);
    Object.assign(ring.style, {
      position: "fixed", top: "0", left: "0", width: "36px", height: "36px",
      border: "1px solid rgba(212,168,83,0.6)", borderRadius: "9999px",
      pointerEvents: "none", zIndex: "9998",
      transform: "translate(-50%,-50%)",
      transition: "width .25s, height .25s, background .25s, border-color .25s, opacity .2s",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono, monospace)", fontSize: "10px", color: "#0c0a09",
      letterSpacing: "0.1em",
    } as CSSStyleDeclaration);

    let x = 0, y = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY; dot.style.left = x + "px"; dot.style.top = y + "px"; };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    };
    loop();

    const setLabel = (label: string) => {
      ring.textContent = label;
      if (label) {
        ring.style.width = "56px"; ring.style.height = "56px";
        ring.style.background = "#d4a853"; ring.style.borderColor = "#d4a853";
      } else {
        ring.style.width = "36px"; ring.style.height = "36px";
        ring.style.background = "transparent"; ring.style.borderColor = "rgba(212,168,83,0.6)";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(t?.dataset.cursor ?? "");
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      dot.remove(); ring.remove();
    };
  }, []);
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(12,10,9,0.65)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
          borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 group" data-cursor="">
            <span className="relative w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-soft shadow-[0_0_20px_rgba(212,168,83,0.5)]" />
            <span className="font-display text-lg tracking-tight">Translive<span className="text-gold">.</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-bone/70">
            <a href="#features" className="hover:text-bone transition">Product</a>
            <a href="#demo" className="hover:text-bone transition">Demo</a>
            <a href="#pricing" className="hover:text-bone transition">Pricing</a>
            <a href="#engine" className="hover:text-bone transition">Engine</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#demo" className="hidden md:inline-flex text-sm text-bone/70 hover:text-bone">Sign in</a>
            <a
              href="#cta"
              data-cursor="START"
              className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-gold px-4 md:px-5 py-2 md:py-2.5 text-sm font-medium text-ink shadow-[0_0_30px_rgba(212,168,83,0.35)] hover:shadow-[0_0_50px_rgba(212,168,83,0.55)] transition-shadow"
            >
              Start free
              <span aria-hidden>→</span>
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
            {["Product", "Demo", "Pricing", "Engine"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
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
