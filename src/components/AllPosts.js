import React, { useContext } from "react";
import { Row } from "react-bootstrap";
import { showPosts } from "../constants/commonLib";
import { testPost } from "../constants/variables";
import SessionContext from "../context/SessionContext";

function AllPosts() {
    const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);

    return <>{isLoggedIn ? <Row>{showPosts(testPost)}</Row> : "User not logged in"}</>;
}

export default AllPosts;
