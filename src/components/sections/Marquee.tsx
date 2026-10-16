import { site } from "@/content/site";

export function Marquee() {
  const group = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {site.marquee.map((w, i) => (
        <span key={w} className="contents">
          <span className={`marquee-word ${i % 2 === 0 ? "outline" : ""}`}>{w}</span>
          <span className="marquee-star" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <section className="marquee" aria-label="What I build">
      <div className="marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}
