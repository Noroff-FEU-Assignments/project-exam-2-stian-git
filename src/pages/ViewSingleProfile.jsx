// TODO 13.2: Adding profiles of followers are next.

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { displayProfile, getUserProfile, showPosts } from "../constants/commonLib";
import { apiBaseUrl, apiToken } from "../constants/variables";
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

  //getUserProfile;
  useEffect(() => {
    setLoadingProfile(true);
    // get all userinfo

    // async function getUserProfile() {
    //   try {
    //     axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    //     const response = await axios(getProfileApiUrl);
    //     if (response.status === 200) {
    //       console.log(response.data);
    //       setUserProfile(response.data);
    //     } else {
    //       console.log("Something went wrong retrieving profile");
    //     }
    //   } catch (error) {
    //     console.log("Retrieving profile failed: ", error);
    //   } finally {
    //     setLoadingProfile(false);
    //   }
    // }

    getUserProfile(username).then(() => {
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
  }, []);

  return (
    <>
      <h1>My Posts</h1>
      <div>
        {noPostsToShow ? <p>There are no posts to show.</p> : ""}
        {showPosts(posts, loggedIn.name)}
      </div>

      <h1>Followed Users</h1>
      <div></div>
      <h1>My Followers</h1>
      <div>
        {/* {userProfile.followers.forEach((profile) => {
          getUserProfile(profile.name).then((user) => displayProfile(user));
        })} */}
      </div>
      <h1>Edit Profile</h1>
      <div>
        <h1>{username}</h1>
        <p>{userProfile?.email}</p>
      </div>
    </>
  );
}

export default ViewSingleProfile;
