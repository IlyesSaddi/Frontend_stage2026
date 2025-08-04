import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import '../styles/addCompanyToUser.css'; // ✅ Import du CSS

const GET_USERS_AND_COMPANIES = gql`
  query {
    users {
      _id
      email
    }
    companies {
      _id
      name
    }
  }
`;

const ADD_COMPANY_TO_USER = gql`
  mutation AddCompanyToUser($userId: ID!, $companyId: ID!) {
    addCompanyToUser(userId: $userId, companyId: $companyId) {
      _id
      email
      companies {
        _id
        name
      }
    }
  }
`;

function AddCompanyToUser() {
  const { loading, error, data } = useQuery(GET_USERS_AND_COMPANIES);
  const [addCompanyToUser] = useMutation(ADD_COMPANY_TO_USER);

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [message, setMessage] = useState('');

 const handleSubmit = async () => {
  try {
    const { data } = await addCompanyToUser({
      variables: {
        userId: selectedUser,
        companyId: selectedCompany
      }
    });

    if (data?.addCompanyToUser) {
      setMessage('✅ Société associée avec succès !');
    }
  } catch (err) {
    // Gérer les erreurs GraphQL (ex: "You are not authorized...")
    if (err.graphQLErrors && err.graphQLErrors.length > 0) {
      setMessage('❌ Erreur : ' + err.graphQLErrors[0].message);
    } else {
      setMessage('❌ Erreur inattendue : ' + err.message);
    }
  }
};

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="add-company-container">
      <h2>Associer une société à un utilisateur</h2>

      {message && <p><strong>{message}</strong></p>}

      <div>
        <label>Utilisateur :</label>
        <select
          onChange={(e) => setSelectedUser(e.target.value)} 
          value={selectedUser}
        >
          <option value="">-- Choisir un utilisateur --</option>
          {data.users.map(user => (
            <option key={user._id} value={user._id}>{user.email}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Société :</label>
        <select 
          className="form-select"
          onChange={(e) => setSelectedCompany(e.target.value)} 
          value={selectedCompany}
        >
          <option value="">-- Choisir une société --</option>
          {data.companies.map(company => (
            <option key={company._id} value={company._id}>{company.name}</option>
          ))}
        </select>
      </div>

      <button 
        className="btn-submit"
        onClick={handleSubmit} 
        disabled={!selectedUser || !selectedCompany}
      >
        Associer
      </button>
    </div>
  );
}

export default AddCompanyToUser;
