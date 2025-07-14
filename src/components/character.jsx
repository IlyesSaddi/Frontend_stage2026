import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_CHARACTER } from '../graphql/queries';
import '../styles/character.css';

function Character() {
  const [id, setId] = useState('');
  const [getCharacter, { loading, error, data }] = useLazyQuery(GET_CHARACTER);

  const handleClick = () => {
    if (id) {
      getCharacter({ variables: { id } });
    }
  };

  return (
    <div className="character-container">
      <h1>Search for a character</h1>
      <input
        type="text"
        placeholder="Enter character ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleClick}>Show Character</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.character && (
        <>
          <h2>Name: {data.character.name}</h2>
          <p>Status: {data.character.status}</p>
          <img src={data.character.image} alt={data.character.name} />
        </>
      )}
    </div>
  );
}

export default Character;
