import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { defaultAvatar, storageKeyFollowedUsers } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";
import FollowButton from "./FollowButton";

function ShowUserDetails(props) {
  const [profile, setProfile] = useState(null);
  const [usersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);
  const [userIsFollowed, setUserIsFollowed] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    function isFollowed(name) {
      const result = usersFollowed?.some((user) => user.name === name);
      setUserIsFollowed(result);
    }
    // Checks the current username against the array of followed users.
    isFollowed(props.userprofile?.name);

    setProfile(props?.userprofile);
  }, [props, usersFollowed]);
  return (
    <Col
      className={userIsFollowed ? "user user-isfollowed" : "user"}
      onClick={() => {
        //window.location.href = `/profiles/${profile?.name}`;
        navigateTo(`/profiles/${profile?.name}`);
      }}
      style={{ backgroundImage: `url(${profile?.banner ? profile.banner : "none"})` }}>
      <div className="user__profile-imagecontainer">
        <img src={profile?.avatar ? profile.avatar : defaultAvatar} className="user__profile-imagecontainer-img" alt={`${profile?.name}'s Avatar`} title={`${profile?.name}'s Avatar`} />
      </div>

      <div className="user__profile">
        <div
          className="user__profile-details"
          onClick={() => {
            //window.location.href = `/profiles/${profile?.name}`;
            navigateTo(`/profiles/${profile?.name}`);
          }}>
          <h2 className="user__profile-details-name">{profile?.name}</h2>
          <p
            className="user__profile-details-email"
            title={`Send mail to: ${profile?.email}`}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${profile?.email}`;
            }}>
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
    </Col>
  );
}

export default ShowUserDetails;
