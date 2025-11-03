"use client";

import { useRef, useEffect, useState } from "react";
import { DUR_STEP_MS } from "../lib/constants/animation";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

type LogoPhase = "initial" | "moving" | "enlarging" | "visible";

const LOGO_DATA_ATTRIBUTE = "data-logo-yellow";

export function Page4({ scrollContainerRef }: Props) {
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [logoPhase, setLogoPhase] = useState<LogoPhase>("initial");
  const page4ContainerRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const container = page4ContainerRef.current;
    const scrollContainerEl = scrollContainerRef.current;
    const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
    const page4Section = container?.closest("section");

    if (!container || !scrollContainerEl || !logoYellow || !page4Section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        if (isIntersecting && intersectionRatio >= 0.5) {
          if (!hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            // Start animation sequence
            setLogoPhase("moving");
            
            // After movement completes, start enlarging
            setTimeout(() => {
              setLogoPhase("enlarging");
              
              // After enlarging completes, keep visible
              setTimeout(() => {
                setLogoPhase("visible");
              }, DUR_STEP_MS);
            }, DUR_STEP_MS);
          } else {
            // If already animated, ensure logo stays visible
            setLogoPhase("visible");
          }
          setIsTextVisible(true);
        } else {
          // When leaving Page4, keep logo visible (don't reset logoPhase)
          setIsTextVisible(false);
        }
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    observer.observe(page4Section);

    return () => {
      observer.disconnect();
    };
  }, [scrollContainerRef]);

  // Apply logo styles based on phase
  useEffect(() => {
    const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
    const logoPath = document.querySelector('[data-logo-path]') as SVGPathElement;
    if (!logoYellow) return;

    const baseTransition = `${DUR_STEP_MS}ms ease-in-out`;
    
    switch (logoPhase) {
      case "initial":
        logoYellow.style.opacity = "0";
        logoYellow.style.top = "100vh";
        logoYellow.style.transform = "translate(-50%, -50%)";
        logoYellow.style.width = "40px";
        logoYellow.style.height = "40px";
        logoYellow.style.transition = "none";
        if (logoPath) {
          logoPath.style.strokeWidth = "3";
          logoPath.style.transition = "none";
        }
        break;
      case "moving":
        logoYellow.style.opacity = "1";
        logoYellow.style.top = "50vh";
        logoYellow.style.transform = "translate(-50%, -50%)";
        logoYellow.style.width = "40px";
        logoYellow.style.height = "40px";
        logoYellow.style.transition = `opacity ${baseTransition}, top ${baseTransition}, width ${baseTransition}, height ${baseTransition}`;
        if (logoPath) {
          logoPath.style.strokeWidth = "3";
          logoPath.style.transition = "none";
        }
        break;
      case "enlarging":
        logoYellow.style.opacity = "1";
        logoYellow.style.top = "50vh";
        logoYellow.style.transform = "translate(-50%, -50%)";
        logoYellow.style.width = "900px";
        logoYellow.style.height = "900px";
        logoYellow.style.transition = `width ${baseTransition}, height ${baseTransition}`;
        if (logoPath) {
          logoPath.style.transition = `stroke-width ${baseTransition}`;
          logoPath.style.strokeWidth = "1.2";
        }
        break;
      case "visible":
        logoYellow.style.opacity = "1";
        logoYellow.style.top = "50vh";
        logoYellow.style.transform = "translate(-50%, -50%)";
        logoYellow.style.width = "900px";
        logoYellow.style.height = "900px";
        logoYellow.style.transition = "none";
        if (logoPath) {
          logoPath.style.strokeWidth = "1.2";
          logoPath.style.transition = "none";
        }
        break;
    }
  }, [logoPhase]);

  return (
    <div ref={page4ContainerRef} className="relative w-full h-dvh flex flex-col items-center justify-center px-6">
      {/* Text Content */}
      <div className="text-center mx-2">
        <h1
          className="font-eurostile font-bold tracking-tight text-5xl md:text-8xl lg:text-8xl text-white"
          style={{
            opacity: isTextVisible ? 1 : 0,
            transform: isTextVisible ? "translateY(0px)" : "translateY(12px)",
            transition: "opacity 1000ms ease-in-out, transform 1000ms ease-out",
          }}
        >
          BREAK THE CYCLE,
          <br />
          SKIP THE THIRD WHEEL
        </h1>

        <p
          className="mt-3 text-2xl md:text-xl lg:text-xl opacity-90 max-w-2xl mx-5 text-white"
          style={{
            opacity: isTextVisible ? 0.9 : 0,
            transform: isTextVisible ? "translateY(0px)" : "translateY(12px)",
            transition: "opacity 1000ms ease-in-out, transform 1000ms ease-out",
          }}
        >
          A peer-to-peer system for direct business-to-customer communication
        </p>
      </div>
    </div>
  );
}

// Export utility function for Page5 to reset logo
export function resetLogoYellow() {
  const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
  const logoPath = document.querySelector('[data-logo-path]') as SVGPathElement;
  if (logoYellow) {
    logoYellow.style.opacity = "0";
    logoYellow.style.top = "100vh";
    logoYellow.style.transform = "translate(-50%, -50%)";
    logoYellow.style.width = "40px";
    logoYellow.style.height = "40px";
    logoYellow.style.transition = "none";
  }
  if (logoPath) {
    logoPath.style.strokeWidth = "3";
    logoPath.style.transition = "none";
  }
}