import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import '../styles/removecompanyfromuser.css';

const GET_USERS_WITH_COMPANIES = gql`
  query {
    users {
      _id
      email
      companies {
        _id
        name
      }
    }
  }
`;

const REMOVE_COMPANY_FROM_USER = gql`
  mutation RemoveCompanyFromUser($userId: ID!, $companyId: ID!) {
    removeCompanyFromUser(userId: $userId, companyId: $companyId) {
      _id
      email
      companies {
        _id
        name
      }
    }
  }
`;

function RemoveCompanyFromUser() {
  const { data, loading, error, refetch } = useQuery(GET_USERS_WITH_COMPANIES);
  const [removeCompanyFromUser, { loading: mutationLoading }] = useMutation(REMOVE_COMPANY_FROM_USER);

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!selectedUser || !selectedCompany) {
      setMessage('❌ Veuillez sélectionner un utilisateur et une société.');
      return;
    }
    try {
      await removeCompanyFromUser({
        variables: { userId: selectedUser, companyId: selectedCompany }
      });
      setMessage('✅ Société supprimée avec succès !');
      refetch();
    } catch (err) {
      setMessage('❌ Erreur : ' + err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const userCompanies = data.users.find(u => u._id === selectedUser)?.companies || [];

  return (
    <div className="remove-company-container">
      <h3>❌ Retirer une société d’un utilisateur</h3>

      {message && (
        <p className={message.startsWith('✅') ? 'success-msg' : 'error-msg'}>
          {message}
        </p>
      )}

      <div className="form-group">
        <label>Utilisateur :</label>
        <select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setSelectedCompany('');
            setMessage('');
          }}
        >
          <option value="">-- Choisir un utilisateur --</option>
          {data.users.map(user => (
            <option key={user._id} value={user._id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className="form-group">
          <label>Société associée :</label>
          <select
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              setMessage('');
            }}
          >
            <option value="">-- Choisir une société --</option>
            {userCompanies.map(company => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        className="btn-remove"
        onClick={handleSubmit}
        disabled={!selectedUser || !selectedCompany || mutationLoading}
      >
        {mutationLoading ? 'Suppression...' : 'Supprimer la société'}
      </button>
    </div>
  );
}

export default RemoveCompanyFromUser;