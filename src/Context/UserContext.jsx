import { useEffect, useState } from "react";
import { createContext } from "react";

export let UserContext = createContext(0);

export function UserContextProvider(props) {

    const [User, SetUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('UserToken');
        if (token !== null) {
            const userData = localStorage.getItem('UserData');
            if (userData) {
                SetUser(JSON.parse(userData));
            } else {
                SetUser(token);
            }
        }
    }, []);
    return <UserContext.Provider value={{ User, SetUser }}>
        {props.children}
    </UserContext.Provider>
}