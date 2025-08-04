import React, { useState } from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import '../styles/statsDevices.css';

const GET_DEVICES_COUNT_PER_COMPANY = gql`
  query {
    devicesCountPerCompany {
      companyName
      devicesCount
    }
  }
`;

const GET_DEVICES_EVOLUTION = gql`
  query DevicesEvolution($startDate: String!, $endDate: String!) {
    devicesEvolution(startDate: $startDate, endDate: $endDate) {
      date
      count
    }
  }
`;

function StatsDevices() {
  const { data: countData, loading: countLoading, error: countError } = useQuery(GET_DEVICES_COUNT_PER_COMPANY);
  const [getEvolution, { data: evolutionData, loading: evoLoading, error: evoError }] = useLazyQuery(GET_DEVICES_EVOLUTION);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleEvolutionSubmit = () => {
    if (startDate && endDate) {
      getEvolution({ variables: { startDate, endDate } });
    }
  };

  return (
    <div className="stats-container">
      <h2>📊 Statistiques des Devices</h2>

      <section className="stats-section">
        <h3>Nombre de devices par entreprise</h3>
        {countLoading && <p>Chargement...</p>}
        {countError && <p>Erreur : {countError.message}</p>}
        {countData && (
          <ul>
            {countData.devicesCountPerCompany.map((item, index) => (
              <li key={index}>
                <strong>{item.companyName}</strong> : {item.devicesCount} device(s)
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="stats-section">
        <h3>Évolution des devices sur une période</h3>
        <div className="date-inputs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleEvolutionSubmit}>Afficher</button>
        </div>

        {evoLoading && <p>Chargement évolution...</p>}
        {evoError && <p>Erreur : {evoError.message}</p>}
        {evolutionData && (
          <ul>
            {evolutionData.devicesEvolution.map((entry, index) => (
              <li key={index}>
                {entry.date} : {entry.count} device(s)
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default StatsDevices;
