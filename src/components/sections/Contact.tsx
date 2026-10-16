import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="wrap contact">
        <Reveal>
          <span className="eyebrow">Contact</span>
          <h2 id="contact-title" className="talk metal">
            Let&apos;s <em>talk.</em>
          </h2>
          <div className="contact-line">
            <span className="mono" style={{ color: "var(--dim)" }}>Email</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div className="contact-line">
            <span className="mono" style={{ color: "var(--dim)" }}>WhatsApp</span>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">
              {site.whatsappLabel}
            </a>
          </div>
          <div className="contact-line">
            <span className="mono" style={{ color: "var(--dim)" }}>Response time</span>
            <span>Within 24 hours</span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
