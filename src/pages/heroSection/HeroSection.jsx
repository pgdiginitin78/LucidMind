import Heading from "../../components/ui/Heading";
import DotField from "./DotField";
import SideRays from "./SideRays";
import SmokeEffect from "./SmokeEffect";
import SplitText from "./SplitText";
import TextType from "./TextType";
import AiParticleDisplay from "./AiParticleDisplay";

function HeroSection() {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-0 bg-gradient-to-r from-[#4B9AF5] to-[#040914]">
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
     
      <SmokeEffect />

      {/* Background left-side Theme Overlay */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[70%] lg:w-[60%] pointer-events-none z-10 bg-gradient-to-r from-[#040914]/95 via-[#040914]/60 to-transparent" />
      <div 
        className="absolute top-1/2 -left-20 -translate-y-1/2 w-[350px] sm:w-[500px] lg:w-[650px] h-[350px] sm:h-[500px] lg:h-[650px] pointer-events-none z-10 opacity-70 blur-[90px] rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 50%, rgba(0, 196, 180, 0.22) 0%, rgba(37, 99, 235, 0.12) 50%, transparent 75%)"
        }}
      />

      {/* Main Hero Container: Flex 2 Columns */}
      <div className="relative z-20 w-full max-w-7xl px-6 sm:px-10 md:px-12 lg:px-16 mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-8 pt-24 md:pt-0">
        
        {/* LEFT SECTION */}
        <div className="w-full md:w-[52%] lg:w-[50%] flex flex-col items-start gap-4 text-left font-['Inter',sans-serif]">
          <div className="flex flex-col items-start">
            <p className="text-[#009A9A] font-light tracking-[0.2em] uppercase text-xs sm:text-sm md:text-base mb-2">
              Helping Leaders Build
            </p>

            <SplitText
              tag="h1"
              className="text-4xl sm:text-5xl md:text-3xl lg:text-[2.8rem] xl:text-[3.2rem] text-white leading-[1.08] tracking-tight font-bold"
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
              Organisations Ready <br /> for the&nbsp;
              <span className="text-[#009A9A]">AI</span> Era.
            </SplitText>
            <div className="w-12 sm:w-16 h-[3px] bg-[#009A9A] mt-6 mb-2"></div>
          </div>

          <TextType
            text={[
              "AI is changing technology. The real challenge is transforming leadership, operating models, and business capabilities.",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            className="text-slate-400 font-medium text-base sm:text-lg md:text-xl leading-relaxed max-w-lg mb-2"
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

          <button className="group cursor-pointer flex items-center gap-4 rounded-full bg-gradient-to-r from-[#00B8B8] via-[#009A9A] to-[#006D77] px-7 py-3 text-white font-medium shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/40 mt-2">
            <span>Schedule a Conversation</span>

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
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

        {/* RIGHT SECTION: Typography & Giant AI */}
        <div className="w-full md:w-[48%] lg:w-[50%] flex items-center justify-center mt-6 md:mt-0">
          <AiParticleDisplay />
        </div>

      </div>
    </div>
  );
}

export default HeroSection;
