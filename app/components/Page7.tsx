"use client";


export function Page7() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-white">
      <div className="flex w-full flex-col text-black px-6 md:px-12 lg:px-20 xl:px-32 py-12 md:py-20 max-w-[100rem]">
        <h2 className="text-left mb-2 font-eurostile text-xl md:text-4xl lg:text-4xl font-semibold tracking-tight">
          Behind Portal Digital ID
        </h2>
        <div className="flex w-full flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <div className="relative w-full md:w-[40vw] aspect-[3/2] overflow-hidden rounded-3xl xxs:max-h-[20vh]">
            <img
              src="/company.webp"
              alt="Behind Portal Digital ID"
              className="object-cover grayscale"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="flex-1 max-w-3xl sm:space-y-6 text-sm sm:text-base md:text-xl lg:text-2xl">
            <p>
              "Portal is your digital identity guardian. We believe you should control how and when your identity is used - whether connecting to social media, logging into services, or proving your age.
            </p>
            <p className="py-2 md:py-0">
              Traditional systems force you to surrender your identity to use digital services. We've built Portal on blind signature cryptography and the Nostr network to break this paradigm. Your identity, your control.
            </p>
            <p>
            Open-source, cryptographically sound, and GDPR-compliant by design. Portal is identity protection for the digital age - simple for users, safe for businesses, transparent for everyone."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

