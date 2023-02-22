import React from "react";
import { useParams } from "react-router-dom";
import EditPostForm from "../components/EditPostForm.jsx";

function EditPost() {
  const { postid } = useParams();
  return (
    <>
      <h1>Edit Post</h1>
      <EditPostForm id={postid} />
    </>
  );
}

export default EditPost;
