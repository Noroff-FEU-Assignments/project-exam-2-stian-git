import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { apiBaseUrl, apiToken } from "../constants/variables";

const usersApiUrl = apiBaseUrl + "/profiles";

function ViewProfiles() {
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <ul>
            {users.map((profile) => (
                <li key={profile.name} className="user">
                    <Row className="user__profile">
                        {/* <div className="user__profile"> */}
                        <Col className="user__profile-imagecontainer">{profile.avatar ? <img src={profile.avatar} className="user__profile-imagecontainer-img" /> : ""}</Col>
                        <Col className="user__profile-content">
                            <p className="user__profile-content-name">{profile.name}</p>
                            <p className="user__profile-content-email">
                                <a href={`mailto:${profile.email}`} className="user__profile-content-email-link">
                                    {profile.email}
                                </a>
                            </p>
                        </Col>
                        <Col className="user__profile-counts">
                            <p>Followers: {profile._count.followers}</p>
                            <p>Following: {profile._count.following}</p>
                        </Col>
                        {/* <div className="user__profile-content"></div> */}
                        {/* </div> */}
                    </Row>
                </li>
            ))}
        </ul>
    );
}

export default ViewProfiles;
