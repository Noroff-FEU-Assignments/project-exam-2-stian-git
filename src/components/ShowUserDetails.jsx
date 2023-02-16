import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { defaultAvatar, storageKeyFollowedUsers } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";
import FollowButton from "./FollowButton";

function ShowUserDetails(props) {
  const [profile, setProfile] = useState(null);
  const [usersFollowed, setUsersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);
  const [userIsFollowed, setUserIsFollowed] = useState(false);

  useEffect(() => {
    function isFollowed(name) {
      //const result = usersFollowed?.some((user) => user.name === name);
      const result = usersFollowed.some((user) => user.name === name);
      //console.log(name, result);
      //console.log(name, result, "Followed:", usersFollowed);
      setUserIsFollowed(result);
    }
    // Checks the current username against the array of followed users.
    isFollowed(props.userprofile?.name);

    setProfile(props?.userprofile);
  }, [props]);
  return (
    <Col
      className={userIsFollowed ? "user user-isfollowed" : "user"}
      onClick={() => {
        window.location.href = `/profiles/${profile?.name}`;
      }}
      style={{ backgroundImage: `url(${profile?.banner ? profile.banner : "none"})` }}
    >
      {/* <NavLink to={"./" + profile.name} className="user-link"> */}
      <div className="user__profile-imagecontainer">
        <img src={profile?.avatar ? profile.avatar : defaultAvatar} className="user__profile-imagecontainer-img" />
      </div>

      <div className="user__profile">
        <div
          className="user__profile-details"
          onClick={() => {
            window.location.href = `/profiles/${profile?.name}`;
          }}
        >
          <h2 className="user__profile-details-name">{profile?.name}</h2>
          <p
            className="user__profile-details-email"
            title={`Send mail to: ${profile?.email}`}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${profile?.email}`;
            }}
          >
            {profile?.email}
          </p>
        </div>
        <div className="user__profile-counts">
          <p className="user__profile-counts-detail">Posts: {profile?._count?.posts}</p>
          <p className="user__profile-counts-detail">Followers: {profile?._count?.followers}</p>
          <p className="user__profile-counts-detail">Following: {profile?._count?.following}</p>
        </div>
        <div className="user__profile-follow">
          <FollowButton username={profile?.name} followed={usersFollowed} />
        </div>
      </div>
      {/* </NavLink> */}
    </Col>
  );
}

export default ShowUserDetails;
