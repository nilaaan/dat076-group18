import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamView from './views/TeamView.tsx';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/team" element={<TeamView />}></Route>
      </Routes>
    </Router>
  )
}

export default App
