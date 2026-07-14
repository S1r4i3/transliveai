import { useEffect, useRef, useState } from "react";
import { prefersReduced } from "./motion";

/* Real photographic Earth — globe.gl (Three.js) loaded at runtime from CDN,
   based on https://globe.gl/example/clouds/ :
   Blue-Marble texture + topology bump + drifting cloud layer + atmosphere,
   plus animated AI translation arcs and native-language labels.
   Pinning three via ?deps guarantees globe.gl and our clouds mesh share the
   exact same three instance. Falls back to the canvas EarthScene offline. */

const THREE_URL = "https://esm.sh/three@0.170.0";
const GLOBE_URL = "https://esm.sh/globe.gl@2.34.4?deps=three@0.170.0";
const EARTH_IMG = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_IMG = "https://unpkg.com/three-globe/example/img/earth-topology.png";
const CLOUDS_IMG = "https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/clouds/clouds.png";

const NODES = [
  { lat: 51.5, lng: 0, name: "English" },
  { lat: 28.6, lng: 77.2, name: "हिन्दी" },
  { lat: 17.4, lng: 78.5, name: "తెలుగు" },
  { lat: 13.1, lng: 80.3, name: "தமிழ்" },
  { lat: 35.7, lng: 139.7, name: "日本語" },
  { lat: 37.6, lng: 127, name: "한국어" },
  { lat: 40.4, lng: -3.7, name: "Español" },
  { lat: 48.9, lng: 2.3, name: "Français" },
  { lat: 24.7, lng: 46.7, name: "العربية" },
  { lat: 52.5, lng: 13.4, name: "Deutsch" },
  { lat: -23.5, lng: -46.6, name: "Português" },
  { lat: 39.9, lng: 116.4, name: "中文" },
];

function makeArcs() {
  const arcs = [];
  for (let i = 0; i < 10; i++) {
    const a = NODES[(Math.random() * NODES.length) | 0];
    let b = NODES[(Math.random() * NODES.length) | 0];
    if (b === a) b = NODES[(NODES.indexOf(a) + 5) % NODES.length];
    arcs.push({
      startLat: a.lat, startLng: a.lng,
      endLat: b.lat, endLng: b.lng,
      time: 1600 + Math.random() * 2600,
    });
  }
  return arcs;
}

export function RealEarth() {
  const holderRef = useRef(null);
  const [Fallback, setFallback] = useState(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    let disposed = false;
    let world = null;
    let io = null;
    let cleanupResize = null;

    (async () => {
      try {
        const [THREE, GlobeMod] = await Promise.all([
          import(/* @vite-ignore */ THREE_URL),
          import(/* @vite-ignore */ GLOBE_URL),
        ]);
        if (disposed) return;
        const Globe = GlobeMod.default;
        const reduce = prefersReduced();
        const size = holder.clientWidth;

        world = Globe({ animateIn: !reduce })(holder)
          .backgroundColor("rgba(0,0,0,0)")
          .globeImageUrl(EARTH_IMG)
          .bumpImageUrl(BUMP_IMG)
          .showAtmosphere(true)
          .atmosphereColor("#4f8bff")
          .atmosphereAltitude(0.18)
          .arcsData(reduce ? [] : makeArcs())
          .arcColor(() => ["#00d4ff", "#8b5cf6"])
          .arcStroke(0.45)
          .arcAltitudeAutoScale(0.4)
          .arcDashLength(0.45)
          .arcDashGap(1.3)
          .arcDashAnimateTime((d) => d.time)
          .labelsData(NODES)
          .labelText("name")
          .labelSize(1.7)
          .labelDotRadius(0.55)
          .labelColor(() => "#6ee7ff")
          .labelAltitude(0.015)
          .width(size)
          .height(size);

        world.pointOfView({ lat: 18, lng: 64, altitude: 2.1 });

        const controls = world.controls();
        controls.autoRotate = !reduce;
        controls.autoRotateSpeed = 0.55;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableRotate = window.matchMedia("(pointer: fine)").matches;

        /* drifting cloud layer — straight from the globe.gl clouds example */
        new THREE.TextureLoader().load(
          CLOUDS_IMG,
          (cloudsTexture) => {
            if (disposed) return;
            const clouds = new THREE.Mesh(
              new THREE.SphereGeometry(world.getGlobeRadius() * 1.006, 64, 64),
              new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true, opacity: 0.85 }),
            );
            world.scene().add(clouds);
            if (!reduce) {
              const rotateClouds = () => {
                if (disposed) return;
                clouds.rotation.y += (-0.006 * Math.PI) / 180;
                requestAnimationFrame(rotateClouds);
              };
              rotateClouds();
            }
          },
          undefined,
          () => {}, // clouds are optional — ignore load errors
        );

        const onResize = () => {
          const s = holder.clientWidth;
          world.width(s).height(s);
        };
        window.addEventListener("resize", onResize);
        cleanupResize = () => window.removeEventListener("resize", onResize);

        /* stop the render loop while scrolled past */
        io = new IntersectionObserver(([e]) =>
          e.isIntersecting ? world.resumeAnimation() : world.pauseAnimation(),
        );
        io.observe(holder);
      } catch {
        // CDN unreachable — fall back to the dependency-free canvas Earth
        if (!disposed) {
          const m = await import("./EarthScene");
          if (!disposed) setFallback(() => m.EarthScene);
        }
      }
    })();

    return () => {
      disposed = true;
      io?.disconnect();
      cleanupResize?.();
      try {
        world?._destructor?.();
      } catch {
        /* already gone */
      }
      holder.innerHTML = "";
    };
  }, []);

  if (Fallback) return <Fallback />;

  return (
    <div className="relative w-full max-w-[620px] mx-auto aspect-square">
      <div ref={holderRef} className="absolute inset-0 [&_canvas]:!outline-none" />
      {/* soft under-glow */}
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
