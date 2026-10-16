/** Laptop with sidebar, 3 KPI tiles and a looping area chart (monitoring dashboard). */
export function LaptopDashboard() {
  const kpis = [
    { k: "Uptime", v: "99.98%", d: "+0.4%" },
    { k: "Events/min", v: "2.1M", d: "+12%" },
    { k: "Alerts", v: "3", d: "-61%" },
  ];
  return (
    <div className="device mk" aria-hidden="true" style={{ width: "92%" }}>
      <div className="mk-laptop-screen">
        <div style={{ display: "grid", gridTemplateColumns: "17% 1fr", gap: "3%", height: "100%" }}>
          <div style={{ borderRadius: 8, background: "rgba(255,255,255,.04)", padding: "12% 14%", display: "grid", alignContent: "start", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: "var(--grad)" }} />
            {[70, 90, 60, 80, 50].map((w, i) => (
              <div key={i} style={{ height: 5, width: `${w}%`, borderRadius: 3, background: i === 1 ? "var(--a1)" : "rgba(255,255,255,.14)" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateRows: "auto 1fr", gap: "5%", minWidth: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4%" }}>
              {kpis.map((x) => (
                <div key={x.k} style={{ borderRadius: 8, background: "rgba(255,255,255,.05)", padding: "8% 10%", minWidth: 0 }}>
                  <div style={{ fontSize: "clamp(6px,0.8vw,10px)", color: "var(--dim)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".08em" }}>{x.k}</div>
                  <div style={{ fontSize: "clamp(10px,1.5vw,20px)", fontWeight: 800, lineHeight: 1.2 }}>{x.v}</div>
                  <div style={{ fontSize: "clamp(6px,0.75vw,10px)", color: x.d.startsWith("-") && x.k !== "Alerts" ? "var(--a1)" : "#3ddc84" }}>{x.d}</div>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 8, background: "rgba(255,255,255,.035)", position: "relative", overflow: "hidden" }}>
              <svg viewBox="0 0 300 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--a1)" stopOpacity=".45" />
                    <stop offset="1" stopColor="var(--a1)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[30, 60, 90].map((y) => (
                  <path key={y} d={`M0 ${y}H300`} stroke="rgba(255,255,255,.06)" />
                ))}
                <path d="M0 95 C30 80 50 88 75 70 S120 40 150 55 S200 30 225 38 S270 15 300 22 V120 H0Z" fill="url(#area)" />
                <path className="mk-chart-line" d="M0 95 C30 80 50 88 75 70 S120 40 150 55 S200 30 225 38 S270 15 300 22" fill="none" stroke="var(--a1)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="mk-laptop-base" />
    </div>
  );
}
