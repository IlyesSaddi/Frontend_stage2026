import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      message
    }
  }
`;

export default function RequestPasswordResetForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: data => setMessage(data.requestPasswordReset.message),
    onError: error => setMessage(error.message)
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!email) return setMessage('Please enter your email');
    requestReset({ variables: { email } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send reset email'}
      </button>
    </form>
  );
}
