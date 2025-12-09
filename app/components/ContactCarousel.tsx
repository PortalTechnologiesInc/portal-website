"use client";

export default function ContactCarousel() {
  const message =
    "Get in touch to know more about Portal identity protection for your business, services, and applications";

  const marqueeItems = Array.from({ length: 3 }, () => message);

  return (
    <div className="marquee w-full h-[2.875rem] backdrop-blur-[0.125rem] bg-white/10 md:bg-[#FFED00]/[0.05] flex items-center absolute md:relative bottom-0 md:bottom-auto left-0 z-[999]">
      <div className="marquee__track" aria-hidden={false}>
        {[0, 1].map((duplicate) => (
          <div
            key={duplicate}
            className="marquee__group"
            aria-hidden={duplicate === 1}
          >
            {marqueeItems.map((text, index) => (
              <span
                key={`${duplicate}-${index}`}
                className="marquee__item text-black text-sm font-normal"
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
