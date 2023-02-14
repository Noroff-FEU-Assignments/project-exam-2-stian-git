// TODO 13.2: Adding profiles of followers are next.

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";
import { displayProfile, getUserProfile, IsFollowed, showPosts, toggleFollow } from "../constants/commonLib";
import { apiBaseUrl, apiToken, defaultAvatar } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";

function ViewSingleProfile() {
  // retrieve username from url:
  const { username } = useParams();
  //const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
  const getUsersPostsApiUrl = apiBaseUrl + "/profiles/" + username + "/posts?_author=true&_comments=true&_reactions=true";
  const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);

  // should profile be null or array?
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [posts, setPosts] = useState([]);
  const [noPostsToShow, setNoPostsToShow] = useState(null);
  const [usersFollowed, setUsersFollowed] = useLocalStorage("socialUsersFollowed", []);

  //getUserProfile;
  useEffect(() => {
    setLoadingProfile(true);
    // get all userinfo

    getUserProfile(username).then((data) => {
      console.log(data);
      setUserProfile(data);
      setLoadingProfile(false);
    });
    // get all posts
    async function getUsersPosts() {
      setLoadingPosts(true);
      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
        const response = await axios(getUsersPostsApiUrl);
        if (response.status === 200) {
          console.log(response.data);
          setPosts(response.data);
          setUsersFollowed(response.data.following);
          if (response.data.length === 0) {
            setNoPostsToShow(true);
          }
        } else {
          console.log("Something went wrong retrieving posts");
        }
      } catch (error) {
        console.log("Retrieving posts failed: ", error);
      } finally {
        setLoadingPosts(false);
      }
    }
    getUsersPosts();
    //getUsersFollowed();
  }, []);

  // async function getUsersFollowed() {
  //   setLoadingUsersFollowed(true);
  //   const usersFollowedApiUrl = apiBaseUrl + "/profiles/" + isLoggedIn.name + "?_following=true";
  //   try {
  //     axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
  //     const response = await axios.get(usersFollowedApiUrl);
  //     //console.log(response.data.following);
  //     setUsersFollowed(response.data.following);
  //   } catch (error) {
  //     //console.log(error);
  //     setError("Failed to retrieve users followed: " + error);
  //   } finally {
  //     setLoadingUsersFollowed(false);
  //   }
  // }

  return (
    <>
      <h1>My Posts</h1>
      <div>
        {noPostsToShow ? <p>There are no posts to show.</p> : ""}
        {showPosts(posts, loggedIn.name)}
      </div>

      <div className="follow">
        <h1>Followed Users</h1>
        {userProfile?.following.map((user) => (
          <div className="follow__container col" key={`followers-${user.name}`}>
            <div className="follow__container-info">
              <img src={user.avatar ? user.avatar : defaultAvatar} className="follow__container-info-img" />
              <h2 className="follow__container-info-name">{user.name}</h2>
            </div>
            <div className="follow__container-buttons">
              <Button data-username={user.name} size="sm" variant="success" onClick={toggleFollow} className="follow__container-buttons-follow">
                {IsFollowed(user.name, usersFollowed) ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="follow">
        <h1>My Followers</h1>
        {userProfile?.followers.map((user) => (
          <div className="follow__container col" key={`followers-${user.name}`}>
            <div className="follow__container-info">
              <img src={user.avatar ? user.avatar : defaultAvatar} className="follow__container-info-img" />
              <h2 className="follow__container-info-name">{user.name}</h2>
            </div>
            <div className="follow__container-buttons">
              <Button data-username={user.name} size="sm" variant="success" onClick={toggleFollow} className="follow__container-buttons-follow">
                {IsFollowed(user.name, usersFollowed) ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <h1>Edit Profile</h1>
      <EditUserForm user={userProfile} />
      {/* <div className="editprofile">
        {userProfile.banner ? <img src={userProfile.banner} className="editprofile-banner" /> : ""}
        <img src={userProfile.avatar ? userProfile.avatar : defaultAvatar} className="editprofile-avatar" />
        <h1>{username}</h1>
        <p>{userProfile?.email}</p>
      </div> */}
    </>
  );
}

export default ViewSingleProfile;
