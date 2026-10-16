export interface Brief {
  brand: string;
  name: string;
  email: string;
  needs: string[];
  budget: string;
  message: string;
}

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** "a", "a and b", "a, b and c" */
export function joinList(items: string[]): string {
  const xs = items.map(clean).filter(Boolean);
  if (xs.length <= 1) return xs[0] ?? "";
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}

/** "Hi {brand}! I am {name} ({email}). I need {needs}. My budget is {budget}. {message}" */
export function buildBrief(b: Brief): string {
  const name = clean(b.name) || "a visitor";
  const email = clean(b.email);
  const needs = joinList(b.needs) || "help with a project";
  const budget = clean(b.budget) || "not decided yet";
  const intro = email ? `I am ${name} (${email}).` : `I am ${name}.`;
  return clean(`Hi ${clean(b.brand)}! ${intro} I need ${needs}. My budget is ${budget}. ${clean(b.message)}`);
}

export function buildWhatsAppUrl(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
