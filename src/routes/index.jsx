import { createFileRoute } from "@tanstack/react-router";
import { useCursor, Nav } from "@/components/translive/Chrome";
import { useMotion } from "@/components/translive/motion";
import { Preloader } from "@/components/translive/Preloader";
import { Hero } from "@/components/translive/Hero";
import { Marquee } from "@/components/translive/Marquee";
import { Manifesto } from "@/components/translive/Manifesto";
import { Scenes } from "@/components/translive/Scenes";
import { Features } from "@/components/translive/Features";
import { Stats, Badges, Testimonials } from "@/components/translive/Middle";
import { Demo } from "@/components/translive/Demo";
import { Pricing, Engine } from "@/components/translive/Pricing";
import { Closing, Footer } from "@/components/translive/Closing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Translive — One video. Every language. Zero excuses." },
      {
        name: "description",
        content:
          "AI video & audio translation with lip-sync in 42 languages. Voice cloning, vocal remover, and a 0.4s latency engine — premium glass polish, studio-grade output.",
      },
      { property: "og:title", content: "Translive — Every language. One voice. Yours." },
      { property: "og:description", content: "AI video translation with lip-sync in 42 languages. Sounds like you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useCursor();
  useMotion();
  return (
    // transparent wrapper — the body's ambient gradient shows through
    <div className="grain relative min-h-screen text-bone">
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Scenes />
        <Features />
        <Stats />
        <Marquee reverse />
        <Demo />
        <Badges />
        <Testimonials />
        <Pricing />
        <Engine />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
