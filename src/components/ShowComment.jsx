import moment from "moment";
import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormatTimeStamp from "./FormatTimeStamp";

function ShowComment(props) {
  const [data, setData] = useState(null);
  const [isReply, setIsReply] = useState(false);
  const [commentRepliedTo, setCommentRepliedTo] = useState([]);

  useEffect(() => {
    // Checks if the comment is a reply to another comment.
    setData(props.commentData);
    const replyToId = props.commentData.replyToId;
    if (replyToId) {
      const originComment = props.allComments.filter((comment) => comment.id === replyToId);
      setIsReply(true);
      setCommentRepliedTo(originComment);
    }
  }, [props]);

  return (
    <ListGroup.Item
      key={data?.id}
      className="comments__body"
      data-commentid={data?.id}
      onClick={(e) => {
        const replyInfoField = document.querySelector(".replyto-message");
        document.querySelector(".replyto-message-text").innerHTML = ` ${data?.owner} - ${data?.body}`;
        replyInfoField.hidden = false;
        replyInfoField.dataset.replytoid = data?.id;
      }}>
      <p className="comments__body-writtenby" title={moment(data?.created).format("MMM Do YYYY, HH:mm:ss")}>
        {isReply ? (
          <i className="replyto-message-origin">
            Reply to: <span className="replyto-message-origin-body">{commentRepliedTo[0]?.body}</span> <span className="replyto-message-origin-author">(by {commentRepliedTo[0]?.owner})</span>
          </i>
        ) : (
          ""
        )}
        <Link
          className="comments__body-writtenby-link"
          to={`/profiles/${data?.owner}`}
          onClick={(e) => {
            e.stopPropagation();
          }}>
          {data?.owner}
        </Link>{" "}
        @ <FormatTimeStamp timestamp={data?.created} />
      </p>

      <p className="comments__body-text">
        {data?.body} <i className="fa-solid fa-reply fa-xl replyto-icon"></i>
      </p>
    </ListGroup.Item>
  );
}

export default ShowComment;
