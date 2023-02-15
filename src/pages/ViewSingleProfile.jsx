// TODO 13.2: Adding profiles of followers are next.

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CardGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";
import ShowPost from "../components/ShowPost";
import ShowUser from "../components/ShowUser";
import ShowUserDetails from "../components/ShowUserDetails";
import { apiBaseUrl, storageKeyFollowedUsers } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import useLocalStorage from "../hooks/useLocalStorage";

function ViewSingleProfile() {
  // retrieve username from url:
  const { username } = useParams();

  const [loggedIn, setLoggedIn] = useContext(SessionContext);

  // should profile be null or array?
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [posts, setPosts] = useState([]);
  const [noPostsToShow, setNoPostsToShow] = useState(false);
  const [noFollowingsToShow, setNoFollowingsToShow] = useState(false);
  const [noFollowedUsersToShow, setNoFollowedUsersToShow] = useState(false);
  const [usersFollowed, setUsersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(null);

  //getUserProfile;
  useEffect(() => {
    setLoadingProfile(true);
    // get all userinfo
    async function getUserProfile() {
      const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
        const response = await axios(getProfileApiUrl);
        if (response.status === 200) {
          const data = await response.data;
          console.log(response.data);
          //console.log(response.data.following);
          setUserProfile(data);
          setUsersFollowed(data.following);
          // If this is the owner the view will be slightly different.
          if (username === loggedIn.name) {
            setIsOwner(true);
          }
          if (data.following.length === 0) {
            console.log("No followings");
            setNoFollowingsToShow(true);
          }
          if (data.followers.length === 0) {
            console.log("No followed users");
            setNoFollowedUsersToShow(true);
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
        axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
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
          <Row className="postscontainer">
            {posts.map((post) => (
              <ShowPost postdata={post} key={post.id} />
            ))}
          </Row>
        </CardGroup>
      </div>

      <div className="follow">
        <h1>Followed Users</h1>
        {noFollowingsToShow ? <p>No users followed.</p> : ""}
        {userProfile?.following.map((followedProfile) => (
          <ShowUser key={`followed-${followedProfile.name}`} user={followedProfile} followed={usersFollowed} />
        ))}
      </div>

      <div className="follow">
        <h1>My Followers</h1>
        {noFollowedUsersToShow ? <p>No users are following.</p> : ""}
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
