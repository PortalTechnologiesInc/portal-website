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
        className="absolute inset-0 flex items-center justify-center"
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

      {/* Sad SVG - comes from right */}
      <div
        data-sad-svg
        ref={sadRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: "translateX(200px)",
          opacity: 0,
        }}
      >
        <Image
          src="/sentiment_sad.svg"
          alt="Sad symbol"
          width={112.5}
          height={112.5}
          className="w-[7.03125rem] h-[7.03125rem]"
        />
      </div>
    </>
  );
}
