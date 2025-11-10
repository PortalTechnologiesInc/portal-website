"use client";

import Image from "next/image";

export function Page3c() {
  return (
    <div className="h-full flex flex-row items-center justify-center px-6 md:max-w-[98rem] md:mx-auto w-full">
      {/* Image Container - Left side */}
      <div className="relative flex items-center justify-center md:mr-16">
        <Image
          src="/sentiment_sad.svg"
          alt="Poor User Experience"
          width={128}
          height={128}
          className="w-[12rem] h-[12rem] md:w-[16rem] md:h-[16rem] lg:w-[18rem] lg:h-[18rem]"
        />
      </div>

      {/* Text Content - Right side */}
      <div className="text-left max-w-xl flex flex-col">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
          Poor User Experience
        </h1>
        <p className="text-xl md:text-2xl lg:text-[1.75rem] font-normal leading-snug text-white opacity-90">
          Authentication and payment systems are often clunky and unintuitive, creating friction for customers and leading to a high percentage of abandoned carts.
        </p>
      </div>
    </div>
  );
}

