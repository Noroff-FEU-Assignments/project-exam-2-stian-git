import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import SearchUser from "../components/SearchUser";
import ShowSpinner from "../components/ShowSpinner";
import ShowStatusMessage from "../components/ShowStatusMessage";
import ShowUserDetails from "../components/ShowUserDetails";
import { apiBaseUrl, profilesToLoad, storageKeyFollowedUsers } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import useLocalStorage from "../hooks/useLocalStorage";

function ViewProfiles() {
  const [isLoggedIn] = useContext(SessionContext);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  //const [loadingUsersFollowed, setLoadingUsersFollowed] = useState(false);
  const [loadingUsers, setLoadingUsersFollowed] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  //const [usersFollowed, setUsersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);
  const [setUsersFollowed] = useLocalStorage(storageKeyFollowedUsers, []);
  const [offset, setOffset] = useState(0);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);

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
      setUsers(users.concat(response.data));
      setOffset(offset + profilesToLoad);
      if (response.data.length < profilesToLoad) {
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
      if (response.status === 200) {
        const data = await response.data;
        setUsersFollowed(data.following);
      }
    } catch (error) {
      // Ignoring this error because it's not that important.
    } finally {
      setLoadingUsersFollowed(false);
    }
  }

  return (
    <>
      <SearchUser />
      {error ? (
        <ShowStatusMessage display={true} text={`Unable to retrieve user profiles. Please reload the page to try again.`} />
      ) : (
        <>
          <h1>Profiles</h1>
          <Row className="user-wrapper">
            {users.map((profile) => (
              <ShowUserDetails userprofile={profile} key={profile.name} />
            ))}
          </Row>
          {loadingProfiles ? <ShowSpinner /> : ""}
          <Container className="button__wrapper">{noMoreProfiles ? <Button disabled>No more profiles</Button> : <Button onClick={getUsers}>More profiles</Button>}</Container>
        </>
      )}
    </>
  );
}

export default ViewProfiles;
