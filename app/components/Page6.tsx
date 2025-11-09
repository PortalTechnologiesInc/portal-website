"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, memo, useRef } from "react";

const CAROUSEL_SYMBOLS = ["$", "£", "¥", "€", "₺", "₽", "₿", "ƒ"];

export const DailyLifeBusinessCarousel = memo(function DailyLifeBusinessCarousel() {
  const [activeSlide, setActiveSlide] = useState(0); // 0 = Daily life, 1 = Business
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const minSwipeDistance = 50;

  const handleSwipe = (startX: number, endX: number) => {
    const distance = startX - endX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeSlide === 0) {
      // Swipe left = go to Business (slide 1)
      setActiveSlide(1);
    } else if (isRightSwipe && activeSlide === 1) {
      // Swipe right = go to Daily life (slide 0)
      setActiveSlide(0);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    handleSwipe(touchStartX.current, touchEndX.current);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    touchEndX.current = null;
    touchStartX.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (!touchStartX.current || !touchEndX.current) return;
    handleSwipe(touchStartX.current, touchEndX.current);
  };

  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
    }
  };

  const slides = [
    { 
      id: 0, 
      label: "Daily life", 
      image: "/Slides.png",
      title: "Download now and be part of next the revolution"
    },
    { 
      id: 1, 
      label: "Business", 
      image: "/form.jpg",
      title: "Change the way you get payed, sell tickets\nand more"
    },
  ];

  return (
    <div className="w-full px-4 md:px-6">
      {/* Title */}
      <h2 className="font-eurostile font-bold text-xl md:text-2xl text-center text-black mb-3 md:mb-6">
        Take the first step
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-6 md:gap-8 mb-3 md:mb-6">
        {slides.map((slide) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(slide.id)}
            className={`font-eurostile text-base md:text-xl transition-all ${
              activeSlide === slide.id
                ? "font-bold text-black"
                : "font-normal text-black opacity-60"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${activeSlide * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-shrink-0 w-full flex items-center justify-center"
            >
              <div className="relative w-full max-w-[280px] md:max-w-2xl aspect-[2/3] overflow-hidden mx-auto">
                <Image
                  src={slide.image}
                  alt={slide.label}
                  fill
                  className={`object-cover ${
                    slide.id === 0 ? "object-left" : "object-center grayscale"
                  }`}
                  sizes="(min-width: 768px) 672px, 100vw"
                />
                {/* Title overlay */}
                <div className="absolute top-2 left-2 md:top-6 md:left-6 z-10">
                  <h3 className="font-eurostile font-bold text-black text-sm md:text-2xl lg:text-3xl leading-tight">
                    {slide.title.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < slide.title.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h3>
                </div>
                {/* Coming Soon label - only for business slide */}
                {slide.id === 1 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4 py-3 md:px-8 md:py-6 rounded-lg backdrop-blur-md bg-white/80">
                    <h2 className="font-eurostile font-bold text-black text-2xl md:text-5xl lg:text-6xl">
                      Coming Soon
                    </h2>
                  </div>
                )}
                {/* Store links - only for first slide */}
                {slide.id === 0 && (
                  <>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-6 z-10 flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                      <Link href="https://apps.apple.com/it/app/portal-digital-wallet/id6748541067" className="block">
                        <Image
                          src="/appstore.png"
                          alt="App Store"
                          width={240}
                          height={80}
                          className="object-contain store-badge"
                        />
                      </Link>
                      <Link href="https://play.google.com/store/apps/details?id=cc.getportal.portal" className="block">
                        <Image
                          src="/playstore.png"
                          alt="Play Store"
                          width={240}
                          height={80}
                          className="object-contain store-badge"
                        />
                      </Link>
                    </div>
                    <style jsx>{`
                      .store-badge {
                        height: 60px;
                        width: auto;
                      }
                      @media (min-width: 768px) {
                        .store-badge {
                          height: 120px;
                        }
                      }
                      @media (min-width: 1024px) {
                        .store-badge {
                          height: 150px;
                        }
                      }
                    `}</style>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const CurrencyCarousel = memo(function CurrencyCarousel() {
  // Control variable for SVG symbol height (in pixels)
  const symbolHeight = 110; // Mobile default
  const symbolHeightSm = 128; // Small screens (640px+)
  const symbolHeightMd = 160; // Medium screens (768px+)
  const symbolHeightLg = 176; // Large screens (1024px+)

  // Duplicate symbols for infinite loop
  const duplicatedSymbols = [...CAROUSEL_SYMBOLS, ...CAROUSEL_SYMBOLS, ...CAROUSEL_SYMBOLS];
  const startIndex = CAROUSEL_SYMBOLS.length; // Start in the middle section
  
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        
        // If we've reached the end of the middle section, reset to start of middle section
        // Reset happens before the end to avoid visible boundary
        if (nextIndex >= CAROUSEL_SYMBOLS.length * 2) {
          // Immediately disable transition and reset position
          setIsTransitioning(true);
          // Use requestAnimationFrame to ensure DOM update happens before re-enabling
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
          return startIndex;
        }
        
        return nextIndex;
      });
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [startIndex]);

  // Calculate the visual index for active state (use modulo to map back to original array)
  const visualIndex = currentIndex % CAROUSEL_SYMBOLS.length;

  return (
    <div className="w-full max-w-2xl md:pt-32">
      <div className="overflow-hidden relative py-4 md:py-8">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(calc(33.333% - ${currentIndex * 33.333}%))`,
            transitionDuration: isTransitioning ? '0ms' : '500ms'
          }}
        >
          {duplicatedSymbols.map((symbol, index) => {
            const isActive = visualIndex === (index % CAROUSEL_SYMBOLS.length);
            const src = `/letters-carousel/${encodeURIComponent(symbol)}.svg`;

            return (
              <div
                key={`${symbol}-${index}`}
                className="flex w-1/3 flex-shrink-0 items-center justify-center px-6 sm:px-8 md:px-12 py-4"
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

function BlackLogoOverlay() {
  const svgSize = 400;
  const svgPosition = { x: -30, y: -120 };

  return (
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
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
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
  );
}

export function Page6Hero() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: "#FFED00" }}>
      <BlackLogoOverlay />
      <div className="relative z-50 flex flex-col gap-4 items-center justify-center text-center px-6">
        <h1 className="font-eurostile font-bold tracking-tight text-4xl sm:text-4xl text-black">
          BE THE ONE IN CONTROL, TRUST NOTHING
        </h1>
        <Image
          src="/cross-gray.png"
          alt="Cross"
          width={800}
          height={800}
          className="mt-2 w-[90vw] h-auto max-h-[50vh] object-cover"
          priority
        />
      </div>
    </div>
  );
}

export function Page6CurrencyIntro() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col text-left max-w-2xl">
        <h2 className="font-eurostile font-bold tracking-tight text-2xl sm:text-3xl text-black mb-4">
          Works with <br /> all currency
        </h2>
        <p className="text-base sm:text-lg text-black">
          Lorem ipsum dolor sit amet consectetur. Adipiscing ac tortor curabitur aliquet iaculis. Eu quam id aliquet feugiat pharetra volutpat. Nibh ac et fermentum lobortis. Pulvinar tellus id tincidunt orci.
        </p>
      </div>
    </div>
  );
}

