"use client";

import Image from "next/image";

export function Page7() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
      {/* Behind the P+RTAL company section */}
      <div className="relative z-50 flex flex-col items-center justify-center px-6 py-32 md:py-40 lg:py-48">
        <h2 className="font-eurostile font-semibold tracking-tight text-xl md:text-6xl lg:text-7xl text-black mb-4">
          Behind the P+RTAL company
        </h2>
        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-2xl aspect-[2/3] overflow-hidden">
            <Image
              src="/company.jpg"
              alt="Behind the P+RTAL company"
              fill
              className="object-cover grayscale"
              sizes="(min-width: 768px) 672px, 100vw"
            />
          </div>
        </div>

        {/* Spacing */}
        <div className="relative z-50 py-20 md:py-40 lg:py-48"></div>

        {/* Paragraphs */}
        <div className="relative z-50 flex flex-col px-6 max-w-4xl w-full">
          <p className="text-lg md:text-xl lg:text-xl text-black mb-6">
            Lorem ipsum dolor sit amet consectetur. Adipiscing tempor cursus quis eros ligula
            <br />
            aliquam ultrices egestas tellus.
          </p>
          <p className="text-lg md:text-xl lg:text-xl text-black">
            Elementum sed tincidunt sit risus. Porttitor viverra euismod neque pellentesque id. Tempus fusce vivamus consectetur vitae
            <br />
            sed habitant.
          </p>
        </div>
      </div>
    </div>
  );
}

