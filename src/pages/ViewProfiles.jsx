import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import SearchUser from "../components/SearchUser";
import ShowUserDetails from "../components/ShowUserDetails";
import { apiBaseUrl, profilesToLoad, storageKeyFollowedUsers } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import useLocalStorage from "../hooks/useLocalStorage";

//const myUserName = "smg_testuser";
//console.log("Username: ", myUserName);

const bannerTest = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80.jpg";

function ViewProfiles() {
  const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingUsersFollowed, setLoadingUsersFollowed] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [usersFollowed, setUsersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);
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
    const usersApiUrl = apiBaseUrl + "/profiles?sortOrder=asc&limit=" + profilesToLoad + "&offset=" + offset;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
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
      axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
      const response = await axios.get(usersFollowedApiUrl);
      //console.log(response.data.following);
      if (response.status === 200) {
        const data = await response.data;
        setUsersFollowed(data.following);
      }
    } catch (error) {
      //console.log(error);
      setError("Failed to retrieve users followed: " + error);
    } finally {
      setLoadingUsersFollowed(false);
    }
  }

  // Add users banner on Stats?
  // example banner: https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80.jpg
  return (
    <>
      <SearchUser />
      <h1>Profiles</h1>
      <Row className="user-wrapper">
        {users.map((profile) => (
          <ShowUserDetails userprofile={profile} key={profile.name} />
        ))}
      </Row>
      <Container className="button__wrapper">{noMoreProfiles ? <Button disabled>No more profiles</Button> : <Button onClick={getUsers}>More profiles</Button>}</Container>
    </>
  );
}

export default ViewProfiles;
