import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeamView from './views/TeamView.tsx';
import PlayerView from './views/PlayerView.tsx';
import BuyView from './views/BuyView.tsx';
import SellView from './views/SellView.tsx';

import './App.css'

function App() {
  return (
    <Router>
      <nav className="">
        <Link to="/team" className="" style={{ marginRight: '10px' }}>Team</Link>
        <Link to="/player" className="" style={{ marginRight: '10px' }}>Player</Link>
        <Link to="/sell" className="" style={{ marginRight: '10px' }}>Sell</Link>
        <Link to="/buy" className="" style={{ marginRight: '10px' }}>Buy</Link>
      </nav>

      <Routes>
        <Route path="/team" element={<TeamView />}></Route>
        <Route path="/player" element={<PlayerView />}></Route>
        <Route path="/sell" element={<SellView />}></Route>
        <Route path="/buy" element={<BuyView />}></Route>
      </Routes>
    </Router>
  )
}

export default App