export function Page6CurrencyCarouselSection() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 w-full flex items-center justify-center">
        <CurrencyCarousel />
      </div>
    </div>
  );
}

export function Page6EasySecure() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center text-center max-w-2xl">
        <h2 className="font-eurostile font-bold tracking-tight text-2xl sm:text-3xl text-black mb-4">
          Easy, Simple and secure
        </h2>
        <p className="text-base sm:text-lg text-black">
          Lorem ipsum dolor sit amet consectetur. Adipiscing ac tortor curabitur aliquet iaculis. Eu quam id aliquet feugiat pharetra volutpat. Nibh ac et fermentum lobortis. Pulvinar tellus id tincidunt orci.
        </p>
      </div>
    </div>
  );
}

export function Page6DailyLife() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-2xl">
        <h2 className="font-eurostile font-semibold tracking-tight text-xl sm:text-2xl text-black mb-3 text-center">
          P+RTAL
          <br />
          Is the smartest
          choice for your daily life
        </h2>
        <div className="flex justify-center w-full mb-3">
          <div className="relative w-full max-w-[200px] aspect-[2/3] overflow-hidden">
            <Image
              src="/Rectangle.png"
              alt="Portal Rectangle"
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-row items-start gap-3">
            <div className="flex-shrink-0">
              <Image
                src="/confirmation_number.svg"
                alt="Tickets"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-eurostile font-bold text-base text-black mb-1">
                Tickets? No problem
              </h3>
              <p className="text-xs text-black">
                Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start gap-3">
            <div className="flex-shrink-0">
              <Image
                src="/assignment_ind.svg"
                alt="Identity"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-eurostile font-bold text-base text-black mb-1">
                Your identity, fully secured
              </h3>
              <p className="text-xs text-black">
                Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start gap-3">
            <div className="flex-shrink-0">
              <Image
                src="/cached.svg"
                alt="Control"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-eurostile font-bold text-base text-black mb-1">
                Take control of your money
              </h3>
              <p className="text-xs text-black">
                Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Page6Business() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-2xl">
        <h2 className="font-eurostile font-semibold tracking-tight text-xl sm:text-2xl text-black mb-3 text-center">
          P+RTAL
          <br />
          gives you complete
          control over your business
        </h2>
        <div className="flex justify-center w-full mb-3">
          <div className="relative w-full max-w-[200px] aspect-[2/3] overflow-hidden">
            <Image
              src="/Rectangle2.png"
              alt="Portal Rectangle"
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-row items-start gap-3">
            <div className="flex-shrink-0">
              <Image
                src="/do_not_touch.svg"
                alt="Hand"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-eurostile font-bold text-base text-black mb-1">
                Only you and your customer
              </h3>
              <p className="text-xs text-black">
                Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start gap-3">
            <div className="flex-shrink-0">
              <Image
                src="/sell.svg"
                alt="Sell"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-eurostile font-bold text-base text-black mb-1">
                Sell tickets effortlessly
              </h3>
              <p className="text-xs text-black">
                Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start gap-3">
            <div className="flex-shrink-0">
              <Image
                src="/cached.svg"
                alt="Control"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-eurostile font-bold text-base text-black mb-1">
                Intruders are kept out
              </h3>
              <p className="text-xs text-black">
                Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Page6TakeStep() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full">
        <DailyLifeBusinessCarousel />
      </div>
    </div>
  );
}

