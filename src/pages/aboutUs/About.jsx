import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  Briefcase,
  GraduationCap,
  BadgeCheck,
  MapPin,
  Link2,
  TrendingUp,
  Users,
  Sparkles,
  DollarSign,
  Trophy,
  Lightbulb,
  Target,
  Globe,
  Bot,
  Search,
  X,
  Menu,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Mail,
  Send,
  CheckCircle2,
  Quote,
  Loader2,
} from "lucide-react";
import profileImg from "../../assets/Ravishankar Pingali.png";
import WebGLParticleCanvas from "../featuredInsights/WebGLParticleCanvas";

const INK = "#0B1220";
const TEAL = "#00C4B4";
const BLUE = "#2563EB";
const GOLD = "#C9A24B";
const PAPER = "#F6F7FB";

const NAV_LINKS = [
  { id: "hero", label: "Overview" },
  { id: "about", label: "Profile" },
  { id: "ledger", label: "Ledger" },
  { id: "experience", label: "Record" },
  { id: "credentials", label: "Credentials" },
  { id: "principles", label: "Principles" },
  { id: "contact", label: "Connect" },
];

const STATS = [
  { icon: TrendingUp, value: 27, suffix: "+", label: "Years in the field", note: "Engineer to Managing Director" },
  { icon: Users, value: 220, suffix: "+", label: "Team scaled", note: "From a 15-person desk" },
  { icon: DollarSign, value: 100, suffix: "M+", label: "Transformation led", note: "Across BFSI & GCC programs" },
  { icon: Sparkles, value: 30, suffix: "%", label: "Leadership pipeline built", note: "Through DEI & mentoring" },
];

