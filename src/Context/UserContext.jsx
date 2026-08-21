import { useEffect, useState } from "react";
import { createContext } from "react";

export let UserContext = createContext(0);

export function UserContextProvider(props) {

    const [User, SetUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {

        const userData = localStorage.getItem('UserData');
        if (userData) {
            SetUser(JSON.parse(userData));
        } else {
            SetUser(null);
        }
        setIsAuthLoading(false);

    }, []);

    
    return <UserContext.Provider value={{ User, SetUser, isAuthLoading }}>
        {props.children}
    </UserContext.Provider>
}