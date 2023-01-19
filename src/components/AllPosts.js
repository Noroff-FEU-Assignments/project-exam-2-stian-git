import React, { useContext, useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { getPosts, showPosts } from "../constants/commonLib";
import { postsToLoad, testPost } from "../constants/variables";
import SessionContext from "../context/SessionContext";

function AllPosts() {
    const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [noMorePages, setNoMorePages] = useState(false);

    useEffect(() => {
        getAllPosts();
    }, []);

    async function getAllPosts() {
        const data = await getPosts(postsToLoad, offset);
        // check if data count is correct;
        // set data.
        //console.log(data);
        //console.log(data.length);
        setPosts(posts.concat(data));
        setOffset(offset + postsToLoad);

        //
        // Need to add a check that sets
        // noMorePages when the array length is less than postsToLoad.
        //
        //
    }

    function loadMorePosts() {
        console.log("Loading page..." + offset + postsToLoad);

        getAllPosts();
    }
    //return <p>Hello</p>;
    return (
        <>
            {isLoggedIn ? <Row className="postscontainer">{showPosts(posts)}</Row> : "User not logged in"}
            {noMorePages ? "" : <Button onClick={loadMorePosts}>Load more posts</Button>}
        </>
    );
}

export default AllPosts;
