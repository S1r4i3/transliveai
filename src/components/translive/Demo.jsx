import { useEffect, useRef, useState } from "react";

const LANGS = [
  { code: "hi", flag: "🇮🇳", name: "Hindi", sample: "मेरा वीडियो हर भाषा में बोलता है।" },
  { code: "te", flag: "🇮🇳", name: "Telugu", sample: "నా వీడియో ప్రతి భాషలో మాట్లాడుతుంది." },
  { code: "ko", flag: "🇰🇷", name: "Korean", sample: "제 영상은 모든 언어로 말합니다." },
  { code: "ja", flag: "🇯🇵", name: "Japanese", sample: "私の動画はあらゆる言語で話します。" },
  { code: "es", flag: "🇪🇸", name: "Spanish", sample: "Mi video habla en todos los idiomas." },
  { code: "fr", flag: "🇫🇷", name: "French", sample: "Ma vidéo parle dans toutes les langues." },
  { code: "ar", flag: "🇸🇦", name: "Arabic", sample: "فيديوهي يتحدث بكل اللغات." },
  { code: "de", flag: "🇩🇪", name: "German", sample: "Mein Video spricht in jeder Sprache." },
];

export function Demo() {
  const [lang, setLang] = useState(0);
  const [typed, setTyped] = useState("");
  const [playing, setPlaying] = useState(false);
  const target = LANGS[lang].sample;
  const iRef = useRef(0);

  useEffect(() => {
    setTyped("");
    iRef.current = 0;
    const id = setInterval(() => {
      iRef.current += 1;
      if (iRef.current > target.length) {
        clearInterval(id);
        return;
      }
      setTyped(target.slice(0, iRef.current));
    }, 35);
    return () => clearInterval(id);
  }, [lang, target]);

  const play = () => {
    setPlaying(true);
    setTimeout(() => setPlaying(false), 2600);
  };

  return (
    <section id="demo" className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-start">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone mb-4">§ 03 — Try it</div>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">
              Type. Pick a tongue. <span className="gold-text">Hear it back.</span>
            </h2>
            <p className="mt-6 text-bone/60 leading-relaxed max-w-md">
              A 3-second taste of the full Translive engine. Your video pipeline is just this — plus lip-sync, plus your voice.
            </p>
            <div className="mt-8 flex items-center gap-2 font-mono text-xs text-stone">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Engine ready
            </div>
          </div>

          <div className="glass-ripple p-6 md:p-8">
            <span className="sweep-layer" aria-hidden />
            <div className="font-mono text-[10px] tracking-widest text-stone uppercase">Source</div>
            <div className="mt-2 font-display text-xl md:text-2xl text-bone/95">
              My video speaks in every language.
            </div>

            <div className="mt-6 font-mono text-[10px] tracking-widest text-stone uppercase">Target</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {LANGS.map((l, i) => (
                <button
                  key={l.code}
                  onClick={() => setLang(i)}
                  className={`chip-pop rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    lang === i
                      ? "border-gold bg-gold text-ink"
                      : "border-line bg-glass text-bone/70 hover:border-gold/50"
                  }`}
                >
                  <span className="mr-1">{l.flag}</span>
                  {l.name}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-line bg-ink/60 p-5 min-h-[110px]">
              <div className="font-display text-xl md:text-2xl leading-relaxed text-bone" lang={LANGS[lang].code}>
                {typed}
                <span className="inline-block w-[2px] h-6 bg-gold ml-0.5 align-middle animate-pulse" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-end gap-0.5 h-8 flex-1 min-w-[140px]">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm bg-gold/70"
                    style={{
                      height: playing ? `${20 + Math.abs(Math.sin(i * 0.4 + Date.now() * 0.001)) * 80}%` : "20%",
                      animation: playing ? `waveform ${0.5 + (i % 5) * 0.1}s ease-in-out infinite` : "none",
                      animationDelay: `${i * 0.02}s`,
                    }}
                  />
                ))}
              </div>
              <button
                onClick={play}
                data-cursor="PLAY"
                className="magnetic-btn iridescent btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
              >
                <span className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-white" />
                {playing ? "Speaking…" : "Speak"}
                <span className="drop-shadow" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
