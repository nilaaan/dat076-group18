import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeamView from './views/TeamView.tsx';
import PlayerView from './views/PlayerView.tsx';
import './App.css'
import { CircleUser } from 'lucide-react';

function App() {
  return (
    <Router>
      <nav className="flex h-16 w-full bg-white text-black text-3xl justify-between items-center px-4 font-bold border-b-2 border-blue-500">
        <div className="space-x-4">
          <Link to="/team" className="hover:text-blue-500">Team</Link>
          <Link to="/player" className="hover:text-blue-500">Player</Link>
        </div>
        <h1>Fantasy League</h1>
        <Link to="/login"><CircleUser className="hover:text-blue-500" size={40}/></Link>
      </nav>

      <Routes>
        <Route path="/team" element={<TeamView />}></Route>
        <Route path="/player" element={<PlayerView />}></Route>
      </Routes>
    </Router>
  )
}

export default App
