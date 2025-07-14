import React, { useState } from 'react';
import About from './components/About';

const LandingPage = () => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC13RaWYShQTN6z55GE-iwdShhJEl1ZIDRCgm47CdN2XGW4LLRyeL6ngAjIJO2QwWSQqTzRpkTvgs44oq1Vr_W35PRtxTQFqBs7qeGUcDFUIkuVBfIStE11H3G5F9Tf9mIMh0wWqCIRcJXefNpBvq7JF8cxKyNqTMgEqrr0APSOeNqdL-QKU1EBpvxI9atzStIPpN5396H-j3o--a3sAdLAS0ESgPqZQ4nQPdGGop7aIJ64d_qoT9alcvuPOOSYEjeT0uJ45WPr-Ukk")`,
      }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
    >
      {/* About button in top-right corner */}
      <button 
        onClick={() => setShowAbout(true)}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        title="About"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
          Discover Your Next Adventure
        </h1>
        <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
          Plan short, exciting trips from a few hours to a few days, tailored to your location, time, and weather.
        </h2>
      </div>
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#fbfdfc] text-[#121714] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
        <span className="truncate">Start Planning</span>
      </button>

      {/* About modal */}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default LandingPage;