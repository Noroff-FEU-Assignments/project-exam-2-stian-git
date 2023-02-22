import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ShowPost from "../components/ShowPost";
import ShowUserDetails from "../components/ShowUserDetails";

import useGetSinglePost from "../hooks/useGetSinglePost";
import useGetSingleProfile from "../hooks/useGetSingleProfile";

function SinglePost() {
  const { postid } = useParams();
  const { postData, loading, error } = useGetSinglePost(postid);
  const { userData, userLoading, userError } = useGetSingleProfile(postData?.author?.name);

  return (
    <>
      <ShowPost postdata={postData} comments={false} showlarge={true} />
      {userData ? (
        <Container className="large">
          <h1>Published by</h1>
          <ShowUserDetails userprofile={userData} />
        </Container>
      ) : (
        ""
      )}

      {userLoading ? <p>Loading</p> : ""}
    </>
  );
}

export default SinglePost;
