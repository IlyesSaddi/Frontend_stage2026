import React from 'react';
import { gql, useQuery } from '@apollo/client';
import '../styles/users.css';

const GET_USERS_BY_COMPANY = gql`
  query {
    users {
      _id
      email
      role
      companies {
        _id
        name
      }
    }
  }
`;

function Users() {
  const { loading, error, data } = useQuery(GET_USERS_BY_COMPANY);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  // Regrouper les utilisateurs par company
  const grouped = {};
  data.users.forEach(user => {
    if (user.companies.length === 0) {
      if (!grouped['Sans société']) grouped['Sans société'] = [];
      grouped['Sans société'].push(user);
    } else {
      user.companies.forEach(company => {
        if (!grouped[company.name]) grouped[company.name] = [];
        grouped[company.name].push(user);
      });
    }
  });

  return (
    <div className="users-by-company">
      <h2>Utilisateurs par société</h2>
      {Object.entries(grouped).map(([companyName, users]) => (
        <div key={companyName} className="company-group">
          <h3>{companyName}</h3>
          <ul>
            {users.map(user => (
              <li key={user._id}>
                {user.email} — <strong>{user.role}</strong>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Users;
