"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

export default function Footer() {
  const scrollContainerSelector = "#main-scroll-container";

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    targetSelectors: string[]
  ) => {
    event.preventDefault();

    const scrollContainer = document.querySelector(
      scrollContainerSelector
    ) as HTMLElement | null;
    const headerOffset = 64;

    const targets = targetSelectors
      .map((selector) => document.querySelector(selector) as HTMLElement | null)
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) {
      return;
    }

    const visibleTarget =
      targets.find((el) => el.offsetParent !== null) ?? targets[0];

    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = visibleTarget.getBoundingClientRect();
      const offsetTop =
        targetRect.top - containerRect.top + scrollContainer.scrollTop - headerOffset;

      scrollContainer.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    } else {
      const targetRect = visibleTarget.getBoundingClientRect();
      const offsetTop = targetRect.top + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="w-full h-full bg-black text-white flex flex-col items-center overflow-y-auto">
      {/* Main content - centered */}
      <div className="mx-auto max-w-screen-2xl w-full sm:pl-12 flex flex-col flex-1 justify-center md:py-12 z-10 pt-[3rem] md:pt-12 xxs:pt-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-20 flex-shrink-0 xxs:gap-6">
          {/* Discover the future section */}
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-10 pl-4 md:pl-8 xxs:gap-3">
            <h3 className="text-xl md:text-2xl font-medium xxs:text-lg">Discover the future</h3>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-8 ml-2 md:ml-4 xxs:gap-2">
              <a
                href="#page2"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
                onClick={(event) => handleNavClick(event, ["#page2"])}
              >
                The Paradox
              </a>
              <a
                href="#page4"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
                onClick={(event) => handleNavClick(event, ["#page4"])}
              >
                Break the cycle
              </a>
              <a
                href="#page6-hero-desktop"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
                onClick={(event) =>
                  handleNavClick(event, ["#page6-hero-desktop", "#page6-hero-mobile"])
                }
              >
                Real Advantages
              </a>
            </div>
          </div>

          {/* Take action section */}
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-10 pl-4 md:pl-8 xxs:gap-3">
            <h3 className="text-xl md:text-2xl font-medium xxs:text-lg">Take action</h3>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-8 ml-2 md:ml-4 xxs:gap-2">
              <a
                href="#page6-take-step-desktop"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
                onClick={(event) =>
                  handleNavClick(event, [
                    "#page6-take-step-desktop",
                    "#page6-take-step-mobile",
                  ])
                }
              >
                Download for Daily life usage
              </a>
              <a
                href="#page6-take-step-desktop"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
                onClick={(event) =>
                  handleNavClick(event, [
                    "#page6-take-step-desktop",
                    "#page6-take-step-mobile",
                  ])
                }
              >
                Download for your Business
              </a>
            </div>
          </div>

          {/* Know P+RTAL Technologies section */}
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-10 pl-4 md:pl-8 xxs:gap-3">
            <h3 className="text-xl md:text-2xl font-medium xxs:text-lg">Know P+RTAL Technologies</h3>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-8 ml-2 md:ml-4 xxs:gap-2">
              <a
                href="#page7"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
                onClick={(event) => handleNavClick(event, ["#page7"])}
              >
                A word of the founders
              </a>
            </div>
          </div>

          {/* Follow Us section */}
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-10 pl-4 md:pl-8 xxs:gap-3">
            <h3 className="text-xl md:text-2xl font-medium xxs:text-lg">Follow Us</h3>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-8 ml-2 md:ml-4 xxs:gap-2">
              <a
                href="https://x.com/portalonx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                X/Twitter
              </a>
              <a
                href="https://primal.net/p/nprofile1qqsqh347l4uutk4upu0u0kwu70td6ngm8ulvq6zvze982k2aun7semszu3604"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                Nostr
              </a>
              <a
                href="https://www.instagram.com/portaltechinc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Logo block - fills remaining space, centers logo */}
      <div className="flex-1 flex justify-center items-center w-full min-h-0">
        <Link href="/" aria-label="Portal Home" className="flex justify-center items-center w-full max-w-4xl px-4">
          <img
            src="/logo.svg"
            alt="Portal Logo"
            width={150}
            height={200}
            className="invert w-auto max-h-[40vh] object-contain"
          />
        </Link>
      </div>
    </footer>
  );
}

