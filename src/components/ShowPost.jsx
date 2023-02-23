// Handle errors when reactions fail?
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form, ListGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiBaseUrl, availableEmojies } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import FormatTimeStamp from "./FormatTimeStamp";

import ShowComment from "./ShowComment";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

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

  function countReactions(allReactions) {
    let counter = 0;
    // filter out emojies to display only the ones available for this site. (other frontends may use other reactions)
    const filteredArray = allReactions.filter((reaction) => {
      return availableEmojies.includes(reaction.symbol);
    });
    // Counts the total number of reactions for each available emoji.
    filteredArray.forEach((element) => {
      counter = counter + element.count;
    });
    return counter;
  }

  async function reactToPost(e) {
    e.stopPropagation();
    const postId = e.target.closest(".post").dataset.postid;
    const reaction = e.target.innerHTML.split(" ")[0];
    const count = e.target.innerHTML.split(" ")[1];

    // Make API Call.
    const isEmojiAdded = await addReaction(postId, reaction);

    // Update counter if success
    if (isEmojiAdded) {
      e.target.innerHTML = `${reaction} ${parseInt(count) + 1}`;
    } else {
      // Marks the failed emoji temporarily to indicate an error has occured.
      e.target.classList.add("comments__reactions-emoji-error");
      setTimeout(() => {
        e.target.classList.remove("comments__reactions-emoji-error");
      }, 2000);
    }
  }
  function countThisEmoji(emoji, reactions) {
    const currentEmoji = reactions?.find((reaction) => reaction.symbol === emoji);
    if (currentEmoji) {
      return currentEmoji.count;
    }
    return 0;
  }
  async function addReaction(id, emoji) {
    const addReactionUrl = apiBaseUrl + "/posts/" + id + "/react/" + emoji;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
      const response = await axios.put(addReactionUrl);
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
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
        reset();

        //Add a success message below the button?
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
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <i className="fa-solid fa-trash-can" data-postid={post?.id} onClick={deletePost}></i>
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
        <ListGroup className="list-group-flush post__comment-header">
          <p className="post__comment-count">{post?.comments ? post.comments.length : "No"} Comments </p>
          <p className="post__comment-count">{post?.reactions ? countReactions(post.reactions) : "No"} Reactions</p>
        </ListGroup>
        <ListGroup className="list-group-flush comments">
          <ListGroup.Item className="comments__reactions">
            {availableEmojies.map((emoji, index) => (
              <p key={index} className="comments__reactions-emoji" onClick={reactToPost}>
                {emoji} {countThisEmoji(emoji, post?.reactions)}
              </p>
            ))}
          </ListGroup.Item>
        </ListGroup>

        {/* Comments: */}
        <ListGroup className="list-group-flush comments" hidden={hideComments}>
          {post?.comments ? post.comments.map((comment) => <ShowComment key={comment?.id} commentData={comment} />) : ""}
        </ListGroup>
        {/* {props.showlarge ? <PostCommentForm id={post?.id} /> : ""} */}
        {props.showlarge ? (
          <ListGroup.Item className="comments__form">
            <Form onSubmit={handleSubmit(addComment)}>
              <Form.Group className="" controlId={`formComment-${post?.id}`}>
                <Form.Control as="textarea" placeholder="Write Comment" className="comments__form-commentfield" {...register("body")} />
                <Button variant="primary" type="submit" className="comments__form-submitbutton" data-postid={post?.id}>
                  Send
                </Button>
              </Form.Group>
            </Form>
          </ListGroup.Item>
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
