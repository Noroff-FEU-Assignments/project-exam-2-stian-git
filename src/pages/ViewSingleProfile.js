import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showPosts } from "../constants/commonLib";
import { apiBaseUrl, apiToken } from "../constants/variables";
import useLocalStorage from "../hooks/useLocalStorage";

function ViewSingleProfile() {
    // retrieve username from url:
    const { username } = useParams();
    const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
    const getUsersPostsApiUrl = apiBaseUrl + "/profiles/" + username + "/posts?_author=true&_comments=true&_reactions=true";
    const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);

    // should profile be null or array?
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setLoadingProfile(true);
        // get all userinfo
        async function getUserProfile() {
            try {
                axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
                const response = await axios(getProfileApiUrl);
                if (response.status === 200) {
                    console.log(response.data);
                    setUserProfile(response.data);
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
            try {
                axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
                const response = await axios(getUsersPostsApiUrl);
                if (response.status === 200) {
                    console.log(response.data);
                    setPosts(response.data);
                } else {
                    console.log("Something went wrong retrieving posts");
                }
            } catch (error) {
                console.log("Retrieving posts failed: ", error);
            } finally {
                //setLoadingProfile(false);
            }
        }
        getUsersPosts();
    }, []);

    return (
        <>
            <div>
                <h1>{username}</h1>
                <p>{userProfile?.email}</p>
            </div>
            <hr />
            <div>{showPosts(posts, loggedIn.name)}</div>
        </>
    );
}

export default ViewSingleProfile;
