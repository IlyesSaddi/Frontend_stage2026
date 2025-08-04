import React from 'react';
import Company from '../components/company';
import Addcompany from '../components/addcompanytouser';
import Searchcompany from '../components/SearchCompany';
import Removecompanyfromuser from '../components/removecompayfromuser';


function Companypage() {
  const role = localStorage.getItem('role'); // récupère le rôle stocké
  return (
    <div>
       {(role === 'ingenieur') && (
        <>
          <Searchcompany/>
          <Company/>
          
        </>)}
      <Addcompany/>
      <Removecompanyfromuser/>
    </div>
  );
}

export default Companypage;