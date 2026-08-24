import { motion } from "framer-motion";
import HighlightCard from "../../components/ui/highlight-card";
import Heading from "../../components/ui/Heading";

function LightbulbIcon() {
  return (
    <svg className="w-10 h-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="w-10 h-10 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="w-10 h-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

const philosophies = [
  {
    title: "Strategy for Better Decisions",
    description: [
      "Helping leadership teams make",
      "informed, future-ready decisions.",
    ],
    icon: <LightbulbIcon />,
  },
  {
    title: "Execution for Stronger Organisations",
    description: [
      "Building the capabilities, leadership,",
      "and operating models required to",
      "execute with confidence.",
    ],
    icon: <GearIcon />,
  },
  {
    title: "Outcomes for Measurable Impact",
    description: [
      "Driving sustainable growth through",
      "responsible transformation and",
      "tangible business results.",
    ],
    icon: <TrendingUpIcon />,
  },
];

export default function AdvisoryPhilosophy() {
  return (
    <section className="w-full bg-[#f8fafc] py-12 sm:py-16 md:py-20">
      <div className="w-full max-w-7xl 2xl:max-w-[1660px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-start mb-7 md:mb-10"
        >
          <Heading
            level={2}
            className="text-2xl lg:text-3xl text-brand-blue mb-2 tracking-tight"
          >
            Our Advisory Philosophy
          </Heading>
          <p className="text-base lg:text-xl text-gray-600 font-medium max-w-3xl">
            From Strategy to Execution. From Execution to Impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-8 items-stretch 2xl:px-12">
          {philosophies.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
              className="h-full"
            >
              <HighlightCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                className="h-full w-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
