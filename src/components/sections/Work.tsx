import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { LaptopDashboard } from "@/components/mockups/LaptopDashboard";
import { PhoneApp } from "@/components/mockups/PhoneApp";
import { StoreBrowser } from "@/components/mockups/StoreBrowser";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const MOCKUPS = { laptop: LaptopDashboard, phone: PhoneApp, store: StoreBrowser } as const;

export function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Selected work · sample projects</span>
          <h2 id="work-title" className="h2">
            Built to <em>perform.</em>
          </h2>
        </Reveal>
        <div>
          {site.projects.map((p) => {
            const Mock = MOCKUPS[p.mockup];
            return (
              <article key={p.title} className="work-row" aria-labelledby={`p-${slug(p.title)}`}>
                <Reveal className="work-text">
                  <span className="mono" style={{ color: "var(--a1)" }}>
                    {p.sector}
                  </span>
                  <h3 id={`p-${slug(p.title)}`} className="work-title">
                    {p.title}
                  </h3>
                  <p className="lead">{p.blurb}</p>
                  <dl className="metrics">
                    {p.metrics.map((m) => (
                      <div key={m.label} style={{ minWidth: 0 }}>
                        <dt className="sr-only">{m.label}</dt>
                        <dd style={{ margin: 0 }}>
                          <div className="metric-v">{m.value}</div>
                          <div className="metric-l" aria-hidden="true">
                            {m.label}
                          </div>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="tags" style={{ marginTop: 0 }}>
                    {p.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={120}>
                  <div className="showcase">
                    <Mock />
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
