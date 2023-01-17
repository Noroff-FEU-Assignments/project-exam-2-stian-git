import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function ViewSingleProfile() {
    // retrieve username from url:
    const { username } = useParams();

    useEffect(() => {
        // get all userinfo
        // get all posts
    }, []);

    return <div>ViewSingleProfile: {username}</div>;
}

export default ViewSingleProfile;
