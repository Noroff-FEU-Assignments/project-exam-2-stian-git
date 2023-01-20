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
        setPosts(posts.concat(data));
        setOffset(offset + postsToLoad);

        if (data.length < postsToLoad) {
            console.log("There are no more posts to load...removing button.");
            setNoMorePages(true);
        }
    }

    return (
        <>
            {isLoggedIn ? <Row className="postscontainer">{showPosts(posts)}</Row> : "User not logged in"}
            {noMorePages ? <Button disabled>No more posts.</Button> : <Button onClick={getAllPosts}>Load more posts</Button>}
        </>
    );
}

export default AllPosts;
