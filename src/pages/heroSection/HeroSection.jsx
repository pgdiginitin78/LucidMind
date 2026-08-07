import AiParticleDisplay from "./AiParticleDisplay";
import DotField from "./DotField";
import SplitText from "./SplitText";
import TextType from "./TextType";

function HeroSection() {
  
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20 md:py-0 bg-white">
      <div className="absolute inset-0 w-full h-full z-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#00C4B4"
          gradientTo="#2563EB"
          glowColor="#00C4B4"
        />
      </div>

      <div className="absolute inset-0 md:inset-y-0 md:left-0 md:right-auto w-full md:w-[70%] lg:w-[60%] pointer-events-none z-10 bg-gradient-to-b md:bg-gradient-to-r from-white/95 via-white/70 md:via-white/60 to-white/60 md:to-transparent" />

      <div
        className="absolute top-1/3 sm:top-1/2 -left-16 sm:-left-20 -translate-y-1/2 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] pointer-events-none z-10 opacity-40 sm:opacity-50 blur-[60px] sm:blur-[90px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(0, 196, 180, 0.3) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 75%)",
        }}
      />

      <div className="relative z-20 w-full max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-8 lg:gap-8">
        <div className="w-full md:w-[48%] lg:w-[50%] flex items-center justify-center order-first md:order-last scale-75 sm:scale-90 md:scale-100 -mb-6 sm:-mb-4 md:mb-0">
          <AiParticleDisplay />
        </div>

        <div className="w-full md:w-[52%] lg:w-[50%] flex flex-col items-center md:items-start gap-4 text-center md:text-left font-['Inter',sans-serif]">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-[#009A9A] font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm md:text-base mb-2">
              Helping Leaders Build
            </p>

            <SplitText
              tag="h1"
              className="text-3xl sm:text-4xl md:text-4xl lg:text-[2.8rem] xl:text-[3.2rem] text-[#050B18] leading-[1.15] sm:leading-[1.1] md:leading-[1.08] tracking-tight font-bold"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="left"
              onLetterAnimationComplete={handleAnimationComplete}
            >
              Organisations Ready <br /> for the{" "}
              <span className="text-[#009A9A]">AI</span> Era.
            </SplitText>
            <div className="w-10 sm:w-12 md:w-16 h-[3px] bg-[#009A9A] mt-4 sm:mt-6 mb-2"></div>
          </div>

          <TextType
            text={[
              "AI is changing technology. The real challenge is transforming leadership, operating models, and business capabilities.",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            className="text-[#050B18]/70 font-medium text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xs sm:max-w-md md:max-w-lg mb-2"
            showCursor
            cursorCharacter="_"
            texts={[
              "AI is changing technology. The real challenge is transforming leadership, operating models, and business capabilities.",
            ]}
            deletingSpeed={50}
            variableSpeedEnabled={false}
            variableSpeedMin={60}
            variableSpeedMax={120}
            cursorBlinkDuration={0.5}
          />

          <button className="group cursor-pointer flex items-center justify-center gap-3 sm:gap-4 rounded-full bg-gradient-to-r from-[#00B8B8] via-[#009A9A] to-[#006D77] px-5 py-2.5 sm:px-7 sm:py-3 text-white text-sm sm:text-base font-medium shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/40 mt-2 w-full sm:w-auto">
            <span>Schedule a Conversation</span>

            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      
    </div>
  );
}

export default HeroSection;