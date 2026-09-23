"use client";

import { Link } from "@/lib/navigation";
import { useEffect, useState } from "react";
import {
  Briefcase,
  BookOpen,
  Mic,
  ArrowRight,
  Sparkles,
  Database,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ services: 4, blogs: 2, podcasts: 4 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [srvRes, blogRes, podRes] = await Promise.all([
          fetch("/api/services").then((r) => r.json()).catch(() => null),
          fetch("/api/blogs").then((r) => r.json()).catch(() => null),
          fetch("/api/podcasts").then((r) => r.json()).catch(() => null),
        ]);

        setCounts({
          services: srvRes?.services?.length ?? 4,
          blogs: blogRes?.blogs?.length ?? 2,
          podcasts: podRes?.podcasts?.length ?? 4,
        });
      } catch {
        // use fallback counts
      }
    };

    fetchCounts();
  }, []);

  const SECTIONS = [
    // {
    //   title: "Services & Advisory",
    //   description:
    //     "Manage LucidMind enterprise AI capabilities, transformation phases, problem statements, and key deliverables.",
    //   href: "/admin/services",
    //   count: counts.services,
    //   icon: Briefcase,
    // },
    {
      title: "Articles & Insights",
      description:
        "Publish, update, and organize thought leadership articles, mindset shifts, and executive AI perspectives.",
      href: "/admin/blogs",
      count: counts.blogs,
      icon: BookOpen,
    },
    {
      title: "Podcasts & Media",
      description:
        "Upload and curate leadership episodes, LinkedIn discussion embeds, duration, host, and talking points.",
      href: "/admin/podcasts",
      count: counts.podcasts,
      icon: Mic,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#07132b] via-[#091a38] to-[#050e21] border border-[#2563EB]/40 shadow-[0_12px_48px_rgba(0,196,255,0.08)]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(0,196,255,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C4FF]/10 border border-[#00C4FF]/30 text-xs font-semibold text-[#00C4FF]">
              <Sparkles size={13} />
              <span>LucidMind Admin Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, Administrator
            </h1>
            <p className="text-sm text-white/60 max-w-xl leading-relaxed">
              Manage and publish your platform’s core Advisory Services, Executive Articles, and Podcast episodes with direct synchronization to the live website.
            </p>
          </div>

   
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTIONS.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.12 + idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative rounded-2xl p-6 bg-[#071328]/70 hover:bg-[#091833] border border-[#2563EB]/25 hover:border-[#00C4FF]/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_12px_36px_rgba(0,196,255,0.12)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#00C4FF] p-[1px] shadow-[0_0_16px_rgba(0,196,255,0.3)]">
                    <div className="w-full h-full bg-[#071328] rounded-[15px] flex items-center justify-center">
                      <Icon size={22} className="text-[#00C4FF]" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white/90">
                    {sec.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00C4FF] transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                    {sec.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08]">
                <Link
                  href={sec.href}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB]/20 to-[#00C4FF]/20 hover:from-[#2563EB] hover:to-[#00C4FF] text-white transition-all duration-200 border border-[#00C4FF]/30 hover:shadow-[0_0_20px_rgba(0,196,255,0.35)]"
                >
                  <span>Manage {sec.title}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#00C4FF] group-hover:text-white" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-2xl p-5 bg-[#071328]/40 border border-[#2563EB]/20 flex items-center gap-4 text-xs text-white/50"
      >
        <ShieldCheck size={18} className="text-[#00C4FF] shrink-0" />
        <p>
          <strong className="text-white/80">Security Notice:</strong> All endpoints and `/admin/*` routes are protected with single-user JWT tokens and strict route guards. Unauthenticated URL access is blocked automatically.
        </p>
      </motion.div>
    </motion.div>
  );
}
