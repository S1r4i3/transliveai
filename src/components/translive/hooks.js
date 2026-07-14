import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced, splitWords } from "./motion";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* useHeroAnimation — one master timeline for the hero.                */
/* Order: headline words (blur→sharp) → supporting copy → CTAs →       */
/* dashboard shell → dashboard items → progress bars → stat counters.  */
/* Re-plays the word reveal on each language cycle.                    */
/* ------------------------------------------------------------------ */
export function useHeroAnimation(rootRef, titleRef, cycleKey) {
  const revealedRef = useRef(false);

  /* Hide everything until the preloader curtain opens */
  useEffect(() => {
    if (prefersReduced()) return;
    const root = rootRef.current;
    if (!root || revealedRef.current || window.__tvRevealed) return;
    gsap.set(root.querySelectorAll("[data-hero-fade], [data-hero-cta]"), { opacity: 0 });
    gsap.set(root.querySelector("[data-orb-parallax]"), { opacity: 0 });
    gsap.set(root.querySelectorAll("[data-dash-item]"), { opacity: 0, y: 14 });
    gsap.set(root.querySelectorAll(".dash-fill"), { scaleX: 0, transformOrigin: "left center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = titleRef.current;
    const root = rootRef.current;
    if (!el || !root || prefersReduced()) return;

    const words = splitWords(el);
    gsap.set(words, { yPercent: 110, filter: "blur(8px)" });

    const playWords = () =>
      gsap.to(words, {
        yPercent: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });

    const playEntrance = () => {
      revealedRef.current = true;
      const dashItems = root.querySelectorAll("[data-dash-item]");
      const fills = root.querySelectorAll(".dash-fill");
      const counts = root.querySelectorAll("[data-count]");

      const tl = gsap.timeline();
      tl.add(playWords(), 0)
        .fromTo(
          root.querySelectorAll("[data-hero-fade]"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 },
          0.3,
        )
        .fromTo(
          root.querySelectorAll("[data-hero-cta]"),
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          0.45,
        )
        .fromTo(
          root.querySelector("[data-orb-parallax]"),
          { opacity: 0, y: 60, rotationY: -10 },
          { opacity: 1, y: 0, rotationY: 0, duration: 1.2, ease: "power3.out" },
          0.35,
        )
        // dashboard builds sequentially (no-ops if the hero has no dashboard)
        if (dashItems.length)
          tl.to(dashItems, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.09 }, 0.8);
        if (fills.length)
          tl.to(fills, { scaleX: 1, duration: 0.8, ease: "power2.out", stagger: 0.12 }, 1.05);
      // …and the stat counters tick up
      counts.forEach((c, i) => {
        const end = parseFloat(c.dataset.count);
        const dec = parseInt(c.dataset.decimals || "0", 10);
        const suf = c.dataset.suffix || "";
        const obj = { v: 0 };
        tl.to(
          obj,
          {
            v: end,
            duration: 1,
            ease: "power1.out",
            onUpdate: () => {
              c.textContent = obj.v.toFixed(dec) + suf;
            },
          },
          1.25 + i * 0.15,
        );
      });
    };

    if (revealedRef.current || window.__tvRevealed) {
      // subsequent language cycles animate the headline only
      if (revealedRef.current) playWords();
      else playEntrance();
      return;
    }
    window.addEventListener("tv:reveal", playEntrance, { once: true });
    return () => window.removeEventListener("tv:reveal", playEntrance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleKey]);
}

/* ------------------------------------------------------------------ */
/* useDemoReveal — sequenced scroll reveal for the Try-it panel:       */
/* panel materializes → source → chips → typed box → waveform/CTA.     */
/* Animates a plain wrapper so the panel's own CSS hover transitions   */
/* never fight GSAP.                                                   */
/* ------------------------------------------------------------------ */
export function useDemoReveal(wrapRef) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || prefersReduced()) return;
    const steps = wrap.querySelectorAll("[data-demo-step]");
    const ctx = gsap.context(() => {
      gsap.set(wrap, { opacity: 0, y: 40, scale: 0.97, filter: "blur(8px)" });
      gsap.set(steps, { opacity: 0, y: 22, filter: "blur(6px)" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: "top 72%", once: true },
      });
      tl.to(wrap, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out",
        clearProps: "filter",
      }).to(
        steps,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.14,
          clearProps: "filter",
        },
        "-=0.25",
      );
    }, wrap);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
