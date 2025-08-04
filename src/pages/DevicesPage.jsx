import React from 'react';
import Device from '../components/device';
import Createdevice from '../components/createdevice';
import Deletedevice from '../components/deletedevice';
import UpdateDevice from '../components/updatedevice';
import StatsDevices  from '../components/StatsDevices';
import Searchdevice from '../components/searchdevice';


function DevicesPage() {
  const role = localStorage.getItem('role'); // récupère le rôle stocké
  return (
    <div>
      {(role === 'admin' || role === 'ingenieur') && (
        <>
        <div className='container'>
          <Searchdevice/>
          <Createdevice />
          <StatsDevices/>
          <Deletedevice />
          <UpdateDevice />
          </div>
        </>)}
      <Device/>
      
    </div>
  );
}

export default DevicesPage;