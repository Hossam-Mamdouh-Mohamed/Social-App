import { useEffect, useState } from "react";
import { createContext } from "react";

export let UserContext = createContext(0);

export function UserContextProvider(props) {

    const [User, SetUser] = useState(null);

    useEffect(() => {

        const userData = localStorage.getItem('UserData');
        if (userData) {
            SetUser(JSON.parse(userData));
        } else {
            SetUser(null);
        }

    }, []);

    
    return <UserContext.Provider value={{ User, SetUser }}>
        {props.children}
    </UserContext.Provider>
}