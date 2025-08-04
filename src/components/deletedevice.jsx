import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import '../styles/deletedevice.css';

const DELETE_DEVICE_BY_NAME = gql`
  mutation DeleteDeviceByName($name: String!) {
    deleteDeviceByName(name: $name)
  }
`;

function Deletedevice() {
  const [deviceName, setDeviceName] = useState('');
  const [deleteDeviceByName, { loading, error }] = useMutation(DELETE_DEVICE_BY_NAME, {
    variables: { name: deviceName },
    onCompleted: () => {
      alert('Appareil supprimé avec succès !');
      setDeviceName('');
      window.location.reload();
    },
  });

 const handleDelete = () => {
  if (!deviceName) {
    alert('Veuillez entrer le nom de l’appareil.');
    return;
  }
  console.log("Nom device à supprimer :", deviceName); // <== Ajouter ça
  if (window.confirm(`Confirmer la suppression de l’appareil "${deviceName}" ?`)) {
    deleteDeviceByName();
  }
};

  return (
    <div className="delete-device-container">
      <h3 className="delete-device-title">🗑️ Supprimer un appareil par nom</h3>
      <input
        type="text"
        className="delete-device-input"
        placeholder="Nom de l'appareil"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
      />
      <button
        onClick={handleDelete}
        disabled={loading}
        className="delete-device-button"
      >
        {loading ? 'Suppression...' : "Supprimer l'appareil"}
      </button>
      {error && <p className="delete-device-error">Erreur : {error.message}</p>}
    </div>
  );
}

export default Deletedevice;
