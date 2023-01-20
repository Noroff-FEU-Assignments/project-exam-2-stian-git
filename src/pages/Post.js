import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { EditPostForm } from "../components/EditPostForm.js";
//import EditPostForm from "../components/EditPostForm";

function Post() {
    //const [searchParams, setSearchParams] = useSearchParams();
    //const { edit } = useSearchParams();

    const { postid } = useParams();
    // if (postid) {
    //     console.log(postid);
    // }

    return <EditPostForm id={postid} />;
}

export default Post;
