import { useState } from "react";
import { Orb } from "./Orb";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    tag: "Try the engine",
    features: ["60 min/month", "12 languages", "Lip-sync (720p)", "Watermarked exports", "Community support"],
    rings: 1,
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    tag: "For creators",
    features: ["1,200 min/month", "42 languages", "Lip-sync (4K)", "Voice cloning · 3 voices", "Vocal remover", "Priority queue"],
    rings: 3,
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tag: "Studios & platforms",
    features: ["Unlimited minutes", "42 languages + custom", "API access · webhooks", "Unlimited voice clones", "SSO & audit logs", "SLA 99.95%"],
    rings: 5,
    cta: "Talk to sales",
  },
];

const MATRIX: [string, string, string, string][] = [
  ["Minutes/month", "60", "1,200", "Unlimited"],
  ["Languages", "12", "42", "42 + custom"],
  ["Max resolution", "720p", "4K", "4K + ProRes"],
  ["Lip-sync AI", "✓", "✓", "✓"],
  ["Voice cloning", "—", "3 voices", "Unlimited"],
  ["Vocal remover", "—", "✓", "✓"],
  ["API access", "—", "—", "✓"],
  ["Support SLA", "Community", "24h", "1h · dedicated"],
];

export function Pricing() {
  const [sel, setSel] = useState(1);
  return (
    <section id="pricing" className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ 06 — Pricing</div>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
          Pick a tier. <span className="gold-text">Watch the orb learn.</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-center">
          <div className="flex items-center justify-center min-h-[360px] md:min-h-[480px]">
            <Orb size={380} intensity={(TIERS[sel].rings as 1 | 2 | 3)} />
          </div>

          <div>
            <div className="flex gap-2 rounded-full border border-line bg-glass p-1 w-fit">
              {TIERS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setSel(i)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    sel === i ? "bg-gold text-ink" : "text-bone/70 hover:text-bone"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div className="mt-8 glass-panel p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl md:text-6xl tracking-tight">{TIERS[sel].price}</span>
                <span className="text-bone/50">{TIERS[sel].period}</span>
              </div>
              <div className="mt-1 font-mono text-xs tracking-widest uppercase text-gold">{TIERS[sel].tag}</div>
              <ul className="mt-6 space-y-3">
                {TIERS[sel].features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-bone/80">
                    <span className="mt-2 w-1 h-1 rounded-full bg-gold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="magnetic-btn mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink shadow-[0_0_30px_rgba(212,168,83,0.4)]" data-cursor="START">
                {TIERS[sel].cta} <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Datasheet comparison */}
        <div className="mt-16 rounded-2xl border border-line overflow-hidden font-mono text-sm">
          <div className="grid grid-cols-4 bg-ink/80 border-b border-line">
            <div className="p-4 text-stone text-[10px] tracking-widest uppercase">Feature</div>
            {TIERS.map((t) => (
              <div key={t.name} className="p-4 text-[10px] tracking-widest uppercase text-stone">
                {t.name}
              </div>
            ))}
          </div>
          {MATRIX.map((row, i) => (
            <div key={i} className={`grid grid-cols-4 ${i % 2 === 0 ? "bg-transparent" : "bg-bone/[0.02]"} border-b border-line last:border-0`}>
              <div className="p-4 text-bone/70">{row[0]}</div>
              <div className="p-4 text-bone/90">{row[1]}</div>
              <div className="p-4 text-gold">{row[2]}</div>
              <div className="p-4 text-bone/90">{row[3]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Engine() {
  return (
    <section id="engine" className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ 07 — Research</div>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
          The <span className="gold-text">Translive Engine</span> — a model card.
        </h2>

        <div className="mt-12 grid md:grid-cols-[1.4fr_1fr] gap-10">
          <div className="glass-panel p-8">
            <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-3">Abstract</div>
            <p className="text-bone/80 leading-relaxed">
              Translive is a four-stage multilingual video pipeline: (i) diarized ASR with speaker embeddings,
              (ii) context-aware neural MT with cultural-idiom preservation, (iii) zero-shot voice cloning trained on
              4.2M hours of dubbed content, and (iv) a diffusion-based lip-sync module conditioned on phoneme durations.
              End-to-end latency is 0.4s per 60s of source video on a single H100.
            </p>

            <div className="mt-8 font-mono text-[10px] tracking-widest uppercase text-gold mb-3">Benchmark — MOS (higher is better)</div>
            <div className="space-y-3">
              {[
                { m: "Translive v2.4", v: 4.61, ours: true },
                { m: "Baseline dub A", v: 3.82 },
                { m: "Baseline dub B", v: 3.55 },
                { m: "Human dub studio", v: 4.72 },
              ].map((r) => (
                <div key={r.m} className="flex items-center gap-4">
                  <div className={`w-40 text-xs ${r.ours ? "text-gold" : "text-bone/70"}`}>{r.m}</div>
                  <div className="flex-1 h-1.5 bg-bone/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${r.ours ? "bg-gradient-to-r from-gold-soft to-gold" : "bg-bone/40"}`}
                      style={{ width: `${(r.v / 5) * 100}%` }}
                    />
                  </div>
                  <div className={`font-mono text-xs w-10 text-right ${r.ours ? "text-gold" : "text-bone/60"}`}>{r.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 font-mono text-[10px] tracking-widest uppercase text-gold mb-3">Cite this engine</div>
            <pre className="rounded-xl border border-line bg-ink/70 p-4 text-xs text-bone/70 overflow-x-auto">
{`@software{translive2026,
  title  = {Translive: end-to-end video translation},
  author = {Translive Research},
  year   = {2026},
  url    = {https://translive.in/engine},
  version= {2.4}
}`}
            </pre>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-6">
              <div className="font-mono text-[10px] tracking-widest uppercase text-stone">Peer review</div>
              <p className="mt-3 font-display text-xl leading-snug text-bone/95">
                "I watched my own video in Korean and understood myself for the first time."
              </p>
              <div className="mt-3 text-xs text-bone/50">— a satisfied creator</div>
            </div>
            <a className="glass-panel block p-6 hover:border-gold/40 transition" href="#">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">API Docs</div>
                  <div className="text-xs text-bone/50 mt-1">REST + gRPC · streaming</div>
                </div>
                <span className="text-gold" aria-hidden>→</span>
              </div>
            </a>
            <a className="glass-panel block p-6 hover:border-gold/40 transition" href="#">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Changelog</div>
                  <div className="text-xs text-bone/50 mt-1">v2.4 — Sept 2026</div>
                </div>
                <span className="text-gold" aria-hidden>→</span>
              </div>
            </a>
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6">
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold">Params</div>
              <div className="mt-2 font-display text-3xl gold-text">14.2B</div>
              <div className="text-xs text-bone/60 mt-1">across 4 heads · 42 language tokenizers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
