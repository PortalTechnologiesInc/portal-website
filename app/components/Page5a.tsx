"use client";


export function Page5a() {
  return (
    <div className="h-full flex flex-row items-center justify-center px-6 md:max-w-[98rem] md:mx-auto w-full">
      {/* Card 1 */}
      <div className="relative w-full h-[57vh] max-w-full max-h-[57vh] flex items-center justify-center" style={{ width: '77vw', height: '57vh' }}>
        <img
          src="/page5d1.png"
          alt="Card 1"
          className="object-cover rounded-3xl"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

