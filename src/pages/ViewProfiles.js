// Todo:
// Retrieve usersFollowed: https://noroff-api-docs.netlify.app/social-endpoints/profiles#single-entry
// Toggle follow/unfollow

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { apiBaseUrl, apiToken } from "../constants/variables";

const usersApiUrl = apiBaseUrl + "/profiles";

function ViewProfiles() {
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [usersFollowed, setUsersFollowed] = useState([]);

    useEffect(() => {
        async function getUsers() {
            setLoadingProfiles(true);
            try {
                axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
                const response = await axios.get(usersApiUrl);
                console.log(response.data);
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
        async function getUsersFollowed() {}
    });

    function toggleFollow(e) {
        console.log(e);
        console.log(e.target.dataset.username);
    }
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Avatar</th>
                    <th>User Info</th>
                    <th>Stats</th>
                </tr>
            </thead>
            <tbody>
                {users.map((profile) => (
                    <tr>
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
                                Follow
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default ViewProfiles;
