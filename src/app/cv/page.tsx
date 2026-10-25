import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { StackFlow } from "@/components/sections/StackFlow";
import { DownloadButton } from "./DownloadButton";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae of ${site.brand}, ${site.role}.`,
  alternates: { canonical: "/cv" },
};

export default function CvPage() {
  const { cv } = site;
  return (
    <>
      <Nav />
      <main id="main" className="section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
        <div className="wrap">
          {/* Header */}
          <Reveal className="cv-hero">
            <div className="cv-hero-left">
              {site.portrait && (
                <div className="cv-portrait">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={site.portrait} alt={`Photo of ${site.brand}`} />
                </div>
              )}
            </div>
            <div className="cv-hero-right">
              <span className="eyebrow">Curriculum Vitae</span>
              <h1 className="h2" style={{ marginTop: 12 }}>
                {site.brand}
              </h1>
              <p className="lead" style={{ marginTop: 16 }}>
                {cv.headline}
              </p>
              <ul className="cv-contact-row">
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  <a href={`https://wa.me/${site.whatsapp}`}>{site.whatsappLabel}</a>
                </li>
                <li>{site.location}</li>
              </ul>
              <div className="no-print flex flex-wrap gap-3" style={{ marginTop: 24 }}>
                <DownloadButton />
                <Link className="btn" href="/#contact">
                  Hire me
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Profile */}
          <Reveal>
            <Card className="cv-card">
              <h2 className="cv-section-title">Profile</h2>
              <p className="cv-text">{cv.summary}</p>
            </Card>
          </Reveal>

          {/* Tech Stack */}
          <Reveal delay={60}>
            <Card className="cv-card">
              <h2 className="cv-section-title">Main Tech Stack</h2>
              <StackFlow />
            </Card>
          </Reveal>

          {/* Skills */}
          <Reveal delay={80}>
            <h2 className="cv-section-title" style={{ marginTop: 48, marginBottom: 20 }}>
              Skills
            </h2>
          </Reveal>
          <div className="grid grid-3">
            {cv.skills.map((g, i) => (
              <Reveal key={g.group} delay={(i % 3) * 60}>
                <Card className="h-full">
                  <h3>{g.group}</h3>
                  <div className="tags">
                    {g.items.map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Experience */}
          <Reveal delay={80}>
            <h2 className="cv-section-title" style={{ marginTop: 48, marginBottom: 20 }}>
              Experience
            </h2>
          </Reveal>
          <div className="cv-timeline">
            {cv.experience.map((x, i) => (
              <Reveal key={x.role + x.org} delay={i * 60}>
                <Card className="cv-exp-card">
                  <h3 className="cv-exp-role">{x.role}</h3>
                  <p className="cv-exp-org">
                    {x.org}
                    {x.period && <span className="cv-period"> · {x.period}</span>}
                  </p>
                  <ul className="cv-exp-points">
                    {x.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Projects */}
          <Reveal delay={80}>
            <h2 className="cv-section-title" style={{ marginTop: 48, marginBottom: 20 }}>
              Selected Projects
            </h2>
          </Reveal>
          <div className="grid grid-2">
            {site.projects.slice(0, 4).map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 60}>
                <Card className="h-full">
                  <h3 style={{ margin: 0 }}>{p.title}</h3>
                  <p className="mono" style={{ color: "var(--a1)", margin: "6px 0 12px" }}>
                    {p.sector}
                  </p>
                  <p style={{ color: "var(--dim)", margin: 0 }}>{p.blurb}</p>
                  <div className="tags" style={{ marginTop: 14 }}>
                    {p.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Education & Languages */}
          <div className="grid grid-2" style={{ marginTop: 32 }}>
            <Reveal>
              <Card className="h-full">
                <h2 className="cv-section-title" style={{ marginTop: 0 }}>
                  Education
                </h2>
                {cv.education.map((e) => (
                  <div key={e.title} style={{ marginTop: 12 }}>
                    <strong>{e.title}</strong>
                    <p style={{ color: "var(--dim)", margin: "4px 0 0" }}>
                      {e.org}
                      {e.period && <span className="cv-period"> · {e.period}</span>}
                    </p>
                  </div>
                ))}
              </Card>
            </Reveal>
            <Reveal delay={60}>
              <Card className="h-full">
                <h2 className="cv-section-title" style={{ marginTop: 0 }}>
                  Languages
                </h2>
                <div className="tags" style={{ marginTop: 12 }}>
                  {cv.languages.map((l) => (
                    <span key={l} className="tag">
                      {l}
                    </span>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>

          {/* Socials */}
          <Reveal>
            <Card className="cv-card" style={{ marginTop: 32, textAlign: "center" }}>
              <h2 className="cv-section-title" style={{ marginTop: 0 }}>
                Connect
              </h2>
              <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 16 }}>
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                    {s.label}
                  </a>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