const EXPERIENCE = [
  {
    role: "Managing Director",
    company: "Wurth IT India",
    groupLabel: "Full-time · 9 yrs 10 mos · On-site",
    period: "Jan 2023 — Jan 2026",
    duration: "3 yrs 1 mo",
    location: "Pune District, Maharashtra, India",
    type: "Full-time",
    description:
      "I led the transformation of Wurth IT India into a strategic Technology Capability Centre, driving global alignment, business impact, and innovation while serving as a Board Member shaping vision and governance.",
    points: [
      "Partnered with global leadership to align GCC strategy with enterprise priorities, ensuring resilience, compliance, and innovation.",
      "Transitioned GCC from an extended IT hub into a strategic value creator delivering measurable business outcomes.",
      "Contributed to NASSCOM, ANSR, and Zinnov GCC forums, sharing practitioner insights on capability building and digital transformation.",
      "Built high-performing multi-disciplinary teams in AI, Automation, Low-Code, and E-Business platforms.",
      "Strengthened the leadership pipeline by 30%, while embedding diversity, inclusion, and innovative culture through cross-functional programs and hackathons.",
    ],
    skills: "GCC Strategy, P&L Management, +5 skills",
  },
  {
    role: "Chief Operating Officer",
    company: "Wurth IT India",
    period: "Aug 2019 — Dec 2022",
    duration: "3 yrs 5 mos",
    location: "Pune Area, India",
    type: "Full-time",
    description:
      "I was promoted to COO role for successfully building a business unit from the ground up. In this role, I was leading day-to-day operations, driving strategic growth, and ensuring P&L accountability through technology-led innovation and organizational development.",
    points: [
      "Steered strategic customer discussions, ensuring smooth service discontinuation while safeguarding brand reputation and positioning.",
      "Drove 2x business growth in external markets within two years.",
      "Improved employee engagement and retention by 15%, enhancing employer-of-choice positioning.",
      "Forged strategic collaborations with academia and start-up ecosystems to boost brand visibility and innovation outreach.",
      "Represented the company as a thought leader by leveraging ecosystem partnerships for talent, co-creation, and market presence.",
      "Enhanced cost management and revenue visibility through centralized MIS, lifting margins by 3%.",
    ],
    skills: "Stakeholder Management, Business Growth Strategies, +6 skills",
  },
  {
    role: "Director - Digital Business Solutions",
    company: "Wurth IT India",
    period: "Apr 2016 — Jul 2019",
    duration: "3 yrs 4 mos",
    location: "Pune District, Maharashtra, India",
    type: "Full-time",
    description:
      "I was brought in to establish and lead a new business unit beyond SAP ERP, spearheading digital innovation strategies and building cross-functional teams that created a strong niche in E-Business and emerging technologies.",
    points: [
      "Grew revenues by 30%+ YoY by launching a new unit for E-Business, E-Commerce, Sales Force Automation, and Web & Mobile Applications.",
      "Strengthened market visibility by building strong OEM vendor partnerships and securing early mover advantage with OutSystems in 2018.",
      "Accelerated growth through sales leadership and CXO engagement in Insurance and Manufacturing for Low Code and eCommerce solutions.",
      "Conceived and rolled out a field force automation tool for Asia Pacific, positioning India as a key delivery centre.",
      "Secured senior stakeholder buy-in in Germany, winning full ownership for product delivery from India.",
      "Delivered product adoption across 12 companies within four months, enhancing credibility and visibility of Wurth IT India in the Group.",
    ],
    skills: "Emerging Technologies, Coaching & Mentoring, +6 skills",
  },
  {
    role: "Co-Founder & Director",
    company: "Digivault Technology Solutions LLP",
    groupLabel: "Self-employed",
    period: "Jul 2014 — Mar 2016",
    duration: "1 yr 9 mos",
    location: "Pune District, Maharashtra, India · On-site",
    type: "Self-employed",
    description:
      "I co-founded a bootstrapped startup in Outsourced Product Development and process automation, leading end-to-end business operations, customer acquisition, and P&L accountability to build the organization from the ground up.",
    points: [
      "Established and scaled the startup, growing the team from zero to seven within the first year.",
      "Secured new SME business by creating strategic partnerships with customers, vendors, and industry stakeholders.",
      "Strengthened brand presence by collaborating with digital marketing start-ups to launch targeted campaigns.",
      "Earned recognition at industry forums like TiE Pune through enhanced visibility and innovative positioning.",
      "Designed and executed a business plan that delivered 80% sales growth in the second year of operations.",
    ],
    skills: "Business Growth Strategies, Organizational Development, +4 skills",
  },
  {
    role: "Sr. Delivery Manager",
    company: "Syntel Ltd",
    groupLabel: "Full-time",
    period: "Jun 2010 — May 2014",
    duration: "4 yrs",
    location: "Pune District, Maharashtra, India · On-site",
    type: "Full-time",
    description:
      "I was brought on to drive growth in US and European markets, managing strategic client relationships and full P&L accountability while leading delivery, sales, and operations for marquee financial services & Life Insurance accounts.",
    points: [
      "Increased account revenues by 20–25% YoY through a focused account-based marketing strategy.",
      "Elevated India delivery team visibility, resulting in improved client engagement and satisfaction.",
      "Positioned experts to win high-value legacy modernization business for a US financial services major.",
      "Sustained 26% margins, strengthening long-term account profitability.",
      "Secured a marquee UK investment banking client, outperforming top Indian IT competitors.",
      "Grew revenues four times to $8M in 2.5 years while maintaining 34%+ operating margins.",
    ],
    skills: "People Development & Management, Business Growth Strategies, +5 skills",
  },
  {
    role: "Delivery Manager",
    company: "Wipro Technologies",
    groupLabel: "Full-time · 4 yrs 10 mos · On-site",
    period: "Aug 2008 — May 2010",
    duration: "1 yr 10 mos",
    location: "Pune, Bangalore, India",
    type: "Full-time",
    description:
      "In my role at Wipro Technologies, I spearheaded significant business transformation initiatives within the BFSI domain, managing multimillion-dollar programs and leading large cross-functional teams. My focus was on developing strategic technology roadmaps that aligned with the goals of major insurance carriers in North America, driving efficiency and innovation across projects.",
    points: [],
    skills: "Stakeholder Management, Business Transformation, +5 skills",
  },
  {
    role: "Senior Consultant",
    company: "Wipro Technologies",
    period: "Aug 2005 — Jul 2008",
    duration: "3 yrs",
    location: "Columbus, Ohio, United States, Toronto, Ontario, Canada",
    type: "Full-time",
    description:
      "Led marquee $12M business transformation initiative for Fortune 500 insurance client as Chief Architect at onsite in US, directing cross-functional team of 15+ senior architects spanning application, infrastructure, network, and security domains. Maintained direct executive interface with client CIO and program sponsors through weekly governance meetings, ensuring strategic alignment and stakeholder buy-in. Program delivered on schedule, generating 40%+ increase in follow-on business opportunities and $15M+ additional contract value for Wipro.",
    points: [],
    skills: "Technology Consulting, Solution Architecture, +3 skills",
  },
  {
    role: "Sr. Project Leader",
    company: "Symantec Corp",
    groupLabel: "Full-time",
    period: "Feb 2004 — Aug 2005",
    duration: "1 yr 7 mos",
    location: "Pune District, Maharashtra, India · On-site",
    type: "Full-time",
    description:
      "Led technical project delivery, managing teams and resources to ensure timely, quality outcomes within scope and budget.",
    points: [
      "Delivered multiple projects in Sales and Partner Portals area on schedule and within budget.",
      "Boosted team productivity through effective project management and resource planning.",
      "Proactively mitigated project risks to avoid delays and maintain stability.",
      "Championed process improvements and adherence to best coding practices.",
      "Coordinated cross-functional global teams to achieve project goals efficiently.",
      "Maintained high client satisfaction by ensuring quality and timely delivery.",
    ],
    skills: "Technical Project Leadership, Quality Assurance, +1 skill",
  },
  {
    role: "Team Lead",
    company: "Accenture Services India Ltd",
    period: "2002 — 2004",
    duration: "2 yrs",
    location: "India",
    type: "Full-time",
    description: "",
    points: [],
    skills: "",
  },
  {
    role: "Consultant - Custom Solutions",
    company: "is3c Consultancy Services Ltd",
    period: "2001 — 2002",
    duration: "1 yr",
    location: "India",
    type: "Full-time",
    description: "",
    points: [],
    skills: "",
  },
  {
    role: "Sr. Developer",
    company: "eVyapar",
    period: "2000 — 2001",
    duration: "1 yr",
    location: "India",
    type: "Full-time",
    description: "",
    points: [],
    skills: "",
  },
];

