import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.siteUrl}/cv`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
