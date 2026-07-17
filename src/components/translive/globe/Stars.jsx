import { useEffect, useRef } from "react";

/* Stars — a full-hero starfield. Drawn once to a canvas (zero per-frame
   cost); a second sparse layer twinkles via a CSS opacity animation,
   which prefers-reduced-motion disables globally. */

function drawStars(canvas, count, seed) {
  const ctx = canvas.getContext("2d");
  const b = canvas.getBoundingClientRect();
  const dpr = Math.min(1.5, window.devicePixelRatio || 1);
  canvas.width = b.width * dpr;
  canvas.height = b.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, b.width, b.height);
  // deterministic LCG so layout is stable across redraws
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < count; i++) {
    const x = rnd() * b.width;
    const y = rnd() * b.height;
    const r = 0.4 + rnd() * 1.1;
    const cyan = rnd() < 0.18;
    ctx.globalAlpha = 0.25 + rnd() * 0.6;
    ctx.fillStyle = cyan ? "#8be9ff" : "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 7);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function Stars() {
  const baseRef = useRef(null);
  const twinkleRef = useRef(null);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const render = () => {
      if (baseRef.current) drawStars(baseRef.current, mobile ? 70 : 130, 7);
      if (twinkleRef.current) drawStars(twinkleRef.current, mobile ? 18 : 34, 99);
    };
    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <canvas ref={baseRef} className="absolute inset-0 w-full h-full" />
      <canvas ref={twinkleRef} className="absolute inset-0 w-full h-full star-twinkle" />
    </div>
  );
}
