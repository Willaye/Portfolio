/**
 * ─────────────────────────────────────────────────────────────
 *  ALL EDITABLE CONTENT LIVES HERE.
 *  Change any text, number, price or project below and the whole
 *  site updates. Components never hard-code copy.
 *
 *  Contact details (email, whatsapp) are REAL. The projects,
 *  stats and experience below are starter placeholders — swap in
 *  your real work and numbers whenever you like.
 * ─────────────────────────────────────────────────────────────
 */
import { siteSchema, type Site } from "./schema";

const rawSite: Site = {
  brand: "Willaye Haider",
  wordmark: "Willaye",
  role: "Full-stack developer",
  siteUrl: "https://web-production-4a9c5.up.railway.app",
  location: "Pakistan · available worldwide (remote)",
  email: "willayedev@gmail.com",
  whatsapp: "923295323581",
  whatsappLabel: "+92 329 5323581",
  /** Your headshot lives at /public/willaye.jpg. Set to "" to show initials instead. */
  portrait: "/willaye.jpg",

  taglines: {
    heroLead: "Web apps, built to",
    heroAccent: "last.",
    intro:
      "I'm a full-stack web app developer. I design and build complete products end to end, from clean React/Next.js frontends to solid APIs, databases and real-time dashboards, and ship them to production.",
    hint: "Click the visual to morph it. Photos you add stay in your browser and are never uploaded.",
    seoDescription:
      "Willaye Haider is a full-stack developer building Flutter apps, NestJS / Node.js APIs, PostgreSQL databases, real-time Socket.IO features and Next.js web apps.",
  },

  marquee: ["Flutter", "NestJS", "PostgreSQL", "Socket.IO", "Web apps", "Dashboards", "Real-time", "Next.js", "Node.js"],

  services: [
    {
      title: "Full-stack web apps",
      description: "Complete products built end to end, from the first screen to the deployed app.",
      tags: ["Next.js", "React", "Node.js", "TypeScript"],
      visual: "browser",
    },
    {
      title: "Backend & APIs",
      description: "Secure, well-structured APIs and server logic — my core strength as a backend developer.",
      tags: ["NestJS", "Node.js", "TypeScript", "JWT"],
      visual: "servers",
    },
    {
      title: "Mobile apps (Flutter)",
      description: "Cross-platform iOS and Android apps from one Flutter codebase, so you launch sooner.",
      tags: ["Flutter", "Dart", "Riverpod", "Dio"],
      visual: "phone",
    },
    {
      title: "Databases & real-time",
      description: "Reliable data models plus live updates with WebSockets for real-time features.",
      tags: ["PostgreSQL", "Prisma", "Socket.IO", "WebSockets"],
      visual: "nodes",
    },
    {
      title: "Dashboards & monitoring",
      description: "Admin panels and live dashboards with charts, metrics and useful alerts.",
      tags: ["Analytics", "Charts", "Alerts"],
      visual: "bars",
    },
    {
      title: "Frontend & UI",
      description: "Fast, accessible, good-looking interfaces that users understand on the first try.",
      tags: ["React", "Tailwind", "UI / UX"],
      visual: "curve",
    },
  ],

  projects: [
    {
      title: "NOX",
      sector: "Nationwide tracking · Flutter + NestJS",
      blurb:
        "A nationwide real-time tracking app: Flutter apps for target and admin devices, a NestJS backend with Socket.IO for live GPS across the country, WhatsApp capture, remote lock/unlock and instant alerts.",
      metrics: [
        { value: "18", label: "data models" },
        { value: "24/7", label: "live tracking" },
        { value: "<1s", label: "alert latency" },
      ],
      tech: ["Flutter", "NestJS", "PostgreSQL", "Socket.IO"],
      mockup: "phone",
    },
    {
      title: "BloodBridge",
      sector: "Concept · Health · Mobile app",
      blurb:
        "Problem: families post urgent blood requests on WhatsApp and Facebook and wait hours for a donor. BloodBridge matches a request by blood group and distance, notifies nearby verified donors instantly, and tracks who is on the way. Donors get a 90-day cooldown so nobody is asked too soon.",
      metrics: [
        { value: "8", label: "blood groups" },
        { value: "10 km", label: "match radius" },
        { value: "90 days", label: "donor cooldown" },
      ],
      tech: ["Flutter", "NestJS", "PostgreSQL", "Firebase FCM"],
      mockup: "phone",
    },

    {
      title: "Pillpoint",
      sector: "Concept · Health · Web app",
      blurb:
        "Problem: when a medicine is short, people drive from pharmacy to pharmacy asking for it. Pharmacies update their stock in Pillpoint, and patients search a medicine to see which nearby stores have it, the price, and the generic alternatives.",
      metrics: [
        { value: "Nearby", label: "stock search" },
        { value: "Generic", label: "alternatives" },
        { value: "Price", label: "comparison" },
      ],
      tech: ["Next.js", "NestJS", "PostgreSQL", "Google Maps"],
      mockup: "store",
    },    {
      title: "ScamShield AI",
      sector: "Concept · AI · Fraud protection",
      blurb:
        "Problem: people get fake 'Benazir program' and 'you won a prize' SMS, calls and WhatsApp messages, and end up sharing their money or OTP. With ScamShield AI, the user pastes a suspicious message or uploads a screenshot, and the AI says whether it is a scam and explains why in simple Urdu or English. Reported scams are added to a shared list so everyone else gets warned.",
      metrics: [
        { value: "SMS", label: "+ WhatsApp checks" },
        { value: "Urdu", label: "+ English" },
        { value: "Shared", label: "scam reports" },
      ],
      tech: ["Flutter", "Python", "FastAPI", "OpenAI API"],
      mockup: "laptop",
    },



  ],

  stats: [
    { value: 15, suffix: "+", label: "Projects shipped" },
    { value: 10, suffix: "+", label: "Happy clients" },
    { value: 3, suffix: "+", label: "Years coding" },
    { value: 24, suffix: "h", label: "Average reply time" },
  ],

  process: [
    { title: "Discover", time: "Week 1", text: "We define goals, users and scope, and agree on a clear plan." },
    { title: "Design", time: "Week 1-2", text: "Clickable screens and data models you approve before any code." },
    { title: "Build", time: "Week 2-6", text: "Weekly demos of real, working software so progress is always visible." },
    { title: "Launch & grow", time: "Week 6+", text: "Ship to production, monitor everything, and keep improving with data." },
  ],

  plans: [
    {
      name: "Landing / Website",
      price: "$499",
      note: "starting at",
      need: "Website",
      popular: false,
      features: ["Up to 5 pages", "Mobile-first, fast & SEO-ready", "CMS or easy content edits", "Contact form + WhatsApp", "2 weeks of support"],
    },
    {
      name: "Web app",
      price: "$1,499",
      note: "starting at",
      need: "Web app",
      popular: true,
      features: ["Custom full-stack web app", "Auth, roles & admin panel", "API + database", "Live dashboard / analytics", "1 month of support"],
    },
    {
      name: "Product / Scale",
      price: "Custom",
      note: "quote",
      need: "Web app",
      popular: false,
      features: ["Web + mobile product", "Real-time & monitoring", "AI features and automation", "Cloud, CI/CD & scaling", "Ongoing care plan"],
    },
  ],

  faq: [
    {
      q: "How long does a project take?",
      a: "A website usually takes 1 to 3 weeks. A full-stack web app takes 4 to 10 weeks depending on scope. You always get a clear timeline before we start.",
    },
    {
      q: "How does payment work?",
      a: "Work is split into milestones, typically 40% to start, 40% at the beta demo and 20% at launch. You never pay for work you haven't seen.",
    },
    {
      q: "Do you offer support after launch?",
      a: "Yes. Every package includes a support window, and monthly care plans cover updates, monitoring, backups and small changes.",
    },
    {
      q: "Who owns the code?",
      a: "You do. After the final payment you get the full source code, accounts and documentation.",
    },
    {
      q: "Can you improve or finish an existing app?",
      a: "Absolutely. I can audit speed, code quality and UX, then fix, finish or rebuild only what's needed.",
    },
  ],

  /** Shown in the About / CV section and on the printable /cv page. */
  cv: {
    headline: "Full-stack developer · Flutter, NestJS, PostgreSQL",
    summary:
      "Full-stack developer with a BS in Computer Science from the University of Gujrat. I spent a year as a backend developer at Pixelizio, building APIs and database models with NestJS and PostgreSQL. I now freelance, working directly with clients on websites, web apps and Flutter mobile apps. Most of my recent work pairs a Flutter app with a NestJS backend and live updates over Socket.IO.",
    /** The main stack, shown as App → Backend → Database on the site and the CV. */
    stack: [
      { layer: "App", name: "Flutter", items: ["Dart", "Riverpod", "GoRouter", "Dio HTTP"] },
      { layer: "Backend", name: "NestJS", items: ["Node.js", "TypeScript", "Socket.IO", "JWT", "Multer"] },
      { layer: "Database", name: "PostgreSQL", items: ["Prisma ORM", "Migrations", "Indexing"] },
    ],
    skills: [
      { group: "Mobile", items: ["Flutter", "Dart", "Riverpod", "GoRouter", "Dio HTTP", "Firebase"] },
      { group: "Backend", items: ["Node.js", "NestJS", "TypeScript", "Express", "REST APIs", "JWT Auth", "Multer uploads"] },
      { group: "Real-time", items: ["WebSockets", "Socket.IO", "Live dashboards"] },
      { group: "Database", items: ["PostgreSQL", "Prisma ORM", "Migrations", "Indexing", "MongoDB", "MySQL"] },
      { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML / CSS"] },
      { group: "Tools & Cloud", items: ["Git & GitHub", "Docker", "Vercel", "Linux", "CI/CD"] },
    ],
    experience: [
      {
        role: "Freelance web & app developer",
        org: "Independent · Remote",
        period: "Ongoing",
        points: [
          "Work directly with solo clients, handling each project end to end from the first call to delivery.",
          "Build websites and full-stack web apps, and developed a cross-platform mobile app with Flutter.",
        ],
      },
      {
        role: "Backend Developer",
        org: "Pixelizio",
        period: "2025 – 2026",
        points: [
          "Worked for a year building and maintaining backend APIs, server-side logic and database models.",
          "Delivered and shipped web product features to production together with the team.",
        ],
      },
      {
        role: "Intern — Government IT program",
        org: "RP9, Kharian Cantt",
        period: "2023",
        points: [
          "Completed an internship in a government technology program.",
          "Gained hands-on experience building and supporting real software.",
        ],
      },
    ],
    education: [{ title: "BS Computer Science", org: "University of Gujrat (UOG)", period: "2021 – 2025" }],
    languages: ["English", "Urdu"],
  },

  socials: [
    { label: "GitHub", href: "https://github.com/Willaye-Jafferi" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/syeda-willaye-haider" },
    { label: "Instagram", href: "https://www.instagram.com/developer_lobby" },
  ],
};

/** Validated at build time: an invalid edit fails `next build` with a clear Zod error. */
export const site: Site = siteSchema.parse(rawSite);
