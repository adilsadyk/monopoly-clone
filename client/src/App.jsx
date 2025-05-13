import React from 'react'; // ← ЭТО ОБЯЗАТЕЛЬНО
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rules from './pages/Rules';
import Game from './pages/Game';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/game/:roomId" element={<Game />} />
      </Routes>
    </Router>
  );
}
