import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Déconnexion en cours...");

  useEffect(() => {
    // Supprimer les données utilisateur
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    // Mettre à jour le message
    setMessage("✅ Déconnecté avec succès !");

    // Redirection après 2 secondes
    const timer = setTimeout(() => {
      navigate('/');
    }, 900);

    // Nettoyage du timer à la destruction du composant
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p>{message}</p>
    </div>
  );
}

export default Logout;
