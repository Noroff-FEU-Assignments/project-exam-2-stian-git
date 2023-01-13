import { Button, Card, Col, ListGroup } from "react-bootstrap";

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

export function showPosts(arr) {
    return arr.map((post) => {
        //console.log(post.comments);
        return (
            <Col key={post.id}>
                <Card className="post" style={{ width: "18rem" }}>
                    {post.media ? <Card.Img variant="top" src={post.media} /> : ""}
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.body}</Card.Text>
                    </Card.Body>
                    <Card.Body>{post.reactions ? post.reactions.map((reaction) => `${reaction.symbol} ${reaction.count}`) : ""}</Card.Body>
                    <ListGroup className="list-group-flush post__comment-header">
                        <p className="post__comment-count">{post.comments ? post.comments.length : "No"} Comments </p>
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
                                  </ListGroup.Item>
                              ))
                            : ""}
                    </ListGroup>
                </Card>
            </Col>
        );
    });
}
