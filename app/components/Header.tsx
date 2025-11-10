"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [onLightBackground, setOnLightBackground] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
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
      setOpen(false);
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

    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const scrollContainer = (document.querySelector(
      scrollContainerSelector
    ) || null) as HTMLElement | null;

    // Sections that need white text (dark backgrounds)
    const WHITE_TEXT_PAGES = ['page2', 'page3', 'page4'];
    
    const checkActiveSection = () => {
      const headerHeight = 56;
      const lead = 56;
      const containerRect = (
        scrollContainer || document.documentElement
      ).getBoundingClientRect();
      const triggerY = containerRect.top + headerHeight;

      // Check all sections with data-page attribute
      const sections = Array.from(
        document.querySelectorAll("section[data-page]")
      ) as HTMLElement[];
      
      // Check footer
      const footer = document.querySelector("footer") as HTMLElement;

      // Find active section (check in DOM order, use the one with most visibility)
      let activePage: string | null = null;
      let maxVisibility = 0;
      
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const isActive = rect.top <= triggerY + lead && rect.bottom > triggerY + lead;
        if (isActive) {
          // Calculate visibility ratio (how much of section is in viewport)
          const visibleTop = Math.max(rect.top, triggerY - lead);
          const visibleBottom = Math.min(rect.bottom, triggerY + lead + window.innerHeight);
          const visibility = Math.max(0, visibleBottom - visibleTop) / rect.height;
          
          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            activePage = section.getAttribute('data-page');
          }
        }
      }

      // Check if footer is visible and active
      let footerActive = false;
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Footer is active if it's the active page OR if it's taking up most of the viewport
        // Only hide header when footer is clearly the main content (more than 50% visible)
        const footerVisibilityRatio = Math.max(0, Math.min(footerRect.bottom, viewportHeight) - Math.max(footerRect.top, 0)) / viewportHeight;
        footerActive = activePage === 'footer' || (footerRect.top < viewportHeight * 0.5 && footerVisibilityRatio > 0.5);
      }
      
      setIsFooterVisible(footerActive);

      // Determine text color: white text for page2, page3, and footer
      const needsWhiteText = activePage && (WHITE_TEXT_PAGES.includes(activePage) || activePage === 'footer');
      setOnLightBackground(!needsWhiteText);
    };

    const observer = new IntersectionObserver(
      () => {
        checkActiveSection();
      },
      {
        root: scrollContainer || null,
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    // Observe all sections with data-page
    const sections = Array.from(
      document.querySelectorAll("section[data-page]")
    ) as HTMLElement[];
    sections.forEach(section => observer.observe(section));

    // Observe footer
    const footer = document.querySelector("footer");
    if (footer) observer.observe(footer);

    // Add rAF-throttled scroll handler for instant updates
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          checkActiveSection();
          ticking = false;
        });
      }
    };

    (scrollContainer || window).addEventListener("scroll", onScroll, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("resize", onScroll, {
      passive: true,
    } as AddEventListenerOptions);
    
    // Initial check
    checkActiveSection();

    return () => {
      observer.disconnect();
      (scrollContainer || window).removeEventListener(
        "scroll",
        onScroll as EventListener
      );
      window.removeEventListener("resize", onScroll as EventListener);
    };
  }, []);

  return (
    <header className={`w-full fixed top-0 before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none before:backdrop-blur-[0.7rem] transition-opacity duration-300 ${isFooterVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ zIndex: 10000 }}>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
          <Link
            href="/"
            className={`select-none inline-flex items-center transition-colors duration-300 ${
              onLightBackground ? "" : "text-white"
            }`}
            style={onLightBackground ? { color: "#141416" } : {}}
            aria-label="Portal Home"
          >
            <img
              src="/logo.svg"
              alt=""
              width={200}
              height={200}
              className={`transition duration-300 w-[150px] md:w-[200px] h-auto ${
                onLightBackground ? "" : "invert"
              }`}
            />
          </Link>

          {/* mobile star toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden shrink-0 h-10 w-10 inline-flex items-center justify-center bg-transparent text-xl"
          >
            <img
              src="/asterisk.svg"
              alt=""
              width={22}
              height={22}
              aria-hidden
              className={`transition-transform duration-300 will-change-transform inline-block ${
                onLightBackground ? "" : "invert"
              } ${open ? "rotate-90" : "rotate-0"}`}
            />
          </button>

          {/* desktop nav */}
          <nav
            className={`hidden md:flex items-center gap-8 text-sm transition-colors duration-300 ${
              onLightBackground ? "" : "text-white"
            }`}
            style={onLightBackground ? { color: "#141416" } : {}}
          >
            <Link
              href="#page2"
              onClick={(event) => handleNavClick(event, ["#page2"])}
              className="hover:underline underline-offset-4"
            >
              The Banking System and Wallet Paradox
            </Link>
            <Link
              href="#page6-take-step-desktop"
              onClick={(event) =>
                handleNavClick(event, [
                  "#page6-take-step-desktop",
                  "#page6-take-step-mobile",
                ])
              }
              className="hover:underline underline-offset-4"
            >
              Download
            </Link>
            <Link
              href="#page7"
              onClick={(event) => handleNavClick(event, ["#page7"])}
              className="hover:underline underline-offset-4"
            >
              Know PORTAL
            </Link>
          </nav>
        </div>
      </div>

      {/* mobile dropdown wrapper covers full viewport minus header */}
      <div
        className={`md:hidden fixed inset-x-0 top-14 z-40 h-[calc(100dvh-3.5rem)] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* backdrop below header (transparent w/ strong blur) */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className={`absolute inset-0 z-[40] transition-opacity duration-500 backdrop-blur-[0.7rem] ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* animated panel fills from under header to bottom with skew/scale */}
        <div
          className={`absolute inset-0 z-[41] mx-auto max-w-screen-2xl px-4 sm:px-6 flex flex-col h-full transform-gpu transition-transform duration-500 ease-out will-change-transform before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none before:backdrop-blur-[0.7rem] ${
            open ? "scale-y-100 skew-y-0" : "scale-y-0 skew-y-3"
          }`}
          style={{ transformOrigin: "top" }}
        >
          <div
            className={`flex-1 rounded-t-md transition-colors duration-300 ${
              onLightBackground ? "" : "text-white"
            }`}
            style={onLightBackground ? { color: "#141416" } : {}}
          >
            {/* links (not scrollable) */}
            <div className="divide-y-8 divide-transparent pt-6 px-4 sm:px-6">
              <div
                className={`my-16 py-5 border-b-2 transition-colors duration-300 ${
                  onLightBackground ? "" : "border-white/70"
                }`}
                style={
                  onLightBackground
                    ? { borderColor: "rgba(20, 20, 22, 0.7)" }
                    : {}
                }
              >
                <Link
                  href="#page2"
                  className="flex items-center justify-between"
                  onClick={(event) => handleNavClick(event, ["#page2"])}
                >
                  <span className="text-left text-lg font-medium underline underline-offset-4">
                    The Banking System Paradox
                  </span>
                  <img
                    src="/arrow.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                    className={`${onLightBackground ? "" : "invert"}`}
                  />
                </Link>
              </div>
              <div
                className={`my-16 py-5 border-b-2 transition-colors duration-300 ${
                  onLightBackground ? "" : "border-white/70"
                }`}
                style={
                  onLightBackground
                    ? { borderColor: "rgba(20, 20, 22, 0.7)" }
                    : {}
                }
              >
                <Link
                  href="#page6-take-step-desktop"
                  className="flex items-center justify-between"
                  onClick={(event) =>
                    handleNavClick(event, [
                      "#page6-take-step-desktop",
                      "#page6-take-step-mobile",
                    ])
                  }
                >
                  <span className="text-left text-lg font-medium underline underline-offset-4">
                    Download
                  </span>
                  <img
                    src="/arrow.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                    className={`${onLightBackground ? "" : "invert"}`}
                  />
                </Link>
              </div>
              <div
                className={`my-16 py-5 border-b-2 transition-colors duration-300 ${
                  onLightBackground ? "" : "border-white/70"
                }`}
                style={
                  onLightBackground
                    ? { borderColor: "rgba(20, 20, 22, 0.7)" }
                    : {}
                }
              >
                <Link
                  href="#page7"
                  className="flex items-center justify-between"
                  onClick={(event) => handleNavClick(event, ["#page7"])}
                >
                  <span className="text-left text-lg font-medium underline underline-offset-4">
                    Know Portal
                  </span>
                  <img
                    src="/arrow.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                    className={`${onLightBackground ? "" : "invert"}`}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* social footer pinned bottom with extra bottom margin */}
          <div
            className={`py-6 mx-4 sm:mx-6 mb-4 flex items-center justify-between border-b-2 transition-colors duration-300 ${
              onLightBackground ? "" : "border-white/70 text-white"
            }`}
            style={
              onLightBackground
                ? { borderColor: "rgba(20, 20, 22, 0.7)", color: "#141416" }
                : {}
            }
          >
            <span className="text-lg font-medium">Follow us</span>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.instagram.com/portaltechinc/"
                target="_blank"
                aria-label="Instagram"
                className="inline-flex items-center"
              >
                <img
                  src="/ig.svg"
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden
                  className={`${onLightBackground ? "" : "invert"}`}
                />
              </Link>
              <Link
                href="https://x.com/portalonx"
                target="_blank"
                aria-label="X"
                className="inline-flex items-center"
              >
                <img
                  src="/x.svg"
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden
                  className={`${onLightBackground ? "" : "invert"}`}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
