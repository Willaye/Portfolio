import { site } from "@/content/site";
import { LinkButton } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { AccentSwitcher, Clock } from "./NavClient";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#home" className="brand" aria-label={`${site.brand}, home`}>
          <span className="brand-mark" aria-hidden="true" />
          {site.brand}
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-right">
          <Clock />
          <AccentSwitcher />
          <Magnetic>
            <LinkButton href="#contact" variant="ink" size="sm">
              Start a project
            </LinkButton>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
