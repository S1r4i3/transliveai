import { useEffect, useRef } from "react";
import { prefersReduced } from "./motion";

/* Glowing Earth — hand-rolled 3D on Canvas 2D.
   Graticule point-sphere, glowing city nodes, great-circle AI energy arcs
   traveling between cities, and orbiting language nodes. Camera slowly
   rotates; mouse steers it. Pauses off-screen. Zero dependencies. */

const CITIES = [
  [40.7, -74], [34, -118], [19.4, -99.1], [-23.5, -46.6], [4.7, -74.1],
  [51.5, 0], [48.9, 2.3], [52.5, 13.4], [40.4, -3.7], [41.9, 12.5],
  [55.8, 37.6], [30, 31.2], [6.5, 3.4], [-1.3, 36.8], [-26.2, 28],
  [25.2, 55.3], [19.1, 72.9], [28.6, 77.2], [17.4, 78.5], [13.1, 80.3],
  [1.35, 103.8], [-6.2, 106.8], [35.7, 139.7], [37.6, 127], [39.9, 116.4],
  [-33.9, 151.2],
];

const LANGS = ["EN", "हिन्दी", "日本語", "한국어", "Español", "Français", "العربية", "தமிழ்", "తెలుగు", "中文"];

const RINGS = [
  { r: 1.45, tilt: 1.05, speed: 0.16, count: 5 },
  { r: 1.68, tilt: -0.8, speed: -0.11, count: 5 },
];

function ll2xyz(lat, lon) {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return { x: Math.cos(la) * Math.cos(lo), y: -Math.sin(la), z: Math.cos(la) * Math.sin(lo) };
}
const rotY = (p, a) => ({
  x: p.x * Math.cos(a) + p.z * Math.sin(a),
  y: p.y,
  z: -p.x * Math.sin(a) + p.z * Math.cos(a),
});
const rotX = (p, a) => ({
  x: p.x,
  y: p.y * Math.cos(a) - p.z * Math.sin(a),
  z: p.y * Math.sin(a) + p.z * Math.cos(a),
});
const slerp = (a, b, t) => {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const th = Math.acos(dot) || 0.0001;
  const s = Math.sin(th);
  const ka = Math.sin((1 - t) * th) / s;
  const kb = Math.sin(t * th) / s;
  return { x: a.x * ka + b.x * kb, y: a.y * ka + b.y * kb, z: a.z * ka + b.z * kb };
};

function glowSprite(color, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.3, color);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

function labelSprite(text) {
  const c = document.createElement("canvas");
  const g = c.getContext("2d");
  const font = "600 26px Inter, 'Noto Sans', system-ui, sans-serif";
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + 44;
  c.width = w;
  c.height = 56;
  g.font = font;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = "rgba(79,139,255,0.95)";
  g.shadowBlur = 18;
  g.fillStyle = "#dbeafe";
  g.fillText(text, w / 2, 28);
  g.shadowBlur = 0;
  g.fillStyle = "#ffffff";
  g.fillText(text, w / 2, 28);
  return c;
}

