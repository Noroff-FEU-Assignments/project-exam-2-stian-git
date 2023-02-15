import React, { useContext, useEffect, useState } from "react";
import { Button, CardGroup, Row } from "react-bootstrap";
import { getPosts } from "../constants/commonLib";
import { postsToLoad, testPost } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import ShowPost from "./ShowPost";

function AllPosts() {
  const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [noMorePages, setNoMorePages] = useState(false);

  useEffect(() => {
    getAllPosts();
  }, []);
  // style the posts for equal height.
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
      {isLoggedIn ? (
        <CardGroup>
          <Row className="postscontainer">
            {posts.map((post) => (
              <ShowPost postdata={post} key={post.id} />
            ))}
          </Row>
        </CardGroup>
      ) : (
        "User not logged in"
      )}
      {noMorePages ? <Button disabled>No more posts.</Button> : <Button onClick={getAllPosts}>Load more posts</Button>}
    </>
  );
}

export default AllPosts;
