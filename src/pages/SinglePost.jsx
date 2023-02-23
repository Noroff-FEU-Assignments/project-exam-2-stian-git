import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ShowPost from "../components/ShowPost";
import ShowSpinner from "../components/ShowSpinner";
import ShowStatusMessage from "../components/ShowStatusMessage";
import ShowUserDetails from "../components/ShowUserDetails";

import useGetSinglePost from "../hooks/useGetSinglePost";
import useGetSingleProfile from "../hooks/useGetSingleProfile";

function SinglePost() {
  const { postid } = useParams();
  const { postData, loading, error } = useGetSinglePost(postid);
  const { userData, userLoading } = useGetSingleProfile(postData?.author?.name);
  const history = useNavigate();

  return (
    <>
      {loading ? (
        <ShowSpinner />
      ) : (
        <>
          {error ? (
            <>
              <ShowStatusMessage text={`Post ID: ${postid} could not be loaded and probably do not exist.`} display={true} />
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
          )}
        </>
      )}
    </>
  );
}

export default SinglePost;
