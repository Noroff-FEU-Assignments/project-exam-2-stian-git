import React, { useEffect, useState } from "react";
//import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ShowPost from "../components/ShowPost";

import useGetSinglePost from "../hooks/useGetSinglePost";

function SinglePost() {
  const { postid } = useParams();
  const { postData, loading, error } = useGetSinglePost(postid);

  // Show userProfile next to it.
  // Concider tags?

  return <ShowPost postdata={postData} comments={false} />;
}

export default SinglePost;
