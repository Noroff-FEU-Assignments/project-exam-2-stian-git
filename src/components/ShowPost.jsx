// Handle errors when reactions fail?
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form, ListGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiBaseUrl } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import FormatTimeStamp from "./FormatTimeStamp";
import ShowComment from "./ShowComment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ReactToPost from "./ReactToPost";
import ShowStatusMessage from "./ShowStatusMessage";

const schema = yup.object().shape({
  body: yup.string().min(3, "Need 3 characters").required("Please enter a comment before sending."),
});

function ShowPost(props) {
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [loggedIn, setLoggedIn] = useContext(SessionContext);
  const [post, setPost] = useState(null);
  const [hideComments, setHideComments] = useState(true);
  const [deleteError, setDeleteError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setPost(props.postdata);
    if (props.comments === false) {
      setHideComments(false);
    }
    if (props?.postdata?.author?.name === loggedIn.name) {
      setIsPostOwner(true);
    }
  }, [props]);

  async function deletePost(e) {
    e.stopPropagation();
    const postId = e.target.dataset.postid;
    const deletePostApiUrl = apiBaseUrl + "/posts/" + postId;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
      const response = await axios.delete(deletePostApiUrl);
      if (response.status === 200) {
        const postContentContainer = e.target.parentElement.parentElement;
        postContentContainer.innerHTML = `<i>Post deleted.</>`;
        setTimeout(() => {
          postContentContainer.parentElement.remove();
        }, 4000);
      } else {
        setDeleteError(`Failed to delete post.`);
      }
    } catch (error) {
      setDeleteError(`Failed to delete post: ${error}`);
    }
  }

  function linkToPost(e) {
    const currentSitePath = document.location.pathname;
    const isSinglePostPage = currentSitePath.includes("post");
    const postId = e.target.closest(".post").dataset.postid;
    if (!isSinglePostPage) {
      // show comments
      window.location.href = `/post/${postId}`;
    }
  }

  async function addComment(data) {
    setIsSending(true);
    const addCommentApiUrl = apiBaseUrl + "/posts/" + post.id + "/comment";
    try {
      const response = await axios.post(addCommentApiUrl, data);
      if (response.status === 200) {
        const data = await response.data;
        post.comments.push(data);
        setCommentError(null);
        reset();
      }
    } catch (error) {
      setCommentError("Commenting failed: " + error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <Card onClick={linkToPost} key={post?.id} className={props.showlarge ? "post large" : "post"} data-showcomments="false" data-postid={post?.id}>
        {props.showlarge ? (
          <Card.Title>
            <h2 className="card-title">{post?.title}</h2>
          </Card.Title>
        ) : (
          ""
        )}
        {post?.media ? (
          <Card.Img
            variant="top"
            src={post.media}
            onClick={() => setShowModal(true)}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          ""
        )}
        <Card.Body>
          {isPostOwner ? (
            <Card.Text className="post__body-toolbar">
              <Link to={`/post/${post?.id}/edit`}>
                <i className="fa-solid fa-pen-to-square actionicon actionicon-edit"></i>
              </Link>
              <i className="fa-solid fa-trash-can actionicon actionicon-delete" data-postid={post?.id} onClick={deletePost}></i>
            </Card.Text>
          ) : (
            ""
          )}
          {props.showlarge ? (
            ""
          ) : (
            <Card.Title>
              <h2 className="card-title">{post?.title}</h2>
            </Card.Title>
          )}
          <Card.Text title={moment(post?.created).format("MMM Do YYYY, HH:mm:ss")} className="post__body-created">
            <FormatTimeStamp timestamp={post?.created} /> (by{" "}
            <a className="post__body-created-link" href={`/profiles/${post?.author?.name}`}>
              {post?.author?.name}
            </a>
            )
          </Card.Text>
          <Card.Text className="post__body-maintext">{post?.body}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush post__tags">
          {post?.tags?.map((tag, index) => (
            <p className="post__tags-tag" key={`tagid-` + index}>
              {tag}
            </p>
          ))}
        </ListGroup>
        <ReactToPost data={post} />
        {/* Comments: */}
        <ListGroup className="list-group-flush comments" hidden={hideComments}>
          {post?.comments ? post.comments.map((comment) => <ShowComment key={comment?.id} commentData={comment} />) : ""}
        </ListGroup>
        {props.showlarge ? (
          <>
            <ListGroup.Item className="comments__form">
              <Form onSubmit={handleSubmit(addComment)}>
                <Form.Group className="" controlId={`formComment-${post?.id}`}>
                  <Form.Control as="textarea" placeholder="Write Comment" className="comments__form-commentfield" {...register("body")} />
                  {commentError ? <ShowStatusMessage display={true} text={`Failed to save comment. Please try again.`} /> : ""}
                  <Button variant="primary" type="submit" className="comments__form-submitbutton" data-postid={post?.id}>
                    Send
                  </Button>
                </Form.Group>
              </Form>
            </ListGroup.Item>
          </>
        ) : (
          ""
        )}
      </Card>

      {/* ImageModal: */}
      <Modal show={showModal} onHide={() => setShowModal(false)} aria-labelledby="imageModal" onClick={() => setShowModal(false)} centered fullscreen>
        <Modal.Body>
          <Card.Img
            className="modal-body-img"
            src={post?.media}
            onClick={() => setShowModal(false)}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShowPost;
