/*import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DEVICE } from '../graphql/queries';
import '../styles/device.css';
import '../styles/device.css';


function Device(){
   const { loading, error, data } = useQuery(GET_DEVICES, {
    variables: { clientId: "123" }, // you can make this dynamic later
  });
  if (loading) return <p>Loading devices...</p>;
  if (error) return <p>Error: {error.message}</p>;
     return (
    <div className="devices-container">
      <h1>Client Devices</h1>
      <div className="device-list">
        {data.devices.map((device) => (
          <div key={device.id} className="device-card">
            <h3>{device.name}</h3>
            <p>GPS: {device.gps.lat}, {device.gps.lon}</p>
            <p>SIM: {device.simStatus}</p>
            <p>Gyroscope: X {device.gyroscope.x}, Y {device.gyroscope.y}, Z {device.gyroscope.z}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Device;*/



import React from 'react';
import devices from '../data/dataDevices';
import '../styles/device.css';

function Device() {
  return (
    <div className="devices-container">
      <h1>Client Devices</h1>
      <div className="device-list">
        {devices.map((device) => (
          <div key={device.id} className="device-card">
            <h3>{device.name}</h3>
            <p>GPS: {device.gps.lat}, {device.gps.lon}</p>
            <p>SIM: {device.simStatus}</p>
            <p>Gyroscope: X {device.gyroscope.x}, Y {device.gyroscope.y}, Z {device.gyroscope.z}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Device;
