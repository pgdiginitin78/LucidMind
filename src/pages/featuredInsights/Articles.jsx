import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "../../components/ui/Heading";
import WebGLParticleCanvas from "./WebGLParticleCanvas";
import ArticleDetail from "./ArticleDetail";
import articlesSectionBg from "../../assets/articles_section_bg.png";
import MagicBento, {
  ParticleCard,
  GlobalSpotlight,
  BentoCardGrid,
  useMobileDetection,
} from "./MagicBento";

gsap.registerPlugin(ScrollTrigger);

const articles = [
  {
    tag: "MINDSET",
    readTime: "2 MIN READ",
    date: "October 8, 2025",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "From Managing to Making: The Mindset Shift",
    description: "For much of my recent career, I focused on managing",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQEGa84Lo3CPoA/article-cover_image-shrink_423_752/B4DZm9_jvSJcAU-/0/1759829183949?e=1787184000&v=beta&t=dxvs3erh4GkEvIhHWZpxMmjNd7hJot2JGCFbHKyuNJo",
    content: [
      {
        type: "paragraph",
        text: "For much of my recent career, I focused on managing — aligning teams, optimizing processes, driving predictability.",
      },
      {
        type: "paragraph",
        text: "But the more I got involved in making — creating new capabilities, digital platforms, and even new ways of working — the more I realized: Managing alone isn't enough.",
      },
      {
        type: "paragraph",
        text: "Making demands a completely different mindset. It's messy. Ambiguous. Hands-on. It's not about keeping things running — it's about bringing something new to life.",
      },
      {
        type: "heading",
        text: "The Comfort of Managing vs. the Chaos of Making",
      },
      {
        type: "paragraph",
        text: "Management thrives on structure — plans, metrics, and milestones. Making lives in ambiguity. The answers don't exist yet, and sometimes even the questions are still forming.",
      },
      {
        type: "paragraph",
        text: "While managing relies on experience, making thrives on curiosity. You can't create something new with yesterday's playbook — you have to rediscover the beginner's mindset.",
      },
      { type: "heading", text: "The Maker's Mindset" },
      {
        type: "paragraph",
        text: "Making is less about control and more about creation. It's about:",
      },
      {
        type: "list",
        items: [
          "Asking why not instead of why",
          "Prototyping instead of fancy slide decks",
          "Valuing progress over perfection",
          "Staying close to users, problems, and outcomes",
        ],
      },
      {
        type: "paragraph",
        text: 'The biggest shift for me? Letting go of the illusion of certainty. Replacing "knowing" with "learning." "Directing" with "doing." Uncomfortable at first — but incredibly energizing.',
      },
      { type: "heading", text: "Why It Matters Now" },
      {
        type: "paragraph",
        text: "In the new enterprise landscape driven by AI, automation, and rapid digitalization, the shelf life of management efficiency is shrinking. What matters now is making — designing, experimenting, and creating new capabilities and models.",
      },
      {
        type: "paragraph",
        text: "The teams that truly move the needle are led by people who are part architect, part maker — leaders who don't just sponsor innovation, but practice it.",
      },
      { type: "heading", text: "Relearning the Joy of Making" },
      {
        type: "paragraph",
        text: "Making reconnects you to your craft, your users, and your purpose. It's not a step down from leadership — it's a step deeper into it.",
      },
      {
        type: "paragraph",
        text: "Because in times of change, the leaders who make don't just adapt to the future — they define it.",
      },
    ],
  },
  {
    tag: "PROGRAMMING",
    readTime: "4 MIN READ",
    date: "September 23, 2025",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "Three Programming Revolutions, Three Leadership Principles",
    description:
      "Over the past 26 years in tech, I've watched coding evolve in ways none of us could have predicted.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQG-CfrS0So1qg/article-cover_image-shrink_423_752/B4DZlxfH_4JEAU-/0/1758545618607?e=1787184000&v=beta&t=yQog4r6TvaE13qc4-SPPhpRtEkK3SHRvg2lJ_0Znn84",
    content: [
      {
        type: "paragraph",
        text: "Over the past 26 years in tech, I've watched coding evolve in ways none of us could have predicted. I still remember the early days when writing code in Eclipse felt like building a rocket ship — complex, slow, and dependent on a handful of brilliant experts. Then came low-code platforms, which changed the game by putting power in the hands of business users. And now, we're in a world where AI coding agents can assist in spinning up entire applications in days and weeks.",
      },
      {
        type: "paragraph",
        text: "Each of these shifts wasn't just about technology. They changed how leaders lead, how teams work, and how organizations measure success.",
      },
      {
        type: "paragraph",
        text: "Looking back, I see three distinct coding waves — and three leadership lessons that continue to shape the future.",
      },
      {
        type: "heading",
        text: "Wave #1 — High-Code Complexity and Team Expertise",
      },
      { type: "subheading", text: "a) The Leadership Challenge" },
      {
        type: "paragraph",
        text: "Back in the early days, coding was really complicated, and only experts could do it. Managers had to ensure projects were completed successfully, even when things were risky, and keep their teams motivated through serious tech challenges.",
      },
      { type: "subheading", text: "b) Team Dynamics" },
      {
        type: "paragraph",
        text: "Teams were built around specialists. You needed experts in every corner — from architecture to testing to deployment. Leadership meant creating an environment where these experts could focus and thrive, while avoiding burnout.",
      },
      { type: "subheading", text: "c) Strategic Focus" },
      {
        type: "paragraph",
        text: "Success metrics here were mostly about delivery and reliability. Could we ship the product on time? Could it run without failure? Leaders were judged on technical execution and stability.",
      },
      {
        type: "heading",
        text: "Wave #2 — Low-Code Disruption and Organisational Resistance",
      },
      { type: "subheading", text: "a) The Leadership Challenge" },
      {
        type: "paragraph",
        text: "Suddenly, software wasn't just the domain of hardcore coders — business teams could build apps too. For leaders, the challenge shifted from managing complexity to managing resistance.",
      },
      { type: "subheading", text: "b) Team Dynamics" },
      {
        type: "paragraph",
        text: 'Technical teams had to evolve from "builders of everything" to "enablers and integrators." Business users entered the arena as co-creators. Leaders had to build bridges — fostering collaboration instead of competition.',
      },
      { type: "subheading", text: "c) Strategic Focus" },
      {
        type: "paragraph",
        text: "Success was about speed, adaptability, and user empowerment. Leaders had to move the spotlight from control to collaboration.",
      },
      {
        type: "heading",
        text: "Wave #3 — AI Coding Agents and Organisational Transformation",
      },
      { type: "subheading", text: "a) The Leadership Challenge" },
      {
        type: "paragraph",
        text: "Now, we're in the wave of AI coding agents. Leaders face a fresh challenge: guiding organizations through transformation while keeping human creativity and judgment at the center.",
      },
      { type: "subheading", text: "b) Team Dynamics" },
      {
        type: "paragraph",
        text: 'Teams are no longer defined by "who writes the most lines of code." Leaders need to help their teams see themselves as problem solvers and guides, not just code writers.',
      },
      { type: "subheading", text: "c) Strategic Focus" },
      {
        type: "paragraph",
        text: "The new success metric is impact at scale. Leaders need to focus on outcomes, not outputs — what value did this solution create, not just how quickly it shipped.",
      },
      { type: "heading", text: "Looking Forward" },
      {
        type: "paragraph",
        text: "AI coding agents are just the beginning. The next challenge isn't just about faster software delivery — it's about ensuring that human creativity, empathy, and strategic thinking don't get lost along the way.",
      },
      {
        type: "list",
        items: [
          "Balance AI and human creativity — machines can generate, but humans must imagine",
          "Redefine roles: from coders to conductors",
          "Anchor success in outcomes, not just speed or cost",
        ],
      },
    ],
  },
  {
    tag: "MENTORSHIP",
    readTime: "4 MIN READ",
    date: "August 14, 2025",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "Mentorship in the Age of AI: Why Your Humanity Isn't Obsolete",
    description:
      "All through my career, I have found myself existing between two colliding worlds: the never-ending acceleration of technology and the timeless tale of human potential.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQGVE09Z1Kmf-g/article-cover_image-shrink_180_320/B4DZin44AMGgAY-/0/1755163366813?e=1787184000&v=beta&t=y1Mk-K55inLaorCVw8B1I499DcfgZMsQz3mhkeSrPyM",
    content: [
      {
        type: "paragraph",
        text: "All through my career, I have found myself existing between two colliding worlds: the never-ending acceleration of technology and the timeless tale of human potential.",
      },
      {
        type: "paragraph",
        text: "But here's what excites me most: every time I mentor someone through this changing landscape, I rediscover a powerful truth. The more we automate tasks, the more our humanity becomes our irreplaceable advantage.",
      },
      {
        type: "paragraph",
        text: "We have hit some kind of inflection point. Algorithms optimize tasks, but along the way, they set the spotlight on what they just can't duplicate — the inherently messy, beautiful, and powerfully human task of mentorship.",
      },
      {
        type: "heading",
        text: "Where Human Leadership Shines Brighter Than AI",
      },
      {
        type: "paragraph",
        text: "Let's be clear: AI is revolutionary. It processes data at scales humans never could. But leadership lives in the spaces data can't touch:",
      },
      {
        type: "list",
        items: [
          'Empathy: That moment when you hear the hesitation behind "I\'m fine" during a high-stakes conversation',
          "Ethical Nuance: Guiding teams through decisions where policy documents fall silent",
          'Purpose Ignition: Helping someone reconnect with their "why" when daily tasks feel disconnected from meaning',
        ],
      },
      {
        type: "heading",
        text: "Three Leadership Gifts No Algorithm Can Replicate",
      },
      {
        type: "subheading",
        text: "1. Context Over Compliance: Seeing the Human Behind the Role",
      },
      { type: "quote", text: "I mentor people, not job descriptions." },
      {
        type: "paragraph",
        text: "Performance drops are rarely about skills. In so many years of leading teams, I have learned they're often about life's unseen pressures. AI tracks output; leaders uncover context.",
      },
      {
        type: "subheading",
        text: "2. Psychological Safety: Building Sanctuaries for Courage",
      },
      {
        type: "quote",
        text: "Creating spaces where 'I don't know' is met with support – not judgment.",
      },
      {
        type: "paragraph",
        text: "Innovation dies in fear. I have witnessed brilliant teams freeze because admitting uncertainty felt risky. While AI flags errors; leaders dissolve shame.",
      },
      {
        type: "subheading",
        text: "3. Character Foundations: Imprinting Values That Outlast Technology",
      },
      {
        type: "quote",
        text: "Not just skills, but values: integrity in ambiguity, resilience in failure.",
      },
      {
        type: "paragraph",
        text: "Skills expire. Values endure. I mentor for technical mastery, yes — but my deeper focus is cultivating human foundations: integrity in grey zones, resilience in setbacks, and courage in uncertainty.",
      },
      { type: "heading", text: "The Future Leader's Mandate" },
      {
        type: "paragraph",
        text: "As AI handles tasks, our role transforms: from knowledge-holders to wisdom-sharers.",
      },
      {
        type: "list",
        items: [
          "Mentor with curiosity, not agendas",
          "Protect human connection like it's your IP",
          "Remember: Culture isn't coded — it's cultivated. Daily. Intentionally.",
        ],
      },
      {
        type: "paragraph",
        text: "Because in the end, technology transforms systems. But only humans transform humans.",
      },
    ],
  },
  {
    tag: "TECHNOLOGY",
    readTime: "3 MIN READ",
    date: "June 12, 2025",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "My Lens For Evaluating Any Emerging Technology",
    description:
      'But amidst all the "next big thing" technology hype cycles, how do we, as leaders responsible for sustainable growth, cut through?',
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQFKa7TWej8TdQ/article-cover_image-shrink_423_752/B4DZbt_pjeG8Ac-/0/1747749610907?e=1787184000&v=beta&t=wkOE5SuRPNAqPIwLNNjb9DLmiu6n_BAwKUcfkTx1bHE",
    content: [
      {
        type: "paragraph",
        text: 'But amidst all the "next big thing" technology hype cycles, how do we, as leaders responsible for sustainable growth and future-readiness, cut through and make sound decisions? How do we avoid costly detours chasing shiny objects?',
      },
      {
        type: "paragraph",
        text: "Because in the enterprise world — novelty isn't the north star. Impact is.",
      },
      {
        type: "paragraph",
        text: "It boils down to a disciplined lens. Over years of hands-on experience, I've created a practical framework. It's not always about being first; it's about being right.",
      },
      {
        type: "heading",
        text: "1. Problem-Solution Fit: Does it Solve a Real Pain Point?",
      },
      {
        type: "paragraph",
        text: 'This is the absolute foundation. Before diving into capabilities, I ask: What specific, significant business challenge does this address? If the tech doesn\'t demonstrably solve a core problem impacting efficiency, growth, or resilience, it\'s likely a distraction. Start with the "why," not the "what."',
      },
      {
        type: "heading",
        text: "2. Adoption Barriers: Can We Actually Integrate and Use It?",
      },
      {
        type: "paragraph",
        text: "If individuals won't or cannot use it, even the best solution falls short. I assess:",
      },
      {
        type: "list",
        items: [
          "Technical Integration: How seamlessly does it plug into the existing ecosystem?",
          "Skill Gaps: What new competencies are needed?",
          "Cultural Readiness: Is the organisation prepared for the change this tech demands?",
        ],
      },
      {
        type: "heading",
        text: "3. Economic Viability: Does the Math Make Sense?",
      },
      {
        type: "paragraph",
        text: "Passion for innovation must be tempered with financial prudence. My background in P&L accountability dictates a rigorous look at the Total Cost of Ownership and return on investment.",
      },
      {
        type: "heading",
        text: "4. Competitive Landscape: Who Else is Playing, and How?",
      },
      {
        type: "paragraph",
        text: "I analyse maturity, differentiation, vendor viability, and strategic positioning. Will adopting this give us a competitive edge, or is it merely table stakes?",
      },
      {
        type: "heading",
        text: "5. Second-Order Effects: What are the Unintended Consequences?",
      },
      {
        type: "list",
        items: [
          "Ethical & Societal Impact: Privacy implications, potential for bias, workforce dynamics",
          "Future Scalability & Lock-in: Will this solution scale with our ambitions?",
          "Ecosystem Impact: How might this change relationships with partners and customers?",
        ],
      },
      { type: "heading", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Evaluating emerging technologies, to me, has nothing to do with crystal-balling; instead, it is grounded in real-life experience and an abiding commitment to sustainable value under a structured, critical lens.",
      },
    ],
  },
  {
    tag: "LEADERSHIP",
    readTime: "4 MIN READ",
    date: "May 21, 2025",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "Building Teams: My Journey, My Lessons, My Growth",
    description:
      "Throughout my career working across startups, global enterprises, and while leading transformational initiatives.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQGq9HgOFTeV9g/article-cover_image-shrink_180_320/B4DZdjhz66H4AY-/0/1749721510060?e=1787184000&v=beta&t=njsvL0C8VJDzo9DnCc2n4wWWbPDpGy6_J0oBb2QSY_M",
    content: [
      {
        type: "paragraph",
        text: "Throughout my career working across startups, global enterprises, and while leading transformational initiatives—I have come to know that building teams is more than aggregating resumes; rather, it is creating an environment that fosters talent, collaboration, and purpose.",
      },
      {
        type: "paragraph",
        text: 'Here are eight lessons that have defined my approach while building teams, rooted in real-world experience and a commitment to my motto "execution is the best strategy."',
      },
      {
        type: "heading",
        text: "1. Surround Yourself with People Smarter Than You",
      },
      {
        type: "paragraph",
        text: "Leadership isn't about being the smartest one in the room—it is about finding and raising up those who are. This approach has elevated the quality of our work and created a continuous learning environment for everyone, myself included.",
      },
      { type: "heading", text: "2. Create Teams That Can Laugh Together" },
      {
        type: "paragraph",
        text: "Psychological safety is the bedrock of high performance. A team that enjoys each other's company can pull through, collaborate, and get the job done. I've made it a habit to infuse lightness into meetings and celebrate quick wins.",
      },
      {
        type: "heading",
        text: "3. Harness Drive and Clarity When Pioneering New Ventures",
      },
      {
        type: "paragraph",
        text: "Innovation demands urgency. Aligning teams around a clear vision and prioritizing quick wins sustains energy. Focused effort, coupled with relentless execution, turns ideas into impact.",
      },
      {
        type: "heading",
        text: "4. Challenge Experts With Ambitious Goals Not Instructions",
      },
      {
        type: "paragraph",
        text: 'Experts thrive on autonomy, not micromanagement. By framing Big Hairy Audacious Goals, I\'ve seen specialists innovate beyond expectations. Give them the "why and what," and trust them with the "how."',
      },
      {
        type: "heading",
        text: "5. Horses for Courses: Adapt Teams to Organisational Phases",
      },
      {
        type: "paragraph",
        text: "A startup's agility differs from a mature organization's rigor. Adapting leadership styles, team structures, and metrics to match an organization's phase has been critical to success across industries.",
      },
      {
        type: "heading",
        text: "6. Give Specialists the Stage, and They'll Shine",
      },
      {
        type: "paragraph",
        text: "Specialists are force multipliers. Empowering experts to lead in their domains became a non-negotiable in my leadership approach.",
      },
      {
        type: "heading",
        text: "7. Collaboration Isn't Optional—It's the Engine of Growth",
      },
      {
        type: "paragraph",
        text: "Individual brilliance can only take you so far. By aligning incentives, fostering open communication, and integrating workflows, teams achieve more together than individually.",
      },
      { type: "heading", text: "8. Elevate and Celebrate Team Victories" },
      {
        type: "paragraph",
        text: "Recognition fuels motivation. Celebrating team wins — publicly and consistently — builds ownership and pride. Teams that feel valued deliver value.",
      },
      { type: "heading", text: "Conclusion" },
      {
        type: "paragraph",
        text: "Building teams is a journey of constant learning. These lessons remind me that success hinges on people, culture, and execution. Execution isn't just a strategy — it's the legacy we build together.",
      },
    ],
  },
  {
    tag: "AI AGENTS",
    readTime: "4 MIN READ",
    date: "December 17, 2024",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "How to Build Effective AI Agents",
    description:
      "Creating an AI agent that works effectively requires more than just the agent itself.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQEDJxJtZY3Jig/article-cover_image-shrink_180_320/article-cover_image-shrink_180_320/0/1734363762906?e=1787184000&v=beta&t=ZWfmiRetot0D-eiB4LbirQ4pFaStzlFksG1TE5KFNSc",
    content: [
      {
        type: "paragraph",
        text: "Creating an AI agent that works effectively requires more than just the agent itself. Under the AI Agentic model, multiple layers must be in place to ensure optimal performance and integration within your organization.",
      },
      { type: "heading", text: "The Essential Layers of AI Architecture" },
      { type: "subheading", text: "1. Infrastructure" },
      {
        type: "paragraph",
        text: "Robust infrastructure is the backbone of any AI initiative. This includes powerful servers, cloud computing resources, and networking capabilities that can support intensive AI workloads.",
      },
      { type: "subheading", text: "2. Data" },
      {
        type: "paragraph",
        text: "High-quality data is crucial for training and operating AI agents. This means having access to clean, well-structured datasets that accurately represent the scenarios in which the agent will operate.",
      },
      { type: "subheading", text: "3. Client-side Applications" },
      {
        type: "paragraph",
        text: "Seamless client-side applications provide intuitive interfaces for users to engage with the agent. Whether it's a chatbot on a website or a voice assistant in an app, the user experience should be smooth and responsive.",
      },
      { type: "subheading", text: "4. Integration Tools" },
      {
        type: "paragraph",
        text: "AI agents must be integrated with existing systems through APIs and frameworks. These integration tools facilitate communication between the AI agent and other software applications.",
      },
      { type: "heading", text: "The Importance of Alignment" },
      {
        type: "paragraph",
        text: "If any of these layers are missing or misaligned, your AI agent may not perform as expected. This is why it's critical to approach AI implementation holistically.",
      },
      { type: "heading", text: "Considerations for Successful Implementation" },
      {
        type: "list",
        items: [
          "Analyse your Business Needs: thoroughly understand what problems you aim to solve",
          "Evaluate Existing Technology: assess your current technology landscape to identify gaps",
          "Create a Roadmap: develop a long-term roadmap that includes scalability and future needs",
          "Choose Use Cases Wisely: not every task is suitable for automation through AI agents",
        ],
      },
      { type: "heading", text: "Conclusion" },
      {
        type: "paragraph",
        text: "AI agents have the potential to transform how businesses operate, but they must be built on strong foundations. By taking a thoughtful approach to planning and execution, organizations can unlock the full potential of their AI agents and drive meaningful results.",
      },
    ],
  },
  {
    tag: "AGENTIC AI",
    readTime: "4 MIN READ",
    date: "November 29, 2024",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "Agentic AI: The Next Evolution in AI",
    description:
      "The Intelligent Virtual Assistant Market size was valued at USD 14.25 Billion in 2024.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQFCbN9b2MiYuA/article-cover_image-shrink_423_752/article-cover_image-shrink_423_752/0/1732879436421?e=1787184000&v=beta&t=EMmtu1L55aA5usCKxurDW1Pr8fzVy8R3y7u65OYt9Xw",
    content: [
      {
        type: "paragraph",
        text: "The Intelligent Virtual Assistant Market size was valued at USD 14.25 Billion in 2024 and is projected to reach USD 87.05 Billion by 2031, growing at a CAGR of 28% from 2024 to 2031.",
      },
      {
        type: "paragraph",
        text: "Transitioning from traditional large language models (LLMs) to the more sophisticated realm of Agentic AI is not merely a technological upgrade; it represents a fundamental shift in how we understand and utilize AI systems.",
      },
      { type: "heading", text: "Understanding the Shift: What is Agentic AI?" },
      {
        type: "paragraph",
        text: "Agentic AI refers to autonomous systems that possess the ability to make decisions, plan actions, and learn from experiences WITHOUT CONSTANT human intervention. Unlike traditional LLMs, which operate within predefined parameters, Agentic AI can adapt and learn from new inputs.",
      },
      { type: "heading", text: "Key Features of Agentic AI" },
      {
        type: "list",
        items: [
          "Autonomy: The ability to act with limited human oversight",
          "Reasoning: The ability to make judgement calls and weigh trade-offs",
          "Language Understanding: Comprehending and following natural language instructions",
          "Context Awareness: Understanding complex, nuanced contexts",
          "Workflow Optimisation: Moving between subtasks and applications efficiently",
        ],
      },
      { type: "heading", text: "The Implications for Businesses" },
      {
        type: "list",
        items: [
          "Improved Efficiency: Automating complex workflows and decision-making processes",
          "Enhanced Customer Engagement: Personalised experiences based on real-time data analysis",
          "Proactive Problem Solving: Anticipating needs and suggesting actions before issues arise",
        ],
      },
      { type: "heading", text: "Challenges Ahead" },
      {
        type: "list",
        items: [
          "Ethical Concerns: Autonomy raises questions about accountability and ethical decision-making",
          "Data Privacy: Ensuring user privacy and data security remains a critical concern",
          "Integration Complexity: Implementing agentic AI within existing systems can be challenging",
        ],
      },
      { type: "heading", text: "Conclusion" },
      {
        type: "paragraph",
        text: "As we navigate this new landscape, it is crucial for businesses to approach the implementation of these systems pragmatically, ensuring they maximize the advantages while addressing potential risks. The future is here, and it is agentic.",
      },
    ],
  },
  {
    tag: "AI ERA",
    readTime: "2 MIN READ",
    date: "September 27, 2024",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "Evolution of Software Engineering in the AI Era",
    description:
      "The Transformative Waves of Technology — Over the past two decades...",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQGmxn2D39GH4g/article-cover_image-shrink_423_752/article-cover_image-shrink_423_752/0/1727439816280?e=1787184000&v=beta&t=cZMAxjbLurMPfwXCs9F1-_d5L3eP4xkbcDtxWo3oRqU",
    content: [
      { type: "heading", text: "The Transformative Waves of Technology" },
      {
        type: "paragraph",
        text: "Over the past two decades, I have witnessed the tech industry undergo several transformative waves, from the early days of the internet to the rise of cloud computing, and now the explosion of Generative AI.",
      },
      { type: "heading", text: "The Rise of AI in Software Development" },
      {
        type: "paragraph",
        text: 'The rapid advancement of AI tools like GitHub Copilot, Claude, Cursor, and Continue is pushing the boundaries of software engineering. AI has evolved from a mere tool to a capable partner, taking on coding responsibilities at an unprecedented scale and speed. This shift raises a critical question: "If AI does all the coding in the future, what do we do?"',
      },
      { type: "heading", text: "Embracing a New Role" },
      {
        type: "paragraph",
        text: "The answer lies not in resisting AI but in embracing a new role. Humans will guide AI and architect the DNA of future software systems based on modern principles of Software Engineering.",
      },
      { type: "heading", text: "The Unique Value of Human Thinking" },
      {
        type: "paragraph",
        text: "While AI excels at pattern recognition, task automation, and code generation, it lacks the deeper thinking capabilities that humans possess. The ability to draw correlations across diverse systems, integrate solutions, and make nuanced decisions remains uniquely human.",
      },
      { type: "heading", text: "The Future of Software Development" },
      {
        type: "paragraph",
        text: "For software developers, the challenge isn't about competing with AI — it's about elevating our role to that of true architects and visionaries. We need to shape the future of software with AI as our trusted ally, focusing on conceptualizing new ideas and methodologies.",
      },
      {
        type: "paragraph",
        text: "In essence, it's time to ensure that AI and human creativity work in harmony to build the software systems of tomorrow.",
      },
    ],
  },
  {
    tag: "TRANSFORMATION",
    readTime: "3 MIN READ",
    date: "February 1, 2024",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title: "The Triad of Transformation",
    description:
      "In the ever-evolving landscape of supply chain management, the digital revolution is reshaping businesses across three fundamental dimensions.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQGEDyej8LdxWQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1706787208335?e=1787184000&v=beta&t=RCefvzz5WoD1V2J7WV9oMCKv99nFUzpJlBrNb_qrl2E",
    content: [
      {
        type: "paragraph",
        text: "In the ever-evolving landscape of supply chain management, the digital revolution is reshaping businesses across three fundamental dimensions. These transformative shifts encompass the evolution from e-commerce to marketplaces, the integration of right-fit ERP systems for enhanced supply chain resilience and enterprise agility, and the establishment of an integrated digital infrastructure that is both secure and scalable.",
      },
      {
        type: "heading",
        text: "1. E-Commerce to Marketplace: Collaboration Redefined",
      },
      {
        type: "paragraph",
        text: "The journey begins with the metamorphosis from traditional e-commerce frameworks to dynamic marketplaces. E-commerce, once a linear transactional model, is giving way to collaborative ecosystems where buyers and sellers converge in a shared marketplace.",
      },
      {
        type: "paragraph",
        text: "This shift transcends simple transactions, fostering an environment of innovation, diverse product offerings, and symbiotic relationships. Marketplaces enable supply chain businesses to broaden their horizons, diversify partnerships, and create a holistic ecosystem that goes beyond traditional business boundaries.",
      },
      {
        type: "heading",
        text: "2. Right and Robust ERP Systems for Resilience and Agility",
      },
      {
        type: "paragraph",
        text: "Supply chain resilience and agility have become paramount in the face of global uncertainties. The right suite of enterprise resource solutions provides advanced analytics and real-time insights, allowing businesses to optimize processes, predict disruptions, and respond with agility.",
      },
      {
        type: "paragraph",
        text: "From demand forecasting to inventory management, these robust systems align supply chain objectives, ensuring adaptability and responsiveness.",
      },
      {
        type: "heading",
        text: "3. Integrated Digital Infrastructure: Secure and Scalable Foundations",
      },
      {
        type: "paragraph",
        text: "The third dimension of this transformative journey revolves around the establishment of an integrated digital infrastructure that is both secure and scalable. Cloud computing, edge computing, and robust cybersecurity measures form the backbone of this infrastructure.",
      },
      {
        type: "paragraph",
        text: "Supply chain businesses are transitioning towards interconnected systems that streamline communication, enhance operational efficiency, and address growing concerns about data security and compliance. The focus is on creating a digital foundation that not only meets current needs but also adapts seamlessly to future demands, ensuring scalability without compromising security.",
      },
    ],
  },
  {
    tag: "HYPERAUTOMATION",
    readTime: "4 MIN READ",
    date: "July 1, 2020",
    author: "Ravishankar Pingali",
    authorRole:
      "Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor",
    title:
      "Hyperautomation Unleashed: Combining the Power of Multiple Technologies",
    description:
      "Hyperautomation is emerging as a top priority — combining RPA, intelligent BPM software, and AI to enable AI-driven decision-making.",
    image:
      "https://media.licdn.com/dms/image/v2/C4D12AQG-WjAziqiyJw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1593526555018?e=1787184000&v=beta&t=mh8cb8OWvHozS-QpX4r0PVXba4CKPCgFEhsXf08LkYA",
    content: [
      {
        type: "paragraph",
        text: "Today, as enterprises keep on pushing the limits of their digital transformation initiatives, hyperautomation is emerging as one of the top priorities and trends. It is rated at the top of Gartner's list of Strategic Technology Trends for 2020 as it helps enterprises automate critical and operational processes quickly.",
      },
      {
        type: "paragraph",
        text: "Well, no single tool can replace humans or their cognitive abilities. But hyperautomation involves a combination of tools including robotic process automation (RPA), intelligent business process management software (iBPMS) and AI, thereby enabling AI-driven decision-making.",
      },
      {
        type: "paragraph",
        text: "It is also referred to as the sophistication of automation — discover, analyze, design, automate, measure, monitor, reassess & repeat.",
      },
      { type: "heading", text: "The Combined Power of RPA and AI" },
      {
        type: "paragraph",
        text: "The convergence of RPA and AI can lead to significant improvement in process efficiency and productivity. AI can help enterprises discover new automation opportunities by identifying repetitive processes. AI can be used to intelligently extract and classify unstructured data, which allows the complete automation of business processes.",
      },
      {
        type: "paragraph",
        text: "Take the example of insurance claims processing, where AI and RPA systems can complement each other extremely well. Using NLP technologies, AI can help in converting unstructured information into structured data — which can be leveraged later by bots. An AI-enabled automation tool can process and scan electronic documents automatically, identify claim information and store this data into a database, which can then be used by RPA bots to automatically process claims.",
      },
      { type: "heading", text: "Scaling Automation" },
      {
        type: "paragraph",
        text: "If one can augment the speed of the discovery phase through AI, it will be a significant boost in identifying use cases for the creation of bots — thereby helping enterprises scale their level of automation with speed and efficiency.",
      },
      {
        type: "paragraph",
        text: "AI and ML can be used to perform continuous learning with information collected by bots. This information can be used to update the learning models dynamically, which further leads to an improvement in the quality of automation and hence the end-user experience.",
      },
      {
        type: "paragraph",
        text: "By combining RPA with AI, automation can also be extended to undocumented processes that rely on unstructured data. This could include processes such as contract management, procure to pay, order to cash, policy servicing, anti-money laundering (AML) checks, and fraud investigations.",
      },
      { type: "heading", text: "What Industry Leaders Are Saying" },
      {
        type: "quote",
        text: "By 2022, 65% of organizations that deployed robotic process automation will introduce artificial intelligence, machine learning, and natural language processing algorithms — Gartner",
      },
      { type: "heading", text: "Looking Ahead" },
      {
        type: "paragraph",
        text: "If adopted well, the potential gains from hyperautomation are multifold — as constant learning, reasoning and self-correction can continuously update automation frameworks and improve processes consistently.",
      },
      {
        type: "paragraph",
        text: "Deployment of hyperautomation technologies is expected to accelerate further. The fact that all the leading RPA platforms have already embedded AI in their toolset further underscores the growing need for hyperautomation across domains.",
      },
      {
        type: "paragraph",
        text: "'Democratization of Automation' is likely to take off further from here…",
      },
    ],
  },
];

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-3.5 h-3.5 inline-block mr-1"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4 inline-block ml-1"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
      />
    </svg>
  );
}

