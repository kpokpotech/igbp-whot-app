import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Homepage from "./pages/Homepage";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;