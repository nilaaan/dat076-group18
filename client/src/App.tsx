import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeamView from './views/TeamView.tsx';
import PlayerView from './views/PlayerView.tsx';
import BuyView from './views/BuyView.tsx';
import SellView from './views/SellView.tsx';

import './App.css'
import { CircleUser } from 'lucide-react';
import BalanceView from './views/BalanceView.tsx';
import TempAuth from './views/TempAuth.tsx';

function App() {
  return (
    <Router>
      <nav className="flex h-16 w-full bg-white text-black text-xl justify-between items-center px-4 font-bold border-b-2 border-blue-500">
        <div className="flex space-x-4">
          <h1>Fantasy League</h1>
          <Link to="/team" className="hover:text-blue-500">Team</Link>
          <Link to="/player" className="hover:text-blue-500" style={{ marginRight: '10px' }}>Player</Link>
          <Link to="/balance" className="hover:text-blue-500" style={{ marginRight: '10px' }}>Balance</Link>
          <Link to= "/buy" className="hover:text-blue-500">Buy</Link>
          <Link to= "/sell" className="hover:text-blue-500">Sell</Link>
        </div>
        <Link to="/user"><CircleUser className="hover:text-blue-500" size={32} /></Link>
      </nav>

      <main className="px-4">
        <Routes>

            <Route path='/user' element={<TempAuth />}></Route>
            <Route path="/team" element={<TeamView />}></Route>
            <Route path="/player" element={<PlayerView />}></Route>
            <Route path="/balance" element={<BalanceView />}></Route>
            <Route path="/buy" element={<BuyView />}></Route>
            <Route path="/sell" element={<SellView />}></Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App
