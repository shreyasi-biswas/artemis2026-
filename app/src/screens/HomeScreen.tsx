import JourneyLine from '../components/JourneyLine';
import { homeMock as H } from '../data/homeMock';
import { balanceAfter, monthsToGoalFrom, ym } from '../data/projection';

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

interface Props {
  onOpenPlan?: () => void;
}

export default function HomeScreen({ onOpenPlan }: Props) {
  const {
    name, income, monthly, monthsIn, goal, goalLabel, monthLabel,
    status, weights, roles, rates,
  } = H;

  // Where he is today
  const currentBalance = balanceAfter(monthly, rates.mid, monthsIn);
  const putIn = monthly * monthsIn;
  const growth = currentBalance - putIn;

  // Age today: assumes he was 19 when he started the plan
  const startAge = Math.floor(19 + monthsIn / 12);

  // How long is left, from today
  const leftMid = monthsToGoalFrom(currentBalance, monthly, rates.mid, goal);
  const leftFast = monthsToGoalFrom(currentBalance, monthly, rates.high, goal);
  const leftSlow = monthsToGoalFrom(currentBalance, monthly, rates.low, goal);
  const yearsLeft = Math.round(leftMid / 12);

  const milestones = [100000, 500000].map((t) => ({
    t,
    m: monthsToGoalFrom(currentBalance, monthly, rates.mid, t),
  }));

  const pct = (r: number) => Math.round(r * 100);

  return (
    <>
      <div className="heading">
        <h1>Hi {name},</h1>
        <p>Here is where your plan stands today.</p>
      </div>

      {/* Plan strip */}
      <section className="panel gainers">
        <span className="gl">Your plan:</span>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <div className="g">
            <span>
              <b>{goalLabel}</b>
              <br />
              <span className="muted">Goal balance</span>
            </span>
          </div>
          <div className="g">
            <span>
              <b>{inr(monthly)} / mo</b>
              <br />
              <span className="muted">You set aside</span>
            </span>
          </div>
          <div className="g">
            <span>
              <b>{inr(income - monthly)} / mo</b>
              <br />
              <span className="muted">You keep for yourself</span>
            </span>
          </div>
        </div>
      </section>

      {/* Balance row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18, marginBottom: 20 }}>
        <section className="panel">
          <span className="muted">Current balance</span>
          <div className="stat-num">{inr(currentBalance)}</div>
          <p className="muted">What your plan is worth today.</p>
        </section>
        <section className="panel">
          <span className="muted">You have put in</span>
          <div className="stat-num">{inr(putIn)}</div>
          <p className="muted">{monthsIn} months at {inr(monthly)} a month.</p>
        </section>
        <section className="panel">
          <span className="muted">Growth so far</span>
          <div className="stat-num" style={{ color: growth >= 0 ? '#1c8a4f' : 'var(--fall)' }}>
            {growth >= 0 ? '+ ' : '− '}
            {inr(Math.abs(growth))}
          </div>
          <p className="muted">Returns on your money, so far.</p>
        </section>
      </div>

      {/* Hero and this month */}
      <div className="stats">
        <section className="panel">
          <h2>{status}</h2>
          <div className="bignum">{yearsLeft} years to go</div>
          <span className="badge">
            Likely {Math.round(leftFast / 12)} to {Math.round(leftSlow / 12)} years
          </span>
          <p className="muted" style={{ marginTop: 8 }}>
            You started {Math.round(monthsIn / 12)} years ago. At {inr(monthly)} a month,
            you reach {goalLabel} in about {ym(leftMid)} from today.
          </p>
        </section>

        <section className="panel soft">
          <h2>This month</h2>
          <p style={{ marginTop: 12, fontSize: 18 }}>
            Your {inr(monthly)} for {monthLabel} is done.
          </p>
          <p className="muted" style={{ marginTop: 6 }}>
            Nothing else needs your attention.
          </p>
          <button type="button" className="button primary" style={{ marginTop: 16 }} onClick={onOpenPlan}>
            See my plan
          </button>
        </section>
      </div>

      {/* Journey and side column */}
      <div className="grid">
        <div className="col">
          <section className="panel">
            <h2>Your journey</h2>
            <p className="muted" style={{ margin: '6px 0 12px' }}>
              From today's balance to your goal, at a likely pace.
            </p>
            <JourneyLine
              startBalance={currentBalance}
              monthly={monthly}
              goal={goal}
              goalLabel={goalLabel}
              startAge={startAge}
              rates={rates}
            />
          </section>

          <section className="panel">
            <h2 style={{ marginBottom: 10 }}>How to read this chart</h2>
            <div className="fact">
              <span>Solid line</span>
              <strong>The likely path, at {pct(rates.mid)}% a year</strong>
            </div>
            <div className="fact">
              <span>Shaded band</span>
              <strong>The range, from {pct(rates.low)}% to {pct(rates.high)}%</strong>
            </div>
            <div className="fact">
              <span>Dashed line</span>
              <strong>Your {goalLabel} goal</strong>
            </div>
            <div className="fact">
              <span>Dot</span>
              <strong>When the likely path reaches it</strong>
            </div>
          </section>

          <section className="panel">
            <h2 style={{ marginBottom: 10 }}>Three possible timelines</h2>
            <div className="fact">
              <span>Slower ({pct(rates.low)}% a year)</span>
              <strong>{ym(leftSlow)}</strong>
            </div>
            <div className="fact">
              <span>Likely ({pct(rates.mid)}% a year)</span>
              <strong>{ym(leftMid)}</strong>
            </div>
            <div className="fact">
              <span>Faster ({pct(rates.high)}% a year)</span>
              <strong>{ym(leftFast)}</strong>
            </div>
            <p className="muted" style={{ marginTop: 12 }}>
              Illustrative only. Real returns change from year to year and can be negative.
            </p>
          </section>
        </div>

        <div className="col">
          <section className="panel">
            <h2 style={{ marginBottom: 8 }}>Your monthly split</h2>
            {roles.map((r, i) => (
              <div className="drow" key={r.label}>
                <span className="dot" style={{ background: r.color }} />
                <span>
                  {r.label}
                  <small>{r.note}</small>
                </span>
                <strong>{inr((monthly * weights[i]) / 100)}</strong>
              </div>
            ))}
          </section>

          <section className="panel">
            <h2 style={{ marginBottom: 12 }}>Milestones</h2>
            <div className="timeline">
              <div className="tl done">
                <span>Today</span>
                Balance {inr(currentBalance)}
              </div>
              {milestones.map((x) => (
                <div className="tl" key={x.t}>
                  <span>In about {ym(x.m)}</span>
                  {inr(x.t)}
                </div>
              ))}
              <div className="tl">
                <span>In about {ym(leftMid)}</span>
                {goalLabel} reached
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}