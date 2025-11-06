"use client";

import Image from "next/image";

export function Page5b() {
  return (
    <div className="h-full flex flex-row items-center justify-center px-6 md:max-w-[98rem] md:mx-auto w-full">
      {/* Card 2 */}
      <div className="relative w-full h-[57vh] max-w-full max-h-[57vh] flex items-center justify-center" style={{ width: '77vw', height: '57vh' }}>
        <Image
          src="/page5d2.png"
          alt="Card 2"
          fill
          className="object-cover rounded-3xl"
          sizes="77vw"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

