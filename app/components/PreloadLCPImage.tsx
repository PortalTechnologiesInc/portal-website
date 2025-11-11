"use client";

import { useEffect } from "react";

export function PreloadLCPImage() {
  useEffect(() => {
    // Check if link already exists
    const existingLink = document.querySelector('link[rel="preload"][href="/cross-gray.webp"]');
    if (existingLink) {
      return;
    }

    // Create and add preload link
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = "/cross-gray.webp";
    link.as = "image";
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
  }, []);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (document.querySelector('link[rel="preload"][href="/cross-gray.webp"]')) return;
            var link = document.createElement('link');
            link.rel = 'preload';
            link.href = '/cross-gray.webp';
            link.as = 'image';
            link.setAttribute('fetchpriority', 'high');
            document.head.appendChild(link);
          })();
        `,
      }}
    />
  );
}

