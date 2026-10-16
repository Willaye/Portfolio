import Link from "next/link";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { AboutPortrait } from "./AboutPortrait";

/** About + CV summary. The full printable CV lives at /cv. */
export function About() {
  const { cv } = site;
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">About · CV</span>
          <h2 id="about-title" className="h2">
            Hi, I&apos;m {site.brand.split(" ")[0]}. I build <em>end to end.</em>
          </h2>
        </Reveal>
        <div className="about">
          <Reveal>
            <AboutPortrait src={site.portrait} name={site.brand} />
          </Reveal>
          <Reveal delay={120}>
            <p className="lead" style={{ marginTop: 0, color: "var(--ink)" }}>
              {cv.summary}
            </p>
            <p className="mono" style={{ color: "var(--dim)" }}>
              {site.role} · {site.location}
            </p>

            <h3 className="mono" style={{ color: "var(--dim)", margin: "36px 0 12px" }}>
              Experience
            </h3>
            <div className="timeline">
              {cv.experience.map((x) => (
                <div key={x.role + x.period} className="timeline-item">
                  <span className="mono" style={{ color: "var(--a1)", paddingTop: 4 }}>
                    {x.period}
                  </span>
                  <div>
                    <div style={{ fontWeight: 650, fontSize: 18 }}>{x.role}</div>
                    <div style={{ color: "var(--dim)" }}>{x.org}</div>
                    <ul>
                      {x.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3" style={{ marginTop: 28 }}>
              <Link className="btn btn-ink" href="/cv">
                View full CV
              </Link>
              <a className="btn" href="#contact">
                Hire me
              </a>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-3" style={{ marginTop: 48 }}>
          {cv.skills.map((g, i) => (
            <Reveal key={g.group} delay={(i % 3) * 80}>
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
      </div>
    </section>
  );
}
