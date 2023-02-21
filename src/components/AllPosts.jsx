import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, CardGroup, Col, Container, Form, Row } from "react-bootstrap";
import { apiBaseUrl, postsToLoad, tagsToShow } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import ShowPost from "./ShowPost";

function AllPosts() {
  const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [noMorePages, setNoMorePages] = useState(false);
  const [postsType, setPostsType] = useState();
  const [allTags, setAllTags] = useState([]);
  const [loadTags, setLoadTags] = useState(false);

  useEffect(() => {
    getAllPosts();
  }, [postsType]);

  useEffect(() => {
    function countTags() {
      let cummulatedTags = [];
      let counter = {};

      //Collects every tag and puts them in a array:
      posts.forEach((post) => {
        cummulatedTags = cummulatedTags.concat(post.tags);
      });
      //Creates a object with tagname as key, and number of occurences as value
      for (let tag of cummulatedTags.flat()) {
        if (counter[tag]) {
          counter[tag] += 1;
        } else {
          counter[tag] = 1;
        }
      }
      // Converts the above object to an array:
      const countedArr = Object.entries(counter);
      // Sorts the array based on number of occurences (index 0 = most):
      let sortedArr = countedArr.sort((tag1, tag2) => (tag1[1] < tag2[1] ? 1 : tag1[1] > tag2[1] ? -1 : 0));
      // Remove blank/empty tags:
      const removedBlanksArray = sortedArr.filter((tag) => tag[0].trim() !== "");
      // Only a defined number of tags will be shown, removing the rest:
      const filteredArray = removedBlanksArray.filter((tag, index) => index < tagsToShow);
      // Sets the allTags-state with the data that will be presented.
      setAllTags(filteredArray);
    }
    if (loadTags == true) {
      countTags();
      console.log("Loaded tags...");
      setLoadTags(false);
    }
  }, [posts]);
  //console.log(isLoggedIn.accessToken);
  // style the posts for equal height.
  async function getAllPosts() {
    const data = await getPosts(postsToLoad, offset, postsType);
    // check if data count is correct;
    setPosts(posts.concat(data));
    setOffset(offset + postsToLoad);

    if (data.length < postsToLoad) {
      console.log("There are no more posts to load...removing button.");
      setNoMorePages(true);
    }
  }

  async function getPosts(qty = 20, offset = 0, type = "valueall") {
    let postsApiUrl;
    switch (type) {
      case "valueall":
        postsApiUrl = apiBaseUrl + "/posts?_author=true&_comments=true&_reactions=true&limit=" + qty + "&offset=" + offset;
        setLoadTags(true);
        break;
      case "valuefollowed":
        postsApiUrl = apiBaseUrl + "/posts/following?_author=true&_comments=true&_reactions=true&limit=" + qty + "&offset=" + offset;

        break;
      default:
        //console.log(type);
        postsApiUrl = apiBaseUrl + "/posts?_tag=" + type + "&_author=true&_comments=true&_reactions=true&limit=" + qty + "&offset=" + offset;
        break;
    }
    // Add a check against the postsType to set the URL and reset offset.
    console.log("Type:", postsType);

    console.log("Retrieving " + qty + " posts, skipping: " + offset);
    //const allPostsApiUrl = apiBaseUrl + "/posts?_author=true&_comments=true&_reactions=true&limit=" + qty + "&offset=" + offset;
    //const allPostsApiUrl = "https://nf-api.onrender.com/api/v1/social/posts?_tag=winter&_author=true&_comments=true&_reactions=true&limit=" + qty + "&offset=" + offset;
    //const allPostsApiUrl = "https://nf-api.onrender.com/api/v1/social/posts/following?_author=true&_comments=true&_reactions=true&limit=" + qty + "&offset=" + offset;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
      const response = await axios.get(postsApiUrl);
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
  function changePostsType(e) {
    console.log(e.target.value);
    // Clear previous posts:
    setPosts([]);
    // Reset offset:
    setOffset(0);
    // Reset MorePagesButton
    setNoMorePages(false);
    // Set the new type:
    setPostsType(e.target.value);
  }

  return (
    <>
      <h1 className="posttypeform__section-h1">Posts</h1>
      <Form onChange={changePostsType} className="posttypeform">
        <div className="posttypeform__section">
          <h2 className="posttypeform__section-item-h2">Filter posts:</h2>
          <Form.Check type="radio" value={"valueall"} label="Show All" name="posttypeselection" id="typeall1" defaultChecked className="posttypeform__section-item" />
          <Form.Check type="radio" value={"valuefollowed"} label="Only Followed" name="posttypeselection" id="typefollowed" className="posttypeform__section-item" />
        </div>
        <div className="posttypeform__section">
          <h2 className="posttypeform__section-item-h2">Filter by tag:</h2>
          {allTags.map((tag, index) => (
            <Form.Check type="radio" value={tag[0]} label={`# ${tag[0]} (${tag[1]})`} name="posttypeselection" id={`tag-${index}`} key={`tag-${index}`} className="posttypeform__section-item" />
          ))}
        </div>
      </Form>
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
