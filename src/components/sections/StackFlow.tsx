import { site } from "@/content/site";

/** App → Backend → Database stack diagram, shared by the About section and the /cv page. */
export function StackFlow() {
  const { stack } = site.cv;
  return (
    <ol className="stack-flow" aria-label="Main tech stack">
      {stack.map((s, i) => (
        <li key={s.layer} className="stack-step">
          <div className="stack-box">
            <span className="stack-layer">{s.layer}</span>
            <strong className="stack-name">{s.name}</strong>
            <ul className="stack-items">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
          {i < stack.length - 1 && (
            <span className="stack-arrow" aria-hidden="true">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
