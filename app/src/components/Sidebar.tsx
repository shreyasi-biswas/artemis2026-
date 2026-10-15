export type View = 'home' | 'goal' | 'options' | 'plan' | 'invest' | 'rehearse';

const ITEMS: { id: View; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'goal', label: 'My Goal', icon: '◎' },
  { id: 'options', label: 'Explore Options', icon: '◉' },
  { id: 'plan', label: 'My Plan', icon: '▤' },
  { id: 'invest', label: 'Investment', icon: '₹' },
  { id: 'rehearse', label: 'Bad-Year Simulator', icon: '☂' },
];

interface Props {
  active: View;
  onNavigate: (v: View) => void;
}

export default function Sidebar({ active, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">The Honest Million</div>
      <nav className="nav-list" aria-label="Main">
        {ITEMS.map((it) => {
          const on = active === it.id;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={'nav-link' + (on ? ' active' : '')}
              aria-current={on ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(it.id);
              }}
            >
              <span className="nav-icon" aria-hidden="true">{it.icon}</span>
              <span>{it.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="profile">
        <div className="avatar">A</div>
        <div>
          <strong>Aarav</strong>
          <br />
          <span className="muted">Student, 19</span>
        </div>
      </div>
    </aside>
  );
}