const EDUCATION = [
  {
    degree: "Bachelor of Engineering, Electrical Engineering",
    institution: "Savitribai Phule Pune University",
  },
];

const TOP_SKILLS = [
  "Global Capability Center Leadership",
  "AI Strategy & Enterprise Adoption",
  "Enterprise Transformation & Change Management",
  "Cross-Cultural & Distributed Team Leadership",
  "P&L Management & Business Operations",
];

const SKILL_TAGS = [
  "GCC Strategy", "IT Strategy", "Executive Leadership", "Business Transformation",
  "Solution Architecture", "P&L Management", "Change Management", "Program Management",
  "Generative AI", "AI Agents", "Multi-agent Systems", "Emerging Technologies",
  "Stakeholder Management", "Leadership Development", "Strategic Planning",
  "E-Commerce", "Product Development", "Business Development", "Organizational Leadership",
  "Technology Consulting",
];

const CERTIFICATIONS = [
  { name: "Independent Director", issuer: "Indian Institute of Corporate Affairs", year: "Mar 2026" },
  { name: "Certified ESG Professional Impact Leader", issuer: "Indian Institute of Corporate Affairs", year: "Pursuing" },
  { name: "Claude Code: A Highly Agentic Coding Assistant", issuer: "DeepLearning.AI", year: "Aug 2025" },
  { name: "Building and Evaluating Data Agents", issuer: "DeepLearning.AI", year: "Dec 2025" },
  { name: "MCP: Build Rich-Context AI Apps with Anthropic", issuer: "DeepLearning.AI", year: "May 2025" },
  { name: "Vibe Coding 101 with Replit", issuer: "DeepLearning.AI", year: "Apr 2025" },
  { name: "Evaluating AI Agents", issuer: "DeepLearning.AI", year: "Mar 2025" },
  { name: "Reasoning with o1", issuer: "DeepLearning.AI", year: "Feb 2025" },
  { name: "Multi AI Agent Systems", issuer: "CrewAI", year: "2024" },
  { name: "Agentic AI Fundamentals", issuer: "LinkedIn Learning", year: "Nov 2024" },
  { name: "Generative AI for Business Leaders", issuer: "LinkedIn Learning", year: "Nov 2024" },
  { name: "Safe and Reliable AI via Guardrails", issuer: "DeepLearning.AI", year: "Nov 2024" },
  { name: "Leading Business Transformation in the Age of AI", issuer: "Indian School of Business", year: "Sep 2020" },
];

