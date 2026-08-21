import React from 'react'
import { UserContext } from '../Context/UserContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom';

export default function Auth(props) {

    let { User ,isAuthLoading} = useContext(UserContext);

    if (isAuthLoading) {
        return <div>Loading...</div>;
    }

    if (User) {
        return props.children
    }
    else
    {
        return <Navigate to="/SignIn" replace />;
    }
}

