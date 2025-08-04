import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import '../styles/search.css';

const SEARCH_COMPANIES = gql`
  query SearchCompanies($query: String!) {
    searchCompanies(query: $query) {
      _id
      name
      description
    }
  }
`;

function SearchCompanies() {
  const [query, setQuery] = useState('');
  const [searchCompanies, { data, loading, error }] = useLazyQuery(SEARCH_COMPANIES);
  const [message, setMessage] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      searchCompanies({ variables: { query } });
      setMessage('');
    } else {
      setMessage('❌ Entrez un mot-clé pour la recherche.');
    }
  };

  return (
    <div className="search-company-container">
      <h2>🔍 Rechercher une Société</h2>

      <div className="search-company-bar">
        <input
          type="text"
          placeholder="Entrer le nom de la société..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Rechercher</button>
      </div>

      {message && <p className="message-error">{message}</p>}
      {loading && <p>Chargement...</p>}
      {error && <p className="message-error">Erreur : {error.message}</p>}

      <div className="company-results">
        {data?.searchCompanies?.length === 0 && <p>Aucune société trouvée.</p>}
        <ul>
          {data?.searchCompanies?.map(company => (
            <li key={company._id}>
              <strong>{company.name}</strong><br />
              <span>{company.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchCompanies;
