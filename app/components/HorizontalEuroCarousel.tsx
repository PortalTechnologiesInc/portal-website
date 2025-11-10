"use client";

import { useRef } from "react";
import { useHorizontalCardCarousel } from "../hooks/useHorizontalCardCarousel";

type Props = {
  onEnterCarousel?: () => void;
  onExitCarousel?: () => void;
  autoEnter?: boolean;
};

export function HorizontalEuroCarousel({ onEnterCarousel, onExitCarousel, autoEnter }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const carousel = useHorizontalCardCarousel({
    containerRef,
    cardsRef,
    totalCards: 3,
    onEnterCarousel,
    onExitCarousel,
    enableVerticalExit: true,
    autoEnter,
  });

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="flex w-[300%] h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${carousel.currentCard * 33.333}%)` }}
      >
        {/* Card 1: Euro */}
        <div
          ref={(el) => {
            if (el) cardsRef.current[0] = el;
          }}
          className="w-[33.333%] h-full flex flex-col items-center justify-center px-6"
        >
          <div className="relative h-[7.03125rem] flex items-center justify-center w-full mb-10">
            <img
              src="/euro_symbol.svg"
              alt="Euro symbol"
              width={128}
              height={128}
              className="w-[8rem] h-[8rem]"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
              High costs
            </h1>
            <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto leading-tight text-white opacity-90">
              Commissions imposed by banks and payment processors eat into your
              profits, especially for small and medium-sized businesses.
            </p>
          </div>
        </div>

        {/* Card 2: Lock */}
        <div
          ref={(el) => {
            if (el) cardsRef.current[1] = el;
          }}
          className="w-[33.333%] h-full flex flex-col items-center justify-center px-6"
        >
          <div className="relative h-[7.03125rem] flex items-center justify-center w-full mb-10">
            <img
              src="/lock.svg"
              alt="Lock symbol"
              width={128}
              height={128}
              className="w-[8rem] h-[8rem]"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
              Technological "Lock-in"
            </h1>
            <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto leading-tight text-white opacity-90">
              Companies are often trapped in proprietary ecosystems, which limit
              their freedom and make it difficult to change providers or integrate
              new solutions.
            </p>
          </div>
        </div>

        {/* Card 3: Sad */}
        <div
          ref={(el) => {
            if (el) cardsRef.current[2] = el;
          }}
          className="w-[33.333%] h-full flex flex-col items-center justify-center px-6"
        >
          <div className="relative h-[7.03125rem] flex items-center justify-center w-full mb-10">
            <img
              src="/sentiment_sad.svg"
              alt="Sad symbol"
              width={120}
              height={120}
              className="w-[7.5rem] h-[7.5rem]"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
              Poor user experience
            </h1>
            <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto leading-tight text-white opacity-90">
              Authentication and payment systems are often clunky and unintuitive,
              creating friction for customers and leading to a high percentage of
              abandoned carts.
            </p>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              carousel.currentCard === index
                ? "bg-white"
                : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
