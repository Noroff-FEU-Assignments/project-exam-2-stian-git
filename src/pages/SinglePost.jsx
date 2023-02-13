import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getSinglePost, showPosts } from "../constants/commonLib";

function SinglePost() {
  const { postid } = useParams();
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    async function getPostData() {
      const data = await getSinglePost(postid);
      //console.log("Data:", data);
      setPostData(data);
      //console.log(typeof postData);
    }
    getPostData();
  }, []);

  //console.log("This is post id: " + postid);

  // GetSinglePost from commonLib
  // Display "everything".
  // Show userProfile next to it.
  // Concider tags?
  //getSinglePost(postid);
  //return <p>Nothing</p>;
  return <>{showPosts([postData], undefined, false)}</>;
}

export default SinglePost;
