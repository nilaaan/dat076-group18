import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeamView from './views/TeamView.tsx';
import PlayerView from './views/PlayerView.tsx';
import './App.css'

function App() {
  return (
    <Router>
      <nav className="">
        <Link to="/team" className="">Team</Link>
        <Link to="/player" className="">Player</Link>
      </nav>

      <Routes>
        <Route path="/team" element={<TeamView />}></Route>
        <Route path="/player" element={<PlayerView />}></Route>
      </Routes>
    </Router>
  )
}

export default App
