import { useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  COMPANIES,
  DIST_COLORS,
  DIST_NAMES,
  RET,
  buildSeries,
  type Point,
} from '../data/investMock';

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const f2 = (n: number) =>
  '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sgn = (n: number) => (n < 0 ? '−' : '+') + inr(Math.abs(n));
const fk = (v: number) =>
  (v < 0 ? '−' : '') +
  '₹' +
  (Math.abs(v) >= 1000 ? (Math.abs(v) / 1000).toFixed(1) + 'k' : String(Math.round(Math.abs(v))));

function Badge({ pct }: { pct: number }) {
  return (
    <span className={'badge' + (pct < 0 ? ' neg' : '')}>
      {(pct < 0 ? '▼ ' : '▲ ') + Math.abs(pct).toFixed(2)}
    </span>
  );
}

// Catmull-Rom to Bezier, same curve as the original
function smooth(p: [number, number][]) {
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] || c;
    d += ` C${b[0] + (c[0] - a[0]) / 6},${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6},${c[1] - (e[1] - b[1]) / 6} ${c[0]},${c[1]}`;
  }
  return d;
}

const W = 640;
const H = 330;
const L = 64;
const RR = 14;
const T = 16;
const B = 32;

function ProfitChart({ series }: { series: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const n = series.length;
  const mx = Math.max(0, ...series.map((x) => x.p)) * 1.15 || 1;
  const mn = Math.min(0, ...series.map((x) => x.p)) * 1.3;
  const X = (i: number) => L + (i / (n - 1)) * (W - L - RR);
  const Y = (p: number) => T + ((mx - p) / (mx - mn)) * (H - T - B);
  const z = Y(0);
  const pts = series.map((x, i) => [X(i), Y(x.p)] as [number, number]);
  const line = smooth(pts);
  const area = `M${X(0)},${z} L${pts[0][0]},${pts[0][1]}${line.slice(line.indexOf(' C'))} L${X(n - 1)},${z}Z`;
  const step = Math.ceil(n / 6);
  const active = Math.min(hover ?? n - 1, n - 1);
  const pt = series[active];
  const yTicks = Array.from({ length: 5 }, (_, k) => mn + ((mx - mn) * k) / 4);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((x - L) / (W - L - RR)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <div className="plbox" onPointerMove={onMove} onPointerDown={onMove}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Profit and loss over time">
        <defs>
          <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f5bea" stopOpacity=".5" />
            <stop offset="1" stopColor="#2f5bea" stopOpacity=".05" />
          </linearGradient>
          <clipPath id="ca">
            <rect x="0" y="0" width={W} height={z} />
          </clipPath>
          <clipPath id="cb">
            <rect x="0" y={z} width={W} height={H} />
          </clipPath>
        </defs>

        {yTicks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - RR} y1={Y(v)} y2={Y(v)} stroke="#d9e3f7" />
            <text x={L - 8} y={Y(v) + 4} fontSize={11} textAnchor="end" fill="#50648c">
              {fk(v)}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#gp)" clipPath="url(#ca)" />
        <path d={area} fill="rgba(47,91,234,.22)" clipPath="url(#cb)" />
        <line x1={L} x2={W - RR} y1={z} y2={z} stroke="#0a1d58" strokeDasharray="5 4" />
        <text x={L + 6} y={z - 6} fontSize={11} fill="#0a1d58">Profit</text>
        {mn < 0 && (
          <text x={L + 6} y={z + 14} fontSize={11} fill="#0a1d58">Loss</text>
        )}

        <path
          d={line}
          fill="none"
          stroke="#1e40af"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {series.map((x, i) =>
          i % step === 0 ? (
            <text key={i} x={X(i)} y={H - 8} fontSize={11} textAnchor="middle" fill="#50648c">
              {x.label.slice(0, 3)} {x.label.slice(-2)}
            </text>
          ) : null,
        )}

        <line x1={X(active)} x2={X(active)} y1={T} y2={H - B} stroke="#1e40af" strokeOpacity=".4" />
        <circle cx={X(active)} cy={Y(pt.p)} r={5.5} fill="#1e40af" stroke="#fff" strokeWidth={2} />
      </svg>

      <div
        className="tip"
        style={{ left: `${(X(active) / W) * 100}%`, top: `${(Y(pt.p) / H) * 100}%` }}
      >
        <b>{sgn(pt.p)}</b>
        {pt.p >= 0 ? 'Profit' : 'Loss'} · {pt.label}
      </div>
    </div>
  );
}

function ProfitPie({ total }: { total: number }) {
  const [active, setActive] = useState<number | null>(null);

  const P = (r: number, t: number) => [110 + r * Math.cos(t), 110 + r * Math.sin(t)];
  const arcs: { d: string; color: string; dx: number; dy: number }[] = [];
  if (total > 0) {
    let a = -Math.PI / 2;
    for (const c of COMPANIES) {
      const a1 = a + c.share * 2 * Math.PI;
      const m = (a + a1) / 2;
      const big = c.share > 0.5 ? 1 : 0;
      const p0 = P(100, a);
      const p1 = P(100, a1 - 0.012);
      const q1 = P(62, a1 - 0.012);
      const q0 = P(62, a);
      arcs.push({
        d: `M${p0} A100,100 0 ${big} 1 ${p1} L${q1} A62,62 0 ${big} 0 ${q0} Z`,
        color: c.color,
        dx: Math.cos(m) * 9,
        dy: Math.sin(m) * 9,
      });
      a = a1;
    }
  }

  const cur = active !== null ? COMPANIES[active] : null;
  const mainText = cur ? inr(total * cur.share) : total > 0 ? inr(total) : '—';
  const subText = cur
    ? `${cur.name.split(' (')[0]} · ${Math.round(cur.share * 100)}%`
    : 'Total profit';

  return (
    <div className="pie">
      <svg
        viewBox="0 0 220 220"
        role="img"
        aria-label="Profit by company"
        onPointerOver={(e) => {
          const el = (e.target as Element).closest('path[data-k]');
          if (el) setActive(Number(el.getAttribute('data-k')));
        }}
        onPointerLeave={() => setActive(null)}
      >
        {arcs.map((ar, i) => (
          <path
            key={i}
            d={ar.d}
            fill={ar.color}
            data-k={i}
            style={
              {
                '--dx': `${ar.dx.toFixed(1)}px`,
                '--dy': `${ar.dy.toFixed(1)}px`,
              } as CSSProperties
            }
          />
        ))}
        <text x="110" y="108" textAnchor="middle" fontSize={19} fontWeight={600} fill="#0a1633">
          {mainText}
        </text>
        <text x="110" y="128" textAnchor="middle" fontSize={11} fill="#50648c">
          {subText}
        </text>
      </svg>
    </div>
  );
}

interface Props {
  monthly: number;
  weights: number[];
}

export default function InvestmentScreen({ monthly, weights }: Props) {
  const [range, setRange] = useState(24);
  const all = useMemo(() => buildSeries(monthly), [monthly]);
  const s = all.slice(-range);
  const last = all[all.length - 1];
  const prev = all[all.length - 13];
  const tp = Math.max(last.p, 0);
  const dv = last.v - prev.v;
  const dp = last.p - prev.p;
  const order = [0, 1, 2, 3].sort((a, b) => weights[b] - weights[a]);

  return (
    <div className="fin">
      <div className="heading">
        <h1>Investment</h1>
        <p>Your money, your profit and your losses, in one place.</p>
      </div>

      {/* Top gainers */}
      <section className="panel gainers">
        <span className="gl">Top gainers:</span>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          {COMPANIES.slice(0, 5).map((c) => (
            <div className="g" key={c.code}>
              <span className="av" style={{ background: c.color }}>{c.code.slice(0, 2)}</span>
              <span>
                <b>{c.name}</b>
                <br />
                <span className="muted">
                  {inr(tp * c.share)} <span className="up">▲ {c.pct}%</span>
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <div className="stats">
        <section className="panel">
          <h2>Total Portfolio</h2>
          <div className="bignum">{f2(last.v)}</div>
          <Badge pct={(last.p / last.inv) * 100} />
          <p className="muted" style={{ marginTop: 8 }}>
            {dv < 0 ? '− ' : '+ '}
            {f2(dv)} from last year
          </p>
        </section>
        <section className="panel">
          <h2>Total Profit Made</h2>
          <div className="bignum">
            {last.p < 0 ? '−' : ''}
            {f2(last.p)}
          </div>
          <Badge pct={RET[RET.length - 1] * 100} />
          <p className="muted" style={{ marginTop: 8 }}>
            {dp < 0 ? '− ' : '+ '}
            {f2(dp)} from last year
          </p>
        </section>
      </div>

      {/* Chart and pie */}
      <div className="grid inv">
        <section className="panel">
          <div className="between" style={{ marginBottom: 12 }}>
            <h2>Profit and loss over time</h2>
            <div className="row">
              {[
                { r: 6, label: '6 months' },
                { r: 12, label: '1 year' },
                { r: 24, label: '2 years' },
              ].map((c) => (
                <button
                  key={c.r}
                  className="chip"
                  aria-pressed={range === c.r}
                  onClick={() => setRange(c.r)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <ProfitChart series={s} />
          <p className="muted">Hover or tap the graph to see the amount and date.</p>
        </section>

        <section className="panel">
          <h2>Profit by company</h2>
          <ProfitPie total={tp} />
          <div id="pieList">
            {COMPANIES.map((c) => (
              <div className="drow" key={c.code}>
                <span className="dot" style={{ background: c.color }} />
                <span>
                  {c.name}
                  <small>{Math.round(c.share * 100)}%</small>
                </span>
                <strong>{inr(tp * c.share)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Distribution */}
      <section className="panel">
        <h2>Portfolio distribution</h2>
        <div className="dbar">
          {order
            .filter((i) => weights[i] > 0)
            .map((i) => (
              <i
                key={i}
                title={DIST_NAMES[i]}
                style={{
                  flex: weights[i],
                  background: `repeating-linear-gradient(90deg, ${DIST_COLORS[i]} 0 3px, ${DIST_COLORS[i]}b3 3px 4px)`,
                }}
              />
            ))}
        </div>
        <div className="dlist">
          {order.map((i) => (
            <div className="drow" key={i}>
              <span className="dot" style={{ background: DIST_COLORS[i] }} />
              <span>
                {DIST_NAMES[i]}
                <small>{weights[i]}%</small>
              </span>
              <strong>{inr((last.v * weights[i]) / 100)}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}