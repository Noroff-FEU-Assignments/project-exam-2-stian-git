import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { apiBaseUrl, apiToken, defaultAvatar } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";
import FollowButton from "./FollowButton";

function ShowUser(props) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [usersFollowed, setUsersFollowed] = useLocalStorage("socialUsersFollowed", []);
  const [loadingUsersFollowed, setLoadingUsersFollowed] = useState(false);
  const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);

  useEffect(() => {
    setUser(props.user);
    console.log(props);
    getUsersFollowed();
  }, [props]);

  async function getUsersFollowed() {
    setLoadingUsersFollowed(true);
    const usersFollowedApiUrl = apiBaseUrl + "/profiles/" + loggedIn.name + "?_following=true";
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
      const response = await axios.get(usersFollowedApiUrl);
      //console.log(response.data.following);
      setUsersFollowed(response.data.following);
    } catch (error) {
      //console.log(error);
      setError("Failed to retrieve users followed: " + error);
    } finally {
      setLoadingUsersFollowed(false);
    }
  }

  return (
    <div className="follow__container col" key={`followers-${user?.name}`}>
      <div className="follow__container-info">
        <img src={user?.avatar ? user.avatar : defaultAvatar} className="follow__container-info-img" />
        <h2 className="follow__container-info-name">{user?.name}</h2>
      </div>
      <div className="follow__container-buttons">
        <FollowButton username={user?.name} />
      </div>
    </div>
  );
}

export default ShowUser;
