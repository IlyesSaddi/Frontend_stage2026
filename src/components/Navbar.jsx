import { Link } from 'react-router-dom';
import {useState,useEffect} from 'react';
import '../styles/nav.css';

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null); // <--- état pour le nom/email
  

  useEffect(() => {
    // Vérifie si un token existe au chargement du composant
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const name = localStorage.getItem('email');
    
    setIsLoggedIn(!!token);
    setRole(userRole);
    setEmail(name || '');
  }, []);

  //  met à jour si le token change (bonus)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
      setEmail(localStorage.getItem('email') || '');
    }, 500); // vérifie toutes les 0.5s

    return () => clearInterval(interval);
  }, []);
  
  return (
    <nav>
      <h2>Device Speak</h2>
      
      <ul className="nav-links">

        { isLoggedIn &&(
        <li><Link to="/">Devices</Link></li>
        )}
        
        <li><Link to="/downloadzone">Downloads</Link></li>
        {isLoggedIn && <li><Link to="/ai-tests">Tests IA</Link></li>}
        {isLoggedIn && role !== 'client' && (<>
           <li><Link to="/users">Users</Link></li>
           <li><Link to="/company">companies</Link></li>
           </>
        )}
        
        {isLoggedIn && <li>{email}</li>}
        {
          isLoggedIn ? (
            <li><Link to="/logout">Logout</Link></li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )
        }
      
      </ul>
    </nav>
  );
}

export default Navbar;
