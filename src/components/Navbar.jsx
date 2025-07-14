import { Link } from 'react-router-dom';
import '../styles/nav.css';

function Navbar() {
  return (
    <nav>
      <h2>Device Speak</h2>
      <ul className="nav-links">
        <li><Link to="/">Characters</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
