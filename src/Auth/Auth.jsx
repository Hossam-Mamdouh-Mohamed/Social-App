import React from 'react'
import { UserContext } from '../Context/UserContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom';

export default function Auth(props) {

    let {User} = useContext(UserContext);

    if (User) {
        return props.children
        
    }
    else
    {
        return <Navigate to="/SignIn" replace />;
    }
}

