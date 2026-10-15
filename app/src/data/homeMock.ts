// Illustrative assumptions. Keep these in sync with the "How we estimate" sheet.
export const homeMock = {
  name: 'Aarav',
  income: 8000,
  monthly: 2000,
  monthsIn: 24, // how far into the plan he is (2 years)
  goal: 1000000,
  goalLabel: '₹10 lakh',
  monthLabel: 'October',
  status: 'On track',
  weights: [15, 25, 50, 10],
  roles: [
    { label: 'Safety net', note: 'Always there, grows slowly', color: '#22a06b' },
    { label: 'Steady', note: 'Predictable, some locked in', color: '#a56bf0' },
    { label: 'Growth', note: 'Can drop hard in a bad year', color: '#2f4bff' },
    { label: 'Hedge (gold)', note: 'Moves on its own rhythm', color: '#f5b942' },
  ],
  rates: { low: 0.06, mid: 0.09, high: 0.12 },
};