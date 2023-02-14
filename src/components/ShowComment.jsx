import moment from "moment";
import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { formatTime } from "../constants/commonLib";

function ShowComment(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    //console.log(props);
    setData(props.commentData);
  }, [props]);

  return (
    <ListGroup.Item key={data?.id} className="comments__body">
      <p className="comments__body-writtenby" title={moment(data?.created).format("MMM Do YYYY, HH:mm:ss")}>
        <a className="comments__body-writtenby-link" href={`/profiles/${data?.owner}`}>
          {data?.owner}
        </a>{" "}
        @ {formatTime(data?.created)}
      </p>
      <p className="comments__body-text">{data?.body}</p>

      {/* <p title={moment(comment.created).format("MMM Do YYYY, HH:mm:ss")}>{formatTime(comment.created)}</p> */}
    </ListGroup.Item>
  );
}

export default ShowComment;
