"use client";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { site } from "@/content/site";
import { BUDGETS, NEEDS } from "@/content/schema";
import { buildBrief, buildWhatsAppUrl } from "@/lib/whatsapp";
import { toast } from "@/components/layout/Toast";
import { Magnetic } from "@/components/ui/Magnetic";
import { NEED_EVENT } from "./PlanCta";

/**
 * Contact form. There is no backend: the primary action is a wa.me link whose
 * text is rebuilt on every change. To switch to an API route later, replace
 * `onSend` (and the <a> with a <button type="submit">) in this one file.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const need = (e as CustomEvent<string>).detail;
      if ((NEEDS as readonly string[]).includes(need)) setNeeds((n) => (n.includes(need) ? n : [...n, need]));
    };
    window.addEventListener(NEED_EVENT, on);
    return () => window.removeEventListener(NEED_EVENT, on);
  }, []);

  const brief = useMemo(
    () => buildBrief({ brand: site.brand, name, email, needs, budget, message }),
    [name, email, needs, budget, message],
  );
  const href = buildWhatsAppUrl(site.whatsapp, brief);

  const validate = () => {
    if (!name.trim()) return nameRef.current;
    if (!message.trim()) return msgRef.current;
    return null;
  };

  const onSend = (e: MouseEvent<HTMLAnchorElement>) => {
    const missing = validate();
    if (missing) {
      e.preventDefault();
      toast("Add your name and a short message first");
      missing.focus();
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      toast("Brief copied to clipboard");
    } catch {
      toast("Copy not available here, please select the text manually");
    }
  };

  const toggleNeed = (n: string) => setNeeds((xs) => (xs.includes(n) ? xs.filter((x) => x !== n) : [...xs, n]));

  return (
    <form className="card" style={{ display: "grid", gap: 22 }} onSubmit={(e) => e.preventDefault()} noValidate aria-label="Project brief">
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="field">
          <label htmlFor="c-name">Name *</label>
          <input ref={nameRef} id="c-name" className="input" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" className="input" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
      </div>

      <fieldset className="field">
        <legend>I need</legend>
        <div className="flex flex-wrap gap-2" style={{ marginTop: 8 }}>
          {NEEDS.map((n) => (
            <label key={n} className="choice">
              <input type="checkbox" name="needs" value={n} checked={needs.includes(n)} onChange={() => toggleNeed(n)} />
              <span>{n}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>Budget</legend>
        <div className="flex flex-wrap gap-2" style={{ marginTop: 8 }}>
          {BUDGETS.map((b) => (
            <label key={b} className="choice">
              <input type="radio" name="budget" value={b} checked={budget === b} onChange={() => setBudget(b)} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="c-msg">Message *</label>
        <textarea ref={msgRef} id="c-msg" className="input" required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your project, goals and timeline." />
      </div>

      <div className="flex flex-wrap gap-3">
        <Magnetic>
          <a className="btn btn-primary" href={href} target="_blank" rel="noopener" onClick={onSend} data-testid="send">
            Send on WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </Magnetic>
        <button type="button" className="btn" onClick={onCopy}>
          Copy brief
        </button>
      </div>
    </form>
  );
}
