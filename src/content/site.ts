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
  role: "Full-stack web app developer",
  siteUrl: "https://willaye.dev",
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
      "Willaye Haider is a full-stack web app developer building React/Next.js frontends, Node APIs, databases, real-time dashboards and AI features for the web.",
  },

  marquee: ["Web apps", "SaaS", "Dashboards", "APIs", "Real-time", "AI features", "Next.js", "Node.js"],

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
      tags: ["Node.js", "REST", "Databases", "Auth"],
      visual: "servers",
    },
    {
      title: "Mobile apps (Flutter)",
      description: "Cross-platform iOS and Android apps from one Flutter codebase, so you launch sooner.",
      tags: ["Flutter", "Dart", "Firebase"],
      visual: "phone",
    },
    {
      title: "Databases & real-time",
      description: "Reliable data models plus live updates with WebSockets for real-time features.",
      tags: ["PostgreSQL", "MongoDB", "WebSockets"],
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
      title: "Orbit Monitor",
      sector: "SaaS · Real-time dashboard",
      blurb:
        "A real-time monitoring web app that tracks servers, APIs and services in one live dashboard, with alerts on WhatsApp and email.",
      metrics: [
        { value: "2M", label: "events / min" },
        { value: "-38%", label: "infra cost" },
        { value: "<1s", label: "data lag" },
      ],
      tech: ["Next.js", "Node.js", "WebSockets", "ClickHouse"],
      mockup: "laptop",
    },
    {
      title: "Route Runner",
      sector: "Mobile app · Flutter",
      blurb:
        "A cross-platform delivery app built with Flutter: live GPS tracking, optimised routes and proof of delivery, backed by a Node API.",
      metrics: [
        { value: "4.8", label: "store rating" },
        { value: "35%", label: "faster routes" },
        { value: "50k", label: "deliveries / mo" },
      ],
      tech: ["Flutter", "Dart", "Node.js", "PostgreSQL"],
      mockup: "phone",
    },
    {
      title: "Kiln & Co Store",
      sector: "E-commerce · Web app",
      blurb: "A headless storefront rebuilt for speed, with a checkout that converts on mobile.",
      metrics: [
        { value: "+64%", label: "conversion" },
        { value: "0.9s", label: "load time" },
        { value: "3x", label: "revenue" },
      ],
      tech: ["Next.js", "Stripe", "Shopify API"],
      mockup: "store",
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
    headline: "Full-stack web app developer — React / Next.js, backend APIs and Flutter apps.",
    summary:
      "I'm Willaye Haider, a full-stack web app developer. I build fast React / Next.js websites and web apps, backend APIs (I worked for a year as a backend developer at Pixelizio), and cross-platform mobile apps with Flutter. I make both web and apps, and I care about performance, clean code and interfaces that feel effortless.",
    skills: [
      { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML / CSS"] },
      { group: "Backend", items: ["Node.js", "Express", "REST APIs", "Auth", "WebSockets"] },
      { group: "Mobile", items: ["Flutter", "Dart", "Firebase"] },
      { group: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL", "Prisma"] },
      { group: "Tools & Cloud", items: ["Git & GitHub", "Docker", "Vercel", "Linux", "CI/CD"] },
      { group: "Also", items: ["Websites", "Dashboards", "UI / UX"] },
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
        period: "1 year",
        points: [
          "Worked for a year building and maintaining backend APIs, server-side logic and database models.",
          "Delivered and shipped web product features to production together with the team.",
        ],
      },
      {
        role: "Intern — Government IT program",
        org: "RP9, Khaian Kent",
        period: "2023",
        points: [
          "Completed an internship in a government technology program.",
          "Gained hands-on experience building and supporting real software.",
        ],
      },
    ],
    education: [{ title: "BS Computer Science", org: "University of Gujrat (UOG)", period: "" }],
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
