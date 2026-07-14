/* Subtle UI sound — Web Audio, fully synthesized (no assets).
   Off by default; toggled from the nav. Everything is created lazily on
   the first enable (a user gesture), so autoplay policy is satisfied. */

let ctx = null;
let master = null;
let hum = null;
let enabled = false;
let listenersAttached = false;

function ensureContext() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain();
  master.gain.value = 0.05;
  master.connect(ctx.destination);
}

function blip(freq, dur = 0.07, gain = 0.5, type = "sine") {
  if (!enabled || !ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.connect(g).connect(master);
  o.start();
  o.stop(ctx.currentTime + dur + 0.02);
}

function startHum() {
  if (hum || !ctx) return;
  const g = ctx.createGain();
  g.gain.value = 0.0;
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  o1.type = "sine";
  o2.type = "sine";
  o1.frequency.value = 55;
  o2.frequency.value = 55.7; // slow beat between the two
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.04;
  lfo.connect(lfoGain).connect(g.gain);
  o1.connect(g);
  o2.connect(g);
  g.connect(master);
  o1.start();
  o2.start();
  lfo.start();
  g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
  hum = { g, stop: () => [o1, o2, lfo].forEach((o) => o.stop()) };
}

function stopHum() {
  if (!hum || !ctx) return;
  const h = hum;
  hum = null;
  h.g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  setTimeout(() => h.stop(), 700);
}

function attachListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  document.addEventListener(
    "pointerenter",
    (e) => {
      if (!enabled) return;
      if (e.target?.closest?.("a, button")) blip(880, 0.05, 0.25);
    },
    { capture: true, passive: true },
  );
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (!enabled) return;
      if (e.target?.closest?.("a, button")) blip(520, 0.09, 0.4, "triangle");
    },
    { capture: true, passive: true },
  );
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(on) {
  enabled = on;
  try {
    localStorage.setItem("tv-sound", on ? "1" : "0");
  } catch {
    /* private mode */
  }
  if (on) {
    ensureContext();
    if (ctx.state === "suspended") ctx.resume();
    attachListeners();
    startHum();
    blip(880, 0.08, 0.4);
  } else {
    stopHum();
  }
}
