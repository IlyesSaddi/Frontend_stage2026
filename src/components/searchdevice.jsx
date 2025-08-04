import { gql } from '@apollo/client';
import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import '../styles/search.css';

export const SEARCH_DEVICES = gql`
  query SearchDevices($query: String!) {
    searchDevices(query: $query) {
      _id
      name
      firmware_version
    }
  }
`;

function SearchDevices() {
  const [query, setQuery] = useState('');
  const [searchDevices, { data, loading, error }] = useLazyQuery(SEARCH_DEVICES);

  const handleSearch = () => {
    if (query.trim()) {
      searchDevices({ variables: { query } });
    }
  };

  return (
    <div className="search-container">
      <h2>🔍 Search Devices</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter device name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <div className="results">
        {data?.searchDevices?.length === 0 && <p>No devices found.</p>}
        <ul>
          {data?.searchDevices?.map(device => (
            <li key={device._id}>
              <strong>{device.name}</strong> – Firmware: {device.firmware_version}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchDevices;