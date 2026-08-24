

import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Play } from "lucide-react";
import Heading from "../../components/ui/Heading";
import WebGLParticleCanvas from "./WebGLParticleCanvas";
import CapacityVsCapability from "../../assets/podcastThumbnails/Capacity vs Capability.min.webp";

gsap.registerPlugin(ScrollTrigger);

function WaveformIcon({ active = false }) {
  return (
    <svg viewBox="0 0 32 16" className="w-5 h-3" fill="none">
      {[2, 6, 10, 14, 18, 22, 26, 30].map((x, i) => (
        <rect
          key={i}
          x={x - 1}
          y={i % 2 === 0 ? 2 : 5}
          width="2"
          height={i % 2 === 0 ? 12 : 6}
          rx="1"
          fill={active ? "#fff" : "#00C4B4"}
          opacity={0.6 + (i % 3) * 0.15}
        />
      ))}
    </svg>
  );
}

export default function Podcasts() {
  const sectionRef = useRef(null);
  const location = useLocation();
  const isStandalone = location.pathname === "/podcasts";
  const [selectedPodcast, setSelectedPodcast] = useState(0);

  const handleSelectPodcast = (index) => {
    setSelectedPodcast(index);
  };

  const handlePlayClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const podcastsList = [
    {
      id: 1,
      title: "Capacity vs Capability",
      episode: "Ep. 01",
      src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7455569461186641920?compact=1",
      thumbnail: CapacityVsCapability,
      description: [
        "I've been in close conversations with GCC leaders, and something feels different.",
        "Earlier, the conversations were clearer, how fast we can scale, how efficiently we can deliver. Now, the questions are less straightforward. What are we really building toward?",
        "Scale got GCCs a seat at the table. Capability will decide whether they stay there.",
        "That's the shift I'm unpacking in this series, one many leaders are already navigating, even if it's not always articulated directly.",
        "We'll get into:\n✅ Capacity vs Capability\n✅ Why this tension is growing now\n✅ What AI is actually changing\n✅ What leadership needs to rethink",
        "Because the next phase of GCCs won't be defined by how fast they grow, but by how indispensable they become.",
      ],
    },
    {
      id: 2,
      title: "Evolving or Just Getting Better?",
      episode: "Ep. 02",
      src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7461680789940789248?compact=1",
      thumbnail: "/images/podcasts/ep2-thumbnail.jpg",
      description: [
        "Five episodes. One consistent question.",
        "Are GCCs truly evolving or just getting better at the same thing?",
        "Having been part of building one from the ground up, I know this isn't a single decision. It's a series of choices, made consistently, over time.",
        "It starts with the work itself, moving from execution to ownership. It requires talent that thinks in context, not just process. It demands trust that is earned through credibility, not granted by mandate.",
        "And it requires redefining what success actually looks like.",
        "Not how much is delivered. But how much it matters.",
        "The GCCs that define the next decade won't be the ones that grew the fastest. They'll be the ones trusted to shape outcomes, not just support them.",
        "That's the difference between being part of the system and becoming critical to it.",
        "If these are questions you're navigating in your own organisation I'd be glad to continue the conversation.",
      ],
    },
    {
      id: 3,
      title: "Executing Tasks vs Influencing Strategy",
      episode: "Ep. 03",
      src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7460225596988473345?compact=1",
      thumbnail: "/images/podcasts/ep3-thumbnail.jpg",
      description: [
        "In almost every GCC conversation I've been part of, headcount growth is still the moment people lean forward.",
        "And I understand why. It's visible. It's easy to report. It feels like progress.",
        "But here's what I've also seen, two GCCs of same size on paper, playing completely different roles in their organisations.",
        "One executing tasks. The other influencing strategy.",
        "On paper identical. In reality not even comparable.",
        "And yet the metric we celebrate is the same for both.",
        "Because being larger won't automatically mean being more valuable.",
      ],
    },
    {
      id: 4,
      title: "AI and the Exposure of Value",
      episode: "Ep. 04",
      src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7457048215339782144?compact=1",
      thumbnail: "/images/podcasts/ep4-thumbnail.jpg",
      description: [
        "In my conversations with GCC leaders, nobody's saying AI has reduced their workload. If anything, the pace has increased.",
        "But the type of work that still needs a human in it — that's changing fast.",
        "The rule-based, repetitive, effort-heavy work that GCCs have scaled brilliantly for years? AI is doing that faster. And often better.",
        "And as that layer shrinks, what becomes visible is the work that needs context, judgment, and genuine business understanding.",
        "The real impact of AI isn't just about efficiency. It's exposure.",
        "It exposes where value truly sits and where it doesn't.",
        "AI won't replace GCCs. But it will force them to decide.",
        "Are they built to handle work or to create value?",
      ],
    },
    {
      id: 5,
      title: "Trust and Relevance Over Capacity",
      episode: "Ep. 05",
      src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7450826841654927361?compact=1",
      thumbnail: "/images/podcasts/ep5-thumbnail.jpg",
      description: [
        "Capacity got GCCs to where they are. It may not be enough to keep them there.",
        "For years, the model was clear — scale fast, deliver consistently, expand the footprint. And to be fair, that approach created real, measurable value.",
        "But the context has shifted.",
        "Capacity today is easier to create, easier to automate, and easier to replace.",
        "What isn't easy to build is the ability to navigate ambiguity, connect business context with execution, and influence decisions before they're made.",
        "That kind of value doesn't show up in headcount.",
        "It shows up in trust and relevance. It shows up in whether you're in the room when strategy is being shaped.",
        "The harder question for all us in leadership: Growing faster or becoming more indispensable?",
      ],
    },
    {
      id: 6,
      title: "Volume vs Influence",
      episode: "Ep. 06",
      src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7454499198260973570?compact=1",
      thumbnail: "/images/podcasts/ep6-thumbnail.jpg",
      description: [
        "Growth in GCCs is no longer one-dimensional.",
        "For years, success was simple to define — how fast we could scale, how many teams we could build, how much we could deliver.",
        "But something is changing beneath the surface.",
        "Some GCCs are still growing volume. Others are growing influence.",
        "Both look like progress. Both involve hiring, expansion, investment.",
        "But they don't lead to the same place.",
        "Not every organisation sees it yet. But the gap is widening.",
        "When everything looks like growth, what's actually changing underneath?",
      ],
    },
  ];

  const current = podcastsList[selectedPodcast];

  useGSAP(() => {
    gsap.fromTo(
      ".podcasts-headline",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".podcasts-headline",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      ".podcast-video-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".podcast-video-card",
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div className="w-full relative bg-[#040C1A]">
      <div className="w-full border-t border-[#0F2644]" />
      <div className="absolute pointer-events-none top-[-15%] left-[-8%] w-[65%] pb-[65%] rounded-full blur-[2px] bg-[radial-gradient(circle,rgba(0,196,180,0.15)_0%,rgba(0,196,180,0.05)_45%,transparent_70%)]" />
      <div className="absolute pointer-events-none bottom-[-20%] right-[-10%] w-[60%] pb-[60%] rounded-full blur-[2px] bg-[radial-gradient(circle,rgba(14,165,233,0.14)_0%,rgba(14,165,233,0.04)_45%,transparent_70%)]" />
      <div className="absolute pointer-events-none top-[35%] left-1/2 -translate-x-1/2 w-[40%] pb-[25%] rounded-full bg-[radial-gradient(ellipse,rgba(0,196,180,0.06)_0%,transparent_70%)]" />
      <div className="w-full h-[1.5px] bg-[linear-gradient(90deg,transparent_0%,#00C4B4_35%,#0EA5E9_65%,transparent_100%)]" />
      <section
        ref={sectionRef}
        className={`w-full ${isStandalone ? "pt-28 sm:pt-36 pb-12 sm:pb-16" : "py-12 sm:py-16 md:py-20"} relative font-['PlusJakartaSans',sans-serif]`}
      >
        <WebGLParticleCanvas variant="podcast" />
        <div className="w-full max-w-7xl 2xl:max-w-[1660px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 relative z-[2]">
          <div className="podcasts-headline mb-6 sm:mb-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-[#00C4B4]/10 border border-[#00C4B4]/25">
              <WaveformIcon />
              <p className="text-[#00C4B4] font-semibold tracking-[0.2em] uppercase text-[10px] sm:text-xs">
                Podcasts
              </p>
            </div>
            <Heading
              level={2}
              className="font-['Playfair_Display',serif] font-semibold text-[1.4rem] sm:text-[1.7rem] md:text-[2rem] lg:text-[2.3rem] leading-[1.15] tracking-tight text-white mt-2 mb-2"
            >
              Conversations that{" "}
              <span className="bg-[linear-gradient(135deg,#00C4B4,#4B9AF5)] bg-clip-text text-transparent">
                Inspire.
              </span>
            </Heading>
            <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Candid insights from Ravishankar Pingali on leadership, AI, and
              the future of Global Capability Centres.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 xl:gap-8 items-start">
            <div className="w-full md:w-[300px] xl:w-[420px] 2xl:w-[440px] flex-shrink-0">
              <div className="flex flex-col gap-3.5">
                {podcastsList.map((podcast, index) => {
                  const isActive = selectedPodcast === index;
                  return (
                    <motion.div
                      key={podcast.id}
                      initial={{ opacity: 0, x: -40, scale: 0.97 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => handleSelectPodcast(index)}
                      whileHover={{ x: isActive ? 0 : 6, scale: 1.01 }}
                      className={`cursor-pointer rounded-lg flex items-center gap-3 px-3 py-2.5 group transition-all duration-300 ${
                        isActive
                          ? "bg-[linear-gradient(135deg,rgba(0,196,180,0.18)_0%,rgba(37,99,235,0.12)_100%)] border border-[#00C4B4]/45 shadow-[0_4px_24px_rgba(0,196,180,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]"
                          : "bg-white/[0.03] border border-white/[0.07]"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 transition-all duration-300 ${
                          isActive
                            ? "bg-[linear-gradient(135deg,#00C4B4,#2563EB)] shadow-[0_4px_16px_rgba(0,196,180,0.35)]"
                            : "bg-white/[0.06]"
                        }`}
                      >
                        {isActive ? (
                          <WaveformIcon active />
                        ) : (
                          <span className="text-[10px] font-bold text-[#00C4B4] leading-none px-0.5 ">
                            {podcast.episode}
                          </span>
                        )}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p
                          className={`text-xs 2xl:text-base font-semibold leading-snug line-clamp-2 transition-colors duration-300 ${isActive ? "text-white" : "text-white/60 group-hover:text-white/85"}`}
                        >
                          {podcast.title}
                        </p>
                        <p className="text-[10px] 2xl:text-sm text-white/30 mt-0.5">
                          {podcast.episode}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full shrink-0 mr-1 bg-[linear-gradient(135deg,#00C4B4,#4B9AF5)] shadow-[0_0_6px_rgba(0,196,180,0.7)]" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="podcast-video-card flex-1 w-full lg:sticky lg:top-24 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPodcast}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
                >
                  <div
                    onClick={() => handlePlayClick(current.src)}
                    className="relative w-full pt-[52%] lg:pt-[42%] xl:pt-[50%] cursor-pointer group/thumb"
                  >
                    <img
                      src={current.thumbnail}
                      alt={current.title}
                      loading="lazy"
                      decoding="async"
                      width={700}
                      height={400}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,26,0.15)_0%,rgba(4,12,26,0.55)_100%)] transition-opacity duration-300 group-hover/thumb:bg-[rgba(4,12,26,0.65)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-[linear-gradient(135deg,#00C4B4,#2563EB)] shadow-[0_8px_28px_rgba(0,196,180,0.45)] transition-transform duration-300 group-hover/thumb:scale-110">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-[#00C4B4] px-2.5 py-1 rounded-full bg-[#040C1A]/70 border border-[#00C4B4]/25 backdrop-blur-sm">
                      <WaveformIcon />
                      {current.episode}
                    </span>
                  </div>
                  <div className="px-4 sm:px-5 py-4 border-t border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_100%)]">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <h3 className="font-['Playfair_Display',serif] font-bold text-white text-base sm:text-lg 2xl:text-2xl leading-snug">
                        {current.title}
                      </h3>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
