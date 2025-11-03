"use client";

import Image from "next/image";
import ContactCarousel from "./ContactCarousel";
import ParallaxImage from "./ParallaxImage";

export function Page1() {
  return (
    <>
      {/* Parallax Image */}
      <ParallaxImage />

      {/* Background SVG Vector */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/yellowvec.svg"
          alt=""
          width={300}
          height={300}
          className=""
          style={{ minWidth: "210%", minHeight: "210%" }}
          priority
        />
      </div>
      <div className="px-6 text-left max-w-4xl m-2 relative z-50">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight font-eurostile">
          BE THE ONE IN CONTROL, TRUST NOTHING
        </h1>
        <p className="text-2xl md:text-xl lg:text-2xl font-normal mb-8 max-w-2xl leading-tight">
          The next revolution is now,
          <br />
          Skip the fees with P+RTAL
          <br />
          and get the highest security ever
        </p>
        <button
          type="button"
          className="text-white px-4 py-2 text-lg font-semibold transition-colors duration-200"
          style={{ backgroundColor: "#141416" }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "#1a1a1c";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "#141416";
          }}
        >
          Discover More
        </button>
      </div>

      {/* Contact Carousel */}
      <ContactCarousel />
    </>
  );
}
