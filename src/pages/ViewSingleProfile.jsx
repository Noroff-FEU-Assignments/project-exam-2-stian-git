import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CardGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";
import ShowPost from "../components/ShowPost";
import ShowSpinner from "../components/ShowSpinner";
import ShowStatusMessage from "../components/ShowStatusMessage";
import ShowUser from "../components/ShowUser";
import ShowUserDetails from "../components/ShowUserDetails";
import { apiBaseUrl, storageKeyFollowedUsers } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import useLocalStorage from "../hooks/useLocalStorage";

function ViewSingleProfile() {
  // retrieve username from url:
  const history = useNavigate();

  const { username } = useParams();

  const [loggedIn] = useContext(SessionContext);

  // should profile be null or array?
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [posts, setPosts] = useState([]);
  const [noPostsToShow, setNoPostsToShow] = useState(false);
  const [noFollowingsToShow, setNoFollowingsToShow] = useState(false);
  const [noFollowedUsersToShow, setNoFollowedUsersToShow] = useState(false);
  const [usersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);

  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (userProfile?.username === loggedIn.name) {
  //     setIsOwner(true);
  //     console.log("Owner!");
  //     // Make sure we reload the followed users array if this is the owners page:
  //     setUsersFolowed(userProfile?.following);
  //   }
  // }, [setUsersFolowed]);
  useEffect(() => {
    // get all userinfo
    async function getUserProfile() {
      setLoadingProfile(true);
      const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
        const response = await axios(getProfileApiUrl);
        if (response.status === 200) {
          const data = await response.data;
          setUserProfile(data);
          // If this is the owner the view will be slightly different.
          if (username === loggedIn.name) {
            //const followed = data.following;
            setIsOwner(true);
            // Make sure we reload the followed users array if this is the owners page:
            //setUsersFollowed(data.following);
            console.log("Adding:", data.following);
            window.localStorage.setItem(storageKeyFollowedUsers, JSON.stringify(data.following));
          }
          if (data.following.length === 0) {
            setNoFollowingsToShow(true);
          }
          if (data.followers.length === 0) {
            setNoFollowedUsersToShow(true);
          }

          return response.data;
        } else {
          setError("Failed to retrieve profile. Please try again.");
        }
      } catch (error) {
        setError("User not found.");
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
          const data = await response.data;
          setPosts(data);
          if (response.data.length === 0) {
            setNoPostsToShow(true);
          }
        } else {
          setPostsError("Failed to retrieve posts. Please try again.");
        }
      } catch (error) {
        setPostsError(`Failed to retrieve posts. Please try again.(Code: ${error.response.status})`);
      } finally {
        setLoadingPosts(false);
      }
    }
    getUsersPosts();
  }, [username, loggedIn]);

  useEffect(() => {
    if (loadingProfile && loadingPosts) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingPosts, loadingProfile]);

  return (
    <>
      {loading ? (
        <ShowSpinner />
      ) : (
        <>
          {error ? (
            <>
              <ShowStatusMessage text={error} display={true} />
              {/* <p className="error error-large">{error}</p> */}
              <p
                className="link"
                onClick={() => {
                  history(-1);
                }}>
                Click here to go back.
              </p>
            </>
          ) : (
            <>
              <h1>User: {userProfile?.name}</h1>
              <ShowUserDetails userprofile={userProfile} />
              {/* {error ? <p>{error}</p> : <ShowUserDetails userprofile={userProfile} />} */}

              <h1>My Posts</h1>
              {/* <div> */}
              <ShowStatusMessage display={postsError} text={postsError} />
              <CardGroup className="postscontainer">
                {noPostsToShow ? <p>There are no posts to show.</p> : ""}
                <Row>
                  {posts.map((post) => (
                    <ShowPost postdata={post} key={post.id} />
                  ))}
                </Row>
              </CardGroup>
              {/* </div> */}

              <div className="follow">
                <h1>Followed Users</h1>
                {noFollowingsToShow ? <p>No users followed.</p> : ""}
                {userProfile?.following.map((followedProfile) => (
                  <ShowUser key={`followed-${followedProfile.name}`} user={followedProfile} followed={usersFollowed} />
                ))}
              </div>

              <div className="follow">
                <h1>Followers</h1>
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
          )}
        </>
      )}
    </>
  );
}

export default ViewSingleProfile;
