// Todo:
// Retrieve usersFollowed: https://noroff-api-docs.netlify.app/social-endpoints/profiles#single-entry
// Check if above still works.
// Toggle follow/unfollow
// Add my own default banner.
// Todo 28.1: Remove main container with link. Replace it with a button shown on hover?

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { followUser, IsFollowed, unfollowUser } from "../constants/commonLib";
import { apiBaseUrl, apiToken, defaultAvatar, profilesToLoad } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import useLocalStorage from "../hooks/useLocalStorage";

//const myUserName = "smg_testuser";
//console.log("Username: ", myUserName);

const bannerTest = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80.jpg";
//const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);

function ViewProfiles() {
  const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingUsersFollowed, setLoadingUsersFollowed] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [usersFollowed, setUsersFollowed] = useLocalStorage("socialUsersFollowed", []);
  const [offset, setOffset] = useState(0);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);

  //console.log("Logged in user:", isLoggedIn.name);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getUsersFollowed();
  }, []);

  async function getUsers() {
    setLoadingProfiles(true);
    const usersApiUrl = apiBaseUrl + "/profiles?limit=" + profilesToLoad + "&offset=" + offset;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
      const response = await axios.get(usersApiUrl);
      //console.log(response.data);
      setUsers(users.concat(response.data));
      setOffset(offset + profilesToLoad);
      //console.log("New offset:", offset);
      //console.log("Number of users: " + response.data.length);
      if (response.data.length < profilesToLoad) {
        console.log("There ar eno more posts to load...disable button.");
        setNoMoreProfiles(true);
      }
    } catch (error) {
      setError("Retrieving profiles failed: ", error);
    } finally {
      setLoadingProfiles(false);
    }
  }

  async function getUsersFollowed() {
    setLoadingUsersFollowed(true);
    const usersFollowedApiUrl = apiBaseUrl + "/profiles/" + isLoggedIn.name + "?_following=true";
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

  function toggleFollow(e) {
    const username = e.target.dataset.username;
    console.log(e);
    console.log(e.target.dataset.username);
    if (e.target.innerText === "Follow") {
      // Follow:
      const userIsAdded = followUser(username);
      if (userIsAdded) {
        e.target.innerText = "Unfollow";
      }
      // Do we need error handling?
    } else {
      // Unfollow:
      const userIsRemoved = unfollowUser(username);
      if (userIsRemoved) {
        e.target.innerText = "Follow";
      }
    }
    // Update usersFollowed - Not needed?
  }

  // Add users banner on Stats?
  // example banner: https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80.jpg
  return (
    <>
      <Row className="user-wrapper">
        {users.map((profile, idx) => (
          <Col className={IsFollowed(profile.name, usersFollowed) ? "user user-isfollowed" : "user"} key={idx} style={{ backgroundImage: `url(${profile.banner ? profile.banner : "none"})` }}>
            <NavLink to={"./" + profile.name} className="user-link">
              <div className="user__profile-imagecontainer">
                <img src={profile.avatar ? profile.avatar : defaultAvatar} className="user__profile-imagecontainer-img" />
              </div>

              <div className="user__profile">
                <div className="user__profile-details">
                  <h3 className="user__profile-details-name">{profile.name}</h3>
                  <p className="user__profile-details-email">{profile.email}</p>
                </div>
                <div className="user__profile-counts">
                  <p className="user__profile-counts-detail">Posts: {profile._count.posts}</p>
                  <p className="user__profile-counts-detail">Followers: {profile._count.followers}</p>
                  <p className="user__profile-counts-detail">Following: {profile._count.following}</p>
                </div>
                <div className="user__profile-follow">
                  <Button data-username={profile.name} size="sm" variant="success" onClick={toggleFollow}>
                    {IsFollowed(profile.name, usersFollowed) ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              </div>
            </NavLink>
          </Col>
        ))}
      </Row>
      {noMoreProfiles ? <Button disabled>No more profiles</Button> : <Button onClick={getUsers}>More profiles</Button>}
    </>
    // <Table striped bordered hover>
    //   <thead>
    //     <tr>
    //       {/* <th className="user__profile-imagecontainer">Avatar</th> */}
    //       <th>User Info</th>
    //       <th>Stats</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {users.map((profile) => (
    //       <tr key={profile.name}>
    //         {/* concider to remove first column on small screens? */}
    //         {/* <td className="user__profile-imagecontainer">{profile.avatar ? <img src={profile.avatar} className="user__profile-imagecontainer-img" /> : ""}</td> */}
    //         <td className="user__profile-content" style={{ background: bannerTest }}>
    //           <p className="user__profile-content-name">{profile.name}</p>
    //           <p className="user__profile-content-email">
    //             <a href={`mailto:${profile.email}`} className="user__profile-content-email-link">
    //               {profile.email}
    //             </a>
    //           </p>
    //         </td>
    //         <td className="user__profile-counts">
    //           <p className="user__profile-counts-detail">Posts: {profile._count.posts}</p>
    //           <p className="user__profile-counts-detail">Followers: {profile._count.followers}</p>
    //           <p className="user__profile-counts-detail">Following: {profile._count.following}</p>
    //           <Button data-username={profile.name} size="sm" variant="success" onClick={toggleFollow}>
    //             {IsFollowed(profile.name, usersFollowed) ? "Unfollow" : "Follow"}
    //           </Button>
    //           <Link to={"./" + profile.name}>Visit {profile.name}</Link>
    //         </td>
    //       </tr>
    //     ))}
    //   </tbody>
    // </Table>
  );
}

export default ViewProfiles;
