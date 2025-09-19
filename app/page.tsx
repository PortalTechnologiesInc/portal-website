"use client";

import { useRef } from "react";
import { useRevealOnIntersect } from "./hooks/useRevealOnIntersect";
import { useStepMachine } from "./hooks/useStepMachine";
import Image from "next/image";
import ContactCarousel from "./components/ContactCarousel";
import ParallaxImage from "./components/ParallaxImage";
import { EuroParallax } from "./components/EuroParallax";
import { EuroStepSprites } from "./components/EuroStepSprites";
import { EuroStepTexts } from "./components/EuroStepTexts";
import { useStaggeredScrollRise } from "./hooks/useStaggeredScrollRise";

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const euroLockStep = useRef(0); // 0 = Euro visible, 1 = Lock visible
  // Step machine element refs
  const euroRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef<HTMLDivElement | null>(null);
  const sadRef = useRef<HTMLDivElement | null>(null);
  const initialTextRef = useRef<HTMLDivElement | null>(null);
  const newTextRef = useRef<HTMLDivElement | null>(null);
  const sadTextRef = useRef<HTMLDivElement | null>(null);
  // step animation state handled by useStepMachine hook

  // Step 2 icons animation refs
  const step2IconsRef = useRef<HTMLDivElement | null>(null);
  const step2SadRef = useRef<HTMLDivElement | null>(null);
  const step2EurRef = useRef<HTMLDivElement | null>(null);
  const step2LockRef = useRef<HTMLDivElement | null>(null);

  useRevealOnIntersect(
    () => sectionRefs.current.filter(Boolean) as HTMLElement[]
  );
  useStepMachine(
    sectionRefs,
    euroLockStep,
    {
      euro: euroRef,
      lock: lockRef,
      sad: sadRef,
      initialText: initialTextRef,
      newText: newTextRef,
      sadText: sadTextRef,
    },
    scrollContainerRef
  );

  useStaggeredScrollRise(
    step2IconsRef as React.RefObject<HTMLElement | null>,
    [step2SadRef, step2EurRef, step2LockRef] as Array<
      React.RefObject<HTMLElement | null>
    >,
    scrollContainerRef,
    {
      distancePx: 280,
      continueDistancePx: 300,
      delaysMs: [0, 150, 300],
      start: 0.25,
      end: 0.8,
      continueIntoNext: true,
      respectReducedMotion: false,
    }
  );

  return (
    <div
      ref={(el) => {
        scrollContainerRef.current = el as unknown as HTMLElement;
      }}
      className="h-dvh overflow-y-scroll overflow-x-hidden scroll-smooth snap-y snap-mandatory"
    >
      {/* Step 1: Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="relative min-h-dvh snap-start bg-white text-[#141416] pt-20"
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
        className="min-h-dvh snap-start text-white px-6 relative z-40 pt-28 md:pt-36"
      >
        <div className="max-w-4xl text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 leading-tight font-eurostile text-white">
            Payments and Wallets
            <br />
            have a fundamental problem: they're stuck in a paradox.
          </h1>
          <p className="text-xl md:text-xl font-normal mb-8 max-w-2xl leading-tight text-white opacity-90">
            Lorem ipsum dolor sit amet consectetur. Pretium nibh nibh magna
            cursus purus hendrerit congue habitant. Mi scelerisque cursus nibh
            ipsum vel id.
          </p>
        </div>

        {/* Bottom icons group: column, aggregated */}
        <div
          ref={step2IconsRef}
          className="absolute inset-x-0 flex justify-center
             bottom-[clamp(12rem,40svh,20rem)]
             sm:bottom-[clamp(13rem,42svh,20rem)]
             md:bottom-[clamp(14rem,44svh,20rem)]"
        >
          <div className="flex flex-col w-[14rem]">
            <div ref={step2SadRef} className="self-start">
              <Image
                src="/sentiment_sad.svg"
                alt="Sad symbol"
                width={93}
                height={93}
                className="rotate-[12.31deg] blur-md"
              />
            </div>
            <div ref={step2EurRef} className="-mt-20 self-end">
              <Image
                src="/euro_symbol.svg"
                alt="Euro symbol"
                width={116}
                height={116}
                className="rotate-[15deg] blur-md"
              />
            </div>
            <div ref={step2LockRef} className="-mt-16 self-start">
              <Image
                src="/lock.svg"
                alt="Lock symbol"
                width={139}
                height={139}
                className="rotate-[-15.69deg] blur-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Euro Section */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="min-h-dvh snap-start flex items-center justify-center text-white px-6 relative z-40"
      >
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Column layout: sprites on top, texts below */}
          <div className="relative flex flex-col items-center justify-center gap-10 w-full">
            <div className="relative h-[7.03125rem] flex items-center justify-center w-full">
              <EuroParallax
                isActiveRef={euroLockStep}
                euroRef={euroRef}
                containerRef={scrollContainerRef}
              />
              <EuroStepSprites lockRef={lockRef} sadRef={sadRef} />
            </div>

            <EuroStepTexts
              initialTextRef={initialTextRef}
              newTextRef={newTextRef}
              sadTextRef={sadTextRef}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
