import axios from "axios";
import React, { useEffect } from "react";
import { apiBaseUrl, storageKeyFollowedUsers, storageKeySessionInfo } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";

const SessionContext = React.createContext([null, () => {}]);

export const SessionProvider = (props) => {
  const [loggedIn, setLoggedIn] = useLocalStorage(storageKeySessionInfo, null);
  const [usersFollowed, setUsersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);

  useEffect(() => {
    async function setFollowedUsers() {
      const getProfileApiUrl = apiBaseUrl + "/profiles/" + loggedIn.name + "?_following=true&_followers=true";
      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
        const response = await axios(getProfileApiUrl);
        if (response.status === 200) {
          const data = await response.data;
          setUsersFollowed(data.following);
        }
      } catch (error) {
        //This error does not affect the user experience and will be ignored.
      }
    }
    if (loggedIn) {
      setFollowedUsers();
    }
  }, [loggedIn]);
  return <SessionContext.Provider value={[loggedIn, setLoggedIn]}>{props.children}</SessionContext.Provider>;
};

export default SessionContext;
