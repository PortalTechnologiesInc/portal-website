"use client";

import Image from "next/image";
import { useRef } from "react";
import { useStaggeredScrollRise } from "../hooks/useStaggeredScrollRise";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page2({ scrollContainerRef }: Props) {
  // Step 2 icons animation refs - Mobile
  const step2IconsRef = useRef<HTMLDivElement | null>(null);
  const step2SadRef = useRef<HTMLDivElement | null>(null);
  const step2EurRef = useRef<HTMLDivElement | null>(null);
  const step2LockRef = useRef<HTMLDivElement | null>(null);

  // Step 2 icons animation refs - Desktop
  const step2IconsDesktopRef = useRef<HTMLDivElement | null>(null);
  const step2SadDesktopRef = useRef<HTMLDivElement | null>(null);
  const step2EurDesktopRef = useRef<HTMLDivElement | null>(null);
  const step2LockDesktopRef = useRef<HTMLDivElement | null>(null);

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

  // Same animation for desktop icons
  useStaggeredScrollRise(
    step2IconsDesktopRef as React.RefObject<HTMLElement | null>,
    [step2SadDesktopRef, step2EurDesktopRef, step2LockDesktopRef] as Array<
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
    <>
      {/* Desktop Layout: Text vertically centered */}
      <div className="relative z-50 h-full flex flex-col md:flex-row md:items-center md:justify-start px-0 md:px-6 md:max-w-[98rem] md:mx-auto">
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

        {/* Desktop: Right side icons group - positioned center right of text block */}
        <div className="hidden lg:-mt-120 md:-mt-80 md:flex absolute inset-y-0 right-0 items-center pointer-events-none md:right-6 lg:right-12">
          <div
            ref={step2IconsDesktopRef}
            className="flex items-center justify-end lg:scale-130"
          >
            <div className="flex flex-col w-[22rem] lg:w-[26rem]">
              <div ref={step2SadDesktopRef} className="self-start">
                <Image
                  src="/sentiment_sad.svg"
                  alt="Sad symbol"
                  width={150}
                  height={150}
                  className="rotate-[12.31deg] blur-md lg:w-[180px] lg:h-[180px]"
                />
              </div>
              <div ref={step2EurDesktopRef} className="-mt-20 self-end">
                <Image
                  src="/euro_symbol.svg"
                  alt="Euro symbol"
                  width={190}
                  height={190}
                  className="rotate-[15deg] blur-md lg:w-[230px] lg:h-[230px]"
                />
              </div>
              <div ref={step2LockDesktopRef} className="-mt-16 lg:-mt-32 lg:-ml-16 self-start">
                <Image
                  src="/lock.svg"
                  alt="Lock symbol"
                  width={230}
                  height={230}
                  className="rotate-[-15.69deg] blur-md lg:w-[320px] lg:h-[320px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Bottom icons group: column, aggregated */}
      <div
        ref={step2IconsRef}
        className="absolute inset-x-0 flex justify-center md:hidden
           bottom-[clamp(12rem,40svh,20rem)]
           sm:bottom-[clamp(13rem,42svh,20rem)]"
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

    </>
  );
}
