"use client";


export function Page7() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-white">
      <div className="flex w-full flex-col text-black px-6 md:px-12 lg:px-20 xl:px-32 py-12 md:py-20 max-w-[100rem]">
        <h2 className="text-left mb-2 font-eurostile text-xl md:text-4xl lg:text-4xl font-semibold tracking-tight">
          Behind the P+RTAL company
        </h2>
        <div className="flex w-full flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <div className="relative w-full md:w-[40vw] aspect-[3/2] overflow-hidden rounded-3xl xxs:max-h-[20vh]">
            <img
              src="/company.webp"
              alt="Behind the P+RTAL company"
              className="object-cover grayscale"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="flex-1 max-w-3xl sm:space-y-6 text-sm sm:text-base md:text-xl lg:text-2xl">
            <p>
              "Portal is built on open standards and protocols to ensure global accessibility and adoption. We leverage Lightning Network for payments and Nostr for identity, creating a truly borderless solution.
            </p>
            <p className="py-2 md:py-0">
              While other payment systems come with hidden fees, chargebacks, and regional restrictions, Bitcoin offers a truly open financial system that works the same way for everyone, everywhere.
            </p>
            <p>
            By leveraging the Lightning Network, we enable instant, near-zero fee payments that make microtransactions practical and open up new business models for developers."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

