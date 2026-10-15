import { useState } from 'react';
import Sidebar, { type View } from './components/Sidebar';
import HomeScreen from './screens/HomeScreen';
import InvestmentScreen from './screens/InvestmentScreen';

const WEIGHTS = [15, 25, 50, 10];
const MONTHLY = 2000;

export default function App() {
  const [view, setView] = useState<View>('home');

  return (
    <>
      <Sidebar active={view} onNavigate={setView} />
      <main className="main">
        {view === 'home' && (
          <div className="fin">
            <HomeScreen onOpenPlan={() => setView('plan')} />
          </div>
        )}
        {view === 'invest' && <InvestmentScreen monthly={MONTHLY} weights={WEIGHTS} />}
        {view !== 'home' && view !== 'invest' && (
          <div className="heading">
            <h1>Coming next</h1>
            <p>This screen is being built by another team member.</p>
          </div>
        )}
        <p className="muted" style={{ fontSize: 13, marginTop: 26 }}>
          Educational demo only. Returns are illustrative assumptions, not predictions or investment advice.
        </p>
      </main>
    </>
  );
}