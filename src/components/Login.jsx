import React, { useState } from 'react';
import '../styles/login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const connect = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
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
      <button type="submit" className="login-btn">Log in</button>
       <button type="button" className="signup-btn">Sign up</button>
      </div>
    </form>
  );
}

export default Login;
