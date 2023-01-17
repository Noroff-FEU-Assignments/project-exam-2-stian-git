// Todo:
// Retrieve usersFollowed: https://noroff-api-docs.netlify.app/social-endpoints/profiles#single-entry
// Toggle follow/unfollow

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { followUser, IsFollowed, unfollowUser } from "../constants/commonLib";
import { apiBaseUrl, apiToken } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";

const myUserName = "smg_testuser";
const usersApiUrl = apiBaseUrl + "/profiles";
const usersFollowedApiUrl = apiBaseUrl + "/profiles/" + myUserName + "?_following=true";

//const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);

function ViewProfiles() {
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const [loadingUsersFollowed, setLoadingUsersFollowed] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [usersFollowed, setUsersFollowed] = useLocalStorage("socialUsersFollowed", []);

    useEffect(() => {
        async function getUsers() {
            setLoadingProfiles(true);
            try {
                axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
                const response = await axios.get(usersApiUrl);
                //console.log(response.data);
                setUsers(response.data);
            } catch (error) {
                setError("Retrieving profiles failed: ", error);
            } finally {
                setLoadingProfiles(false);
            }
        }
        getUsers();
    }, []);

    useEffect(() => {
        setLoadingUsersFollowed(true);
        //console.log("Retrieving usersFollowed");
        //console.log(usersFollowedApiUrl);
        async function getUsersFollowed() {
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
        getUsersFollowed();
    }, []);

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
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th className="user__profile-imagecontainer">Avatar</th>
                    <th>User Info</th>
                    <th>Stats</th>
                </tr>
            </thead>
            <tbody>
                {users.map((profile) => (
                    <tr key={profile.name}>
                        {/* concider to remove first column on small screens? */}
                        <td className="user__profile-imagecontainer">{profile.avatar ? <img src={profile.avatar} className="user__profile-imagecontainer-img" /> : ""}</td>
                        <td className="user__profile-content">
                            <p className="user__profile-content-name">{profile.name}</p>
                            <p className="user__profile-content-email">
                                <a href={`mailto:${profile.email}`} className="user__profile-content-email-link">
                                    {profile.email}
                                </a>
                            </p>
                        </td>
                        <td className="user__profile-counts">
                            <p className="user__profile-counts-detail">Posts: {profile._count.posts}</p>
                            <p className="user__profile-counts-detail">Followers: {profile._count.followers}</p>
                            <p className="user__profile-counts-detail">Following: {profile._count.following}</p>
                            <Button data-username={profile.name} size="sm" variant="success" onClick={toggleFollow}>
                                {IsFollowed(profile.name, usersFollowed) ? "Unfollow" : "Follow"}
                            </Button>
                            <Link to={"./" + profile.name}>Visit {profile.name}</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default ViewProfiles;
