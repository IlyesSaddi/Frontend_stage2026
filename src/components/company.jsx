import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import '../styles/company.css'

const GET_COMPANIES = gql`
  query {
    companies {
      _id
      name
      description
    }
  }
`;

const CREATE_COMPANY = gql`
  mutation CreateCompany($companyInput: AddCompanyInput!) {
    createCompany(companyInput: $companyInput) {
      _id
      name
      description
    }
  }
`;

const DELETE_COMPANY = gql`
  mutation DeleteCompany($companyId: ID!) {
    deleteCompany(companyId: $companyId)
  }
`;

function Company() {
  const { loading, error, data, refetch } = useQuery(GET_COMPANIES);
  const [createCompany] = useMutation(CREATE_COMPANY);
  const [deleteCompany] = useMutation(DELETE_COMPANY);

  const [form, setForm] = useState({ name: '', description: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      alert('Le nom est requis');
      return;
    }
    try {
      await createCompany({ variables: { companyInput: form } });
      setForm({ name: '', description: '' });
      refetch();
    } catch (err) {
      alert('Erreur lors de la création : ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette compagnie ?')) {
      try {
        await deleteCompany({ variables: { companyId: id } });
        refetch();
      } catch (err) {
        alert('Erreur lors de la suppression : ' + err.message);
      }
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="company-manager">
      <h2 className="company-manager__title">Gérer les compagnies</h2>

      <form
        className="company-manager__form"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <input
          className="company-manager__input"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nom de la compagnie"
          required
        />
        <input
          className="company-manager__input"
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <button className="company-manager__button" type="submit">
          Créer
        </button>
      </form>

      <ul className="company-manager__list">
        {data.companies.map((company) => (
          <li key={company._id} className="company-manager__list-item">
            <span>{company.name}</span>
            <button
              className="company-manager__delete-button"
              onClick={() => handleDelete(company._id)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Company;
