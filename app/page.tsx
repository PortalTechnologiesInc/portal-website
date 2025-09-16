"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Image from "next/image";
import ContactCarousel from "./components/ContactCarousel";
import ParallaxImage from "./components/ParallaxImage";

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const elements = sectionRefs.current.filter(Boolean) as HTMLElement[];

    elements.forEach((el, index) => {
      el.style.opacity = "0";
      // Prevent initial upward lift for the first section to avoid bottom gap flash
      el.style.transform = index === 0 ? "translateY(0)" : "translateY(1.5rem)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const startingTranslate = target.style.transform.includes("1.5rem")
              ? 1.5
              : 0;
            animate(target, {
              opacity: [0, 1],
              translateY: [startingTranslate, 0],
              easing: "easeOutQuad",
              duration: 200,
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
    <div className="h-dvh overflow-y-scroll overflow-x-hidden scroll-smooth snap-y snap-mandatory">
      <ParallaxImage />
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="relative min-h-dvh snap-start bg-white pt-20"
        style={{ color: "#141416" }}
      >
        {/* Background SVG Vector */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/yellowvec.svg"
            alt=""
            width={300}
            height={300}
            className=""
            style={{ minWidth: "210%", minHeight: "210%" }}
            priority
          />
        </div>
        <div className="px-6 text-left max-w-4xl m-2 relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight font-eurostile">
            BE THE ONE IN CONTROL, TRUST NOTHING
          </h1>
          <p className="text-2xl md:text-xl lg:text-2xl font-normal mb-8 max-w-2xl leading-tight">
            The next revolution is now,
            <br />
            Skip the fees with P+RTAL
            <br />
            and get the highest security ever
          </p>
          <button
            type="button"
            className="text-white px-4 py-2 text-lg font-semibold transition-colors duration-200"
            style={{ backgroundColor: "#141416" }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = "#1a1a1c";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = "#141416";
            }}
          >
            Discover More
          </button>
        </div>

        {/* Contact Carousel */}
        <ContactCarousel />
      </section>

      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="min-h-dvh snap-start flex items-center justify-center text-white px-6 relative z-40"
        style={{ backgroundColor: "#141416" }}
      >
        <div className="max-w-2xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500" /> centered
            paragraph
          </p>
          <p className="text-lg md:text-xl leading-relaxed opacity-90 text-white">
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
