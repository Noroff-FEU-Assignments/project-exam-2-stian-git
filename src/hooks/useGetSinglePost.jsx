import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { apiBaseUrl } from "../constants/variables";
import SessionContext from "../context/SessionContext";

export default function useGetSinglePost(postid) {
  const [loggedIn, setLoggedIn] = useContext(SessionContext);
  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      if (postid) {
        //console.log("ID for hook:", postid);
        try {
          setLoading(true);
          //console.log("Retrieving post ID from Hook: " + postid);
          const singlePostApiUrl = apiBaseUrl + "/posts/" + postid + "?_author=true&_comments=true&_reactions=true";
          axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
          const response = await axios.get(singlePostApiUrl);
          //console.log(response);
          if (response.status === 200) {
            //return true;
            const data = await response.data;
            console.log(data);
            setPostData(data);
          } else {
            setError("An error occured retrieving the post.");
            //return [];
          }
        } catch (error) {
          //return [];
          setError("An error occured retrieving the post: ", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchPost();
  }, [postid]);
  return { postData, loading, error };
}
