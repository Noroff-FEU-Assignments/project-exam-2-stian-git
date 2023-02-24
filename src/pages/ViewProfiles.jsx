import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import SearchUser from "../components/SearchUser";
import ShowSpinner from "../components/ShowSpinner";
import ShowStatusMessage from "../components/ShowStatusMessage";
import ShowUserDetails from "../components/ShowUserDetails";
import { apiBaseUrl, profilesToLoad, storageKeyFollowedUsers } from "../constants/variables";
import SessionContext from "../context/SessionContext";

function ViewProfiles() {
  const [isLoggedIn] = useContext(SessionContext);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(profilesToLoad);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);

  useEffect(() => {
    async function getUsers() {
      setLoadingProfiles(true);
      const usersApiUrl = apiBaseUrl + "/profiles?sortOrder=asc&limit=" + profilesToLoad;
      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
        const response = await axios.get(usersApiUrl);
        setUsers(response.data);
        if (response.data.length < profilesToLoad) {
          setNoMoreProfiles(true);
        }
        //return data;
      } catch (error) {
        setError("Retrieving profiles failed: ", error);
      } finally {
        setLoadingProfiles(false);
      }
    }
    getUsers();
  }, [isLoggedIn]);

  async function getMoreUsers() {
    setLoadingProfiles(true);
    const usersApiUrl = apiBaseUrl + "/profiles?sortOrder=asc&limit=" + profilesToLoad + "&offset=" + offset;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
      const response = await axios.get(usersApiUrl);
      const newUsers = users.concat(response.data);
      setUsers(newUsers);
      if (response.data.length < profilesToLoad) {
        setNoMoreProfiles(true);
      }
    } catch (error) {
      setError("Retrieving profiles failed: ", error);
    } finally {
      setLoadingProfiles(false);
    }
  }

  useEffect(() => {
    async function getUsersFollowed() {
      const usersFollowedApiUrl = apiBaseUrl + "/profiles/" + isLoggedIn.name + "?_following=true";
      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
        const response = await axios.get(usersFollowedApiUrl);
        if (response.status === 200) {
          const data = await response.data;
          window.localStorage.setItem(storageKeyFollowedUsers, JSON.stringify(data.following));
        }
      } catch (error) {
        // Ignoring this error because it's not that important.
      }
    }
    getUsersFollowed();
  }, [isLoggedIn]);

  return (
    <>
      <SearchUser />
      {error ? (
        <ShowStatusMessage display={true} text={`Unable to retrieve user profiles. Please reload the page to try again.`} />
      ) : (
        <>
          <h1>Profiles</h1>
          <Row className="user-wrapper">
            {users.map((profile, index) => (
              <ShowUserDetails userprofile={profile} key={index} />
            ))}
          </Row>
          {loadingProfiles ? <ShowSpinner /> : ""}
          <Container className="button__wrapper">
            {noMoreProfiles ? (
              <Button disabled>No more profiles</Button>
            ) : (
              <Button
                onClick={() => {
                  setOffset(offset + profilesToLoad);
                  getMoreUsers();
                }}>
                More profiles
              </Button>
            )}
          </Container>
        </>
      )}
    </>
  );
}

export default ViewProfiles;
