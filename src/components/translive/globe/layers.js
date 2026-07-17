/* Composable scene layers for the hero globe.
   globe.gl is imperative (not R3F), so each "component" is a function that
   attaches a layer to the world/scene and returns a dispose() that frees
   every GPU resource it created. */

/* ------------------------------------------------------------------ */
/* Language nodes — the 11 supported hero languages, at real locations */
/* ------------------------------------------------------------------ */
export const LANG_NODES = [
  { lat: 51.5, lng: -0.1, name: "English" },
  { lat: 28.6, lng: 77.2, name: "हिन्दी" },
  { lat: 17.4, lng: 78.5, name: "తెలుగు" },
  { lat: 13.1, lng: 80.3, name: "தமிழ்" },
  { lat: 24.7, lng: 46.7, name: "العربية" },
  { lat: 35.7, lng: 139.7, name: "日本語" },
  { lat: 39.9, lng: 116.4, name: "中文" },
  { lat: 48.9, lng: 2.3, name: "Français" },
  { lat: 40.4, lng: -3.7, name: "Español" },
  { lat: 52.5, lng: 13.4, name: "Deutsch" },
  { lat: 37.6, lng: 127, name: "한국어" },
];

/* ------------------------------------------------------------------ */
/* TranslationArcs — animated energy lines + moving dash "particles",  */
/* pulsing destination rings, and floating language labels.            */
/* ------------------------------------------------------------------ */
export function makeArcs(count) {
  const arcs = [];
  for (let i = 0; i < count; i++) {
    const a = LANG_NODES[(Math.random() * LANG_NODES.length) | 0];
    let b = LANG_NODES[(Math.random() * LANG_NODES.length) | 0];
    if (b === a) b = LANG_NODES[(LANG_NODES.indexOf(a) + 5) % LANG_NODES.length];
    arcs.push({
      startLat: a.lat, startLng: a.lng,
      endLat: b.lat, endLng: b.lng,
      time: 1600 + Math.random() * 2600, // per-arc particle travel speed
    });
  }
  return arcs;
}

export function applyTranslationArcs(world, { mobile, reduce }) {
  world
    // energy lines with traveling glow segments (animated dashes)
    .arcsData(reduce ? [] : makeArcs(mobile ? 5 : 10))
    .arcColor(() => ["#00d4ff", "#8b5cf6"])
    .arcStroke(0.45)
    .arcAltitudeAutoScale(0.4)
    .arcDashLength(0.45)
    .arcDashGap(1.3)
    .arcDashAnimateTime((d) => d.time)
    // floating native-language labels with dot anchors
    .labelsData(LANG_NODES)
    .labelText("name")
    .labelSize(1.7)
    .labelDotRadius(0.55)
    .labelColor(() => "#6ee7ff")
    .labelAltitude(0.015)
    // pulsing destination points
    .ringsData(reduce ? [] : LANG_NODES)
    .ringColor(() => (t) => `rgba(0, 212, 255, ${Math.max(0, 1 - t) * 0.55})`)
    .ringMaxRadius(3.2)
    .ringPropagationSpeed(2.4)
    .ringRepeatPeriod(1600);
}

/* ------------------------------------------------------------------ */
/* CloudLayer — the rotating cloud sphere from the reference example   */
/* ------------------------------------------------------------------ */
const CLOUDS_IMG =
  "https://cdn.jsdelivr.net/gh/vasturiano/globe.gl/example/clouds/clouds.png";

export function addCloudLayer(THREE, world, registerTick) {
  let mesh = null;
  let tex = null;
  new THREE.TextureLoader().load(
    CLOUDS_IMG,
    (cloudsTexture) => {
      tex = cloudsTexture;
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(world.getGlobeRadius() * 1.006, 64, 64),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true, opacity: 0.85 }),
      );
      world.scene().add(mesh);
      // -0.006 deg/frame, same speed as the reference implementation
      registerTick(() => {
        mesh.rotation.y += (-0.006 * Math.PI) / 180;
      });
    },
    undefined,
    () => {}, // clouds are decorative — ignore load failure
  );
  return () => {
    if (mesh) {
      world.scene()?.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    tex?.dispose();
  };
}

/* ------------------------------------------------------------------ */
/* NetworkParticles — an "AI field" of additive-blended points drifting */
/* in a shell around the planet. Additive blending gives the soft-bloom */
/* holographic glow without a postprocessing pass (which would force an */
/* opaque canvas and break the transparent blend with the page nebula). */
/* ------------------------------------------------------------------ */
export function addNetworkParticles(THREE, world, registerTick, { mobile }) {
  const N = mobile ? 120 : 300;
  const R = world.getGlobeRadius();
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const palette = [
    [0.31, 0.55, 1.0], // #4F8BFF
    [0.0, 0.83, 1.0], // #00D4FF
    [0.55, 0.36, 0.96], // #8B5CF6
  ];
  for (let i = 0; i < N; i++) {
    // random point on a shell between 1.25R and 1.95R
    const r = R * (1.25 + Math.random() * 0.7);
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
    positions[i * 3 + 1] = r * Math.cos(ph);
    positions[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    const c = palette[(Math.random() * palette.length) | 0];
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  world.scene().add(points);
  registerTick(() => {
    points.rotation.y += 0.0004;
    points.rotation.x += 0.00012;
  });
  return () => {
    world.scene()?.remove(points);
    geo.dispose();
    mat.dispose();
  };
}