export default function Articles() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const location = useLocation();
  const isMobile = useMobileDetection();

  useGSAP(() => {
    gsap.from(".articles-headline", {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 60,
      stagger: 0.15,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className={` w-full ${location.pathname === "/articles" ? "pt-32 pb-10" : "py-10 pb-20"} px-6  sm:px-12 md:px-6 lg:px-12 relative overflow-hidden font-['PlusJakartaSans',sans-serif]`}
      >
        <img
          src={articlesSectionBg}
          alt="Articles Section Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-1 opacity-75"
        />

        {/* Minimal White Overlay from Top-Left */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-1 bg-linear-to-br from-white/45 via-white/15 to-transparent" />

        <div className="max-w-365 mx-auto relative " style={{ zIndex: 2 }}>
          <WebGLParticleCanvas variant="articles" />
          <BentoCardGrid gridRef={gridRef}>
            <GlobalSpotlight
              gridRef={gridRef}
              disableAnimations={isMobile}
              enabled={true}
              spotlightRadius={400}
              glowColor="0, 196, 180"
            />
            <div className="grid items-start">
              <div className="articles-headline shrink-0 pt-2">
                <p className="text-brand-blue font-semibold tracking-[0.18em] uppercase text-xs mb-3">
                  INSIGHTS &amp; PERSPECTIVES
                </p>
                <Heading
                  level={2}
                  className="font-['Playfair_Display',serif] font-semibold text-[2.5rem] sm:text-[3rem] lg:text-[3.25rem] leading-[1.05] tracking-tight text-[#050B18] sm:text-[#0B192C] mb-5 drop-shadow-md sm:drop-shadow-none"
                >
                  Thought Leadership<br/>
             
                  for the{" "}
                  <span className="text-brand-teal  font-['Playfair_Display',serif]">
                    AI Era.
                  </span>
                </Heading>
                <p className="text-[#050B18] sm:text-black text-sm sm:text-base leading-relaxed mb-2 drop-shadow-md sm:drop-shadow-none">
                  Expert insights, frameworks and perspectives to help leaders
                  navigate complexity and build future-ready organisations.
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {articles.slice(0, 4).map((article, idx) => (
                  <ParticleCard
                    key={idx}
                    ref={(el) => (cardsRef.current[idx] = el)}
                    onClick={() => setSelectedArticle(article)}
                    disableAnimations={isMobile}
                    particleCount={12}
                    glowColor="0, 196, 180"
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={true}
                    className="magic-bento-card magic-bento-card--border-glow rounded-xl overflow-hidden cursor-pointer group flex flex-col bg-white/85 border border-[#00C4B4]/[0.22] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
                    </div>
                    <div className="flex flex-col flex-1 p-3 z-10">
                      <h3 className="text-[#050B18] font-['Playfair_Display',serif] font-semibold text-[1rem] leading-[1.25] mb-2 flex-1">
                        {article.title}
                      </h3>
                      <p className="text-[#050B18]/70 text-xs leading-relaxed mb-3">
                        {article.description}
                      </p>
                      <span className="text-brand-teal text-xs font-semibold tracking-wide inline-flex items-center gap-1 group-hover:text-[#050B18] transition-colors">
                        Read Article <ArrowRightIcon />
                      </span>
                    </div>
                  </ParticleCard>
                ))}
              </div>
            </div>
          </BentoCardGrid>
        </div>
      </section>

      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
}
