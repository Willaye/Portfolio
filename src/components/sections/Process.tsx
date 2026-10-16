import { site } from "@/content/site";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  return (
    <section id="process" className="section" aria-labelledby="process-title">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Process</span>
          <h2 id="process-title" className="h2">
            From idea to <em>launch</em> in four steps.
          </h2>
        </Reveal>
        <ol className="grid grid-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {site.process.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 90}>
              <Card className="h-full">
                <div className="numeral" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="mono" style={{ color: "var(--dim)" }}>
                  {p.time}
                </span>
                <h3 style={{ marginTop: 8 }}>{p.title}</h3>
                <p>{p.text}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
