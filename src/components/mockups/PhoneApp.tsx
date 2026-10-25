const phoneShell: React.CSSProperties = {
  position: "relative",
  aspectRatio: "9 / 19",
  borderRadius: "clamp(18px, 3vw, 30px)",
  border: "1px solid var(--line2)",
  background: "#120828",
  padding: "5%",
  boxShadow: "0 40px 80px -30px rgba(0,0,0,.85)",
  overflow: "hidden",
};

/** Two phones: live route map with bottom sheet, and an active-orders list. */
export function PhoneApp() {
  return (
    <div className="device mk" aria-hidden="true" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5%" }}>
      <div style={{ ...phoneShell, width: "38%" }}>
        <div style={{ position: "absolute", top: "2.4%", left: "50%", transform: "translateX(-50%)", width: "32%", height: "2.6%", borderRadius: 99, background: "#000", zIndex: 2 }} />
        <div style={{ position: "relative", height: "100%", borderRadius: "clamp(12px,2vw,22px)", overflow: "hidden", background: "#12121a" }}>
          <svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {["M-5 40 L105 60", "M-5 110 L105 90", "M30 -5 L45 205", "M75 -5 L62 205", "M-5 160 L105 175"].map((d) => (
              <path key={d} d={d} stroke="rgba(255,255,255,.09)" strokeWidth="5" />
            ))}
            <path className="mk-route" d="M20 150 L40 120 L38 95 L65 85 L70 50" fill="none" stroke="var(--a1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="150" r="3.5" fill="#f4f1ec" />
            <circle className="mk-pulse" cx="70" cy="50" r="9" fill="var(--a1)" opacity=".3" />
            <circle cx="70" cy="50" r="4" fill="var(--a1)" />
          </svg>
          <div style={{ position: "absolute", left: "6%", right: "6%", bottom: "4%", borderRadius: 14, background: "rgba(14,14,20,.92)", border: "1px solid var(--line)", padding: "8%" }}>
            <div style={{ fontSize: "clamp(8px,1.1vw,13px)", fontWeight: 700 }}>Arriving in 6 min</div>
            <div style={{ fontSize: "clamp(6px,.8vw,10px)", color: "var(--dim)", margin: "3% 0 7%" }}>Order #4821 · 2.1 km</div>
            <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
              <div className="mk-progress" style={{ height: "100%", background: "var(--grad)" }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ ...phoneShell, width: "32%", transform: "translateY(10%)" }}>
        <div style={{ height: "100%", borderRadius: "clamp(10px,2vw,20px)", background: "#12121a", padding: "10% 8%", display: "grid", alignContent: "start", gap: "5%" }}>
          <div style={{ fontSize: "clamp(8px,1vw,12px)", fontWeight: 700, marginBottom: "4%" }}>Active orders</div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8%", padding: "6% 5%", borderRadius: 10, background: "rgba(255,255,255,.04)" }}>
              <div style={{ width: "22%", aspectRatio: "1", borderRadius: "50%", flex: "none", background: `linear-gradient(${i * 70}deg, var(--a2), var(--a1))` }} />
              <div style={{ flex: 1, display: "grid", gap: 4 }}>
                <div style={{ height: 4, width: `${60 + (i % 3) * 12}%`, borderRadius: 3, background: "rgba(255,255,255,.3)" }} />
                <div style={{ height: 3, width: "45%", borderRadius: 3, background: "rgba(255,255,255,.12)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
