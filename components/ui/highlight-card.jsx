"use client";

export default function HighlightCard({
  title,
  description,
  icon,
  theme = "blue",
}) {
  const config = {
    blue: {
      titleColor: "text-[#1B64F2]",
      podStyle: {
        background:
          "radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.98) 0%, rgba(225, 240, 255, 0.78) 55%, rgba(190, 222, 255, 0.62) 100%)",
        border: "1.5px solid rgba(255, 255, 255, 0.95)",
        boxShadow:
          "0 0 0 8px rgba(210, 232, 255, 0.65), 0 0 28px rgba(59, 130, 246, 0.35), 0 8px 24px -2px rgba(37, 99, 235, 0.25), inset 0 2px 4px rgba(255, 255, 255, 1)",
      },
      dividerColor: "bg-[#1B64F2] shadow-[0_0_8px_rgba(27,100,242,0.45)]",
      dots: ["bg-[#1B64F2]", "bg-[#60A5FA]", "bg-[#93C5FD]"],
      hoverBorder: "hover:border-blue-200/90",
      wave: (
        <svg
          className="absolute bottom-0 left-0 w-full h-[145px] pointer-events-none rounded-b-[28px] sm:rounded-b-[32px] overflow-hidden"
          viewBox="0 0 360 145"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="blueWaveBackExact"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#BFDBFE" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="blueWaveFrontExact"
              x1="0%"
              y1="0%"
              x2="80%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.75" />
              <stop offset="65%" stopColor="#93C5FD" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient
              id="blueWaveCornerExact"
              x1="0%"
              y1="0%"
              x2="60%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M0 45 C70 52 140 102 195 145 L0 145 Z"
            fill="url(#blueWaveBackExact)"
          />
          <path
            d="M0 72 C55 78 110 115 148 145 L0 145 Z"
            fill="url(#blueWaveFrontExact)"
          />
          <path
            d="M0 108 C35 110 75 128 95 145 L0 145 Z"
            fill="url(#blueWaveCornerExact)"
          />
        </svg>
      ),
    },
    teal: {
      titleColor: "text-[#1B64F2]",
      podStyle: {
        background:
          "radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.98) 0%, rgba(220, 252, 245, 0.78) 55%, rgba(175, 245, 235, 0.62) 100%)",
        border: "1.5px solid rgba(255, 255, 255, 0.95)",
        boxShadow:
          "0 0 0 8px rgba(195, 248, 238, 0.72), 0 0 28px rgba(20, 200, 180, 0.35), 0 8px 24px -2px rgba(13, 148, 136, 0.22), inset 0 2px 4px rgba(255, 255, 255, 1)",
      },
      dividerColor: "bg-[#00C4B4] shadow-[0_0_8px_rgba(0,196,180,0.45)]",
      dots: ["bg-[#00C4B4]", "bg-[#2DD4BF]", "bg-[#99F6E4]"],
      hoverBorder: "hover:border-teal-200/90",
      wave: (
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-[145px] pointer-events-none rounded-b-[28px] sm:rounded-b-[32px] overflow-hidden"
          viewBox="0 0 360 145"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="tealWaveLeftExact"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.48" />
              <stop offset="70%" stopColor="#99F6E4" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="tealWaveRightBackExact"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#99F6E4" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="tealWaveRightFrontExact"
              x1="100%"
              y1="0%"
              x2="20%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#5EEAD4" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#99F6E4" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient
              id="tealWaveRightCornerExact"
              x1="100%"
              y1="0%"
              x2="50%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.10" />
            </linearGradient>
          </defs>
          <path
            d="M0 92 C45 95 85 120 125 145 L0 145 Z"
            fill="url(#tealWaveLeftExact)"
          />
          <path
            d="M360 25 C280 40 215 98 165 145 L360 145 Z"
            fill="url(#tealWaveRightBackExact)"
          />
          <path
            d="M360 55 C295 66 240 108 208 145 L360 145 Z"
            fill="url(#tealWaveRightFrontExact)"
          />
          <path
            d="M360 95 C320 98 280 122 258 145 L360 145 Z"
            fill="url(#tealWaveRightCornerExact)"
          />
        </svg>
      ),
    },
    purple: {
      titleColor: "text-[#1B64F2]",
      podStyle: {
        background:
          "radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.98) 0%, rgba(245, 235, 255, 0.78) 55%, rgba(225, 205, 255, 0.62) 100%)",
        border: "1.5px solid rgba(255, 255, 255, 0.95)",
        boxShadow:
          "0 0 0 8px rgba(235, 225, 255, 0.72), 0 0 28px rgba(150, 100, 255, 0.35), 0 8px 24px -2px rgba(124, 58, 237, 0.22), inset 0 2px 4px rgba(255, 255, 255, 1)",
      },
      dividerColor: "bg-[#7C3AED] shadow-[0_0_8px_rgba(124,58,237,0.45)]",
      dots: ["bg-[#DDD6FE]", "bg-[#C4B5FD]", "bg-[#7C3AED]"],
      hoverBorder: "hover:border-purple-200/90",
      wave: (
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-[145px] pointer-events-none rounded-b-[28px] sm:rounded-b-[32px] overflow-hidden"
          viewBox="0 0 360 145"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="purpleWaveLeftExact"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.50" />
              <stop offset="70%" stopColor="#EDE9FE" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#FAF5FF" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="purpleWaveRightBackExact"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.55" />
              <stop offset="65%" stopColor="#DDD6FE" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#FAF5FF" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="purpleWaveRightFrontExact"
              x1="100%"
              y1="0%"
              x2="20%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.75" />
              <stop offset="65%" stopColor="#C4B5FD" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient
              id="purpleWaveRightCornerExact"
              x1="100%"
              y1="0%"
              x2="40%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.10" />
            </linearGradient>
          </defs>
          <path
            d="M0 92 C45 95 85 120 125 145 L0 145 Z"
            fill="url(#purpleWaveLeftExact)"
          />
          <path
            d="M360 22 C280 38 215 98 165 145 L360 145 Z"
            fill="url(#purpleWaveRightBackExact)"
          />
          <path
            d="M360 52 C295 64 240 108 202 145 L360 145 Z"
            fill="url(#purpleWaveRightFrontExact)"
          />
          <path
            d="M360 92 C320 96 280 122 252 145 L360 145 Z"
            fill="url(#purpleWaveRightCornerExact)"
          />
        </svg>
      ),
    },
  };

  const current = config[theme] || config.blue;

  return (
    <div
      className={`group relative flex flex-col items-center justify-between text-center w-full h-full min-h-[420px] sm:min-h-[445px] p-6 sm:p-8 pt-8 pb-7 rounded-[28px] sm:rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/85 shadow-[0_16px_36px_-8px_rgba(50,90,160,0.12),0_4px_12px_rgba(0,0,0,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_24px_48px_-6px_rgba(50,90,160,0.18)] hover:-translate-y-1 transition-all duration-300 overflow-hidden select-none ${current.hoverBorder}`}
    >
      {current.wave}

      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="mb-6 sm:mb-7 flex items-center justify-center">
          <div
            className="w-[74px] h-[74px] sm:w-[80px] sm:h-[80px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={current.podStyle}
          >
            {icon}
          </div>
        </div>

        <h3
          className={`font-bold text-[19px] sm:text-[21px] leading-[1.25] tracking-tight mb-2.5 max-w-[250px] ${current.titleColor}`}
        >
          {title}
        </h3>

        <div className="space-y-0.5 max-w-[275px]">
          {Array.isArray(description) ? (
            description.map((line, idx) => (
              <p
                key={idx}
                className="text-[#4A5870] text-[13px] sm:text-[14px] leading-[1.55] font-normal"
              >
                {line}
              </p>
            ))
          ) : (
            <p className="text-[#4A5870] text-[13px] sm:text-[14px] leading-[1.55] font-normal">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full mt-6">
        <div
          className={`w-11 h-[3px] rounded-full ${current.dividerColor} mb-3`}
        />

        <div className="flex items-center justify-center gap-1.5">
          {current.dots.map((dotClass, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-110 ${dotClass}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
