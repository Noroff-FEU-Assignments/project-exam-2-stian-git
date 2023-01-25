import axios from "axios";
import { Picker } from "emoji-picker-element";
import moment from "moment/moment";
import { Button, Card, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { apiBaseUrl, apiToken, emojiVersion } from "./variables";
//import useLocalStorage from "../hooks/useLocalStorage";
//const userInfo = useLocalStorage("socialSessionInfo");

function toggleComments(e) {
  const areCommentsShowing = e.target.dataset.showcomments === "true";
  if (areCommentsShowing) {
    e.target.dataset.showcomments = "false";
    e.target.innerText = "Show";
    e.target.parentElement.nextElementSibling.hidden = true;
  } else {
    e.target.dataset.showcomments = "true";
    e.target.innerText = "Hide";
    e.target.parentElement.nextElementSibling.hidden = false;
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
    console.log(response);
    if (response.status === 200) {
      //hide/delete this post from the dom.
      e.target.parentElement.parentElement.innerHTML = `<i>Post deleted.</>`;
      // Add more styling here...
      //e.target.parentElement.parentElement.style.backgroundColor = "transparent";
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

function showPost(e) {
  console.log("Showing post;", e);
}

export function showPosts(arr, owner = "nothing12345667", showAll = false) {
  return arr.map((post) => {
    //console.log(post);
    const isPostOwner = owner === post.author?.name;
    // Add a "Be the first to react"-feature.
    return (
      <Card key={post.id} className="post" style={{ width: "18rem" }} onClick={showPost}>
        {post.media ? <Card.Img variant="top" src={post.media} /> : ""}
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Text title={moment(post.created).format("MMM Do YYYY, HH:mm:ss")} className="post__body-created">
            {formatTime(post.created)}
          </Card.Text>
          <Card.Text>{post.body}</Card.Text>
        </Card.Body>
        <Card.Body>
          {post.reactions ? post.reactions.map((reaction) => `${reaction.symbol} ${reaction.count}`) : ""}
          <Button size="sm" data-postid={post.id} onClick={reactToPost}>
            React!
          </Button>
        </Card.Body>
        <ListGroup className="list-group-flush post__comment-header">
          <p className="post__comment-count">{post.comments ? post.comments.length : "No"} Comments </p>
          {isPostOwner ? (
            <Button data-postid={post.id} variant="link" className="post__comment-viewtoggler" onClick={deletePost}>
              Delete
            </Button>
          ) : (
            ""
          )}

          {showAll ? "" : <Link to={`/post/${post.id}`}>View</Link>}
          {isPostOwner ? <Link to={`/post/${post.id}/edit`}>Edit</Link> : ""}
          <Button data-showcomments="false" variant="link" className="post__comment-viewtoggler" onClick={toggleComments}>
            Show
          </Button>
        </ListGroup>
        <ListGroup className="list-group-flush post__comment-wrapper" hidden={true}>
          {post.comments
            ? post.comments.map((comment) => (
                <ListGroup.Item key={comment.id}>
                  <p>{comment.body}</p>
                  <p>{comment.owner}</p>
                  <p title={moment(comment.created).format("MMM Do YYYY, HH:mm:ss")}>{formatTime(comment.created)}</p>
                </ListGroup.Item>
              ))
            : ""}
        </ListGroup>
      </Card>
    );
  });
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
  return followedArr.some((user) => user.name === name);
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
