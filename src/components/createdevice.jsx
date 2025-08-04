import React, { useState, useEffect } from 'react';
import Modal from './modal/modal';
import { gql, useMutation, useQuery } from '@apollo/client';
import '../styles/createdevice.css';

const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      _id
      name
    }
  }
`;

const CREATE_DEVICE = gql`
  mutation CreateDevice($deviceInput: AddDeviceInput!) {
    createDevice(deviceInput: $deviceInput) {
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

function Createdevice({ onDeviceCreated }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firmware_version: '',
    company_name: ''
  });

  const { loading, error, data } = useQuery(GET_COMPANIES);

  useEffect(() => {
    if (data && data.companies.length > 0 && !formData.company_name) {
      setFormData(prev => ({ ...prev, company_name: data.companies[0].name }));
    }
  }, [data]);

  const [createDevice, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_DEVICE, {
    onCompleted: (data) => {
      if (onDeviceCreated) onDeviceCreated(data.createDevice);
      setShowModal(false);
      setFormData({ name: '', firmware_version: '', company_name: '' });
    },
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleConfirm = async () => {
    try {
      await createDevice({ variables: { deviceInput: formData } });
    } catch (err) {
      console.error('Create device error', err);
    }
  };

  return (
    <div className='device-container'>
      <button className="btn" onClick={() => setShowModal(true)}>
        + Create Device
      </button>

      {showModal && (
        <Modal
          title="Create Device"
          canCancel
          canConfirm
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirm}
        >
          <div className="form-control">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-control">
            <label>Firmware Version</label>
            <input
              type="text"
              name="firmware_version"
              value={formData.firmware_version}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label>Company</label>
            {loading && <p>Loading companies...</p>}
            {error && <p>Error loading companies</p>}
            {!loading && !error && (
              <select name="company_name" value={formData.company_name} onChange={handleChange}>
                {data.companies.map(company => (
                  <option key={company._id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {mutationLoading && <p>Loading...</p>}
          {mutationError && <p style={{ color: 'red' }}>{mutationError.message}</p>}
        </Modal>
      )}
    </div>
  );
}

export default Createdevice;
