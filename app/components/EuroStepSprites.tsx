"use client";

import Image from "next/image";

type Props = {
  lockRef?: React.RefObject<HTMLDivElement | null>;
  sadRef?: React.RefObject<HTMLDivElement | null>;
};

export function EuroStepSprites({ lockRef, sadRef }: Props) {
  return (
    <>
      {/* Lock SVG - comes from right */}
      <div
        data-lock-svg
        ref={lockRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
        style={{
          transform: "translateX(200px)",
          opacity: 0,
        }}
      >
        <Image
          src="/lock.svg"
          alt="Lock symbol"
          width={128}
          height={128}
          className="w-[8rem] h-[8rem]"
        />
      </div>

      {/* Sad SVG - comes from right */}
      <div
        data-sad-svg
        ref={sadRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
        style={{
          transform: "translateX(200px)",
          opacity: 0,
        }}
      >
        <Image
          src="/sentiment_sad.svg"
          alt="Sad symbol"
          width={120}
          height={120}
          className="w-[7.5rem] h-[7.5rem]"
        />
      </div>
    </>
  );
}
