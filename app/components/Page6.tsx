"use client";

import Image from "next/image";
import { useEffect, useState, memo } from "react";

const CAROUSEL_SYMBOLS = ["$", "£", "¥", "€", "₺", "₽", "₿", "ƒ"];

const CurrencyCarousel = memo(function CurrencyCarousel() {
  // Control variable for SVG symbol height (in pixels)
  const symbolHeight = 110; // Mobile default
  const symbolHeightSm = 128; // Small screens (640px+)
  const symbolHeightMd = 160; // Medium screens (768px+)
  const symbolHeightLg = 176; // Large screens (1024px+)

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_SYMBOLS.length);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full max-w-2xl pt-32">
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {CAROUSEL_SYMBOLS.map((symbol, index) => {
            const isActive = currentIndex === index;
            const src = `/letters-carousel/${encodeURIComponent(symbol)}.svg`;

            return (
              <div
                key={symbol}
                className="flex w-full flex-shrink-0 items-center justify-center px-6 sm:px-8 md:px-12"
              >
                <Image
                  src={src}
                  alt={`${symbol} currency symbol`}
                  width={180}
                  height={180}
                  className={`transition-all duration-500 ${isActive ? "blur-0 opacity-100" : "blur-sm opacity-60"}`}
                  style={{
                    width: `${symbolHeight}px`,
                    height: `${symbolHeight}px`,
                  }}
                  // Apply responsive sizes via CSS custom properties
                  data-symbol-height-sm={symbolHeightSm}
                  data-symbol-height-md={symbolHeightMd}
                  data-symbol-height-lg={symbolHeightLg}
                />
              </div>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        img[data-symbol-height-sm] {
          width: ${symbolHeight}px;
          height: ${symbolHeight}px;
        }
        @media (min-width: 640px) {
          img[data-symbol-height-sm] {
            width: ${symbolHeightSm}px !important;
            height: ${symbolHeightSm}px !important;
          }
        }
        @media (min-width: 768px) {
          img[data-symbol-height-md] {
            width: ${symbolHeightMd}px !important;
            height: ${symbolHeightMd}px !important;
          }
        }
        @media (min-width: 1024px) {
          img[data-symbol-height-lg] {
            width: ${symbolHeightLg}px !important;
            height: ${symbolHeightLg}px !important;
          }
        }
      `}</style>
    </div>
  );
});

export function Page6() {
  // Control variables for SVG shape and position
  const svgSize = 400; // Size in pixels (controls shape scale)
  const svgPosition = { x: -30, y: -180 }; // Position offset in pixels from top-left

  return (
    <>
      <div className="relative w-full flex flex-col items-center">
        {/* Black Logo SVG - Absolute position */}
        <div
          data-logo-black
          className="absolute pointer-events-none"
          style={{
            top: `${svgPosition.y}%`,
            left: `${svgPosition.x}%`,
            transformOrigin: "center center",
            zIndex: 50,
            width: `${svgSize}%`,
            height: `${svgSize}%`,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            maskSize: "100% 100%",
            maskRepeat: "no-repeat",
            maskPosition: "0 0",
          }}
        >
          <svg
            width="246"
            height="210"
            viewBox="0 0 246 210"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 1,
              opacity: 1,
            }}
          >
            <path
              data-logo-black-path
              d="M174.011 1.5C174.029 17.4525 174.358 29.8097 175.814 39.3369C177.317 49.1665 180.048 56.2148 185.089 61.127C190.126 66.0356 197.249 68.5948 207.03 69.9609C216.506 71.2844 228.703 71.5115 244.313 71.5244V138.475C228.7 138.488 216.501 138.716 207.024 140.039C197.243 141.405 190.12 143.965 185.084 148.873C180.044 153.785 177.314 160.834 175.812 170.663C174.358 180.19 174.029 192.548 174.011 208.5H71.8027C71.7841 192.547 71.455 180.19 69.999 170.663C68.4968 160.833 65.7646 153.785 60.7236 148.873C55.6863 143.965 48.5641 141.405 38.7832 140.039C29.3072 138.716 17.1101 138.488 1.5 138.475V71.5244C17.1136 71.5115 29.3124 71.2845 38.7891 69.9609C48.5707 68.5948 55.693 66.0356 60.7295 61.127C65.7696 56.2148 68.4999 49.1664 70.001 39.3369C71.4559 29.8097 71.7842 17.4525 71.8027 1.5H174.011Z"
              stroke="#000000"
              strokeWidth="0.5"
            />
          </svg>
        </div>
        
        {/* Page 6 content */}
        <div className="relative z-50 flex flex-col gap-6 items-center justify-center text-center min-h-screen">
          <h1 className="font-eurostile font-bold tracking-tight text-5xl md:text-8xl lg:text-8xl text-black">
            BE THE ONE IN CONTROL, TRUST NOTHING
          </h1>
          <Image
            src="/cross-gray.png"
            alt="Cross"
            width={800}
            height={800}
            className="mt-6 w-[90vw] h-auto sm:h-[60vh] md:h-[40vh] lg:h-[35rem] object-cover"
            priority
          />
        </div>

        {/* Spacing */}
        <div className="relative z-50 py-32 md:py-40 lg:py-48"></div>

        {/* Works with all currency section */}
        <div className="relative z-50 flex flex-col items-center justify-center text-center px-6">
          <h2 className="font-eurostile font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl text-black mb-6">
            Works with all currency
          </h2>
          <p className="text-lg md:text-xl lg:text-xl text-black max-w-2xl">
            Lorem ipsum dolor sit amet consectetur. Adipiscing ac tortor curabitur aliquet iaculis. Eu quam id aliquet feugiat pharetra volutpat. Nibh ac et fermentum lobortis. Pulvinar tellus id tincidunt orci.
          </p>
        </div>

          <CurrencyCarousel />
        {/* Spacing */}
        <div className="relative z-50 py-32 md:py-40 lg:py-48"></div>

        {/* Easy, Simple and secure section */}
        <div className="relative z-50 flex flex-col items-center justify-center text-center px-6">
          <h2 className="font-eurostile font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl text-black mb-6">
            Easy, Simple and secure
          </h2>
          <p className="text-lg md:text-xl lg:text-xl text-black max-w-2xl">
            Lorem ipsum dolor sit amet consectetur. Adipiscing ac tortor curabitur aliquet iaculis. Eu quam id aliquet feugiat pharetra volutpat. Nibh ac et fermentum lobortis. Pulvinar tellus id tincidunt orci.
          </p>
        </div>

        {/* Spacing */}
        <div className="relative z-50 py-32 md:py-40 lg:py-48"></div>
      </div>
    </>
  );
}

