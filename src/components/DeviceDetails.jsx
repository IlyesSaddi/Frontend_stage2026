import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // ✅ import this
import '../styles/DeviceDetails.css';

function DeviceDetails() {
  const { id: deviceId } = useParams(); // ✅ Get id from URL param

  const [histories, setHistories] = useState([]);

  useEffect(() => {
    console.log("Device ID reçu :", deviceId);

    const fetchHistories = async () => {
      try {
        const response = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({
            query: `
              query {
                histories {
                  _id
                  adress
                  vehicule_status
                  gprs_signal
                  data_time
                  hourmetre
                  device {
                    _id
                  }
                }
              }
            `,
          }),
        });

        const result = await response.json();
        console.log("Résultat brut :", result);

        if (
          result.data &&
          result.data.histories &&
          Array.isArray(result.data.histories)
        ) {
          console.log("Tous les historiques :", result.data.histories);
          console.log("deviceId filtré :", deviceId);

          const filtered = result.data.histories.filter(
            (h) => h.device?._id === deviceId
          );
          setHistories(filtered);
        } else {
          console.warn('Histories non trouvées ou invalides :', result);
          setHistories([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des historiques :', error);
      }
    };

    fetchHistories();
  }, [deviceId]);

  return (
    <div className="device-history-container">
      <h2>Historique du Device</h2>
      {histories.length === 0 ? (
        <p>Aucun historique trouvé.</p>
      ) : (
        <ul>
          {histories.map((history) => (
            <li key={history._id}>
              <strong>Date :</strong> {new Date(+history.data_time).toLocaleString()}<br />
              <strong>Adresse :</strong> {history.adress}<br />
              <strong>Véhicule :</strong> {history.vehicule_status}<br />
              <strong>Signal GPRS :</strong> {history.gprs_signal}<br />
              <strong>Hourmètre :</strong> {history.hourmetre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeviceDetails;
