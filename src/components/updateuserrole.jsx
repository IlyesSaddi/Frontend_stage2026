import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import '../styles/updateuserrole.css'
const GET_USERS = gql`
  query {
    users {
      _id
      email
      role
    }
  }
`;

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $newRole: String!) {
    updateUserRole(userId: $userId, newRole: $newRole) {
      _id
      role
    }
  }
`;

function UpdateUserRole() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE);

  const [selectedUser, setSelectedUser] = useState('');
  const [newRole, setNewRole] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      await updateUserRole({ variables: { userId: selectedUser, newRole } });
      setMessage('✅ Rôle mis à jour avec succès !');
    } catch (err) {
      setMessage('❌ Erreur : ' + err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="update-user-role-container">
  <h3>Changer le rôle d’un utilisateur</h3>

  {message && (
    <p className={message.startsWith('✅') ? 'message-success' : 'message-error'}>
      {message}
    </p>
  )}

  <div className="form-group">
    <label>Utilisateur</label>
        <select onChange={e => setSelectedUser(e.target.value)} value={selectedUser}>
    <option value="">-- Choisir un utilisateur --</option>
    {data.users
        .filter(user => user.role !== 'ingenieur') // 👈 Filter out ingenieurs
        .map(user => (
        <option key={user._id} value={user._id}>
            {user.email} ({user.role})
        </option>
    ))}
    </select>
  </div>

  <div className="form-group">
    <label>Nouveau rôle</label>
    <select
      onChange={e => setNewRole(e.target.value)}
      value={newRole}
      className="form-select"
    >
      <option value="">-- Nouveau rôle --</option>
      <option value="admin">admin</option>
      <option value="ingenieur">ingenieur</option>
      <option value="client">client</option>
    </select>
  </div>

  <button
    className="btn-update-role"
    onClick={handleSubmit}
    disabled={!selectedUser || !newRole}
  >
    Modifier le rôle
  </button>
</div>

  );
}

export default UpdateUserRole;
