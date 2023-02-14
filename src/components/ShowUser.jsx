import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { apiBaseUrl, apiToken, defaultAvatar } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";
import FollowButton from "./FollowButton";

function ShowUser(props) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  //const [loadingUsersFollowed, setLoadingUsersFollowed] = useState(false);
  const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);

  useEffect(() => {
    setUser(props.user);
  }, [props]);

  return (
    <div className="follow__container col" key={`followers-${user?.name}`}>
      <div className="follow__container-info">
        <img src={user?.avatar ? user.avatar : defaultAvatar} className="follow__container-info-img" />
        <h2 className="follow__container-info-name">{user?.name}</h2>
      </div>
      <div className="follow__container-buttons">
        <FollowButton username={user?.name} followed={props?.followed} />
      </div>
    </div>
  );
}

export default ShowUser;
