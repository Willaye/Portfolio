import type { Metadata } from "next";
import { site } from "@/content/site";
import Link from "next/link";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae of ${site.brand}, ${site.role}.`,
  alternates: { canonical: "/cv" },
};

/** Printable one-page CV generated from content/site.ts. Use "Save as PDF" in the print dialog. */
export default function CvPage() {
  const { cv } = site;
  const h3 = { fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".14em", fontSize: 12, color: "var(--a1)", margin: "32px 0 12px" } as const;
  return (
    <main id="main" className="wrap cv" style={{ maxWidth: 900, paddingTop: 48, paddingBottom: 80 }}>
      <div className="no-print flex flex-wrap justify-between gap-3" style={{ marginBottom: 40 }}>
        <Link className="btn btn-sm" href="/">
          ← Back to site
        </Link>
        <PrintButton />
      </div>
      <header
        style={{
          borderBottom: "1px solid var(--line2)",
          paddingBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: "clamp(18px, 3vw, 36px)",
          flexWrap: "wrap",
        }}
      >
        {site.portrait && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={site.portrait}
            alt={`Photo of ${site.brand}`}
            width={132}
            height={132}
            style={{
              width: "clamp(96px, 14vw, 132px)",
              height: "clamp(96px, 14vw, 132px)",
              borderRadius: 20,
              objectFit: "cover",
              border: "1px solid var(--line2)",
              flex: "none",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          />
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 className="display" style={{ fontSize: "clamp(40px, 8vw, 84px)", margin: 0 }}>
            {site.brand}
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(18px, 2.4vw, 26px)", margin: "10px 0 6px" }}>
            {cv.headline}
          </p>
          <p className="mono" style={{ color: "var(--dim)", margin: 0 }}>
            {site.email} · {site.whatsappLabel} · {site.location} · {site.siteUrl.replace(/^https?:\/\//, "")}
          </p>
        </div>
      </header>

      <h2 style={h3}>Profile</h2>
      <p style={{ margin: 0 }}>{cv.summary}</p>

      <h2 style={h3}>Experience</h2>
      {cv.experience.map((x) => (
        <section key={x.role + x.period} style={{ marginBottom: 18 }}>
          <div className="flex flex-wrap justify-between gap-2">
            <strong>
              {x.role} · {x.org}
            </strong>
            <span className="mono" style={{ color: "var(--dim)" }}>{x.period}</span>
          </div>
          <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "var(--dim)" }}>
            {x.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2 style={h3}>Selected projects</h2>
      {site.projects.map((p) => (
        <p key={p.title} style={{ margin: "0 0 10px" }}>
          <strong>{p.title}</strong> <span style={{ color: "var(--dim)" }}>({p.sector})</span>: {p.blurb}{" "}
          <span style={{ color: "var(--dim)" }}>{p.tech.join(", ")}.</span>
        </p>
      ))}

      <h2 style={h3}>Skills</h2>
      <div style={{ display: "grid", gap: 6 }}>
        {cv.skills.map((g) => (
          <div key={g.group}>
            <strong>{g.group}:</strong> <span style={{ color: "var(--dim)" }}>{g.items.join(", ")}</span>
          </div>
        ))}
      </div>

      <h2 style={h3}>Education</h2>
      {cv.education.map((e) => (
        <div key={e.title} className="flex flex-wrap justify-between gap-2">
          <span>
            <strong>{e.title}</strong>, {e.org}
          </span>
          <span className="mono" style={{ color: "var(--dim)" }}>{e.period}</span>
        </div>
      ))}

      <h2 style={h3}>Languages</h2>
      <p style={{ margin: 0 }}>{cv.languages.join(", ")}</p>
    </main>
  );
}
