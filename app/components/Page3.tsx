"use client";

import { useRef, useEffect } from "react";
import { useHorizontalStepCarousel } from "../hooks/useHorizontalStepCarousel";
import { useStaggeredScrollRise } from "../hooks/useStaggeredScrollRise";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page3({ scrollContainerRef }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Refs for entrance animation
  const step1ImageRef = useRef<HTMLDivElement | null>(null);
  const step1TitleRef = useRef<HTMLDivElement | null>(null);
  const step1SubtitleRef = useRef<HTMLDivElement | null>(null);

  // Horizontal step carousel
  const carousel = useHorizontalStepCarousel(
    containerRef,
    scrollContainerRef,
    {
      totalSteps: 3,
      onStepChange: (step) => {
        console.log(`Page3: Step changed to ${step}`);
      },
      onExitUp: () => {
        console.log("Page3: Exiting up to Page 2");
        // Don't call scrollIntoView - let CSS scroll-snap handle it naturally
      },
      onExitDown: () => {
        console.log("Page3: Exiting down to Page 4");
        // Don't call scrollIntoView - let CSS scroll-snap handle it naturally
      },
    }
  );

  // Debug info
  console.log("Page3: Current step:", carousel.currentStep, "Is active:", carousel.isPageActive, "Transform:", `translateX(-${carousel.currentStep * 33.333}%)`);

  // Reset carousel to step 0 when component mounts
  useEffect(() => {
    console.log("Page3 mounted, resetting to step 0");
    carousel.goToStep(0);
  }, []);

  // Entrance animation for first step
  useStaggeredScrollRise(
    containerRef as React.RefObject<HTMLElement | null>,
    [step1ImageRef, step1TitleRef, step1SubtitleRef] as Array<
      React.RefObject<HTMLElement | null>
    >,
    scrollContainerRef,
    {
      distancePx: 60,
      continueDistancePx: 40,
      delaysMs: [0, 200, 400],
      start: 0.1,
      end: 0.6,
      continueIntoNext: false,
      respectReducedMotion: false,
    }
  );

  const steps = [
    {
      image: "/euro_symbol.svg",
      title: "High Costs",
      subtitle: "Commissions imposed by banks and payment processors eat into your profits, especially for small and medium-sized businesses.",
    },
    {
      image: "/lock.svg",
      title: "Technological Lock-in",
      subtitle: "Companies are often trapped in proprietary ecosystems, which limit their freedom and make it difficult to change providers or integrate new solutions.",
    },
    {
      image: "/sentiment_sad.svg",
      title: "Poor User Experience",
      subtitle: "Authentication and payment systems are often clunky and unintuitive, creating friction for customers and leading to a high percentage of abandoned carts.",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex w-[300%] h-full transition-transform duration-300 ease-out items-center"
        style={{
          transform: `translateX(-${carousel.currentStep * 33.333}%)`
        }}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className="w-[33.333%] h-full flex flex-col items-center justify-center px-6"
          >
            {/* Image Container */}
            <div
              ref={index === 0 ? step1ImageRef : null}
              className="relative h-[8rem] flex items-center justify-center w-full mb-8"
            >
              <img
                src={step.image}
                alt={step.title}
                width={128}
                height={128}
                className="w-[8rem] h-[8rem]"
              />
            </div>

            {/* Text Content */}
            <div className="text-center max-w-2xl">
              <h1
                ref={index === 0 ? step1TitleRef : null}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white"
              >
                {step.title}
              </h1>
              <p
                ref={index === 0 ? step1SubtitleRef : null}
                className="text-lg md:text-xl font-normal leading-tight text-white opacity-90"
              >
                {step.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3 z-10">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-300 ${
              carousel.currentStep === index
                ? "bg-white w-2.5 h-2.5"
                : "bg-white/40 w-2 h-2"
            }`}
          />
        ))}
      </div>

      {/* Navigation Instructions */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center text-white/70 text-sm">
      </div>
    </div>
  );
}