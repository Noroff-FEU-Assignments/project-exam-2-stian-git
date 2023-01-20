import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { InputTags } from "react-bootstrap-tagsinput";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { apiBaseUrl, apiToken, mediaUrlSyntax } from "../constants/variables";
//
// Status: 20.1.2023:
// Error shows up. Possibly something to do with the fillout of tags.
// if moving from edit to new post, the fields should be emptied.
//

//const mediaUrlSyntax = /((http|https):\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?/;

// }
const postApiUrl = apiBaseUrl + "/posts/";
//const authConfig = { headers: { Authorization: `Bearer ${apiToken}` } };
const schema = yup.object().shape({
    title: yup.string().required("Title is a required field"),
    body: yup.string(),
    media: yup.string().matches(mediaUrlSyntax, "Please enter a valid url to an image"),
});

export function EditPostForm(props) {
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState(null);
    const [tags, setTags] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [oldPostData, setOldPostData] = useState(null);
    const postId = props?.id;

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    useEffect(() => {
        async function getSinglePost(id) {
            console.log("Props", id);
            const getPostUrl = apiBaseUrl + "/posts/" + id;
            try {
                axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
                const response = await axios(getPostUrl);
                //console.log(response.data);
                setOldPostData(response.data);
                setTags(oldPostData.tags);
            } catch (error) {
                console.log("Failed to retrieve data.");
            }
        }
        if (postId) {
            setIsEditMode(true);
            getSinglePost(postId);
        }
    }, []);
    async function postContent(data) {
        setIsPosting(true);
        console.log(data);
        try {
            // is this the right way to add headers? (it works though, but defaults?)
            axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
            const response = await axios.post(postApiUrl, data);
            //console.log(response);
            if (response.status === 200) {
                console.log("Your post was saved!");
            }
        } catch (error) {
            // 400 : if media url cannot be accessed. Used for other things?
            if (error.response.status === 400) {
                setPostError("Saving post failed: " + error);
                console.log("Image not found.");
            } else {
                console.log("Something went wrong...");
                setPostError("Saving post failed: " + error);
            }
            // What if the token has expired or is wrong?
        } finally {
            setIsPosting(false);
        }
    }
    // Fix to avoid problems with the tag-input box (Enter would remove items).
    function ignoreEnter(e) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    function imageError(e) {
        console.log(e);
        e.target.style.display = "none";
        errors.media = "Image could not be loaded. Please check your url.";
    }
    function showPreview(e) {
        //console.log(e);
        //console.log(e.target.value);
    }
    // Add fields for tags and media below.
    // Test media with a preview and check if it works.
    // Add function to add a new tag using tabs. (avoid unsaved tag to be ignored)

    return (
        <Form onSubmit={handleSubmit(postContent)}>
            <Form.Group className="mb-3" controlId="edistPostFormTitle">
                <Form.Control type="text" placeholder="Title" {...register("title")} value={isEditMode ? oldPostData?.title : ""} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="edistPostFormBody">
                <Form.Control as="textarea" rows={3} placeholder="Body" {...register("body")} value={isEditMode ? oldPostData?.body : ""} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="edistPostFormTags">
                <div className="input-group">
                    <InputTags
                        values={tags}
                        onKeyDown={ignoreEnter}
                        placeholder="Tags"
                        onTags={(value) => {
                            setTags(value.values);
                            setValue("tags", value.values);
                        }}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="editPostFormMedia">
                <Form.Control type="text" onKeyUp={showPreview} placeholder="Image URL" {...register("media")} value={isEditMode ? oldPostData?.media : ""} />
                <Form.Text className="text-muted">{errors.media ? <span className="form-requirement">{errors.media.message}</span> : <Image className="mediaThumb" src={document.querySelector("#editPostFormMedia")?.value} onError={imageError} thumbnail />}</Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

//export default EditPostForm;

// Object needs to look like this:
// {
//     "title": "Test Title 3",
//     "body": "This is some strange text put in the body, <br> with a HTML-tag inside it too.",
//     "tags": [],
//     "media": ""
//   }
