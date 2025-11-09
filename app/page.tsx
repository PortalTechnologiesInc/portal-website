"use client";

import { useRef } from "react";
import { Page1 } from "./components/Page1";
import { Page2 } from "./components/Page2";
import { Page3 } from "./components/Page3";
import { Page3a } from "./components/Page3a";
import { Page3b } from "./components/Page3b";
import { Page3c } from "./components/Page3c";
import { LogoManager } from "./components/LogoManager";
import { Page4 } from "./components/Page4";
import { Page5 } from "./components/Page5";
import { Page5a } from "./components/Page5a";
import { Page5b } from "./components/Page5b";
import { Page5c } from "./components/Page5c";
import {
  Page6Hero,
  Page6CurrencyIntro,
  Page6CurrencyCarouselSection,
  Page6EasySecure,
  Page6DailyLifeHero,
  Page6DailyLifeFeatures,
  Page6BusinessHero,
  Page6BusinessFeatures,
  Page6TakeStep,
} from "./components/Page6";
import { Page6Desktop } from "./components/Page6Desktop";
import { Page7 } from "./components/Page7";
import Footer from "./components/Footer";

export default function Home() {
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  return (
    <div
      ref={(el) => {
        scrollContainerRef.current = el;
      }}
      className="snap-container"
      id="main-scroll-container"
    >
      <section
        data-section="page1"
        data-reveal
        className="snap-section relative flex-none bg-white text-[#141416]"
      >
        <div className="h-full w-full flex items-center justify-center pt-20">
          <Page1 />
        </div>
      </section>

      <section
        data-section="page2"
        data-page="page2"
        data-reveal
        className="snap-section relative z-40 flex-none text-white md:[&>*]:mx-auto md:[&>*]:max-w-[95rem]"
      >
        <div className="h-full w-full flex items-center justify-center px-6 pt-28 md:pt-36">
          <Page2 scrollContainerRef={scrollContainerRef} />
        </div>
      </section>

      <section
        data-section="page3-mobile"
        data-page="page3"
        data-reveal
        className="snap-section relative z-40 flex-none text-white md:hidden"
      >
        <div className="h-full w-full flex items-center justify-center">
          <Page3 scrollContainerRef={scrollContainerRef} />
        </div>
      </section>

      <section
        data-section="page3a"
        data-page="page3"
        data-reveal
        className="snap-section-desktop relative z-40 hidden flex-none text-white md:block"
      >
        <div className="h-full w-full flex items-center justify-center">
          <Page3a />
        </div>
      </section>

      <section
        data-section="page3b"
        data-page="page3"
        data-reveal
        className="snap-section-desktop relative z-40 hidden flex-none text-white md:block"
      >
        <div className="h-full w-full flex items-center justify-center">
          <Page3b />
        </div>
      </section>

      <section
        data-section="page3c"
        data-page="page3"
        data-reveal
        className="snap-section-desktop relative z-40 hidden flex-none text-white md:block"
      >
        <div className="h-full w-full flex items-center justify-center">
          <Page3c />
        </div>
      </section>

      <div className="relative" style={{ display: "contents" }}>
        <div
          data-logo-yellow
          className="pointer-events-none fixed left-1/2 overflow-hidden"
          style={{
            transformOrigin: "center center",
            zIndex: 30,
            opacity: 0,
            top: "100vh",
            transform: "translate(-50%, -50%)",
            width: "40px",
            height: "40px",
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
            }}
          >
            <path
              data-logo-path
              d="M174.011 1.5C174.029 17.4525 174.358 29.8097 175.814 39.3369C177.317 49.1665 180.048 56.2148 185.089 61.127C190.126 66.0356 197.249 68.5948 207.03 69.9609C216.506 71.2844 228.703 71.5115 244.313 71.5244V138.475C228.7 138.488 216.501 138.716 207.024 140.039C197.243 141.405 190.12 143.965 185.084 148.873C180.044 153.785 177.314 160.834 175.812 170.663C174.358 180.19 174.029 192.548 174.011 208.5H71.8027C71.7841 192.547 71.455 180.19 69.999 170.663C68.4968 160.833 65.7646 153.785 60.7236 148.873C55.6863 143.965 48.5641 141.405 38.7832 140.039C29.3072 138.716 17.1101 138.488 1.5 138.475V71.5244C17.1136 71.5115 29.3124 71.2845 38.7891 69.9609C48.5707 68.5948 55.693 66.0356 60.7295 61.127C65.7696 56.2148 68.4999 49.1664 70.001 39.3369C71.4559 29.8097 71.7842 17.4525 71.8027 1.5H174.011Z"
              stroke="#FFED00"
              strokeWidth="3"
            />
          </svg>
        </div>

        <LogoManager scrollContainerRef={scrollContainerRef} />

        <section
          data-section="page4"
          data-page="page4"
          data-reveal
          className="snap-section relative z-40 flex-none text-white md:[&>*]:mx-auto md:[&>*]:max-w-[95rem]"
        >
          <div className="h-full w-full flex items-center justify-center">
            <Page4 scrollContainerRef={scrollContainerRef} />
          </div>
        </section>

        <section
          data-section="page5-main"
          data-page="page5"
          data-reveal
          className="snap-section relative flex-none bg-white md:[&>*]:mx-auto md:[&>*]:max-w-[95rem]"
        >
          <div className="h-full w-full flex items-center justify-center md:hidden">
            <Page5 scrollContainerRef={scrollContainerRef} />
          </div>
          <div className="hidden h-full w-full items-center justify-center md:flex">
            <Page5a />
          </div>
        </section>
      </div>

      <section
        data-section="page5b"
        data-page="page5"
        data-reveal
        className="snap-section-desktop relative hidden flex-none bg-white md:block md:[&>*]:mx-auto md:[&>*]:max-w-[95rem]"
      >
        <div className="h-full w-full flex items-center justify-center">
          <Page5b />
        </div>
      </section>

      <section
        data-section="page5c"
        data-page="page5"
        data-reveal
        className="snap-section-desktop relative hidden flex-none bg-white md:block md:[&>*]:mx-auto md:[&>*]:max-w-[95rem]"
      >
        <div className="h-full w-full flex items-center justify-center">
          <Page5c />
        </div>
      </section>

      <section
        data-section="page6-hero-mobile"
        data-reveal
        className="snap-section relative flex-none md:hidden"
      >
        <div className="h-full w-full">
          <Page6Hero />
        </div>
      </section>

      <section
        data-section="page6-currency-intro-mobile"
        data-reveal
        className="snap-section relative flex-none md:hidden"
      >
        <div className="h-full w-full">
          <Page6CurrencyIntro />
        </div>
      </section>

      <section
        data-section="page6-easy-secure-mobile"
        data-reveal
        className="snap-section relative flex-none md:hidden"
      >
        <div className="h-full w-full">
          <Page6EasySecure />
        </div>
      </section>

      <section
        data-section="page6-daily-life-hero-mobile"
        data-reveal
        className="snap-section relative flex-none md:hidden"
      >
        <div className="h-full w-full">
          <Page6DailyLifeHero />
        </div>
      </section>

      <section
        data-section="page6-daily-life-features-mobile"
        data-reveal
        className="snap-section relative flex-none md:hidden"
      >
        <div className="h-full w-full">
          <Page6DailyLifeFeatures />
        </div>
      </section>

      <section
        data-section="page6-business-hero-mobile"
        data-reveal
        className="snap-section relative flex-none md:hidden"
      >
        <div className="h-full w-full">
          <Page6BusinessHero />
        </div>
      </section>

      <section
        data-section="page6-business-features-mobile"
        data-reveal
        className="snap-section relative flex-none md:hidden"
      >
        <div className="h-full w-full">
          <Page6BusinessFeatures />
        </div>
      </section>

      <section
        data-section="page6-take-step-mobile"
        data-reveal
        className="snap-section relative flex-none md:hidden"
      >
        <div className="h-full w-full">
          <Page6TakeStep />
        </div>
      </section>

      <Page6Desktop />

      <section
        data-section="page7"
        data-reveal
        className="snap-section relative flex-none bg-white md:snap-section-desktop md:[&>*]:mx-auto md:[&>*]:max-w-[95rem]"
      >
        <div className="h-full w-full flex items-center justify-center">
          <Page7 />
        </div>
      </section>

      <section
        data-section="footer"
        className="snap-section-desktop snap-free bg-[#141416] flex-none"
      >
        <div className="h-full w-full flex items-center justify-center">
          <Footer />
        </div>
      </section>
    </div>
  );
}
