import { useEffect, useRef, useState } from "react";

const CHARS = ["A", "अ", "అ", "한", "日", "文", "ع", "Ω", "文", "字", "И", "ñ"];

export function Orb({ size = 520, intensity = 2, className = "" }) {
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const rings = 2 + intensity;

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl animate-orb-pulse"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(79,70,229,0.35), rgba(79,70,229,0.05) 50%, transparent 70%)",
        }}
      />
      {/* Sphere */}
      <div
        className="absolute inset-[10%] rounded-full animate-glow"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(79,70,229,0.1) 30%, rgba(238,242,255,0.9) 65%, rgba(255,255,255,1) 100%)",
          border: "1px solid rgba(79,70,229,0.25)",
          boxShadow: "inset -20px -30px 60px rgba(79,70,229,0.12), inset 20px 30px 60px rgba(255,255,255,0.8)",
        }}
      >
        {/* Meridian lines */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-orb-rotate opacity-40">
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse
              key={i}
              cx="100"
              cy="100"
              rx={90 - i * 3}
              ry={30 + i * 12}
              fill="none"
              stroke="rgba(79,70,229,0.35)"
              strokeWidth="0.3"
            />
          ))}
        </svg>
        {/* Highlight */}
        <div
          className="absolute rounded-full blur-2xl"
          style={{
            top: "15%",
            left: "20%",
            width: "35%",
            height: "25%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.4), transparent 70%)",
          }}
        />
      </div>

      {/* Orbiting rings */}
      {Array.from({ length: rings }).map((_, i) => (
        <div
          key={i}
          className={i % 2 === 0 ? "animate-orb-rotate" : "animate-orb-counter"}
          style={{
            position: "absolute",
            inset: `${-4 - i * 5}%`,
            animationDuration: `${30 + i * 15}s`,
          }}
        >
          <div
            className="w-full h-full rounded-full border"
            style={{
              borderColor: `rgba(79,70,229,${0.25 - i * 0.05})`,
              transform: `rotateX(${65 + i * 8}deg) rotateZ(${i * 20}deg)`,
            }}
          />
        </div>
      ))}

      {/* Floating characters */}
      {mounted &&
        CHARS.map((c, i) => {
          const angle = (i / CHARS.length) * Math.PI * 2;
          const r = size * 0.42;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r * 0.35;
          return (
            <span
              key={i}
              className="absolute font-display text-gold/70 animate-orb-counter"
              style={{
                left: "50%",
                top: "50%",
                fontSize: 18,
                transform: `translate(-50%,-50%) translate(${x}px, ${y}px)`,
                animationDuration: `${45 + i * 2}s`,
                textShadow: "0 0 12px rgba(79,70,229,0.5)",
              }}
            >
              {c}
            </span>
          );
        })}
    </div>
  );
}
