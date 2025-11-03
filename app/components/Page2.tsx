"use client";

import Image from "next/image";
import { useRef } from "react";
import { useStaggeredScrollRise } from "../hooks/useStaggeredScrollRise";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page2({ scrollContainerRef }: Props) {
  // Step 2 icons animation refs
  const step2IconsRef = useRef<HTMLDivElement | null>(null);
  const step2SadRef = useRef<HTMLDivElement | null>(null);
  const step2EurRef = useRef<HTMLDivElement | null>(null);
  const step2LockRef = useRef<HTMLDivElement | null>(null);

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
    <>
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
    </>
  );
}
