"use client";

import Image from "next/image";

export function Page7() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-white">
      <div className="flex w-full flex-col gap-12 text-black px-6 md:px-12 lg:px-20 xl:px-32 py-12 md:py-20 max-w-[100rem]">
        <h2 className="text-left font-eurostile text-4xl md:text-4xl lg:text-4xl font-semibold tracking-tight">
          Behind the P+RTAL company
        </h2>
        <div className="flex w-full flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <div className="relative w-full md:w-[40vw] aspect-[3/2] overflow-hidden rounded-xl">
            <Image
              src="/company.jpg"
              alt="Behind the P+RTAL company"
              fill
              className="object-cover grayscale"
              sizes="(min-width: 1280px) 960px, (min-width: 1024px) 800px, 100vw"
            />
          </div>
          <div className="flex-1 max-w-3xl space-y-6 text-lg md:text-xl lg:text-2xl">
            <p>
              "Lorem ipsum dolor sit amet consectetur. Adipiscing tempor cursus quis eros ligula aliquam ultrices egestas tellus.
            </p>
            <p>
              Elementum sed tincidunt sit risus. Porttitor viverra euismod neque pellentesque id. Tempus fusce vivamus consectetur vitae sed habitant."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

