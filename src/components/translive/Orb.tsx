import { useEffect, useRef, useState } from "react";

const CHARS = ["A", "अ", "అ", "한", "日", "文", "ع", "Ω", "文", "字", "И", "ñ"];

interface OrbProps {
  size?: number;
  intensity?: 1 | 2 | 3;
  className?: string;
}

export function Orb({ size = 520, intensity = 2, className = "" }: OrbProps) {
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      el.style.setProperty("--px", `${dx * 20}px`);
      el.style.setProperty("--py", `${dy * 20}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const rings = 2 + intensity;

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      style={{ width: size, height: size, transform: "translate3d(var(--px,0),var(--py,0),0)", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl animate-orb-pulse"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(212,168,83,0.35), rgba(212,168,83,0.05) 50%, transparent 70%)",
        }}
      />
      {/* Sphere */}
      <div
        className="absolute inset-[10%] rounded-full animate-glow"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(250,248,245,0.18), rgba(212,168,83,0.12) 30%, rgba(12,10,9,0.9) 65%, rgba(12,10,9,1) 100%)",
          border: "1px solid rgba(212,168,83,0.25)",
          boxShadow: "inset -20px -30px 60px rgba(0,0,0,0.6), inset 20px 30px 60px rgba(212,168,83,0.08)",
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
              stroke="rgba(212,168,83,0.35)"
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
            background: "radial-gradient(ellipse, rgba(250,248,245,0.4), transparent 70%)",
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
              borderColor: `rgba(212,168,83,${0.25 - i * 0.05})`,
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
                textShadow: "0 0 12px rgba(212,168,83,0.5)",
              }}
            >
              {c}
            </span>
          );
        })}
    </div>
  );
}
