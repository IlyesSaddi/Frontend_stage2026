import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';

const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      message
    }
  }
`;

export default function ResetPasswordForm() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: data => setMessage(data.resetPassword.message),
    onError: error => setMessage(error.message)
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!newPassword) return setMessage('Please enter a new password');
    resetPassword({ variables: { token, newPassword } });
  };

  if (!token) return <p>Token is missing in the URL</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Choose New Password</h2>
      {message && <p>{message}</p>}
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}
