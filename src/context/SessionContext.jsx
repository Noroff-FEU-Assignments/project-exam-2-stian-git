import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const SessionContext = React.createContext([null, () => {}]);

export const SessionProvider = (props) => {
    const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);
    return <SessionContext.Provider value={[loggedIn, setLoggedIn]}>{props.children}</SessionContext.Provider>;
};

export default SessionContext;
