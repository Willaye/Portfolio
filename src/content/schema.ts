import { z } from "zod";

const metric = z.object({ value: z.string().min(1), label: z.string().min(1) });

export const siteSchema = z.object({
  brand: z.string().min(1),
  wordmark: z.string().min(1),
  role: z.string().min(1),
  siteUrl: z.url(),
  location: z.string(),
  email: z.email(),
  whatsapp: z.string().regex(/^\d{7,15}$/, "whatsapp must be digits only, with country code"),
  whatsappLabel: z.string().min(1),
  portrait: z.string(),
  taglines: z.object({
    heroLead: z.string(),
    heroAccent: z.string(),
    intro: z.string(),
    hint: z.string(),
    seoDescription: z.string().max(170),
  }),
  marquee: z.array(z.string()).min(3),
  services: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).min(1).max(4),
        visual: z.enum(["browser", "phone", "curve", "nodes", "bars", "servers"]),
      }),
    )
    .min(1),
  projects: z.array(
    z.object({
      title: z.string(),
      sector: z.string(),
      blurb: z.string(),
      metrics: z.array(metric).length(3),
      tech: z.array(z.string()),
      mockup: z.enum(["laptop", "phone", "store"]),
    }),
  ),
  stats: z.array(z.object({ value: z.number().nonnegative(), suffix: z.string(), label: z.string() })),
  process: z.array(z.object({ title: z.string(), time: z.string(), text: z.string() })),
  plans: z.array(
    z.object({
      name: z.string(),
      price: z.string(),
      note: z.string(),
      need: z.string(),
      popular: z.boolean(),
      features: z.array(z.string()),
    }),
  ),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
  cv: z.object({
    headline: z.string(),
    summary: z.string(),
    stack: z.array(z.object({ layer: z.string(), name: z.string(), items: z.array(z.string()) })).min(1),
    skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
    experience: z.array(
      z.object({ role: z.string(), org: z.string(), period: z.string(), points: z.array(z.string()) }),
    ),
    education: z.array(z.object({ title: z.string(), org: z.string(), period: z.string() })),
    languages: z.array(z.string()),
  }),
  socials: z.array(z.object({ label: z.string(), href: z.url() })),
});

export type Site = z.infer<typeof siteSchema>;

/** Options in the contact form's "I need" chip group. */
export const NEEDS = ["Website", "Web app", "Mobile app", "Backend / API", "Dashboard", "UI / UX"] as const;
export const BUDGETS = ["Under $500", "$500-$2k", "$2k-$5k", "$5k+"] as const;