const LEADERSHIP_IMPACT = [
  {
    icon: Target,
    title: "Board Member | Wurth IT India",
    body: "Scaled the Tech GCC from 15 → 220+ associates, steadily transforming from a tech support unit into a strategic business & technology partner. Demonstrated the governance discipline necessary in sustaining transformation, not just enabling it.",
  },
  {
    icon: Globe,
    title: "Global Stakeholder Influence | EVP-Level Interface",
    body: "Shaped company vision and strategic alignment at board level. Secured buy-in for India-originated initiatives changing the narrative from being a \"delivery hub\" to \"innovation engine\". An active voice in industry forums shaping GCC evolution in the AI era.",
  },
  {
    icon: TrendingUp,
    title: "27-29% YoY Revenue Growth | 26-32% Operating Margins | Built 30% Deeper Leadership Pipeline",
    body: "Delivered disciplined growth without compromising margins or culture. Scaled profitably while building organizational resilience-zero key-person risk.",
  },
  {
    icon: Bot,
    title: "AI, Automation & Low-Code Leadership",
    body: "Deployed intelligent automation and AI across enterprise workflows as revenue driver (10%+ incremental) and efficiency drivers.",
  },
  {
    icon: DollarSign,
    title: "$100M+ | Enterprise Transformation | Fortune 500",
    body: "Led large-scale transformation programs across Financial Services and Insurance, navigating the complexity of operating model change at enterprise scale.",
  },
];

const PRINCIPLES = [
  {
    icon: Trophy,
    title: "Board Member, Wurth IT India",
    body: "Scaled the GCC from 15 to 220+ associates, turning a tech-support desk into a strategic business and technology partner.",
  },
  {
    icon: TrendingUp,
    title: "27-29% YoY revenue growth",
    body: "Delivered disciplined growth at 26-32% operating margins while building a 30% deeper leadership bench.",
  },
  {
    icon: Lightbulb,
    title: "AI & automation leadership",
    body: "Deployed intelligent automation across enterprise workflows as a 10%+ incremental revenue driver.",
  },
  {
    icon: DollarSign,
    title: "$100M+ transformation led",
    body: "Ran large-scale programs across Financial Services and Insurance through complex operating-model change.",
  },
  {
    icon: Quote,
    title: "On adaptive enterprises",
    body: "Technology rarely fails. What is harder is getting operating models, leadership behavior, and ways of working to evolve at the same pace.",
  },
];

function useInViewOnce(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "-40px", ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = [];
    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.35, rootMargin: "-15% 0px -50% 0px" }
      );
      observer.observe(node);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * ease(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);
  return value;
}

function Reveal({ children, delay = 0, className = "", y = 22 }) {
  const [ref, inView] = useInViewOnce();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-6 h-px" style={{ background: TEAL }} />
      <span className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: TEAL }}>
        {children}
      </span>
    </div>
  );
}

function MagneticButton({ children, className = "", onClick, as = "button", href, target, rel }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: relX * 0.18, y: relY * 0.28 });
  };
  const handleLeave = () => setOffset({ x: 0, y: 0 });

  const Tag = as;
  return (
    <Tag
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </Tag>
  );
}

