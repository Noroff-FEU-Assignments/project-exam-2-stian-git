import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { apiBaseUrl } from "../constants/variables";
import SessionContext from "../context/SessionContext";

export default function useGetSingleProfile(username) {
  const [loggedIn, setLoggedIn] = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (username) {
        //console.log("ID for hook:", postid);
        try {
          setLoading(true);
          //console.log("Retrieving post ID from Hook: " + postid);
          //const singlePostApiUrl = apiBaseUrl + "/posts/" + postid + "?_author=true&_comments=true&_reactions=true";
          const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
          axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
          const response = await axios.get(getProfileApiUrl);
          //console.log(response);
          if (response.status === 200) {
            //return true;
            const data = await response.data;
            console.log(data);
            setUserData(data);
          } else {
            setError("An error occured retrieving the user.");
            //return [];
          }
        } catch (error) {
          //return [];
          setError("An error occured retrieving the user: ", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProfile();
  }, [username]);
  return { userData, loading, error };
}
