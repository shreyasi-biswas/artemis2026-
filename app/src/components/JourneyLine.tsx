import { balanceAfter, monthsToGoalFrom } from '../data/projection';

interface Props {
  startBalance: number;
  monthly: number;
  goal: number;
  goalLabel: string;
  startAge: number;
  rates: { low: number; mid: number; high: number };
}

export default function JourneyLine({
  startBalance,
  monthly,
  goal,
  goalLabel,
  startAge,
  rates,
}: Props) {
  const leftMid = monthsToGoalFrom(startBalance, monthly, rates.mid, goal);
  const years = Math.min(40, Math.max(4, Math.ceil(leftMid / 12) + 1));
  const cap = goal * 1.1;

  const X = (i: number) => 10 + (i / years) * 300;
  const Y = (b: number) => 130 - (Math.min(b, cap) / cap) * 120;

  // Balance at the end of each year, starting from today's balance
  const series = (annual: number) =>
    Array.from({ length: years + 1 }, (_, y) =>
      balanceAfter(monthly, annual, y * 12, startBalance),
    );

  const mid = series(rates.mid).map((b, i) => `${X(i)},${Y(b)}`).join(' ');
  const hiPts = series(rates.high).map((b, i) => `${X(i)},${Y(b)}`);
  const loPts = series(rates.low).map((b, i) => `${X(i)},${Y(b)}`).reverse();
  const band = [...hiPts, ...loPts].join(' ');

  const goalY = Y(goal);
  const exX = X(Math.min(years, leftMid / 12));
  const endAge = startAge + Math.ceil(leftMid / 12);

  return (
    <svg viewBox="0 0 320 150" role="img" aria-label="Your journey line">
      <polygon points={band} fill="rgba(15,42,122,.16)" />
      <line x1={10} x2={310} y1={goalY} y2={goalY} stroke="#0a1d58" strokeDasharray="5 5" />
      <polyline
        points={mid}
        fill="none"
        stroke="#0f2a7a"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={exX} cy={goalY} r={5} fill="#0f2a7a" />
      <text x={12} y={146} fontSize={11} fill="#50648c">
        Today, age {startAge}
      </text>
      <text
        x={Math.min(exX, 270)}
        y={goalY - 8}
        fontSize={11}
        textAnchor="middle"
        fill="#0a1d58"
      >
        {goalLabel}
      </text>
      <text x={308} y={146} fontSize={11} textAnchor="end" fill="#50648c">
        Age {endAge}
      </text>
    </svg>
  );
}