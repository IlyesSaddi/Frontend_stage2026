import React, { useState } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState(null); // can store JSX

  const navigate = useNavigate();

  const switchmodehandeler = () => {
    setIsLogin(prevState => !prevState);
    setMessage(null);
  };

  // Function to resend confirmation email
  const resendConfirmation = () => {
  const reqbody = {
    query: `
      mutation ResendConfirmation($email: String!) {
        resendConfirmationEmail(email: $email) {
          message
        }
      }
    `,
    variables: { email }
  };

  fetch('http://localhost:8000/graphql', {
    method: 'POST',
    body: JSON.stringify(reqbody),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(resData => {
      if (resData.errors && resData.errors.length > 0) {
        setMessage(
          <p className="error-message">Erreur : {resData.errors[0].message}</p>
        );
        return;
      }
      setMessage(
        <p className="success-message">
          {resData.data.resendConfirmationEmail.message}
        </p>
      );
    })
    .catch(err =>
      setMessage(<p className="error-message">Erreur réseau : {err.message}</p>)
    );
};

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

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqbody),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.errors && resData.errors.length > 0) {
          const errorMsg = resData.errors[0].message;

          // If login failed because account is not confirmed, show resend button
          if (errorMsg.includes("confirmer votre compte")) {
            setMessage(
              <p className="error-message">
                {errorMsg}{' '}
                <button type="button" onClick={resendConfirmation}>
                  Renvoyer email
                </button>
              </p>
            );
          } else {
            setMessage(<p className="error-message">Erreur : {errorMsg}</p>);
          }
          return;
        }

        if (isLogin) {
          const { token, userId, tokenExpiration, role } = resData.data.login;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('tokenExpiration', tokenExpiration.toString());
          localStorage.setItem('role', role);
          localStorage.setItem('email', email);

          navigate('/');
        } else {
          setMessage(
            <p className="success-message">
              ✅ Compte créé avec succès ! Vérifiez votre boîte mail pour confirmer votre compte !
            </p>
          );
        }
      })
      .catch(err => {
        setMessage(<p className="error-message">Erreur réseau : {err.message}</p>);
      });
  };

  return (
    <div className="login-container">
      {message && message}
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
          <button type="submit" className="login-btn">
            {isLogin ? 'Log in' : 'Sign up'}
          </button>
          <button type="button" className="signup-btn" onClick={switchmodehandeler}>
            {isLogin ? 'Switch to Sign up' : 'Switch to Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
