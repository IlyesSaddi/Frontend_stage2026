import React, { useState} from 'react';
import '../styles/login.css'
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLogin, setIsLogin] = useState(true);
  
  const navigate = useNavigate();  // <-- Initialiser navigate ici

  const [message, setMessage] = useState('');

  const switchmodehandeler = () => {
      setIsLogin(prevState => !prevState)
  }


  const connect = (e) => {
  e.preventDefault();

  let reqbody;

  if (isLogin) {
    reqbody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
            role
          }
        }
      `,
      variables: { email, password }
    };
  } else {
    reqbody = {
      query: `
        mutation CreateUser($email: String!, $password: String!, $role: String!) {
          createUser(userInput: {email: $email, password: $password, role: $role}) {
            _id
            email
          }
        }
      `,
      variables: { email, password, role: "client" }
    };
  }

  fetch('http://localhost:8000/graphql/', {
    method: 'POST',
    body: JSON.stringify(reqbody),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => {
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Failed request');
    }
    return res.json();
  })
  .then(resData => {
    if (resData.errors && resData.errors.length > 0) {
      setMessage("Erreur : " + resData.errors[0].message);
      return;
    }

    if (isLogin) {
      const { token, userId, tokenExpiration, role } = resData.data.login;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('tokenExpiration', tokenExpiration.toString());
      localStorage.setItem('role', role);

      navigate('/')
    } else {
      setMessage("✅ Compte créé avec succès !");
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  })
  .catch(err => {
    setMessage("Erreur réseau : " + err.message);
  });
};

  
  return (
    <div>
    {message && <p className="success-message">{message}</p>}
    <form onSubmit={connect}>
      <p>Email:</p>
      <input
        type="text"
        placeholder="Entrer email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p>Password:</p>
      <input
        type="password"
        placeholder="Entrer mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="button-group">
      <button type="submit" className="login-btn">{isLogin ? 'Log in' : 'Sign up'}</button>
       <button type="button" className="signup-btn" onClick={switchmodehandeler}>
            {isLogin ? 'Switch to Sign up' : 'Switch to Login'}
       </button>
      </div>
    </form>
    </div>
  );
}

export default Login;
