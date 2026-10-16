import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="section-head" style={{ alignItems: "center", textAlign: "center" }}>
          <span className="eyebrow">FAQ</span>
          <h2 id="faq-title" className="h2">
            Good <em>questions.</em>
          </h2>
        </Reveal>
        <div className="faq">
          {site.faq.map((f) => (
            <Reveal key={f.q}>
              <details>
                <summary>
                  {f.q}
                  <span className="plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="answer">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
