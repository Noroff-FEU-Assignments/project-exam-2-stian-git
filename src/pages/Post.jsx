import React from "react";
import { Container } from "react-bootstrap";
import EditPostForm from "../components/EditPostForm.jsx";

function Post() {
  return (
    <>
      <Container>
        <h1>New Post</h1>
      </Container>

      <EditPostForm />
    </>
  );
}

export default Post;
