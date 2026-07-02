import { useState } from "react";

export function Closing() {
  return (
    <section id="cta" className="relative py-32 md:py-48 px-6 md:px-10 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(212,168,83,0.18), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1200px] mx-auto text-center">
        <h2 className="font-display text-[clamp(2.5rem,9vw,7rem)] leading-[0.95] tracking-[-0.04em]">
          One video.
          <br />
          Every language.
          <br />
          <span className="gold-text">Zero excuses.</span>
        </h2>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            data-cursor="START"
            className="magnetic-btn inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-base font-medium text-ink shadow-[0_0_60px_rgba(212,168,83,0.5)] hover:shadow-[0_0_100px_rgba(212,168,83,0.8)] transition-shadow"
          >
            Start translating free
            <span aria-hidden>→</span>
          </a>
          <a
            href="#pricing"
            className="magnetic-btn inline-flex items-center gap-2 rounded-full border border-line bg-glass px-8 py-4 text-base text-bone/90 hover:bg-bone/5 backdrop-blur"
          >
            View pricing
          </a>
        </div>
        <div className="mt-8 font-mono text-xs tracking-widest text-stone uppercase">
          No credit card · 60 free minutes · Cancel anytime
        </div>
      </div>
    </section>
  );
}

const LOCALES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "te", label: "తెలుగు" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "es", label: "Español" },
];

export function Footer() {
  const [locale, setLocale] = useState("en");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <footer className="relative border-t border-line bg-ink px-6 md:px-10 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 md:gap-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-soft shadow-[0_0_20px_rgba(212,168,83,0.5)]" />
              <span className="font-display text-lg">Translive<span className="text-gold">.</span></span>
            </div>
            <p className="mt-4 text-sm text-bone/60 max-w-sm leading-relaxed">
              Get updates in your language. Product news, new voices, and the occasional dad joke — dubbed.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSent(true);
              }}
              className="mt-5 flex items-center gap-2 rounded-full border border-line bg-glass p-1 pl-4 max-w-md"
            >
              <input
                type="email"
                required
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm text-bone placeholder:text-bone/40 outline-none py-2"
              />
              <button className="rounded-full bg-gold px-4 py-2 text-xs font-medium text-ink" data-cursor="">
                {sent ? "✓ Subscribed" : "Subscribe"}
              </button>
            </form>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-stone mb-4">Product</div>
            <ul className="space-y-2.5 text-sm text-bone/70">
              <li><a href="#features" className="hover:text-bone">Video Translation</a></li>
              <li><a href="#features" className="hover:text-bone">Lip-Sync AI</a></li>
              <li><a href="#features" className="hover:text-bone">Vocal Remover</a></li>
              <li><a href="#pricing" className="hover:text-bone">Pricing</a></li>
              <li><a href="#engine" className="hover:text-bone">API Docs</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-stone mb-4">Company</div>
            <ul className="space-y-2.5 text-sm text-bone/70">
              <li><a href="#" className="hover:text-bone">About</a></li>
              <li><a href="#" className="hover:text-bone">Careers</a></li>
              <li><a href="#" className="hover:text-bone">Blog</a></li>
              <li><a href="#" className="hover:text-bone">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-stone mb-4">Legal</div>
            <ul className="space-y-2.5 text-sm text-bone/70">
              <li><a href="#" className="hover:text-bone">Privacy</a></li>
              <li><a href="#" className="hover:text-bone">Terms</a></li>
              <li><a href="#" className="hover:text-bone">Data policy</a></li>
              <li><a href="#" className="hover:text-bone">Model card</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-xs text-bone/50">
            <span>© 2026 Translive Labs. Bengaluru.</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Made with 42 tongues.</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-mono text-[10px] tracking-widest uppercase text-stone">Language</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="rounded-full border border-line bg-glass px-3 py-1.5 text-sm text-bone/90 outline-none focus:border-gold"
            >
              {LOCALES.map((l) => (
                <option key={l.code} value={l.code} className="bg-ink">{l.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 ml-2">
              {["X", "IG", "YT", "IN"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 grid place-items-center rounded-full border border-line text-[10px] tracking-widest text-bone/70 hover:border-gold hover:text-gold transition">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
