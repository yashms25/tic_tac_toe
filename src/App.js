import "./App.css";
import Homepage from "./screen/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registerpage from "./screen/Registerpage";
import Loginpage from "./screen/Loginpage";
import Gamepage from "./screen/Gamepage";
import NewGame from "./screen/NewGame";
import Game from "./screen/Game";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/gamepage" element={<Gamepage />} />
          <Route path="/newgame" element={<NewGame />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
