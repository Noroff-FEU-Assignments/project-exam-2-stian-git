import axios from "axios";
import { Picker } from "emoji-picker-element";
import moment from "moment/moment";
import { Button, Card, Col, Container, Form, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { apiBaseUrl, apiToken, emojiVersion } from "./variables";

//import useLocalStorage from "../hooks/useLocalStorage";
//const userInfo = useLocalStorage("socialSessionInfo");

function toggleComments(e) {
  const postContainer = e.target.closest(".post");
  const areCommentsShowing = postContainer.dataset.showcomments === "true";
  if (areCommentsShowing) {
    postContainer.dataset.showcomments = "false";
    // Hide comments
    postContainer.childNodes[postContainer.childNodes.length - 2].hidden = true;
  } else {
    postContainer.dataset.showcomments = "true";
    // Show comments
    postContainer.childNodes[postContainer.childNodes.length - 2].hidden = false;
    // concider adding a limitation here... show first 10 comments, etc?
  }
}

async function deletePost(e) {
  const postId = e.target.dataset.postid;
  const deletePostApiUrl = apiBaseUrl + "/posts/" + postId;
  //console.log("Deleting: " + e.target.dataset.postid);
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
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

async function addReaction(id, emoji) {
  console.log("Adding " + emoji + " to " + id);
  const addReactionUrl = apiBaseUrl + "/posts/" + id + "/react/" + emoji;
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    const response = await axios.put(addReactionUrl);
    console.log(response);
    if (response.status === 200) {
      console.log("Reaction added");
      return true;
    }
  } catch (error) {
    console.log("An error occured adding reaction." + error);
  }
}
function reactToPost(e) {
  //console.log("Reacting to: " + e.target.dataset.postid);
  //const reactIcon = "👍";
  //
  // Move version to variables!!
  //
  const emojiSelected = new Picker({ emojiVersion: 14.0 });
  // Create its own element, or a modal?
  e.target.appendChild(emojiSelected);
  emojiSelected.addEventListener("emoji-click", (icon) => {
    //console.log("Adding " + icon.detail.unicode + " to " + e.target.dataset.postid);
    const emojiToAdd = icon.detail.unicode;
    // run apicall
    addReaction(e.target.dataset.postid, icon.detail.unicode);
    // update
    // remove the element:
    emojiSelected.remove();
  });
  //console.log(emojiSelected);
}

function ShowPost(e) {
  console.log("Showing post;", e);
  const currentSitePath = document.location.pathname;
  //console.log(currentSitePath);
  const isProfilesPage = currentSitePath.includes("profiles");
  //console.log(isProfilesPage);
  const postId = e.target.closest(".post").dataset.postid;
  //console.log(postContainer.dataset.postid);
  //console.log(postId);
  //const navigate = useNavigate();
  if (isProfilesPage) {
    // show comments
    toggleComments(e);
  } else {
    // forward user to /posts/postid
    window.location.href = `/post/${postId}`;
  }
}

export function showPosts(arr, owner, showAll = false) {
  return arr.map((post, index) => {
    //console.log(post.id);
    const isPostOwner = owner === post.author?.name;
    // Add a "Be the first to react"-feature.
    return (
      <Card key={index} className="post" data-showcomments="false" data-postid={post.id}>
        {post.media ? <Card.Img variant="top" src={post.media} /> : ""}
        <Card.Body onClick={ShowPost}>
          {isPostOwner ? (
            <Card.Text className="post__body-toolbar">
              <Link to={`/post/${post.id}/edit`}>
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <i className="fa-solid fa-trash-can" data-postid={post.id} onClick={deletePost}></i>
            </Card.Text>
          ) : (
            ""
          )}
          <Card.Title>
            <h2 className="card-title">{post.title}</h2>
          </Card.Title>
          <Card.Text title={moment(post.created).format("MMM Do YYYY, HH:mm:ss")} className="post__body-created">
            {formatTime(post.created)} (by{" "}
            <a className="post__body-created-link" href={`/profiles/${post.author?.name}`}>
              {post.author?.name}
            </a>
            )
          </Card.Text>
          <Card.Text className="post__body-maintext">{post.body}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush post__comment-header" onClick={ShowPost}>
          <p className="post__comment-count">{post.comments ? post.comments.length : "No"} Comments </p>
          <p className="post__comment-count">{post.reactions ? post.reactions.length : "No"} Reactions</p>
          {/* {post.reactions ? post.reactions.map((reaction) => `${reaction.symbol} ${reaction.count}`) : ""} */}
          {/* <Button size="sm" data-postid={post.id} onClick={reactToPost}>
            React!
          </Button> */}
          {/* {showAll ? "" : <Link to={`/post/${post.id}`}>View</Link>} */}
          {/* {isPostOwner ? <Link to={`/post/${post.id}/edit`}>Edit</Link> : ""} */}
          {/* <Button data-showcomments="false" variant="link" className="post__comment-viewtoggler" onClick={toggleComments}>
            Show
          </Button> */}
        </ListGroup>
        <ListGroup className="list-group-flush comments" hidden={true}>
          {post.comments
            ? post.comments.map((comment) => (
                <ListGroup.Item key={comment.id} className="comments__body">
                  <p className="comments__body-writtenby" title={moment(comment.created).format("MMM Do YYYY, HH:mm:ss")}>
                    <a className="comments__body-writtenby-link" href={`/profiles/${comment.owner}`}>
                      {comment.owner}
                    </a>{" "}
                    @ {formatTime(comment.created)}
                  </p>
                  <p className="comments__body-text">{comment.body}</p>

                  {/* <p title={moment(comment.created).format("MMM Do YYYY, HH:mm:ss")}>{formatTime(comment.created)}</p> */}
                </ListGroup.Item>
              ))
            : ""}
        </ListGroup>
        <ListGroup.Item className="comments__form">
          <Form>
            <Form.Group className="mb-3" controlId={`formComment-${post.id}`}>
              <Form.Control as="textarea" placeholder="Write Comment" className="comments__form-commentfield" />
              <Button variant="primary" type="submit" className="comments__form-submitbutton" data-postid={post.id}>
                Send
              </Button>
            </Form.Group>
          </Form>
        </ListGroup.Item>
      </Card>
    );
  });
}

export function showSendCommentButton(e) {
  //e.preventDefault();
  console.log("ShowSendCommentButton", e);
  // There is a conflict with the toggling of comment showing or not.
  // Might need to move the comment outside of the Card. Requires additional styling!
}

export function formatTime(timestamp) {
  //const str = new Date(timestamp);

  //console.log(new Date(timestamp));
  //console.log(str.toLocaleDateString());
  const todaysDate = Date.now();
  const isThisHour = moment(timestamp).isSame(todaysDate, "hour");
  // if (isThisHour) {
  //     return moment(timestamp).fromNow();
  // }

  // const isToday = moment(timestamp).isSame(timestamp2, "day");
  // if (isToday) {
  //     return moment(timestamp).fromNow();
  // }
  const isThisWeek = moment(timestamp).isSame(todaysDate, "week");

  if (isThisWeek) {
    return moment(timestamp).fromNow();
  }

  //console.log(isThisWeek);

  return moment(timestamp).format("MMM Do YYYY");
}

export function IsFollowed(name, followedArr) {
  return followedArr?.some((user) => user.name === name);
}

export async function followUser(username) {
  const followUserApiUrl = apiBaseUrl + "/profiles/" + username + "/follow";
  console.log(followUserApiUrl);
  console.log("Following: " + username);
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    const response = await axios.put(followUserApiUrl);
    console.log(response);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export async function unfollowUser(username) {
  const unfollowUserApiUrl = apiBaseUrl + "/profiles/" + username + "/unfollow";
  //console.log(followUserApiUrl);
  //console.log("Following: " + username);
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    const response = await axios.put(unfollowUserApiUrl);
    console.log(response);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export async function getSinglePost(postid) {
  console.log("Retrieving post ID: " + postid);
  const singlePostApiUrl = apiBaseUrl + "/posts/" + postid + "?_author=true&_comments=true&_reactions=true";
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    const response = await axios.get(singlePostApiUrl);
    console.log(response);
    if (response.status === 200) {
      //return true;
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

export async function getPosts(qty = 20, offset = 0) {
  console.log("Retrieving " + qty + " posts, skipping: " + offset);
  const allPostsApiUrl = apiBaseUrl + "/posts?_author=true&_comments=true&_reactions=true&limit=" + qty + "&offset=" + offset;
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    const response = await axios.get(allPostsApiUrl);
    console.log(response);
    if (response.status === 200) {
      //return true;
      console.log(response.data);
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}
