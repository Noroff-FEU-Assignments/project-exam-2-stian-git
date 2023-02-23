import axios from "axios";
import React, { useEffect } from "react";
import { apiBaseUrl, storageKeyFollowedUsers, storageKeySessionInfo } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";

const SessionContext = React.createContext([null, () => {}]);

export const SessionProvider = (props) => {
  const [loggedIn, setLoggedIn] = useLocalStorage(storageKeySessionInfo, null);
  return <SessionContext.Provider value={[loggedIn, setLoggedIn]}>{props.children}</SessionContext.Provider>;
};

export default SessionContext;
