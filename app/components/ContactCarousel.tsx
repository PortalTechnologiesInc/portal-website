"use client";

export default function ContactCarousel() {
  const text =
    "Get in touch to know more about the P+RTAL potential to your business, private and public events";

  return (
    <div className="w-full h-[2.875rem] backdrop-blur-[0.125rem] bg-white/10 md:bg-[#FFED00]/[0.05] overflow-hidden flex items-center absolute md:relative bottom-0 md:bottom-auto left-0 z-[999]">
      <div className="whitespace-nowrap animate-scroll">
        <span className="text-black text-sm font-normal mr-8">{text}</span>
        <span className="text-black text-sm font-normal mr-8">{text}</span>
        <span className="text-black text-sm font-normal mr-8">{text}</span>
      </div>
    </div>
  );
}
