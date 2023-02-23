import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { apiBaseUrl } from "../constants/variables";
import SessionContext from "../context/SessionContext";

export default function useGetSinglePost(postid) {
  const [loggedIn] = useContext(SessionContext);
  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      if (postid) {
        try {
          setLoading(true);
          const singlePostApiUrl = apiBaseUrl + "/posts/" + postid + "?_author=true&_comments=true&_reactions=true";
          axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn?.accessToken}` };
          const response = await axios.get(singlePostApiUrl);
          if (response.status === 200) {
            const data = await response.data;
            setPostData(data);
          } else {
            setError("An error occured retrieving the post.");
          }
        } catch (error) {
          setError("An error occured retrieving the post: ", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchPost();
  }, [postid, loggedIn]);
  return { postData, loading, error };
}
