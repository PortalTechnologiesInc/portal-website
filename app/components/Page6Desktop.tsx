"use client";

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
    icon: "/assignment_ind.svg",
    alt: "Nostr",
    title: "Connect to Nostr social media",
    description:
      "Use Portal as your gateway to the decentralized Nostr social network. Your identity, your posts, your connections - all under your control.",
  },
  {
    icon: "/confirmation_number.svg",
    alt: "Login",
    title: "Passwordless login to services",
    description:
      "Say goodbye to passwords. One tap to securely authenticate with any Portal-enabled service. No more password resets or security questions.",
  },
  {
    icon: "/cached.svg",
    alt: "Age Verification",
    title: "Private age verification",
    description:
      "Prove your age without revealing your identity. Access age-restricted services with complete privacy. No tracking, no data collection.",
  },
];

const businessFeatures: Feature[] = [
  {
    icon: "/do_not_touch.svg",
    alt: "No Data",
    title: "Never collect user identity data",
    description:
      "Portal handles identity verification without you ever touching sensitive user data. Zero liability, zero breach risk, zero compliance headaches.",
  },
  {
    icon: "/sell.svg",
    alt: "GDPR",
    title: "GDPR compliant by design",
    description:
      "Data minimization built into the protocol. No personal data means no regulatory burden. Privacy by architecture, not afterthought.",
  },
  {
    icon: "/cached.svg",
    alt: "Integration",
    title: "Simple, open-source integration",
    description:
      "Clean APIs, clear documentation, open-source code. Integrate Portal identity services in hours, not months. Full transparency, full control.",
  },
];

function PanelWrapper({
  id,
  anchorId,
  children,
}: {
  id: string;
  anchorId?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={anchorId ?? id}
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
      className="pointer-events-none absolute w-[390%] h-[400%] md:h-[300%]"
      style={{
        top: "-30%",
        left: "-80%",
        transformOrigin: "center center",
        zIndex: 5,
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 50%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 50%)",
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
    <div className="mt-0 w-full max-w-5xl space-y-12 md:h-full md:flex md:flex-col md:justify-center">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="flex flex-row items-center gap-6 text-left"
        >
          <div className="flex-shrink-0">
            <img
              src={feature.icon}
              alt={feature.alt}
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>
          <div className="flex-1 text-black flex items-center min-h-16">
            <h3 className="font-eurostile text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
              {feature.title}
            </h3>
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
        id="page6-hero-desktop"
        data-section="page6-hero"
        data-reveal
        className="hidden md:flex md:h-dvh snap-section-desktop relative overflow-hidden"
        style={YELLOW_BG}
      >
        <BlackLogoOverlay />
        <div className="relative z-10 flex w-full items-center justify-center px-12">
          <div className="flex w-full max-w-[98rem] items-center justify-between gap-12">
            <div className="flex-1 max-w-5xl text-left">
              <h1 className="font-eurostile text-black text-7xl font-bold tracking-tight leading-tight">
                YOUR DIGITAL IDENTITY, PROTECTED BY DESIGN
              </h1>
            </div>
            <div className="relative flex-shrink-0">
              <img
                src="/cross-gray.webp"
                alt="Cross"
                width={800}
                height={800}
                loading="eager"
                fetchPriority="high"
                className="h-[36rem] w-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <PanelWrapper id="page6-currency-intro">
        <div className="w-full max-w-[98rem] text-black flex flex-col gap-12 h-full mt-32">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
            <div className="text-left md:max-w-[45%]">
              <h2 className="font-eurostile text-4xl md:text-[3.25rem] font-bold tracking-tight">
                One identity, <br /> endless possibilities
              </h2>
            </div>
            <div className="md:max-w-[51%] text-justify">
              <p className="text-xl md:text-2xl leading-relaxed">
              Use Portal for social media on Nostr, passwordless login to services, age verification, and more. Your identity stays private while unlocking the full potential of the digital world.
              <br />
              Built on cryptography and the decentralized Nostr network.
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-6xl">
              <CurrencyCarousel />
            </div>
          </div>
        </div>
      </PanelWrapper>

      <PanelWrapper id="page6-easy-secure">
        <div className="w-full max-w-[98rem] text-black flex flex-col gap-12 h-full mt-32">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
            <div className="text-left md:max-w-[45%]">
              <h2 className="font-eurostile text-4xl md:text-[3.25rem] font-bold tracking-tight">
                Cryptographically protected
              </h2>
            </div>
            <div className="md:max-w-[51%] text-justify">
              <p className="text-xl md:text-2xl leading-relaxed">
              Your identity is protected by blind signature cryptography and the decentralized Nostr network. No tracking, no data harvesting, no surveillance. Just you, in control of your digital life.
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="relative max-w-[70vw] mb-20">
              <img
                src="/page6-circle-lg.svg"
                alt="Portal Circle Diagram"
                width={512}
                height={512}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </PanelWrapper>

      <PanelWrapper id="page6-daily-life">
        <div className="flex w-full h-full flex-col text-black justify-center">
          <div className="flex w-full flex-col md:flex-row md:items-stretch gap-10 md:gap-16">
            <div className="flex w-full md:w-[55vw] flex-col md:h-full">
              <h2 className="text-left font-eurostile text-4xl font-semibold tracking-tight mb-10 max-w-[40rem]">
                Portal
                Your gateway to the digital world
              </h2>
              <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
                <img
                  src="/Rectangle.webp"
                  alt="Portal Rectangle"
                  className="object-cover"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="flex-1 md:order-2 md:flex md:flex-col md:justify-center md:h-full mt-20">
              <FeatureList features={dailyLifeFeatures} />
            </div>
          </div>
        </div>
      </PanelWrapper>

      <PanelWrapper id="page6-business">
        <div className="flex w-full h-full flex-col text-black justify-center">
          <div className="flex w-full flex-col md:flex-row md:items-stretch gap-10 md:gap-16">
            <div className="flex w-full md:w-[55vw] flex-col md:order-1 md:h-full">
              <h2 className="text-left font-eurostile text-4xl font-semibold tracking-tight mb-10 max-w-[40rem]">
                Portal
                Built for businesses that respect users
              </h2>
              <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
                <img
                  src="/Rectangle2.webp"
                  alt="Portal Rectangle"
                  className="object-cover"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="flex-1 md:order-2 md:flex md:flex-col md:justify-center md:h-full mt-20">
              <FeatureList features={businessFeatures} />
            </div>
          </div>
        </div>
      </PanelWrapper>

      <PanelWrapper id="page6-take-step" anchorId="page6-take-step-desktop">
        <DailyLifeBusinessCarousel variant="desktop" />
      </PanelWrapper>
    </>
  );
}


