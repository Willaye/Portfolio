/** Browser window storefront: URL pill, cart badge pop, banner, products, pressing CTA. */
export function StoreBrowser() {
  const products = [
    "linear-gradient(140deg,#3a2a24,#c9825b)",
    "linear-gradient(140deg,#1f2a33,#7aa3b8)",
    "linear-gradient(140deg,#2e2433,var(--a1))",
  ];
  return (
    <div className="device mk" aria-hidden="true" style={{ width: "94%" }}>
      <div style={{ borderRadius: 14, border: "1px solid var(--line2)", background: "#120828", overflow: "hidden", boxShadow: "0 40px 80px -30px rgba(0,0,0,.85)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2.2% 3%", borderBottom: "1px solid var(--line)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />
          ))}
          <div style={{ marginInline: "auto", padding: "3px 14px", borderRadius: 99, background: "rgba(255,255,255,.06)", fontFamily: "var(--font-mono)", fontSize: "clamp(7px,.8vw,10px)", color: "var(--dim)" }}>
            kilnandco.store
          </div>
        </div>
        <div style={{ padding: "3% 4% 4%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3%" }}>
            <div style={{ fontWeight: 800, fontSize: "clamp(9px,1.2vw,15px)", letterSpacing: "-.02em" }}>KILN &amp; CO</div>
            <div style={{ display: "flex", gap: "clamp(8px,1.4vw,18px)", alignItems: "center", fontSize: "clamp(7px,.85vw,11px)", color: "var(--dim)" }}>
              <span>Shop</span>
              <span>Journal</span>
              <span style={{ position: "relative", width: 16, height: 16, borderRadius: 4, border: "1.5px solid var(--ink)" }}>
                <span className="mk-pop" style={{ position: "absolute", top: -6, right: -7, width: 12, height: 12, borderRadius: "50%", background: "var(--a1)", color: "#0c0420", fontSize: 8, fontWeight: 700, display: "grid", placeItems: "center" }}>
                  2
                </span>
              </span>
            </div>
          </div>
          <div style={{ borderRadius: 10, padding: "4.5% 5%", background: "var(--grad)", color: "#0c0420", marginBottom: "3.5%" }}>
            <div style={{ fontWeight: 900, fontSize: "clamp(11px,1.8vw,24px)", lineHeight: 1, letterSpacing: "-.03em" }}>Autumn ceramics</div>
            <div style={{ fontSize: "clamp(7px,.85vw,11px)", marginTop: 4, opacity: 0.8 }}>Handmade. Shipped in 48h.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "3%" }}>
            {products.map((bg, i) => (
              <div key={i} style={{ borderRadius: 10, background: "rgba(255,255,255,.04)", padding: "6%", minWidth: 0 }}>
                <div style={{ aspectRatio: "1", borderRadius: 8, background: bg, marginBottom: "8%" }} />
                <div style={{ height: 4, width: "70%", borderRadius: 3, background: "rgba(255,255,255,.3)", marginBottom: 4 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "clamp(7px,.85vw,11px)", fontWeight: 700 }}>${[48, 36, 64][i]}</span>
                  {i === 1 && (
                    <span className="mk-press" style={{ fontSize: "clamp(5px,.65vw,9px)", padding: "3px 6px", borderRadius: 99, background: "var(--ink)", color: "#0c0420", fontWeight: 700, whiteSpace: "nowrap" }}>
                      Add to cart
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