function Tooltip({ label, children }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0B1220] px-2.5 py-1.5 text-[10px] font-medium text-white shadow-lg z-30"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translate(-50%, 0px)" : "translate(-50%, 4px)",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SkillRow({ skill, index }) {
  const [ref, inView] = useInViewOnce();
  const count = useCountUp(index + 1, inView, 900);
  const color = index % 2 === 0 ? TEAL : BLUE;
  return (
    <div
      ref={ref}
      className="flex items-center gap-3 sm:gap-4 py-2 border-b border-slate-50 last:border-b-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0px)" : "translateX(-16px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
      }}
    >
      <span
        className="shrink-0 grid place-items-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-bold font-mono tabular-nums"
        style={{ background: `${color}14`, color }}
      >
        {String(count).padStart(2, "0")}
      </span>
      <span className="text-xs sm:text-sm font-medium text-slate-700">{skill}</span>
      <span className="hidden sm:block flex-1 h-px bg-slate-100 ml-2" />
    </div>
  );
}

function StatTile({ stat, index }) {
  const [ref, inView] = useInViewOnce();
  const count = useCountUp(stat.value, inView);
  const Icon = stat.icon;
  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-sm"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(18px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.08}s`,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${TEAL}14, transparent 60%)` }}
      />
      <div className="relative flex items-start justify-between">
        <span className="grid place-items-center w-8 h-8 rounded-lg" style={{ background: `${TEAL}1A`, color: TEAL }}>
          <Icon size={16} strokeWidth={2} />
        </span>
        <span className="text-[9px] font-mono tracking-widest text-white/25">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="relative mt-3 text-2xl sm:text-3xl font-bold text-white leading-none tabular-nums">
        {count}
        {stat.suffix}
      </p>
      <p className="relative mt-1.5 text-[11px] sm:text-xs font-medium text-white/60">{stat.label}</p>
      <p className="relative mt-0.5 text-[10px] text-white/30">{stat.note}</p>
    </div>
  );
}

