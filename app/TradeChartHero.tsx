"use client";

type BgCandle = { x: number; up: boolean; top: number; bottom: number; wickTop: number; wickBot: number; delay: string };

const BG_CANDLES: BgCandle[] = [
  { x: 30,  up: true,  top: 190, bottom: 215, wickTop: 180, wickBot: 225, delay: "0s" },
  { x: 94,  up: false, top: 175, bottom: 205, wickTop: 165, wickBot: 215, delay: "0.3s" },
  { x: 158, up: true,  top: 150, bottom: 190, wickTop: 140, wickBot: 200, delay: "0.6s" },
  { x: 222, up: false, top: 160, bottom: 200, wickTop: 150, wickBot: 210, delay: "0.9s" },
  { x: 286, up: true,  top: 130, bottom: 170, wickTop: 120, wickBot: 180, delay: "1.2s" },
  { x: 414, up: false, top: 140, bottom: 175, wickTop: 130, wickBot: 185, delay: "1.5s" },
  { x: 478, up: true,  top: 120, bottom: 150, wickTop: 110, wickBot: 160, delay: "1.8s" },
  { x: 542, up: false, top: 130, bottom: 165, wickTop: 120, wickBot: 175, delay: "2.1s" },
  { x: 606, up: true,  top: 100, bottom: 135, wickTop: 90,  wickBot: 145, delay: "2.4s" },
  { x: 670, up: false, top: 115, bottom: 150, wickTop: 105, wickBot: 160, delay: "2.7s" },
];

const HERO_X = 350;
const BASELINE = 220;
const TOP_Y = 90;

export default function TradeChartHero() {
  return (
    <div className="tch-wrap">
      <svg viewBox="0 0 700 300" width="100%" role="img" aria-label="Ilustrasi candlestick trading: sinyal BUY di dasar candle dan SELL di puncak candle">
        <defs>
          <filter id="tchGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tchGlowSoft" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {BG_CANDLES.map((c, i) => {
          const color = c.up ? "#00FF88" : "#FF4757";
          return (
            <g key={i} className="tch-bg-candle" style={{ animationDelay: c.delay }}>
              <line x1={c.x} y1={c.wickTop} x2={c.x} y2={c.wickBot} stroke={color} strokeOpacity={0.35} strokeWidth={3} />
              <rect x={c.x - 11} y={c.top} width={22} height={c.bottom - c.top} rx={3} fill={color} fillOpacity={0.35} />
            </g>
          );
        })}

        <line x1={HERO_X} y1={45} x2={HERO_X} y2={255} stroke="#00FF88" strokeOpacity={0.18} strokeWidth={3} />

        <g className="tch-hero-grow">
          <rect
            className="tch-glow-rect"
            x={HERO_X - 17}
            y={TOP_Y}
            width={34}
            height={BASELINE - TOP_Y}
            rx={10}
            fill="#00FF88"
            filter="url(#tchGlowSoft)"
          />
          <rect
            x={HERO_X - 17}
            y={TOP_Y}
            width={34}
            height={BASELINE - TOP_Y}
            rx={10}
            fill="#00FF88"
            stroke="#d9ffe9"
            strokeWidth={2}
            filter="url(#tchGlow)"
          />
        </g>

        <circle className="tch-streak" cx={HERO_X} cy={BASELINE} r={5} fill="#ffffff" />

        <g className="tch-buy">
          <polygon points={`${HERO_X},234 ${HERO_X - 9},252 ${HERO_X + 9},252`} fill="#00FF88" />
          <text x={HERO_X} y={280} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={26} fill="#00FF88">
            BUY
          </text>
        </g>

        <g className="tch-sell">
          <polygon points={`${HERO_X},76 ${HERO_X - 9},58 ${HERO_X + 9},58`} fill="#FF4757" />
          <text x={HERO_X} y={46} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={26} fill="#FF4757">
            SELL
          </text>
        </g>
      </svg>
    </div>
  );
}
