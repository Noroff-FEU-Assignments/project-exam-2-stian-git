import React from "react";
import { useParams } from "react-router-dom";
import EditPostForm from "../components/EditPostForm.js";

function EditPost() {
  const { postid } = useParams();
  return <EditPostForm id={postid} />;
}

export default EditPost;
