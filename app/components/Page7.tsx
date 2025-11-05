"use client";

import Image from "next/image";

export function Page7() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-dvh" style={{ backgroundColor: "#ffffff" }}>
      {/* Behind the P+RTAL company section */}
      <div className="relative z-50 flex flex-col items-center justify-center px-6 py-32 md:py-40 lg:py-48">
        <h2 className="font-eurostile font-semibold tracking-tight text-xl md:text-6xl lg:text-7xl text-black mb-4">
          Behind the P+RTAL company
        </h2>
        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-full aspect-[2/3] overflow-hidden">
            <Image
              src="/Rectangle.png"
              alt="Behind the P+RTAL company"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

