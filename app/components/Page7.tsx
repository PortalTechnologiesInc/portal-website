"use client";

import Image from "next/image";

export function Page7() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-y-auto" style={{ backgroundColor: "#ffffff" }}>
      {/* Behind the P+RTAL company section */}
      <div className="relative z-50 flex flex-col items-center justify-center px-6 py-8 md:py-12 lg:py-16 w-full max-w-4xl">
        <h2 className="font-eurostile font-semibold tracking-tight text-xl md:text-4xl lg:text-5xl text-black mb-4 md:mb-6">
          Behind the P+RTAL company
        </h2>
        <div className="flex justify-center w-full mb-6 md:mb-8">
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl aspect-[3/4] overflow-hidden" style={{ maxHeight: '30vh' }}>
            <Image
              src="/company.jpg"
              alt="Behind the P+RTAL company"
              fill
              className="object-cover grayscale"
              sizes="(min-width: 1024px) 512px, (min-width: 768px) 448px, 100vw"
            />
          </div>
        </div>

        {/* Paragraphs */}
        <div className="relative z-50 flex flex-col max-w-4xl w-full pb-8 md:pb-12 mt-5">
          <p className="text-lg md:text-xl lg:text-2xl text-black mb-4 md:mb-6 xxs:text-base">
            "Lorem ipsum dolor sit amet consectetur. Adipiscing tempor cursus quis eros ligula
            <br />
            aliquam ultrices egestas tellus.
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-black xxs:text-base">
            Elementum sed tincidunt sit risus. Porttitor viverra euismod neque pellentesque id. Tempus fusce vivamus consectetur vitae
            <br />
            sed habitant."
          </p>
        </div>
      </div>
    </div>
  );
}