export function EarthScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = prefersReduced();
    const mobile = window.innerWidth < 768;

    /* graticule: latitude circles + meridians as dim points */
    const grid = [];
    const latStep = mobile ? 30 : 20;
    const sample = mobile ? 18 : 14;
    for (let lat = -60; lat <= 60; lat += latStep)
      for (let lon = 0; lon < 360; lon += 360 / (mobile ? 22 : 34))
        grid.push(ll2xyz(lat, lon - 180));
    for (let lon = 0; lon < 360; lon += latStep)
      for (let lat = -80; lat <= 80; lat += 180 / sample)
        grid.push(ll2xyz(lat, lon - 180));

    const cities = CITIES.map(([la, lo]) => ll2xyz(la, lo));
    const citySprite = glowSprite("#6ee7ff");
    const gridSprite = glowSprite("#4f8bff");
    const arcSprite = glowSprite("#00d4ff");
    const labels = [];
    let li = 0;
    RINGS.forEach((ring, ri) => {
      for (let k = 0; k < ring.count; k++) {
        labels.push({
          ring: ri,
          theta: (k / ring.count) * Math.PI * 2 + ri * 0.6,
          sprite: labelSprite(LANGS[li++ % LANGS.length]),
        });
      }
    });

    let w = 0, h = 0, R = 0;
    const resize = () => {
      const b = canvas.getBoundingClientRect();
      const dpr = Math.min(1.75, window.devicePixelRatio || 1);
      w = b.width;
      h = b.height;
      R = w * 0.235;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!mobile) window.addEventListener("pointermove", onMove, { passive: true });

    const F = 3.6;
    let yaw = 0, pitch = 0.32;
    let arcs = [];
    let arcTimer = 0;
    let last = 0, raf = 0, running = true;

    const toScene = (p) => rotX(rotY(p, yaw), pitch);
    const project = (p) => {
      const s = F / (F - p.z);
      return { x: w / 2 + p.x * s * R, y: h / 2 + p.y * s * R, s, z: p.z };
    };
    const labelPos3 = (lb, t) => {
      const ring = RINGS[lb.ring];
      const a = lb.theta + t * ring.speed;
      return rotX({ x: Math.cos(a) * ring.r, y: 0, z: Math.sin(a) * ring.r }, ring.tilt);
    };

    const render = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      const T = t / 1000;
      yaw += (0.07 + mouse.x * 0.1) * dt;
      pitch += (0.32 + mouse.y * 0.3 - pitch) * 0.04;
      ctx.clearRect(0, 0, w, h);

      /* atmosphere */
      const atm = ctx.createRadialGradient(w / 2, h / 2, R * 0.75, w / 2, h / 2, R * 1.5);
      atm.addColorStop(0, "rgba(79,139,255,0.16)");
      atm.addColorStop(0.55, "rgba(79,139,255,0.06)");
      atm.addColorStop(1, "rgba(79,139,255,0)");
      ctx.fillStyle = atm;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, R * 1.5, 0, 7);
      ctx.fill();

      /* planet body */
      const body = ctx.createRadialGradient(w / 2 - R * 0.3, h / 2 - R * 0.3, R * 0.1, w / 2, h / 2, R);
      body.addColorStop(0, "rgba(30,52,110,0.85)");
      body.addColorStop(0.7, "rgba(10,17,40,0.9)");
      body.addColorStop(1, "rgba(5,8,22,0.95)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, R, 0, 7);
      ctx.fill();
      // rim light
      ctx.strokeStyle = "rgba(110,231,255,0.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, R, 0, 7);
      ctx.stroke();

      /* spawn arcs */
      arcTimer += dt;
      const maxArcs = mobile ? 2 : 4;
      if (arcTimer > 0.9 && arcs.length < maxArcs) {
        arcTimer = 0;
        const a = (Math.random() * cities.length) | 0;
        let b = (Math.random() * cities.length) | 0;
        if (b === a) b = (b + 7) % cities.length;
        arcs.push({ a: cities[a], b: cities[b], t: 0 });
      }
      arcs = arcs.filter((k) => k.t < 1);

      /* drawables */
      const items = [];
      for (const p of grid) {
        const q = toScene(p);
        items.push({ z: q.z, kind: 0, pr: project(q) });
      }
      for (const p of cities) {
        const q = toScene(p);
        items.push({ z: q.z, kind: 1, pr: project(q), tw: p.x * 7 });
      }
      labels.forEach((lb) => {
        const q = toScene(labelPos3(lb, T));
        items.push({ z: q.z, kind: 2, pr: project(q), lb });
      });
      // arc trail points
      for (const arc of arcs) {
        arc.t += dt / 2.1;
        const head = Math.min(1, arc.t * 1.12);
        for (let s = 0; s < 16; s++) {
          const k = head - s * 0.022;
          if (k < 0) break;
          const base = slerp(arc.a, arc.b, k);
          const lift = 1 + 0.3 * Math.sin(Math.PI * k);
          const q = toScene({ x: base.x * lift, y: base.y * lift, z: base.z * lift });
          items.push({
            z: q.z,
            kind: 3,
            pr: project(q),
            a: (1 - s / 16) * Math.sin(Math.min(1, arc.t) * Math.PI),
            head: s === 0,
          });
        }
      }
      items.sort((a, b) => a.z - b.z);

      for (const it of items) {
        const { pr } = it;
        const front = (it.z + 1) / 2;
        if (it.kind === 0) {
          if (it.z < -0.15) continue; // back hemisphere culled softly
          ctx.globalAlpha = 0.1 + front * 0.22;
          const s = 2.6 * pr.s;
          ctx.drawImage(gridSprite, pr.x - s / 2, pr.y - s / 2, s, s);
        } else if (it.kind === 1) {
          if (it.z < -0.05) continue;
          const tw = 0.6 + 0.4 * Math.sin(T * 2 + it.tw);
          ctx.globalAlpha = (0.35 + front * 0.65) * tw;
          const s = 7 * pr.s;
          ctx.drawImage(citySprite, pr.x - s / 2, pr.y - s / 2, s, s);
        } else if (it.kind === 2) {
          const a = Math.max(0.15, Math.min(0.95, (it.z + 1.8) / 2.7));
          const sw = it.lb.sprite.width * 0.48 * pr.s;
          const sh = it.lb.sprite.height * 0.48 * pr.s;
          ctx.globalAlpha = a;
          ctx.drawImage(it.lb.sprite, pr.x - sw / 2, pr.y - sh / 2, sw, sh);
        } else {
          if (it.z < -0.2) continue;
          ctx.globalAlpha = it.a * 0.85;
          const s = (it.head ? 15 : 9) * pr.s;
          ctx.drawImage(arcSprite, pr.x - s / 2, pr.y - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    if (reduce) {
      render(16);
      return () => window.removeEventListener("resize", resize);
    }

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (running) render(t);
    };
    raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      if (!mobile) window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[600px] mx-auto aspect-square">
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full" />
      {/* soft under-glow */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          bottom: "4%",
          width: "50%",
          height: "7%",
          background: "radial-gradient(ellipse, rgba(79,139,255,0.3), transparent 70%)",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}
