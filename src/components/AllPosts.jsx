import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, CardGroup, Col, Container, Row } from "react-bootstrap";
import { apiBaseUrl, postsToLoad } from "../constants/variables";
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
  //console.log(isLoggedIn.accessToken);
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

  async function getPosts(qty = 20, offset = 0) {
    console.log("Retrieving " + qty + " posts, skipping: " + offset);
    const allPostsApiUrl = apiBaseUrl + "/posts?_author=true&_comments=true&_reactions=true&limit=" + qty + "&offset=" + offset;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
      const response = await axios.get(allPostsApiUrl);
      console.log(response);
      if (response.status === 200) {
        //return true;
        //console.log(response.data);
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      return [];
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
      <Container className="button__wrapper">{noMorePages ? <Button disabled>No more posts.</Button> : <Button onClick={getAllPosts}>Load more posts</Button>}</Container>
    </>
  );
}

export default AllPosts;
