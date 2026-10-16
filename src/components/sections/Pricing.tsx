import { site } from "@/content/site";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { PlanCta } from "./PlanCta";

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Pricing() {
  return (
    <section id="pricing" className="section" aria-labelledby="pricing-title">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Pricing · sample packages</span>
          <h2 id="pricing-title" className="h2">
            Clear prices, <em>no surprises.</em>
          </h2>
        </Reveal>
        <div className="grid grid-3">
          {site.plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <Card as="article" className={`plan h-full ${p.popular ? "popular" : ""}`} aria-labelledby={`plan-${p.name}`}>
                {p.popular && <span className="pill">Popular</span>}
                <h3 id={`plan-${p.name}`} style={{ margin: 0 }}>
                  {p.name}
                </h3>
                <div>
                  <div className="price">{p.price}</div>
                  <div className="metric-l">{p.note}</div>
                </div>
                <ul className="features">
                  {p.features.map((f) => (
                    <li key={f}>
                      <Check />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <PlanCta need={p.need} primary={p.popular}>
                  {p.price === "Custom" ? "Get a quote" : `Start with ${p.name}`}
                </PlanCta>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
