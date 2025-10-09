import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Path_player from './pages/Path_player/Path_player.tsx';
import Leaderboard from './pages/Leaderboard/Leaderboard.tsx';
import Perfil from './pages/Perfil/Perfil.tsx';
import Statistics from './pages/Statistics/Statistics.tsx';
import Store from './pages/Store/Store.tsx'; 
import Index from './pages/Index/Index.tsx';
import Login from './pages/Login/login.tsx';
import Signup from './pages/Signup/Signup.tsx';
import "./Global.css"


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Index />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/path" element={<Path_player />} />
        <Route path='/profile' element={<Perfil/>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/store" element={<Store />} /> 
        <Route path="/more" element={<Statistics />} />
        
      </Routes>
    </Router>
  );
}

export default App;
