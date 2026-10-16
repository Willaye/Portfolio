import { site } from "@/content/site";
import type { Site } from "@/content/schema";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

type Visual = Site["services"][number]["visual"];

function ServiceVisual({ kind }: { kind: Visual }) {
  const common = { viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true as const };
  switch (kind) {
    case "browser":
      return (
        <svg {...common}>
          <rect x="6" y="10" width="52" height="44" rx="6" opacity=".5" />
          <path d="M6 20h52" opacity=".5" />
          <circle cx="12" cy="15" r="1.4" fill="var(--a1)" stroke="none" />
          <path className="anim-draw" d="M14 30h30" stroke="var(--a1)" strokeLinecap="round" strokeWidth="3" />
          <path className="anim-draw" style={{ animationDelay: ".3s" }} d="M14 38h36" strokeLinecap="round" strokeWidth="3" />
          <path className="anim-draw" style={{ animationDelay: ".6s" }} d="M14 46h22" strokeLinecap="round" strokeWidth="3" opacity=".6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <rect x="18" y="6" width="28" height="52" rx="6" opacity=".6" />
          <path d="M28 11h8" strokeLinecap="round" opacity=".6" />
          <circle className="anim-pulse" cx="32" cy="32" r="7" stroke="var(--a1)" />
          <circle cx="32" cy="32" r="2.5" fill="var(--a1)" stroke="none" />
        </svg>
      );
    case "curve":
      return (
        <svg {...common}>
          <path d="M10 50 L22 14 M54 14 L42 50" opacity=".35" strokeDasharray="2 3" />
          <path className="anim-draw" d="M10 50 C22 14, 42 50, 54 14" stroke="var(--a1)" strokeWidth="2.4" strokeLinecap="round" />
          <rect className="anim-pulse" x="19" y="11" width="6" height="6" fill="var(--panel)" />
          <rect className="anim-pulse" style={{ animationDelay: ".6s" }} x="39" y="47" width="6" height="6" fill="var(--panel)" />
        </svg>
      );
    case "nodes":
      return (
        <svg {...common}>
          <path d="M12 20 32 12 52 22M12 20 30 34 52 22M12 44 30 34 50 46M30 34 32 12" opacity=".4" />
          {[
            [12, 20], [32, 12], [52, 22], [30, 34], [12, 44], [50, 46],
          ].map(([cx, cy], i) => (
            <circle key={i} className="anim-pulse" style={{ animationDelay: `${i * 0.25}s` }} cx={cx} cy={cy} r="3.5" fill={i % 2 ? "var(--a1)" : "currentColor"} stroke="none" />
          ))}
        </svg>
      );
    case "bars":
      return (
        <svg {...common}>
          <path d="M8 56h48" opacity=".4" />
          {[10, 23, 36, 49].map((x, i) => (
            <rect key={x} className="anim-bar" style={{ animationDelay: `${i * 0.3}s` }} x={x} y={18 + (i % 2) * 10} width="8" height={38 - (i % 2) * 10} rx="2" fill={i === 2 ? "var(--a1)" : "currentColor"} stroke="none" opacity={i === 2 ? 1 : 0.7} />
          ))}
        </svg>
      );
    case "servers":
      return (
        <svg {...common}>
          {[10, 26, 42].map((y, i) => (
            <g key={y}>
              <rect x="8" y={y} width="48" height="12" rx="3" opacity=".6" />
              <path d={`M16 ${y + 6}h14`} opacity=".4" strokeLinecap="round" />
              <circle className="anim-blink" style={{ animationDelay: `${i * 0.35}s` }} cx="48" cy={y + 6} r="2" fill={i === 1 ? "var(--a1)" : "#3ddc84"} stroke="none" />
            </g>
          ))}
        </svg>
      );
  }
}

export function Services() {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Services</span>
          <h2 id="services-title" className="h2">
            Everything you need to <em>ship.</em>
          </h2>
        </Reveal>
        <div className="grid grid-3">
          {site.services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90}>
              <Card as="article" className="h-full">
                <div className="svc-visual">
                  <ServiceVisual kind={s.visual} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <div className="tags">
                  {s.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
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
