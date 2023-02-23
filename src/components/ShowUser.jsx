import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultAvatar } from "../constants/variables";
import FollowButton from "./FollowButton";

function ShowUser(props) {
  const [user, setUser] = useState(null);
  //const [error, setError] = useState(null);
  const navigateTo = useNavigate();
  useEffect(() => {
    setUser(props.user);
  }, [props]);

  return (
    <div
      className="follow__container col"
      key={`followers-${user?.name}`}
      onClick={(e) => {
        //window.location.href = `/profiles/${user?.name}`;
        navigateTo(`/profiles/${user?.name}`);
      }}>
      <div className="follow__container-info">
        <img src={user?.avatar ? user.avatar : defaultAvatar} className="follow__container-info-img" alt={`Avatar of ${user?.name}`} title={`Avatar of ${user?.name}`} />
        <h2 className="follow__container-info-name">{user?.name}</h2>
      </div>
      <div className="follow__container-buttons">
        <FollowButton username={user?.name} followed={props?.followed} />
      </div>
    </div>
  );
}

export default ShowUser;
