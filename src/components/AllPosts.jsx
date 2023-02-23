import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, CardGroup, Container, Form, Row } from "react-bootstrap";
import { apiBaseUrl, postsToLoad, tagsToShow } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import ShowPost from "./ShowPost";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ShowStatusMessage from "./ShowStatusMessage";
import { useNavigate } from "react-router-dom";
import ShowSpinner from "./ShowSpinner";

const schema = yup.object().shape({
  value: yup.string().required("ID or tag is required."),
});
function AllPosts() {
  const [isLoggedIn] = useContext(SessionContext);
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(postsToLoad);
  const [noMorePages, setNoMorePages] = useState(false);
  const [postsType, setPostsType] = useState("valueall");
  const [allTags, setAllTags] = useState([]);
  const [error, setError] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const history = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    async function getAllPosts() {
      setLoadingPosts(true);
      let postsApiUrl;
      switch (postsType) {
        case "valueall":
          postsApiUrl = apiBaseUrl + "/posts?_author=true&_comments=true&_reactions=true&limit=" + postsToLoad;
          break;
        case "valuefollowed":
          postsApiUrl = apiBaseUrl + "/posts/following?_author=true&_comments=true&_reactions=true&limit=" + postsToLoad;

          break;
        default:
          postsApiUrl = apiBaseUrl + "/posts?_tag=" + postsType + "&_author=true&_comments=true&_reactions=true&limit=" + postsToLoad;
          break;
      }

      try {
        axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
        const response = await axios.get(postsApiUrl);
        if (response.status === 200) {
          const data = await response.data;
          console.log(response);
          setPosts(data);
          if (data.length < postsToLoad) {
            setNoMorePages(true);
          }
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoadingPosts(false);
      }
    }

    getAllPosts();
  }, [postsType, isLoggedIn]);

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
    countTags();
  }, [posts]);

  async function getMorePosts() {
    setLoadingPosts(true);
    let postsApiUrl = getUrl();
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${isLoggedIn.accessToken}` };
      const response = await axios.get(postsApiUrl);
      if (response.status === 200) {
        const data = await response.data;
        setPosts(posts.concat(data));
        if (data.length < postsToLoad) {
          setNoMorePages(true);
        }
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoadingPosts(false);
    }
  }

  function getUrl() {
    let postsApiUrl;
    switch (postsType) {
      case "valueall":
        postsApiUrl = apiBaseUrl + "/posts?_author=true&_comments=true&_reactions=true&limit=" + postsToLoad + "&offset=" + offset;
        break;
      case "valuefollowed":
        postsApiUrl = apiBaseUrl + "/posts/following?_author=true&_comments=true&_reactions=true&limit=" + postsToLoad + "&offset=" + offset;
        break;
      default:
        postsApiUrl = apiBaseUrl + "/posts?_tag=" + postsType + "&_author=true&_comments=true&_reactions=true&limit=" + postsToLoad + "&offset=" + offset;
        break;
    }
    return postsApiUrl;
  }
  // Resets when post filter is changed:
  function changePostsType(e) {
    // Clear previous posts:
    setPosts([]);
    // Reset offset:
    setOffset(0);
    // Reset MorePagesButton
    setNoMorePages(false);
    // Set the new type:
    setPostsType(e.target.value);
  }

  function doSearch(data) {
    // forward to post id if it's a int, otherwise: use the value as a tag and sort :
    if (parseInt(data.value)) {
      window.location.href = "/post/" + data.value;
    } else {
      // Make an object to support the existing changePostsType-function.
      const tagObject = {};
      tagObject.target = data;
      changePostsType(tagObject);
    }
  }

  return (
    <>
      {error ? (
        <>
          <ShowStatusMessage display={error} text={`Loading posts failed. Please try again.`} />
          <p
            className="link"
            onClick={() => {
              history(-1);
            }}>
            Click here to go back.
          </p>
        </>
      ) : (
        <>
          <Form onSubmit={handleSubmit(doSearch)} className="searchform">
            <Form.Group className="searchform__post" controlId={`formPostSearch`}>
              <Form.Control placeholder="Post ID or Tag Search" className="searchform__post-input" {...register("value")} />
              <Button variant="primary" type="submit" className="searchform__post-submitbutton">
                Search
              </Button>
            </Form.Group>
            <Form.Text className="text-muted">{errors.value ? <span className="form-requirement">{errors.value.message}</span> : ""}</Form.Text>
          </Form>
          <h1 className="posttypeform__section-h1">Posts</h1>

          <Form onChange={changePostsType} className="posttypeform">
            <div className="posttypeform__section">
              <h2 className="posttypeform__section-item-h2">Filter posts:</h2>
              <Form.Check type="radio" value={"valueall"} label="Show All" name="posttypeselection" id="typeall1" defaultChecked className="posttypeform__section-item" />
              <Form.Check type="radio" value={"valuefollowed"} label="Only Followed" name="posttypeselection" id="typefollowed" className="posttypeform__section-item" />
            </div>
            <div className="posttypeform__section">
              <h2 className="posttypeform__section-item-h2">Trending tags:</h2>
              {allTags.map((tag, index) => (
                <Form.Check type="radio" value={tag[0]} label={`# ${tag[0]} (${tag[1]})`} name="posttypeselection" id={`tag-${index}`} key={`tag-${index}`} className="posttypeform__section-item" />
              ))}
            </div>
          </Form>
          <CardGroup className="postscontainer-wrapper">
            <Row className="postscontainer">
              {posts.map((post) => (
                <ShowPost postdata={post} key={post.id} />
              ))}
            </Row>
          </CardGroup>
          {loadingPosts ? <ShowSpinner /> : ""}
          <Container className="button__wrapper">
            {noMorePages ? (
              <Button disabled>No more posts.</Button>
            ) : (
              <Button
                onClick={() => {
                  setOffset(offset + postsToLoad);
                  getMorePosts();
                }}>
                Load more posts
              </Button>
            )}
          </Container>
        </>
      )}
    </>
  );
}

export default AllPosts;
