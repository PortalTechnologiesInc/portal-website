"use client";

import Link from "next/link";
import { useEffect, useState, memo, useRef, useMemo, useCallback } from "react";
import type { CSSProperties } from "react";

const CAROUSEL_SYMBOLS = ["$", "£", "¥", "€", "₺", "₽", "₿", "ƒ"];

type DailyLifeBusinessCarouselProps = {
  variant?: "default" | "desktop";
};

export const DailyLifeBusinessCarousel = memo(function DailyLifeBusinessCarousel({
  variant = "default",
}: DailyLifeBusinessCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0); // 0 = Daily life, 1 = Business
  const isDesktopVariant = variant === "desktop";
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
      image: "/Slides.webp",
      title: "Download now and be part of next the revolution"
    },
    { 
      id: 1, 
      label: "Business", 
      image: "/form.webp",
      title: "Change the way you get payed, sell tickets\nand more"
    },
  ];

  return (
    <div className={`w-full ${isDesktopVariant ? "px-0" : "px-4 md:px-6"}`}>
      <div className={isDesktopVariant ? "flex flex-col gap-8" : ""}>
        {/* Title & Tabs */}
        <div
          className={
            isDesktopVariant
              ? "flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              : ""
          }
        >
          <h2
            className={`font-eurostile font-bold text-black ${
              isDesktopVariant
                ? "text-left text-3xl md:text-5xl lg:text-6xl"
                : "text-2xl md:text-3xl lg:text-4xl text-center mb-3 md:mb-6"
            }`}
          >
            Take the first step
          </h2>

          {/* Tabs */}
          <div
            className={
              isDesktopVariant
                ? "flex items-center gap-4 md:gap-6 justify-start md:justify-end"
                : "flex justify-center gap-6 md:gap-8 mb-3 md:mb-6"
            }
          >
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                className={`font-eurostile text-base md:text-xl transition-all ${
                  isDesktopVariant ? "cursor-pointer " : ""
                }${
                  activeSlide === slide.id
                    ? "font-bold text-black"
                    : "font-normal text-black opacity-60"
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className={`relative w-full overflow-hidden cursor-grab active:cursor-grabbing ${
            isDesktopVariant ? "rounded-3xl" : ""
          }`}
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
                <div
                  className={`relative w-full overflow-hidden ${
                    isDesktopVariant
                      ? "h-[60vh] max-h-[720px] min-h-[420px] rounded-3xl"
                      : "aspect-[2/3] xxs:h-[60vh] rounded-3xl"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.label}
                    className={`object-cover ${
                      slide.id === 0 ? "object-left" : "object-center grayscale blur-[3px]"
                    } ${isDesktopVariant ? "w-full h-full" : ""}`}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isDesktopVariant && slide.id === 0 && (
                    <div className="absolute bottom-12 right-25 hidden md:block z-[60] w-[20vw] pointer-events-none drop-shadow-lg">
                      <img
                        src="/qr-global.svg"
                        alt="Portal QR"
                        width={500}
                        height={500}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  {/* Title overlay */}
                  {(() => {
                    let overlayStyle: CSSProperties | undefined;
                    if (isDesktopVariant) {
                      if (slide.id === 0) {
                        overlayStyle = {
                          left: "60%",
                          top: "30%",
                          transform: "translate(-50%, -50%)",
                          maxWidth: "30rem",
                        };
                      } else {
                        overlayStyle = {
                          left: "28%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          maxWidth: "45rem",
                        };
                      }
                    }
                    return (
                  <div
                    className={`absolute z-10 ${
                      isDesktopVariant
                        ? "top-1/2 left-1/2 text-left"
                        : "top-4 left-4 right-4 md:top-6 md:left-6 m-5"
                    }`}
                    style={overlayStyle}
                  >
                    <h3 className="font-eurostile font-bold text-black text-2xl md:text-4xl lg:text-5xl leading-tight">
                      {slide.title.split('\n').map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < slide.title.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </h3>
                  </div>
                    );
                  })()}
                  {/* Coming Soon label - only for business slide */}
                  {slide.id === 1 && (
                    <div
                      className={`absolute z-10 px-8 py-5 md:px-12 md:py-8 ${
                        isDesktopVariant
                          ? "top-1/2 right-[6%] -translate-y-1/2"
                          : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      }`}
                    >
                      <h2 className="font-eurostile font-bold text-black text-3xl md:text-5xl lg:text-6xl tracking-tight bg-white/80 backdrop-blur-md rounded-lg px-4 py-2 text-center">
                        {isDesktopVariant ? (
                          <>
                            Coming
                            <br />
                            Soon
                          </>
                        ) : (
                          "Coming Soon"
                        )}
                      </h2>
                    </div>
                  )}
                  {/* Store links - only for first slide on non-desktop */}
                  {slide.id === 0 && !isDesktopVariant && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-6 z-10 flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                      <Link href="https://apps.apple.com/it/app/portal-digital-wallet/id6748541067" className="block">
                        <img
                          src="/appstore.webp"
                          alt="App Store"
                          width={240}
                          height={80}
                          className="object-contain store-badge"
                        />
                      </Link>
                      <Link href="https://play.google.com/store/apps/details?id=cc.getportal.portal" className="block">
                        <img
                          src="/playstore.webp"
                          alt="Play Store"
                          width={240}
                          height={80}
                          className="object-contain store-badge"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const CurrencyCarousel = memo(function CurrencyCarousel() {
  // Control variable for SVG symbol height - using viewport-based units for better responsiveness
  // Mobile: ~15vw (scales with viewport), Small: 128px, Medium: 160px, Large: 176px
  const symbolHeight = '22vw'; // Mobile - dynamic based on viewport
  const symbolHeightSm = 128; // Small screens (640px+)
  const symbolHeightMd = 160; // Medium screens (768px+)
  const symbolHeightLg = 176; // Large screens (1024px+)

  // Duplicate symbols for infinite loop
  const duplicationCount = 3;
  const totalSymbols = CAROUSEL_SYMBOLS.length;
  const duplicatedSymbols = useMemo(
    () => Array.from({ length: duplicationCount }, () => CAROUSEL_SYMBOLS).flat(),
    [duplicationCount]
  );
  const startIndex = totalSymbols; // Start in the middle section
  const resetThreshold = totalSymbols * (duplicationCount - 1);
  const maxIndex = duplicatedSymbols.length - 1;
  const transitionDurationMs = 500;
  
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isInstant, setIsInstant] = useState(false);
  const [needsReset, setNeedsReset] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const resetFrameRef = useRef<number | null>(null);
  const resumeFrameRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex > maxIndex) {
          return prevIndex;
        }

        if (nextIndex === resetThreshold) {
          setNeedsReset(true);
        }

        return nextIndex;
      });
    }, 2000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [maxIndex, resetThreshold]);

  const completeReset = useCallback(() => {
    setNeedsReset(false);
    setIsInstant(true);
    setCurrentIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    if (!needsReset) {
      return;
    }

    const trackEl = trackRef.current;
    const fallbackDelay = transitionDurationMs + 50;

    const handleReset = () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
      completeReset();
    };

    if (trackEl) {
      const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.propertyName !== "transform") return;
        handleReset();
      };

      trackEl.addEventListener("transitionend", handleTransitionEnd);
      resetTimeoutRef.current = window.setTimeout(handleReset, fallbackDelay);

      return () => {
        trackEl.removeEventListener("transitionend", handleTransitionEnd);
        if (resetTimeoutRef.current !== null) {
          window.clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = null;
        }
      };
    }

    resetTimeoutRef.current = window.setTimeout(handleReset, fallbackDelay);

    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, [needsReset, completeReset, transitionDurationMs]);

  useEffect(() => {
    if (!isInstant) {
      return;
    }

    if (resetFrameRef.current !== null) {
      cancelAnimationFrame(resetFrameRef.current);
      resetFrameRef.current = null;
    }

    if (resumeFrameRef.current !== null) {
      cancelAnimationFrame(resumeFrameRef.current);
      resumeFrameRef.current = null;
    }

    resetFrameRef.current = requestAnimationFrame(() => {
      resumeFrameRef.current = requestAnimationFrame(() => {
        setIsInstant(false);
        resumeFrameRef.current = null;
        resetFrameRef.current = null;
      });
    });

    return () => {
      if (resetFrameRef.current !== null) {
        cancelAnimationFrame(resetFrameRef.current);
        resetFrameRef.current = null;
      }
      if (resumeFrameRef.current !== null) {
        cancelAnimationFrame(resumeFrameRef.current);
        resumeFrameRef.current = null;
      }
    };
  }, [isInstant]);

  // Calculate the visual index for active state (use modulo to map back to original array)
  const visualIndex = currentIndex % totalSymbols;

  return (
    <div className="w-full pt-20 md:pt-32">
      <div className="overflow-hidden relative py-4 md:py-8" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ 
            transform: `translateX(calc(50% - ${currentIndex * 33.333333}% - 16.666667%))`,
            transition: isInstant ? 'none' : `transform ${transitionDurationMs}ms ease-out`
          }}
        >
          {duplicatedSymbols.map((symbol, index) => {
            const isActive = visualIndex === (index % totalSymbols);
            const src = `/letters-carousel/${encodeURIComponent(symbol)}.svg`;

            return (
              <div
                key={`${symbol}-${index}`}
                className="flex w-1/3 flex-shrink-0 items-center justify-center py-4"
                style={{ 
                  paddingLeft: 'clamp(2rem, 6vw, 8rem)', 
                  paddingRight: 'clamp(2rem, 6vw, 8rem)', 
                  boxSizing: 'border-box' 
                }}
              >
                <div
                  data-symbol-wrapper
                  className="flex items-center justify-center"
                  style={{
                    aspectRatio: '1 / 1',
                  }}
                >
                  <img
                    src={src}
                    alt={`${symbol} currency symbol`}
                    width={180}
                    height={180}
                    className={`transition-all duration-500 flex-shrink-0 ${isActive ? "blur-0 opacity-100" : "blur-sm opacity-60"}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      minWidth: 0,
                      minHeight: 0,
                      flexShrink: 0,
                      objectFit: 'contain',
                    }}
                    // Apply responsive sizes via CSS custom properties
                    data-symbol-height-sm={symbolHeightSm}
                    data-symbol-height-md={symbolHeightMd}
                    data-symbol-height-lg={symbolHeightLg}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        img[data-symbol-height-sm] {
          width: ${symbolHeight};
          height: ${symbolHeight};
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
        /* Ensure wrapper maintains square aspect ratio responsively */
        [data-symbol-wrapper] {
          width: ${symbolHeight};
          height: ${symbolHeight};
          min-width: ${symbolHeight};
          min-height: ${symbolHeight};
        }
        @media (min-width: 640px) {
          [data-symbol-wrapper] {
            width: ${symbolHeightSm}px !important;
            height: ${symbolHeightSm}px !important;
            min-width: ${symbolHeightSm}px !important;
            min-height: ${symbolHeightSm}px !important;
          }
        }
        @media (min-width: 768px) {
          [data-symbol-wrapper] {
            width: ${symbolHeightMd}px !important;
            height: ${symbolHeightMd}px !important;
            min-width: ${symbolHeightMd}px !important;
            min-height: ${symbolHeightMd}px !important;
          }
        }
        @media (min-width: 1024px) {
          [data-symbol-wrapper] {
            width: ${symbolHeightLg}px !important;
            height: ${symbolHeightLg}px !important;
            min-width: ${symbolHeightLg}px !important;
            min-height: ${symbolHeightLg}px !important;
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
    <div
      id="page6-hero-mobile"
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#FFED00" }}
    >
      <BlackLogoOverlay />
      <div className="relative z-50 flex flex-col gap-4 items-center justify-center text-center px-6">
        <h1 className="font-eurostile font-bold tracking-tight text-4xl sm:text-4xl text-black xxs:text-3xl">
          BE THE ONE IN CONTROL, TRUST NOTHING
        </h1>
        <img
          src="/cross-gray.webp"
          alt="Cross"
          width={800}
          height={800}
          className="mt-2 w-[90vw] h-auto max-h-[50vh] object-cover"
        />
      </div>
    </div>
  );
}

export function Page6CurrencyIntro() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col text-left w-full mb-8 px-6 max-w-2xl">
          <h2 className="font-eurostile font-bold tracking-tight text-2xl sm:text-3xl text-black mb-4">
            Works with <br /> all currency
          </h2>
          <p className="text-base sm:text-lg text-black">
          From instant global authentication to secure digital interactions, we're redefining how people connect with both the digital and physical world. 
          We leverage Bitcoin as an agnostic payment network.
          </p>
        </div>
        <div className="relative z-50 w-full">
          <CurrencyCarousel />
        </div>
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
    <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col text-left w-full mb-8 px-6 max-w-2xl">
          <h2 className="font-eurostile font-bold tracking-tight text-2xl sm:text-3xl text-black mb-4">
            Easy, Simple and secure
          </h2>
          <p className="text-base sm:text-lg text-black">
          We're building Portal as the solution we wished existed: combining the security of Bitcoin, the convenience of passwordless authentication, and a user experience that feels like magic.
          </p>
        </div>
        <div className="relative z-50 w-full flex items-center justify-center mt-8">
          <img
            src="/page6-circle.svg"
            alt=""
            width={400}
            height={400}
            className="w-auto h-auto max-w-[80vw]"
          />
        </div>
      </div>
    </div>
  );
}

export function Page6DailyLifeHero() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-2xl">
        <h2 className="font-eurostile font-semibold tracking-tight text-xl sm:text-2xl text-black mb-3">
          P+RTAL
          <br />
          Is the smartest
          choice for your daily life
        </h2>
        <div className="flex justify-center w-full">
          <div className="relative w-full aspect-[2/3] overflow-hidden xxs:h-[60vh]">
            <img
              src="/Rectangle.webp"
              alt="Portal Rectangle"
              className="object-cover"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Page6DailyLifeFeatures() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-2xl">
        <div className="w-full flex flex-col">
          <div className="flex flex-row items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/confirmation_number.svg"
                alt="Tickets"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1 flex items-center min-h-12">
              <h3 className="font-eurostile font-bold text-lg sm:text-xl text-black leading-tight">
                Tickets? No problem
              </h3>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3" style={{ marginTop: '10vh', marginBottom: '10vh' }}>
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/assignment_ind.svg"
                alt="Identity"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1 flex items-center min-h-12">
              <h3 className="font-eurostile font-bold text-lg sm:text-xl text-black leading-tight">
                Your identity, fully secured
              </h3>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/cached.svg"
                alt="Control"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1 flex items-center min-h-12">
              <h3 className="font-eurostile font-bold text-lg sm:text-xl text-black leading-tight">
                Take control of your money
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Page6BusinessHero() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-2xl">
        <h2 className="font-eurostile font-semibold tracking-tight text-xl sm:text-2xl text-black mb-3">
          P+RTAL
          <br />
          gives you complete
          control over your business
        </h2>
        <div className="flex justify-center w-full">
          <div className="relative w-full aspect-[2/3] overflow-hidden xxs:h-[60vh]">
            <img
              src="/Rectangle2.webp"
              alt="Portal Rectangle"
              className="object-cover"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Page6BusinessFeatures() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#FFED00" }}>
      <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-2xl">
        <div className="w-full flex flex-col">
          <div className="flex flex-row items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/do_not_touch.svg"
                alt="Hand"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1 flex items-center min-h-12">
              <h3 className="font-eurostile font-bold text-lg sm:text-xl text-black leading-tight">
                Only you and your customer
              </h3>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3" style={{ marginTop: '10vh', marginBottom: '10vh' }}>
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/sell.svg"
                alt="Sell"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1 flex items-center min-h-12">
              <h3 className="font-eurostile font-bold text-lg sm:text-xl text-black leading-tight">
                Sell tickets effortlessly
              </h3>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/cached.svg"
                alt="Control"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1 flex items-center min-h-12">
              <h3 className="font-eurostile font-bold text-lg sm:text-xl text-black leading-tight">
                Intruders are kept out
              </h3>
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

