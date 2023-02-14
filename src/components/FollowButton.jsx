import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toggleFollow } from "../constants/commonLib";
import { apiBaseUrl, apiToken } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";

function FollowButton(props) {
  const [usersFollowed, setUsersFollowed] = useLocalStorage("socialUsersFollowed", []);
  const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);
  const [userIsFollowed, setUserIsFollowed] = useState(false);
  const [isProfilesPage, setIsProfilesPage] = useState(false);

  useEffect(() => {
    function isFollowed(name) {
      //const result = usersFollowed?.some((user) => user.name === name);
      const result = props.followed?.some((user) => user.name === name);
      //console.log(name, result);
      //console.log(name, result, "Followed:", usersFollowed);
      setUserIsFollowed(result);
    }
    // Checks the current username against the array of followed users.
    isFollowed(props.username);
    const currentSitePath = document.location.pathname;
    setIsProfilesPage(currentSitePath.includes("profiles"));
  }, [props]);

  function toggleFollow(e) {
    const username = e.target.dataset.username;
    //console.log(e);
    //console.log(e.target.dataset.username);
    const profileContainer = e.target.closest(".col");
    //console.log(profileContainer);
    if (e.target.innerText === "Follow") {
      // Follow:
      const userIsAdded = saveFollowedUserChange(username, true);
      if (userIsAdded) {
        e.target.innerText = "Unfollow";
      }
      profileContainer.classList.add("user-isfollowed");
      // Do we need error handling?
    } else {
      // Unfollow:
      const userIsRemoved = saveFollowedUserChange(username);
      profileContainer.classList.remove("user-isfollowed");
      if (userIsRemoved) {
        e.target.innerText = "Follow";
        console.log(isProfilesPage, username, loggedIn.name);
        //console.log(doc);
        if (isProfilesPage && loggedIn.name === window.location.pathname.split("/profiles/")[1]) {
          console.log("Removing profile");
          profileContainer.remove();
        }
      }
      // IF user is on own profile = hide the profile from UI.
    }
  }

  async function saveFollowedUserChange(username, adduser = false) {
    let followUserChangeApiUrl = apiBaseUrl + "/profiles/" + username + "/unfollow";

    if (adduser) {
      followUserChangeApiUrl = apiBaseUrl + "/profiles/" + username + "/follow";
    }
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
      const response = await axios.put(followUserChangeApiUrl);
      if (response.status === 200) {
        const data = await response.data;
        // Update localstorage with the new array.
        setUsersFollowed(data.following);
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  return (
    <Button data-username={props.username} size="sm" variant="success" onClick={toggleFollow} className="follow__container-buttons-follow">
      {userIsFollowed ? "Unfollow" : "Follow"}
    </Button>
  );
}

export default FollowButton;
