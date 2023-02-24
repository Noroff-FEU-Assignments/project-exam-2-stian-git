import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { apiBaseUrl, availableEmojies } from "../constants/variables";
import SessionContext from "../context/SessionContext";

function ReactToPost(props) {
  const [loggedIn] = useContext(SessionContext);
  const [post, setPost] = useState(null);

  useEffect(() => {
    setPost(props.data);
  }, [props]);

  // Total counter:
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
  // Counts a single emoji
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

  return (
    <>
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
    </>
  );
}

export default ReactToPost;
