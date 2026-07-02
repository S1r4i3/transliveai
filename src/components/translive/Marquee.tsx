const WORDS = ["Hello", "नमस्ते", "నమస్కారం", "Hola", "안녕하세요", "Bonjour", "こんにちは", "Ciao", "مرحبا", "Olá", "Hallo", "Привет"];

export function Marquee({ reverse = false }: { reverse?: boolean }) {
  const strip = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden py-6 border-y border-line bg-ink/60">
      <div className={`flex gap-14 whitespace-nowrap ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`} style={{ width: "max-content" }}>
        {strip.map((w, i) => (
          <span key={i} className="flex items-center gap-14 font-display text-3xl md:text-5xl tracking-tight text-bone/60">
            <span>{w}</span>
            <span className="text-gold text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
