const FEATURES = [
  {
    icon: "▶",
    title: "Video Translation",
    body: "Upload once, publish in 42 languages. Frame-accurate re-voicing with native cadence.",
  },
  {
    icon: "♫",
    title: "Audio Translation",
    body: "Podcasts, ads, audiobooks — translated with your tone, pace, and pauses intact.",
  },
  {
    icon: "≋",
    title: "Vocal Remover",
    body: "Studio-grade stem separation in a single pass. Vocals off, instrumental untouched.",
  },
  {
    icon: "◉",
    title: "AI Voice Cloning",
    body: "A zero-shot clone from 30 seconds of audio. 98.2% similarity to the source speaker.",
  },
  {
    icon: "¶",
    title: "Subtitle Generator",
    body: "Diarized, punctuated, timed. Broadcast-ready captions in every target language.",
  },
  {
    icon: "⌘",
    title: "API Integration",
    body: "REST + gRPC with streaming. Webhooks, SLAs, and 0.4s end-to-end latency.",
  },
];

/* The turbulent-displace filter that electrifies the card borders.
   Rendered once; every .electric-card .main-card references it. */
function ElectricFilter() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden>
      <defs>
        <filter
          id="turbulent-displace"
          colorInterpolationFilters="sRGB"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          {/* two vertically scrolling noise fields, opposite directions —
              they crossfade each other's wrap seam */}
          <feTurbulence type="turbulence" baseFrequency="0.02 0.03" numOctaves="3" seed="1" result="noise1" />
          <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
            <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>
          <feTurbulence type="turbulence" baseFrequency="0.02 0.03" numOctaves="3" seed="1" result="noise2" />
          <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
            <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          {/* two horizontally scrolling fields, same trick */}
          <feTurbulence type="turbulence" baseFrequency="0.02 0.03" numOctaves="3" seed="2" result="noise3" />
          <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
            <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>
          <feTurbulence type="turbulence" baseFrequency="0.02 0.03" numOctaves="3" seed="2" result="noise4" />
          <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
            <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
          <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
          <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

          <feDisplacementMap
            in="SourceGraphic"
            in2="combinedNoise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function Features() {
  return (
    <section id="tools" className="relative py-24 md:py-32 px-6 md:px-10">
      <ElectricFilter />
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ Tools</div>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
          Six instruments. <span className="gold-text">One engine.</span>
        </h2>

        <div data-reveal-stagger className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} data-tilt className="electric-card">
              <div className="inner-container">
                {/* electric border stack */}
                <div className="border-outer">
                  <div className="main-card" />
                </div>
                <div className="glow-layer-1" />
                <div className="glow-layer-2" />

                {/* content */}
                <div className="content-container">
                  <div className="w-11 h-11 rounded-xl border border-line bg-glass grid place-items-center text-lg text-gold">
                    {f.icon}
                  </div>
                  <h3 className="mt-5 font-display text-xl md:text-2xl tracking-tight text-bone">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-bone/60 leading-relaxed">{f.body}</p>
                  <hr className="divider" />
                  <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-gold">
                    Explore <span aria-hidden>→</span>
                  </div>
                </div>
              </div>

              {/* sheen + ambient glow */}
              <div className="overlay-1" />
              <div className="overlay-2" />
              <div className="background-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
