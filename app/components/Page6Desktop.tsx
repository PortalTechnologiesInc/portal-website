"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  CurrencyCarousel,
  DailyLifeBusinessCarousel,
} from "./Page6";

const YELLOW_BG = { backgroundColor: "#FFED00" } as const;

type Feature = {
  icon: string;
  alt: string;
  title: string;
  description: string;
};

const dailyLifeFeatures: Feature[] = [
  {
    icon: "/confirmation_number.svg",
    alt: "Tickets",
    title: "Tickets? No problem",
    description:
      "Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.",
  },
  {
    icon: "/assignment_ind.svg",
    alt: "Identity",
    title: "Your identity, fully secured",
    description:
      "Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.",
  },
  {
    icon: "/cached.svg",
    alt: "Control",
    title: "Take control of your money",
    description:
      "Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.",
  },
];

const businessFeatures: Feature[] = [
  {
    icon: "/do_not_touch.svg",
    alt: "Hand",
    title: "Only you and your customer",
    description:
      "Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.",
  },
  {
    icon: "/sell.svg",
    alt: "Sell",
    title: "Sell tickets effortlessly",
    description:
      "Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.",
  },
  {
    icon: "/cached.svg",
    alt: "Control",
    title: "Intruders are kept out",
    description:
      "Office ipsum you must be muted. Diarize lean last base revision follow request social prioritize. Could pants cost your big up submit algorithm email. Before.",
  },
];

function PanelWrapper({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <section
      data-section={id}
      data-reveal
      className="hidden md:flex md:h-dvh snap-section-desktop relative overflow-hidden"
      style={YELLOW_BG}
    >
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-12">
        {children}
      </div>
    </section>
  );
}

function BlackLogoOverlay() {
  return (
    <div
      data-logo-black
      className="pointer-events-none absolute"
      style={{
        top: "-190%",
        left: "-30%",
        transformOrigin: "center center",
        zIndex: 5,
        width: "400%",
        height: "400%",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        maskSize: "100% 100%",
        maskRepeat: "no-repeat",
        maskPosition: "0 0",
      }}
    >
      <svg
        width="246"
        height="210"
        viewBox="0 0 246 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 1,
          opacity: 1,
        }}
      >
        <path
          data-logo-black-path
          d="M174.011 1.5C174.029 17.4525 174.358 29.8097 175.814 39.3369C177.317 49.1665 180.048 56.2148 185.089 61.127C190.126 66.0356 197.249 68.5948 207.03 69.9609C216.506 71.2844 228.703 71.5115 244.313 71.5244V138.475C228.7 138.488 216.501 138.716 207.024 140.039C197.243 141.405 190.12 143.965 185.084 148.873C180.044 153.785 177.314 160.834 175.812 170.663C174.358 180.19 174.029 192.548 174.011 208.5H71.8027C71.7841 192.547 71.455 180.19 69.999 170.663C68.4968 160.833 65.7646 153.785 60.7236 148.873C55.6863 143.965 48.5641 141.405 38.7832 140.039C29.3072 138.716 17.1101 138.488 1.5 138.475V71.5244C17.1136 71.5115 29.3124 71.2845 38.7891 69.9609C48.5707 68.5948 55.693 66.0356 60.7295 61.127C65.7696 56.2148 68.4999 49.1664 70.001 39.3369C71.4559 29.8097 71.7842 17.4525 71.8027 1.5H174.011Z"
          stroke="#000000"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

function FeatureList({ features }: { features: Feature[] }) {
  return (
    <div className="mt-12 w-full max-w-5xl space-y-12">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="flex flex-row items-center gap-6 text-left"
        >
          <div className="flex-shrink-0">
            <Image
              src={feature.icon}
              alt={feature.alt}
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>
          <div className="flex-1 text-black">
            <h3 className="font-eurostile text-3xl font-bold mb-3">
              {feature.title}
            </h3>
            <p className="text-lg leading-relaxed">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Page6Desktop() {
  return (
    <>
      <section
        data-section="page6-hero"
        data-reveal
        className="hidden md:flex md:h-dvh snap-section-desktop relative overflow-hidden"
        style={YELLOW_BG}
      >
        <BlackLogoOverlay />
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 text-center">
          <h1 className="font-eurostile text-black text-7xl font-bold tracking-tight">
            BE THE ONE IN CONTROL, TRUST NOTHING
          </h1>
          <Image
            src="/cross-gray.png"
            alt="Cross"
            width={800}
            height={800}
            className="mt-12 h-[36rem] w-auto object-cover"
            priority
          />
        </div>
      </section>

      <PanelWrapper id="page6-currency-intro">
        <div className="w-full max-w-5xl text-left text-black">
          <h2 className="font-eurostile text-6xl font-bold tracking-tight mb-8">
            Works with <br /> all currency
          </h2>
          <p className="text-2xl leading-relaxed max-w-3xl">
            Lorem ipsum dolor sit amet consectetur. Adipiscing ac tortor curabitur aliquet iaculis. Eu quam id aliquet feugiat pharetra volutpat. Nibh ac et fermentum lobortis. Pulvinar tellus id tincidunt orci.
          </p>
        </div>
      </PanelWrapper>

      <PanelWrapper id="page6-currency-carousel">
        <CurrencyCarousel />
      </PanelWrapper>

      <PanelWrapper id="page6-easy-secure">
        <div className="w-full max-w-5xl text-center text-black">
          <h2 className="font-eurostile text-6xl font-bold tracking-tight mb-8">
            Easy, Simple and secure
          </h2>
          <p className="mx-auto max-w-3xl text-2xl leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Adipiscing ac tortor curabitur aliquet iaculis. Eu quam id aliquet feugiat pharetra volutpat. Nibh ac et fermentum lobortis. Pulvinar tellus id tincidunt orci.
          </p>
        </div>
      </PanelWrapper>

      <PanelWrapper id="page6-daily-life">
        <div className="flex w-full max-w-6xl flex-col items-center gap-12 text-black">
          <h2 className="text-center font-eurostile text-6xl font-semibold tracking-tight">
            P+RTAL
            <br />
            Is the smartest choice for your daily life
          </h2>
          <div className="flex w-full items-center justify-center gap-10">
            <div className="relative aspect-[2/3] w-[28rem] overflow-hidden">
              <Image
                src="/Rectangle.png"
                alt="Portal Rectangle"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <FeatureList features={dailyLifeFeatures} />
          </div>
        </div>
      </PanelWrapper>

      <PanelWrapper id="page6-business">
        <div className="flex w-full max-w-6xl flex-col items-center gap-12 text-black">
          <h2 className="text-center font-eurostile text-6xl font-semibold tracking-tight">
            P+RTAL
            <br />
            gives you complete control over your business
          </h2>
          <div className="flex w-full items-center justify-center gap-10">
            <div className="relative aspect-[2/3] w-[28rem] overflow-hidden">
              <Image
                src="/Rectangle2.png"
                alt="Portal Rectangle"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <FeatureList features={businessFeatures} />
          </div>
        </div>
      </PanelWrapper>

      <PanelWrapper id="page6-take-step">
        <DailyLifeBusinessCarousel />
      </PanelWrapper>
    </>
  );
}


