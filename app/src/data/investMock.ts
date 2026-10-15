export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Monthly returns for the last 24 months (illustrative)
export const RET = [
  0.02, -0.01, 0.03, 0.015, -0.04, 0.02, 0.01, -0.06, -0.07, -0.03, 0.02, 0.04,
  0.03, -0.02, 0.05, 0.02, -0.01, 0.03, 0.04, -0.03, 0.02, 0.035, 0.01, 0.025,
];

export const DIST_NAMES = ['Safety net', 'Steady', 'Growth', 'Gold'];
export const DIST_COLORS = ['#22a06b', '#a56bf0', '#2f4bff', '#ff8a65'];

// Replace these with your roles before the demo (see note above)
export const COMPANIES = [
  { name: 'Reliance', code: 'RELIANCE', color: '#2f4bff', share: 0.28, pct: 18.4 },
  { name: 'HDFC Bank', code: 'HDFCBANK', color: '#a56bf0', share: 0.22, pct: 14.1 },
  { name: 'Infosys', code: 'INFY', color: '#ff8a65', share: 0.17, pct: 12.7 },
  { name: 'TCS', code: 'TCS', color: '#22a06b', share: 0.14, pct: 9.8 },
  { name: 'ICICI Bank', code: 'ICICIBANK', color: '#f5b942', share: 0.12, pct: 11.2 },
  { name: 'Others (FD, gold, rest)', code: 'OTHERS', color: '#8aa0d6', share: 0.07, pct: 6.1 },
];

export interface Point {
  label: string;
  inv: number;
  v: number;
  p: number;
}

export function buildSeries(monthly: number): Point[] {
  let v = 0;
  let inv = 0;
  const now = new Date();
  const out: Point[] = [];
  RET.forEach((r, i) => {
    inv += monthly;
    v = (v + monthly) * (1 + r);
    const d = new Date(now.getFullYear(), now.getMonth() - (23 - i), 1);
    out.push({ label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, inv, v, p: v - inv });
  });
  return out;
}