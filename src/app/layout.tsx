import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { site } from "@/content/site";
import { accentBootScript } from "@/lib/accent";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CursorSpot } from "@/components/layout/CursorSpot";
import { Toast } from "@/components/layout/Toast";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const title = `${site.brand} · ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: title, template: `%s · ${site.brand}` },
  description: site.taglines.seoDescription,
  alternates: { canonical: "/" },
  authors: [{ name: site.brand }],
  openGraph: { type: "website", url: "/", siteName: site.brand, title, description: site.taglines.seoDescription },
  twitter: { card: "summary_large_image", title, description: site.taglines.seoDescription },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#050507", colorScheme: "dark", width: "device-width", initialScale: 1, viewportFit: "cover" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.brand,
  description: site.taglines.seoDescription,
  url: site.siteUrl,
  email: site.email,
  telephone: `+${site.whatsapp}`,
  areaServed: "Worldwide",
  founder: { "@type": "Person", name: site.brand, jobTitle: site.role },
  sameAs: site.socials.map((s) => s.href),
  makesOffer: site.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.description } })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-accent="crimson"
      className={`${archivo.variable} ${instrument.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentBootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="glow glow-1" aria-hidden="true" />
        <div className="glow glow-2" aria-hidden="true" />
        <ScrollProgress />
        <CursorSpot />
        {children}
        <div className="grain" aria-hidden="true" />
        <Toast />
      </body>
    </html>
  );
}
