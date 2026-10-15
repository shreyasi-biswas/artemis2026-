// Temporary: replace with the engine from feat/engine once merged.
const monthlyRate = (annual: number) => Math.pow(1 + annual, 1 / 12) - 1;

// Balance after a number of months, starting from `start`
export function balanceAfter(monthly: number, annual: number, months: number, start = 0): number {
  const mr = monthlyRate(annual);
  let balance = start;
  for (let m = 0; m < months; m++) balance = (balance + monthly) * (1 + mr);
  return balance;
}

// Months needed to reach `goal`, starting from `start`
export function monthsToGoalFrom(
  start: number,
  monthly: number,
  annual: number,
  goal: number,
): number {
  const mr = monthlyRate(annual);
  let balance = start;
  let m = 0;
  while (balance < goal && m < 480) {
    balance = (balance + monthly) * (1 + mr);
    m++;
  }
  return m;
}

// Months needed to reach `goal` from zero
export function monthsToGoal(monthly: number, annual: number, goal: number): number {
  return monthsToGoalFrom(0, monthly, annual, goal);
}

// Balance at the end of each year, for the journey line
export function balanceByYear(monthly: number, annual: number, years: number): number[] {
  const mr = monthlyRate(annual);
  let balance = 0;
  const out = [0];
  for (let m = 1; m <= years * 12; m++) {
    balance = (balance + monthly) * (1 + mr);
    if (m % 12 === 0) out.push(balance);
  }
  return out;
}

export function ym(m: number): string {
  const y = Math.floor(m / 12);
  const r = m % 12;
  return r ? `${y} yrs ${r} mo` : `${y} yrs`;
}