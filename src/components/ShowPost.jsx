import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiBaseUrl, availableEmojies } from "../constants/variables";
import SessionContext from "../context/SessionContext";
import FormatTimeStamp from "./FormatTimeStamp";
import PostCommentForm from "./PostCommentForm";
import ShowComment from "./ShowComment";

function ShowPost(props) {
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [loggedIn, setLoggedIn] = useContext(SessionContext);
  const [post, setPost] = useState(null);
  const [hideComments, setHideComments] = useState(true);
  useEffect(() => {
    setPost(props.postdata);
    if (props.comments === false) {
      setHideComments(false);
    }
    //console.log(props);
    if (props?.postdata?.author?.name === loggedIn.name) {
      //console.log("This is the owner!");
      setIsPostOwner(true);
      //console.log(props);
    }
  }, [props]);

  async function deletePost(e) {
    e.stopPropagation();
    const postId = e.target.dataset.postid;
    const deletePostApiUrl = apiBaseUrl + "/posts/" + postId;

    //console.log("Deleting: " + e.target.dataset.postid);
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
      const response = await axios.delete(deletePostApiUrl);
      if (response.status === 200) {
        const postContentContainer = e.target.parentElement.parentElement;
        postContentContainer.innerHTML = `<i>Post deleted.</>`;
        setTimeout(() => {
          postContentContainer.parentElement.remove();
        }, 4000);
      }
    } catch (error) {
      console.log("An error occured deleting post: ", error);
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
    //console.log(reaction);
    //console.log("Reacting to: " + postId);
    //console.log(e.target.innerHTML);

    // Make API Call.
    const isEmojiAdded = await addReaction(postId, reaction);
    //const isEmojiAdded = true;
    // Update counter if success
    if (isEmojiAdded) {
      //console.log("Emoji has been added");
      e.target.innerHTML = `${reaction} ${parseInt(count) + 1}`;
    } else {
      // handle error?
    }
  }
  function countThisEmoji(emoji, reactions) {
    const currentEmoji = reactions?.find((reaction) => reaction.symbol === emoji);
    //console.log(currentEmoji?.count);
    if (currentEmoji) {
      return currentEmoji.count;
    }
    return 0;
  }
  async function addReaction(id, emoji) {
    console.log("Adding " + emoji + " to " + id);
    const addReactionUrl = apiBaseUrl + "/posts/" + id + "/react/" + emoji;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${loggedIn.accessToken}` };
      const response = await axios.put(addReactionUrl);
      console.log(response);
      if (response.status === 200) {
        console.log("Reaction added");
        return true;
      }
    } catch (error) {
      console.log("An error occured adding reaction." + error);
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

          {/* {post?.comments ? post.comments.map((comment) => <ShowComment key={comment?.id} commentData={comment} />) : ""} */}
          {/* hidden={hideComments} */}
        </ListGroup>
        <ListGroup className="list-group-flush comments" hidden={hideComments}>
          {post?.comments ? post.comments.map((comment) => <ShowComment key={comment?.id} commentData={comment} />) : ""}
        </ListGroup>
        {props.showlarge ? <PostCommentForm id={post?.id} /> : ""}
      </Card>
      {/* {props.showlarge ? "Showing " : "Hiding"} */}
    </>
  );
}

export default ShowPost;
