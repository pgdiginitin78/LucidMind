import React from "react";
import { motion } from "framer-motion";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import HighlightCard from "../../components/ui/highlight-card";
import Heading from "../../components/ui/Heading";

const philosophies = [
  {
    title: "Strategy for Better Decisions",
    description: [
      "Helping leadership teams make",
      "informed, future-ready decisions."
    ],
    icon: <LightbulbRoundedIcon className="text-brand-blue" sx={{ fontSize: 40 }} />,
  },
  {
    title: "Execution for Stronger Organisations",
    description: [
      "Building the capabilities, leadership,",
      "and operating models required to",
      "execute with confidence."
    ],
    icon: <SettingsSuggestRoundedIcon className="text-brand-teal" sx={{ fontSize: 40 }} />,
  },
  {
    title: "Outcomes for Measurable Impact",
    description: [
      "Driving sustainable growth through",
      "responsible transformation and",
      "tangible business results."
    ],
    icon: <TrendingUpRoundedIcon className="text-brand-blue" sx={{ fontSize: 40 }} />,
  },
];

export default function AdvisoryPhilosophy() {
  return (
    <section className="w-full bg-[#f8fafc] py-16 px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="max-w-[1220px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-7 md:mb-10"
        >
          <Heading level={2} className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-6 tracking-tight">
            Our Advisory Philosophy
          </Heading>
          <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-3xl mx-auto">
            From Strategy to Execution. From Execution to Impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
          {philosophies.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
              className="flex justify-center"
            >
              <HighlightCard
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
