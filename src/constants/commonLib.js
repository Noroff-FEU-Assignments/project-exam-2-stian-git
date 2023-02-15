// TODO: Need to refactor this.
// API-token can't be obtained from localstorage.

import axios from "axios";
import { useContext } from "react";
import SessionContext from "../context/SessionContext";

import { apiBaseUrl, apiToken } from "./variables";

export async function GetSinglePost(postid) {
  //const [loggedIn, setLoggedIn] = useContext(SessionContext);

  console.log("Retrieving post ID: " + postid);
  const singlePostApiUrl = apiBaseUrl + "/posts/" + postid + "?_author=true&_comments=true&_reactions=true";
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    const response = await axios.get(singlePostApiUrl);
    console.log(response);
    if (response.status === 200) {
      //return true;
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}
