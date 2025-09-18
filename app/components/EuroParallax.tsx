"use client";

import Image from "next/image";
import { useRef } from "react";
import { useEuroParallax } from "../hooks/useEuroParallax";

type Props = {
  isActiveRef: React.RefObject<number>;
  euroRef?: React.RefObject<HTMLDivElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
};

export function EuroParallax({ isActiveRef, euroRef, containerRef }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEuroParallax(wrapperRef, isActiveRef, containerRef);

  return (
    <div
      data-euro-parallax
      ref={wrapperRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform: "translateY(-200px)", opacity: 0 }}
    >
      <div data-euro-svg ref={euroRef} style={{ filter: "blur(0px)" }}>
        <Image
          src="/euro_symbol.svg"
          alt="Euro symbol"
          width={112.5}
          height={112.5}
          className="w-[7.03125rem] h-[7.03125rem]"
        />
      </div>
    </div>
  );
}
