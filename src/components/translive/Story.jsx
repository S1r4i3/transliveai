/* New story sections — TrustedBy, HowItWorks, VoiceClone, FAQ.
   All placeholder content, clearly replaceable. */

const COMPANIES = ["NOVA MEDIA", "KINARI", "LOOPWELL", "VERBATIM+", "ORBITAL", "MINT STUDIOS", "RINCÓN", "ECHOFRAME"];

export function TrustedBy() {
  return (
    <section className="relative py-14 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-8">
          Trusted by teams shipping in every language
        </div>
        <div data-reveal-stagger className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {COMPANIES.map((c) => (
            <span
              key={c}
              className="font-display text-sm md:text-base tracking-[0.2em] text-bone/40 hover:text-bone/80 transition-colors"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Upload once",
    body: "Drop in any video or audio. Translive extracts speech, speakers, and timing automatically.",
  },
  {
    n: "02",
    title: "AI understands",
    body: "Context-aware translation preserves idioms, names, and tone across all 42 languages.",
  },
  {
    n: "03",
    title: "Your voice returns",
    body: "Zero-shot cloning re-voices every line — same breath, same pauses, new language.",
  },
  {
    n: "04",
    title: "Ship everywhere",
    body: "Lip-synced video, captions, and stems export in one click or stream via API.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ How it works</div>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
          Four steps. <span className="gold-text">Zero friction.</span>
        </h2>
        <div data-reveal-stagger className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div key={s.n} data-tilt className="glass-panel relative p-7">
              <div className="font-display text-4xl gold-text">{s.n}</div>
              <h3 className="mt-4 font-display text-xl tracking-tight text-bone">{s.title}</h3>
              <p className="mt-2.5 text-sm text-bone/60 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VoiceClone() {
  return (
    <section id="voice" className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ Voice cloning</div>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">
            Thirty seconds of you. <span className="gold-text">Forever in 42 tongues.</span>
          </h2>
          <p className="mt-6 text-bone/60 leading-relaxed max-w-md">
            Translive builds a voiceprint from a short sample — cadence, breath, warmth — and
            speaks every translation with it. 98.2% similarity, measured blind.
          </p>
        </div>
        <div className="glass-ripple p-7">
          <span className="sweep-layer" aria-hidden />
          <div className="font-mono text-[10px] tracking-widest uppercase text-stone mb-3">Source voice — English</div>
          <div className="flex items-end gap-0.5 h-12" aria-hidden>
            {Array.from({ length: 52 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-bone/30"
                style={{ height: `${18 + Math.abs(Math.sin(i * 0.42)) * 82}%`, animation: `waveform ${0.8 + (i % 5) * 0.16}s ease-in-out infinite`, animationDelay: `${i * 0.02}s`, transformOrigin: "bottom" }}
              />
            ))}
          </div>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="font-mono text-[10px] tracking-widest uppercase gold-text">voiceprint → हिन्दी</span>
            <div className="h-px flex-1 bg-line" />
          </div>
          <div className="flex items-end gap-0.5 h-12" aria-hidden>
            {Array.from({ length: 52 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-gold to-gold-soft"
                style={{ height: `${18 + Math.abs(Math.cos(i * 0.38)) * 82}%`, animation: `waveform ${0.7 + (i % 6) * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.025}s`, transformOrigin: "bottom", boxShadow: "0 0 8px rgba(79,139,255,0.5)" }}
              />
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-stone">
            <span>Similarity</span>
            <span className="gold-text">98.2%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  ["How accurate are the translations?", "Context-aware neural MT tuned on dubbed media. Idioms, names, and technical terms survive the trip — and you can edit any line before export."],
  ["Does it really sound like me?", "Yes. A 30-second sample builds your voiceprint; blind tests measure 98.2% similarity against the source speaker across languages."],
  ["Which languages are supported?", "42 languages with native cadence — from Telugu and Tamil to Japanese, Arabic, and Portuguese. Custom languages available on Enterprise."],
  ["How long does a video take?", "About 0.4 seconds of processing per minute of video. A 10-minute video in five languages is typically ready before your coffee."],
  ["Who owns the translated content?", "You do — outputs, voiceprints, everything. Voice data is encrypted and never used to train shared models."],
  ["Is there an API?", "REST and gRPC with streaming, webhooks, and a 99.95% SLA on Enterprise. Docs live under Engine."],
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[900px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ FAQ</div>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight">
          Asked, <span className="gold-text">answered.</span>
        </h2>
        <div data-reveal-stagger className="mt-12 space-y-3">
          {FAQS.map(([q, a]) => (
            <details key={q} className="faq-item glass-panel group px-6 py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-base md:text-lg text-bone">
                {q}
                <span className="faq-chev text-gold transition-transform duration-300 group-open:rotate-45 text-xl leading-none" aria-hidden>
                  +
                </span>
              </summary>
              <p className="pb-5 text-sm md:text-base text-bone/60 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
