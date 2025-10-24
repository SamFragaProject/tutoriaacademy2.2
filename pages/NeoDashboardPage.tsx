import React, { useEffect } from 'react';
import '../styles/neo-glass.css';
import { Sidebar } from '../components/neo/Sidebar';
import { Topbar } from '../components/neo/Topbar';
import { ChipsRow } from '../components/neo/Chips';
import { AccountCard } from '../components/neo/AccountCard';
import { BalanceCard } from '../components/neo/BalanceCard';
import { CreditCard } from '../components/neo/CreditCard';

export const NeoDashboardPage: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('neo-glass');
    return () => { document.body.classList.remove('neo-glass'); };
  }, []);

  return (
    <div className="neo-bg">
      <div className="neo-shell" style={{padding:'18px'}}>
        <Sidebar />
        <main className="neo-main">
          <Topbar />
          <ChipsRow />

          <section className="neo-grid">
            <div className="col-span-8">
              <AccountCard />
            </div>
            <div className="col-span-4" style={{display:'flex', flexDirection:'column', gap:24}}>
              <BalanceCard />
              <CreditCard />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default NeoDashboardPage;
