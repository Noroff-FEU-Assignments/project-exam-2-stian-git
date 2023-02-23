import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Spinner } from "react-bootstrap";
import { InputTags } from "react-bootstrap-tagsinput";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { apiBaseUrl, mediaUrlSyntax } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import useGetSinglePost from "../hooks/useGetSinglePost";
import ShowSpinner from "./ShowSpinner";
import ShowStatusMessage from "./ShowStatusMessage";

const postApiUrl = apiBaseUrl + "/posts/";

const schema = yup.object().shape({
  title: yup.string().required("Title is a required field"),
  body: yup.string(),
  media: yup.string().matches(mediaUrlSyntax, "Please enter a valid url to an image"),
});

export default function EditPostForm(props) {
  const [loggedIn] = useContext(SessionContext);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [postSuccess, setPostSuccess] = useState(null);
  const [tags, setTags] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  //const [imageUrl, setImageUrl] = useState(null);
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
      setIsEditMode(true);
      setTags(postData?.tags);
      // Register existing postdata as formdata to avoid updating a post with missing data:
      setValue("title", postData?.title);
      setValue("body", postData?.body);
      setValue("media", postData?.media);
    }
  }, [postData, postId, setValue]);
  async function postContent(data) {
    setIsPosting(true);
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

      if (response.status === 200) {
        setPostError(null);
        setPostSuccess(true);
        if (!isEditMode) {
          // reset form
          document.querySelector("form").reset();
          // reset tagsfield
          setTags([]);
          // reset yup
          reset();
        }
      }
    } catch (error) {
      // 400 : media url cannot be accessed.
      if (error.response?.status === 400) {
        setPostError("Saving post failed. Maybe the media url is wrong?");
        // Remove posterror to avoid error to reappear after closing:
        setTimeout(() => {
          setPostError(null);
        }, 3000);

        setPostSuccess(null);
      } else {
        setPostError("Saving post failed: " + error);
        // Remove posterror to avoid error to reappear after closing:
        setTimeout(() => {
          setPostError(null);
        }, 3000);
        setPostSuccess(null);
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
    <>
      {loading ? (
        <ShowSpinner />
      ) : (
        <Container>
          <Col md={12} lg={8} xl={6}>
            {error ? <p>{error}</p> : ""}
            <Form onSubmit={handleSubmit(postContent)} className="postform">
              <Form.Group className="mb-3 postform-input" controlId="edistPostFormTitle">
                <Form.Control className="postform-input-field" type="text" placeholder="Title" {...register("title")} defaultValue={isEditMode ? postData?.title : ""} />
                <Form.Text className="text-muted">{errors.title ? <span className="form-requirement">{errors.title.message}</span> : ""}</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3 postform-input" controlId="edistPostFormBody">
                <Form.Control className="postform-input-field" as="textarea" rows={3} placeholder="Body" {...register("body")} defaultValue={isEditMode ? postData?.body : ""} />
              </Form.Group>
              <Form.Group className="mb-3 postform-input" controlId="edistPostFormTags">
                <div className="input-group">
                  <InputTags
                    className="form-control postform-input-field postform-input-field-tags"
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
              <Form.Group className="mb-3 postform-input" controlId="editPostFormMedia">
                <Form.Control
                  type="text"
                  className="postform-input-field"
                  //onKeyUp={(e) => {
                  //setImageUrl(e.target.value);
                  //}}
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
              <Button variant="primary" type="submit" className="postform-button">
                {isPosting ? (
                  <>
                    <span className="">Saving...</span>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  </>
                ) : (
                  "Save Post"
                )}
              </Button>
            </Form>
            <ShowStatusMessage display={postError} text={postError} />
            <ShowStatusMessage display={postSuccess} isSuccess={true} />
          </Col>
        </Container>
      )}
    </>
  );
}
