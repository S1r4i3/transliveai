const TIERS = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    tag: "Try the engine",
    features: ["60 min/month", "12 languages", "Lip-sync (720p)", "Watermarked exports", "Community support"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    tag: "For creators",
    features: ["1,200 min/month", "42 languages", "Lip-sync (4K)", "Voice cloning · 3 voices", "Vocal remover", "Priority queue"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tag: "Studios & platforms",
    features: ["Unlimited minutes", "42 languages + custom", "API access · webhooks", "Unlimited voice clones", "SSO & audit logs", "SLA 99.95%"],
    cta: "Talk to sales",
  },
];

const MATRIX = [
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
  return (
    <section id="pricing" className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ 06 — Pricing</div>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
          Three tiers. <span className="gold-text">Zero dubbing studios.</span>
        </h2>

        <div
          data-reveal-stagger
          className="mt-16 grid gap-5 md:gap-6 items-stretch max-w-xl mx-auto lg:max-w-none lg:mx-0 lg:grid-cols-3"
        >
          {TIERS.map((t) => (
            <div
              key={t.name}
              data-tilt
              className={
                t.highlight
                  ? "glass-diamond gradient-border-anim relative p-8 lg:-mt-5 lg:mb-[-4px] shadow-[0_0_80px_rgba(79,139,255,0.2)]"
                  : "glass-panel lift-card relative p-8"
              }
            >
              {t.highlight && (
                <>
                  <span className="sweep-layer" aria-hidden />
                  <div className="glass-bar floaty absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 font-mono text-[10px] tracking-widest uppercase text-gold whitespace-nowrap">
                    Most popular
                  </div>
                </>
              )}
              <div className="font-mono text-[10px] tracking-widest uppercase text-stone">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={`font-display text-4xl md:text-5xl tracking-tight ${t.highlight ? "gold-text" : "text-bone"}`}>
                  {t.price}
                </span>
                <span className="text-bone/50 text-sm">{t.period}</span>
              </div>
              <div className="mt-1.5 font-mono text-[10px] tracking-widest uppercase text-gold">{t.tag}</div>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-bone/80">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`magnetic-btn iridescent ${t.highlight ? "btn-primary" : ""} mt-8 inline-flex w-full justify-center items-center gap-2 px-6 py-3 text-sm font-medium`}
              >
                {t.cta} <span aria-hidden data-arrow>→</span>
                <span className="drop-shadow" aria-hidden />
              </button>
            </div>
          ))}
        </div>

        {/* Datasheet comparison — scrolls horizontally on small screens */}
        <div className="mt-16 rounded-2xl border border-line overflow-x-auto font-mono text-sm">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-4 bg-ink/80 border-b border-line">
              <div className="p-4 text-stone text-[10px] tracking-widest uppercase">Feature</div>
              {TIERS.map((t) => (
                <div key={t.name} className="p-4 text-[10px] tracking-widest uppercase text-stone">
                  {t.name}
                </div>
              ))}
            </div>
            <div data-stagger-rows>
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
            <a className="glass-panel lift-card block p-6" href="#">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">API Docs</div>
                  <div className="text-xs text-bone/50 mt-1">REST + gRPC · streaming</div>
                </div>
                <span className="text-gold" aria-hidden>→</span>
              </div>
            </a>
            <a className="glass-panel lift-card block p-6" href="#">
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
