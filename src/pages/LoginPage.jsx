import React from 'react';
import Login from '../components/Login';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div>
      <Login />
      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
    </div>
  );
}

export default LoginPage;
