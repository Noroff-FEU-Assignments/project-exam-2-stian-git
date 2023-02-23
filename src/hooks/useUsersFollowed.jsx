import { useContext, useEffect } from "react";
import { storageKeyFollowedUsers } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import useLocalStorage from "./useLocalStorage";

export default function useUsersFollowed(data) {
  const [usersFollowed, setUsersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);
  const [loggedIn] = useContext(SessionContext);

  useEffect(() => {
    console.log("Hookdata", data);
    if (loggedIn.name === data?.name) {
      console.log("Add followers from this");
      setUsersFollowed(data.following);
    } else {
      console.log("Do not add followers...");
    }
    //setUsersFollowed(data);
  }, [data, loggedIn, setUsersFollowed]);
  return [usersFollowed, setUsersFollowed];
}

// Above works, but too many dependencies... able to remove some?
