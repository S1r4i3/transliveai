import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Wrap each word of an element's text in an overflow-hidden mask span.
 *  Safe to call twice — returns existing words on re-entry. */
export function splitWords(root) {
  if (root.dataset.split === "1") {
    return Array.from(root.querySelectorAll(".tv-word"));
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (t.textContent && t.textContent.trim()) textNodes.push(t);
  }
  textNodes.forEach((t) => {
    const frag = document.createDocumentFragment();
    const parts = (t.textContent ?? "").split(/(\s+)/);
    parts.forEach((p) => {
      if (!p) return;
      if (/^\s+$/.test(p)) {
        frag.appendChild(document.createTextNode(p));
        return;
      }
      const mask = document.createElement("span");
      mask.className = "tv-word-mask";
      const word = document.createElement("span");
      word.className = "tv-word";
      word.textContent = p;
      mask.appendChild(word);
      frag.appendChild(mask);
    });
    t.parentNode?.replaceChild(frag, t);
  });
  root.dataset.split = "1";
  return Array.from(root.querySelectorAll(".tv-word"));
}

const easeInOutPow2 = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* ------------------------------------------------------------------ */
/* Master motion hook                                                  */
/* ------------------------------------------------------------------ */

export function useMotion() {
  useEffect(() => {
    const reduce = prefersReduced();
    const cleanups = [];

    /* --- Lenis smooth scroll (lerp 0.1) --- */
    let lenis = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      let rafId = 0;
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
      cleanups.push(() => cancelAnimationFrame(rafId));
    }

    /* --- Smooth anchor-link scrolling (1s, power2.inOut) --- */
    const onAnchorClick = (e) => {
      const a = e.target?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { duration: 1, easing: easeInOutPow2 });
      } else {
        target.scrollIntoView();
      }
    };
    document.addEventListener("click", onAnchorClick);
    cleanups.push(() => document.removeEventListener("click", onAnchorClick));

    /* --- Perf: pause decorative CSS animations off-screen, and gate the
       expensive electric-border filter to when the Tools grid is visible --- */
    if (typeof IntersectionObserver !== "undefined") {
      const blocks = document.querySelectorAll("main > *, footer");
      const pauseIO = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) =>
            en.target.classList.toggle("anims-paused", !en.isIntersecting),
          ),
        { rootMargin: "160px 0px" },
      );
      blocks.forEach((b) => pauseIO.observe(b));
      cleanups.push(() => pauseIO.disconnect());

      const tools = document.getElementById("tools");
      if (tools) {
        const electricIO = new IntersectionObserver(
          ([en]) => tools.classList.toggle("electric-on", en.isIntersecting),
          { rootMargin: "120px 0px" },
        );
        electricIO.observe(tools);
        cleanups.push(() => electricIO.disconnect());
      }
    }

    const ctx = gsap.context(() => {
      /* ============================================================ */
      /* Reduced motion: simple fades only, no scrub / pin / parallax  */
      /* ============================================================ */
      if (reduce) {
        gsap.utils
          .toArray(
            "main section h2, main section p, [data-reveal], [data-stagger-rows] > *",
          )
          .forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          });
        return;
      }

      /* ============================================================ */
      /* Per-word gradient fill-on-scroll for section headlines        */
      /* ============================================================ */
      const DIM = "rgba(17,24,39,0.14)";
      gsap.utils.toArray("main section h2:not([data-no-fill])").forEach((h2) => {
        const words = splitWords(h2);
        const goldFlags = words.map((w) => !!w.closest(".gold-text"));
        // the words now carry their own clip — drop the parent's so they
        // don't double-paint
        h2.querySelectorAll(".gold-text").forEach((s) =>
          s.classList.remove("gold-text"),
        );
        words.forEach((w, i) => {
          const lit = goldFlags[i]
            ? "#8b5cf6 0%, #4f46e5 22%, #06b6d4 42%"
            : "#111827 0%, #111827 22%, #374151 42%";
          w.classList.add("tv-fill-word");
          w.style.backgroundImage = `linear-gradient(110deg, ${lit}, ${DIM} 55%, ${DIM} 100%)`;
        });
        gsap.fromTo(
          words,
          { backgroundPosition: "100% 0%" },
          {
            backgroundPosition: "0% 0%",
            ease: "none",
            stagger: 0.15,
            scrollTrigger: {
              trigger: h2,
              start: "top 85%",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      });

      /* ============================================================ */
      /* Paragraph fade-ups (30px, once, 0.7s, stagger 0.1)            */
      /* ============================================================ */
      const paras = gsap.utils
        .toArray("main section p, [data-lead], [data-reveal]")
        .filter(
          (el) =>
            !el.closest("[data-scene]") &&
            !el.closest("#top") &&
            !el.closest("[data-reveal-stagger]"),
        );
      gsap.set(paras, { y: 30, opacity: 0, filter: "blur(4px)" });
      ScrollTrigger.batch(paras, {
        start: "top 80%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.1,
            clearProps: "filter",
          }),
      });

      /* Cards materialize: blur → sharp, scale .97 → 1, rising stagger */
      gsap.utils.toArray("[data-reveal-stagger]").forEach((parent) => {
        gsap.from(parent.children, {
          y: 40,
          opacity: 0,
          scale: 0.97,
          filter: "blur(6px)",
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          clearProps: "filter,scale",
          scrollTrigger: { trigger: parent, start: "top 82%", once: true },
        });
      });

      /* Datasheet rows: stagger-fade 0.05s apart */
      gsap.utils.toArray("[data-stagger-rows]").forEach((parent) => {
        gsap.from(parent.children, {
          y: 16,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: parent, start: "top 85%", once: true },
        });
      });

      /* ============================================================ */
      /* Magnetic buttons (±8px pull, elastic return, scale 1.04)      */
      /* ============================================================ */
      const clamp8 = gsap.utils.clamp(-8, 8);
      document.querySelectorAll(".magnetic-btn").forEach((btn) => {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" });
        const onMove = (e) => {
          const r = btn.getBoundingClientRect();
          xTo(clamp8((e.clientX - (r.left + r.width / 2)) * 0.25));
          yTo(clamp8((e.clientY - (r.top + r.height / 2)) * 0.25));
        };
        const onEnter = () =>
          gsap.to(btn, { scale: 1.04, duration: 0.3, ease: "power3.out" });
        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.4)" });
          gsap.to(btn, { scale: 1, duration: 0.4, ease: "power3.out" });
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseenter", onEnter);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseenter", onEnter);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });

      /* ============================================================ */
      /* Tactile cards: 3D tilt + cursor-follow spotlight              */
      /* ============================================================ */
      if (window.matchMedia("(pointer: fine)").matches) {
        document.querySelectorAll("[data-tilt]").forEach((card) => {
          const spot = document.createElement("span");
          spot.className = "spotlight-overlay";
          card.appendChild(spot);
          gsap.set(card, { transformPerspective: 800 });
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
          const onMove = (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 10);
            rx((0.5 - py) * 8);
            card.style.setProperty("--mx", `${px * 100}%`);
            card.style.setProperty("--my", `${py * 100}%`);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
            spot.remove();
          });
        });
      }

      /* ============================================================ */
      /* Click ripple on every iridescent button                       */
      /* ============================================================ */
      document.querySelectorAll(".iridescent").forEach((btn) => {
        const layer = document.createElement("span");
        layer.className = "ripple-layer";
        layer.setAttribute("aria-hidden", "true");
        btn.appendChild(layer);
        const onClick = (e) => {
          const r = btn.getBoundingClientRect();
          const rip = document.createElement("span");
          rip.className = "tv-ripple";
          rip.style.left = `${e.clientX - r.left}px`;
          rip.style.top = `${e.clientY - r.top}px`;
          layer.appendChild(rip);
          setTimeout(() => rip.remove(), 650);
        };
        btn.addEventListener("click", onClick);
        cleanups.push(() => {
          btn.removeEventListener("click", onClick);
          layer.remove();
        });
      });

      /* ============================================================ */
      /* Nav scrollspy: gradient underline tracks the active section   */
      /* ============================================================ */
      ["features", "demo", "pricing", "engine"].forEach((id) => {
        const section = document.getElementById(id);
        const link = document.querySelector(`header .nav-link[href="#${id}"]`);
        if (!section || !link) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => link.classList.toggle("active", self.isActive),
        });
      });

      /* ============================================================ */
      /* Intro shine: iridescent buttons flash their sheen once,      */
      /* staggered, right after the preloader curtain opens.          */
      /* ============================================================ */
      {
        const timeouts = [];
        const runShine = () => {
          document.querySelectorAll(".iridescent").forEach((btn, i) => {
            timeouts.push(setTimeout(() => btn.classList.add("shine"), 500 + i * 200));
            timeouts.push(setTimeout(() => btn.classList.remove("shine"), 2200 + i * 200));
          });
        };
        if (window.__tvRevealed) runShine();
        else window.addEventListener("tv:reveal", runShine, { once: true });
        cleanups.push(() => {
          window.removeEventListener("tv:reveal", runShine);
          timeouts.forEach(clearTimeout);
        });
      }

      /* ============================================================ */
      /* Navbar hide on scroll-down, reveal on scroll-up (0.3s)        */
      /* ============================================================ */
      const nav = document.querySelector("header.fixed");
      if (nav) {
        const show = gsap.quickTo(nav, "yPercent", {
          duration: 0.3,
          ease: "power2.out",
        });
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            show(self.direction === 1 && self.scroll() > 120 ? -110 : 0);
          },
        });
      }

      /* ============================================================ */
      /* Mouse parallax: orb tilts ±3°, glow shifts ±15px, 0.8s lag    */
      /* ============================================================ */
      const orb = document.querySelector("[data-orb-parallax]");
      const glow = document.querySelector("[data-glow-parallax]");
      if (orb || glow) {
        const tiltX = orb
          ? gsap.quickTo(orb, "rotationY", { duration: 0.8, ease: "power2.out" })
          : null;
        const tiltY = orb
          ? gsap.quickTo(orb, "rotationX", { duration: 0.8, ease: "power2.out" })
          : null;
        const glowX = glow
          ? gsap.quickTo(glow, "x", { duration: 0.8, ease: "power2.out" })
          : null;
        const glowY = glow
          ? gsap.quickTo(glow, "y", { duration: 0.8, ease: "power2.out" })
          : null;
        const onMove = (e) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          tiltX?.(nx * 3);
          tiltY?.(-ny * 3);
          glowX?.(nx * 15);
          glowY?.(ny * 15);
          // fractured-glass highlights subtly follow the cursor
          document.documentElement.style.setProperty("--fx", `${nx * 30}deg`);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("mousemove", onMove));
      }

      /* ============================================================ */
      /* Marquee speed subtly increases with scroll velocity           */
      /* ============================================================ */
      document.querySelectorAll("[data-marquee-track]").forEach((track) => {
        ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = Math.min(2.2, 1 + Math.abs(self.getVelocity()) / 3000);
            track.style.animationDuration = `${35 / v}s`;
          },
        });
      });

      ScrollTrigger.refresh();
    });

    /* Re-measure once everything (fonts, images) has loaded */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    cleanups.push(() => window.removeEventListener("load", onLoad));

    return () => {
      ctx.revert();
      lenis?.destroy();
      cleanups.forEach((fn) => fn());
    };
  }, []);
}
