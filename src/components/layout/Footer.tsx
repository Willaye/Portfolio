import { site } from "@/content/site";
import { FitWordmark } from "@/components/hero/MetalWordmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-mark">
          <FitWordmark text={site.brand} />
        </div>
        <div className="footer-line mono">
          <span>
            © {new Date().getFullYear()} {site.brand}
          </span>
          <span>Designed and built with care</span>
          <nav aria-label="Social" className="flex gap-5">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)]">
                {s.label}
              </a>
            ))}
          </nav>
          <span>Sample content, replace with yours</span>
        </div>
      </div>
    </footer>
  );
}
