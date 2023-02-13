import axios from "axios";
import moment from "moment/moment";
import { Button, Card, Col, Container, Form, ListGroup } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { apiBaseUrl, apiToken, availableEmojies, defaultAvatar, emojiVersion } from "./variables";

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
    return false;
  }
}

async function reactToPost(e) {
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

function ShowPost(e) {
  //console.log("Showing post;", e);
  const currentSitePath = document.location.pathname;
  //console.log(currentSitePath);
  const isProfilesPage = currentSitePath.includes("profiles");
  const isSinglePostPage = currentSitePath.includes("post");
  //console.log(isProfilesPage);
  const postId = e.target.closest(".post").dataset.postid;
  //console.log(postContainer.dataset.postid);
  //console.log(postId);
  //const navigate = useNavigate();
  if (isProfilesPage || isSinglePostPage) {
    // show comments
    toggleComments(e);
  } else {
    // forward user to /posts/postid
    window.location.href = `/post/${postId}`;
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

function countThisEmoji(emoji, reactions) {
  const currentEmoji = reactions?.find((reaction) => reaction.symbol === emoji);
  //console.log(currentEmoji?.count);
  if (currentEmoji) {
    return currentEmoji.count;
  }
  return 0;
}

export function showPosts(arr, owner, hideAll = true) {
  return arr.map((post, index) => {
    //console.log(post.id);
    const isPostOwner = owner === post.author?.name;
    // Add a "Be the first to react"-feature.
    return (
      <Card key={index} className="post" data-showcomments="false" data-postid={post.id}>
        {post.media ? (
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
          <p className="post__comment-count">{post.reactions ? countReactions(post.reactions) : "No"} Reactions</p>
        </ListGroup>
        <ListGroup className="list-group-flush comments" hidden={hideAll}>
          <ListGroup.Item className="comments__reactions">
            {availableEmojies.map((emoji, index) => (
              <p key={index} className="comments__reactions-emoji" onClick={reactToPost}>
                {emoji} {countThisEmoji(emoji, post.reactions)}
              </p>
            ))}
          </ListGroup.Item>
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
export function toggleFollow(e) {
  const username = e.target.dataset.username;
  console.log(e);
  console.log(e.target.dataset.username);
  const profileContainer = e.target.closest(".col");
  if (e.target.innerText === "Follow") {
    // Follow:
    const userIsAdded = followUser(username);
    if (userIsAdded) {
      e.target.innerText = "Unfollow";
    }
    profileContainer.classList.add("user-isfollowed");
    // Do we need error handling?
  } else {
    // Unfollow:
    const userIsRemoved = unfollowUser(username);
    profileContainer.classList.remove("user-isfollowed");
    if (userIsRemoved) {
      e.target.innerText = "Follow";
    }
    // IF user is on own profile = hide the profile from UI.
  }
  // Update usersFollowed - Not needed?
}

export function displayProfile(profile, usersFollowed) {
  return (
    <Col className={IsFollowed(profile.name, usersFollowed) ? "user user-isfollowed" : "user"} key={profile.name} style={{ backgroundImage: `url(${profile.banner ? profile.banner : "none"})` }}>
      {/* <NavLink to={"./" + profile.name} className="user-link"> */}
      <div
        className="user__profile-imagecontainer"
        onClick={() => {
          window.location.href = `/${profile.name}`;
        }}
      >
        <img src={profile.avatar ? profile.avatar : defaultAvatar} className="user__profile-imagecontainer-img" />
      </div>

      <div className="user__profile">
        <div
          className="user__profile-details"
          onClick={() => {
            window.location.href = `/${profile.name}`;
          }}
        >
          <h3 className="user__profile-details-name">{profile.name}</h3>
          <p className="user__profile-details-email">{profile.email}</p>
        </div>
        <div className="user__profile-counts">
          <p className="user__profile-counts-detail">Posts: {profile._count.posts}</p>
          <p className="user__profile-counts-detail">Followers: {profile._count.followers}</p>
          <p className="user__profile-counts-detail">Following: {profile._count.following}</p>
        </div>
        <div className="user__profile-follow">
          <Button data-username={profile.name} size="sm" variant="success" onClick={toggleFollow}>
            {IsFollowed(profile.name, usersFollowed) ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>
      {/* </NavLink> */}
    </Col>
  );
}

export async function getUserProfile(username) {
  const getProfileApiUrl = apiBaseUrl + "/profiles/" + username + "?_following=true&_followers=true";
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    const response = await axios(getProfileApiUrl);
    if (response.status === 200) {
      console.log(response.data);
      //setUserProfile(response.data);
      return response.data;
    } else {
      console.log("Something went wrong retrieving profile");
    }
  } catch (error) {
    console.log("Retrieving profile failed: ", error);
  }
}
