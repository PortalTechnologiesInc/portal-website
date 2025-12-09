"use client";


export function Page3a() {
  return (
    <div className="h-full flex flex-row items-center justify-center px-6 md:max-w-[98rem] md:mx-auto w-full">
      {/* Image Container - Left side */}
      <div className="relative flex items-center justify-center md:mr-16">
        <img
          src="/sentiment_sad.svg"
          alt="Identity Harvesting"
          width={128}
          height={128}
          className="w-[12rem] h-[12rem] md:w-[16rem] md:h-[16rem] lg:w-[18rem] lg:h-[18rem]"
        />
      </div>

      {/* Text Content - Right side */}
      <div className="text-left max-w-xl flex flex-col">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
          Identity Harvesting
        </h1>
        <p className="text-xl md:text-2xl lg:text-[1.75rem] font-normal leading-snug text-white opacity-90">
          Every service you use collects your personal information. Email addresses, phone numbers, documents, and behavioral data are stored, shared, and exploited without your control.
        </p>
      </div>
    </div>
  );
}

