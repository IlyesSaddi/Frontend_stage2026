import React, { useState } from 'react';
import '../styles/login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLogin, setIsLogin] = useState(true);
  


  const switchmodehandeler = () => {
      setIsLogin(prevState => !prevState)
  }


  const connect = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    let reqbody;

    if (!isLogin){
      reqbody = {
      query: `
        mutation {
        createUser(inputuser: {email:"${email}", password:"${password}"}){
            _id
            email
          }
        }
      `
    }
  } else {
      reqbody = {
  query: `
    query Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        userId
        token
        tokenExpiration
      }
    }
  `,
  variables: {
    email: email,
    password: password
  }
};

    }

    

  

  fetch('http://localhost:8000/graphql/', {
    method: 'POST',
    body: JSON.stringify(reqbody),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Failed request');
    }
    return res.json();  // très important ici
  })
  .then(resData => {
    console.log(resData);  // ici ça fonctionnera bien
  })
  .catch(err => {
    console.error(err);
  });
  }
  
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
      <button type="submit" className="login-btn">{isLogin ? 'Log in' : 'Sign up'}</button>
       <button type="button" className="signup-btn" onClick={switchmodehandeler}>
            {isLogin ? 'Switch to Sign up' : 'Switch to Login'}
       </button>
      </div>
    </form>
  );
}

export default Login;
