import { site } from "@/content/site";
import { CountUp } from "@/components/ui/CountUp";

export function Stats() {
  return (
    <section aria-label="Studio in numbers" className="relative z-[1]">
      <div className="wrap">
        <div className="stats">
          {site.stats.map((s) => (
            <div key={s.label} className="stat">
              <CountUp value={s.value} suffix={s.suffix} className="stat-v metal" />
              <div className="metric-l" style={{ marginTop: 14 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
