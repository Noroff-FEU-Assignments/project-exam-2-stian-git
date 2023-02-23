import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { apiBaseUrl } from "../constants/variables";
import SessionContext from "../context/SessionContext";

export default function useGetSingleProfile(username) {
  const [loggedIn] = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (username) {
        try {
          setLoading(true);
          const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
          axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn?.accessToken}` };
          const response = await axios.get(getProfileApiUrl);
          if (response.status === 200) {
            //return true;
            const data = await response.data;
            setUserData(data);
          } else {
            setError("An error occured retrieving the user.");
          }
        } catch (error) {
          setError("An error occured retrieving the user: ", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProfile();
  }, [username, loggedIn]);
  return { userData, loading, error };
}
