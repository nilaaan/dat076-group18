import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeamView from './views/TeamView.tsx';
import PlayerView from './views/PlayerView.tsx';
import './App.css'
import { CircleUser } from 'lucide-react';

function App() {
  return (
    <Router>
      <nav className="flex h-16 w-full bg-white text-black text-xl justify-between items-center px-4 font-bold border-b-2 border-blue-500">
        <div className="flex space-x-4">
          <h1>Fantasy League</h1>
          <Link to="/team" className="hover:text-blue-500">Team</Link>
          <Link to="/player" className="hover:text-blue-500">Player</Link>
        </div>
        <Link to="/login"><CircleUser className="hover:text-blue-500" size={32} /></Link>
      </nav>

      <main className="px-4">
        <Routes>
            <Route path="/team" element={<TeamView />}></Route>
            <Route path="/player" element={<PlayerView />}></Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App
