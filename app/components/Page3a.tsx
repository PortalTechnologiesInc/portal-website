"use client";

import Image from "next/image";

export function Page3a() {
  return (
    <div className="h-full flex flex-row items-center justify-center px-6 md:max-w-[98rem] md:mx-auto w-full">
      {/* Image Container - Left side */}
      <div className="relative flex items-center justify-center md:mr-12">
        <Image
          src="/euro_symbol.svg"
          alt="High Costs"
          width={128}
          height={128}
          className="w-[12rem] h-[12rem]"
        />
      </div>

      {/* Text Content - Right side */}
      <div className="text-left max-w-lg flex flex-col">
        <h1 className="text-4xl lg:text-4xl font-bold tracking-tight mb-4 leading-tight font-eurostile text-white">
          High Costs
        </h1>
        <p className="text-xl font-normal leading-tight text-white opacity-90">
          Commissions imposed by banks and payment processors eat into your profits, especially for small and medium-sized businesses.
        </p>
      </div>
    </div>
  );
}

