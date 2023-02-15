import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Image } from "react-bootstrap";
import { InputTags } from "react-bootstrap-tagsinput";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { apiBaseUrl, mediaUrlSyntax } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import useGetSinglePost from "../hooks/useGetSinglePost";
//

//const mediaUrlSyntax = /((http|https):\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?/;

// When editing without making changes, the image shows, but is not shown as a valid url.

// }
const postApiUrl = apiBaseUrl + "/posts/";

const schema = yup.object().shape({
  title: yup.string().required("Title is a required field"),
  body: yup.string(),
  //media: yup.string().when().nullable(yup.string().matches(mediaUrlSyntax, "Please enter a valid url to an image"), ),
  media: yup.string().matches(mediaUrlSyntax, "Please enter a valid url to an image"),
});

export default function EditPostForm(props) {
  const [loggedIn, setLoggedIn] = useContext(SessionContext);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [tags, setTags] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const postId = props?.id;
  const { postData, loading, error } = useGetSinglePost(postId);

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    // Make sure we only retrieve the postdata if we are editing.
    if (postId) {
      console.log(postId);
      setIsEditMode(true);
      //GetSinglePost(postId);
      //console.log(postData.tags);
      setTags(postData?.tags);
      setValue("title", postData?.title);
      setValue("body", postData?.body);
      setValue("media", postData?.media);
    }
  }, [postData]);

  async function postContent(data) {
    setIsPosting(true);
    console.log(data);
    try {
      // is this the right way to add headers? (it works though, but defaults?)
      axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
      let response;
      if (isEditMode) {
        const updatePostApiUrl = postApiUrl + postId;
        response = await axios.put(updatePostApiUrl, data);
      } else {
        response = await axios.post(postApiUrl, data);
      }

      //console.log(response);
      if (response.status === 200) {
        console.log("Your post was saved!");
      }
    } catch (error) {
      console.log(error);
      // 400 : if media url cannot be accessed. Used for other things?
      if (error.response?.status === 400) {
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

  // Add function to add a new tag using tabs. (avoid unsaved tag to be ignored)

  return (
    <Container>
      <Col md={6}>
        {error ? <p>{error}</p> : ""}
        <Form onSubmit={handleSubmit(postContent)}>
          <Form.Group className="mb-3" controlId="edistPostFormTitle">
            <Form.Control type="text" placeholder="Title" {...register("title")} defaultValue={isEditMode ? postData?.title : ""} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="edistPostFormBody">
            <Form.Control as="textarea" rows={3} placeholder="Body" {...register("body")} defaultValue={isEditMode ? postData?.body : ""} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="edistPostFormTags">
            <div className="input-group">
              <InputTags
                className="form-control"
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
            <Form.Control
              type="text"
              onKeyUp={(e) => {
                setImageUrl(e.target.value);
              }}
              placeholder="Image URL"
              {...register("media")}
              defaultValue={isEditMode ? postData?.media : ""}
            />
            <Form.Text className="text-muted">
              {errors.media ? (
                <span className="form-requirement">{errors.media.message}</span>
              ) : (
                <Image
                  className="mediaThumb"
                  src={document.querySelector("#editPostFormMedia")?.value}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.target.style.display = "inline";
                  }}
                  thumbnail
                />
              )}
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Col>
    </Container>
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
