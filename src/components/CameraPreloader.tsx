import { useEffect, useState } from "react";

interface CameraPreloaderProps {
  onComplete?: () => void;
}

export function CameraPreloader({ onComplete }: CameraPreloaderProps) {
  const [stage, setStage] = useState<
    | "init"
    | "body"
    | "mount"
    | "lens"
    | "focus"
    | "logo"
    | "shutter"
    | "flash"
    | "done"
  >("init");

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Disable body scrolling while preloader is active
    document.body.style.overflow = "hidden";

    // Preload critical hero images in background while preloader is active
    if (typeof window !== "undefined") {
      const img1 = new Image();
      img1.src = "/assets/hero.jpg";
      const img2 = new Image();
      img2.src = "/assets/about.jpg";
    }

    // Sequence Timeline (Exact 4.3 Seconds Total Duration)
    const t1 = setTimeout(() => setStage("body"), 200);     // 0.2s - Body Assembly
    const t2 = setTimeout(() => setStage("mount"), 800);    // 0.8s - Mount & Viewfinder
    const t3 = setTimeout(() => setStage("lens"), 1400);    // 1.4s - Lens & Dials Assembly
    const t4 = setTimeout(() => setStage("focus"), 2100);   // 2.1s - Lens Focusing
    const t5 = setTimeout(() => setStage("logo"), 2800);    // 2.8s - Brand & Tagline Reveal
    const t6 = setTimeout(() => setStage("shutter"), 3500); // 3.5s - Shutter Press
    const t7 = setTimeout(() => setStage("flash"), 3800);   // 3.8s - Full Screen Flash
    const t8 = setTimeout(() => setStage("done"), 4100);    // 4.1s - Fade Out Transition
    const t9 = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      onComplete?.();
    }, 4300);                                               // 4.3s - Complete

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (!visible) return null;

  const stageOrder = ["init", "body", "mount", "lens", "focus", "logo", "shutter", "flash", "done"];
  const currentIdx = stageOrder.indexOf(stage);

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#FAFAFA] text-[#121110] transition-opacity duration-500 ease-in-out select-none ${
        stage === "done" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient Glow */}
      <div
        className="pointer-events-none absolute h-[700px] w-[700px] rounded-full transition-all duration-700"
        style={{
          background:
            stage === "focus" || stage === "logo" || stage === "shutter"
              ? "radial-gradient(circle, rgba(153,0,13,0.3) 0%, rgba(153,0,13,0.08) 45%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* FULL-SCREEN CAMERA FLASH OVERLAY */}
      <div
        className={`pointer-events-none absolute inset-0 z-50 bg-white transition-opacity duration-250 ${
          stage === "flash" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* CAMERA VECTOR ASSEMBLY CONTAINER */}
      <div className="relative flex flex-col items-center">
        <div className="relative h-64 w-80 sm:h-72 sm:w-96 flex items-center justify-center">
          <svg viewBox="0 0 400 300" className="h-full w-full overflow-visible drop-shadow-2xl">
            <defs>
              {/* Luxury Red Gradients */}
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B8141F" />
                <stop offset="50%" stopColor="#99000D" />
                <stop offset="100%" stopColor="#5E0005" />
              </linearGradient>

              {/* Brushed Dark Metal */}
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2D2D2D" />
                <stop offset="50%" stopColor="#1A1A1A" />
                <stop offset="100%" stopColor="#0F0F0F" />
              </linearGradient>

              {/* Multi-coated Lens Glass */}
              <linearGradient id="lensGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#0B0B0B" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#99000D" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.75" />
              </linearGradient>

              {/* Lens Reflection Flare */}
              <radialGradient id="flare" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#B8141F" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.2" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Leatherette Grip Pattern */}
              <pattern id="gripPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1" fill="#111111" />
              </pattern>
            </defs>

            {/* 1. CAMERA BODY */}
            <g
              className="transition-all duration-700 ease-out"
              style={{
                transform: currentIdx >= 1 ? "translateY(0) scale(1)" : "translateY(40px) scale(0.85)",
                opacity: currentIdx >= 1 ? 1 : 0,
              }}
            >
              {/* Main Body Chassis */}
              <rect x="60" y="100" width="280" height="150" rx="20" fill="url(#metalGrad)" stroke="#333" strokeWidth="1.5" />

              {/* Textured Leatherette Grip */}
              <rect x="70" y="110" width="70" height="130" rx="10" fill="url(#gripPattern)" opacity="0.9" />

              {/* Gold Top Trim Line */}
              <line x1="60" y1="108" x2="340" y2="108" stroke="url(#goldGrad)" strokeWidth="2" opacity="0.8" />

              {/* Red Emblem Dot */}
              <circle cx="115" cy="130" r="4" fill="#99000D" />
            </g>

            {/* 2. VIEWFINDER & TOP HOUSING */}
            <g
              className="transition-all duration-700 ease-out"
              style={{
                transform: currentIdx >= 2 ? "translateY(0)" : "translateY(-30px)",
                opacity: currentIdx >= 2 ? 1 : 0,
              }}
            >
              {/* Prism Viewfinder Top */}
              <polygon points="160,100 240,100 225,60 175,60" fill="url(#metalGrad)" stroke="#444" strokeWidth="1.5" />
              {/* Hot Shoe Mount */}
              <rect x="185" y="52" width="30" height="8" rx="2" fill="url(#goldGrad)" />
            </g>

            {/* 3. BUTTONS & DIALS */}
            <g
              className="transition-all duration-700 ease-out"
              style={{
                transform: currentIdx >= 2 ? "translateX(0)" : "translateX(30px)",
                opacity: currentIdx >= 2 ? 1 : 0,
              }}
            >
              {/* Mode Dial Right */}
              <rect x="270" y="85" width="24" height="15" rx="3" fill="#222" stroke="url(#goldGrad)" strokeWidth="1" />
              {/* Command Dial Left */}
              <rect x="105" y="88" width="20" height="12" rx="3" fill="#222" stroke="#444" strokeWidth="1" />

              {/* Shutter Button */}
              <g
                className="transition-transform duration-200"
                style={{
                  transform: stage === "shutter" || stage === "flash" ? "translateY(4px)" : "translateY(0)",
                }}
              >
                <rect x="298" y="80" width="18" height="20" rx="4" fill="url(#goldGrad)" />
                {/* Status LED */}
                <circle
                  cx="260"
                  cy="125"
                  r="3.5"
                  className="transition-colors duration-300"
                  fill={stage === "shutter" || stage === "flash" ? "#B8141F" : "#10B981"}
                />
              </g>
            </g>

            {/* 4. LENS MOUNT RING */}
            <g
              className="transition-all duration-700 ease-out"
              style={{
                transform: currentIdx >= 2 ? "scale(1)" : "scale(0.4)",
                opacity: currentIdx >= 2 ? 1 : 0,
                transformOrigin: "200px 175px",
              }}
            >
              {/* Metallic Red Outer Ring */}
              <circle cx="200" cy="175" r="55" fill="none" stroke="url(#goldGrad)" strokeWidth="4" />
              {/* Inner Chrome Bayonet */}
              <circle cx="200" cy="175" r="50" fill="none" stroke="#555" strokeWidth="2" />
            </g>

            {/* 5. LENS BARREL & GLASS */}
            <g
              className="transition-all duration-800 ease-out"
              style={{
                transform:
                  currentIdx >= 3
                    ? currentIdx >= 4
                      ? "scale(1.06) rotate(0deg)"
                      : "scale(1) rotate(180deg)"
                    : "scale(0.5) rotate(-120deg)",
                opacity: currentIdx >= 3 ? 1 : 0,
                transformOrigin: "200px 175px",
              }}
            >
              {/* Lens Outer Barrel */}
              <circle cx="200" cy="175" r="46" fill="#121212" stroke="#222" strokeWidth="2" />
              {/* Knurled Focus Ribs */}
              <circle cx="200" cy="175" r="42" fill="none" stroke="url(#goldGrad)" strokeWidth="2" strokeDasharray="3 3" />
              {/* Multi-coated Glass Lens */}
              <circle cx="200" cy="175" r="35" fill="url(#lensGlass)" />

              {/* Iris Aperture Blades Contracting */}
              <circle
                cx="200"
                cy="175"
                r={stage === "focus" || stage === "logo" || stage === "shutter" ? "16" : "28"}
                fill="none"
                stroke="#000"
                strokeWidth="4"
                className="transition-all duration-700 ease-in-out"
              />

              {/* Lens Flare Reflection Highlight */}
              <path
                d="M 180 150 Q 210 145 220 160 Q 200 170 180 150 Z"
                fill="url(#flare)"
                opacity="0.85"
                className="transition-opacity duration-700"
              />

              {/* Lens Focal Marking */}
              <text x="200" y="215" textAnchor="middle" fill="#99000D" fontSize="7" fontWeight="bold" letterSpacing="1">
                ISHOOTS 50mm f/1.2
              </text>
            </g>

            {/* 6. POP-UP FLASH HOUSING */}
            <g
              className="transition-all duration-500 ease-out"
              style={{
                transform: currentIdx >= 2 ? "translateY(0)" : "translateY(15px)",
                opacity: currentIdx >= 2 ? 1 : 0,
              }}
            >
              <rect x="180" y="44" width="40" height="10" rx="2" fill="#1C1C1C" stroke="url(#goldGrad)" strokeWidth="1" />
              <rect
                x="185"
                y="46"
                width="30"
                height="6"
                rx="1"
                fill={stage === "shutter" || stage === "flash" ? "#FFFFFF" : "#93C5FD"}
                className="transition-colors duration-250"
              />
            </g>
          </svg>
        </div>

        {/* LOGO & TYPOGRAPHY REVEAL */}
        <div className="mt-6 flex flex-col items-center text-center px-4">
          {/* ISHOOTS LOGO */}
          <h1
            className={`font-display text-3xl sm:text-4xl tracking-[0.35em] text-[#121110] transition-all duration-700 ${
              currentIdx >= 5
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            I<span className="text-[#99000D]">SHOOTS</span>
          </h1>

          {/* TAGLINE */}
          <p
            className={`mt-2 font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-[#5A5650] transition-all duration-700 delay-150 ${
              currentIdx >= 5
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            Capturing Every Special Moment
          </p>

          {/* LUXURY STATUS BADGE */}
          <div
            className={`mt-6 flex items-center gap-2 rounded-full border border-[#99000D]/30 bg-white/80 px-4 py-1.5 backdrop-blur transition-all duration-700 delay-200 ${
              currentIdx >= 5 ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#99000D] animate-ping" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#99000D]">
              {stage === "shutter" || stage === "flash" ? "Focus Locked • Capturing" : "Lens Calibrating"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
