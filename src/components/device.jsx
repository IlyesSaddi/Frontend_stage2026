import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_DEVICES = gql`
  query {
    devices {
      _id
      name
      firmware_version
      company {
        name
      }
    }
  }
`;

function Device() {
  const { loading, error, data } = useQuery(GET_DEVICES);
  const navigate = useNavigate();

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  if (!data.devices.length) return <p>Aucun appareil trouvé.</p>;

  const grouped = data.devices.reduce((acc, device) => {
    const key = device.company?.name || "Sans société";
    acc[key] = acc[key] || [];
    acc[key].push(device);
    return acc;
  }, {});

  return (
    <div className="device-container">
      {Object.entries(grouped).map(([company, devices]) => (
        <div key={company}>
          <h2>{company}</h2>
          <div className="device-list">
            {devices.map(device => (
              <div
                key={device._id}
                className="device-card"
                onClick={() => navigate(`/device/${device._id}`)}
              >
                <h3>{device.name}</h3>
                <p>Firmware: {device.firmware_version}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Device;
