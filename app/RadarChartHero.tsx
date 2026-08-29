"use client";

type RadarPanel = {
  symbol: string;
  confidence: number;
  status: "WAIT SIGNAL" | "CONFIRMED" | "ENTRY DETECTED";
  color: string;
  dotAngle: number; // degrees
  dotRadius: number; // 0..1 of max radius
  sweepDuration: string;
  sweepDelay: string;
};

const PANELS: RadarPanel[] = [
  { symbol: "XAUUSD", confidence: 91.4, status: "WAIT SIGNAL",     color: "#FFC400", dotAngle: 40,  dotRadius: 0.55, sweepDuration: "4.5s", sweepDelay: "0s" },
  { symbol: "BTCUSD", confidence: 97.2, status: "CONFIRMED",       color: "#00FF88", dotAngle: 205, dotRadius: 0.72, sweepDuration: "4s",   sweepDelay: "0.6s" },
  { symbol: "ETHUSD", confidence: 88.6, status: "ENTRY DETECTED",  color: "#FF4757", dotAngle: 300, dotRadius: 0.4,  sweepDuration: "5s",   sweepDelay: "1.1s" },
];

const R = 90;
const CX = 100;
const CY = 100;

function toXY(angleDeg: number, radiusFrac: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + Math.cos(rad) * R * radiusFrac,
    y: CY + Math.sin(rad) * R * radiusFrac,
  };
}

function RadarPanelView({ p }: { p: RadarPanel }) {
  const dot = toXY(p.dotAngle, p.dotRadius);
  return (
    <div className="radar-card">
      <div className="radar-card-head">
        <span className="radar-symbol">{p.symbol}</span>
        <span className="radar-dot-live" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
      </div>

      <svg viewBox="0 0 200 200" width="100%">
        <defs>
          <radialGradient id={`radarFade-${p.symbol}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={p.color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`sweepGrad-${p.symbol}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={p.color} stopOpacity="0" />
            <stop offset="100%" stopColor={p.color} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* rings */}
        {[0.33, 0.66, 1].map((f) => (
          <circle key={f} cx={CX} cy={CY} r={R * f} fill="none" stroke={p.color} strokeOpacity={0.18} strokeWidth={1} />
        ))}
        {/* crosshair */}
        <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke={p.color} strokeOpacity={0.12} strokeWidth={1} />
        <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke={p.color} strokeOpacity={0.12} strokeWidth={1} />

        {/* sweep wedge */}
        <g
          className="radar-sweep"
          style={{ animationDuration: p.sweepDuration, animationDelay: p.sweepDelay, transformOrigin: `${CX}px ${CY}px` }}
        >
          <path
            d={`M ${CX} ${CY} L ${CX + R} ${CY} A ${R} ${R} 0 0 1 ${CX + R * Math.cos(Math.PI / 4)} ${CY + R * Math.sin(Math.PI / 4)} Z`}
            fill={`url(#sweepGrad-${p.symbol})`}
          />
        </g>

        {/* ambient fade */}
        <circle cx={CX} cy={CY} r={R} fill={`url(#radarFade-${p.symbol})`} />

        {/* signal dot */}
        <circle className="radar-signal-dot" cx={dot.x} cy={dot.y} r={5} fill={p.color} style={{ animationDelay: p.sweepDelay }} />
      </svg>

      <div className="radar-card-foot">
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.58)", letterSpacing: "0.1em" }}>CONFIDENCE</div>
        <div className="radar-confidence" style={{ color: p.color }}>{p.confidence.toFixed(1)}%</div>
        <div className="radar-status-pill" style={{ borderColor: p.color, color: p.color }}>{p.status}</div>
      </div>
    </div>
  );
}

export default function RadarChartHero() {
  return (
    <div className="radar-hero-wrap">
      {PANELS.map((p) => (
        <RadarPanelView key={p.symbol} p={p} />
      ))}
    </div>
  );
}
