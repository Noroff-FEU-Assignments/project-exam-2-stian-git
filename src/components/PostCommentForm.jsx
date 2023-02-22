// Add successmessage
import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { apiBaseUrl } from "../constants/variables";
import axios from "axios";

const schema = yup.object().shape({
  body: yup.string().min(3, "Need 3 characters").required("Please enter a comment before sending."),
});

function PostCommentForm(props) {
  const [isSending, setIsSending] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function addComment(data) {
    setIsSending(true);
    const addCommentApiUrl = apiBaseUrl + "/posts/" + props.id + "/comment";
    try {
      const response = await axios.post(addCommentApiUrl, data);
      if (response.status === 200) {
        console.log("Comment successfully added!");
        //Clear the input field.
        //Add a success message below the button?
      }
    } catch (error) {
      setCommentError("Commenting failed: " + error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <ListGroup.Item className="comments__form">
      <Form onSubmit={handleSubmit(addComment)}>
        <Form.Group className="" controlId={`formComment-${props.id}`}>
          <Form.Control as="textarea" placeholder="Write Comment" className="comments__form-commentfield" {...register("body")} />
          <Button variant="primary" type="submit" className="comments__form-submitbutton" data-postid={props.id}>
            Send
          </Button>
        </Form.Group>
      </Form>
    </ListGroup.Item>
  );
}

export default PostCommentForm;
