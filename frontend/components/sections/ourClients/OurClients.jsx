"use client";

import { motion } from "framer-motion";

const partnerSegments = [
  {
    title: "Enterprise Leaders",
    roles: "CEOs · COOs · Business Heads",
    description:
      "Aligning legacy operations with adaptive, AI-ready business models.",
    image: "/assets/clients/enterprise-leaders-v2.jpg",
    badgeColor: "text-[#00C4B4] bg-[#00C4B4]/10 border-[#00C4B4]/30",
    hoverBorder:
      "hover:border-[#00C4B4]/60 hover:shadow-[0_0_30px_rgba(0,196,180,0.22)]",
  },
  {
    title: "Technology & Digital Leaders",
    roles: "CIOs · CTOs · CDOs · CAIOs",
    description: "Moving beyond pilots to enterprise-wide value and adoption.",
    image: "/assets/clients/technology-leaders-v2.jpg",
    badgeColor: "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30",
    hoverBorder:
      "hover:border-[#38BDF8]/60 hover:shadow-[0_0_30px_rgba(56,189,248,0.22)]",
  },
  {
    title: "GCC Leaders",
    roles: "GCC Heads · Site Leaders · Delivery Leaders",
    description:
      "Transforming cost-centres into strategic innovation and talent hubs.",
    image: "/assets/clients/gcc-leaders-v2.jpg",
    badgeColor: "text-[#818CF8] bg-[#818CF8]/10 border-[#818CF8]/30",
    hoverBorder:
      "hover:border-[#818CF8]/60 hover:shadow-[0_0_30px_rgba(129,140,248,0.22)]",
  },
  {
    title: "Founders & Growth-Stage Businesses",
    roles: "Startup Founders · SMEs · Scale-ups",
    description:
      "Building the operating models required to scale without breaking.",
    image: "/assets/clients/founders-growth-v2.jpg",
    badgeColor: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30",
    hoverBorder:
      "hover:border-[#F59E0B]/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.22)]",
  },
  {
    title: "Boards & Investors",
    roles: "Board Members · PE & VC Portfolio Companies",
    description:
      "Establishing governance, ESG rigor, and leadership judgment for long-term value.",
    image: "/assets/clients/boards-investors-v2.jpg",
    badgeColor: "text-[#4B9AF5] bg-[#4B9AF5]/10 border-[#4B9AF5]/30",
    hoverBorder:
      "hover:border-[#4B9AF5]/60 hover:shadow-[0_0_30px_rgba(75,154,245,0.22)]",
  },
];

export default function OurClients() {
  return (
    <section id="our-clients" className="relative w-full mb-20 sm:mb-28">
      <div className="relative z-10 w-full">
        {/* Section Heading matching Advisory theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 justify-items-center text-center mb-12 sm:mb-14"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-px bg-[#00C4B4]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00C4B4]">
              WHO WE PARTNER WITH
            </span>
            <div className="w-4 h-px bg-[#00C4B4]" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white tracking-tight leading-tight mb-3">
            Client Leadership Across The Enterprise
          </h2>

          <p className="max-w-2xl text-slate-300 text-xs sm:text-[13px] leading-relaxed font-normal">
            We bring clarity and execution capability to leaders navigating
            complexity across every stage of maturity.
          </p>
        </motion.div>

        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {partnerSegments.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: idx * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-[#040D1E]/90 backdrop-blur-md p-4 sm:p-5 border border-[#142A4A] shadow-[0_15px_40px_rgba(0,0,0,0.55)] ${item.hoverBorder} transition-all duration-300 overflow-hidden`}
            >
              <div>
                {/* Generated Illustration Frame */}
                <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-5 border border-[#142A4A]/80 bg-[#020611] shadow-inner">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040D1E] via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                <div className="mb-2.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11.5px] font-medium border leading-tight ${item.badgeColor}`}
                  >
                    {item.roles}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight mb-2 group-hover:text-[#00C4FF] transition-colors duration-200">
                  {item.title}
                </h3>

                <p className="text-slate-300/85 text-xs sm:text-[12.5px] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto mt-5 sm:mt-6 items-stretch">
          {partnerSegments.slice(3).map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: 0.25 + idx * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-[#040D1E]/90 backdrop-blur-md p-4 sm:p-5 border border-[#142A4A] shadow-[0_15px_40px_rgba(0,0,0,0.55)] ${item.hoverBorder} transition-all duration-300 overflow-hidden`}
            >
              <div>
                {/* Generated Illustration Frame */}
                <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-5 border border-[#142A4A]/80 bg-[#020611] shadow-inner">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040D1E] via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                <div className="mb-2.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11.5px] font-medium border leading-tight ${item.badgeColor}`}
                  >
                    {item.roles}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight mb-2 group-hover:text-[#00C4FF] transition-colors duration-200">
                  {item.title}
                </h3>

                <p className="text-slate-300/85 text-xs sm:text-[12.5px] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
