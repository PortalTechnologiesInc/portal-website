"use client";

type Props = {
  initialTextRef?: React.RefObject<HTMLDivElement | null>;
  newTextRef?: React.RefObject<HTMLDivElement | null>;
  sadTextRef?: React.RefObject<HTMLDivElement | null>;
};

export function EuroStepTexts({
  initialTextRef,
  newTextRef,
  sadTextRef,
}: Props) {
  return (
    <div className="relative w-full">
      {/* Initial Text - Euro */}
      <div
        data-initial-text
        ref={initialTextRef}
        className="transition-all duration-1000 ease-out"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
          High costs
        </h1>
        <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto leading-tight text-white opacity-90">
          Commissions imposed by banks and payment processors eat into your
          profits, especially for small and medium-sized businesses.
        </p>
      </div>

      {/* New Text - Lock */}
      <div
        data-new-text
        ref={newTextRef}
        className="absolute top-0 left-0 w-full transition-all duration-1000 ease-out"
        style={{ opacity: 0 }}
      >
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
          Technological "Lock-in"
        </h1>
        <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto leading-tight text-white opacity-90">
          Companies are often trapped in proprietary ecosystems, which limit
          their freedom and make it difficult to change providers or integrate
          new solutions.
        </p>
      </div>

      {/* Sad Text */}
      <div
        data-sad-text
        ref={sadTextRef}
        className="absolute top-0 left-0 w-full transition-all duration-1000 ease-out"
        style={{ opacity: 0 }}
      >
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight font-eurostile text-white">
          Poor user experience
        </h1>
        <p className="text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto leading-tight text-white opacity-90">
          Authentication and payment systems are often clunky and unintuitive,
          creating friction for customers and leading to a high percentage of
          abandoned carts.
        </p>
      </div>
    </div>
  );
}
