// TODO 13.2: Adding profiles of followers are next.

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, CardGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";
import ShowUser from "../components/ShowUser";
import ShowUserDetails from "../components/ShowUserDetails";
import { showPosts } from "../constants/commonLib";
import { apiBaseUrl, apiToken } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";

function ViewSingleProfile() {
  // retrieve username from url:
  const { username } = useParams();
  //const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
  //const getUsersPostsApiUrl = apiBaseUrl + "/profiles/" + username + "/posts?_author=true&_comments=true&_reactions=true";
  const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);

  // should profile be null or array?
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [posts, setPosts] = useState([]);
  const [noPostsToShow, setNoPostsToShow] = useState(null);
  const [usersFollowed, setUsersFollowed] = useLocalStorage("socialUsersFollowed", []);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(null);

  //const [loadingUsersFollowed, setLoadingUsersFollowed] = useState(false);

  //getUserProfile;
  useEffect(() => {
    setLoadingProfile(true);
    // get all userinfo
    async function getUserProfile() {
      const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
        const response = await axios(getProfileApiUrl);
        if (response.status === 200) {
          const data = await response.data;
          //console.log(response.data);
          //console.log(response.data.following);
          setUserProfile(data);
          setUsersFollowed(data.following);
          if (username === loggedIn.name) {
            console.log("This is the owner!");
            setIsOwner(true);
          }
          return response.data;
        } else {
          console.log("Something went wrong retrieving profile");
        }
      } catch (error) {
        console.log("Retrieving profile failed: ", error);
      } finally {
        setLoadingProfile(false);
      }
    }
    getUserProfile();
    // get all posts
    async function getUsersPosts() {
      setLoadingPosts(true);
      const getUsersPostsApiUrl = apiBaseUrl + "/profiles/" + username + "/posts?_author=true&_comments=true&_reactions=true";
      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
        const response = await axios(getUsersPostsApiUrl);
        if (response.status === 200) {
          //console.log(response.data);
          const data = await response.data;
          //console.log(data);
          setPosts(data);
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
  }, [username]);

  return (
    <>
      {isOwner ? (
        ""
      ) : (
        <>
          <h1>User: {userProfile?.name}</h1>
          <ShowUserDetails userprofile={userProfile} />
        </>
      )}
      <h1>My Posts</h1>
      <div>
        <CardGroup>
          {noPostsToShow ? <p>There are no posts to show.</p> : ""}
          <Row className="postscontainer">{showPosts(posts, loggedIn.name)}</Row>
        </CardGroup>
      </div>

      <div className="follow">
        <h1>Followed Users</h1>
        {userProfile?.following.map((followedProfile) => (
          <ShowUser key={`followed-${followedProfile.name}`} user={followedProfile} followed={usersFollowed} />
        ))}
      </div>

      <div className="follow">
        <h1>My Followers</h1>
        {userProfile?.followers.map((profile) => (
          <ShowUser key={`followers-${profile.name}`} user={profile} followed={usersFollowed} />
        ))}
      </div>
      {isOwner ? (
        <>
          <h1>Edit Profile</h1>
          <EditUserForm user={userProfile} />
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default ViewSingleProfile;
