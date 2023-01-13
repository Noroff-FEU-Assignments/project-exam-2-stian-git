import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { apiBaseUrl, apiToken } from "../constants/variables";

// function updateContent() {

// }
const postApiUrl = apiBaseUrl + "/posts/";
//const authConfig = { headers: { Authorization: `Bearer ${apiToken}` } };
const schema = yup.object().shape({
    title: yup.string().required("Title is a required field"),
    body: yup.string(),
});

function EditPostForm() {
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    async function postContent(data) {
        setIsPosting(true);
        //console.log(data);
        try {
            // is this the right way to add headers? (it works though, but defaults?)
            axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
            const response = await axios.post(postApiUrl, data);
            console.log(response);
        } catch (error) {
            console.log("And error occured:" + error);
            setPostError("Saving post failed: " + error);
            // handle error.
            // 400 : if media url cannot be accessed. Used for other things?
            // What if the token has expired or is wrong?
        } finally {
            setIsPosting(false);
        }
    }
    // Add fields for tags and media below.
    // Test media with a preview and check if it works.
    return (
        <Form onSubmit={handleSubmit(postContent)}>
            <Form.Group className="mb-3" controlId="edistPostFormTitle">
                <Form.Control type="text" placeholder="Title" {...register("title")} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="edistPostFormBody">
                <Form.Control as="textarea" rows={3} placeholder="Body" {...register("body")} />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default EditPostForm;

// Object needs to look like this:
// {
//     "title": "Test Title 3",
//     "body": "This is some strange text put in the body, <br> with a HTML-tag inside it too.",
//     "tags": [],
//     "media": ""
//   }
