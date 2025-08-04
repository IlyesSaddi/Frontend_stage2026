import React from 'react';
import UpdateUserRole from '../components/updateuserrole';
import Users from '../components/users';

function Userspage() {
    const role = localStorage.getItem('role'); // récupère le rôle stocké
    return (
        <div>
            <Users/>
        {(role === 'ingenieur') && (
            <>
            <UpdateUserRole/>
            </>)}
        </div>
    );
}

export default Userspage;
