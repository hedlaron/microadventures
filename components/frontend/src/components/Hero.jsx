function Hero() {
  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <div className="@container">
        <div className="@[480px]:p-4">
          <div
            className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), 
                url("https://lh3.googleusercontent.com/aida-public/AB6AXuC13RaWYShQTN6z55GE-iwdShhJEl1ZIDRCgm47CdN2XGW4LLRyeL6ngAjIJO2QwWSQqTzRpkTvgs44oq1Vr_W35PRtxTQFqBs7qeGUcDFUIkuVBfIStE11H3G5F9Tf9mIMh0wWqCIRcJXefNpBvq7JF8cxKyNqTMgEqrr0APSOeNqdL-QKU1EBpvxI9atzStIPpN5396H-j3o--a3sAdLAS0ESgPqZQ4nQPdGGop7aIJ64d_qoT9alcvuPOOSYEjeT0uJ45WPr-Ukk")`
            }}
          >
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
