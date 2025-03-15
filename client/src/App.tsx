import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import BuyView from './views/BuyView.tsx';
import LoginView from './views/LoginView.tsx';
import RegisterView from './views/RegisterView.tsx';
import { AppBar } from '@skeletonlabs/skeleton-react';
import FieldView from './views/FieldView.tsx';

import './App.css'
import { Github } from 'lucide-react';
import BalanceView from './components/LoginOrBalance.tsx';
import ThemeToggle from './components/ThemeToggle.tsx';
import ProtectedComponent from './components/ProtectedComponent.tsx';
import LoginOrBalance from './components/LoginOrBalance.tsx';
import { AuthProvider } from './components/AuthProvider.tsx';
import StartPageTest from './views/PlayerView.tsx';
import StartView from './views/StartPage.tsx';
import MatchesView from './views/MatchesView.tsx';

function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
      <Link
        to={to}
      >
        <div className={`flex items-center px-4 h-full pt-1 hover:text-primary-400-600 ${isActive ? 'border-primary-400-600 border-b-4 font-bold' : 'pb-1'}`}>
          {children}
        </div>
      </Link>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppBar classes="!p-0">
          <AppBar.Toolbar classes="flex justify-between h-16 md:h-auto">
            <AppBar.ToolbarLead>
              <Link to="/" className="py-4 pl-10 hidden md:block">
                <h1 className="h4 hover:text-primary-400-600 whitespace-nowrap">Fantasy League</h1>
              </Link>
            </AppBar.ToolbarLead>
            <AppBar.ToolbarCenter classes="!grow-0">
              <div className="flex gap-4 h-full">
                <NavLink to="/team">Team</NavLink>
                <NavLink to="/player">Player</NavLink>
                <NavLink to="/buy">Buy/Sell</NavLink>
                <NavLink to="/matches">Matches</NavLink>
              </div>
            </AppBar.ToolbarCenter>
            <AppBar.ToolbarTrail classes="flex items-center pl-20 pr-10">
              <LoginOrBalance></LoginOrBalance>
              <span className="vr border-l-2 border-surface-900-100 h-2/3"></span>
              <ThemeToggle />
              <Link to="https://github.com/nilaaan/dat076-group18" target="_blank" className="hover:text-primary-400-600">
                  <Github size={28} className="hover:text-primary-400-600" />
              </Link>
            </AppBar.ToolbarTrail>
          </AppBar.Toolbar>
        </AppBar>
        <main>
          <Routes>
            <Route path="/" element={<StartView />}></Route>
            <Route path="/team" element={<ProtectedComponent><FieldView /> </ProtectedComponent>}></Route>
            <Route path="/player" element={<StartPageTest />}></Route>
            <Route path="/balance" element={<ProtectedComponent> <BalanceView /> </ProtectedComponent>}></Route>
            <Route path="/buy" element={<ProtectedComponent> <BuyView /> </ProtectedComponent>}></Route>
            <Route path="/login" element={<LoginView />}></Route>
            <Route path="/register" element={<RegisterView />}></Route>
            <Route path="/matches" element={<ProtectedComponent> <MatchesView /> </ProtectedComponent>}></Route>
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  )
}

export default App