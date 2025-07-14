import { Routes, Route } from 'react-router-dom';
import Character from './components/character.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Footer from './components/Footer.jsx';
import './styles/App.css'

function App() {
  return (
    <div className='app-container'>
      <Navbar />
      <div className="main-content">
      <Routes>
        <Route path="/" element={<Character />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
