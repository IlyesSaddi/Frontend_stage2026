import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import '../styles/updatedevice.css';

const GET_DEVICES = gql`
  query GetDevices {
    devices {
      _id
      name
      firmware_version
    }
  }
`;

const UPDATE_DEVICE = gql`
  mutation UpdateDevice($deviceId: ID!, $deviceInput: UpdateDeviceInput!) {
    updateDevice(deviceId: $deviceId, deviceInput: $deviceInput) {
      _id
      name
      firmware_version
      company {
        _id
        name
      }
    }
  }
`;

function UpdateDevice() {
  const { loading, error, data } = useQuery(GET_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [currentFirmware, setCurrentFirmware] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [firmwareInput, setFirmwareInput] = useState('');

  useEffect(() => {
    if (data && data.devices.length > 0 && !selectedDeviceId) {
      const firstDevice = data.devices[0];
      setSelectedDeviceId(firstDevice._id);
      setCurrentName(firstDevice.name);
      setCurrentFirmware(firstDevice.firmware_version);
      setNameInput('');
      setFirmwareInput('');
    }
  }, [data, selectedDeviceId]);

  const [updateDevice, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_DEVICE, {
    onCompleted: () => alert('Appareil mis à jour avec succès !'),
  });

  const handleDeviceChange = (e) => {
    const deviceId = e.target.value;
    setSelectedDeviceId(deviceId);
    const device = data.devices.find(d => d._id === deviceId);
    setCurrentName(device.name);
    setCurrentFirmware(device.firmware_version);
    setNameInput('');      // clear inputs
    setFirmwareInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDeviceId) {
      alert("Veuillez sélectionner un appareil.");
      return;
    }
    if (nameInput.trim() === '' && firmwareInput.trim() === '') {
      alert('Veuillez modifier au moins un champ avant de soumettre.');
      return;
    }

    updateDevice({
      variables: {
        deviceId: selectedDeviceId,
        deviceInput: {
          name: nameInput.trim() !== '' ? nameInput : currentName,
          firmware_version: firmwareInput.trim() !== '' ? firmwareInput : currentFirmware,
        },
      },
    });
  };

  if (loading) return <p>Chargement des appareils...</p>;
  if (error) return <p>Erreur lors du chargement des appareils: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className="update-device-form">
      <h3>Modifier un appareil</h3>

      <label>
        Sélectionnez un appareil :
        <select value={selectedDeviceId} onChange={handleDeviceChange}>
          {data.devices.map(device => (
            <option key={device._id} value={device._id}>
              {device.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Nom :
        <input
          type="text"
          value={nameInput}
          placeholder="Nouvelle nom"
          onChange={e => setNameInput(e.target.value)}
          autoComplete="off"
        />
      </label>

      <label>
        Version Firmware :
        <input
          type="text"
          value={firmwareInput}
          placeholder="Nouvelle firmware"
          onChange={e => setFirmwareInput(e.target.value)}
          autoComplete="off"
        />
      </label>

      <button type="submit" disabled={mutationLoading}>
        {mutationLoading ? 'Mise à jour...' : 'Mettre à jour'}
      </button>

      {mutationError && <p className="error-message">Erreur : {mutationError.message}</p>}
    </form>
  );
}

export default UpdateDevice;
