import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export function useMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Lenis smooth scroll ---
    let lenis: Lenis | null = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      const raf = (time: number) => {
        lenis!.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    }

    const ctx = gsap.context(() => {
      if (reduce) return;

      // Auto fade-up for section headings and their lead paragraphs
      const autoTargets = document.querySelectorAll<HTMLElement>(
        "section h2, section [data-lead], [data-reveal]"
      );
      autoTargets.forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });


      // Stagger children of a parent with [data-reveal-stagger]
      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
        const kids = parent.children;
        gsap.from(kids, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: parent, start: "top 82%", once: true },
        });
      });

      // Magnetic buttons
      const magnetics = document.querySelectorAll<HTMLElement>(".magnetic-btn");
      magnetics.forEach((btn) => {
        const strength = 0.35;
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
        };
        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.4)" });
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        (btn as any).__cleanup = () => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        };
      });

      // Nav hide on scroll down / show on up
      const nav = document.querySelector<HTMLElement>("header.fixed");
      if (nav) {
        let lastY = window.scrollY;
        const onScroll = () => {
          const y = window.scrollY;
          const goingDown = y > lastY && y > 120;
          gsap.to(nav, { yPercent: goingDown ? -110 : 0, duration: 0.35, ease: "power2.out" });
          lastY = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        (nav as any).__cleanup = () => window.removeEventListener("scroll", onScroll);
      }

      // Hero orb parallax on mouse
      const orb = document.querySelector<HTMLElement>("[data-orb-parallax]");
      if (orb) {
        const onMove = (e: MouseEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(orb, {
            rotationY: nx * 3,
            rotationX: -ny * 3,
            x: nx * 15,
            y: ny * 15,
            duration: 0.8,
            ease: "power2.out",
          });
        };
        window.addEventListener("mousemove", onMove);
        (orb as any).__cleanup = () => window.removeEventListener("mousemove", onMove);
      }

      // Marquee speed with scroll velocity
      const marquees = document.querySelectorAll<HTMLElement>("[data-marquee-track]");
      marquees.forEach((track) => {
        ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = Math.min(3, 1 + Math.abs(self.getVelocity()) / 2000);
            (track.style as any).animationDuration = `${35 / v}s`;
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      lenis?.destroy();
      document.querySelectorAll<HTMLElement>(".magnetic-btn, header.fixed, [data-orb-parallax]").forEach((el) => {
        (el as any).__cleanup?.();
      });
    };
  }, []);
}
