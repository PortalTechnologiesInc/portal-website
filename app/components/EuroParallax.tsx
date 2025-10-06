"use client";

import Image from "next/image";
import { useRef } from "react";
import { useEuroParallax } from "../hooks/useEuroParallax";

type Props = {
  isActiveRef: React.RefObject<number>;
  euroRef?: React.RefObject<HTMLDivElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
  staticMode?: boolean;
};

export function EuroParallax({
  isActiveRef,
  euroRef,
  containerRef,
  staticMode,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // Always call the hook to preserve order; when staticMode, the wrapper ref won't be used for transforms
  useEuroParallax(
    staticMode ? { current: null } : wrapperRef,
    isActiveRef,
    containerRef
  );

  return (
    <div
      data-euro-parallax
      ref={wrapperRef}
      className="absolute inset-0 flex items-center justify-center"
      style={
        staticMode ? undefined : { transform: "translateY(-200px)", opacity: 0 }
      }
    >
      <div data-euro-svg ref={euroRef} style={{ filter: "blur(0px)" }}>
        <Image
          src="/euro_symbol.svg"
          alt="Euro symbol"
          width={120}
          height={120}
          className="w-[7.5rem] h-[7.5rem]"
        />
      </div>
    </div>
  );
}
