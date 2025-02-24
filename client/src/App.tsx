import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TeamView from './views/TeamView.tsx';
import PlayerView from './views/PlayerView.tsx';
import BuyView from './views/BuyView.tsx';
import SellView from './views/SellView.tsx';
import { AppBar } from '@skeletonlabs/skeleton-react';

import './App.css'
import { CircleUser } from 'lucide-react';
import BalanceView from './views/BalanceView.tsx';

function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
      <Link
        to={to}
      >
        <div className={`flex items-center px-4 h-full pt-2 hover:text-primary-400-600 ${isActive ? 'border-primary-400-600 border-b-4' : 'pb-1'}`}>
          {children}
        </div>
      </Link>
  )
}

function App() {
  return (
    <Router>
      <AppBar classes="!p-0">
        <AppBar.Toolbar classes="flex justify-between">
          <AppBar.ToolbarLead>
            <Link to="/" className="py-4 pl-10">
              <h1 className="h4 hover:text-primary-400-600">Fantasy League</h1>
            </Link> 
          </AppBar.ToolbarLead>
          <AppBar.ToolbarCenter classes="!grow-0">
            <div className="flex gap-4 h-full">
              <NavLink to="/team">Team</NavLink>
              <NavLink to="/player">Player</NavLink>
              <NavLink to="/balance">Balance</NavLink>
              <NavLink to= "/buy">Buy</NavLink>
              <NavLink to= "/sell">Sell</NavLink>
            </div>
          </AppBar.ToolbarCenter>
          <AppBar.ToolbarTrail classes="flex items-center px-10">
            <Link to="/login">
              <CircleUser className="hover:text-primary-400-600" size={32} />
            </Link>
          </AppBar.ToolbarTrail>
        </AppBar.Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<div />}></Route>
        <Route path="/team" element={<TeamView />}></Route>
        <Route path="/player" element={<PlayerView />}></Route>
        <Route path="/balance" element={<BalanceView />}></Route>
        <Route path="/buy" element={<BuyView />}></Route>
        <Route path="/sell" element={<SellView />}></Route>
      </Routes>
    </Router>
  )
}

export default App
