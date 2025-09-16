"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const elements = sectionRefs.current.filter(Boolean) as HTMLElement[];

    elements.forEach((el, index) => {
      el.style.opacity = "0";
      // Prevent initial upward lift for the first section to avoid bottom gap flash
      el.style.transform = index === 0 ? "translateY(0)" : "translateY(24px)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const startingTranslate = target.style.transform.includes("24px")
              ? 24
              : 0;
            animate(target, {
              opacity: [0, 1],
              translateY: [startingTranslate, 0],
              easing: "easeOutQuad",
              duration: 700,
            });
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.4 }
    );

    elements.forEach((el) => {
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <div className="h-dvh overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="relative min-h-dvh snap-start flex items-center justify-center bg-gradient-to-b from-indigo-600 to-violet-700 text-white overflow-hidden"
      >
        {/* decorative blobs */}
        <span className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl" />

        <div className="px-6 text-center">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
            random stuff
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            test animejs
          </h1>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            A minimal snapping demo with subtle colors and entrance animations.
          </p>
        </div>
      </section>

      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="min-h-dvh snap-start flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 px-6"
      >
        <div className="max-w-2xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500" /> centered
            paragraph
          </p>
          <p className="text-lg md:text-xl leading-relaxed opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </section>
    </div>
  );
}