function TimelineEntry({ item, index, isOpen, onToggle }) {
  const [ref, inView] = useInViewOnce();
  return (
    <div
      ref={ref}
      className="relative pl-10 sm:pl-14 pb-8 last:pb-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0px)" : "translateX(-16px)",
        transition: `opacity 0.55s ease ${Math.min(index, 4) * 0.06}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${Math.min(index, 4) * 0.06}s`,
      }}
    >
      <span className="absolute left-0 top-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center shadow-md shrink-0"
        style={{ background: `linear-gradient(135deg, ${TEAL}, ${BLUE})` }}
      >
        <Briefcase size={14} color="#fff" strokeWidth={2.2} />
      </span>
      {index < EXPERIENCE.length - 1 && (
        <span className="absolute left-[15px] sm:left-[17px] top-8 sm:top-9 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, #d8dde6, transparent)" }} />
      )}
      {item.groupLabel && (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {item.company} <span className="text-slate-300">·</span> {item.groupLabel}
        </p>
      )}
      <button
        onClick={item.points.length > 0 ? onToggle : undefined}
        className={`w-full text-left rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 ${item.points.length > 0 ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0B1220] leading-snug">{item.role}</h3>
            <p className="text-xs sm:text-sm font-semibold" style={{ color: TEAL }}>{item.company}</p>
          </div>
          <span className="shrink-0 rotate-[-4deg] rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-slate-400">
            {item.duration}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1"><MapPin size={11} />{item.location}</span>
          <span>{item.period}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">{item.type}</span>
        </div>
        {item.description && (
          <p className="mt-2.5 text-xs sm:text-[13px] text-slate-500 leading-relaxed">{item.description}</p>
        )}
        {item.points.length > 0 && (
          <div
            className="grid transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
          >
            <div className="overflow-hidden">
              <ul className="mt-3 flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                {item.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: TEAL }} />
                    {point}
                  </li>
                ))}
              </ul>
              {item.skills && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                      style={{ borderColor: `${BLUE}30`, color: BLUE, background: `${BLUE}0A` }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {item.points.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold" style={{ color: BLUE }}>
            {isOpen ? "Hide detail" : "Show detail"}
            <ChevronDown size={12} className="transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </div>
        )}
      </button>
    </div>
  );
}

function SkillsPanel() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => SKILL_TAGS.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase())),
    [query]
  );
  return (
    <div>
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-700 outline-none focus:border-transparent focus:ring-2 transition-all"
          style={{ "--tw-ring-color": `${TEAL}55` }}
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={13} />
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center">
          <p className="text-xs font-medium text-slate-500">No skills match "{query}"</p>
          <p className="text-[11px] text-slate-400 mt-1">Try a shorter or different term.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filtered.map((s, i) => (
            <span
              key={s}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full border cursor-default transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                borderColor: i % 3 === 0 ? `${TEAL}40` : i % 3 === 1 ? `${BLUE}40` : "#e2e8f0",
                color: i % 3 === 0 ? TEAL : i % 3 === 1 ? BLUE : "#475569",
                background: i % 3 === 0 ? `${TEAL}0C` : i % 3 === 1 ? `${BLUE}0C` : "#f8fafc",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CertificationsGrid() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const perPage = 4;
  const pageCount = Math.ceil(CERTIFICATIONS.length / perPage);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const visible = CERTIFICATIONS.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[220px]">
        {loading
          ? Array.from({ length: perPage }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 animate-pulse">
                <div className="w-7 h-7 rounded-lg bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-3/4 rounded bg-slate-200" />
                  <div className="h-2 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))
          : visible.map((c) => (
              <div
                key={c.name}
                className="group flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-transparent hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <Tooltip label={`${c.issuer} - ${c.year}`}>
                  <span className="mt-0.5 grid place-items-center w-7 h-7 rounded-lg shrink-0" style={{ background: `${GOLD}1A`, color: GOLD }}>
                    <BadgeCheck size={15} />
                  </span>
                </Tooltip>
                <div>
                  <p className="text-xs font-semibold text-[#0B1220] leading-snug">{c.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.issuer} &middot; {c.year}</p>
                </div>
              </div>
            ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="grid place-items-center w-7 h-7 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: page === i ? 18 : 6, background: page === i ? TEAL : "#e2e8f0" }}
            />
          ))}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page === pageCount - 1}
          className="grid place-items-center w-7 h-7 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function PrinciplesCarousel() {
  const [index, setIndex] = useState(0);
  const total = PRINCIPLES.length;

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  const go = (dir) => setIndex((i) => (i + dir + total) % total);
  const current = PRINCIPLES[index];
  const Icon = current.icon;

  return (
    <div className="relative rounded-2xl border p-6 sm:p-8 overflow-hidden" style={{ borderColor: `${TEAL}30`, background: `linear-gradient(135deg, ${INK}, #101c33)` }}>
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ background: TEAL }} />
      <div key={index} className="relative" style={{ animation: "fadeSlide 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
        <span className="grid place-items-center w-10 h-10 rounded-xl mb-4" style={{ background: `${TEAL}20`, color: TEAL }}>
          <Icon size={18} />
        </span>
        <p className="text-white font-bold text-base sm:text-lg leading-snug mb-2 max-w-xl">{current.title}</p>
        <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-xl">{current.body}</p>
      </div>
      <div className="relative mt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {PRINCIPLES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: index === i ? 18 : 6, background: index === i ? TEAL : "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => go(-1)} className="grid place-items-center w-8 h-8 rounded-lg border border-white/10 text-white/70 hover:bg-white/10 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => go(1)} className="grid place-items-center w-8 h-8 rounded-lg border border-white/10 text-white/70 hover:bg-white/10 transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function ContactModal({ open, onClose }) {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setStatus("idle"), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center px-4"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0B1220]/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }}
      />
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300"
        style={{ opacity: open ? 1 : 0, transform: open ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)" }}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>
        {status === "success" ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full" style={{ background: `${TEAL}1A`, color: TEAL }}>
              <CheckCircle2 size={22} />
            </div>
            <p className="text-sm font-semibold text-[#0B1220]">Message sent</p>
            <p className="mt-1 text-xs text-slate-500">Thanks for reaching out — expect a reply within a couple of days.</p>
            <button
              onClick={onClose}
              className="mt-5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(90deg, ${TEAL}, ${BLUE})` }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <div>
              <Eyebrow>Start a conversation</Eyebrow>
              <h3 className="text-lg font-bold text-[#0B1220]">Send a note</h3>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-500">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": `${TEAL}55` }}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-500">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": `${TEAL}55` }}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-500">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:ring-2 transition-all resize-none"
                style={{ "--tw-ring-color": `${TEAL}55` }}
                placeholder="What would you like to discuss?"
              />
            </div>
            {status === "error" && (
              <p className="text-[11px] font-medium text-red-500">Fill in every field before sending.</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-1 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
              style={{ background: `linear-gradient(90deg, ${TEAL}, ${BLUE})` }}
            >
              {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
              {status === "loading" ? "Sending" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function NavBar({ active, onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (id) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(11,18,32,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
          <button onClick={() => handleNavigate("hero")} className="text-sm font-bold text-white tracking-tight">
            R. Pingali
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className="relative px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase transition-colors"
                style={{ color: active === link.id ? "#fff" : "rgba(255,255,255,0.5)" }}
              >
                {link.label}
                {active === link.id && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-px" style={{ background: TEAL }} />
                )}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden grid place-items-center w-8 h-8 rounded-lg text-white/80 border border-white/10"
          >
            <Menu size={16} />
          </button>
        </div>
      </header>

      <div
        className="fixed inset-0 z-50 md:hidden"
        style={{ pointerEvents: drawerOpen ? "auto" : "none" }}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          style={{ opacity: drawerOpen ? 1 : 0 }}
        />
        <div
          className="absolute right-0 top-0 h-full w-64 bg-[#0B1220] px-6 py-6 shadow-2xl transition-transform duration-400"
          style={{ transform: drawerOpen ? "translateX(0%)" : "translateX(100%)", transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold text-white">Menu</span>
            <button onClick={() => setDrawerOpen(false)} className="text-white/60"><X size={18} /></button>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className="text-left px-3 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wide transition-colors"
                style={{ color: active === link.id ? TEAL : "rgba(255,255,255,0.6)", background: active === link.id ? "rgba(255,255,255,0.05)" : "transparent" }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function About() {
  const [openIndex, setOpenIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const bgRef = useRef(null);
  const ids = useMemo(() => NAV_LINKS.map((l) => l.id), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        const y = window.scrollY;
        bgRef.current.style.transform = `translateY(${y * 0.15}px)`;
      }
      setShowTop(window.scrollY > 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7FB] scroll-smooth">
      <NavBar active={active} onNavigate={scrollTo} />

      <section
        id="hero"
        className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 px-4 sm:px-6"
        style={{ background: `linear-gradient(160deg, ${INK} 0%, #101d38 45%, ${INK} 100%)` }}
      >
        <div
          ref={bgRef}
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(circle at 18% 30%, ${TEAL} 0%, transparent 45%), radial-gradient(circle at 85% 20%, ${BLUE} 0%, transparent 45%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <WebGLParticleCanvas variant="minimal" />
        </div>
        <div className="relative max-w-5xl mx-auto z-10">
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-8 md:gap-12">
            <div>
              <Reveal>
                <Eyebrow>Executive Profile</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.08] tracking-tight max-w-2xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Ravishankar Pingali
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-4 text-sm sm:text-base text-white/65 leading-relaxed max-w-xl">
                  Building adaptive enterprises. GCC leader, enterprise reinvention specialist, and board advisor turning operating discipline into durable growth.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/45">
                    <MapPin size={13} style={{ color: TEAL }} />
                    Pune District, Maharashtra, India
                  </span>
                  <MagneticButton
                    as="a"
                    href="https://www.linkedin.com/in/ravipingali/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full border border-white/15 text-white/75 hover:text-white hover:border-white/35"
                  >
                    <Link2 size={13} />
                    linkedin.com/in/ravipingali
                  </MagneticButton>
                </div>
              </Reveal>
            </div>
            
            <Reveal delay={0.15}>
              <div className="w-[180px] md:w-[220px] lg:w-[260px] shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl mx-auto md:mx-0 bg-[#0B1220]/50">
                <img src={profileImg} alt="Ravishankar Pingali" className="w-full h-auto object-contain" />
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.24}>
            <div id="ledger" className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {STATS.map((s, i) => (
                <StatTile key={s.label} stat={s} index={i} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-12 sm:gap-16">
        <section id="about">
          <Reveal>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7">
              <Eyebrow>Profile</Eyebrow>
              <div className="flex flex-col gap-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  Across <strong className="text-[#0B1220]">27+ years</strong> as an engineer, architect, operations leader, business builder, and CEO working across North America, the UK, and India - one pattern stands out: technology rarely fails. What's harder and slower is getting operating models, leadership behaviors, and ways of working to evolve at the same pace.
                </p>
                <p>
                  That gap has defined much of my career, leading enterprise transformation, building and scaling Global Capability Centers, and learning, often the hard way, when to push and when to wait.
                </p>
                <p>
                  Today, I help organizations become genuinely adaptive, not by chasing the next platform or AI capability, but by building the <strong className="text-[#0B1220]">governance, leadership depth, and operating discipline</strong> that make transformation stick.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B1220] mb-4">Leadership Impact</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LEADERSHIP_IMPACT.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFD] border border-slate-100">
                        <span className="mt-0.5 p-1.5 rounded-lg shrink-0" style={{ background: `linear-gradient(135deg, ${TEAL}20, ${BLUE}20)`, color: TEAL }}>
                          <Icon size={15} />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-[#0B1220] mb-0.5 leading-snug">{item.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{item.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  I stay engaged with the GCC and technology leadership ecosystem through industry forums and executive conversations, sharing lessons from building organizations and exploring what the next generation of GCC leadership should look like in an AI-driven world.
                </p>
                <p>
                  If you're building next-generation GCCs, redesigning enterprise operating models, or evolving your organization for the AI era, I'd welcome the conversation.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="top-skills">
          <Reveal>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7">
              <Eyebrow>Top Skills</Eyebrow>
              <div className="flex flex-col gap-1">
                {TOP_SKILLS.map((s, i) => (
                  <SkillRow key={s} skill={s} index={i} />
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="experience">
          <Reveal>
            <Eyebrow>Record</Eyebrow>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220] mb-6 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Career timeline
            </h2>
          </Reveal>
          <div>
            {EXPERIENCE.map((item, i) => (
              <TimelineEntry
                key={item.role + item.period}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </section>

        <Reveal>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <Eyebrow>Education</Eyebrow>
            {EDUCATION.map((e) => (
              <div key={e.degree} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0" style={{ background: `${TEAL}1A` }}>
                  <GraduationCap size={17} style={{ color: TEAL }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0B1220] leading-snug">{e.degree}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{e.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <Eyebrow>Skills</Eyebrow>
            <SkillsPanel />
          </div>
        </Reveal>

        <section id="credentials">
          <Reveal>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <Eyebrow>Licenses & Certifications</Eyebrow>
              <CertificationsGrid />
            </div>
          </Reveal>
        </section>

        <section id="principles">
          <Reveal>
            <Eyebrow>Principles</Eyebrow>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220] mb-6 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Operating philosophy
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <PrinciplesCarousel />
          </Reveal>
        </section>

        <section id="contact">
          <Reveal>
            <div
              className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
              style={{ background: `linear-gradient(135deg, ${INK}, #101d38)`, border: `1px solid ${TEAL}30` }}
            >
              <div>
                <Eyebrow>Let's connect</Eyebrow>
                <p className="text-white font-bold text-base sm:text-lg leading-snug max-w-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Building next-gen GCCs or redesigning enterprise operating models?
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <MagneticButton
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full border border-white/15 text-white hover:border-white/35"
                >
                  <Mail size={14} />
                  Send a note
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://www.linkedin.com/in/ravipingali/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full text-[#0B1220]"
                  onMouseMove={() => {}}
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${TEAL}, ${BLUE})` }}
                  />
                  <span className="relative flex items-center gap-2">
                    <Link2 size={14} />
                    Connect on LinkedIn
                  </span>
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </section>
      </div>



      <button
        onClick={() => scrollTo("hero")}
        className="fixed bottom-6 right-6 z-30 grid place-items-center w-10 h-10 rounded-full text-white shadow-lg transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${TEAL}, ${BLUE})`,
          opacity: showTop ? 1 : 0,
          transform: showTop ? "translateY(0px) scale(1)" : "translateY(12px) scale(0.85)",
          pointerEvents: showTop ? "auto" : "none",
        }}
      >
        <ArrowUp size={16} />
      </button>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}