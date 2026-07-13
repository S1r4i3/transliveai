/* Translive logo — wordmark + neon microphone, recreated from the brand PNG
   so it stays crisp on the dark theme at any size. */

const NEON = "#ff3fd0";

export function MicGlyph({ height = 32 }) {
  return (
    <svg
      viewBox="0 0 64 88"
      height={height}
      aria-hidden
      style={{
        filter:
          "drop-shadow(0 0 5px rgba(255,63,208,0.9)) drop-shadow(0 0 16px rgba(255,63,208,0.55)) drop-shadow(0 0 34px rgba(255,63,208,0.3))",
      }}
    >
      <g fill="none" stroke={NEON} strokeWidth="4" strokeLinecap="round">
        {/* capsule */}
        <rect x="18" y="4" width="28" height="46" rx="14" />
        {/* grill lines */}
        <line x1="30" y1="20" x2="41" y2="20" />
        <line x1="30" y1="29" x2="41" y2="29" />
        {/* cradle arc */}
        <path d="M9 40 a23 23 0 0 0 46 0" />
        {/* stem + base */}
        <line x1="32" y1="64" x2="32" y2="76" />
        <line x1="19" y1="80" x2="45" y2="80" />
      </g>
    </svg>
  );
}

export function Logo({ size = 22, tagline = false, className = "" }) {
  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span className="inline-flex items-center gap-2.5">
        <span
          className="font-display font-bold tracking-tight text-bone leading-none"
          style={{ fontSize: size }}
        >
          Translive
        </span>
        <MicGlyph height={size * 1.35} />
      </span>
      {tagline && (
        <span
          className="mt-1.5 font-display italic tracking-wide text-bone/60"
          style={{ fontSize: Math.max(11, Math.round(size * 0.34)) }}
        >
          Real Time Translation — Real World Impact
        </span>
      )}
    </span>
  );
}
