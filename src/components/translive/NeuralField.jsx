import { useEffect, useRef } from "react";
import { prefersReduced } from "./motion";

/* AI neural field — floating nodes, connecting synapses, drifting
   multilingual glyphs, gentle cursor attraction. Canvas 2D, zero deps.
   Pauses off-screen, caps DPR at 1.5, thins out on mobile. */

const GLYPHS = ["あ", "అ", "한", "अ", "A", "و", "文", "я"];

export function NeuralField({ density = 60 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReduced()) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;

    const N = window.innerWidth < 768 ? 26 : density;
    const LINK = 110;
    const mouse = { x: -9999, y: -9999 };

    const pts = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 1 + Math.random() * 1.8,
      glyph: Math.random() < 0.12 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : null,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const b = canvas.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = b.width;
      h = b.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const step = (t) => {
      raf = requestAnimationFrame(step);
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        // gentle cursor attraction
        const dx = mouse.x - p.x * w;
        const dy = mouse.y - p.y * h;
        if (dx * dx + dy * dy < 160 * 160) {
          p.x += (dx / w) * 0.0025;
          p.y += (dy / h) * 0.0025;
        }
      }

      // synapse lines
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const o = (1 - Math.sqrt(d2) / LINK) * 0.16;
            ctx.strokeStyle = `rgba(110,231,255,${o})`;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      // nodes + drifting glyphs, breathing
      for (const p of pts) {
        const X = p.x * w;
        const Y = p.y * h;
        const breathe = 0.6 + 0.4 * Math.sin(t * 0.001 + p.phase);
        if (p.glyph) {
          ctx.fillStyle = `rgba(139,92,246,${0.3 * breathe})`;
          ctx.font = "13px 'JetBrains Mono', monospace";
          ctx.fillText(p.glyph, X, Y);
        } else {
          ctx.fillStyle = `rgba(110,231,255,${0.5 * breathe})`;
          ctx.beginPath();
          ctx.arc(X, Y, p.r, 0, 7);
          ctx.fill();
        }
      }
    };
    raf = requestAnimationFrame(step);

    // don't burn GPU while scrolled past
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
