"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Image from "next/image";
import ContactCarousel from "./components/ContactCarousel";
import ParallaxImage from "./components/ParallaxImage";

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const euroLockStep = useRef(0); // 0 = Euro visible, 1 = Lock visible
  const isAnimating = useRef(false);

  // Restore original working functionality
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
            const startingTranslate = target.style.transform?.includes("1.5rem")
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

  // PROPER anime.js Euro-Lock animation with touch events
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    // Get elements
    const euroSvg = document.querySelector("[data-euro-svg]") as HTMLElement;
    const lockSvg = document.querySelector("[data-lock-svg]") as HTMLElement;
    const initialText = document.querySelector(
      "[data-initial-text]"
    ) as HTMLElement;
    const newText = document.querySelector("[data-new-text]") as HTMLElement;

    if (!euroSvg || !lockSvg || !initialText || !newText) {
      console.log("❌ Missing animation elements");
      return;
    }

    // Check if we're in Euro section
    const checkIfInEuroSection = () => {
      const euroSection = sectionRefs.current[2];
      if (!euroSection) return false;
      const rect = euroSection.getBoundingClientRect();
      return Math.abs(rect.top) < 100;
    };

    // Animation function using anime.js properly
    const animateToLockStep = (targetStep: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      if (targetStep === 1) {
        // Euro -> Lock
        animate(euroSvg, {
          translateX: -200,
          filter: "blur(10px)",
          opacity: 0.5,
          duration: 600,
          easing: "easeOutQuad",
        });
        animate(lockSvg, {
          translateX: 0,
          opacity: 1,
          duration: 600,
          easing: "easeOutQuad",
        });
        animate(initialText, {
          opacity: 0,
          translateY: -20,
          duration: 600,
          easing: "easeOutQuad",
        });
        animate(newText, {
          opacity: 1,
          translateY: 0,
          duration: 600,
          easing: "easeOutQuad",
        });
      } else {
        // Lock -> Euro
        animate(euroSvg, {
          translateX: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 600,
          easing: "easeOutQuad",
        });
        animate(lockSvg, {
          translateX: 200,
          opacity: 0,
          duration: 600,
          easing: "easeOutQuad",
        });
        animate(initialText, {
          opacity: 1,
          translateY: 0,
          duration: 600,
          easing: "easeOutQuad",
        });
        animate(newText, {
          opacity: 0,
          translateY: 20,
          duration: 600,
          easing: "easeOutQuad",
        });
      }

      setTimeout(() => {
        isAnimating.current = false;
        euroLockStep.current = targetStep;
      }, 650);
    };

    // Touch event handlers following anime.js best practices
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!checkIfInEuroSection() || isAnimating.current) return;

      touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;

      if (Math.abs(swipeDistance) < 50) return;

      if (swipeDistance > 0 && euroLockStep.current === 0) {
        // Swipe up -> Euro to Lock
        e.preventDefault();
        animateToLockStep(1);
      } else if (swipeDistance < 0 && euroLockStep.current === 1) {
        // Swipe down -> Lock to Euro
        e.preventDefault();
        animateToLockStep(0);
      }
    };

    // Wheel event handler
    const handleWheel = (e: WheelEvent) => {
      if (!checkIfInEuroSection() || isAnimating.current) return;

      if (e.deltaY > 0 && euroLockStep.current === 0) {
        // Scroll down -> Euro to Lock
        e.preventDefault();
        animateToLockStep(1);
      } else if (e.deltaY < 0 && euroLockStep.current === 1) {
        // Scroll up -> Lock to Euro
        e.preventDefault();
        animateToLockStep(0);
      }
    };

    // Add event listeners
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Block ALL scrolling from Lock step (prevents going to step 2 or next section)
  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (euroLockStep.current === 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (euroLockStep.current === 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (euroLockStep.current === 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const scrollContainer = document.querySelector(
      "div.h-dvh.overflow-y-scroll"
    ) as HTMLElement | null;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: false,
      });
      scrollContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      scrollContainer.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
        scrollContainer.removeEventListener("wheel", handleWheel);
        scrollContainer.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, []);

  return (
    <div className="h-dvh overflow-y-scroll overflow-x-hidden scroll-smooth snap-y snap-mandatory">
      {/* Step 1: Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="relative min-h-dvh snap-start bg-white pt-20"
        style={{ color: "#141416" }}
      >
        {/* Parallax Image */}
        <ParallaxImage />

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
        <div className="px-6 text-left max-w-4xl m-2 relative z-50">
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

      {/* Step 2: Payments Section */}
      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="min-h-dvh snap-start text-white px-6 relative z-40 pt-20"
        style={{ backgroundColor: "#141416" }}
      >
        <div className="max-w-4xl text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
            Payments and Wallets
            <br />
            have a fundamental problem: they're stuck in a paradox.
          </h1>
          <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl leading-tight text-white opacity-90">
            Lorem ipsum dolor sit amet consectetur. Pretium nibh nibh magna
            cursus purus hendrerit congue habitant. Mi scelerisque cursus nibh
            ipsum vel id.
          </p>
        </div>
      </section>

      {/* Step 3: Euro Section */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="min-h-dvh snap-start flex items-center justify-center text-white px-6 relative z-40"
        style={{ backgroundColor: "#141416" }}
      >
        <div className="max-w-4xl mx-auto text-center relative">
          {/* SVG Container */}
          <div className="relative mb-8 h-[7.03125rem] flex items-center justify-center">
            {/* Euro SVG - moves left with blur */}
            <div
              data-euro-svg
              className="absolute transition-all duration-1000 ease-out"
              style={{
                transform: "translateX(0)",
                filter: "blur(0px)",
                opacity: 1,
              }}
            >
              <Image
                src="/euro_symbol.svg"
                alt="Euro symbol"
                width={112.5}
                height={112.5}
                className="w-[7.03125rem] h-[7.03125rem]"
              />
            </div>

            {/* Lock SVG - comes from right */}
            <div
              data-lock-svg
              className="absolute transition-all duration-1000 ease-out"
              style={{
                transform: "translateX(200px)",
                opacity: 0,
              }}
            >
              <Image
                src="/lock.svg"
                alt="Lock symbol"
                width={112.5}
                height={112.5}
                className="w-[7.03125rem] h-[7.03125rem]"
              />
            </div>
          </div>

          {/* Text Container */}
          <div className="relative">
            {/* Initial Text - Euro */}
            <div
              data-initial-text
              className="transition-all duration-1000 ease-out"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
                High costs
              </h1>
              <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto leading-tight text-white opacity-90">
                Commissions imposed by banks and payment processors eat into
                your profits, especially for small and medium-sized businesses.
              </p>
            </div>

            {/* New Text - Lock */}
            <div
              data-new-text
              className="absolute top-0 left-0 w-full transition-all duration-1000 ease-out"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
              }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
                Technological "Lock-in"
              </h1>
              <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto leading-tight text-white opacity-90">
                Companies are often trapped in proprietary ecosystems, which
                limit their freedom and make it difficult to change providers or
                integrate new solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
