import { useEffect, useRef, useState } from "react";
import { prefersReduced } from "../motion";
import { addCloudLayer, addNetworkParticles, applyTranslationArcs } from "./layers";

/* HeroGlobe — the premium interactive Earth, recreating
   https://globe.gl/example/clouds/ natively inside the hero.

   Loading strategy mirrors the official example exactly (verified against
   its source): globe.gl ships as a UMD script from jsDelivr exposing a
   global `Globe` (with three bundled inside), while custom layers import
   THREE from esm.sh — the same mix the reference uses for its clouds mesh.

   Features: Blue-Marble texture + topology bump · rotating cloud layer ·
   atmospheric blue glow · slow auto-rotation · drag with inertial damping ·
   translation arcs with traveling glow · pulsing destination rings ·
   floating language labels · AI network particles · lazy loaded · pauses
   off-screen · DPR-capped · full GPU disposal on unmount. Falls back to
   the dependency-free canvas EarthScene if the CDN is unreachable. */

const GLOBE_UMD = "https://cdn.jsdelivr.net/npm/globe.gl";
const THREE_URL = "https://esm.sh/three";
const EARTH_IMG = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_IMG = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png";

/* Load a UMD script once; resolves when its global is ready. */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded) return resolve();
      existing.addEventListener("load", resolve);
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function HeroGlobe() {
  const holderRef = useRef(null);
  const [Fallback, setFallback] = useState(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    let disposed = false;
    let world = null;
    let io = null;
    let rafId = 0;
    const disposers = [];
    const ticks = [];
    const registerTick = (fn) => ticks.push(fn);

    (async () => {
      try {
        /* ---- engine: UMD global `Globe` + ESM three for custom layers --- */
        const [, THREE] = await Promise.all([
          loadScript(GLOBE_UMD),
          import(/* @vite-ignore */ THREE_URL),
        ]);
        if (disposed) return;
        const Globe = window.Globe;
        if (!Globe) throw new Error("globe.gl global missing");

        const reduce = prefersReduced();
        const mobile = window.innerWidth < 768;
        const size = holder.clientWidth;

        /* ---- planet (constructor form, as in the current example) ------- */
        world = new Globe(holder, { animateIn: !reduce })
          .backgroundColor("rgba(0,0,0,0)") // page nebula shows through
          .globeImageUrl(EARTH_IMG)
          .bumpImageUrl(BUMP_IMG)
          .showAtmosphere(true) // Atmosphere: holographic blue rim
          .atmosphereColor("#4f8bff")
          .atmosphereAltitude(0.18)
          .width(size)
          .height(size);

        /* ---- TranslationArcs layer (arcs, rings, labels) ---------------- */
        applyTranslationArcs(world, { mobile, reduce });

        world.pointOfView({ lat: 18, lng: 64, altitude: 2.1 });

        /* ---- interaction: slow auto-rotate, eased drag, no scroll traps - */
        const controls = world.controls();
        controls.autoRotate = !reduce;
        controls.autoRotateSpeed = 0.55;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableDamping = true; // smooth easing / inertia
        controls.dampingFactor = 0.08;
        controls.enableRotate = window.matchMedia("(pointer: fine)").matches;

        /* ---- 60fps budget: cap device pixel ratio ----------------------- */
        world
          .renderer()
          .setPixelRatio(Math.min(mobile ? 1.5 : 1.75, window.devicePixelRatio || 1));

        /* ---- custom layers (each returns a GPU disposer) ----------------- */
        disposers.push(addCloudLayer(THREE, world, registerTick));
        if (!reduce)
          disposers.push(addNetworkParticles(THREE, world, registerTick, { mobile }));

        /* one shared ticker drives all custom layer motion */
        if (!reduce) {
          const tick = () => {
            if (disposed) return;
            for (const fn of ticks) fn();
            rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
        }

        /* ---- responsive scaling ------------------------------------------ */
        const onResize = () => {
          const s = holder.clientWidth;
          world.width(s).height(s);
        };
        window.addEventListener("resize", onResize);
        disposers.push(() => window.removeEventListener("resize", onResize));

        /* ---- pause the whole render loop while scrolled past ------------- */
        io = new IntersectionObserver(([e]) =>
          e.isIntersecting ? world.resumeAnimation() : world.pauseAnimation(),
        );
        io.observe(holder);
      } catch (err) {
        /* CDN unreachable — swap in the zero-dependency canvas Earth */
        console.warn("[HeroGlobe] falling back to canvas Earth:", err);
        if (!disposed) {
          const m = await import("../EarthScene");
          if (!disposed) setFallback(() => m.EarthScene);
        }
      }
    })();

    /* ---- teardown: free every GPU resource ------------------------------ */
    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io?.disconnect();
      disposers.forEach((d) => {
        try {
          d();
        } catch {
          /* layer already gone */
        }
      });
      try {
        world?._destructor?.(); // disposes globe.gl internals + renderer
      } catch {
        /* already destroyed */
      }
      holder.innerHTML = "";
    };
  }, []);

  if (Fallback) return <Fallback />;

  return (
    <div className="relative w-full max-w-[620px] mx-auto aspect-square">
      <div ref={holderRef} className="absolute inset-0 [&_canvas]:!outline-none" />
      {/* cinematic under-glow grounding the planet */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%] pointer-events-none"
        style={{
          bottom: "3%",
          width: "52%",
          height: "7%",
          background: "radial-gradient(ellipse, rgba(79,139,255,0.3), transparent 70%)",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}
